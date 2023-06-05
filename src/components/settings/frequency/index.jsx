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
import { frquencyTableData } from "../../../config/tableConfig";
import ViewModal from "../../common/components/ViewModal";
import ViewFrequency from "./viewFrequency";
import Form from "./frequencyForm";
import UpdateDeemingAgencyFrequencyAssigmentModal from "../../common/components/UpdateDeemingAgencyFrequencyAssigmentModal";
import Loader from "../../common/components/Loader";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consultancyList: [],
            tableData: frquencyTableData,
            showConfirmation: false,
            selectedItem: null,
            params: this.props.frequencyReducer.entityParams.params,
            paginationParams: this.props.frequencyReducer.entityParams.paginationParams,
            showViewModal: false,
            selectedFrequency: this.props.match.params.id,
            showViewModal: false,
            logData: {
                count: "",
                data: []
            },
            historyPaginationParams: this.props.frequencyReducer.entityParams.historyPaginationParams,
            historyParams: this.props.frequencyReducer.entityParams.historyParams,
            showConfirmModalLog: false,
            selectedLog: "",
            isRestoreOrDelete: "",
            showWildCardFilter: false,
            showUpdateDeemingAgencyFrequencyAssigmentModal: false
        };
    }

    componentDidMount = async () => {
        await this.setState({
            tableData: {
                ...this.state.tableData,
                keys: frquencyTableData.keys,
                config: this.props.frequencyReducer.entityParams.tableConfig || frquencyTableData.config
            }
        });
        await this.getFrequencyData();
    };

    componentDidUpdate = async prevProps => {
        if (prevProps.masterFilters !== this.props.masterFilters) {
            await this.getFrequencyData();
        }
    };

    getFrequencyData = async () => {
        this.props.setIsLoading(true);
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        const { params, paginationParams } = this.state;
        const { tableData } = this.state;
        await this.props.getFrequency({ ...params, ...master_filters });
        if (this.props.frequencyReducer.frequencyData.success) {
            this.setState({
                tableData: {
                    ...tableData,
                    data: this.props.frequencyReducer.frequencyData.frequencies
                },
                paginationParams: {
                    ...paginationParams,
                    totalCount: this.props.frequencyReducer.frequencyData.count,
                    totalPages: Math.ceil(this.props.frequencyReducer.frequencyData.count / paginationParams.perPage)
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
            selectedFrequency: id
        });
        this.togglShowConfirmation();
    };

    deleteItem = async () => {
        const { selectedFrequency } = this.state;
        this.togglShowConfirmation();
        await this.props.deleteFrequency(selectedFrequency);
        await this.getFrequencyData();
        ToastMsg(this.props.frequencyReducer.deleteFrequencyById.message, "info");
        if (this.props.match.params.id) {
            history.push("/frequencies");
        }
    };

    viewItem = async item => {
        const { tableData } = this.state;
        history.push("/deeming_agency/basicdetails", { item: item, keys: tableData.keys, config: tableData.config });
    };

    editItem = async item => {
        history.push("/editFrequency");
    };

    addItem = async () => {
        this.props.history.push("/addFrequency");
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
        await this.getFrequencyData();
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
        await this.getFrequencyData();
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
        await this.getFrequencyData();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.getFrequencyData();
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
        await this.props.getListForCommonFilterForFrequency({ ...params, ...master_filters });
        return (this.props.frequencyReducer.getListForCommonFilterResponse && this.props.frequencyReducer.getListForCommonFilterResponse.list) || [];
    };

    showInfoPage = id => {
        const { history } = this.props;
        this.setState({
            selectedFrequency: id,
            infoTabsData: [{ label: "Basic Details", path: `/frequency/frequencyinfo/${id}/basicdetails`, key: "basicdetails" }]
        });
        history.push(
            `/frequency/frequencyinfo/${id}/${this.props.match.params && this.props.match.params.tab ? this.props.match.params.tab : "basicdetails"}`
        );
    };

    getDataById = async id => {
        await this.props.getFrequencyById(id);
        return this.props.frequencyReducer.getFrequencyByIdResponse;
    };

    showEditPage = id => {
        const { history } = this.props;
        this.setState({
            selectedFrequency: id
        });
        history.push(`/frequency/edit/${id}`);
    };

    showAddForm = () => {
        const { history } = this.props;
        this.setState({
            selectedFrequency: null
        });
        history.push("/frequency/add");
    };

    exportTable = async () => {
        const { params } = this.state;
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        await this.props.exportFrequency({
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order,
            ...master_filters
        });
    };

    getLogData = async id => {
        const { historyParams } = this.state;
        await this.props.getAllFrequencyLogs(historyParams, id);
        const {
            frequencyReducer: {
                getAllFrequencyLogResponse: { logs, count }
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
        await this.props.deleteFrequencyLog(selectedLog);
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    handleRestoreLog = async id => {
        const { selectedLog } = this.state;
        await this.props.restoreFrequencyLog(id);
        await this.getFrequencyData();
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
                config: frquencyTableData.config
            }
        });
        this.updateEntityParams();
        await this.getFrequencyData();
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
        await this.getFrequencyData();
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
        await this.getFrequencyData();
    };

    updateEntityParams = async () => {
        let entityParams = {
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            tableConfig: this.state.tableData.config,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams
        };
        await this.props.updateFrequencyEntityParams(entityParams);
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
        await this.getFrequencyData();
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
        this.getFrequencyData();
    };

    updateDeemingAgencyAssignment = async selectedItem => {
        await this.setState({
            selectedItem
        });
        this.togglShowUpdateDeemingAgencyFrequencyAssigmentModal();
    };

    togglShowUpdateDeemingAgencyFrequencyAssigmentModal = () => {
        const { showUpdateDeemingAgencyFrequencyAssigmentModal } = this.state;
        this.setState({
            showUpdateDeemingAgencyFrequencyAssigmentModal: !showUpdateDeemingAgencyFrequencyAssigmentModal
        });
    };

    renderUpdateDeemingAgencyFrequencyAssigmentModal = () => {
        const { showUpdateDeemingAgencyFrequencyAssigmentModal, selectedItem } = this.state;
        if (!showUpdateDeemingAgencyFrequencyAssigmentModal) return null;

        return (
            <Portal
                body={
                    <UpdateDeemingAgencyFrequencyAssigmentModal
                        frequency_id={selectedItem}
                        onCancel={this.togglShowUpdateDeemingAgencyFrequencyAssigmentModal}
                        onOk={this.deleteItem}
                    />
                }
                onCancel={this.togglShowUpdateDeemingAgencyFrequencyAssigmentModal}
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
               
        if (!checkPermission("forms", "frequencies", "view"))
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
                        ) : section === "frequencyinfo" ? (
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
                                globalSearchKeyHistory={
                                    this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""
                                }
                                historyPaginationParams={historyPaginationParams}
                                updateLogSortFilters={this.updateLogSortFilters}
                                historyParams={historyParams}
                                updateDeemingAgencyAssignment={this.updateDeemingAgencyAssignment}
                                hasLogView={checkPermission("logs", "frequencies", "view")}
                                hasLogDelete={checkPermission("logs", "frequencies", "delete")}
                                hasLogRestore={checkPermission("logs", "frequencies", "restore")}
                                hasEdit={checkPermission("forms", "frequencies", "edit")}
                                hasDelete={checkPermission("forms", "frequencies", "delete")}
                                hasDeemingAgencyAssign={checkPermission("assign", "frequencies", "activities")}
                            />
                        ) : (
                            <>
                                <div className="list-area">
                                    <TopSlider />
                                    <div className="lst-bt-nav">
                                        <div className="table table-ara">
                                            <TableTopHeader
                                                entity={"Frequency"}
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
                                                showAddButton={false}
                                                hasExport={checkPermission("forms", "frequencies", "export")}
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
                                                        updateDeemingAgencyAssignment={this.updateDeemingAgencyAssignment}
                                                        hasActionDeemingAgencyAssign={checkPermission("assign", "frequencies", "deeming_agencies")}
                                                        hasEdit={checkPermission("forms", "frequencies", "edit")}
                                                        hasDelete={checkPermission("forms", "frequencies", "delete")}
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
                        {this.renderUpdateDeemingAgencyFrequencyAssigmentModal()}
                    </LoadingOverlay>
                </section>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { frequencyReducer } = state;
    return { frequencyReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(index));
