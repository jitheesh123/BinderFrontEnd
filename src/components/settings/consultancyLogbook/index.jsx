import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";

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
import { consultancyLogbookTableData } from "./components/tableConfig";
import ViewModal from "../../common/components/ViewModal";
import ViewLogbook from "./components/viewLogbook";
import Form from "./components/logbookForm";
import CommonActions from "./../../common/actions";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logbookDataList: [],
            tableData: consultancyLogbookTableData,
            showConfirmation: false,
            selectedItem: null,
            params: this.props.consultancyLogbookReducer.entityParams.params,
            paginationParams: this.props.consultancyLogbookReducer.entityParams.paginationParams,
            showViewModal: false,
            selectedConsultancyLogbook: this.props.match.params.id,
            showWildCardFilter: false,
            showViewModal: false,
            loading: true,
            logData: {
                count: "",
                data: []
            },
            historyPaginationParams: this.props.consultancyLogbookReducer.entityParams.historyPaginationParams,
            historyParams: this.props.consultancyLogbookReducer.entityParams.historyParams,
            showConfirmModalLog: false,
            selectedLog: "",
            isRestoreOrDelete: "",
            selectedConsultancy: props.match.params.id
        };
    }

    componentDidMount = async () => {
        await this.setState({
            tableData: {
                ...this.state.tableData,
                keys: consultancyLogbookTableData.keys,
                config: this.props.consultancyLogbookReducer.entityParams.tableConfig || consultancyLogbookTableData.config
            }
        });
        await this.getConsultancyLogbookData();
    };

    componentDidUpdate = async prevProps => {
        if (this.props.commonReducer.AssignPopUpApiTrigger && this.props.commonReducer.AssignPopUpApiTrigger.isTrigger == true) {
            await this.props.updateAssignPopUpApiTrigger({ isTrigger: false });
            await this.getConsultancyLogbookData();
        }
    };

    getConsultancyLogbookData = async () => {
        const { params, paginationParams } = this.state;
        const {
            match: {
                params: { id = null }
            }
        } = this.props;
        let responseData = [];
        await this.props.getConsultancyLogbook({ ...params, consultancy_id: id });
        responseData = this.props.consultancyLogbookReducer.consultancyLogbookData.consultancy_logbooks || [];
        const { tableData } = this.state;
        if (this.props.consultancyLogbookReducer.consultancyLogbookData.success) {
            this.setState({
                tableData: {
                    ...tableData,
                    data: responseData
                },
                paginationParams: {
                    ...paginationParams,
                    totalCount: this.props.consultancyLogbookReducer.consultancyLogbookData.count,
                    totalPages: Math.ceil(this.props.consultancyLogbookReducer.consultancyLogbookData.count / paginationParams.perPage)
                },
                showWildCardFilter: this.state.params.filters ? true : false
            });
        }
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
        await this.getConsultancyLogbookData();
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
            selectedConsultancyLogbook: id
        });
        this.togglShowConfirmation();
    };

    deleteItem = async () => {
        const {
            match: {
                params: { section }
            }
        } = this.props;
        const { selectedConsultancyLogbook } = this.state;
        this.togglShowConfirmation();
        await this.props.deleteConsultancyLogbook(selectedConsultancyLogbook);
        await this.getConsultancyLogbookData();
        ToastMsg(this.props.consultancyLogbookReducer.deleteConsultancyLogbookData.message, "info");
        if (section && section === "consultancyLogbookInfo") {
            history.go(-2);
        }
    };

    viewItem = async item => {
        const { tableData } = this.state;
        history.push("/logbook/basicdetails", {
            clientid: item.client.id,
            consultancy_id: item.consultancy.id,
            item: item,
            keys: tableData.keys,
            config: tableData.config
        });
    };

    editItem = async item => {
        history.push("/editLogbook", {
            logbookItem: item,
            consultancy_id: item.consultancy.id,
            client_id: item.client.id
        });
    };

    addItem = async () => {
        this.props.history.push("/addConsultancyLogbook");
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
        await this.getConsultancyLogbookData();
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
        await this.getConsultancyLogbookData();
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
        await this.getConsultancyLogbookData();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.getConsultancyLogbookData();
    };

    toggleFilter = () => {
        this.setState({
            showWildCardFilter: !this.state.showWildCardFilter
        });
    };

    showViewModal = () => {
        this.setState({
            showViewModal: true
        });
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

    getListForCommonFilter = async params => {
        const { search, filters, list } = this.state.params;
        params.search = search;
        params.filters = filters;
        params.list = list;
        await this.props.getListForCommonFilterForLogbook(params);
        return (
            (this.props.consultancyLogbookReducer.getListForCommonFilterResponse &&
                this.props.consultancyLogbookReducer.getListForCommonFilterResponse.list) ||
            []
        );
    };

    showInfoPage = id => {
        const { history } = this.props;
        this.setState({
            selectedConsultancyLogbook: id,
            infoTabsData: [
                {
                    label: "Basic Details",
                    path: `/consultancyLogbook/consultancyLogbookInfo/${id}/basicdetails`,
                    key: "basicdetails"
                },
                { label: "Activities", path: `/consultancyLogbook/consultancyLogbookInfo/${id}/activities`, key: "activities" },
                { label: "Images", path: `/consultancyLogbook/consultancyLogbookInfo/${id}/images`, key: "images" }
            ]
        });
        history.push(`/consultancyLogbook/consultancyLogbookInfo/${id}/basicdetails`);
    };

    getDataById = async id => {
        await this.props.getConsultancyLogbookById(id);
        return this.props.consultancyLogbookReducer.getConsultancyLogbookByIdResponse;
    };

    showEditPage = id => {
        const { history } = this.props;
        this.setState({
            selectedConsultancyLogbook: id
        });
        history.push(`/consultancyLogbook/edit/${id}`);
    };

    showAddForm = () => {
        const { history } = this.props;
        this.setState({
            selectedConsultancyLogbook: null
        });
        history.push("/consultancyLogbook/add");
    };

    exportTable = async () => {
        const { params } = this.state;
        await this.props.exportConsultancyLogbook({
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order,
            consultancy_id: this.props.match.params.id
        });
    };

    getLogData = async id => {
        const { historyParams } = this.state;
        await this.props.getAllConsultancyLogbookLogs(historyParams, id);
        const {
            consultancyLogbookReducer: {
                getAllConsultancyLogbookLogResponse: { logs, count }
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
        await this.props.deleteConsultancyLogbookLog(selectedLog);
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    handleRestoreLog = async id => {
        const { selectedLog } = this.state;
        await this.props.restoreConsultancyLogbookLog(id);
        await this.getConsultancyLogbookData();
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
                config: consultancyLogbookTableData.config
            }
        });
        this.updateEntityParams();
        await this.getConsultancyLogbookData();
    };

    resetWildCardFilter = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                filters: null,
                list: null,
                search: ""
            }
            // showWildCardFilter:false
        });
        this.updateEntityParams();
        await this.getConsultancyLogbookData();
    };

    updateEntityParams = async () => {
        let entityParams = {
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            tableConfig: this.state.tableData.config,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams
        };
        await this.props.updateLogbookEntityParams(entityParams);
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
        await this.getConsultancyLogbookData();
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
        this.getConsultancyLogbookData();
    };

    render() {
        const { tableData, params, paginationParams, infoTabsData, showWildCardFilter, logData, historyPaginationParams, historyParams } = this.state;
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
                ) : section === "consultancyLogbookInfo" ? (
                    <ViewLogbook
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
                        showTopButtons={true}
                        hasDelete={checkPermission("assign", "consultancies", "logbooks")}
                    />
                ) : (
                    <section className="cont-ara">
                        <div className="list-area">
                            <TopSlider />
                            <div className="lst-bt-nav">
                                <div className="table table-ara">
                                    <TableTopHeader
                                        entity={"Consultancy Logbook"}
                                        addItem={this.showAddForm}
                                        handleGlobalSearch={this.handleGlobalSearch}
                                        globalSearchKey={this.state.params.search}
                                        resetSort={this.resetSort}
                                        tableParams={params}
                                        showViewModal={this.showViewModal}
                                        exportTable={this.exportTable}
                                        toggleFilter={this.toggleFilter}
                                        showWildCardFilter={showWildCardFilter}
                                        resetAllFilters={this.resetAllFilters}
                                        resetWildCardFilter={this.resetWildCardFilter}
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
                                                showWildCardFilter={showWildCardFilter}
                                                updateWildCardFilter={this.updateWildCardFilter}
                                                getListForCommonFilter={this.getListForCommonFilter}
                                                showInfoPage={this.showInfoPage}
                                                exportTable={this.exportTable}
                                                updateCommonFilter={this.updateCommonFilter}
                                                hasEdit={false}
                                                hasTableViewDetails={hasTableViewDetails}
                                                commonFilter={this.state.params.list}
                                                hasDelete={checkPermission("assign", "consultancies", "logbooks")}
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
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { consultancyLogbookReducer, commonReducer } = state;
    return { consultancyLogbookReducer, commonReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions, ...CommonActions })(index));
