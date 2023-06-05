import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";

import history from "../../../config/history";
import { checkPermission } from "../../../config/utils";
import TopSlider from "../../common/components/TopSlider";
import actions from "./actions";
import ToastMsg from "../../common/ToastMessage";
import CommonTable from "../../../components/common/components/CommonTable";
import TableTopHeader from "../../../components/common/components/TableTopHeader";
import Pagination from "../../../components/common/components/Pagination";
import Portal from "../../common/components/Portal";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../../components/common/components/ConfirmationModal";
import UpdateLogbookBuildingsAndScheduleModal from "../../common/components/UpdateLogbookBuildingsAndScheduleModal";
import UpdateBuildingActivitiesAndScheduleModal from "../../common/components/UpdateBuildingActivitiesAndScheduleModal";
import { buildingTableData } from "../../../config/tableConfig";
import ViewModal from "../../common/components/ViewModal";
import ViewBuilding from "./viewBuilding";
import Form from "./buildingForm";
import UpdateUserAssignmentModal from "../../common/components/UpdateUserBuildingAssignmentModal";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buildingDataList: [],
            tableData: buildingTableData,
            showConfirmation: false,
            selectedItem: null,
            showUpdateLogbookBuildingsAndScheduleModal: false,
            showUpdateBuildingActivitiesAndScheduleModal: false,
            params: this.props.buildingReducer.entityParams.params,
            paginationParams: this.props.buildingReducer.entityParams.paginationParams,
            showViewModal: false,
            selectedBuilding: this.props.match.params.id,
            logData: {
                count: "",
                data: []
            },
            historyPaginationParams: this.props.buildingReducer.entityParams.historyPaginationParams,
            historyParams: this.props.buildingReducer.entityParams.historyParams,
            showConfirmModalLog: false,
            selectedLog: "",
            isRestoreOrDelete: "",
            showWildCardFilter: false
        };
    }

    componentDidMount = async () => {
        await this.setState({
            tableData: {
                ...this.state.tableData,
                keys: buildingTableData.keys,
                config: this.props.buildingReducer.entityParams.tableConfig || buildingTableData.config
            }
        });
        await this.getBuildingData();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.masterFilters !== this.props.masterFilters) {
            await this.getBuildingData();
        }
    };

    getBuildingData = async () => {
        this.props.setIsLoading(true);
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        const { params, paginationParams } = this.state;
        await this.props.getBuildingData({ ...params, ...master_filters });
        const { tableData } = this.state;
        if (this.props.buildingReducer.buildingData.success) {
            this.setState({
                tableData: {
                    ...tableData,
                    data: this.props.buildingReducer.buildingData.buildings
                },
                paginationParams: {
                    ...paginationParams,
                    totalCount: this.props.buildingReducer.buildingData.count,
                    totalPages: Math.ceil(this.props.buildingReducer.buildingData.count / paginationParams.perPage)
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
            selectedBuilding: id
        });
        this.togglShowConfirmation();
    };

    deleteItem = async () => {
        const { selectedBuilding } = this.state;
        this.togglShowConfirmation();
        await this.props.deleteBuilding(selectedBuilding);
        await this.getBuildingData();
        ToastMsg(this.props.buildingReducer.deleteBuildingData.message, "info");
        if (this.props.match.params.id) {
            history.push("/buildings");
        }
    };

    viewItem = async item => {
        const { tableData } = this.state;
        history.push("/building/basicdetails", {
            clientid: item.client.id,
            consultancy_id: item.consultancy.id,
            item: item,
            keys: tableData.keys,
            config: tableData.config
        });
    };

    editItem = async item => {
        history.push("/editBuilding", {
            buildingItem: item,
            client_id: item.client.id,
            consultancy_id: item.consultancy.id,
            sector_id: item.sector.id,
            campus_id: item.campus.id
        });
    };

    addItem = async () => {
        this.props.history.push("/addBuilding");
    };

    togglShowUpdateLogbookBuildingsAndScheduleModal = () => {
        const { showUpdateLogbookBuildingsAndScheduleModal } = this.state;
        this.setState({
            showUpdateLogbookBuildingsAndScheduleModal: !showUpdateLogbookBuildingsAndScheduleModal
        });
    };

    renderUpdateLogbookBuildingsAndScheduleModal = () => {
        const { showUpdateLogbookBuildingsAndScheduleModal, selectedItem } = this.state;
        if (!showUpdateLogbookBuildingsAndScheduleModal) return null;

        return (
            <Portal
                body={
                    <UpdateLogbookBuildingsAndScheduleModal
                        building_id={selectedItem}
                        onCancel={this.togglShowUpdateLogbookBuildingsAndScheduleModal}
                        onOk={this.deleteItem}
                    />
                }
                onCancel={this.togglShowUpdateLogbookBuildingsAndScheduleModal}
            />
        );
    };

    updateBuildingLogbookScheduling = async selectedItem => {
        await this.setState({
            selectedItem
        });
        this.togglShowUpdateLogbookBuildingsAndScheduleModal();
    };

    // Update Activity Building and Schedule Modal

    togglShowUpdateBuildingActivitiesAndScheduleModal = () => {
        const { showUpdateBuildingActivitiesAndScheduleModal } = this.state;
        this.setState({
            showUpdateBuildingActivitiesAndScheduleModal: !showUpdateBuildingActivitiesAndScheduleModal
        });
    };

    renderUpdateBuildingActivitiesAndScheduleModal = () => {
        const { showUpdateBuildingActivitiesAndScheduleModal, selectedItem } = this.state;
        if (!showUpdateBuildingActivitiesAndScheduleModal) return null;

        return (
            <Portal
                body={
                    <UpdateBuildingActivitiesAndScheduleModal
                        building_id={selectedItem}
                        onCancel={this.togglShowUpdateBuildingActivitiesAndScheduleModal}
                        onOk={this.deleteItem}
                    />
                }
                onCancel={this.togglShowUpdateBuildingActivitiesAndScheduleModal}
            />
        );
    };

    updateBuildingActivityScheduling = async selectedItem => {
        await this.setState({
            selectedItem
        });
        this.togglShowUpdateBuildingActivitiesAndScheduleModal();
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
        await this.getBuildingData();
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
        await this.getBuildingData();
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
        await this.getBuildingData();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.getBuildingData();
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
        await this.props.getListForCommonFilterForBuilding({ ...params, ...master_filters });
        return (this.props.buildingReducer.getListForCommonFilterResponse && this.props.buildingReducer.getListForCommonFilterResponse.list) || [];
    };

    showInfoPage = id => {
        const { history } = this.props;
        this.setState({
            selectedBuilding: id,
            infoTabsData: [
                { label: "Basic Details", path: `/building/buildinginfo/${id}/basicdetails`, key: "basicdetails" },
                { label: "Assigned Logbooks", path: `/building/buildinginfo/${id}/assignedlogbooks`, key: "assignedlogbooks" },
                { label: "Assigned Activities", path: `/building/buildinginfo/${id}/assignedactivities`, key: "assignedactivities" },
                {
                    label: "Assigned Consultancy Users",
                    path: `/building/buildinginfo/${id}/assignedconsultancy_users`,
                    key: "assignedconsultancy_users"
                },
                { label: "Assigned Client Users", path: `/building/buildinginfo/${id}/assignedclient_users`, key: "assignedclient_users" },
                { label: "Floors", path: `/building/buildinginfo/${id}/floors`, key: "floors" },
                { label: "Assets", path: `/building/buildinginfo/${id}/assets`, key: "assets" },
                { label: "Images", path: `/building/buildinginfo/${id}/images`, key: "images" },
                { label: "Form Settings", path: `/building/buildinginfo/${id}/formsettings`, key: "formsettings" }
            ]
        });
        history.push(
            `/building/buildinginfo/${id}/${this.props.match.params && this.props.match.params.tab ? this.props.match.params.tab : "basicdetails"}`
        );
    };

    getDataById = async id => {
        await this.props.getBuildingById(id);
        return this.props.buildingReducer.getBuildingByIdResponse;
    };

    showEditPage = id => {
        const { history } = this.props;
        this.setState({
            selectedBuilding: id
        });
        history.push(`/building/edit/${id}`);
    };

    showAddForm = () => {
        const { history } = this.props;
        this.setState({
            selectedBuilding: null
        });
        history.push("/building/add");
    };

    exportTable = async () => {
        const { params } = this.state;
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        await this.props.exportBuilding({
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order,
            ...master_filters
        });
    };

    getLogData = async id => {
        const { historyParams } = this.state;
        await this.props.getAllBuildingLogs(historyParams, id);
        const {
            buildingReducer: {
                getAllBuildingLogResponse: { logs, count }
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
        await this.props.deleteBuildingLog(selectedLog);
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    handleRestoreLog = async id => {
        const { selectedLog } = this.state;
        await this.props.restoreBuildingLog(id);
        await this.getBuildingData();
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
                config: buildingTableData.config
            }
        });
        this.updateEntityParams();
        await this.getBuildingData();
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
        await this.getBuildingData();
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
        await this.getBuildingData();
    };

    updateEntityParams = async () => {
        let entityParams = {
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            tableConfig: this.state.tableData.config,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams
        };
        await this.props.updateBuildingEntityParams(entityParams);
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
        await this.getBuildingData();
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
        this.getBuildingData();
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
                    <UpdateUserAssignmentModal building_id={selectedItem} onCancel={this.togglShowUpdateUserAssignmentModal} onOk={this.deleteItem} />
                }
                onCancel={this.togglShowUpdateUserAssignmentModal}
            />
        );
    };

    render() {
        // const { tableData, params, paginationParams, infoTabsData, logData, historyPaginationParams, historyParams } = this.state;
        const { tableData, params, paginationParams, infoTabsData, logData, historyPaginationParams, historyParams, showWildCardFilter } = this.state;
        const {
            match: {
                params: { section }
            },
            isLoading,
            setIsLoading
        } = this.props;

        if (!checkPermission("forms", "buildings", "view"))
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
                        ) : section === "buildinginfo" ? (
                            <ViewBuilding
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
                                updateScheduling={this.updateBuildingLogbookScheduling}
                                updateAssignActivity={this.updateBuildingActivityScheduling}
                                updateUserAssignment={this.updateUserAssignment}
                                hasLogView={checkPermission("logs", "buildings", "view")}
                                hasLogDelete={checkPermission("logs", "buildings", "delete")}
                                hasLogRestore={checkPermission("logs", "buildings", "restore")}
                                hasEdit={checkPermission("forms", "buildings", "edit")}
                                hasDelete={checkPermission("forms", "buildings", "delete")}
                                hasLogbookAssign={checkPermission("assign", "buildings", "logbooks")}
                                hasActivityAssign={checkPermission("assign", "buildings", "activities")}
                                hasUserAssign={checkPermission("assign", "buildings", "users")}
                                setIsLoading={setIsLoading}
                            />
                        ) : (
                            <>
                                <div className="list-area">
                                    <TopSlider />
                                    <div className="lst-bt-nav">
                                        <div className="table table-ara">
                                            <TableTopHeader
                                                entity={"Building"}
                                                addItem={this.showAddForm}
                                                handleGlobalSearch={this.handleGlobalSearch}
                                                globalSearchKey={this.state.params.search}
                                                resetSort={this.resetSort}
                                                tableParams={params}
                                                showViewModal={this.showViewModal}
                                                exportTable={this.exportTable}
                                                resetAllFilters={this.resetAllFilters}
                                                resetWildCardFilter={this.resetWildCardFilter}
                                                showWildCardFilter={showWildCardFilter}
                                                toggleFilter={this.toggleFilter}
                                                hasExport={checkPermission("forms", "buildings", "export")}
                                                showAddButton={checkPermission("forms", "buildings", "create")}
                                            />
                                            <div className="list-sec">
                                                <div className="table-section">
                                                    <CommonTable
                                                        viewItem={this.viewItem}
                                                        deleteItem={this.deleteItemConfirm}
                                                        editItem={this.showEditPage}
                                                        tableData={tableData}
                                                        updateScheduling={this.updateBuildingLogbookScheduling}
                                                        updateActivityScheduling={this.updateBuildingActivityScheduling}
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
                                                        isWidthAction={true}
                                                        hasActionCalendar={checkPermission("assign", "buildings", "logbooks")}
                                                        hasActionActivityScheduling={checkPermission("assign", "buildings", "activities")}
                                                        hasActionUserAssign={checkPermission("assign", "buildings", "users")}
                                                        hasEdit={checkPermission("forms", "buildings", "edit")}
                                                        hasDelete={checkPermission("forms", "buildings", "delete")}
                                                    />
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
                                </div>

                                {this.renderColumnViewHideModal()}
                            </>
                        )}
                        {this.renderConfirmationModal()}
                        {this.renderConfirmationModalLog()}
                        {this.renderUpdateLogbookBuildingsAndScheduleModal()}
                        {this.renderUpdateBuildingActivitiesAndScheduleModal()}
                        {this.renderUpdateUserAssignmentModal()}
                    </LoadingOverlay>
                </section>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { buildingReducer } = state;
    return { buildingReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(index));
