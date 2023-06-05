import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";

import actions from "../consultancy/actions";
import TopSlider from "../../../components/common/components/TopSlider";
import history from "../../../config/history";
import { checkPermission } from "../../../config/utils";
import ToastMsg from "../../common/ToastMessage";
import CommonTable from "../../../components/common/components/CommonTable";
import TableTopHeader from "../../../components/common/components/TableTopHeader";
import Pagination from "../../../components/common/components/Pagination";
import Portal from "../../common/components/Portal";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../../components/common/components/ConfirmationModal";
import { consultancyTableData } from "./components/tableConfig";
import ViewModal from "../../common/components/ViewModal";
import ViewConsultancy from "./components/viewConsultancy";
import Form from "./consultancyForm";
import UpdateLogbookConsultancyAssigmentModal from "../../common/components/UpdateLogbookConsultancyAssigmentModal";
import UpdateActivityConsultancyAssigmentModal from "../../common/components/UpdateActivityConsultancyAssigmentModal";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consultancyList: [],
            tableData: consultancyTableData,
            showConfirmation: false,
            selectedItem: null,
            params: this.props.consultancyReducer.entityParams.params,
            paginationParams: this.props.consultancyReducer.entityParams.paginationParams,
            showViewModal: false,
            selectedConsultancy: this.props.match.params.id,
            logData: {
                count: "",
                data: []
            },
            historyPaginationParams: this.props.consultancyReducer.entityParams.historyPaginationParams,
            historyParams: this.props.consultancyReducer.entityParams.historyParams,
            showConfirmModalLog: false,
            selectedLog: "",
            isRestoreOrDelete: "",
            showWildCardFilter: false,
            showUpdateLogbookConsultancyAssigmentModal: false
        };
    }

    componentDidMount = async () => {
        await this.setState({
            tableData: {
                ...this.state.tableData,
                keys: consultancyTableData.keys,
                config: this.props.consultancyReducer.entityParams.tableConfig || consultancyTableData.config
            }
        });
        await this.getConsultancies();
    };

    componentDidUpdate = async prevProps => {
        if (prevProps.masterFilters !== this.props.masterFilters) {
            await this.getConsultancies();
        }
    };

    getConsultancies = async () => {
        this.props.setIsLoading(true);
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        const { params, paginationParams } = this.state;
        const { tableData } = this.state;
        await this.props.getConsultancies({ ...params, ...master_filters });
        if (this.props.consultancyReducer.consultanciesData.success) {
            this.setState({
                tableData: {
                    ...tableData,
                    data: this.props.consultancyReducer.consultanciesData.consultancies
                },
                paginationParams: {
                    ...paginationParams,
                    totalCount: this.props.consultancyReducer.consultanciesData.count,
                    totalPages: Math.ceil(this.props.consultancyReducer.consultanciesData.count / paginationParams.perPage)
                },
                showWildCardFilter: this.state.params.filters ? true : false
            });
        }
        this.props.setIsLoading(false);
    };

    togglShowConfirmation = () => {
        const { showConfirmation } = this.state;
        this.setState({
            showConfirmation: !showConfirmation
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmation } = this.state;
        if (!showConfirmation) return null;

        return (
            <Portal
                body={
                    <ConfirmationModal
                        onCancel={this.togglShowConfirmation}
                        onOk={this.deleteItem}
                        heading={"Do you want to delete ?"}
                        paragraph={"This action cannot be reverted, are you sure that you need to delete this item ?"}
                    />
                }
                onCancel={this.toggleShowFrequencyModal}
            />
        );
    };

    deleteItemConfirm = async id => {
        await this.setState({
            selectedConsultancy: id
        });
        this.togglShowConfirmation();
    };

    deleteItem = async () => {
        const { selectedConsultancy } = this.state;
        this.togglShowConfirmation();
        await this.props.deleteConsultancy(selectedConsultancy);
        await this.getConsultancies();
        ToastMsg(this.props.consultancyReducer.deleteConsultancyById.message, "info");
        if (this.props.match.params.id) {
            history.push("/consultancies");
        }
    };

    editItem = async item => {
        history.push("/editConsultancy", { consultancyItem: item });
    };

    addItem = async () => {
        this.props.history.push("/addConsultancy");
    };

    handleGlobalSearch = async search => {
        const { params } = this.state;
        await this.setState({
            params: {
                ...params,
                page: 1,
                search
            }
        });
        this.updateEntityParams();
        await this.getConsultancies();
    };

    handlePageClick = async page => {
        const { paginationParams, params } = this.state;
        await this.setState({
            paginationParams: {
                ...paginationParams,
                currentPage: page.selected
            },
            params: {
                ...params,
                page: page.selected + 1
            }
        });
        this.updateEntityParams();
        await this.getConsultancies();
    };

    updateTableSortFilters = async searchKey => {
        if (this.state.params.order) {
            await this.setState({
                params: {
                    ...this.state.params,
                    order: {
                        ...this.state.params.order,
                        [searchKey]: this.state.params.order[searchKey] === "desc" ? "asc" : "desc"
                    }
                }
            });
        } else {
            await this.setState({
                params: {
                    ...this.state.params,
                    order: { [searchKey]: "asc" }
                }
            });
        }
        this.updateEntityParams();
        await this.getConsultancies();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.getConsultancies();
    };

    showViewModal = () => {
        this.setState({
            showViewModal: true
        });
    };

    handleHideColumn = async keyItem => {
        if (keyItem !== "selectAll" && keyItem !== "deselectAll") {
            await this.setState({
                tableData: {
                    ...this.state.tableData,
                    config: {
                        ...this.state.tableData.config,
                        [keyItem]: {
                            ...this.state.tableData.config[keyItem],
                            isVisible: !this.state.tableData.config[keyItem].isVisible
                        }
                    }
                }
            });
        } else {
            let tempConfig = this.state.tableData.config;
            this.state.tableData.keys.map(item => {
                if (item !== "image") {
                    if (keyItem === "selectAll") {
                        tempConfig[item].isVisible = true;
                    } else {
                        tempConfig[item].isVisible = false;
                    }
                }
            });
            await this.setState({
                tableData: {
                    ...this.state.tableData,
                    config: tempConfig
                }
            });
        }
        this.updateEntityParams();
        return true;
    };

    renderColumnViewHideModal = () => {
        const { showViewModal, tableData } = this.state;
        if (!showViewModal) return null;
        let tempKeys = tableData.keys.filter(item => item !== "image");
        return (
            <Portal
                body={
                    <ViewModal
                        keys={tempKeys}
                        config={tableData.config}
                        handleHideColumn={this.handleHideColumn}
                        onCancel={() => this.setState({ showViewModal: false })}
                    />
                }
                onCancel={() => this.setState({ showViewModal: false })}
            />
        );
    };

    getListForCommonFilter = async params => {
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        const { search, filters, list } = this.state.params;
        params.search = search;
        params.filters = filters;
        params.list = list;
        await this.props.getListForCommonFilterForConsultancy({ ...params, ...master_filters });
        return (
            (this.props.consultancyReducer.getListForCommonFilterResponse && this.props.consultancyReducer.getListForCommonFilterResponse.list) || []
        );
    };

    showInfoPage = id => {
        const { history } = this.props;
        this.setState({
            selectedConsultancy: id,
            infoTabsData: [
                { label: "Basic Details", path: `/consultancy/consultancyinfo/${id}/basicdetails`, key: "basicdetails" },
                { label: "Assigned Logbooks", path: `/consultancy/consultancyinfo/${id}/assignedlogbooks`, key: "assignedlogbooks" },
                { label: "Assigned Activities", path: `/consultancy/consultancyinfo/${id}/assignedactivities`, key: "assignedactivities" }
            ]
        });
        history.push(
            `/consultancy/consultancyinfo/${id}/${
                this.props.match.params && this.props.match.params.tab ? this.props.match.params.tab : "basicdetails"
            }`
        );
    };

    getDataById = async id => {
        await this.props.getConsultancyById(id);
        return this.props.consultancyReducer.getConsultancyByIdResponse;
    };

    showEditPage = id => {
        const { history } = this.props;
        this.setState({
            selectedConsultancy: id
        });
        history.push(`/consultancy/edit/${id}`);
    };

    showAddForm = () => {
        const { history } = this.props;
        this.setState({
            selectedConsultancy: null
        });
        history.push("/consultancy/add");
    };

    exportTable = async () => {
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        await this.props.exportConsultancy({
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order,
            ...master_filters
        });
    };

    getLogData = async id => {
        const { historyParams } = this.state;
        await this.props.getAllConsultancyLogs(historyParams, id);
        const {
            consultancyReducer: {
                getAllConsultancyLogResponse: { logs, count }
            }
        } = this.props;
        await this.setState({
            logData: {
                ...this.state.logData,
                data: logs
            },
            historyPaginationParams: {
                ...this.state.historyPaginationParams,
                totalCount: count,
                totalPages: Math.ceil(count / this.state.historyPaginationParams.perPage)
            }
        });
    };

    handleDeleteLog = async (id, choice) => {
        await this.setState({
            showConfirmModalLog: true,
            selectedLog: id,
            isRestoreOrDelete: choice
        });
    };

    renderConfirmationModalLog = () => {
        const { showConfirmModalLog, isRestoreOrDelete } = this.state;
        if (!showConfirmModalLog) return null;
        if (isRestoreOrDelete === "delete") {
            return (
                <Portal
                    body={
                        <ConfirmationModal
                            heading={"Do you want to delete this log?"}
                            paragraph={"This action cannot be reverted, are you sure that you need to delete this item?"}
                            onCancel={() => this.setState({ showConfirmModalLog: false })}
                            onOk={this.deleteLogOnConfirm}
                        />
                    }
                    onCancel={() => this.setState({ showConfirmModalLog: false })}
                />
            );
        }
    };

    deleteLogOnConfirm = async () => {
        const { selectedLog } = this.state;
        await this.props.deleteConsultancyLog(selectedLog);
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    handleRestoreLog = async id => {
        await this.props.restoreConsultancyLog(id);
        await this.getConsultancies();
    };

    handlePageClickHistory = async page => {
        const { historyPaginationParams, historyParams } = this.state;
        await this.setState({
            historyPaginationParams: {
                ...historyPaginationParams,
                currentPage: page.selected
            },
            historyParams: {
                ...historyParams,
                page: page.selected + 1
            }
        });
        await this.getLogData(this.props.match.params.id);
    };

    handleGlobalSearchHistory = async search => {
        const { historyParams, historyPaginationParams } = this.state;
        await this.setState({
            historyParams: {
                ...historyParams,
                page: 1,
                search
            },
            historyPaginationParams: {
                ...historyPaginationParams,
                currentPage: 0
            }
        });
        await this.getLogData(this.props.match.params.id);
    };

    updateLogSortFilters = async searchKey => {
        if (this.state.historyParams.order) {
            await this.setState({
                historyParams: {
                    ...this.state.historyParams,
                    order: {
                        ...this.state.historyParams.order,
                        [searchKey]: this.state.historyParams.order[searchKey] === "desc" ? "asc" : "desc"
                    }
                }
            });
        } else {
            await this.setState({
                historyParams: {
                    ...this.state.historyParams,
                    order: { [searchKey]: "asc" }
                }
            });
        }
        await this.getLogData(this.props.match.params.id);
    };

    resetAllFilters = async () => {
        await this.setState({
            paginationParams: {
                totalPages: 0,
                perPage: 40,
                currentPage: 0,
                totalCount: 0
            },
            params: {
                ...this.state.params,
                limit: 40,
                page: 1,
                search: "",
                filters: null,
                list: null,
                order: null
            },
            tableData: {
                ...this.state.tableData,
                config: consultancyTableData.config
            }
        });
        this.updateEntityParams();
        await this.getConsultancies();
    };

    toggleFilter = () => {
        this.setState({
            showWildCardFilter: !this.state.showWildCardFilter
        });
    };

    updateWildCardFilter = async newFilter => {
        await this.setState({
            params: {
                ...this.state.params,
                offset: 0,
                filters: newFilter
            }
        });
        this.updateEntityParams();
        await this.getConsultancies();
    };

    resetWildCardFilter = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                filters: null,
                list: null,
                search: ""
            }
        });
        this.updateEntityParams();
        await this.getConsultancies();
    };

    updateEntityParams = async () => {
        let entityParams = {
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            tableConfig: this.state.tableData.config,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams
        };
        await this.props.updateConsultancyEntityParams(entityParams);
    };

    handlePerPageChange = async e => {
        const { paginationParams } = this.state;
        await this.setState({
            paginationParams: {
                ...paginationParams,
                perPage: e.target.value,
                currentPage: 0
            },
            params: {
                ...this.state.params,
                page: 1,
                limit: e.target.value
            }
        });
        await this.getConsultancies();
    };

    updateCommonFilter = async commonFilters => {
        await this.setState({
            params: {
                ...this.state.params,
                page: 1,
                list: commonFilters
            },
            paginationParams: {
                ...this.state.paginationParams,
                currentPage: 0
            }
        });
        this.updateEntityParams();
        this.getConsultancies();
    };

    togglShowUpdateLogbookConsultancyAssigmentModal = () => {
        const { showUpdateLogbookConsultancyAssigmentModal } = this.state;
        this.setState({
            showUpdateLogbookConsultancyAssigmentModal: !showUpdateLogbookConsultancyAssigmentModal
        });
    };

    togglShowUpdateActivityConsultancyAssigmentModal = () => {
        const { showUpdateActivityConsultancyAssigmentModal } = this.state;
        this.setState({
            showUpdateActivityConsultancyAssigmentModal: !showUpdateActivityConsultancyAssigmentModal
        });
    };

    renderUpdateLogbookConsultancyAssigmentModal = () => {
        const { showUpdateLogbookConsultancyAssigmentModal, selectedItem } = this.state;
        if (!showUpdateLogbookConsultancyAssigmentModal) return null;

        return (
            <Portal
                body={
                    <UpdateLogbookConsultancyAssigmentModal
                        consultancy_id={selectedItem}
                        onCancel={this.togglShowUpdateLogbookConsultancyAssigmentModal}
                        onOk={this.deleteItem}
                    />
                }
                onCancel={this.togglShowUpdateLogbookConsultancyAssigmentModal}
            />
        );
    };

    renderUpdateActivityConsultancyAssigmentModal = () => {
        const { showUpdateActivityConsultancyAssigmentModal, selectedItem } = this.state;
        if (!showUpdateActivityConsultancyAssigmentModal) return null;

        return (
            <Portal
                body={
                    <UpdateActivityConsultancyAssigmentModal
                        consultancy_id={selectedItem}
                        onCancel={this.togglShowUpdateActivityConsultancyAssigmentModal}
                        onOk={this.deleteItem}
                    />
                }
                onCancel={this.togglShowUpdateActivityConsultancyAssigmentModal}
            />
        );
    };

    updateLogbookAssignment = async selectedItem => {
        await this.setState({
            selectedItem
        });
        this.togglShowUpdateLogbookConsultancyAssigmentModal();
    };

    updateActivityAssignment = async selectedItem => {
        await this.setState({
            selectedItem
        });
        this.togglShowUpdateActivityConsultancyAssigmentModal();
    };

    render() {
        const { tableData, params, paginationParams, infoTabsData, logData, historyPaginationParams, historyParams, showWildCardFilter } = this.state;
        const {
            match: {
                params: { section }
            },
            isLoading
        } = this.props;

        if (!checkPermission("forms", "consultancies", "view"))
            return (
                <section className="cont-ara">
                    <div className="list-area">
                        <TopSlider />
                        <div className="lst-bt-nav"></div>
                    </div>
                </section>
            );

        return (
            <React.Fragment>
                <section className="cont-ara">
                    <LoadingOverlay active={isLoading} spinner={<Loader />}>
                        {section === "add" || section === "edit" ? (
                            <Form />
                        ) : section === "consultancyinfo" ? (
                            <ViewConsultancy
                                keys={tableData.keys}
                                config={tableData.config}
                                infoTabsData={infoTabsData}
                                showInfoPage={this.showInfoPage}
                                getDataById={this.getDataById}
                                deleteItem={this.deleteItemConfirm}
                                showEditPage={this.showEditPage}
                                getLogData={this.getLogData}
                                logData={logData}
                                handleDeleteLog={this.handleDeleteLog}
                                HandleRestoreLog={this.handleRestoreLog}
                                handlePageClickHistory={this.handlePageClickHistory}
                                handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                                globalSearchKeyHistory={
                                    this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""
                                }
                                historyPaginationParams={historyPaginationParams}
                                updateLogSortFilters={this.updateLogSortFilters}
                                historyParams={historyParams}
                                updateAssignment={this.updateLogbookAssignment}
                                updateAssignActivity={this.updateActivityAssignment}
                                hasLogView={checkPermission("logs", "consultancies", "view")}
                                hasLogDelete={checkPermission("logs", "consultancies", "delete")}
                                hasLogRestore={checkPermission("logs", "consultancies", "restore")}
                                hasEdit={checkPermission("forms", "consultancies", "edit")}
                                hasDelete={checkPermission("forms", "consultancies", "delete")}
                                hasLogbookAssign={checkPermission("assign", "consultancies", "logbooks")}
                                hasActivityAssign={checkPermission("assign", "consultancies", "activities")}
                            />
                        ) : (
                            <>
                                <div className="list-area">
                                    <TopSlider />
                                    <div className="lst-bt-nav">
                                        <div className="table table-ara">
                                            <TableTopHeader
                                                entity={"Consultancy"}
                                                addItem={this.showAddForm}
                                                handleGlobalSearch={this.handleGlobalSearch}
                                                globalSearchKey={this.state.params.search}
                                                resetSort={this.resetSort}
                                                tableParams={params}
                                                showViewModal={this.showViewModal}
                                                exportTable={this.exportTable}
                                                resetAllFilters={this.resetAllFilters}
                                                toggleFilter={this.toggleFilter}
                                                showWildCardFilter={showWildCardFilter}
                                                resetWildCardFilter={this.resetWildCardFilter}
                                                hasExport={checkPermission("forms", "consultancies", "export")}
                                                showAddButton={checkPermission("forms", "consultancies", "create")}
                                            />
                                            <div className="list-sec">
                                                <div className="table-section">
                                                    <CommonTable
                                                        deleteItem={this.deleteItemConfirm}
                                                        editItem={this.showEditPage}
                                                        tableData={tableData}
                                                        updateTableSortFilters={this.updateTableSortFilters}
                                                        tableParams={params}
                                                        hasSort={true}
                                                        getListForCommonFilter={this.getListForCommonFilter}
                                                        showInfoPage={this.showInfoPage}
                                                        showWildCardFilter={showWildCardFilter}
                                                        updateWildCardFilter={this.updateWildCardFilter}
                                                        updateCommonFilter={this.updateCommonFilter}
                                                        updateAssignment={this.updateLogbookAssignment}
                                                        commonFilter={this.state.params.list}
                                                        updateActivityAssignment={this.updateActivityAssignment}
                                                        hasActionAssign={checkPermission("assign", "consultancies", "logbooks")}
                                                        hasActionActivityAssign={checkPermission("assign", "consultancies", "activities")}
                                                        hasEdit={checkPermission("forms", "consultancies", "edit")}
                                                        hasDelete={checkPermission("forms", "consultancies", "delete")}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <Pagination
                                            paginationParams={paginationParams}
                                            handlePageClick={this.handlePageClick}
                                            handlePerPageChange={this.handlePerPageChange}
                                            isRecordPerPage={true}
                                        />
                                    </div>
                                </div>
                                {this.renderColumnViewHideModal()}
                            </>
                        )}
                        {this.renderConfirmationModal()}
                        {this.renderConfirmationModalLog()}
                        {this.renderUpdateLogbookConsultancyAssigmentModal()}
                        {this.renderUpdateActivityConsultancyAssigmentModal()}
                    </LoadingOverlay>
                </section>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { consultancyReducer } = state;
    return { consultancyReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(index));
