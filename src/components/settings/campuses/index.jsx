import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";

import history from "../../../config/history";
import { checkPermission } from "../../../config/utils";
import TopSlider from "../../common/components/TopSlider";
import actions from "./actions";
import ToastMsg from "../../common/ToastMessage";
import CommonTable from "../../common/components/CommonTable";
import TableTopHeader from "../../common/components/TableTopHeader";
import Pagination from "../../common/components/Pagination";
import Portal from "../../common/components/Portal";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import { campusTableData } from "./components/tableConfig";
import ViewModal from "../../common/components/ViewModal";
import ViewCampus from "./components/viewCampus";
import Form from "./components/campusForm";
import UpdateUserAssignmentModal from "../../common/components/UpdateUserCampusAssignmentModal";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            campusDataList: [],
            tableData: campusTableData,
            showConfirmation: false,
            selectedItem: null,
            params: this.props.campusReducer.entityParams.params,
            paginationParams: this.props.campusReducer.entityParams.paginationParams,
            showViewModal: false,
            selectedCampus: this.props.match.params.id,
            showViewModal: false,
            logData: {
                count: "",
                data: []
            },
            historyPaginationParams: this.props.campusReducer.entityParams.historyPaginationParams,
            historyParams: this.props.campusReducer.entityParams.historyParams,
            showConfirmModalLog: false,
            selectedLog: "",
            isRestoreOrDelete: "",
            showWildCardFilter: false,
            showUpdateUserAssignmentModal: false
        };
    }

    componentDidMount = async () => {
        await this.setState({
            tableData: {
                ...this.state.tableData,
                keys: campusTableData.keys,
                config: this.props.campusReducer.entityParams.tableConfig || campusTableData.config
            }
        });
        await this.getCampuses();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.masterFilters !== this.props.masterFilters) {
            await this.getCampuses();
        }
    };

    getCampuses = async () => {
        this.props.setIsLoading(true);
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        const { params, paginationParams } = this.state;
        await this.props.getCampuses({ ...params, ...master_filters });
        const { tableData } = this.state;
        if (this.props.campusReducer.campusData && this.props.campusReducer.campusData.success) {
            this.setState({
                tableData: {
                    ...tableData,
                    data: this.props.campusReducer.campusData.campus
                },
                paginationParams: {
                    ...paginationParams,
                    totalCount: this.props.campusReducer.campusData.count,
                    totalPages: Math.ceil(this.props.campusReducer.campusData.count / paginationParams.perPage)
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
            selectedCampus: id
        });
        this.togglShowConfirmation();
    };

    deleteItem = async () => {
        const { selectedCampus } = this.state;
        this.togglShowConfirmation();
        await this.props.deleteCampus(selectedCampus);
        await this.getCampuses();
        ToastMsg(this.props.campusReducer.deleteCampusData.message, "info");
        if (this.props.match.params.id) {
            history.push("/campuses");
        }
    };

    viewItem = async item => {
        const { tableData } = this.state;
        history.push("/campus/basicdetails", {
            client_id: item.client.id,
            consultancy_id: item.consultancy.id,
            sector_id: item.sector.id,
            item: item,
            keys: tableData.keys,
            config: tableData.config
        });
    };

    editItem = async item => {
        history.push("/editCampus", {
            campusItem: item,
            client_id: item.client.id,
            consultancy_id: item.consultancy.id,
            sector_id: item.sector.id
        });
    };

    addItem = async item => {
        history.push("/addCampus");
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
        await this.getCampuses();
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
        await this.getCampuses();
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
        await this.getCampuses();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.getCampuses();
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
                if (keyItem === "selectAll") {
                    tempConfig[item].isVisible = true;
                } else {
                    tempConfig[item].isVisible = false;
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

        return (
            <Portal
                body={
                    <ViewModal
                        keys={tableData.keys}
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
        await this.props.getListForCommonFilterForCampus({ ...params, ...master_filters });
        return (this.props.campusReducer.getListForCommonFilterResponse && this.props.campusReducer.getListForCommonFilterResponse.list) || [];
    };

    showInfoPage = id => {
        const { history } = this.props;
        this.setState({
            selectedCampus: id,
            infoTabsData: [
                { label: "Basic Details", path: `/campus/campusinfo/${id}/basicdetails`, key: "basicdetails" },
                { label: "Assigned Consultancy Users", path: `/campus/campusinfo/${id}/assignedconsultancy_users`, key: "assignedconsultancy_users" },
                { label: "Assigned Client Users", path: `/campus/campusinfo/${id}/assignedclient_users`, key: "assignedclient_users" },
                { label: "Buildings", path: `/campus/campusinfo/${id}/buildings`, key: "buildings" },
                { label: "Images", path: `/campus/campusinfo/${id}/images`, key: "images" }
            ]
        });
        history.push(
            `/campus/campusinfo/${id}/${this.props.match.params && this.props.match.params.tab ? this.props.match.params.tab : "basicdetails"}`
        );
    };

    getDataById = async id => {
        await this.props.getCampusById(id);
        return this.props.campusReducer.getCampusByIdResponse;
    };

    showEditPage = id => {
        const { history } = this.props;
        this.setState({
            selectedCampus: id
        });
        history.push(`/campus/edit/${id}`);
    };

    showAddForm = () => {
        const { history } = this.props;
        this.setState({
            selectedCampus: null
        });
        history.push("/campus/add");
    };

    exportTable = async () => {
        const { params } = this.state;
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        await this.props.exportCampus({
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order,
            ...master_filters
        });
    };

    getLogData = async id => {
        const { historyParams } = this.state;
        await this.props.getAllCampusLogs(historyParams, id);
        const {
            campusReducer: {
                getAllCampusLogResponse: { logs, count }
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
        await this.props.deleteCampusLog(selectedLog);
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    handleRestoreLog = async id => {
        const { selectedLog } = this.state;
        await this.props.restoreCampusLog(id);
        await this.getCampuses();
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
                config: campusTableData.config
            }
        });
        this.updateEntityParams();
        await this.getCampuses();
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
        await this.getCampuses();
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
        await this.getCampuses();
    };

    updateEntityParams = async () => {
        let entityParams = {
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            tableConfig: this.state.tableData.config,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams
        };
        await this.props.updateCampusEntityParams(entityParams);
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
        await this.getCampuses();
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
        this.getCampuses();
    };

    updateUserAssignment = async selectedItem => {
        await this.setState({
            selectedItem
        });
        this.togglShowUpdateUserAssignmentModal();
    };

    togglShowUpdateUserAssignmentModal = () => {
        const { showUpdateUserAssignmentModal } = this.state;
        this.setState({
            showUpdateUserAssignmentModal: !showUpdateUserAssignmentModal
        });
    };

    renderUpdateUserAssignmentModal = () => {
        const { showUpdateUserAssignmentModal, selectedItem } = this.state;
        if (!showUpdateUserAssignmentModal) return null;

        return (
            <Portal
                body={
                    <UpdateUserAssignmentModal campus_id={selectedItem} onCancel={this.togglShowUpdateUserAssignmentModal} onOk={this.deleteItem} />
                }
                onCancel={this.togglShowUpdateUserAssignmentModal}
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

        if (!checkPermission("forms", "campuses", "view"))
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
                        ) : section === "campusinfo" ? (
                            <ViewCampus
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
                                updateUserAssignment={this.updateUserAssignment}
                                hasLogView={checkPermission("logs", "campuses", "view")}
                                hasLogDelete={checkPermission("logs", "campuses", "delete")}
                                hasLogRestore={checkPermission("logs", "campuses", "restore")}
                                hasEdit={checkPermission("forms", "campuses", "edit")}
                                hasDelete={checkPermission("forms", "campuses", "delete")}
                                hasUserAssign={checkPermission("assign", "campuses", "users")}
                            />
                        ) : (
                            <>
                                <div className="list-area">
                                    <TopSlider />
                                    <div className="lst-bt-nav">
                                        <div className="table table-ara">
                                            <TableTopHeader
                                                entity={"Campus"}
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
                                                hasExport={checkPermission("forms", "campuses", "export")}
                                                showAddButton={checkPermission("forms", "campuses", "create")}
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
                                                        updateUserAssignment={this.updateUserAssignment}
                                                        hasActionUserAssign={checkPermission("assign", "campuses", "users")}
                                                        hasEdit={checkPermission("forms", "campuses", "edit")}
                                                        hasDelete={checkPermission("forms", "campuses", "delete")}
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
                        {this.renderUpdateUserAssignmentModal()}
                    </LoadingOverlay>
                </section>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { campusReducer } = state;
    return { campusReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(index));
