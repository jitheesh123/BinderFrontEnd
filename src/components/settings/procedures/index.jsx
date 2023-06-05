import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";

import actions from "./actions";
import TopSlider from "../../../components/common/components/TopSlider";
import history from "../../../config/history";
import ToastMsg from "../../common/ToastMessage";
import CommonTable from "../../../components/common/components/CommonTable";
import TableTopHeader from "../../../components/common/components/TableTopHeader";
import Pagination from "../../../components/common/components/Pagination";
import Portal from "../../common/components/Portal";
import ConfirmationModal from "../../../components/common/components/ConfirmationModal";
import { procedureTableData } from "../../../config/tableConfig";
import ViewModal from "../../common/components/ViewModal";
import ViewBuildingType from "./viewBuildingType";
import Form from "./buildingTypeForm";
import ProcedureModal from "../../common/components/procedureModal";
import ProcedureDocumentsModal from "../../common/components/ProcedureDocumentsModal";
import UploadDocumentModal from "../../common/components/UploadDocumentModal";
import { checkPermission } from "../../../config/utils";
import Loader from "../../common/components/Loader";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consultancyList: [],
            tableData: procedureTableData,
            showConfirmation: false,
            selectedItem: null,
            params: this.props.procedureReducer.entityParams.params,
            paginationParams: this.props.procedureReducer.entityParams.paginationParams,
            showViewModal: false,
            selectedProcedure: this.props.match.params.id,
            logData: {
                count: "",
                data: []
            },
            historyPaginationParams: this.props.procedureReducer.entityParams.historyPaginationParams,
            historyParams: this.props.procedureReducer.entityParams.historyParams,
            showConfirmModalLog: false,
            selectedLog: "",
            isRestoreOrDelete: "",
            showWildCardFilter: false,
            showUpdateFrequencyDeemingAgencyAssigmentModal: false,
            showFormModal: false,
            surveyDetails: {},
            showProcedureDocumentsModal: false,
            showUploadDocumentModal: false,
            activeDocType: null,
            procedureDocuments: [],
            selectedSurveyDocuments: []
        };
    }

    componentDidMount = async () => {
        await this.setState({
            tableData: {
                ...this.state.tableData,
                keys: procedureTableData.keys,
                config: this.props.procedureReducer.entityParams.tableConfig || procedureTableData.config
            }
        });
        await this.getProcedureData();
    };

    componentDidUpdate = async prevProps => {
        if (prevProps.masterFilters !== this.props.masterFilters) {
            await this.getProcedureData();
        }
    };

    getProcedureData = async () => {
        this.props.setIsLoading(true);
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        const { params, paginationParams } = this.state;
        const { tableData } = this.state;
        await this.props.getProcedure({ ...params, ...master_filters });
        if (this.props.procedureReducer.procedureData.success) {
            this.setState({
                tableData: {
                    ...tableData,
                    data: this.props.procedureReducer.procedureData.procedures
                },
                paginationParams: {
                    ...paginationParams,
                    totalCount: this.props.procedureReducer.procedureData.count,
                    totalPages: Math.ceil(this.props.procedureReducer.procedureData.count / paginationParams.perPage)
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
            selectedProcedure: id
        });
        this.togglShowConfirmation();
    };

    deleteItem = async () => {
        const { selectedProcedure } = this.state;
        this.togglShowConfirmation();
        await this.props.deleteProcedure(selectedProcedure);
        await this.getProcedureData();
        ToastMsg(this.props.procedureReducer.deleteprocedureById.message, "info");
    };

    viewItem = async item => {
        const { tableData } = this.state;
        history.push("/building_type/basicdetails", { item: item, keys: tableData.keys, config: tableData.config });
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
        await this.getProcedureData();
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
        await this.getProcedureData();
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
        await this.getProcedureData();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.getProcedureData();
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
        await this.props.getListForCommonFilterForProcedure({ ...params, ...master_filters });
        return (this.props.procedureReducer.getListForCommonFilterResponse && this.props.procedureReducer.getListForCommonFilterResponse.list) || [];
    };

    showInfoPage = id => {
        const { history } = this.props;
        this.setState({
            selectedProcedure: id,
            infoTabsData: [{ label: "Basic Details", path: `/building_type/building_typeinfo/${id}/basicdetails`, key: "basicdetails" }]
        });
        history.push(
            `/building_type/building_typeinfo/${id}/${
                this.props.match.params && this.props.match.params.tab ? this.props.match.params.tab : "basicdetails"
            }`
        );
    };

    getDataById = async id => {
        await this.props.getBuildingTypeById(id);
        return this.props.procedureReducer.getbuildingTypeByIdResponse;
    };

    showEditPage = async id => {
        this.setState({
            selectedProcedure: id
        });
        await this.getProcedureDetails(id);
        this.toggleShowFormModal();
    };

    showAddForm = () => {
        this.setState({
            selectedProcedure: null,
            selectedSurveyDocuments: []
        });
        this.toggleShowFormModal();
    };

    procedureAddHandler = async data => {
        const { selectedSurveyDocuments } = this.state;
        data.procedure.document_ids = selectedSurveyDocuments;
        await this.props.addProcedure(data);
        await this.getProcedureData();
        this.toggleShowFormModal();
    };

    updateProcedureHandler = async data => {
        const { selectedProcedure } = this.state;
        await this.props.editProcedureById(data, selectedProcedure);
        await this.getProcedureData();
        this.toggleShowFormModal();
    };

    getProcedureDetails = async id => {
        await this.props.getProcedureById(id);
        const {
            procedureReducer: {
                getprocedureByIdResponse: { procedure = {} }
            }
        } = this.props;
        let tempSelectedSurveyDocs = [];
        procedure &&
            procedure.documents &&
            procedure.documents.map((item, i) => {
                tempSelectedSurveyDocs.push(item.document_id);
            });
        await this.setState({
            selectedSurveyDocuments: tempSelectedSurveyDocs
        });
        await this.setState({
            surveyDetails: procedure
        });
        return true;
    };

    toggleShowFormModal = async () => {
        await this.setState({
            showFormModal: !this.state.showFormModal
        });
        await this.getProcedureDocuments();
    };

    renderProcedureModal = () => {
        const { showFormModal, surveyDetails, selectedSurveyDocuments, procedureDocuments, selectedProcedure } = this.state;
        if (!showFormModal) return null;
        return (
            <Portal
                body={
                    <ProcedureModal
                        procedureDocuments={procedureDocuments}
                        toggleShowActivityEventDocumentsModal={this.toggleShowProcedureDocumentsModal}
                        surveyDetails={surveyDetails}
                        selectedSurveyDocuments={selectedSurveyDocuments}
                        saveProcedure={this.procedureAddHandler}
                        UpdateSelectedSurveyDocuments={this.UpdateSelectedSurveyDocuments}
                        removeAttachment={this.removeAttachment}
                        onCancel={this.toggleShowFormModal}
                        selectedProcedure={selectedProcedure}
                        updateProcedure={this.updateProcedureHandler}
                        viewOnly={
                            selectedProcedure ? !checkPermission("forms", "procedures", "edit") : !checkPermission("forms", "procedures", "create")
                        }
                    />
                }
                onCancel={this.toggleShowFormModal}
            />
        );
    };

    toggleShowProcedureDocumentsModal = () => {
        const { showProcedureDocumentsModal } = this.state;
        this.setState({
            showProcedureDocumentsModal: !showProcedureDocumentsModal
        });
    };

    renderProcedureDocumentsModal = data => {
        const { showProcedureDocumentsModal, procedureDocuments, selectedSurveyDocuments } = this.state;
        if (!showProcedureDocumentsModal) return null;
        return (
            <Portal
                body={
                    <ProcedureDocumentsModal
                        procedureDocuments={procedureDocuments}
                        selectedSurveyDocuments={selectedSurveyDocuments}
                        toggleShowUploadDocumentModal={this.toggleShowUploadDocumentModal}
                        UpdateSelectedSurveyDocuments={this.UpdateSelectedSurveyDocuments}
                        attachSelectedDocuments={this.attachSelectedDocuments}
                        onCancel={this.toggleShowProcedureDocumentsModal}
                    />
                }
                onCancel={this.toggleShowProcedureDocumentsModal}
            />
        );
    };

    attachSelectedDocuments = async selectedSurveyDocuments => {
        let tempDcos = this.state.selectedSurveyDocuments;
        selectedSurveyDocuments.map(item => tempDcos.push(item));
        await this.setState({
            selectedSurveyDocuments: tempDcos
        });
        this.toggleShowProcedureDocumentsModal();
    };

    UpdateSelectedSurveyDocuments = async selectedSurveyDocuments => {
        await this.setState({
            selectedSurveyDocuments
        });
    };

    removeAttachment = async id => {
        await this.props.removeAttachment(id);
        const {
            procedureReducer: {
                removeAttachmentResponse: { success, message }
            }
        } = this.props;
        if (success) {
            const { selectedProcedure } = this.state;
            await this.getProcedureDetails(selectedProcedure);
        }
        ToastMsg(message, "info");
    };

    toggleShowUploadDocumentModal = (doc_type = null) => {
        const { showUploadDocumentModal } = this.state;
        this.setState({
            showUploadDocumentModal: !showUploadDocumentModal,
            activeDocType: doc_type
        });
    };

    renderUploadDocumentModal = data => {
        const { showUploadDocumentModal, activeDocType } = this.state;
        if (!showUploadDocumentModal) return null;
        return (
            <Portal
                body={
                    <UploadDocumentModal
                        activeDocType={activeDocType}
                        handleUploadFile={this.handleUploadFile}
                        onCancel={this.toggleShowUploadDocumentModal}
                    />
                }
                onCancel={this.toggleShowUploadDocumentModal}
            />
        );
    };

    handleUploadFile = async (documents, option, doc_type) => {
        let formData = new FormData();
        if (documents && documents.length) {
            documents.map((item, i) => formData.append(`document[${i}]`, item));
        }
        formData.append("option", option);
        formData.append("doc_type", doc_type);
        await this.props.uploadDocumentsProcedure(formData);

        const {
            procedureReducer: {
                uploadDocumentsResponse: { message }
            }
        } = this.props;

        await this.getProcedureDocuments();
        this.toggleShowUploadDocumentModal();
        ToastMsg(message, "info");
    };

    getProcedureDocuments = async () => {
        await this.props.getProcedureDocuments();
        const {
            procedureReducer: {
                getProcedureDocumentsResponse: { documents = [] }
            }
        } = this.props;
        await this.setState({
            procedureDocuments: documents
        });
        return true;
    };

    exportTable = async () => {
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        await this.props.exportProcedure({
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order,
            ...master_filters
        });
    };

    getLogData = async id => {
        const { historyParams } = this.state;
        await this.props.getAllBuildingTypeLogs(historyParams, id);
        const {
            procedureReducer: {
                getAllbuildingTypeLogResponse: { logs, count }
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
        await this.props.deleteBuildingTypeLog(selectedLog);
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    handleRestoreLog = async id => {
        await this.props.restoreBuildingTypeLog(id);
        await this.getProcedureData();
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
                config: procedureTableData.config
            }
        });
        this.updateEntityParams();
        await this.getProcedureData();
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
        });
        this.updateEntityParams();
        await this.getProcedureData();
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
        await this.getProcedureData();
    };

    updateEntityParams = async () => {
        let entityParams = {
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            tableConfig: this.state.tableData.config,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams
        };
        await this.props.updateProcedureEntityParams(entityParams);
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
        await this.getProcedureData();
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
        this.getProcedureData();
    };

    render() {
        const { tableData, params, paginationParams, infoTabsData, logData, historyPaginationParams, historyParams, showWildCardFilter } = this.state;
        const {
            match: {
                params: { section }
            },
            isLoading
        } = this.props;

        if (!checkPermission("forms", "procedures", "view"))
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
                        ) : section === "building_typeinfo" ? (
                            <ViewBuildingType
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
                                hasLogView={checkPermission("logs", "procedures", "view")}
                                hasLogDelete={checkPermission("logs", "procedures", "delete")}
                                hasLogRestore={checkPermission("logs", "procedures", "restore")}
                                hasEdit={checkPermission("forms", "procedures", "edit")}
                                hasDelete={checkPermission("forms", "procedures", "delete")}
                            />
                        ) : (
                            <>
                                <div className="list-area">
                                    <TopSlider />
                                    <div className="lst-bt-nav">
                                        <div className="table table-ara">
                                            <TableTopHeader
                                                entity={"Procedure"}
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
                                                hasExport={checkPermission("forms", "procedures", "export")}
                                                showAddButton={checkPermission("forms", "procedures", "create")}
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
                                                        showInfoPage={this.showEditPage}
                                                        showWildCardFilter={showWildCardFilter}
                                                        updateWildCardFilter={this.updateWildCardFilter}
                                                        updateCommonFilter={this.updateCommonFilter}
                                                        commonFilter={this.state.params.list}
                                                        hasEdit={checkPermission("forms", "procedures", "edit")}
                                                        hasDelete={checkPermission("forms", "procedures", "delete")}
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
                        {this.renderProcedureModal()}
                        {this.renderProcedureDocumentsModal()}
                        {this.renderUploadDocumentModal()}
                    </LoadingOverlay>
                </section>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { procedureReducer } = state;
    return { procedureReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(index));
