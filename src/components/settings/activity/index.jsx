import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";

import TopSlider from "../../common/components/TopSlider";
import actions from "./actions";
import ToastMsg from "../../common/ToastMessage";
import history from "../../../config/history";
import { checkPermission } from "../../../config/utils";
import CommonTable from "../../../components/common/components/CommonTable";
import TableTopHeader from "../../../components/common/components/TableTopHeader";
import Pagination from "../../../components/common/components/Pagination";
import Portal from "../../common/components/Portal";
import ConfirmationModal from "../../../components/common/components/ConfirmationModal";
import { activityTableData } from "./tableConfig";
import ViewModal from "../../common/components/ViewModal";
import ViewActivity from "./viewActivity";
import Form from "./activityForm";
import UpdateActivityBuildingAndScheduleModal from "../../common/components/UpdateActivityBuildingAndScheduleModal";
import UpdateConsultancyActivityAssignmentModal from "../../common/components/UpdateConsultancyActivityAssigmentModal";
import UpdateClientActivityAssignmentModal from "../../common/components/UpdateClientActivityAssigmentModal";
import UpdateBuildingActivityAssignmentModal from "../../common/components/UpdateBuildingActivityAssignmentModal";
import UpdateProcedureAssignmentModal from "../../common/components/UpdateProcedureToActivityAssignmentModal";
import Loader from "../../common/components/Loader";
import UpdateFormToActivityAssignmentModal from "./components/UpdateFormToActivityAssignmentModal";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logbookDataList: [],
            tableData: activityTableData,
            showConfirmation: false,
            selectedItem: null,
            params: this.props.activityReducer.entityParams.params,
            paginationParams: this.props.activityReducer.entityParams.paginationParams,
            showViewModal: false,
            selectedActivity: this.props.match.params.id,
            logData: {
                count: "",
                data: []
            },
            historyPaginationParams: this.props.activityReducer.entityParams.historyPaginationParams,
            historyParams: this.props.activityReducer.entityParams.historyParams,
            showConfirmModalLog: false,
            selectedLog: "",
            isRestoreOrDelete: "",
            showUpdateActivityBuildingAndScheduleModal: false,
            showWildCardFilter: false,
            showUpdateConsultancyAssignmentModal: false,
            showUpdateClientAssignmentModal: false,
            showUpdateBuildingAssignmentModal: false,
            showUpdateProcedureAssignmentModal: false,
            showUpdateFormAssignmentModal: false
        };
    }

    componentDidMount = async () => {
        await this.setState({
            tableData: {
                ...this.state.tableData,
                keys: activityTableData.keys,
                config: this.props.activityReducer.entityParams.tableConfig || activityTableData.config
            }
        });
        await this.getActivityData();
    };

    componentDidUpdate = async prevProps => {
        if (prevProps.masterFilters !== this.props.masterFilters) {
            await this.getActivityData();
        }
    };

    getActivityData = async () => {
        this.props.setIsLoading(true);
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        const { params, paginationParams, tableData } = this.state;
        const {
            match: {
                params: { section, id }
            }
        } = this.props;

        let responseData = [];
        if (section && section === "logbookinfo") {
            await this.props.getActivityList({ ...params, logbook_id: id, ...master_filters });
            responseData = this.props.activityReducer.getActivityListResponse.activities || [];
        } else {
            await this.props.getActivityList({ ...params, ...master_filters });
            responseData = this.props.activityReducer.getActivityListResponse.activities || [];
        }
        if (this.props.activityReducer.getActivityListResponse.success) {
            this.setState({
                tableData: {
                    ...tableData,
                    data: responseData
                },
                paginationParams: {
                    ...paginationParams,
                    totalCount: this.props.activityReducer.getActivityListResponse.count,
                    totalPages: Math.ceil(this.props.activityReducer.getActivityListResponse.count / paginationParams.perPage)
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
            selectedActivity: id
        });
        this.togglShowConfirmation();
    };

    deleteItem = async () => {
        const {
            match: {
                params: { section }
            }
        } = this.props;
        let previousPath = this.props.location && this.props.location.state && this.props.location.state.prevPath;
        const { selectedActivity } = this.state;
        this.togglShowConfirmation();
        await this.props.deleteActivity(selectedActivity);

        ToastMsg(this.props.activityReducer.deleteActivityData.message, "info");
        if (section && section === "activityinfo") {
            history.push(previousPath || "/activities");
        }
        await this.getActivityData();
    };

    viewItem = async item => {
        const { tableData } = this.state;
        history.push("/activity/basicdetails", {
            clientid: item.client.id,
            consultancy_id: item.consultancy.id,
            item: item,
            keys: tableData.keys,
            config: tableData.config
        });
    };

    editItem = async item => {
        history.push("/editActivity", {
            activityItem: item,
            consultancy_id: item.consultancy.id,
            client_id: item.client.id
        });
    };

    addItem = async () => {
        this.props.history.push("/addActivity");
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
        await this.getActivityData();
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
        await this.getActivityData();
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
        await this.getActivityData();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.getActivityData();
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
        await this.props.getListForCommonFilterForActivity({ ...params, ...master_filters });
        return (this.props.activityReducer.getListForCommonFilterResponse && this.props.activityReducer.getListForCommonFilterResponse.list) || [];
    };

    showInfoPage = (id, path = "") => {
        const { history } = this.props;
        const currentPath = this.props.location.pathname;
        this.setState({
            selectedActivity: id,
            infoTabsData: [
                { label: "Basic Details", path: `/activity/activityinfo/${id}/basicdetails`, key: "basicdetails" },
                { label: "Assigned Consultancies", path: `/activity/activityinfo/${id}/assignedconsultancies`, key: "assignedconsultancies" },
                { label: "Assigned Clients", path: `/activity/activityinfo/${id}/assignedclients`, key: "assignedclients" },
                { label: "Assigned Buildings", path: `/activity/activityinfo/${id}/assignedbuildings`, key: "assignedbuildings" },
                { label: "Assigned Procedures", path: `/activity/activityinfo/${id}/assignedprocedures`, key: "assignedprocedures" },
                { label: "Assigned Forms", path: `/activity/activityinfo/${id}/assignedforms`, key: "assignedforms" },
                // { label: "Procedures", path: `/activity/activityinfo/${id}/procedures`, key: "procedures" },
                { label: "Images", path: `/activity/activityinfo/${id}/images`, key: "images" }
            ]
        });
        history.push(`/activity/activityinfo/${id}/${"basicdetails"}`, { prevPath: path ? path : currentPath });
    };

    getDataById = async id => {
        await this.props.getActivityById(id);
        return this.props.activityReducer.getActivityByIdResponse;
    };

    showEditPage = id => {
        const { history } = this.props;
        const currentPath = this.props.location.pathname;
        this.setState({
            selectedActivity: id
        });
        history.push(`/activity/edit/${id}`, { prevPath: currentPath });
    };
    showPushPage = id => {
        const { history } = this.props;
        const currentPath = this.props.location.pathname;
        this.setState({
            selectedActivity: id
        });
        history.push(`/activity/push/${id}`, { prevPath: currentPath });
    };

    showAddForm = () => {
        const { history } = this.props;
        const currentPath = this.props.location.pathname;
        this.setState({
            selectedActivity: null
        });
        history.push("/activity/add", { prevPath: currentPath });
    };

    exportTable = async () => {
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        await this.props.exportActivity({
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order,
            ...master_filters
        });
    };

    getLogData = async id => {
        const { historyParams } = this.state;
        await this.props.getAllActivityLogs(historyParams, id);
        const {
            activityReducer: {
                getAllActivityLogResponse: { logs, count }
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
        await this.props.deleteActivityLog(selectedLog);
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    handleRestoreLog = async id => {
        await this.props.restoreActivityLog(id);
        await this.getActivityData();
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

    togglShowUpdateActivityBuildingAndScheduleModal = () => {
        const { showUpdateActivityBuildingAndScheduleModal } = this.state;
        this.setState({
            showUpdateActivityBuildingAndScheduleModal: !showUpdateActivityBuildingAndScheduleModal
        });
    };

    renderUpdateActivityBuildingAndScheduleModal = () => {
        const { showUpdateActivityBuildingAndScheduleModal, selectedActivity } = this.state;
        if (!showUpdateActivityBuildingAndScheduleModal) return null;

        return (
            <Portal
                body={
                    <UpdateActivityBuildingAndScheduleModal
                        activity_id={selectedActivity}
                        onCancel={this.togglShowUpdateActivityBuildingAndScheduleModal}
                        onOk={this.deleteItem}
                    />
                }
                onCancel={this.togglShowUpdateActivityBuildingAndScheduleModal}
            />
        );
    };

    updateActivityBuildingScheduling = async selectedActivity => {
        await this.setState({
            selectedActivity
        });
        this.togglShowUpdateActivityBuildingAndScheduleModal();
    };

    resetAllFilters = async () => {
        await this.setState({
            paginationParams: {
                totalPages: 0,
                perPage: 150,
                currentPage: 0,
                totalCount: 0
            },
            params: {
                ...this.state.params,
                limit: 150,
                page: 1,
                search: "",
                filters: null,
                list: null,
                order: null
            },
            tableData: {
                ...this.state.tableData,
                config: activityTableData.config
            }
        });
        this.updateEntityParams();
        await this.getActivityData();
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
        await this.getActivityData();
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
        await this.getActivityData();
    };

    updateEntityParams = async () => {
        let entityParams = {
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            tableConfig: this.state.tableData.config,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams
        };
        await this.props.updateActivityEntityParams(entityParams);
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
        this.getActivityData();
    };

    updateConsultancyAssignment = async selectedItem => {
        await this.setState({
            selectedItem
        });
        this.togglShowUpdateConsultancyAssignmentModal();
    };

    togglShowUpdateConsultancyAssignmentModal = () => {
        const { showUpdateConsultancyAssignmentModal } = this.state;
        this.setState({
            showUpdateConsultancyAssignmentModal: !showUpdateConsultancyAssignmentModal
        });
    };

    renderUpdateConsultancyAssignmentModal = () => {
        const { showUpdateConsultancyAssignmentModal, selectedItem } = this.state;
        if (!showUpdateConsultancyAssignmentModal) return null;

        return (
            <Portal
                body={
                    <UpdateConsultancyActivityAssignmentModal activity_id={selectedItem} onCancel={this.togglShowUpdateConsultancyAssignmentModal} />
                }
                onCancel={this.togglShowUpdateConsultancyAssignmentModal}
            />
        );
    };

    updateClientAssignment = async selectedItem => {
        await this.setState({
            selectedItem
        });
        this.togglShowUpdateClientAssignmentModal();
    };

    togglShowUpdateClientAssignmentModal = () => {
        const { showUpdateClientAssignmentModal } = this.state;
        this.setState({
            showUpdateClientAssignmentModal: !showUpdateClientAssignmentModal
        });
    };

    renderUpdateClientAssignmentModal = () => {
        const { showUpdateClientAssignmentModal, selectedItem } = this.state;
        if (!showUpdateClientAssignmentModal) return null;

        return (
            <Portal
                body={<UpdateClientActivityAssignmentModal activity_id={selectedItem} onCancel={this.togglShowUpdateClientAssignmentModal} />}
                onCancel={this.togglShowUpdateClientAssignmentModal}
            />
        );
    };

    updateBuildingAssignment = async selectedItem => {
        await this.setState({
            selectedItem
        });
        this.togglShowUpdateBuildingAssignmentModal();
    };

    togglShowUpdateBuildingAssignmentModal = () => {
        const { showUpdateBuildingAssignmentModal } = this.state;
        this.setState({
            showUpdateBuildingAssignmentModal: !showUpdateBuildingAssignmentModal
        });
    };

    renderUpdateBuildingAssignmentModal = () => {
        const { showUpdateBuildingAssignmentModal, selectedItem } = this.state;
        if (!showUpdateBuildingAssignmentModal) return null;

        return (
            <Portal
                body={<UpdateBuildingActivityAssignmentModal activity_id={selectedItem} onCancel={this.togglShowUpdateBuildingAssignmentModal} />}
                onCancel={this.togglShowUpdateBuildingAssignmentModal}
            />
        );
    };

    updateProcedureAssignment = async selectedItem => {
        await this.setState({
            selectedItem
        });
        this.togglShowUpdateProcedureAssignmentModal();
    };

    togglShowUpdateProcedureAssignmentModal = () => {
        const { showUpdateProcedureAssignmentModal } = this.state;
        this.setState({
            showUpdateProcedureAssignmentModal: !showUpdateProcedureAssignmentModal
        });
    };

    renderUpdateProcedureAssignmentModal = () => {
        const { showUpdateProcedureAssignmentModal, selectedItem } = this.state;
        if (!showUpdateProcedureAssignmentModal) return null;

        return (
            <Portal
                body={<UpdateProcedureAssignmentModal activity_id={selectedItem} onCancel={this.togglShowUpdateProcedureAssignmentModal} />}
                onCancel={this.togglShowUpdateProcedureAssignmentModal}
            />
        );
    };

    updateFormAssignment = async selectedItem => {
        await this.setState({
            selectedItem
        });
        this.togglShowUpdateFormAssignmentModal();
    };

    togglShowUpdateFormAssignmentModal = () => {
        const { showUpdateFormAssignmentModal } = this.state;
        this.setState({
            showUpdateFormAssignmentModal: !showUpdateFormAssignmentModal
        });
    };

    renderUpdateFormAssignmentModal = () => {
        const { showUpdateFormAssignmentModal, selectedItem } = this.state;
        if (!showUpdateFormAssignmentModal) return null;

        return (
            <Portal
                body={<UpdateFormToActivityAssignmentModal activity_id={selectedItem} onCancel={this.togglShowUpdateFormAssignmentModal} />}
                onCancel={this.togglShowUpdateFormAssignmentModal}
            />
        );
    };

    render() {
        const { tableData, paginationParams, params, infoTabsData, logData, historyPaginationParams, historyParams, showWildCardFilter } = this.state;
        const {
            match: {
                params: { section }
            },
            hasActionColumn = true,
            hasTableViewDetails = true,
            isLoading
        } = this.props;
        if (!checkPermission("forms", "activities", "view"))
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
                        ) :
                         section === "activityinfo" ? (
                            <ViewActivity
                                keys={tableData.keys}
                                config={tableData.config}
                                infoTabsData={infoTabsData}
                                showInfoPage={this.showInfoPage}
                                getDataById={this.getDataById}
                                deleteItem={this.deleteItemConfirm}
                                showPushPage={this.showPushPage}
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
                                updateScheduling={this.updateActivityBuildingScheduling}
                                updateConsultancyAssignment={this.updateConsultancyAssignment}
                                updateClientAssignment={this.updateClientAssignment}
                                updateBuildingAssignment={this.updateBuildingAssignment}
                                hasLogView={checkPermission("logs", "activities", "view")}
                                hasLogDelete={checkPermission("logs", "activities", "delete")}
                                hasLogRestore={checkPermission("logs", "activities", "restore")}
                                hasEdit={checkPermission("forms", "activities", "edit")}
                                hasDelete={checkPermission("forms", "activities", "delete")}
                                hasConsultancyAssign={checkPermission("assign", "activities", "consultancies")}
                                hasClientAssign={checkPermission("assign", "activities", "clients")}
                                hasBuildingAssign={checkPermission("assign", "activities", "buildings")}
                                hasProcedureAssign={checkPermission("assign", "activities", "procedures")}
                                updateProcedureAssignment={this.updateProcedureAssignment}
                                updateFormAssignment={this.updateFormAssignment}
                                hasFormAssign={checkPermission("assign", "activities", "forms")}
                                // hasPush={true}
                            />
                        ) : (
                            <>
                                <div className="list-area">
                                    <TopSlider />
                                    <div className="lst-bt-nav">
                                        <div className="table table-ara">
                                            <TableTopHeader
                                                entity={"Activity"}
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
                                                hasExport={checkPermission("forms", "activities", "export")}
                                                showAddButton={checkPermission("forms", "activities", "create")}
                                            />
                                            <div className="list-sec">
                                                <div className="table-section">
                                                    <CommonTable
                                                        viewItem={this.viewItem}
                                                        deleteItem={this.deleteItemConfirm}
                                                        editItem={this.showEditPage}
                                                        pushItem={this.showPushPage}
                                                        tableData={tableData}
                                                        updateTableSortFilters={this.updateTableSortFilters}
                                                        tableParams={params}
                                                        hasSort={true}
                                                        getListForCommonFilter={this.getListForCommonFilter}
                                                        showInfoPage={this.showInfoPage}
                                                        hasActionCalendar={false}
                                                        updateScheduling={this.updateActivityBuildingScheduling}
                                                        showWildCardFilter={showWildCardFilter}
                                                        updateWildCardFilter={this.updateWildCardFilter}
                                                        updateCommonFilter={this.updateCommonFilter}
                                                        hasActionColumn={hasActionColumn}
                                                        hasTableViewDetails={hasTableViewDetails}
                                                        commonFilter={this.state.params.list}
                                                        updateConsultancyAssignment={this.updateConsultancyAssignment}
                                                        updateClientAssignment={this.updateClientAssignment}
                                                        isWidthAction={true}
                                                        updateBuildingAssignment={this.updateBuildingAssignment}
                                                        hasEdit={checkPermission("forms", "activities", "edit")}
                                                        hasDelete={checkPermission("forms", "activities", "delete")}
                                                        hasActionConsultancyAssign={checkPermission("assign", "activities", "consultancies")}
                                                        hasActionClientAssign={checkPermission("assign", "activities", "clients")}
                                                        hasActionBuildingAssign={checkPermission("assign", "activities", "buildings")}
                                                        hasActionProcedureAssign={checkPermission("assign", "activities", "procedures")}
                                                        updateProcedureAssignment={this.updateProcedureAssignment}
                                                        isActivity={true}
                                                        hasActionFormAssign={checkPermission("assign", "activities", "forms")}
                                                        updateFormAssignment={this.updateFormAssignment}
                                                        hasPush={true}
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
                        {this.renderUpdateActivityBuildingAndScheduleModal()}
                        {this.renderUpdateConsultancyAssignmentModal()}
                        {this.renderUpdateClientAssignmentModal()}
                        {this.renderUpdateBuildingAssignmentModal()}
                        {this.renderUpdateProcedureAssignmentModal()}
                        {this.renderUpdateFormAssignmentModal()}
                    </LoadingOverlay>
                </section>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { activityReducer } = state;
    return { activityReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(index));
