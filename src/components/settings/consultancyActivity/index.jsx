import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

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
import { consultancyActivityTableData } from "./components/tableConfig";
import ViewModal from "../../common/components/ViewModal";
import ViewActivity from "./components/viewActivity";
import Form from "./components/activityForm";
import UpdateActivityBuildingAndScheduleModal from "../../common/components/UpdateActivityBuildingAndScheduleModal";
import CommonActions from "./../../common/actions";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logbookDataList: [],
            tableData: consultancyActivityTableData,
            showConfirmation: false,
            selectedItem: null,
            params: this.props.consultancyActivityReducer.entityParams.params,
            paginationParams: this.props.consultancyActivityReducer.entityParams.paginationParams,
            showViewModal: false,
            selectedConsultancyActivity: this.props.match.params.id,
            logData: {
                count: "",
                data: []
            },
            historyPaginationParams: this.props.consultancyActivityReducer.entityParams.historyPaginationParams,
            historyParams: this.props.consultancyActivityReducer.entityParams.historyParams,
            showConfirmModalLog: false,
            selectedLog: "",
            isRestoreOrDelete: "",
            showUpdateActivityBuildingAndScheduleModal: false,
            showWildCardFilter: false
        };
    }

    componentDidMount = async () => {
        await this.setState({
            tableData: {
                ...this.state.tableData,
                keys: consultancyActivityTableData.keys,
                config: this.props.consultancyActivityReducer.entityParams.tableConfig || consultancyActivityTableData.config
            }
        });
        await this.getConsultancyActivityData();
    };

    componentDidUpdate = async prevProps => {
        if (this.props.commonReducer.AssignPopUpApiTrigger && this.props.commonReducer.AssignPopUpApiTrigger.isTrigger == true) {
            await this.props.updateAssignPopUpApiTrigger({ isTrigger: false });
            await this.getConsultancyActivityData();
        }
    };

    getConsultancyActivityData = async () => {
        const { params, paginationParams, tableData } = this.state;

        const {
            match: {
                params: { id = null }
            }
        } = this.props;
        let responseData = [];
        if (id) {
            await this.props.getConsultancyActivityList({ ...params, consultancy_id: id });
            responseData = this.props.consultancyActivityReducer.getConsultancyActivityListResponse.consultancy_activities || [];
        }

        if (this.props.consultancyActivityReducer.getConsultancyActivityListResponse.success) {
            this.setState({
                tableData: {
                    ...tableData,
                    data: responseData
                },
                paginationParams: {
                    ...paginationParams,
                    totalCount: this.props.consultancyActivityReducer.getConsultancyActivityListResponse.count,
                    totalPages: Math.ceil(this.props.consultancyActivityReducer.getConsultancyActivityListResponse.count / paginationParams.perPage)
                },
                showWildCardFilter: this.state.params.filters ? true : false
            });
        }
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
            selectedConsultancyActivity: id
        });
        this.togglShowConfirmation();
    };

    deleteItem = async () => {
        const {
            match: {
                params: { section }
            }
        } = this.props;
        const { selectedConsultancyActivity } = this.state;
        this.togglShowConfirmation();
        await this.props.deleteConsultancyActivity(selectedConsultancyActivity);
        await this.getConsultancyActivityData();
        ToastMsg(this.props.consultancyActivityReducer.deleteConsultancyActivityData.message, "info");
        if (section && section === "consultancyActivityInfo") {
            history.go(-2);
        }
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
        await this.getConsultancyActivityData();
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
        await this.getConsultancyActivityData();
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
        await this.getConsultancyActivityData();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.getConsultancyActivityData();
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
        const {
            match: {
                params: { id = null }
            }
        } = this.props;
        const { search, filters, list } = this.state.params;
        params.search = search;
        params.filters = filters;
        params.list = list;
        params.consultancy_id = id;
        await this.props.getListForCommonFilterForConsultancyActivity(params);
        return (
            (this.props.consultancyActivityReducer.getListForCommonFilterResponse &&
                this.props.consultancyActivityReducer.getListForCommonFilterResponse.list) ||
            []
        );
    };

    showInfoPage = id => {
        const { history } = this.props;
        this.setState({
            selectedConsultancyActivity: id,
            infoTabsData: [
                { label: "Basic Details", path: `/consultancyActivity/consultancyActivityInfo/${id}/basicdetails`, key: "basicdetails" },
                { label: "Procedures", path: `/consultancyActivity/consultancyActivityInfo/${id}/procedures`, key: "procedures" },
                { label: "Images", path: `/consultancyActivity/consultancyActivityInfo/${id}/images`, key: "images" }
            ]
        });
        history.push(`/consultancyActivity/consultancyActivityInfo/${id}/basicdetails`);
    };

    getDataById = async id => {
        await this.props.getConsultancyActivityById(id);
        return this.props.consultancyActivityReducer.getConsultancyActivityByIdResponse;
    };

    showEditPage = id => {
        const { history } = this.props;
        this.setState({
            selectedConsultancyActivity: id
        });
        history.push(`/onsultancyActivity/edit/${id}`);
    };

    showAddForm = () => {
        const { history } = this.props;
        this.setState({
            selectedConsultancyActivity: null
        });
        history.push("/consultancyActivity/add");
    };

    exportTable = async () => {
        await this.props.exportConsultancyActivity({
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order
        });
    };

    getLogData = async id => {
        const { historyParams } = this.state;
        await this.props.getAllConsultancyActivityLogs(historyParams, id);
        const {
            consultancyActivityReducer: {
                getAllConsultancyActivityLogResponse: { logs, count }
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
        await this.props.deleteConsultancyActivityLog(selectedLog);
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    handleRestoreLog = async id => {
        await this.props.restoreConsultancyActivityLog(id);
        await this.getConsultancyActivityData();
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
        const { showUpdateActivityBuildingAndScheduleModal, selectedConsultancyActivity } = this.state;
        if (!showUpdateActivityBuildingAndScheduleModal) return null;

        return (
            <Portal
                body={
                    <UpdateActivityBuildingAndScheduleModal
                        activity_id={selectedConsultancyActivity}
                        onCancel={this.togglShowUpdateActivityBuildingAndScheduleModal}
                        onOk={this.deleteItem}
                    />
                }
                onCancel={this.togglShowUpdateActivityBuildingAndScheduleModal}
            />
        );
    };

    updateActivityBuildingScheduling = async selectedConsultancyActivity => {
        await this.setState({
            selectedConsultancyActivity
        });
        this.togglShowUpdateActivityBuildingAndScheduleModal();
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
                config: consultancyActivityTableData.config
            }
        });
        this.updateEntityParams();
        await this.getConsultancyActivityData();
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
        await this.getConsultancyActivityData();
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
        await this.getConsultancyActivityData();
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
        await this.getConsultancyActivityData();
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
        this.getConsultancyActivityData();
    };

    render() {
        const { tableData, paginationParams, params, infoTabsData, logData, historyPaginationParams, historyParams, showWildCardFilter } = this.state;
        const {
            match: {
                params: { section }
            },
            hasActionColumn = true,
            hasTableViewDetails = true
        } = this.props;
        return (
            <React.Fragment>
                {section === "add" || section === "edit" ? (
                    <Form />
                ) : section === "consultancyActivityInfo" ? (
                    <ViewActivity
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
                        globalSearchKeyHistory={this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""}
                        historyPaginationParams={historyPaginationParams}
                        updateLogSortFilters={this.updateLogSortFilters}
                        historyParams={historyParams}
                        updateScheduling={this.updateActivityBuildingScheduling}
                        showTopButtons={true}
                        hasDelete={checkPermission("assign", "consultancies", "activities")}
                    />
                ) : (
                    <section className="cont-ara">
                        <div className="list-area">
                            <TopSlider />
                            <div className="lst-bt-nav">
                                <div className="table table-ara">
                                    <TableTopHeader
                                        entity={"Consultancy Activity"}
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
                                                hasActionCalendar={false}
                                                updateScheduling={this.updateActivityBuildingScheduling}
                                                showWildCardFilter={showWildCardFilter}
                                                updateWildCardFilter={this.updateWildCardFilter}
                                                updateCommonFilter={this.updateCommonFilter}
                                                hasActionColumn={hasActionColumn}
                                                hasTableViewDetails={hasTableViewDetails}
                                                hasEdit={false}
                                                commonFilter={this.state.params.list}
                                                hasDelete={checkPermission("assign", "consultancies", "activities")}
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
                    </section>
                )}
                {this.renderConfirmationModal()}
                {this.renderConfirmationModalLog()}
                {this.renderUpdateActivityBuildingAndScheduleModal()}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { consultancyActivityReducer, commonReducer } = state;
    return { consultancyActivityReducer, commonReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions, ...CommonActions })(index));
