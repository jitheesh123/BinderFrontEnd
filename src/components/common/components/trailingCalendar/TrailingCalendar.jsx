import React, { Component } from "react";
import { connect } from "react-redux";
import LoadingOverlay from "react-loading-overlay";
import ReactTooltip from "react-tooltip";

import TopSlider from "../TopSlider";
import commonActions from "../../actions";
import ActivityCalendarTableHeader from "../ActivityCalendarTableHeader";
import ActivityCalendarTableActivity from "../ActivityCalendarTableActivity";
import TrailingCalendarTableCalendar from "./TrailingCalendarTableCalendar";
import ActivityEventDocumentsModal from "../ActivityEventDocumentsModal";
import CreateActivityEventScheduleModal from "../CreateActivityEventScheduleModal";
import UploadDocumentModal from "../UploadDocumentModal";
import IconsAndColorLegandsModal from "../IconsAndColorLegandsModal";
import FastFormModal from "../eventForms/FastFormModal";
import DefaultRiskFormModal from "../eventForms/DefaultRiskFormModal";
import DefaultRiskFormModalATS from "../eventForms/DefaultRiskFormModalATS";
import BasicFormModal from "../eventForms/BasicFormModal";
import GeneratorTestingFormModal from "../eventForms/GeneratorTestingFormModal";
import FireDrillsQuaterlyFormModal from "../eventForms/FireDrillsQuaterlyFormModal";
import FireDrillsBasicFormModal from "../eventForms/FireDrillsBasicFormModal";
import DeviceCountModal from "../DeviceCountModal";
import ToastMsg from "../../ToastMessage";
import Portal from "../Portal";
import Pagination from "../Pagination";
import Loader from "../Loader";
import { trailingActivityTableData, trailingCalenderTableData } from "./components/tableConfig";
import { checkPermission } from "../../../../config/utils";
import ViewModal from "../ViewModal";
import ModifyNAModal from "../ModifyNAModal";
import EmptyEventFormModal from "../eventForms/EmptyEventFormModal";

class ActivityCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCalendarExpanded: false,
            selectedLogbook: null,
            schedules: [],
            activityTableWidth: props.commonReducer.activityTableWidth || "0px",
            showActivityEventDocumentsModal: false,
            showCreateActivityEventScheduleModal: false,
            showUploadDocumentModal: false,
            showFastFormModal: false,
            showIconsAndColorLegandsModal: false,
            selectedEvent: null,
            selectedSchedule: null,
            surveyDetails: {},
            logbookDocuments: [],
            selectedSurveyDocuments: [],
            activeDocType: null,
            schedulePopupDetails: null,
            newActivityMonth: new Date().getMonth(),
            newActivityYear: new Date().getFullYear(),
            params: props.commonReducer.entityParams.params,
            paginationParams: props.commonReducer.entityParams.paginationParams,
            fastFormModaltype: "add",
            tableData: {
                keys: trailingActivityTableData.keys,
                config: trailingActivityTableData.config
            },
            showWildCardFilter: false,
            showViewModal: false,
            calendarView: true,
            showModifyNAModal: false,
            naMonth: new Date().getMonth(),
            naYear: new Date().getFullYear(),
            undoNAPopupDetails: null,
            isPopUpLoading: false,
            building_activity_id: null,
            asset_id: null,
            showDeviceCountModal: false,
            device_documents: [],
            EditForm: "FAST",
            showLastPerformedColumn: true,
            previous_surveys: [],
            previous_locations: [],
            previous_days: [],
            formSettings: null,
            selectedEventDetails: {},
            status: null
        };
    }

    componentDidMount = async () => {
        await this.refreshScheduleList();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.masterFilters !== this.props.masterFilters) {
            await this.refreshScheduleList(prevState.status);
        }
        if (prevProps.location.state.logbook !== this.props.location.state.logbook) {
            await this.refreshScheduleList();
        }
    };

    updateYearParam = async tempYears => {
        const { params } = this.state;
        await this.setState({
            params: {
                ...params,
                years: tempYears.sort()
            }
        });
        await this.updateEntityParams();
        await this.refreshScheduleList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            paginationParams: this.state.paginationParams,
            params: this.state.params
        };
        await this.props.updateActivityCalendarEntityParamsAnnual(entityParams);
        await this.props.updateActivityCalendarEntityParams(entityParams);
        return true;
    };

    refreshScheduleList = async (status, calendarView) => {
        this.props.setIsLoading(true);
        await this.setState({
            selectedLogbook: this.props.location.state && this.props.location.state.logbook,
            activityTableWidth: this.props.commonReducer.activityTableWidth || "0px",
            tableData: {
                keys: trailingActivityTableData.keys,
                config: trailingActivityTableData.config
            }
        });
        const { selectedLogbook, paginationParams, params } = this.state;
        let tempParams = params;
        tempParams.years = null;
        if (selectedLogbook) {
            let master_filters = JSON.parse(localStorage.getItem("master_filters"));
            if (status) {
                this.setState({ status: status });
                let params = { ...tempParams, page: 1, calendar_view: "trailing" };
                await this.props.getTrailingSchedulesByLogbookId({ ...params, logbook_id: selectedLogbook.id, ...master_filters, status: status });
                await this.props.getScheduleDates({ ...params, logbook_id: selectedLogbook.id, ...master_filters, status: status }, "trailing_dup");
            } else {
                this.setState({ status: null });
                await this.props.getTrailingSchedulesByLogbookId({ ...tempParams, logbook_id: selectedLogbook.id, ...master_filters });
                await this.props.getScheduleDates({ ...tempParams, logbook_id: selectedLogbook.id, ...master_filters }, "trailing_dup");
            }
            const {
                commonReducer: {
                    getTrailingSchedulesByLogbookIdResponse: { success, schedules, count }
                }
            } = this.props;
            if (success) {
                await this.setState({
                    schedules,
                    paginationParams: {
                        ...paginationParams,
                        totalCount: count,
                        totalPages: Math.ceil(count / paginationParams.perPage)
                    }
                });
            }
        }
        ReactTooltip.rebuild();
        this.props.setIsLoading(false);
        return true;
    };

    toggleIsCalendarExpanded = () => {
        const { isCalendarExpanded } = this.state;
        this.setState({
            isCalendarExpanded: !isCalendarExpanded
        });
    };

    toggleCalendarView = async () => {
        const { calendarView } = this.state;
        await this.setState({
            calendarView: !calendarView
        });
    };

    setActivityTableWidth = async width => {
        this.setState({
            activityTableWidth: width
        });
        await this.props.setActivityTableWidth(width);
    };

    toggleMaxMinWidth = isMax => {
        const { activityTableWidth } = this.state;
        if (activityTableWidth !== "0px") {
            this.setActivityTableWidth("0px");
        } else {
            this.setActivityTableWidth("100%");
        }
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

    attachSelectedDocuments = async selectedSurveyDocuments => {
        let tempDcos = this.state.selectedSurveyDocuments;
        selectedSurveyDocuments.map(item => tempDcos.push(item));
        await this.setState({
            selectedSurveyDocuments: tempDcos
        });
        this.toggleShowActivityEventDocumentsModal();
    };

    showCreateActivityEventSchedule = async (schedule_id, month, year, type) => {
        let audit_mode = localStorage.getItem("audit_mode") && localStorage.getItem("audit_mode") === "true" ? true : false;
        if (!audit_mode) {
            await this.setState({
                isPopUpLoading: true
            });
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
            await this.setState({
                isPopUpLoading: false
            });
        }
    };

    executeActivityEvent = async (formData, modify = false) => {
        await this.props.executeActivityEvent(formData, modify);
        const {
            commonReducer: {
                executeActivityEventResponse: { success, message }
            }
        } = this.props;
        if (success) {
            await this.refreshScheduleList();
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
        await this.props.uploadDocuments(formData, selectedLogbook.id);

        const {
            commonReducer: {
                uploadDocumentsResponse: { message }
            }
        } = this.props;

        await this.getLogbookDocuments();
        this.toggleShowUploadDocumentModal();
        ToastMsg(message, "info");
    };

    toggleShowFastFormModal = () => {
        const { showFastFormModal } = this.state;
        this.setState({
            showFastFormModal: !showFastFormModal
        });
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
            previous_days,
            formSettings,
            selectedEventDetails
        } = this.state;

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
                        selectedEventDetails={selectedEventDetails}
                        handleActivityEventClick={this.handleActivityEventClick}
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
                        selectedEventDetails={selectedEventDetails}
                        handleActivityEventClick={this.handleActivityEventClick}
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
                        selectedEventDetails={selectedEventDetails}
                        handleActivityEventClick={this.handleActivityEventClick}
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
                        selectedEventDetails={selectedEventDetails}
                        handleActivityEventClick={this.handleActivityEventClick}
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
                        selectedEventDetails={selectedEventDetails}
                        handleActivityEventClick={this.handleActivityEventClick}
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
                        selectedEventDetails={selectedEventDetails}
                        handleActivityEventClick={this.handleActivityEventClick}
                    />
                );
        }
    };

    getPreviousSurveys = async survey_date_id => {
        await this.props.getPreviousSurveys(survey_date_id);
        const {
            commonReducer: {
                getPreviousSurveysResponse: { previous_surveys, success }
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

    renderFastFormModal = () => {
        const { showFastFormModal, EditForm } = this.state;
        if (!showFastFormModal) return null;
        return <Portal body={this.renderEventForm(EditForm)} onCancel={this.toggleShowFastFormModal} />;
    };

    toggleShowIconsAndColorLegandsModal = () => {
        const { showIconsAndColorLegandsModal } = this.state;
        this.setState({
            showIconsAndColorLegandsModal: !showIconsAndColorLegandsModal
        });
    };

    renderIconsAndColorLegandsModal = () => {
        const { showIconsAndColorLegandsModal, selectedLogbook } = this.state;
        if (!showIconsAndColorLegandsModal) return null;
        return (
            <Portal
                body={<IconsAndColorLegandsModal selectedLogbook={selectedLogbook} onCancel={this.toggleShowIconsAndColorLegandsModal} />}
                onCancel={this.toggleShowIconsAndColorLegandsModal}
            />
        );
    };

    handleNAClick = async (selectedSchedule, month = new Date().getMonth(), year = new Date().getFullYear()) => {
        await this.props.getUndoNaPopupDetails(selectedSchedule);
        const {
            commonReducer: { getUndoNaPopupDetailsResponse }
        } = this.props;
        if (getUndoNaPopupDetailsResponse.success) {
            await this.setState({
                selectedSchedule,
                naMonth: month,
                naYear: year,
                undoNAPopupDetails: getUndoNaPopupDetailsResponse
            });
            this.toggleShowModifyNAModal();
        }
    };

    toggleShowModifyNAModal = () => {
        const { showModifyNAModal } = this.state;
        this.setState({
            showModifyNAModal: !showModifyNAModal
        });
    };

    renderModifyNAModal = () => {
        const { showModifyNAModal, selectedSchedule, naMonth, naYear, undoNAPopupDetails } = this.state;
        if (!showModifyNAModal) return null;
        return (
            <Portal
                body={
                    <ModifyNAModal
                        undoNAPopupDetails={undoNAPopupDetails}
                        executeActivityEvent={this.executeActivityEvent}
                        undoNa={this.undoNa}
                        scheduleId={selectedSchedule}
                        naMonth={naMonth}
                        naYear={naYear}
                        onCancel={this.toggleShowModifyNAModal}
                    />
                }
                onCancel={this.toggleShowModifyNAModal}
            />
        );
    };

    undoNa = async formData => {
        await this.props.undoNa(formData);
        const {
            commonReducer: {
                undoNaResponse: { success, message }
            }
        } = this.props;
        if (success) {
            await this.refreshScheduleList();
            await this.setState({
                showModifyNAModal: false
            });
        }
        if (message && Array.isArray(message)) {
            message.map(item => ToastMsg(item, "info"));
        } else {
            ToastMsg(message, "info");
        }
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
            await this.refreshScheduleList();
        }
        ToastMsg(message, "info");
    };

    saveActivityEvent = async formParams => {
        await this.props.saveActivityEvent(formParams, formParams.id);
        const {
            commonReducer: {
                saveActivityEventResponse: { success, message }
            }
        } = this.props;
        this.toggleShowFastFormModal();
        await this.refreshScheduleList();
        ToastMsg(message, "info");
    };

    handleActivityEventClick = async (selectedEvent, selectedSchedule, EditForm, dates, month, year, selectedEventFrequency = null, itemId) => {
        await this.props.fetchFormSettings(selectedSchedule);
        const {
            commonReducer: {
                fetchFormSettingsResponse: { settings = null }
            }
        } = this.props;
        await this.setState({
            selectedEvent,
            selectedSchedule,
            EditForm,
            isPopUpLoading: true,
            formSettings: settings,
            selectedEventFrequency,
            selectedEventDetails: {
                dates,
                month,
                year,
                frequency: selectedEventFrequency,
                edit_form: EditForm,
                itemId
            }
        });
        if (selectedEvent && selectedSchedule) {
            await this.getSurveyDetails(selectedEvent, selectedSchedule);
            this.toggleShowFastFormModal();
        } else {
            this.toggleShowEmptyEventFormModal();
        }
        await this.setState({
            isPopUpLoading: false
        });
    };

    toggleShowEmptyEventFormModal = () => {
        const { showEmptyEventForm } = this.state;
        this.setState({
            showEmptyEventForm: !showEmptyEventForm
        });
    };

    renderEmptyEventFormModal = () => {
        const { showEmptyEventForm, selectedEventDetails } = this.state;
        if (!showEmptyEventForm) return null;
        return (
            <Portal
                body={
                    <EmptyEventFormModal
                        handleActivityEventClick={this.handleActivityEventClick}
                        showCreateActivityEventSchedule={this.showCreateActivityEventSchedule}
                        selectedEventDetails={selectedEventDetails}
                        onCancel={this.toggleShowEmptyEventFormModal}
                    />
                }
                onCancel={this.toggleShowEmptyEventFormModal}
            />
        );
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

    getLogbookDocuments = async () => {
        const {
            selectedLogbook,
            selectedEvent,
            selectedSchedule,
            surveyDetails: { building = null }
        } = this.state;
        await this.props.getLogbookDocuments(selectedLogbook.id, selectedEvent, selectedSchedule, building ? building.id : null);
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

    UpdateSelectedSurveyDocuments = async selectedSurveyDocuments => {
        await this.setState({
            selectedSurveyDocuments
        });
    };

    handlePageClick = async page => {
        const { paginationParams, params, status } = this.state;
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
        await this.refreshScheduleList(status);
    };

    handlePerPageChange = async e => {
        const { paginationParams, status } = this.state;
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
        await this.refreshScheduleList(status);
    };

    handleGlobalSearch = async search => {
        const { params, status } = this.state;
        await this.setState({
            params: {
                ...params,
                page: 1,
                search
            }
        });
        await this.updateEntityParams();
        await this.refreshScheduleList(status);
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
        // await this.updateEntityParams();
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
        await this.updateEntityParams();
        await this.refreshScheduleList(this.state.status);
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        await this.updateEntityParams();
        await this.refreshScheduleList(this.state.status);
    };

    exportTable = async () => {
        const { params, selectedLogbook, calendarView } = this.state;
        let tempParams = params;
        tempParams.years = null;
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        let exportParams = { ...tempParams, logbook_id: selectedLogbook.id, ...master_filters, export_view: calendarView ? "New" : "Legacy" };
        let path = "export_trailing_calendar";
        await this.props.exportSchedules(exportParams, path);
        const {
            commonReducer: {
                exportSchedulesResponse: { success, message = "" }
            }
        } = this.props;
        if (!success) {
            ToastMsg(message || "Please select a building to export", "info");
        }
    };

    exportFireDrill = async () => {
        const { params, selectedLogbook, calendarView } = this.state;
        let tempParams = params;
        tempParams.years = null;
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        let exportParams = { ...tempParams, logbook_id: selectedLogbook.id, ...master_filters, export_view: calendarView ? "New" : "Legacy" };
        let path = "export_fire_drill_trailing_calendar";
        await this.props.exportSchedules(exportParams, path);
        const {
            commonReducer: {
                exportSchedulesResponse: { success, message = "" }
            }
        } = this.props;
        if (!success) {
            ToastMsg(message || "Please select a building to export", "info");
        }
    };

    checkBuildingCount = async () => {
        const { params, selectedLogbook } = this.state;
        let tempParams = params;
        tempParams.years = null;
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        let checkCountParams = { ...tempParams, logbook_id: selectedLogbook.id, ...master_filters, export_view: "Trailing" };
        let path = "building_count_check";
        await this.props.checkBuildingCount(checkCountParams, path);
        const {
            commonReducer: {
                checkBuildingCountResponse: { success }
            }
        } = this.props;
        if (!success) {
            return false;
        }
        return true;
    };

    updateWildCardFilter = async newFilter => {
        await this.setState({
            params: {
                ...this.state.params,
                page: 1,
                filters: newFilter
            }
        });
        await this.updateEntityParams();
        await this.refreshScheduleList(this.state.status);
    };

    resetAllFilters = async () => {
        await this.setState({
            paginationParams: {
                totalPages: 0,
                perPage: 150,
                currentPage: 0,
                totalCount: 0
            },
            params: {
                ...this.state.params,
                limit: 150,
                page: 1,
                search: "",
                filters: null,
                list: null,
                order: null,
                date_filters: null,
                view: null
            },
            tableData: {
                ...this.state.tableData,
                config: trailingActivityTableData.config
            }
        });
        await this.updateEntityParams();
        await this.refreshScheduleList(this.state.status);
    };

    resetWildCardFilter = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                filters: null,
                list: null,
                search: "",
                date_filters: null,
                view: null
            }
        });
        await this.updateEntityParams();
        await this.reMountWildCardFilter();
        await this.refreshScheduleList(this.state.status);
        await this.reMountWildCardFilter();
    };

    reMountWildCardFilter = async () => {
        const { showWildCardFilter } = this.state;
        await this.setState({
            showWildCardFilter: !showWildCardFilter
        });
        return true;
    };

    updateScrollTop = async scrollTop => {
        await this.setState({
            scrollTop
        });
    };

    getListForCommonFilter = async params => {
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        const { search, filters, list, date_filters } = this.state.params;
        params.search = search;
        params.filters = filters;
        params.date_filters = date_filters;
        params.list = list;
        params.calendar_view = "trailing";
        params.logbook_id = this.state.selectedLogbook.id || null;
        await this.props.getListForCommonFilterForActivityCalender({ ...params, ...master_filters });
        return (this.props.commonReducer.getListForCommonFilterResponse && this.props.commonReducer.getListForCommonFilterResponse.list) || [];
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
        await this.updateEntityParams();
        this.refreshScheduleList(this.state.status);
    };

    toggleFilter = () => {
        this.setState({
            showWildCardFilter: !this.state.showWildCardFilter
        });
    };

    updateWildCardFilterMonth = async newFilter => {
        await this.setState({
            params: {
                ...this.state.params,
                page: 1,
                date_filters: newFilter,
                calendar_view: "trailing"
            }
            // paginationParams: {
            //     ...this.state.paginationParams,
            //     currentPage: 0
            // }
        });
        await this.updateEntityParams();
        await this.refreshScheduleList(this.state.status);
    };

    handleDeviceCountClick = async (building_activity_id, asset_id,schedule_id) => {
        console.log("ho", schedule_id);
        await this.setState({
            isPopUpLoading: true,
            building_activity_id,
            asset_id,
            schedule_id
        });
        await this.getDeviceDocuments();
        this.toggleShowDeviceCountModal();
        await this.setState({
            isPopUpLoading: false
        });
    };

    getDeviceDocuments = async () => {
        const { building_activity_id, asset_id } = this.state;
        
            await this.props.getDeviceDocuments(building_activity_id,asset_id);


        const {
            commonReducer: {
                getDeviceDocumentsResponse: { device_documents, success }
            }
        } = this.props;
        console.log('d90',device_documents)
        if (success) {
            await this.setState({
                device_documents
            });
        }
        return true;
    };

    toggleShowDeviceCountModal = () => {
        const { showDeviceCountModal } = this.state;
        this.setState({
            showDeviceCountModal: !showDeviceCountModal
        });
    };

    renderDeviceCountModal = () => {
        const { showDeviceCountModal, building_activity_id, device_documents, asset_id,schedule_id } = this.state;
        if (!showDeviceCountModal) return null;
        return (
            <Portal
                body={
                    <DeviceCountModal
                        building_activity_id={building_activity_id}
                        asset_id={asset_id}
                        device_documents={device_documents}
                        deleteDeviceCount={this.deleteDeviceCount}
                        saveDeviceCount={this.saveDeviceCount}
                        onCancel={this.toggleShowDeviceCountModal}
                        schedule_id={schedule_id}
                    />
                }
                onCancel={this.toggleShowDeviceCountModal}
            />
        );
    };

    deleteDeviceCount = async id => {
        await this.props.deleteDeviceCount(id);
        const {
            commonReducer: {
                deleteDeviceCountResponse: { message, success }
            }
        } = this.props;
        if (success) {
            ToastMsg(message, "info");
            this.getDeviceDocuments();
            this.refreshScheduleList();
        } else {
            ToastMsg("Update failed !!", "info");
        }
    };

    saveDeviceCount = async params => {
        await this.props.saveDeviceCount(params);
        const {
            commonReducer: {
                saveDeviceCountResponse: { message, success }
            }
        } = this.props;
        if (success) {
            ToastMsg(message, "info");
            this.getDeviceDocuments();
            this.refreshScheduleList();
        } else {
            ToastMsg("Update failed !!", "info");
        }
    };

    checkAndUpdateConfig = async () => {
        const { selectedLogbook, showLastPerformedColumn } = this.state;
        trailingCalenderTableData.config.asset.isVisible = false;
        trailingCalenderTableData.config.date_last_performed.isVisible = false;
        if (selectedLogbook.has_asset === "yes") {
            trailingCalenderTableData.config.asset.isVisible = true;
        }
        if (showLastPerformedColumn) {
            trailingCalenderTableData.config.date_last_performed.isVisible = true;
        }
    };

    toggleLastPerformed = () => {
        const { showLastPerformedColumn } = this.state;
        this.setState({
            showLastPerformedColumn: !showLastPerformedColumn
        });
    };

    render() {
        const {
            isCalendarExpanded,
            selectedLogbook,
            schedules,
            activityTableWidth,
            paginationParams,
            params,
            tableData,
            showWildCardFilter,
            calendarView,
            scrollTop,
            isPopUpLoading,
            showLastPerformedColumn
        } = this.state;

        const { isLoading } = this.props;

        if (!selectedLogbook)
            return (
                <section className="cont-ara">
                    <div className="list-area fire-systm-cover zoom-point">
                        <Loader />
                    </div>
                </section>
            );
        this.checkAndUpdateConfig();
        return (
            <section className="cont-ara">
                <LoadingOverlay fadeSpeed={0} active={isLoading || isPopUpLoading} spinner={<Loader />}>
                    <div className="list-area fire-systm-cover zoom-point">
                        <TopSlider activeLogbook={selectedLogbook && selectedLogbook.id} />
                        <div className="lst-bt-nav fire-sytem-otr">
                            <div className="table table-ara">
                                <ActivityCalendarTableHeader
                                    selectedLogbook={selectedLogbook && selectedLogbook}
                                    updateYearParam={this.updateYearParam}
                                    params={params}
                                    toggleShowIconsAndColorLegandsModal={this.toggleShowIconsAndColorLegandsModal}
                                    handleGlobalSearch={this.handleGlobalSearch}
                                    globalSearchKey={this.state.params.search}
                                    showViewModal={this.showViewModal}
                                    tableParams={params}
                                    resetSort={this.resetSort}
                                    exportTable={this.exportTable}
                                    exportFireDrill={this.exportFireDrill}
                                    resetAllFilters={this.resetAllFilters}
                                    resetWildCardFilter={this.resetWildCardFilter}
                                    toggleFilter={this.toggleFilter}
                                    toggleCalendarView={this.toggleCalendarView}
                                    calendarView={calendarView}
                                    toggleLastPerformed={this.toggleLastPerformed}
                                    checkBuildingCount={this.checkBuildingCount}
                                    showLastPerformedColumn={showLastPerformedColumn}
                                    refreshScheduleList={this.refreshScheduleList}
                                />
                                <div className="list-sec">
                                    <div className="file-system-table-cover">
                                        <ActivityCalendarTableActivity
                                            setActivityTableWidth={this.setActivityTableWidth}
                                            activityTableWidth={activityTableWidth}
                                            isCalendarExpanded={isCalendarExpanded}
                                            schedules={schedules}
                                            tableData={tableData}
                                            updateTableSortFilters={this.updateTableSortFilters}
                                            tableParams={params}
                                            showWildCardFilter={showWildCardFilter}
                                            updateWildCardFilter={this.updateWildCardFilter}
                                            handleActivityEventClick={this.handleActivityEventClick}
                                            handleDeviceCountClick={this.handleDeviceCountClick}
                                            updateScrollTop={this.updateScrollTop}
                                            scrollTop={scrollTop}
                                            getListForCommonFilter={this.getListForCommonFilter}
                                            updateCommonFilter={this.updateCommonFilter}
                                            commonFilter={this.state.params.list}
                                            wildCardFilter={this.state.params.filters}
                                            hasLastPerformedClick={true}
                                            hasDeviceCountClick={true}
                                        />
                                        <div className="rt-btn">
                                            <button
                                                className={`tab-toggle-btn ${activityTableWidth === "0px" ? "active" : ""}`}
                                                onClick={() => this.toggleMaxMinWidth()}
                                            >
                                                <span className="material-icons">keyboard_backspace</span>
                                            </button>
                                        </div>

                                        <TrailingCalendarTableCalendar
                                            selectedLogbook={selectedLogbook && selectedLogbook}
                                            toggleShowActivityEventDocumentsModal={this.toggleShowActivityEventDocumentsModal}
                                            handleActivityEventClick={this.handleActivityEventClick}
                                            handleDeviceCountClick={this.handleDeviceCountClick}
                                            showCreateActivityEventSchedule={this.showCreateActivityEventSchedule}
                                            isCalendarExpanded={isCalendarExpanded}
                                            schedules={schedules}
                                            showWildCardFilter={showWildCardFilter}
                                            tableData={trailingCalenderTableData}
                                            updateWildCardFilter={this.updateWildCardFilter}
                                            updateScrollTop={this.updateScrollTop}
                                            scrollTop={scrollTop}
                                            getListForCommonFilter={this.getListForCommonFilter}
                                            updateCommonFilter={this.updateCommonFilter}
                                            commonFilter={this.state.params.list}
                                            wildCardFilter={this.state.params.filters}
                                            calendarView={calendarView}
                                            tableParams={params}
                                            handleNAClick={this.handleNAClick}
                                            hasLastPerformedClick={true}
                                            wildCardFilterMonth={this.state.params.date_filters}
                                            updateWildCardFilterMonth={this.updateWildCardFilterMonth}
                                            showLastPerformedColumn={showLastPerformedColumn}
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
                    {this.renderFastFormModal()}
                    {this.renderActivityEventDocumentsModal()}
                    {this.renderCreateActivityEventSchedule()}
                    {this.renderUploadDocumentModal()}
                    {this.renderIconsAndColorLegandsModal()}
                    {this.renderColumnViewHideModal()}
                    {this.renderModifyNAModal()}
                    {this.renderDeviceCountModal()}
                    {this.renderEmptyEventFormModal()}
                </LoadingOverlay>
            </section>
        );
    }
}

const mapStateToProps = state => {
    const { commonReducer } = state;
    return { commonReducer };
};

export default connect(mapStateToProps, { ...commonActions })(ActivityCalendar);
