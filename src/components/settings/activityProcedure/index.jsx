import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import qs from "query-string";

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
import { procedureTableData } from "../../../config/tableConfig";
import ViewModal from "../../common/components/ViewModal";
import ViewConsultancy from "./viewConsultancy";
import UpdateLogbookConsultancyAssigmentModal from "../../common/components/UpdateLogbookConsultancyAssigmentModal";
import CommonActions from "./../../common/actions";
import activity from "../activity";
import ProcedureModal from "../../common/components/procedureModal";
import ProcedureDocumentsModal from "../../common/components/ProcedureDocumentsModal";
import UploadDocumentModal from "../../common/components/UploadDocumentModal";
import procedureActions from "../../settings/procedures/actions";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consultancyList: [],
            tableData: procedureTableData,
            showConfirmation: false,
            selectedItem: null,
            params: this.props.activityProcedureReducer.entityParams.params,
            paginationParams: this.props.activityProcedureReducer.entityParams.paginationParams,
            showViewModal: false,
            selectedActivityProcedure: this.props.match.params.id,
            showViewModal: false,
            logData: {
                count: "",
                data: []
            },
            historyPaginationParams: this.props.activityProcedureReducer.entityParams.historyPaginationParams,
            historyParams: this.props.activityProcedureReducer.entityParams.historyParams,
            showConfirmModalLog: false,
            selectedLog: "",
            isRestoreOrDelete: "",
            showWildCardFilter: false,
            showUpdateLogbookConsultancyAssigmentModal: false,
            consultancyId: "",
            surveyDetails: {},
            showProcedureDocumentsModal: false,
            showUploadDocumentModal: false,
            activeDocType: null,
            logbookDocuments: [],
            selectedSurveyDocuments: [],
            showFormModal: false
        };
    }

    componentDidMount = async () => {
        await this.setState({
            tableData: {
                ...this.state.tableData,
                keys: procedureTableData.keys,
                config: this.props.activityProcedureReducer.entityParams.tableConfig || procedureTableData.config
            }
        });
        await this.getActivityProcedure();
    };

    componentDidUpdate = async prevProps => {
        if (this.props.commonReducer.AssignPopUpApiTrigger && this.props.commonReducer.AssignPopUpApiTrigger.isTrigger == true) {
            await this.props.updateAssignPopUpApiTrigger({ isTrigger: false });
            await this.getActivityProcedure();
        }
    };

    getActivityProcedure = async () => {
        const { params, paginationParams } = this.state;
        const { tableData } = this.state;
        const activityId = this.props.match.params.id || this.props.activityId;
        await this.props.getActivityProcedure({ ...params, activity_id: activityId });
        if (this.props.activityProcedureReducer.procedureData.success) {
            this.setState({
                tableData: {
                    ...tableData,
                    data: this.props.activityProcedureReducer.procedureData.procedures
                },
                paginationParams: {
                    ...paginationParams,
                    totalCount: this.props.activityProcedureReducer.procedureData.count,
                    totalPages: Math.ceil(this.props.activityProcedureReducer.procedureData.count / paginationParams.perPage)
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
            selectedActivityProcedure: id
        });
        this.togglShowConfirmation();
    };

    deleteItem = async () => {
        const {
            match: {
                params: { section, id }
            }
        } = this.props;
        const { selectedActivityProcedure } = this.state;
        this.togglShowConfirmation();
        await this.props.deleteActivityProcedure(selectedActivityProcedure, { activity_id: id });
        await this.getActivityProcedure();
        ToastMsg(this.props.activityProcedureReducer.deleteProcedureById.message, "info");
        if (section && section === "activityProcedureInfo") {
            history.go(-2);
        }
    };

    editItem = async item => {
        history.push("/editConsultancy", { consultancyItem: item });
    };

    addItem = async () => {
        this.props.history.push("/addConsultancy");
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
        await this.getActivityProcedure();
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
        await this.getActivityProcedure();
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
        await this.getActivityProcedure();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.getActivityProcedure();
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
        const { search, filters, list } = this.state.params;
        const activityId = this.props.match.params.id || "";
        params.search = search;
        params.filters = filters;
        params.list = list;
        params.activity_id = activityId;
        await this.props.getListForCommonFilterForProcedure(params);
        return (
            (this.props.activityProcedureReducer.getListForCommonFilterResponse &&
                this.props.activityProcedureReducer.getListForCommonFilterResponse.list) ||
            []
        );
    };

    showInfoPage = (id, procedureId) => {
        const { history } = this.props;
        this.setState({
            selectedClientActivity: id,
            infoTabsData: [
                {
                    label: "Basic Details",
                    path: `/activityProcedure/activityProcedureInfo/${id}/basicdetails?procedureId=${procedureId}`,
                    key: "basicdetails"
                }
            ]
        });
        history.push(`/activityProcedure/activityProcedureInfo/${id}/basicdetails?procedureId=${procedureId}`);
    };

    getDataById = async id => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const procedureId = query.procedureId || "";
        await this.props.getActivityProcedureById(id, procedureId);
        return this.props.activityProcedureReducer.getProcedureByIdResponse;
    };

    showEditPage = async id => {
        this.setState({
            selectedActivityProcedure: id
        });
        await this.getProcedureDetails(id);
        this.toggleShowFormModal();
    };

    getProcedureDetails = async (id, schedule_id) => {
        await this.props.getProcedureById(id);
        const {
            procedureReducer: {
                getprocedureByIdResponse: { success, procedure = {} }
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

    getProcedureDocuments = async () => {
        await this.props.getProcedureDocuments();
        const {
            procedureReducer: {
                getProcedureDocumentsResponse: { success, documents = [] }
            }
        } = this.props;
        await this.setState({
            logbookDocuments: documents
        });
        return true;
    };

    renderProcedureModal = () => {
        const {
            showFormModal,

            surveyDetails,
            selectedSurveyDocuments,
            logbookDocuments,
            selectedActivityProcedure
        } = this.state;
        const { viewOnly = false } = this.props;
        if (!showFormModal) return null;
        return (
            <Portal
                body={
                    <ProcedureModal
                        logbookDocuments={logbookDocuments}
                        toggleShowActivityEventDocumentsModal={this.toggleShowProcedureDocumentsModal}
                        surveyDetails={surveyDetails}
                        selectedSurveyDocuments={selectedSurveyDocuments}
                        // saveProcedure={this.procedureAddHandler}
                        UpdateSelectedSurveyDocuments={this.UpdateSelectedSurveyDocuments}
                        removeAttachment={this.removeAttachment}
                        onCancel={this.toggleShowFormModal}
                        selectedProcedure={selectedActivityProcedure}
                        updateProcedure={this.updateProcedureHandler}
                        viewOnly={viewOnly}
                    />
                }
                onCancel={this.toggleShowFormModal}
            />
        );
    };

    updateProcedureHandler = async data => {
        const { selectedActivityProcedure } = this.state;
        await this.props.editProcedureById(data, selectedActivityProcedure);
        await this.getActivityProcedure();
        this.toggleShowFormModal();
    };

    toggleShowProcedureDocumentsModal = () => {
        const { showProcedureDocumentsModal } = this.state;
        this.setState({
            showProcedureDocumentsModal: !showProcedureDocumentsModal
        });
    };

    renderProcedureDocumentsModal = data => {
        const { showProcedureDocumentsModal, logbookDocuments, selectedSurveyDocuments } = this.state;
        if (!showProcedureDocumentsModal) return null;
        return (
            <Portal
                body={
                    <ProcedureDocumentsModal
                        logbookDocuments={logbookDocuments}
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
            const { selectedEvent, selectedSchedule } = this.state;
            await this.getSurveyDetails(selectedEvent, selectedSchedule, true);
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
        const { selectedLogbook } = this.state;
        let formData = new FormData();
        if (documents && documents.length) {
            documents.map((item, i) => formData.append(`document[${i}]`, item));
        }
        formData.append("option", option);
        formData.append("doc_type", doc_type);
        await this.props.uploadDocumentsProcedure(formData);

        const {
            procedureReducer: {
                uploadDocumentsResponse: { success, message }
            }
        } = this.props;

        await this.getProcedureDocuments();
        this.toggleShowUploadDocumentModal();
        ToastMsg(message, "info");
    };

    showAddForm = () => {
        const { history } = this.props;
        this.setState({
            selectedActivityProcedure: null
        });
        history.push("/consultancy/add");
    };

    exportTable = async () => {
        const { params } = this.state;
        const activityId = this.props.match.params.id || this.props.activityId;
        await this.props.exportProcedure({
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order,
            activity_id: activityId
        });
    };

    getLogData = async id => {
        const { historyParams } = this.state;
        await this.props.getAllConsultancyLogs(historyParams, id);
        const {
            activityProcedureReducer: {
                getAllConsultancyLogResponse: { logs, count }
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
        await this.props.deleteConsultancyLog(selectedLog);
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    handleRestoreLog = async id => {
        const { selectedLog } = this.state;
        await this.props.restoreConsultancyLog(id);
        await this.getActivityProcedure();
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
        await this.getActivityProcedure();
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
        await this.getActivityProcedure();
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
        await this.getActivityProcedure();
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
        await this.getActivityProcedure();
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
        this.getActivityProcedure();
    };

    togglShowUpdateLogbookConsultancyAssigmentModal = () => {
        const { showUpdateLogbookConsultancyAssigmentModal } = this.state;
        this.setState({
            showUpdateLogbookConsultancyAssigmentModal: !showUpdateLogbookConsultancyAssigmentModal
        });
    };

    renderUpdateLogbookConsultancyAssigmentModal = () => {
        const { showUpdateLogbookConsultancyAssigmentModal, selectedItem } = this.state;
        if (!showUpdateLogbookConsultancyAssigmentModal) return null;

        return (
            <Portal
                body={
                    <UpdateLogbookConsultancyAssigmentModal
                        consultancy_id={selectedItem}
                        onCancel={this.togglShowUpdateLogbookConsultancyAssigmentModal}
                        onOk={this.deleteItem}
                    />
                }
                onCancel={this.togglShowUpdateLogbookConsultancyAssigmentModal}
            />
        );
    };

    updateAssignment = async selectedItem => {
        await this.setState({
            selectedItem
        });
        this.togglShowUpdateLogbookConsultancyAssigmentModal();
    };

    render() {
        const { tableData, params, paginationParams, infoTabsData, logData, historyPaginationParams, historyParams, showWildCardFilter } = this.state;
        const {
            match: {
                params: { section }
            },
            hasAction = true
        } = this.props;
        return (
            <React.Fragment>
                {section === "activityProcedureInfo" ? (
                    <ViewConsultancy
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
                        updateAssignment={this.updateAssignment}
                        hasDelete={checkPermission("assign", "activities", "procedures")}
                    />
                ) : (
                    <section className="cont-ara">
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
                                        hasActionColumn={hasAction}
                                    />
                                    <div className="list-sec">
                                        <div className="table-section">
                                            <CommonTable
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
                                                hasActionAssign={false}
                                                updateAssignment={this.updateAssignment}
                                                commonFilter={this.state.params.list}
                                                hasActionCalendar={false}
                                                // hasTableViewDetails={false}
                                                hasEdit={false}
                                                hasDelete={checkPermission("assign", "activities", "procedures")}
                                                hasActionColumn={hasAction}
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
                {this.renderUpdateLogbookConsultancyAssigmentModal()}
                {this.renderProcedureModal()}
                {this.renderProcedureDocumentsModal()}
                {this.renderUploadDocumentModal()}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { activityProcedureReducer, commonReducer, procedureReducer } = state;
    return { activityProcedureReducer, commonReducer, procedureReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions, ...CommonActions, ...procedureActions })(index));
