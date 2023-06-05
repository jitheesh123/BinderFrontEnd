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
import { deemingAgencyFrequencyTableData } from "../../../config/tableConfig";
import ViewModal from "../../common/components/ViewModal";
import ViewFrequency from "./viewFrequency";
import LoadingOverlay from "react-loading-overlay";
import CommonActions from "./../../common/actions";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logbookDataList: [],
            tableData: deemingAgencyFrequencyTableData,
            showConfirmation: false,
            selectedItem: null,
            params: this.props.deemingAgencyFrequencyReducer.entityParams.params,
            paginationParams: this.props.deemingAgencyFrequencyReducer.entityParams.paginationParams,
            showViewModal: false,
            selectedDeemingAgencyFrequency: this.props.match.params.id,
            showWildCardFilter: false,
            showViewModal: false,
            loading: true,
            logData: {
                count: "",
                data: []
            },
            historyPaginationParams: this.props.deemingAgencyFrequencyReducer.entityParams.historyPaginationParams,
            historyParams: this.props.deemingAgencyFrequencyReducer.entityParams.historyParams,
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
                keys: deemingAgencyFrequencyTableData.keys,
                config: this.props.deemingAgencyFrequencyReducer.entityParams.tableConfig || deemingAgencyFrequencyTableData.config
            }
        });
        await this.getDeemingAgencyFrequencyData();
    };

    componentDidUpdate = async prevProps => {
        if (
            this.props.commonReducer.frequencyDeemingAgencyApiTrigger &&
            this.props.commonReducer.frequencyDeemingAgencyApiTrigger.isTrigger == true
        ) {
            await this.props.updateFrequencyDeemingAgencyApiTrigger({ isTrigger: false });
            await this.getDeemingAgencyFrequencyData();
        }
    };

    getDeemingAgencyFrequencyData = async () => {
        const { params, paginationParams } = this.state;
        const {
            match: {
                params: { id = null }
            }
        } = this.props;
        let responseData = [];
        await this.props.getDeemingAgencyFrequency({ ...params, deeming_agency_id: id });
        responseData = this.props.deemingAgencyFrequencyReducer.deemingAgencyFrequencyData.frequencies || [];
        const { tableData } = this.state;
        if (this.props.deemingAgencyFrequencyReducer.deemingAgencyFrequencyData.success) {
            this.setState({
                tableData: {
                    ...tableData,
                    data: responseData
                },
                paginationParams: {
                    ...paginationParams,
                    totalCount: this.props.deemingAgencyFrequencyReducer.deemingAgencyFrequencyData.count,
                    totalPages: Math.ceil(this.props.deemingAgencyFrequencyReducer.deemingAgencyFrequencyData.count / paginationParams.perPage)
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
        await this.getDeemingAgencyFrequencyData();
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
            selectedDeemingAgencyFrequency: id
        });
        this.togglShowConfirmation();
    };

    deleteItem = async () => {
        const {
            match: {
                params: { section }
            }
        } = this.props;
        const { selectedDeemingAgencyFrequency } = this.state;
        this.togglShowConfirmation();
        await this.props.deleteDeemingAgencyFrequency(selectedDeemingAgencyFrequency);
        await this.getDeemingAgencyFrequencyData();
        ToastMsg(this.props.deemingAgencyFrequencyReducer.deleteDeemingAgencyFrequencyData.message, "info");
        if (section && section === "deemingAgencyFrequencyInfo") {
            history.go(-2);
        }
    };

    viewItem = async item => {
        const { tableData } = this.state;
        history.push("/logbook/basicdetails", {
            clientid: item.client.id,
            deeming_agency_id: item.consultancy.id,
            item: item,
            keys: tableData.keys,
            config: tableData.config
        });
    };

    editItem = async item => {
        history.push("/editLogbook", {
            logbookItem: item,
            deeming_agency_id: item.consultancy.id,
            client_id: item.client.id
        });
    };

    addItem = async () => {
        this.props.history.push("/adddeemingAgencyFrequency");
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
        await this.getDeemingAgencyFrequencyData();
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
        await this.getDeemingAgencyFrequencyData();
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
        await this.getDeemingAgencyFrequencyData();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.getDeemingAgencyFrequencyData();
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
            (this.props.deemingAgencyFrequencyReducer.getListForCommonFilterResponse &&
                this.props.deemingAgencyFrequencyReducer.getListForCommonFilterResponse.list) ||
            []
        );
    };

    showInfoPage = (id, path = "") => {
        const { history } = this.props;
        const currentPath = this.props.location.pathname;
        this.setState({
            selectedDeemingAgencyFrequency: id,
            infoTabsData: [
                {
                    label: "Basic Details",
                    path: `/deemingAgencyFrequency/deemingAgencyFrequencyInfo/${id}/basicdetails`,
                    key: "basicdetails"
                }
            ]
        });
        history.push(`/deemingAgencyFrequency/deemingAgencyFrequencyInfo/${id}/basicdetails`, { prevPath: path ? path : currentPath });
    };

    getDataById = async id => {
        await this.props.getDeemingAgencyFrequencyById(id);
        return this.props.deemingAgencyFrequencyReducer.getDeemingAgencyFrequencyByIdResponse;
    };

    showEditPage = id => {
        const { history } = this.props;
        const currentPath = this.props.location.pathname;
        this.setState({
            selectedDeemingAgencyFrequency: id
        });
        history.push(`/deemingAgencyFrequency/edit/${id}`, { prevPath: currentPath });
    };

    showAddForm = () => {
        const { history } = this.props;
        this.setState({
            selectedDeemingAgencyFrequency: null
        });
        history.push("/deemingAgencyFrequency/add");
    };

    exportTable = async () => {
        const { params } = this.state;
        await this.props.exportDeemingAgencyFrequency({
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order,
            deeming_agency_id: this.props.match.params.id
        });
    };

    getLogData = async id => {
        const { historyParams } = this.state;
        await this.props.getAllDeemingAgencyFrequencyLogs(historyParams, id);
        const {
            deemingAgencyFrequencyReducer: {
                getAlldeemingAgencyFrequencyLogResponse: { logs, count }
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
        await this.props.deletedeemingAgencyFrequencyLog(selectedLog);
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    handleRestoreLog = async id => {
        const { selectedLog } = this.state;
        await this.props.restoredeemingAgencyFrequencyLog(id);
        await this.getDeemingAgencyFrequencyData();
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
                perPage: 10,
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
                config: deemingAgencyFrequencyTableData.config
            }
        });
        this.updateEntityParams();
        await this.getDeemingAgencyFrequencyData();
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
        await this.getDeemingAgencyFrequencyData();
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
        await this.getDeemingAgencyFrequencyData();
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
        this.getDeemingAgencyFrequencyData();
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
                {section === "deemingAgencyFrequencyInfo" ? (
                    <ViewFrequency
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
                        hasDelete={checkPermission("assign", "deeming_agencies", "frequencies")}
                    />
                ) : (
                    <section className="cont-ara">
                        <div className="list-area">
                            <TopSlider />
                            <div className="lst-bt-nav">
                                <div className="table table-ara">
                                    <TableTopHeader
                                        entity={"Deeming Agency Frequency"}
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
                                                hasTableViewDetails={hasTableViewDetails}
                                                commonFilter={this.state.params.list}
                                                hasEdit={checkPermission("forms", "frequencies", "edit")}
                                                hasDelete={checkPermission("assign", "deeming_agencies", "frequencies")}
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
    const { deemingAgencyFrequencyReducer, commonReducer } = state;
    return { deemingAgencyFrequencyReducer, commonReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions, ...CommonActions })(index));
