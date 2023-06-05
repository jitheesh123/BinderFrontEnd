import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";

import TopSlider from "../common/components/TopSlider";
import Loader from "../common/components/Loader";
import actions from "./actions";
import CommonTable from "../../components/common/components/CommonTable";
import TableTopHeader from "../../components/common/components/TableTopHeader";
import Pagination from "../../components/common/components/Pagination";
import Portal from "../common/components/Portal";
import { smartReportTableData } from "./components/tableConfig";
import ViewModal from "../common/components/ViewModal";
import commonActions from "../common/actions";
import FastFormModal from "../common/components/eventForms/FastFormModal";
import DefaultRiskFormModal from "../common/components/eventForms/DefaultRiskFormModal";
import DefaultRiskFormModalATS from "../common/components/eventForms/DefaultRiskFormModalATS";
import BasicFormModal from "../common/components/eventForms/BasicFormModal";
import GeneratorTestingFormModal from "../common/components/eventForms/GeneratorTestingFormModal";
import FireDrillsQuaterlyFormModal from "../common/components/eventForms/FireDrillsQuaterlyFormModal";
import FireDrillsBasicFormModal from "../common/components/eventForms/FireDrillsBasicFormModal";
import ActivityEventDocumentsModal from "../common/components/ActivityEventDocumentsModal";
import UploadDocumentModal from "../common/components/UploadDocumentModal";
import ToastMsg from "../common/ToastMessage";
import { checkPermission } from "../../config/utils";
import CreateActivityEventScheduleModal from "../common//components/CreateActivityEventScheduleModal";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reportDataList: [],
            tableData: smartReportTableData,
            showConfirmation: false,
            selectedItem: null,
            params: this.props.smartReportReducer.entityParams.params,
            paginationParams: this.props.smartReportReducer.entityParams.paginationParams,
            showViewModal: false,
            selectedReport: this.props.match.params.id,
            showWildCardFilter: false,
            loading: true,
            reportsTitle: "",
            selectedEvent: "",
            selectedSchedule: "",
            selectedSurveyDocuments: [],
            surveyDetails: {},
            showFastFormModal: false,
            selectedLogbook: "",
            logbookDocuments: [],
            showActivityEventDocumentsModal: false,
            showUploadDocumentModal: false,
            activeDocType: null,
            schedulePopupDetails: null,
            newActivityMonth: new Date().getMonth(),
            newActivityYear: new Date().getFullYear(),
            fastFormModaltype: "add",
            showCreateActivityEventSchedule: false,
            summaryRowData: {
                default_total_devices_total: "",
                failure_percentage_average: "",
                number_corrected_total: "",
                number_fail_total: "",
                number_pass_total: "",
                total_devices_total: ""
            },
            isPopUpLoading: false,
            EditForm: "FAST",
            previous_surveys: [],
            previous_locations: [],
            previous_days: []
        };
    }

    componentDidMount = async () => {
        await this.setState({
            tableData: {
                ...this.state.tableData,
                keys: smartReportTableData.keys,
                config: this.props.smartReportReducer.entityParams.tableConfig || smartReportTableData.config
            }
        });
        await this.getReportsData();
    };

    getReportsData = async () => {
        const { params, paginationParams } = this.state;
        const { chart, item, view } = this.props;
        let responseData = [];
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        await this.props.getSmartReports({ ...params, chart: chart, item: item, view: view, ...master_filters });
        responseData = this.props.smartReportReducer.reportData.survey_dates || [];

        const { tableData } = this.state;
        if (this.props.smartReportReducer.reportData.success) {
            let default_total_devices_total = this.props.smartReportReducer.reportData
                ? this.props.smartReportReducer.reportData.default_total_devices_total || 0
                : 0;

            let failure_percentage_average = this.props.smartReportReducer.reportData
                ? this.props.smartReportReducer.reportData.failure_percentage_average || 0
                : 0;
            let number_corrected_total = this.props.smartReportReducer.reportData
                ? this.props.smartReportReducer.reportData.number_corrected_total || 0
                : 0;
            let number_fail_total = this.props.smartReportReducer.reportData ? this.props.smartReportReducer.reportData.number_fail_total || 0 : 0;
            let number_pass_total = this.props.smartReportReducer.reportData ? this.props.smartReportReducer.reportData.number_pass_total || 0 : 0;
            let total_devices_total = this.props.smartReportReducer.reportData
                ? this.props.smartReportReducer.reportData.total_devices_total || 0
                : 0;
            await this.setState({
                tableData: {
                    ...tableData,
                    data: responseData
                },
                paginationParams: {
                    ...paginationParams,
                    totalCount: this.props.smartReportReducer.reportData.count,
                    totalPages: Math.ceil(this.props.smartReportReducer.reportData.count / paginationParams.perPage)
                },
                summaryRowData: {
                    ...this.state.summaryRowData,
                    default_total_devices_total,
                    failure_percentage_average,
                    number_corrected_total,
                    number_fail_total,
                    number_pass_total,
                    total_devices_total
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
            // paginationParams: {
            //     ...this.state.paginationParams,
            //     currentPage: 0
            // }
        });
        this.updateEntityParams();
        await this.getReportsData();
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
        await this.getReportsData();
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
        await this.getReportsData();
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
        await this.getReportsData();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.getReportsData();
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
        const { chart, item, view } = this.props;
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        params.search = search;
        params.filters = filters;
        params.list = list;
        params.chart = chart;
        params.item = item;
        params.view = view;
        await this.props.getListForCommonFilterForSmartReport({ ...params, ...master_filters });
        return (
            (this.props.smartReportReducer.getListForCommonFilterResponse && this.props.smartReportReducer.getListForCommonFilterResponse.list) || []
        );
    };

    exportTable = async () => {
        const { params } = this.state;
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        const { chart, item, view } = this.props;
        await this.props.exportSmartReports({ ...params, chart: chart, item: item, view: view, name: item, ...master_filters });
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
                config: smartReportTableData.config
            }
        });
        await this.updateEntityParams();
        await this.getReportsData();
    };

    resetWildCardFilter = async () => {
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
                list: null
            }
            // showWildCardFilter:false
        });
        this.updateEntityParams();
        await this.getReportsData();
    };

    updateEntityParams = async () => {
        let entityParams = {
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            tableConfig: this.state.tableData.config
        };
        await this.props.updateSmartReportEntityParams(entityParams);
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
        await this.getReportsData();
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
        this.getReportsData();
    };

    handleActivityEventClick = async (selectedEvent, selectedSchedule, selectedLogbook, EditForm) => {
        await this.setState({
            selectedEvent,
            selectedSchedule,
            EditForm,
            selectedLogbook,
            isPopUpLoading: true
        });
        await this.getSurveyDetails(selectedEvent, selectedSchedule);
        this.toggleShowFastFormModal();
        await this.setState({
            isPopUpLoading: false
        });
    };

    getSurveyDetails = async (id, schedule_id, isCalledFromRemoveAttachment = false) => {
        await this.props.getSurveyDetails(id, schedule_id);
        const {
            commonReducer: {
                getSurveyDetailsResponse: { success, survey = {} }
            }
        } = this.props;
        await this.setState({
            surveyDetails: survey
        });
        await this.getLogbookDocuments();
        if (!isCalledFromRemoveAttachment) {
            let tempSelectedSurveyDocs = [];
            survey.survey_documents &&
                survey.survey_documents.map((item, i) => {
                    tempSelectedSurveyDocs.push(item.logbook_document_id);
                });
            await this.setState({
                selectedSurveyDocuments: tempSelectedSurveyDocs
            });
        }

        return true;
    };

    removeAttachment = async id => {
        await this.props.removeAttachment(id);
        const {
            commonReducer: {
                removeAttachmentResponse: { success, message }
            }
        } = this.props;
        if (success) {
            const { selectedEvent, selectedSchedule } = this.state;
            await this.getSurveyDetails(selectedEvent, selectedSchedule, true);
        }
        ToastMsg(message, "info");
    };

    toggleShowFastFormModal = () => {
        const { showFastFormModal } = this.state;
        this.setState({
            showFastFormModal: !showFastFormModal
        });
    };

    getPreviousSurveys = async survey_date_id => {
        await this.props.getPreviousSurveys(survey_date_id);
        const {
            commonReducer: {
                getPreviousSurveysResponse: { previous_surveys }
            }
        } = this.props;
        await this.setState({
            previous_surveys
        });
    };

    getPreviousLocations = async survey_date_id => {
        await this.props.getPreviousLocations(survey_date_id);
        const {
            commonReducer: {
                getPreviousLocationsResponse: { locations, success }
            }
        } = this.props;
        await this.setState({
            previous_locations: locations
        });
    };

    getPreviousDays = async survey_date_id => {
        await this.props.getPreviousDays(survey_date_id);
        const {
            commonReducer: {
                getPreviousDaysResponse: { days, success }
            }
        } = this.props;
        await this.setState({
            previous_days: days
        });
    };

    getFormSettingsBasedOnSchedule = selectedSchedule => {
        const {
            tableData: { data }
        } = this.state;
        return data && data.find(item => item.schedule_id === selectedSchedule)
            ? data.find(item => item.schedule_id === selectedSchedule).form_settings
            : null;
    };

    renderEventForm = formType => {
        const {
            selectedEvent,
            selectedSchedule,
            surveyDetails,
            selectedSurveyDocuments,
            logbookDocuments,
            previous_surveys,
            previous_locations,
            previous_days
        } = this.state;
        let formSettings = this.getFormSettingsBasedOnSchedule(selectedSchedule);
        switch (formType) {
            case "FAST":
                return (
                    <FastFormModal
                        selectedEvent={selectedEvent}
                        logbookDocuments={logbookDocuments}
                        selectedSchedule={selectedSchedule}
                        toggleShowActivityEventDocumentsModal={this.toggleShowActivityEventDocumentsModal}
                        surveyDetails={surveyDetails}
                        selectedSurveyDocuments={selectedSurveyDocuments}
                        saveActivityEvent={this.saveActivityEvent}
                        UpdateSelectedSurveyDocuments={this.UpdateSelectedSurveyDocuments}
                        showCreateActivityEventSchedule={this.showCreateActivityEventSchedule}
                        removeAttachment={this.removeAttachment}
                        onCancel={this.toggleShowFastFormModal}
                    />
                );
            case "Default - With Risk Assessment":
                return (
                    <DefaultRiskFormModal
                        selectedEvent={selectedEvent}
                        logbookDocuments={logbookDocuments}
                        selectedSchedule={selectedSchedule}
                        toggleShowActivityEventDocumentsModal={this.toggleShowActivityEventDocumentsModal}
                        surveyDetails={surveyDetails}
                        selectedSurveyDocuments={selectedSurveyDocuments}
                        saveActivityEvent={this.saveActivityEvent}
                        UpdateSelectedSurveyDocuments={this.UpdateSelectedSurveyDocuments}
                        showCreateActivityEventSchedule={this.showCreateActivityEventSchedule}
                        removeAttachment={this.removeAttachment}
                        onCancel={this.toggleShowFastFormModal}
                    />
                );
            case "Default - With Risk Assessment + ATS":
                return (
                    <DefaultRiskFormModalATS
                        selectedEvent={selectedEvent}
                        logbookDocuments={logbookDocuments}
                        selectedSchedule={selectedSchedule}
                        toggleShowActivityEventDocumentsModal={this.toggleShowActivityEventDocumentsModal}
                        surveyDetails={surveyDetails}
                        selectedSurveyDocuments={selectedSurveyDocuments}
                        saveActivityEvent={this.saveActivityEvent}
                        UpdateSelectedSurveyDocuments={this.UpdateSelectedSurveyDocuments}
                        showCreateActivityEventSchedule={this.showCreateActivityEventSchedule}
                        removeAttachment={this.removeAttachment}
                        onCancel={this.toggleShowFastFormModal}
                    />
                );
            case "Basic - No Device Data":
                return (
                    <BasicFormModal
                        selectedEvent={selectedEvent}
                        logbookDocuments={logbookDocuments}
                        selectedSchedule={selectedSchedule}
                        toggleShowActivityEventDocumentsModal={this.toggleShowActivityEventDocumentsModal}
                        surveyDetails={surveyDetails}
                        selectedSurveyDocuments={selectedSurveyDocuments}
                        saveActivityEvent={this.saveActivityEvent}
                        UpdateSelectedSurveyDocuments={this.UpdateSelectedSurveyDocuments}
                        showCreateActivityEventSchedule={this.showCreateActivityEventSchedule}
                        removeAttachment={this.removeAttachment}
                        onCancel={this.toggleShowFastFormModal}
                    />
                );
            case "Generator Testing":
                return (
                    <GeneratorTestingFormModal
                        selectedEvent={selectedEvent}
                        logbookDocuments={logbookDocuments}
                        selectedSchedule={selectedSchedule}
                        toggleShowActivityEventDocumentsModal={this.toggleShowActivityEventDocumentsModal}
                        surveyDetails={surveyDetails}
                        selectedSurveyDocuments={selectedSurveyDocuments}
                        saveActivityEvent={this.saveActivityEvent}
                        UpdateSelectedSurveyDocuments={this.UpdateSelectedSurveyDocuments}
                        showCreateActivityEventSchedule={this.showCreateActivityEventSchedule}
                        removeAttachment={this.removeAttachment}
                        onCancel={this.toggleShowFastFormModal}
                    />
                );
            case "Fire Drill - Qtr":
                return (
                    <FireDrillsQuaterlyFormModal
                        selectedEvent={selectedEvent}
                        logbookDocuments={logbookDocuments}
                        selectedSchedule={selectedSchedule}
                        toggleShowActivityEventDocumentsModal={this.toggleShowActivityEventDocumentsModal}
                        surveyDetails={surveyDetails}
                        selectedSurveyDocuments={selectedSurveyDocuments}
                        saveActivityEvent={this.saveActivityEvent}
                        UpdateSelectedSurveyDocuments={this.UpdateSelectedSurveyDocuments}
                        showCreateActivityEventSchedule={this.showCreateActivityEventSchedule}
                        removeAttachment={this.removeAttachment}
                        getPreviousSurveys={this.getPreviousSurveys}
                        previous_surveys={previous_surveys}
                        getPreviousLocations={this.getPreviousLocations}
                        previous_locations={previous_locations}
                        getPreviousDays={this.getPreviousDays}
                        previous_days={previous_days}
                        formSettings={formSettings}
                        onCancel={this.toggleShowFastFormModal}
                    />
                );
            case "Fire Drill - Basic":
                return (
                    <FireDrillsBasicFormModal
                        selectedEvent={selectedEvent}
                        logbookDocuments={logbookDocuments}
                        selectedSchedule={selectedSchedule}
                        toggleShowActivityEventDocumentsModal={this.toggleShowActivityEventDocumentsModal}
                        surveyDetails={surveyDetails}
                        selectedSurveyDocuments={selectedSurveyDocuments}
                        saveActivityEvent={this.saveActivityEvent}
                        UpdateSelectedSurveyDocuments={this.UpdateSelectedSurveyDocuments}
                        showCreateActivityEventSchedule={this.showCreateActivityEventSchedule}
                        removeAttachment={this.removeAttachment}
                        getPreviousLocations={this.getPreviousLocations}
                        previous_locations={previous_locations}
                        getPreviousDays={this.getPreviousDays}
                        previous_days={previous_days}
                        formSettings={formSettings}
                        onCancel={this.toggleShowFastFormModal}
                    />
                );
            default:
                return (
                    <FastFormModal
                        selectedEvent={selectedEvent}
                        logbookDocuments={logbookDocuments}
                        selectedSchedule={selectedSchedule}
                        toggleShowActivityEventDocumentsModal={this.toggleShowActivityEventDocumentsModal}
                        surveyDetails={surveyDetails}
                        selectedSurveyDocuments={selectedSurveyDocuments}
                        saveActivityEvent={this.saveActivityEvent}
                        UpdateSelectedSurveyDocuments={this.UpdateSelectedSurveyDocuments}
                        showCreateActivityEventSchedule={this.showCreateActivityEventSchedule}
                        removeAttachment={this.removeAttachment}
                        onCancel={this.toggleShowFastFormModal}
                    />
                );
        }
    };

    renderFastFormModal = () => {
        const { showFastFormModal, EditForm } = this.state;
        if (!showFastFormModal) return null;
        return <Portal body={this.renderEventForm(EditForm)} onCancel={this.toggleShowFastFormModal} />;
    };

    getLogbookDocuments = async () => {
        const {
            selectedLogbook,
            selectedEvent,
            selectedSchedule,
            surveyDetails: { building = null }
        } = this.state;
        await this.props.getLogbookDocuments(selectedLogbook, selectedEvent, selectedSchedule, building ? building.id : null);
        const {
            commonReducer: {
                getLogbookDocumentsResponse: { success, documents = [] }
            }
        } = this.props;
        await this.setState({
            logbookDocuments: documents
        });
        return true;
    };

    toggleShowActivityEventDocumentsModal = () => {
        const { showActivityEventDocumentsModal } = this.state;
        this.setState({
            showActivityEventDocumentsModal: !showActivityEventDocumentsModal
        });
    };

    renderActivityEventDocumentsModal = data => {
        const { showActivityEventDocumentsModal, logbookDocuments, selectedSurveyDocuments } = this.state;
        if (!showActivityEventDocumentsModal) return null;
        return (
            <Portal
                body={
                    <ActivityEventDocumentsModal
                        logbookDocuments={logbookDocuments}
                        selectedSurveyDocuments={selectedSurveyDocuments}
                        toggleShowUploadDocumentModal={this.toggleShowUploadDocumentModal}
                        UpdateSelectedSurveyDocuments={this.UpdateSelectedSurveyDocuments}
                        attachSelectedDocuments={this.attachSelectedDocuments}
                        onCancel={this.toggleShowActivityEventDocumentsModal}
                    />
                }
                onCancel={this.toggleShowActivityEventDocumentsModal}
            />
        );
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
        const {
            selectedLogbook,
            surveyDetails: { building = null }
        } = this.state;
        let formData = new FormData();
        if (documents && documents.length) {
            documents.map((item, i) => formData.append(`document[${i}]`, item));
        }
        formData.append("option", option);
        formData.append("doc_type", doc_type);
        formData.append("building_id", building ? building.id : null);
        await this.props.uploadDocuments(formData, selectedLogbook);

        const {
            commonReducer: {
                uploadDocumentsResponse: { message }
            }
        } = this.props;
        await this.getLogbookDocuments();
        this.toggleShowUploadDocumentModal();
        ToastMsg(message, "info");
    };

    UpdateSelectedSurveyDocuments = async selectedSurveyDocuments => {
        await this.setState({
            selectedSurveyDocuments
        });
    };

    attachSelectedDocuments = async selectedSurveyDocuments => {
        let tempDcos = this.state.selectedSurveyDocuments;
        selectedSurveyDocuments.map(item => tempDcos.push(item));
        await this.setState({
            selectedSurveyDocuments: tempDcos
        });
        this.toggleShowActivityEventDocumentsModal();
    };

    saveActivityEvent = async formParams => {
        await this.props.saveActivityEvent(formParams, formParams.id);
        const {
            commonReducer: {
                saveActivityEventResponse: { success, message }
            }
        } = this.props;
        await this.getReportsData();
        this.toggleShowFastFormModal();
        await this.props.refreshDashboardData();
        ToastMsg(message, "info");
    };

    showCreateActivityEventSchedule = async (schedule_id, month, year, type) => {
        let audit_mode = localStorage.getItem("audit_mode") && localStorage.getItem("audit_mode") === "true" ? true : false;
        if (!audit_mode) {
            if (
                checkPermission("event", "create", "allow") ||
                checkPermission("event", "delete", "allow") ||
                checkPermission("event", "na", "allow")
            ) {
                const { selectedEvent: survey_date_id } = this.state;
                await this.props.getActivityEventPopupDetails(schedule_id, survey_date_id);
                const {
                    commonReducer: {
                        getActivityEventPopupDetailsResponse: { success, building, schedule, end_date, start_date, years }
                    }
                } = this.props;
                if (success) {
                    await this.setState({
                        schedulePopupDetails: { building, schedule, end_date, start_date, years },
                        newActivityMonth: month,
                        newActivityYear: year,
                        fastFormModaltype: type
                    });
                    this.toggleShowCreateActivityEventSchedule();
                }
            } else {
                ToastMsg("You are not allowed to perform this action!", "error");
            }
        }
    };

    toggleShowCreateActivityEventSchedule = () => {
        const { showCreateActivityEventSchedule } = this.state;
        this.setState({
            showCreateActivityEventSchedule: !showCreateActivityEventSchedule
        });
    };

    renderCreateActivityEventSchedule = data => {
        const { showCreateActivityEventSchedule, schedulePopupDetails, newActivityMonth, newActivityYear, fastFormModaltype, selectedEvent } =
            this.state;
        if (!showCreateActivityEventSchedule) return null;
        return (
            <Portal
                body={
                    <CreateActivityEventScheduleModal
                        schedulePopupDetails={schedulePopupDetails}
                        selectedEvent={selectedEvent}
                        newActivityMonth={newActivityMonth}
                        newActivityYear={newActivityYear}
                        type={fastFormModaltype}
                        executeActivityEvent={this.executeActivityEvent}
                        onCancel={this.toggleShowCreateActivityEventSchedule}
                    />
                }
                onCancel={this.toggleShowCreateActivityEventSchedule}
            />
        );
    };

    executeActivityEvent = async (formData, modify = false) => {
        await this.props.executeActivityEvent(formData, modify);
        const {
            commonReducer: {
                executeActivityEventResponse: { success, message }
            }
        } = this.props;
        if (success) {
            await this.getReportsData();
            await this.props.refreshDashboardData();
            await this.setState({
                showFastFormModal: false,
                showCreateActivityEventSchedule: false,
                showModifyNAModal: false
            });
        }
        if (message && Array.isArray(message)) {
            message.map(item => ToastMsg(item, "info"));
        } else {
            ToastMsg(message, "info");
        }
    };

    render() {
        const { tableData, params, paginationParams, showWildCardFilter, isPopUpLoading, summaryRowData } = this.state;
        const { chart, item, view } = this.props;
        return (
            <React.Fragment>
                <section className="cont-ara">
                    <LoadingOverlay fadeSpeed={0} active={isPopUpLoading} spinner={<Loader />}>
                        <div className="list-area">
                            <TopSlider />
                            <div className="lst-bt-nav">
                                <div className="table table-ara">
                                    <TableTopHeader
                                        entity={"Smart Report"}
                                        reportParams={{ chart, item, view, name: item }}
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
                                        showAddButton={false}
                                    />
                                    <div className="list-sec">
                                        <div className="table-section">
                                            <CommonTable
                                                viewItem={this.viewItem}
                                                tableData={tableData}
                                                showInfoPage={this.handleActivityEventClick}
                                                updateTableSortFilters={this.updateTableSortFilters}
                                                tableParams={params}
                                                hasSort={true}
                                                showWildCardFilter={showWildCardFilter}
                                                updateWildCardFilter={this.updateWildCardFilter}
                                                getListForCommonFilter={this.getListForCommonFilter}
                                                exportTable={this.exportTable}
                                                updateCommonFilter={this.updateCommonFilter}
                                                hasActionColumn={false}
                                                hasTableViewDetails={true}
                                                commonFilter={this.state.params.list}
                                                actionShow={false}
                                                isDashboard={true}
                                                summaryRowData={summaryRowData}
                                                hasSummaryRow={true}
                                                isReportsPage={true}
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
                        {this.renderFastFormModal()}
                        {this.renderActivityEventDocumentsModal()}
                        {this.renderUploadDocumentModal()}
                        {this.renderCreateActivityEventSchedule()}
                    </LoadingOverlay>
                </section>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { smartReportReducer, commonReducer } = state;
    return { smartReportReducer, commonReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions, ...commonActions })(index));
