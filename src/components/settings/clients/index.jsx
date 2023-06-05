import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";

import history from "../../../config/history";
import { checkPermission } from "../../../config/utils";
import TopSlider from "../../common/components/TopSlider";
import actions from "./actions";
import ToastMsg from "../../common/ToastMessage";
import { clientTableData } from "./components/tableConfig";
import CommonTable from "../../../components/common/components/CommonTable";
import TableTopHeader from "../../../components/common/components/TableTopHeader";
import Portal from "../../common/components/Portal";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../../components/common/components/ConfirmationModal";
import Pagination from "../../../components/common/components/Pagination";
import ViewModal from "../../common/components/ViewModal";
import ViewClient from "./components/viewClient";
import Form from "./components/clientForm";
import UpdateLogbookClientAssigmentModal from "../../common/components/UpdateLogbookClientAssigmentModal";
import UpdateActivityClientAssigmentModal from "../../common/components/UpdateActivityClientAssigmentModal";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clientDataList: [],
            tableData: clientTableData,
            showConfirmation: false,
            selectedItem: null,
            params: this.props.clientReducer.entityParams.params,
            paginationParams: this.props.clientReducer.entityParams.paginationParams,
            showViewModal: false,
            selectedClient: this.props.match.params.id,
            logData: {
                count: "",
                data: []
            },
            historyPaginationParams: this.props.clientReducer.entityParams.historyPaginationParams,
            historyParams: this.props.clientReducer.entityParams.historyParams,
            showConfirmModalLog: false,
            selectedLog: "",
            isRestoreOrDelete: "",
            showWildCardFilter: false
        };
    }

    async componentDidMount() {
        await this.setState({
            tableData: {
                ...this.state.tableData,
                keys: clientTableData.keys,
                config: this.props.clientReducer.entityParams.tableConfig || clientTableData.config
            }
        });
        await this.getClients();
    }

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.masterFilters !== this.props.masterFilters) {
            await this.getClients();
        }
    };

    getClients = async () => {
        this.props.setIsLoading(true);
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        const { params, paginationParams } = this.state;
        await this.props.getClients({ ...params, ...master_filters });
        const { tableData } = this.state;
        if (this.props.clientReducer.clientData.success) {
            this.setState({
                tableData: {
                    ...tableData,
                    data: this.props.clientReducer.clientData.clients
                },
                paginationParams: {
                    ...paginationParams,
                    totalCount: this.props.clientReducer.clientData.count,
                    totalPages: Math.ceil(this.props.clientReducer.clientData.count / paginationParams.perPage)
                },
                showWildCardFilter: this.state.params.filters ? true : false
            });
        }
        this.updateEntityParams();
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
            selectedClient: id
        });
        this.togglShowConfirmation();
    };

    deleteItem = async () => {
        const { selectedClient } = this.state;
        this.togglShowConfirmation();
        await this.props.deleteClient(selectedClient);
        await this.getClients();
        ToastMsg(this.props.clientReducer.deleteClientData.message, "info");
        if (this.props.match.params.id) {
            history.push("/clients");
        }
    };

    viewItem = async item => {
        const { tableData } = this.state;
        history.push("/client/basicdetails", { item: item, consultancy_id: item.consultancy.id, keys: tableData.keys, config: tableData.config });
    };

    editItem = async item => {
        history.push("/editCLient", { clientItem: item, consultancy_id: item.consultancy.id });
    };

    addItem = async item => {
        this.props.history.push("/addClient");
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
        await this.getClients();
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
        await this.getClients();
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
        await this.getClients();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.getClients();
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
        await this.props.getListForCommonFilterForClient({ ...params, ...master_filters });
        return (this.props.clientReducer.getListForCommonFilterResponse && this.props.clientReducer.getListForCommonFilterResponse.list) || [];
    };

    showInfoPage = id => {
        const { history } = this.props;
        this.setState({
            selectedClient: id,
            infoTabsData: [
                { label: "Basic Details", path: `/client/clientinfo/${id}/basicdetails`, key: "basicdetails" },
                { label: "Assigned Logbooks", path: `/client/clientinfo/${id}/assignedlogbooks`, key: "assignedlogbooks" },
                { label: "Assigned Activities", path: `/client/clientinfo/${id}/assignedactivities`, key: "assignedactivities" },
                { label: "Form Settings", path: `/client/clientinfo/${id}/formsettings`, key: "formsettings" }
            ]
        });
        history.push(
            `/client/clientinfo/${id}/${this.props.match.params && this.props.match.params.tab ? this.props.match.params.tab : "basicdetails"}`
        );
    };

    getDataById = async id => {
        await this.props.getClientById(id);
        return this.props.clientReducer.getClientByIdResponse;
    };

    showEditPage = id => {
        const { history } = this.props;
        this.setState({
            selectedClient: id
        });
        history.push(`/client/edit/${id}`);
    };

    showAddForm = () => {
        const { history } = this.props;
        this.setState({
            selectedClient: null
        });
        history.push("/client/add");
    };

    exportTable = async () => {
        const { params } = this.state;
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        await this.props.exportClient({
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order,
            ...master_filters
        });
    };

    getLogData = async id => {
        const { historyParams } = this.state;
        await this.props.getAllClientLogs(historyParams, id);
        const {
            clientReducer: {
                getAllClientLogResponse: { logs, count }
            }
        } = this.props;
        await this.setState({
            logData: {
                ...this.state.logData,
                data: logs
            },
            historyPaginationParams: {
                ...this.state.historyPaginationParams,
                totalCount: count || 0,
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
        await this.props.deleteClientLog(selectedLog);
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    handleRestoreLog = async id => {
        await this.props.restoreClientLog(id);
        await this.getClients();
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
                config: clientTableData.config
            }
        });
        this.updateEntityParams();
        await this.getClients();
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
                page: 1,
                filters: newFilter
            }
        });
        this.updateEntityParams();
        await this.getClients();
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
        await this.getClients();
    };

    updateEntityParams = async () => {
        let entityParams = {
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            tableConfig: this.state.tableData.config,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams
        };
        await this.props.updateClientEntityParams(entityParams);
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
        await this.getClients();
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
        this.getClients();
    };

    togglShowUpdateLogbookClientAssigmentModal = () => {
        const { showUpdateLogbookClientAssigmentModal } = this.state;
        this.setState({
            showUpdateLogbookClientAssigmentModal: !showUpdateLogbookClientAssigmentModal
        });
    };

    renderUpdateLogbookClientAssigmentModal = () => {
        const { showUpdateLogbookClientAssigmentModal, selectedItem } = this.state;
        if (!showUpdateLogbookClientAssigmentModal) return null;

        return (
            <Portal
                body={
                    <UpdateLogbookClientAssigmentModal
                        client_id={selectedItem}
                        onCancel={this.togglShowUpdateLogbookClientAssigmentModal}
                        onOk={this.deleteItem}
                    />
                }
                onCancel={this.togglShowUpdateLogbookClientAssigmentModal}
            />
        );
    };

    updateAssignment = async selectedItem => {
        await this.setState({
            selectedItem
        });
        this.togglShowUpdateLogbookClientAssigmentModal();
    };

    togglShowUpdateActivityClientAssigmentModal = () => {
        const { showUpdateActivityClientAssigmentModal } = this.state;
        this.setState({
            showUpdateActivityClientAssigmentModal: !showUpdateActivityClientAssigmentModal
        });
    };

    renderUpdateActivityClientAssigmentModal = () => {
        const { showUpdateActivityClientAssigmentModal, selectedItem } = this.state;
        if (!showUpdateActivityClientAssigmentModal) return null;

        return (
            <Portal
                body={
                    <UpdateActivityClientAssigmentModal
                        client_id={selectedItem}
                        onCancel={this.togglShowUpdateActivityClientAssigmentModal}
                        onOk={this.deleteItem}
                    />
                }
                onCancel={this.togglShowUpdateActivityClientAssigmentModal}
            />
        );
    };

    updateActivityAssignment = async selectedItem => {
        await this.setState({
            selectedItem
        });
        this.togglShowUpdateActivityClientAssigmentModal();
    };

    render() {
        const { tableData, params, paginationParams, infoTabsData, logData, historyPaginationParams, historyParams, showWildCardFilter } = this.state;
        const {
            match: {
                params: { section }
            },
            isLoading,
            setIsLoading
        } = this.props;

        if (!checkPermission("forms", "clients", "view"))
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
                        ) : section === "clientinfo" ? (
                            <ViewClient
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
                                updateAssignment={this.updateAssignment}
                                updateAssignActivity={this.updateActivityAssignment}
                                hasLogView={checkPermission("logs", "clients", "view")}
                                hasLogDelete={checkPermission("logs", "clients", "delete")}
                                hasLogRestore={checkPermission("logs", "clients", "restore")}
                                hasEdit={checkPermission("forms", "clients", "edit")}
                                hasDelete={checkPermission("forms", "clients", "delete")}
                                hasLogbookAssign={checkPermission("assign", "clients", "logbooks")}
                                hasActivityAssign={checkPermission("assign", "clients", "activities")}
                                setIsLoading={setIsLoading}
                            />
                        ) : (
                            <>
                                <div className="list-area">
                                    <TopSlider />
                                    <div className="lst-bt-nav">
                                        <div className="table table-ara">
                                            <TableTopHeader
                                                entity={"Client"}
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
                                                hasExport={checkPermission("forms", "clients", "export")}
                                                showAddButton={checkPermission("forms", "clients", "create")}
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
                                                        updateAssignment={this.updateAssignment}
                                                        commonFilter={this.state.params.list}
                                                        updateActivityAssignment={this.updateActivityAssignment}
                                                        hasActionAssign={checkPermission("assign", "clients", "logbooks")}
                                                        hasActionActivityAssign={checkPermission("assign", "clients", "activities")}
                                                        hasEdit={checkPermission("forms", "clients", "edit")}
                                                        hasDelete={checkPermission("forms", "clients", "delete")}
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
                        {this.renderUpdateLogbookClientAssigmentModal()}
                        {this.renderUpdateActivityClientAssigmentModal()}
                    </LoadingOverlay>
                </section>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { clientReducer } = state;
    return { clientReducer };
};
export default withRouter(connect(mapStateToProps, { ...actions })(index));
