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
import { logbookTableData } from "./components/tableConfig";
import ViewModal from "../../common/components/ViewModal";
import ViewLogbook from "./components/viewLogbook";
import Form from "./components/logbookForm";
import UpdateConsultancyLogbookAssignmentModal from "../../common/components/UpdateConsultancyLogbookAssigmentModal";
import UpdateClientLogbookAssignmentModal from "../../common/components/UpdateClientLogbookAssigmentModal";
import UpdateBuildingLogbookAssignmentModal from "../../common/components/UpdateBuildingLogbookAssignmentModal";
import Loader from "../../common/components/Loader";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logbookDataList: [],
            tableData: logbookTableData,
            showConfirmation: false,
            selectedItem: null,
            params: this.props.logbookReducer.entityParams.params,
            paginationParams: this.props.logbookReducer.entityParams.paginationParams,
            showViewModal: false,
            selectedLogbook: this.props.match.params.id,
            showWildCardFilter: false,
            loading: true,
            logData: {
                count: "",
                data: []
            },
            historyPaginationParams: this.props.logbookReducer.entityParams.historyPaginationParams,
            historyParams: this.props.logbookReducer.entityParams.historyParams,
            showConfirmModalLog: false,
            selectedLog: "",
            isRestoreOrDelete: "",
            imageResponse: [],
            showUpdateConsultancyAssignmentModal: false,
            showUpdateClientAssignmentModal: false,
            showUpdateBuildingAssignmentModal: false
        };
    }

    componentDidMount = async () => {
        await this.setState({
            tableData: {
                ...this.state.tableData,
                keys: logbookTableData.keys,
                config: this.props.logbookReducer.entityParams.tableConfig || logbookTableData.config
            }
        });
        await this.getLogbookData();
    };

    componentDidUpdate = async prevProps => {
        if (prevProps.masterFilters !== this.props.masterFilters) {
            await this.getLogbookData();
        }
    };

    getLogbookData = async () => {
        this.props.setIsLoading(true);
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        const { params, paginationParams } = this.state;
        let responseData = [];
        await this.props.getLogbook({ ...params, ...master_filters }, "/api/v1/logbooks");
        responseData = this.props.logbookReducer.logbookData.logbooks || [];
        const { tableData } = this.state;
        if (this.props.logbookReducer.logbookData.success) {
            this.setState({
                tableData: {
                    ...tableData,
                    data: responseData
                },
                paginationParams: {
                    ...paginationParams,
                    totalCount: this.props.logbookReducer.logbookData.count,
                    totalPages: Math.ceil(this.props.logbookReducer.logbookData.count / paginationParams.perPage)
                },
                showWildCardFilter: this.state.params.filters ? true : false
            });
        }
        this.props.setIsLoading(false);
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
        await this.getLogbookData();
    };

    // updateFilters = (filterData) => {
    //     this.setState({
    //         params: {
    //             ...this.state.params,
    //             filters: filterData
    //         }
    //     })
    // }

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
            selectedLogbook: id
        });
        this.togglShowConfirmation();
    };

    deleteItem = async () => {
        const { selectedLogbook } = this.state;
        this.togglShowConfirmation();
        await this.props.deleteLogbook(selectedLogbook);
        await this.getLogbookData();
        ToastMsg(this.props.logbookReducer.deleteLogbookData.message, "info");
        if (this.props.match.params.id) {
            history.push("/logbooks");
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
        this.props.history.push("/addLogbook");
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
        await this.getLogbookData();
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
        await this.getLogbookData();
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
        await this.getLogbookData();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.getLogbookData();
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
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        const { search, filters, list } = this.state.params;
        params.search = search;
        params.filters = filters;
        params.list = list;
        await this.props.getListForCommonFilterForLogbook({ ...params, ...master_filters });
        return (this.props.logbookReducer.getListForCommonFilterResponse && this.props.logbookReducer.getListForCommonFilterResponse.list) || [];
    };

    showInfoPage = id => {
        const { history } = this.props;
        this.setState({
            selectedLogbook: id,
            infoTabsData: [
                { label: "Basic Details", path: `/logbook/logbookinfo/${id}/basicdetails`, key: "basicdetails" },
                { label: "Assigned Consultancies", path: `/logbook/logbookinfo/${id}/assignedconsultancies`, key: "assignedconsultancies" },
                { label: "Assigned Clients", path: `/logbook/logbookinfo/${id}/assignedclients`, key: "assignedclients" },
                { label: "Assigned Buildings", path: `/logbook/logbookinfo/${id}/assignedbuildings`, key: "assignedbuildings" },
                { label: "Activities", path: `/logbook/logbookinfo/${id}/activities`, key: "activities" },
                { label: "Images", path: `/logbook/logbookinfo/${id}/images`, key: "images" }
            ]
        });
        history.push(
            `/logbook/logbookinfo/${id}/${this.props.match.params && this.props.match.params.tab ? this.props.match.params.tab : "basicdetails"}`
        );
    };

    getDataById = async id => {
        await this.props.getLogbookById(id);
        return this.props.logbookReducer.getLogbookByIdResponse;
    };

    showEditPage = id => {
        const { history } = this.props;
        this.setState({
            selectedLogbook: id
        });
        history.push(`/logbook/edit/${id}`);
    };

    showAddForm = () => {
        const { history } = this.props;
        this.setState({
            selectedLogbook: null
        });
        history.push("/logbook/add");
    };

    exportTable = async () => {
        const { params } = this.state;
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        await this.props.exportLogbook({
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order,
            ...master_filters
        });
    };

    getLogData = async id => {
        const { historyParams } = this.state;
        await this.props.getAllLogbookLogs(historyParams, id);
        const {
            logbookReducer: {
                getAllLogbookLogResponse: { logs, count }
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
        await this.props.deleteLogbookLog(selectedLog);
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    handleRestoreLog = async id => {
        const { selectedLog } = this.state;
        await this.props.restoreLogbookLog(id);
        await this.getLogbookData();
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
                config: logbookTableData.config
            }
        });
        this.updateEntityParams();
        await this.getLogbookData();
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
        await this.getLogbookData();
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
        await this.getLogbookData();
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
        this.getLogbookData();
    };

    getAllImageList = async id => {
        await this.props.getAllLogbookImages(id);
        const {
            logbookReducer: {
                getAllImagesResponse: { images }
            }
        } = this.props;
        await this.setState({
            imageResponse: images
        });
        return true;
    };

    uploadImages = async (imageData = {}) => {
        const { selectedLogbook } = this.state;
        await this.props.uploadLogbookImage(imageData, selectedLogbook || this.props.match.params.id);
        await this.getAllImageList(selectedLogbook);
        return true;
    };

    updateImageComment = async imageData => {
        const { selectedLogbook } = this.state;
        await this.props.updateLogbookImageComment(imageData);
        await this.getAllImageList(selectedLogbook);
        return true;
    };
    deleteImages = async imageId => {
        const { selectedLogbook } = this.state;
        await this.props.deleteLogbookImage(imageId);
        await this.getAllImageList(selectedLogbook);
        return true;
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
                body={<UpdateConsultancyLogbookAssignmentModal logbook_id={selectedItem} onCancel={this.togglShowUpdateConsultancyAssignmentModal} />}
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
                body={<UpdateClientLogbookAssignmentModal logbook_id={selectedItem} onCancel={this.togglShowUpdateClientAssignmentModal} />}
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
                body={<UpdateBuildingLogbookAssignmentModal logbook_id={selectedItem} onCancel={this.togglShowUpdateBuildingAssignmentModal} />}
                onCancel={this.togglShowUpdateBuildingAssignmentModal}
            />
        );
    };

    render() {
        const {
            tableData,
            params,
            paginationParams,
            infoTabsData,
            showWildCardFilter,
            logData,
            historyPaginationParams,
            historyParams,
            imageResponse
        } = this.state;
        const {
            match: {
                params: { section }
            },
            hasActionColumn = true,
            hasTableViewDetails = true,
            isLoading,
            setIsLoading
        } = this.props;

        if (!checkPermission("forms", "logbooks", "view"))
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
                        ) : section === "logbookinfo" ? (
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
                                globalSearchKeyHistory={
                                    this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""
                                }
                                historyPaginationParams={historyPaginationParams}
                                updateLogSortFilters={this.updateLogSortFilters}
                                historyParams={historyParams}
                                getAllImageList={this.getAllImageList}
                                imageResponse={imageResponse}
                                uploadImages={this.uploadImages}
                                updateImageComment={this.updateImageComment}
                                deleteImages={this.deleteImages}
                                updateConsultancyAssignment={this.updateConsultancyAssignment}
                                updateClientAssignment={this.updateClientAssignment}
                                updateBuildingAssignment={this.updateBuildingAssignment}
                                hasLogView={checkPermission("logs", "logbooks", "view")}
                                hasLogDelete={checkPermission("logs", "logbooks", "delete")}
                                hasLogRestore={checkPermission("logs", "logbooks", "restore")}
                                hasEdit={checkPermission("forms", "logbooks", "edit")}
                                hasDelete={checkPermission("forms", "logbooks", "delete")}
                                hasConsultancyAssign={checkPermission("assign", "logbooks", "consultancies")}
                                hasClientAssign={checkPermission("assign", "logbooks", "clients")}
                                hasBuildingAssign={checkPermission("assign", "logbooks", "buildings")}
                                setIsLoading={setIsLoading}
                            />
                        ) : (
                            <>
                                <div className="list-area">
                                    <TopSlider />
                                    <div className="lst-bt-nav">
                                        <div className="table table-ara">
                                            <TableTopHeader
                                                entity={"Logbook"}
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
                                                hasExport={checkPermission("forms", "logbooks", "export")}
                                                showAddButton={checkPermission("forms", "logbooks", "create")}
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
                                                        hasActionColumn={hasActionColumn}
                                                        hasTableViewDetails={hasTableViewDetails}
                                                        commonFilter={this.state.params.list}
                                                        updateConsultancyAssignment={this.updateConsultancyAssignment}
                                                        updateClientAssignment={this.updateClientAssignment}
                                                        isWidthAction={true}
                                                        updateBuildingAssignment={this.updateBuildingAssignment}
                                                        hasActionConsultancyAssign={checkPermission("assign", "logbooks", "consultancies")}
                                                        hasActionClientAssign={checkPermission("assign", "logbooks", "clients")}
                                                        hasActionBuildingAssign={checkPermission("assign", "logbooks", "buildings")}
                                                        hasEdit={checkPermission("forms", "logbooks", "edit")}
                                                        hasDelete={checkPermission("forms", "logbooks", "delete")}
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
                        {this.renderUpdateConsultancyAssignmentModal()}
                        {this.renderUpdateClientAssignmentModal()}
                        {this.renderUpdateBuildingAssignmentModal()}
                    </LoadingOverlay>
                </section>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { logbookReducer } = state;
    return { logbookReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(index));
