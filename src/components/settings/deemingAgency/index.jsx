import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";

import actions from "./actions";
import TopSlider from "../../../components/common/components/TopSlider";
import history from "../../../config/history";
import { checkPermission } from "../../../config/utils";
import ToastMsg from "../../common/ToastMessage";
import CommonTable from "../../../components/common/components/CommonTable";
import TableTopHeader from "../../../components/common/components/TableTopHeader";
import Pagination from "../../../components/common/components/Pagination";
import Portal from "../../common/components/Portal";
import ConfirmationModal from "../../../components/common/components/ConfirmationModal";
import { deemingAgencyTableData } from "../../../config/tableConfig";
import ViewModal from "../../common/components/ViewModal";
import ViewDeemingAgency from "./viewDeemingAgency";
import Form from "./deemingAgencyForm";
import UpdateFrequencyDeemingAgencyAssigmentModal from "../../../components/common/components/UpdateFrequencyDeemingAgencyAssigmentModal";
import Loader from "../../common/components/Loader";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consultancyList: [],
            tableData: deemingAgencyTableData,
            showConfirmation: false,
            selectedItem: null,
            params: this.props.deemingAgencyReducer.entityParams.params,
            paginationParams: this.props.deemingAgencyReducer.entityParams.paginationParams,
            showViewModal: false,
            selectedDeemingAgency: this.props.match.params.id,
            showViewModal: false,
            logData: {
                count: "",
                data: []
            },
            historyPaginationParams: this.props.deemingAgencyReducer.entityParams.historyPaginationParams,
            historyParams: this.props.deemingAgencyReducer.entityParams.historyParams,
            showConfirmModalLog: false,
            selectedLog: "",
            isRestoreOrDelete: "",
            showWildCardFilter: false,
            showUpdateFrequencyDeemingAgencyAssigmentModal: false
        };
    }

    componentDidMount = async () => {
        await this.setState({
            tableData: {
                ...this.state.tableData,
                keys: deemingAgencyTableData.keys,
                config: this.props.deemingAgencyReducer.entityParams.tableConfig || deemingAgencyTableData.config
            }
        });
        await this.getDeemingAgencyData();
    };

    componentDidUpdate = async prevProps => {
        if (prevProps.masterFilters !== this.props.masterFilters) {
            await this.getDeemingAgencyData();
        }
    };

    getDeemingAgencyData = async () => {
        this.props.setIsLoading(true);
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        const { params, paginationParams } = this.state;
        const { tableData } = this.state;
        await this.props.getDeemingAgency({ ...params, ...master_filters });
        if (this.props.deemingAgencyReducer.deemingAgencyData.success) {
            this.setState({
                tableData: {
                    ...tableData,
                    data: this.props.deemingAgencyReducer.deemingAgencyData.deeming_agencies
                },
                paginationParams: {
                    ...paginationParams,
                    totalCount: this.props.deemingAgencyReducer.deemingAgencyData.count,
                    totalPages: Math.ceil(this.props.deemingAgencyReducer.deemingAgencyData.count / paginationParams.perPage)
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
            selectedDeemingAgency: id
        });
        this.togglShowConfirmation();
    };

    deleteItem = async () => {
        const { selectedDeemingAgency } = this.state;
        this.togglShowConfirmation();
        await this.props.deleteDeemingAgency(selectedDeemingAgency);
        await this.getDeemingAgencyData();
        ToastMsg(this.props.deemingAgencyReducer.deleteDeemingAgencyById.message, "info");
        if (this.props.match.params.id) {
            history.push("/deeming_agencies");
        }
    };

    viewItem = async item => {
        const { tableData } = this.state;
        history.push("/deeming_agency/basicdetails", { item: item, keys: tableData.keys, config: tableData.config });
    };

    editItem = async item => {
        history.push("/editDeemingAgency", { consultancyItem: item });
    };

    addItem = async () => {
        this.props.history.push("/addDeemingAgency");
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
        await this.getDeemingAgencyData();
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
        await this.getDeemingAgencyData();
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
        await this.getDeemingAgencyData();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.getDeemingAgencyData();
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
        await this.props.getListForCommonFilterForDeemingAgency({ ...params, ...master_filters });
        return (
            (this.props.deemingAgencyReducer.getListForCommonFilterResponse && this.props.deemingAgencyReducer.getListForCommonFilterResponse.list) ||
            []
        );
    };

    showInfoPage = id => {
        const { history } = this.props;
        this.setState({
            selectedDeemingAgency: id,
            infoTabsData: [
                { label: "Basic Details", path: `/deeming_agency/deeming_agencyinfo/${id}/basicdetails`, key: "basicdetails" },
                { label: "Assigned Frequencies", path: `/deeming_agency/deeming_agencyinfo/${id}/assignedfrequencies`, key: "assignedfrequencies" }
            ]
        });
        history.push(
            `/deeming_agency/deeming_agencyinfo/${id}/${
                this.props.match.params && this.props.match.params.tab ? this.props.match.params.tab : "basicdetails"
            }`
        );
    };

    getDataById = async id => {
        await this.props.getDeemingAgencyById(id);
        return this.props.deemingAgencyReducer.getDeemingAgencyByIdResponse;
    };

    showEditPage = id => {
        const { history } = this.props;
        this.setState({
            selectedDeemingAgency: id
        });
        history.push(`/deeming_agency/edit/${id}`);
    };

    showAddForm = () => {
        const { history } = this.props;
        this.setState({
            selectedDeemingAgency: null
        });
        history.push("/deeming_agency/add");
    };

    exportTable = async () => {
        const { params } = this.state;
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        await this.props.exportDeemingAgency({
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order,
            ...master_filters
        });
    };

    getLogData = async id => {
        const { historyParams } = this.state;
        await this.props.getAllDeemingAgencyLogs(historyParams, id);
        const {
            deemingAgencyReducer: {
                getAllDeemingAgencyLogResponse: { logs, count }
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
        await this.props.deleteDeemingAgencyLog(selectedLog);
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    handleRestoreLog = async id => {
        const { selectedLog } = this.state;
        await this.props.restoreDeemingAgencyLog(id);
        await this.getDeemingAgencyData();
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
                config: deemingAgencyTableData.config
            }
        });
        this.updateEntityParams();
        await this.getDeemingAgencyData();
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
            // paginationParams: {
            //     ...this.state.paginationParams,
            //     currentPage: 0
            // }
        });
        this.updateEntityParams();
        await this.getDeemingAgencyData();
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
        await this.getDeemingAgencyData();
    };

    updateEntityParams = async () => {
        let entityParams = {
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            tableConfig: this.state.tableData.config,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams
        };
        await this.props.updateDeemingAgencyEntityParams(entityParams);
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
        await this.getActivityData();
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
        await this.getDeemingAgencyData();
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
        this.getDeemingAgencyData();
    };

    updateFrequencyAssignment = async selectedItem => {
        await this.setState({
            selectedItem
        });
        this.togglShowUpdateFrequencyDeemingAgencyAssigmentModal();
    };

    togglShowUpdateFrequencyDeemingAgencyAssigmentModal = () => {
        const { showUpdateFrequencyDeemingAgencyAssigmentModal } = this.state;
        this.setState({
            showUpdateFrequencyDeemingAgencyAssigmentModal: !showUpdateFrequencyDeemingAgencyAssigmentModal
        });
    };

    renderUpdateFrequencyDeemingAgencyAssigmentModal = () => {
        const { showUpdateFrequencyDeemingAgencyAssigmentModal, selectedItem } = this.state;
        if (!showUpdateFrequencyDeemingAgencyAssigmentModal) return null;

        return (
            <Portal
                body={
                    <UpdateFrequencyDeemingAgencyAssigmentModal
                        deeming_agency_id={selectedItem}
                        onCancel={this.togglShowUpdateFrequencyDeemingAgencyAssigmentModal}
                        onOk={this.deleteItem}
                    />
                }
                onCancel={this.togglShowUpdateFrequencyDeemingAgencyAssigmentModal}
            />
        );
    };

    render() {
        const { tableData, params, paginationParams, infoTabsData, logData, historyPaginationParams, historyParams, showWildCardFilter } = this.state;
        const {
            match: {
                params: { section }
            },
            isLoading
        } = this.props;

        if (!checkPermission("forms", "deeming_agencies", "view"))
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
                        ) : section === "deeming_agencyinfo" ? (
                            <ViewDeemingAgency
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
                                updateFrequencyAssignment={this.updateFrequencyAssignment}
                                hasLogView={checkPermission("logs", "deeming_agencies", "view")}
                                hasLogDelete={checkPermission("logs", "deeming_agencies", "delete")}
                                hasLogRestore={checkPermission("logs", "deeming_agencies", "restore")}
                                hasEdit={checkPermission("forms", "deeming_agencies", "edit")}
                                hasDelete={checkPermission("forms", "deeming_agencies", "delete")}
                                hasFrequencyAssign={checkPermission("assign", "deeming_agencies", "frequencies")}
                            />
                        ) : (
                            <>
                                <div className="list-area">
                                    <TopSlider />
                                    <div className="lst-bt-nav">
                                        <div className="table table-ara">
                                            <TableTopHeader
                                                entity={"Deeming Agency"}
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
                                                hasExport={checkPermission("forms", "deeming_agencies", "export")}
                                                showAddButton={checkPermission("forms", "deeming_agencies", "create")}
                                            />
                                            <div className="list-sec">
                                                <div className="table-section">
                                                    <CommonTable
                                                        viewItem={this.viewItem}
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
                                                        commonFilter={this.state.params.list}
                                                        updateFrequencyAssignment={this.updateFrequencyAssignment}
                                                        hasActionFrequencyAssign={checkPermission("assign", "deeming_agencies", "frequencies")}
                                                        hasEdit={checkPermission("forms", "deeming_agencies", "edit")}
                                                        hasDelete={checkPermission("forms", "deeming_agencies", "delete")}
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
                        {this.renderUpdateFrequencyDeemingAgencyAssigmentModal()}
                    </LoadingOverlay>
                </section>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { deemingAgencyReducer } = state;
    return { deemingAgencyReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(index));
