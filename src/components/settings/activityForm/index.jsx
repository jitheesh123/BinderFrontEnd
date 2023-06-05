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
import { formTableData } from "../../../config/tableConfig";
import ViewModal from "../../common/components/ViewModal";
import ViewForm from "./viewForm";
import UpdateLogbookConsultancyAssigmentModal from "../../common/components/UpdateLogbookConsultancyAssigmentModal";
import CommonActions from "./../../common/actions";
import activity from "../activity";
import FormModal from "./components/formModal";
import FormRecordsModal from "./components/FormRecordsModal";
import UploadRecordModal from "./components/UploadRecordModal";
import formActions from "../../settings/forms/actions";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consultancyList: [],
            tableData: formTableData,
            showConfirmation: false,
            selectedItem: null,
            params: this.props.activityFormReducer.entityParams.params,
            paginationParams: this.props.activityFormReducer.entityParams.paginationParams,
            showViewModal: false,
            selectedActivityForm: this.props.match.params.id,
            showViewModal: false,
            logData: {
                count: "",
                data: []
            },
            historyPaginationParams: this.props.activityFormReducer.entityParams.historyPaginationParams,
            historyParams: this.props.activityFormReducer.entityParams.historyParams,
            showConfirmModalLog: false,
            selectedLog: "",
            isRestoreOrDelete: "",
            showWildCardFilter: false,
            showUpdateLogbookConsultancyAssigmentModal: false,
            consultancyId: "",
            formDetails: {},
            showFormRecordsModal: false,
            showUploadRecordModal: false,
            activeDocType: null,
            formRecords: [],
            selectedFormRecords: [],
            showFormModal: false
        };
    }

    componentDidMount = async () => {
        await this.setState({
            tableData: {
                ...this.state.tableData,
                keys: formTableData.keys,
                config: this.props.activityFormReducer.entityParams.tableConfig || formTableData.config
            }
        });
        await this.getActivityForm();
    };

    componentDidUpdate = async prevProps => {
        if (this.props.commonReducer.AssignPopUpApiTrigger && this.props.commonReducer.AssignPopUpApiTrigger.isTrigger == true) {
            await this.props.updateAssignPopUpApiTrigger({ isTrigger: false });
            await this.getActivityForm();
        }
    };

    getActivityForm = async () => {
        const { params, paginationParams } = this.state;
        const { tableData } = this.state;
        const activityId = this.props.match.params.id || this.props.activityId;
        await this.props.getActivityForm({ ...params, activity_id: activityId });
        if (this.props.activityFormReducer.formData.success) {
            this.setState({
                tableData: {
                    ...tableData,
                    data: this.props.activityFormReducer.formData.forms
                },
                paginationParams: {
                    ...paginationParams,
                    totalCount: this.props.activityFormReducer.formData.count,
                    totalPages: Math.ceil(this.props.activityFormReducer.formData.count / paginationParams.perPage)
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
            selectedActivityForm: id
        });
        this.togglShowConfirmation();
    };

    deleteItem = async () => {
        const {
            match: {
                params: { section, id }
            }
        } = this.props;
        const { selectedActivityForm } = this.state;
        this.togglShowConfirmation();
        await this.props.deleteActivityForm(selectedActivityForm, { activity_id: id });
        await this.getActivityForm();
        ToastMsg(this.props.activityFormReducer.deleteFormById.message, "info");
        if (section && section === "activityFormInfo") {
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
        await this.getActivityForm();
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
        await this.getActivityForm();
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
        await this.getActivityForm();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.getActivityForm();
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
        await this.props.getListForCommonFilterForForm(params);
        return (
            (this.props.activityFormReducer.getListForCommonFilterResponse && this.props.activityFormReducer.getListForCommonFilterResponse.list) ||
            []
        );
    };

    showInfoPage = (id, formId) => {
        const { history } = this.props;
        this.setState({
            selectedClientActivity: id,
            infoTabsData: [
                {
                    label: "Basic Details",
                    path: `/activityForm/activityFormInfo/${id}/basicdetails?formId=${formId}`,
                    key: "basicdetails"
                }
            ]
        });
        history.push(`/activityForm/activityFormInfo/${id}/basicdetails?formId=${formId}`);
    };

    getDataById = async id => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const formId = query.formId || "";
        await this.props.getActivityFormById(id, formId);
        return this.props.activityFormReducer.getFormByIdResponse;
    };

    showEditPage = async id => {
        this.setState({
            selectedActivityForm: id
        });
        await this.getFormDetails(id);
        this.toggleShowFormModal();
    };

    getFormDetails = async id => {
        await this.props.getFormById(id);
        const {
            formReducer: {
                getformByIdResponse: { form = {} }
            }
        } = this.props;
        let tempSelectedFormDocs = [];
        form &&
            form.records &&
            form.records.map((item, i) => {
                tempSelectedFormDocs.push(item.document_id);
            });
        await this.setState({
            selectedFormRecords: tempSelectedFormDocs
        });
        await this.setState({
            formDetails: form
        });
        return true;
    };

    toggleShowFormModal = async () => {
        await this.setState({
            showFormModal: !this.state.showFormModal
        });
        await this.getFormRecords();
    };

    getFormRecords = async () => {
        await this.props.getFormRecords();
        const {
            formReducer: {
                getFormRecordsResponse: { records = [] }
            }
        } = this.props;
        await this.setState({
            formRecords: records
        });
        return true;
    };

    renderFormModal = () => {
        const {
            showFormModal,

            formDetails,
            selectedFormRecords,
            formRecords,
            selectedActivityForm
        } = this.state;
        const { viewOnly = false } = this.props;
        if (!showFormModal) return null;
        return (
            <Portal
                body={
                    <FormModal
                        formRecords={formRecords}
                        toggleShowActivityEventRecordsModal={this.toggleShowFormRecordsModal}
                        formDetails={formDetails}
                        selectedFormRecords={selectedFormRecords}
                        // saveForm={this.formAddHandler}
                        UpdateSelectedFormRecords={this.UpdateSelectedFormRecords}
                        removeAttachment={this.removeAttachment}
                        onCancel={this.toggleShowFormModal}
                        selectedForm={selectedActivityForm}
                        updateForm={this.updateFormHandler}
                        viewOnly={viewOnly}
                    />
                }
                onCancel={this.toggleShowFormModal}
            />
        );
    };

    updateFormHandler = async data => {
        const { selectedActivityForm } = this.state;
        await this.props.editFormById(data, selectedActivityForm);
        await this.getActivityForm();
        this.toggleShowFormModal();
    };

    toggleShowFormRecordsModal = () => {
        const { showFormRecordsModal } = this.state;
        this.setState({
            showFormRecordsModal: !showFormRecordsModal
        });
    };

    renderFormRecordsModal = data => {
        const { showFormRecordsModal, formRecords, selectedFormRecords } = this.state;
        if (!showFormRecordsModal) return null;
        return (
            <Portal
                body={
                    <FormRecordsModal
                        formRecords={formRecords}
                        selectedFormRecords={selectedFormRecords}
                        toggleShowUploadRecordModal={this.toggleShowUploadRecordModal}
                        UpdateSelectedFormRecords={this.UpdateSelectedFormRecords}
                        attachSelectedFormRecords={this.attachSelectedFormRecords}
                        onCancel={this.toggleShowFormRecordsModal}
                    />
                }
                onCancel={this.toggleShowFormRecordsModal}
            />
        );
    };

    attachSelectedFormRecords = async selectedFormRecords => {
        let tempDcos = this.state.selectedFormRecords;
        selectedFormRecords.map(item => tempDcos.push(item));
        await this.setState({
            selectedFormRecords: tempDcos
        });
        this.toggleShowFormRecordsModal();
    };

    UpdateSelectedFormRecords = async selectedFormRecords => {
        await this.setState({
            selectedFormRecords
        });
    };

    removeAttachment = async id => {
        await this.props.removeAttachment(id);
        const {
            formReducer: {
                removeAttachmentResponse: { success, message }
            }
        } = this.props;
        if (success) {
            const { selectedEvent, selectedSchedule } = this.state;
            await this.formDetails(selectedEvent, selectedSchedule, true);
        }
        ToastMsg(message, "info");
    };

    toggleShowUploadRecordModal = (doc_type = null) => {
        const { showUploadRecordModal } = this.state;
        this.setState({
            showUploadRecordModal: !showUploadRecordModal,
            activeDocType: doc_type
        });
    };

    renderUploadRecordModal = data => {
        const { showUploadRecordModal, activeDocType } = this.state;
        if (!showUploadRecordModal) return null;
        return (
            <Portal
                body={
                    <UploadRecordModal
                        activeDocType={activeDocType}
                        handleUploadFile={this.handleUploadFile}
                        onCancel={this.toggleShowUploadRecordModal}
                    />
                }
                onCancel={this.toggleShowUploadRecordModal}
            />
        );
    };

    handleUploadFile = async (records, option, doc_type) => {
        const { selectedLogbook } = this.state;
        let formData = new FormData();
        if (records && records.length) {
            records.map((item, i) => formData.append(`record[${i}]`, item));
        }
        formData.append("option", option);
        formData.append("doc_type", doc_type);
        await this.props.uploadFormRecords(formData);

        const {
            formReducer: {
                uploadRecordsResponse: { success, message }
            }
        } = this.props;

        await this.getFormRecords();
        this.toggleShowUploadRecordModal();
        ToastMsg(message, "info");
    };

    showAddForm = () => {
        const { history } = this.props;
        this.setState({
            selectedActivityForm: null
        });
        history.push("/consultancy/add");
    };

    exportTable = async () => {
        const { params } = this.state;
        const activityId = this.props.match.params.id || this.props.activityId;
        await this.props.exportForm({
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
            activityFormReducer: {
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
        await this.getActivityForm();
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
                config: formTableData.config
            }
        });
        this.updateEntityParams();
        await this.getActivityForm();
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
        await this.getActivityForm();
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
        await this.getActivityForm();
    };

    updateEntityParams = async () => {
        let entityParams = {
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            tableConfig: this.state.tableData.config,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams
        };
        await this.props.updateFormEntityParams(entityParams);
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
        await this.getActivityForm();
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
        this.getActivityForm();
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
                {section === "activityFormInfo" ? (
                    <ViewForm
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
                        hasDelete={checkPermission("assign", "activities", "forms")}
                    />
                ) : (
                    <section className="cont-ara">
                        <div className="list-area">
                            <TopSlider />
                            <div className="lst-bt-nav">
                                <div className="table table-ara">
                                    <TableTopHeader
                                        entity={"Form"}
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
                                                hasEdit={false}
                                                hasTableViewDetails={true}
                                                hasDelete={checkPermission("assign", "activities", "forms")}
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
                {this.renderFormModal()}
                {this.renderFormRecordsModal()}
                {this.renderUploadRecordModal()}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { activityFormReducer, commonReducer, formReducer } = state;
    return { activityFormReducer, commonReducer, formReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions, ...CommonActions, ...formActions })(index));
