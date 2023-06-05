import React, { Component } from "react";
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";
import _ from "lodash";
import moment from "moment";
import ReactTooltip from "react-tooltip";
import * as htmlToImage from "html-to-image";

import BuildModalHeader from "../BuildModalHeader";
import { checkPermission, toggleTooltip, firedrillsTooltips } from "../../../../config/utils";
import Procedures from "../../../settings/activityProcedure/index";
import ConfirmationModal from "../ConfirmationModal";
import PreviousSurveyModal from "./PreviousSurveyModal";
import ViewOnlyFastDetails from "../viewOnlyForms/ViewOnlyFastDetails";
import Portal from "../Portal";
import Forms from "../../../settings/activityForm/index";
import SendEmailModal from "../../../email/components/sendEmailModal";
import ToastMsg from "../../ToastMessage";

const rulesForToolTip = firedrillsTooltips;

class FireDrillsQuaterlyFormModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            surveyDetails: {},
            activeTab: 1,
            formParams: {
                id: null,
                schedule_id: null,
                due_date: null,
                actual_date: null,
                corrected_date: null,
                comments: null,
                performed_by: null,
                logbook_document_ids: this.props.selectedSurveyDocuments || [],
                activity_id: "",
                score: null,
                result: "Pass",
                actual_day: null,
                actual_time: null,
                transmission_of_signal: "no",
                location: null,
                invalid_interval: false
            },
            initialFormParams: null,
            errorParams: {
                actual_date: false,
                actual_time: false,
                performed_by: false,
                score: false,
                transmission_of_signal: false,
                number: false,
                location: false
            },
            showErrorBorder: false,
            confirmPopUpMessage: null,
            selectedDocToDelete: null,
            isCancelConfirmation: false,
            showPreviousSurveyModal: false,
            showSendEmailModal: false,
            showDayWarningModal: false,
            showLocationWarningModal: false,
            showIntervalWarningModal: false,
            isFetchingImage: false,
            initialActualTime: null,
            shift_start: "",
            shift_end: ""
        };
    }

    componentDidMount = async () => {
        const { formParams } = this.state;
        const { selectedEvent, selectedSchedule, surveyDetails, selectedSurveyDocuments } = this.props;
        await this.setState({
            formParams: {
                ...formParams,
                id: selectedEvent,
                schedule_id: selectedSchedule,
                due_date: surveyDetails.due_date ? new Date(surveyDetails.due_date) : null,
                actual_date: surveyDetails.actual_date ? new Date(surveyDetails.actual_date) : null,
                corrected_date: surveyDetails.corrected_date ? new Date(surveyDetails.corrected_date) : null,
                comments: surveyDetails.comments,
                performed_by: surveyDetails.performed_by,
                logbook_document_ids: selectedSurveyDocuments || [],
                activity_id: surveyDetails.activity_id || "",
                score: surveyDetails.score || "",
                result: surveyDetails.result || "Pass",
                actual_day: surveyDetails.actual_day || "",
                actual_time: surveyDetails.actual_time || "",
                transmission_of_signal: surveyDetails.transmission_of_signal || "no",
                location: surveyDetails.location || "",
                invalid_interval: surveyDetails.invalid_interval || false
            },
            initialActualTime: surveyDetails.actual_time || "",
            shift_start: surveyDetails?.schedule?.shift_start || null,
            shift_end: surveyDetails?.schedule?.shift_end || null,
            checkShift: false
        });
        // this.validateTime(surveyDetails.actual_time);
        this.setInitialFormParams();
        this.getPreviousSurveys();
        this.getPreviousLocations();
        toggleTooltip();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        const { selectedSurveyDocuments,surveyDetails } = this.props;
        if (prevProps.selectedSurveyDocuments !== selectedSurveyDocuments) {
            const { formParams } = this.state;
            await this.setState({
                formParams: {
                    ...formParams,
                    logbook_document_ids: selectedSurveyDocuments || []
                }
            });
        }
        if (prevProps.surveyDetails.actual_time !== surveyDetails.actual_time) {
        this.validateTime(surveyDetails.actual_time);
        }
        toggleTooltip();
    };

    getPreviousSurveys = () => {
        const { selectedEvent } = this.props;
        this.props.getPreviousSurveys(selectedEvent);
    };

    getPreviousLocations = () => {
        const { selectedEvent } = this.props;
        this.props.getPreviousLocations(selectedEvent);
    };

    getPreviousDays = async () => {
        const { selectedEvent } = this.props;
        await this.props.getPreviousDays(selectedEvent);
        return true;
    };

    setInitialFormParams = async () => {
        const { formParams } = this.state;
        await this.setState({
            initialFormParams: formParams
        });
    };

    validateTime = actual_time => {
        const { previous_surveys = null } = this.props;
        let duration = moment.duration({ minutes: 60 });
        let newTime = moment(actual_time, "HH:mm");
        let format = "hh:mm a";
        let shiftNewTime = moment(actual_time, format);
        let timeCompResult =
            previous_surveys &&
            previous_surveys.map(
                item => newTime >= moment(item.actual_time, "HH:mm").subtract(duration) && newTime <= moment(item.actual_time, "HH:mm").add(duration)
            );
        let startTime = moment(this.state.shift_start, format);
        let endTime = moment(this.state.shift_end, format);
        
        let isOutsideShift = true;
        if (startTime > endTime) {
            if (
                (shiftNewTime >= startTime && shiftNewTime <= moment("23.59", format)) ||
                (shiftNewTime >= moment("00.00", format) && shiftNewTime <= endTime)
            ) {
                isOutsideShift = false;
            }
        } else {
            if (shiftNewTime.isBetween(startTime, endTime, null, [])) {
                isOutsideShift = false;
            } else if (shiftNewTime === startTime || shiftNewTime === endTime) {
                isOutsideShift = false;
            } else {
                isOutsideShift = true;
            }
        }

        if (isOutsideShift) {
            this.setState({
                checkShift: true,
                formParams: {
                    ...this.state.formParams,
                    invalid_interval: true
                }
            });

            return false;
        } else if (timeCompResult && timeCompResult.includes(true)) {
            this.setState({
                checkShift: false,
                formParams: {
                    ...this.state.formParams,
                    invalid_interval: true
                }
            });
            return false;
        } else {
            this.setState({
                checkShift: false,
                formParams: {
                    ...this.state.formParams,
                    invalid_interval: false
                }
            });
        }
        return true;
    };
    validateLocation = location => {
        const { previous_locations } = this.props;
        let locationCompResult = previous_locations.map(item => item && item.toLowerCase().trim() === location.toLowerCase().trim());
        if (locationCompResult.includes(true)) return false;
        return true;
    };

    validate = () => {
        const { formParams, initialActualTime } = this.state;
        const { formSettings } = this.props;
        let errorParams = {
            actual_date: false,
            actual_time: false,
            performed_by: false,
            score: false,
            transmission_of_signal: false,
            number: false,
            location: false
        };
        let user_role = localStorage.getItem("user_role");
        let showErrorBorder = false;
        if (formSettings && formSettings.score.required) {
            if (!formParams.score || (formParams.score && !_.isNumber(parseInt(formParams.score)))) {
                errorParams.score = "Score is required";
                showErrorBorder = true;
            }
        }
        if (!formParams.actual_date || !_.isDate(formParams.actual_date)) {
            errorParams.actual_date = "Actual Date is required";
            showErrorBorder = true;
        }
        if (!formParams.performed_by || !formParams.performed_by.trim().length) {
            errorParams.performed_by = "Performed By is required";
            showErrorBorder = true;
        }
        if (formSettings && formSettings.transmission_of_signal.required) {
            if (formParams.transmission_of_signal !== "yes") {
                errorParams.transmission_of_signal = "Transmission Of Signal is required";
                showErrorBorder = true;
            }
        }
        if (!formParams.actual_time || !formParams.actual_time.trim().length) {
            errorParams.actual_time = "Actual Time is required";
            showErrorBorder = true;
        }
        if (formParams.actual_time && formParams.actual_time.length) {
            if (user_role !== "super_admin" && initialActualTime !== formParams.actual_time) {
                if (!this.validateTime(formParams.actual_time)) {
                    errorParams.actual_time = "Actual time is in Invalid Interval";
                    showErrorBorder = true;
                }
            }
        }
        if (formSettings && formSettings.location.required) {
            if (!formParams.location || !formParams.location.trim().length) {
                errorParams.location = "Location is required";
                showErrorBorder = true;
            }
        }

        this.setState({
            showErrorBorder,
            errorParams
        });

        if (showErrorBorder) return false;
        return true;
    };

    saveActivityEvent = () => {
        if (this.validate()) {
            const { formParams } = this.state;
            const { formSettings } = this.props;
            let survey = {
                due_date: formParams.due_date,
                actual_date: formParams.actual_date,
                comments: formParams.comments,
                performed_by: formParams.performed_by,
                schedule_id: formParams.schedule_id,
                logbook_document_ids: formParams.logbook_document_ids
            };
            let form = {
                score: formParams.score,
                result: formParams.result,
                actual_day: formParams.actual_day,
                actual_time: formParams.actual_time,
                transmission_of_signal: formParams.transmission_of_signal,
                location: formParams.location,
                corrected_date: formParams.corrected_date,
                surveyable_type: "FireDrillQuarterForm",
                invalid_interval: formParams.invalid_interval
            };
            if (!formSettings || !formSettings.score.visible) {
                delete form.score;
            }
            if (!formSettings || !formSettings.transmission_of_signal.visible) {
                delete form.transmission_of_signal;
            }
            if (!formSettings || !formSettings.location.visible) {
                delete form.location;
            }

            this.props.saveActivityEvent({ survey, form, id: formParams.id });
        }
    };

    togglShowConfirmation = () => {
        const { showConfirmation } = this.state;
        this.setState({
            showConfirmation: !showConfirmation
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmation, confirmPopUpMessage = null, selectedDocToDelete, isCancelConfirmation } = this.state;
        if (!showConfirmation) return null;

        return (
            <Portal
                body={
                    <ConfirmationModal
                        onCancel={this.togglShowConfirmation}
                        onOk={
                            isCancelConfirmation
                                ? this.props.onCancel
                                : selectedDocToDelete
                                ? this.removeAttachmentOnConfirm
                                : this.saveActivityEventOnConfirmation
                        }
                        heading={"Do you want to Continue ?"}
                        paragraph={confirmPopUpMessage || '"Device Count Updated" and/or "Device Comments" are missing, Do you want to continue?'}
                    />
                }
                onCancel={this.togglShowConfirmation}
            />
        );
    };

    togglShowPreviousSurveyModal = () => {
        const { showPreviousSurveyModal } = this.state;
        this.setState({
            showPreviousSurveyModal: !showPreviousSurveyModal
        });
    };

    renderPreviousSurveyModal = () => {
        const { showPreviousSurveyModal } = this.state;
        if (!showPreviousSurveyModal) return null;
        const { previous_surveys, previous_locations } = this.props;
        return (
            <Portal
                body={
                    <PreviousSurveyModal
                        onCancel={this.togglShowPreviousSurveyModal}
                        previous_surveys={previous_surveys}
                        previous_locations={previous_locations}
                    />
                }
                onCancel={this.togglShowPreviousSurveyModal}
            />
        );
    };

    removeAttachmentOnConfirm = async () => {
        const { removeAttachment } = this.props;
        const { selectedDocToDelete } = this.state;
        await removeAttachment(selectedDocToDelete.id);
        this.removeUnsavedAttachment(selectedDocToDelete.logbook_document_id);
        await this.setState({
            confirmPopUpMessage: null,
            selectedDocToDelete: null
        });
        this.togglShowConfirmation();
    };

    removeAttachment = async item => {
        await this.setState({
            confirmPopUpMessage: "This action can not be reverted, Do you want to continue?",
            selectedDocToDelete: item
        });
        this.togglShowConfirmation();
    };

    getSurveyDocId = logbook_document_id => {
        const { surveyDetails } = this.props;
        let surveyDocId = null;
        let surDocObj = null;
        if (surveyDetails.survey_documents && surveyDetails.survey_documents.length) {
            surDocObj = surveyDetails.survey_documents.find(item => item.logbook_document_id === logbook_document_id);
            if (surDocObj) {
                surveyDocId = surDocObj.id;
            }
        }
        return surveyDocId;
    };

    isNotSved = logbook_document_id => {
        const { surveyDetails } = this.props;
        if (surveyDetails.survey_documents && surveyDetails.survey_documents.length) {
            if (surveyDetails.survey_documents.find(item => item.logbook_document_id === logbook_document_id)) return false;
        }
        return true;
    };

    removeUnsavedAttachment = id => {
        const { selectedSurveyDocuments } = this.props;
        let tempSelectedDocs = selectedSurveyDocuments;
        tempSelectedDocs = tempSelectedDocs.filter(item => item !== id);
        this.props.UpdateSelectedSurveyDocuments(tempSelectedDocs);
    };

    isDatePassed = threshold_end => {
        let today = new Date();
        if (new Date(threshold_end).setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)) {
            return true;
        }
        return false;
    };

    hasBorder = (threshold_start, threshold_end) => {
        return (
            new Date(threshold_start).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0) &&
            new Date(threshold_end).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)
        );
    };

    setActiveTab = async activeTab => {
        if (activeTab === 2) {
            // await this.getAssignLogbookPopupDetails();
        }
        await this.setState({
            activeTab
        });
    };

    onCancel = async () => {
        const { formParams, initialFormParams } = this.state;
        if (!_.isEqual(formParams, initialFormParams)) {
            await this.setState({
                isCancelConfirmation: true,
                confirmPopUpMessage: "All your changes will be lost, Do you want to continue?"
            });
            this.togglShowConfirmation();
        } else {
            this.props.onCancel();
        }
    };

    takeScreenShot = async element => {
        try {
            let blob = await htmlToImage.toBlob(element, { quality: 1 });
            return blob;
        } catch (error) {
            console.error("Faild to capture screenshot!!", error);
            return null;
        }
    };

    generateImageForEmail = async () => {
        await this.setState({ isFetchingImage: true });
        let element = document.getElementById("aep-tab-contents");
        let blob = null;
        if (element) {
            let divsToHide = element.getElementsByClassName("material-icons");
            let scrollContent = document.getElementById("gt-content-section");
            if (divsToHide && divsToHide.length) {
                for (let i = 0; i < divsToHide.length; i++) {
                    divsToHide[i].style.visibility = "hidden";
                    divsToHide[i].style.display = "none";
                }
            }
            if (scrollContent) {
                scrollContent.style.maxHeight = "none";
                scrollContent.style.overflowY = "auto";
            }
            blob = await this.takeScreenShot(element);
            if (divsToHide && divsToHide.length) {
                for (let i = 0; i < divsToHide.length; i++) {
                    divsToHide[i].style.visibility = "visible";
                    divsToHide[i].style.display = "inline-flex";
                }
            }
            if (scrollContent) {
                scrollContent.style.maxHeight = "75vh";
                scrollContent.style.overflowY = "scroll";
            }
        }
        await this.setState({
            attachmentForEmail: blob,
            isFetchingImage: false
        });
        return true;
    };

    sendEventEmail = async () => {
        await this.setState({
            attachmentForEmail: null
        });
        this.toggleShowSendEmailModal();
    };

    toggleShowSendEmailModal = () => {
        const { showSendEmailModal } = this.state;
        this.setState({ showSendEmailModal: !showSendEmailModal });
    };

    renderSendEmailModal = () => {
        const { showSendEmailModal, attachmentForEmail } = this.state;
        if (!showSendEmailModal) return null;
        return (
            <Portal
                body={
                    <SendEmailModal
                        entity={"survey"}
                        isEventEmail={true}
                        attachmentForEmail={attachmentForEmail}
                        generateImageForEmail={this.generateImageForEmail}
                        path={"/api/v1/surveys/send_email"}
                        onCancel={() => this.setState({ showSendEmailModal: false })}
                    />
                }
                onCancel={() => this.setState({ showSendEmailModal: false })}
            />
        );
    };

    checkPreviousDay = async day => {
        await this.getPreviousDays();
        const { previous_days } = this.props;
        let weekArray = moment.weekdays();
        let tempPreviousDays = previous_days;
        if (previous_days && !previous_days.includes(day)) {
            tempPreviousDays.push(day);
        }
        let nonMatchingItems = weekArray.filter(item => !tempPreviousDays.includes(item));
        if (nonMatchingItems && nonMatchingItems.length) {
            this.toggleShowDayWarningModal(true);
        }
    };

    toggleShowDayWarningModal = () => {
        const { showDayWarningModal } = this.state;
        this.setState({ showDayWarningModal: !showDayWarningModal });
    };

    rendeDayWarningModal = () => {
        const {
            showDayWarningModal,
            formParams: { actual_day }
        } = this.state;
        if (!showDayWarningModal) return null;

        const { previous_days } = this.props;
        let weekArray = moment.weekdays();
        let tempPreviousDays = previous_days;
        if (!previous_days.includes(actual_day)) {
            tempPreviousDays.push(actual_day);
        }
        let nonMatchingItems = weekArray.filter(item => !tempPreviousDays.includes(item));

        return (
            <Portal
                body={
                    <ConfirmationModal
                        onCancel={this.toggleShowDayWarningModal}
                        onOk={this.toggleShowDayWarningModal}
                        okText={"YES"}
                        cancelText={"NO"}
                        heading={"Are you sure?"}
                        paragraph={"No drill happened on " + nonMatchingItems.toString() + " in the past 12 events. Do you want to continue?"}
                    />
                }
                onCancel={() => this.setState({ showDayWarningModal: false })}
            />
        );
    };

    toggleShowLocationWarningModal = () => {
        const { showLocationWarningModal } = this.state;
        this.setState({ showLocationWarningModal: !showLocationWarningModal });
    };

    rendeLocationWarningModal = () => {
        const { showLocationWarningModal } = this.state;
        if (!showLocationWarningModal) return null;

        return (
            <Portal
                body={
                    <ConfirmationModal
                        onCancel={this.toggleShowLocationWarningModal}
                        onOk={this.toggleShowLocationWarningModal}
                        okText={"YES"}
                        cancelText={"NO"}
                        heading={"Are you sure?"}
                        paragraph={"Previous Location is not allowed for this drill. Do you want to continue?"}
                    />
                }
                onCancel={() => this.setState({ showLocationWarningModal: false })}
            />
        );
    };

    toggleShowIntervalWarningModal = () => {
        const { showIntervalWarningModal } = this.state;
        this.setState({ showIntervalWarningModal: !showIntervalWarningModal });
    };

    rendeIntervalWarningModal = () => {
        const { showIntervalWarningModal, checkShift } = this.state;
        if (!showIntervalWarningModal) return null;

        return (
            <Portal
                body={
                    <ConfirmationModal
                        onCancel={this.toggleShowIntervalWarningModal}
                        onOk={() => {
                            this.toggleShowIntervalWarningModal();
                        }}
                        okText={"YES"}
                        cancelText={"NO"}
                        heading={"Are you sure?"}
                        paragraph={
                            checkShift
                                ? "Actual time is outside shift hours. Do you want to continue?"
                                : "Selected time is within the invalid interval. Do you want to continue?"
                        }
                    />
                }
                onCancel={() => this.setState({ showIntervalWarningModal: false })}
            />
        );
    };

    handleActualTimeChange = async value => {
        if (!this.validateTime(this.state.formParams.actual_time)) {
            this.toggleShowIntervalWarningModal();
        }
    };

    render() {
        const {
            toggleShowActivityEventDocumentsModal,
            surveyDetails,
            selectedSurveyDocuments,
            logbookDocuments,
            showCreateActivityEventSchedule,
            formSettings,
            onCancel
        } = this.props;

        const { formParams, showErrorBorder, errorParams, activeTab, isFetchingImage } = this.state;
        let audit_mode = localStorage.getItem("audit_mode") && localStorage.getItem("audit_mode") === "true" ? true : false;
        let user_role = localStorage.getItem("user_role");

        if (audit_mode) {
            return (
                <ViewOnlyFastDetails
                    toggleShowActivityEventDocumentsModal={toggleShowActivityEventDocumentsModal}
                    surveyDetails={surveyDetails}
                    selectedSurveyDocuments={selectedSurveyDocuments}
                    logbookDocuments={logbookDocuments}
                    showCreateActivityEventSchedule={showCreateActivityEventSchedule}
                    formParams={formParams}
                    showErrorBorder={showErrorBorder}
                    errorParams={errorParams}
                    activeTab={activeTab}
                    setActiveTab={this.setActiveTab}
                    onCancel={onCancel}
                />
            );
        }

        return (
            <React.Fragment>
                <div
                    className="modal activity-event-modal event-detail-modal fire-drills-quaterly-modal"
                    role="dialog"
                    style={{ display: "block" }}
                    id="modalId"
                >
                    <ReactTooltip id="activity_event_modal" effect="solid" />
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" id="aep-tab-contents">
                            <BuildModalHeader
                                title={
                                    surveyDetails && surveyDetails.series_number
                                        ? `Series Activity Event (${surveyDetails.series_number})`
                                        : "Single Activity Event"
                                }
                                onCancel={this.onCancel}
                                modalClass="event-detail-modal"
                            />
                            <div className="modal-body">
                                <div className="tab-section">
                                    <ul>
                                        <li className={`cursor-pointer ${activeTab === 1 ? "active" : null}`} onClick={() => this.setActiveTab(1)}>
                                            <span className="numb">01</span>
                                            <span className="nme">Basic Info</span>
                                        </li>
                                        <li className={`cursor-pointer ${activeTab === 2 ? "active" : null}`} onClick={() => this.setActiveTab(2)}>
                                            <span className="numb">02</span>
                                            <span className="nme">Assigned Procedures</span>
                                        </li>
                                        <li className={`cursor-pointer ${activeTab === 3 ? "active" : null}`} onClick={() => this.setActiveTab(3)}>
                                            <span className="numb">03</span>
                                            <span className="nme">Assigned Forms</span>
                                        </li>
                                    </ul>
                                </div>
                                {activeTab === 1 ? (
                                    <div className="aep-tab-contents">
                                        <div className="box-section">
                                            {surveyDetails.asset && surveyDetails.asset.name ? (
                                                <>
                                                    <div className="col-md-2 box-layer">
                                                        <h3>Building</h3>
                                                        <h4>{surveyDetails.building && surveyDetails.building.name}</h4>
                                                    </div>
                                                    <div className="col-md-2 box-layer">
                                                        <h3>Asset Name</h3>
                                                        <h4>{surveyDetails.asset && surveyDetails.asset.name ? surveyDetails.asset.name : null}</h4>
                                                    </div>
                                                    <div className="col-md-2 box-layer">
                                                        <h3>Test Frequency</h3>
                                                        <h4>{surveyDetails.schedule && surveyDetails.schedule.test_frequency}</h4>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="col-md-3 box-layer">
                                                        <h3>Building</h3>
                                                        <h4>{surveyDetails.building && surveyDetails.building.name}</h4>
                                                    </div>
                                                    <div className="col-md-3 box-layer">
                                                        <h3>Test Frequency</h3>
                                                        <h4>{surveyDetails.schedule && surveyDetails.schedule.test_frequency}</h4>
                                                    </div>
                                                </>
                                            )}
                                            <div className="col-md-5 box-layer">
                                                <h3>Activity</h3>
                                                <h4>
                                                    {surveyDetails.schedule &&
                                                        ` ${surveyDetails.schedule.activity_description} (${
                                                            this.state.shift_start ? this.state.shift_start : "--:--"
                                                        } - ${this.state.shift_end ? this.state.shift_end : "--:--"}) `}
                                                </h4>
                                            </div>
                                            <div className="col-md-1 box-layer hide-on-view-only">
                                                {surveyDetails.icon && surveyDetails.color ? (
                                                    <div
                                                        className="icon-date-wrapper text-center title-tip title-tip-up"
                                                        style={{ background: `${surveyDetails.color}` }}
                                                        data-toggle="tooltip"
                                                        title={rulesForToolTip[surveyDetails.icon]}
                                                    >
                                                        <span className="icon-img text-center">
                                                            <img src={`/images/${surveyDetails.icon}`} alt="" />
                                                        </span>
                                                    </div>
                                                ) : surveyDetails.color ? (
                                                    <div
                                                        className="icon-date-wrapper text-center"
                                                        style={{ background: `${surveyDetails.color}` }}
                                                        data-toggle="tooltip"
                                                        title={rulesForToolTip.completed}
                                                    ></div>
                                                ) : this.isDatePassed(surveyDetails.threshold_end) ? (
                                                    <div
                                                        className="icon-date-wrapper text-center"
                                                        style={{ background: "#F59089" }}
                                                        data-toggle="tooltip"
                                                        title={rulesForToolTip["plus-icn-red.svg"]}
                                                    >
                                                        <span className="icon-img text-center">
                                                            <img src={`/images/plus-icn-red.svg`} alt="" />
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className={`icon-date-wrapper text-center ${
                                                            this.hasBorder(surveyDetails.threshold_start, surveyDetails.threshold_end)
                                                                ? "border-highlight"
                                                                : ""
                                                        }`}
                                                        style={{ background: "#BFFFBF" }}
                                                        data-toggle="tooltip"
                                                        title={
                                                            this.hasBorder(surveyDetails.threshold_start, surveyDetails.threshold_end)
                                                                ? "Add Survey in Threshold"
                                                                : rulesForToolTip["plus-icn.svg"]
                                                        }
                                                    >
                                                        <span className="icon-img text-center">
                                                            <img src={`/images/plus-icn.svg`} alt="" />
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-md-2 box-layer hide-on-view-only">
                                                <h3>Threshold Window</h3>
                                                <h4>
                                                    {surveyDetails && surveyDetails.threshold_start} to {surveyDetails && surveyDetails.threshold_end}
                                                </h4>
                                            </div>
                                            <div className="col-md-2 box-layer">
                                                <h3>Next Due Date</h3>
                                                <h4>{surveyDetails && surveyDetails.next_due_date}</h4>
                                            </div>
                                            <div className="col-md-2 box-layer">
                                                <h3>Last performed</h3>
                                                <h4>{surveyDetails && surveyDetails.date_last_performed}</h4>
                                            </div>
                                            <div className="col-md-3 box-layer">
                                                <h3>Code Reference</h3>
                                                <h4>{surveyDetails.schedule && surveyDetails.schedule.code_reference}</h4>
                                            </div>
                                            <div className="col-md-3 box-layer">
                                                <h3>Flexible Date Calculation</h3>
                                                <h4>{surveyDetails && surveyDetails.flexible_date_calculation}</h4>
                                            </div>
                                        </div>

                                        <div className="box-form-sec">
                                            <div className="col-md-6 form-itm pr-0">
                                                <div className="itm">
                                                    <div className="form-group">
                                                        <label className={showErrorBorder && errorParams.performed_by ? "text-red" : ""}>
                                                            Perfomed By *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder=" "
                                                            value={formParams.performed_by}
                                                            onChange={e =>
                                                                this.setState({
                                                                    formParams: {
                                                                        ...formParams,
                                                                        performed_by: e.target.value
                                                                    }
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="itm">
                                                    <div className="form-group calendar">
                                                        <label>Due Date</label>
                                                        <input
                                                            type="text"
                                                            className="form-control cursor-not-allowed"
                                                            placeholder=" "
                                                            value={formParams.due_date && moment(new Date(formParams.due_date)).format("MM-DD-YYYY")}
                                                            disabled={true}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="itm">
                                                    <div className="form-group calendar">
                                                        <label className={showErrorBorder && errorParams.actual_date ? "text-red" : ""}>
                                                            Actual Date *
                                                        </label>
                                                        {isFetchingImage ? (
                                                            <input
                                                                type="text"
                                                                className="form-control cursor-not-allowed"
                                                                placeholder=" "
                                                                value={
                                                                    formParams.actual_date &&
                                                                    moment(new Date(formParams.actual_date)).format("MM-DD-YYYY")
                                                                }
                                                                disabled={true}
                                                            />
                                                        ) : (
                                                            <DatePicker
                                                                format="MM-dd-y"
                                                                className="form-control"
                                                                maxDate={localStorage.getItem("user_role") === "super_admin" ? null : new Date()}
                                                                onCalendarOpen={() => {
                                                                    if (!formParams.actual_date) {
                                                                        this.setState({
                                                                            formParams: {
                                                                                ...formParams,
                                                                                actual_date:
                                                                                    formParams.due_date &&
                                                                                    moment(new Date(formParams.due_date)).format("MM-DD-YYYY"),
                                                                                actual_day:
                                                                                    formParams.due_date && moment(formParams.due_date).format("dddd")
                                                                            }
                                                                        });
                                                                    }
                                                                }}
                                                                onChange={value => {
                                                                    this.setState({
                                                                        formParams: {
                                                                            ...formParams,
                                                                            actual_date: value,
                                                                            actual_day: moment(value).format("dddd")
                                                                        }
                                                                    });
                                                                    this.checkPreviousDay(moment(value).format("dddd"));
                                                                }}
                                                                value={formParams.actual_date && new Date(formParams.actual_date)}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="itm ">
                                                    <div className="form-group">
                                                        <label>Result</label>
                                                        <div className="custom-selecbox">
                                                            <select
                                                                className="custom-selecbox form-control"
                                                                onChange={e =>
                                                                    this.setState({
                                                                        formParams: {
                                                                            ...formParams,
                                                                            result: e.target.value
                                                                        }
                                                                    })
                                                                }
                                                                value={formParams.result}
                                                            >
                                                                <option value="Pass">Pass</option>
                                                                <option value="Fail">Fail</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                {formSettings && formSettings.score && formSettings.score.visible ? (
                                                    <div className="itm ">
                                                        <div className="form-group">
                                                            <label className={showErrorBorder && errorParams.score ? "text-red" : ""}>
                                                                Score {formSettings && formSettings.score.required ? "*" : null}
                                                            </label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                placeholder=" "
                                                                value={formParams.score}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        formParams: {
                                                                            ...formParams,
                                                                            score: e.target.value.length ? parseInt(e.target.value) : ""
                                                                        }
                                                                    })
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                ) : null}
                                                {formSettings && formSettings.location && formSettings.location.visible ? (
                                                    <div className="itm ">
                                                        <div className="form-group">
                                                            <label className={showErrorBorder && errorParams.location ? "text-red" : ""}>
                                                                Location {formSettings && formSettings.location.required ? "*" : null}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder=" "
                                                                value={formParams.location}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        formParams: {
                                                                            ...formParams,
                                                                            location: e.target.value
                                                                        }
                                                                    })
                                                                }
                                                                onBlur={e =>
                                                                    !formSettings.location.allow_same_value && !this.validateLocation(e.target.value)
                                                                        ? this.toggleShowLocationWarningModal()
                                                                        : null
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                ) : null}
                                                <div className="box-section mb-2 mt-1 col-md-12 p-0 hide-on-view-only">
                                                    <div className="col-md-6 box-layer">
                                                        <h3>Created At</h3>
                                                        <h4>{surveyDetails.created_at || "-"}</h4>
                                                    </div>
                                                    <div className="col-md-6 box-layer">
                                                        <h3>Updated At</h3>
                                                        <h4>{surveyDetails.updated_at || "-"}</h4>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 form-itm frm-1 pl-2">
                                                <div className="itm">
                                                    <div className="form-group calendar">
                                                        <label className={showErrorBorder && errorParams.actual_time ? "text-red" : ""}>
                                                            Actual Time *
                                                        </label>
                                                        {isFetchingImage ? (
                                                            <input
                                                                type="text"
                                                                className="form-control cursor-not-allowed"
                                                                placeholder=" "
                                                                value={
                                                                    formParams.actual_time
                                                                        ? moment(formParams.actual_time, "HH:mm").format("hh:mm a").toUpperCase()
                                                                        : "-"
                                                                }
                                                                disabled={true}
                                                            />
                                                        ) : (
                                                            <input
                                                                type="time"
                                                                className="form-control"
                                                                value={formParams.actual_time && formParams.actual_time}
                                                                onBlur={e => this.handleActualTimeChange(e.target.value)}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        formParams: {
                                                                            ...this.state.formParams,
                                                                            actual_time: e.target.value
                                                                        }
                                                                    })
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="itm">
                                                    <div className="form-group calendar">
                                                        <label>Actual Day</label>
                                                        <input
                                                            type="text"
                                                            className="form-control cursor-not-allowed"
                                                            placeholder=" "
                                                            value={formParams.actual_day && formParams.actual_day}
                                                            disabled={true}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="itm ">
                                                    <div className="form-group calendar">
                                                        <label>Corrected Date</label>
                                                        {isFetchingImage ? (
                                                            <input
                                                                type="text"
                                                                className="form-control cursor-not-allowed"
                                                                placeholder=" "
                                                                value={
                                                                    formParams.corrected_date &&
                                                                    moment(new Date(formParams.corrected_date)).format("MM-DD-YYYY")
                                                                }
                                                                disabled={true}
                                                            />
                                                        ) : (
                                                            <DatePicker
                                                                format="MM-dd-y"
                                                                className="form-control"
                                                                onCalendarOpen={() => {
                                                                    if (!formParams.corrected_date) {
                                                                        this.setState({
                                                                            formParams: {
                                                                                ...formParams,
                                                                                corrected_date:
                                                                                    formParams.actual_date &&
                                                                                    moment(new Date(formParams.actual_date)).format("MM-DD-YYYY")
                                                                            }
                                                                        });
                                                                    }
                                                                }}
                                                                onChange={value => {
                                                                    this.setState({
                                                                        formParams: {
                                                                            ...formParams,
                                                                            corrected_date: value
                                                                        }
                                                                    });
                                                                }}
                                                                value={formParams.corrected_date && new Date(formParams.corrected_date)}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="itm view-previous-three-surveys">
                                                    <div className="form-group">
                                                        <label>&nbsp;</label>
                                                        <button
                                                            className="btn bg-theme form-control"
                                                            onClick={() => this.togglShowPreviousSurveyModal()}
                                                        >
                                                            View Previous 3 Surveys
                                                        </button>
                                                    </div>
                                                </div>
                                                {formSettings &&
                                                formSettings.transmission_of_signal &&
                                                formSettings.transmission_of_signal.visible ? (
                                                    <div className="itm itm-check transmission-of-signal">
                                                        <div className="custom-control custom-checkbox">
                                                            <input
                                                                type="checkbox"
                                                                onClick={e =>
                                                                    this.setState({
                                                                        formParams: {
                                                                            ...formParams,
                                                                            transmission_of_signal:
                                                                                formParams.transmission_of_signal === "yes" ? "no" : "yes"
                                                                        }
                                                                    })
                                                                }
                                                                checked={formParams.transmission_of_signal === "yes" ? true : false}
                                                                className="custom-control-input"
                                                                id="transmission_of_signal"
                                                                name="example1"
                                                            />
                                                            <label
                                                                className={
                                                                    showErrorBorder && errorParams.transmission_of_signal
                                                                        ? "text-red custom-control-label"
                                                                        : "custom-control-label"
                                                                }
                                                                for="transmission_of_signal"
                                                            >
                                                                Transmission Of Signal
                                                            </label>
                                                        </div>
                                                    </div>
                                                ) : null}
                                                <div className="frm-comt">
                                                    <div className="form-group">
                                                        <label>Comments</label>
                                                        <textarea
                                                            className="form-control text-area"
                                                            value={formParams.comments}
                                                            onChange={e =>
                                                                this.setState({
                                                                    formParams: {
                                                                        ...formParams,
                                                                        comments: e.target.value
                                                                    }
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-sec">
                                            <div className="table-hed">
                                                <h3>Documents</h3>
                                                {checkPermission("event", "edit", "allow") ? (
                                                    <div
                                                        className="file-up hide-on-view-only"
                                                        onClick={() => toggleShowActivityEventDocumentsModal()}
                                                    >
                                                        <span className="icon">
                                                            <span className="material-icons"> attach_file </span>
                                                        </span>
                                                        Attach File
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className="table-section">
                                                <div className="table-data">
                                                    <table className="table table-bordered file-system-table">
                                                        <thead>
                                                            <tr>
                                                                <th className="img-sq-box">
                                                                    <img alt="" src="/images/table-blue-dots.svg" />
                                                                </th>
                                                                <th className="doc-name">File Name</th>
                                                                <th className="doc-type">Document Type</th>
                                                                <th className="date-sign">Date Signed</th>
                                                                <th className="sign-by">Signed By</th>
                                                                <th className="up-date hide-on-view-only">Date Uploaded</th>
                                                                <th className="up-by hide-on-view-only">Uploaded By</th>
                                                                <th className="action">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {surveyDetails.survey_documents && surveyDetails.survey_documents.length
                                                                ? surveyDetails.survey_documents.map((item, i) => (
                                                                      <tr>
                                                                          <td className="img-sq-box">
                                                                              <img alt="" src="/images/table-dot-white.svg" />
                                                                          </td>
                                                                          <td>{item.name || "-"}</td>
                                                                          <td>{item.doc_type || "-"}</td>
                                                                          <td>{item.date_signed || "-"}</td>
                                                                          <td>{item.signed_by || "-"}</td>
                                                                          <td className="hide-on-view-only">{item.date_uploaded || "-"}</td>
                                                                          <td className="hide-on-view-only">{item.uploaded_by || "-"}</td>
                                                                          <td>
                                                                              <div className="action-btn">
                                                                                  <a href={item.url} target="_blank" className="btn btn-view">
                                                                                      View Document
                                                                                  </a>
                                                                                  {checkPermission("event", "edit", "allow") ? (
                                                                                      <button
                                                                                          className="btn btn-delete hide-on-view-only"
                                                                                          onClick={() => this.removeAttachment(item)}
                                                                                      >
                                                                                          <span className="material-icons">delete</span>
                                                                                      </button>
                                                                                  ) : null}
                                                                              </div>
                                                                          </td>
                                                                      </tr>
                                                                  ))
                                                                : null}
                                                            {selectedSurveyDocuments.length && logbookDocuments.length
                                                                ? logbookDocuments.map((item, i) => (
                                                                      <>
                                                                          {selectedSurveyDocuments.includes(item.id) && this.isNotSved(item.id) ? (
                                                                              <tr>
                                                                                  <td className="img-sq-box">
                                                                                      <img alt="" src="/images/table-dot-white.svg" />
                                                                                  </td>
                                                                                  <td>{item.name || "-"}</td>
                                                                                  <td>{item.doc_type || "-"}</td>
                                                                                  <td>{item.date_signed || "-"}</td>
                                                                                  <td>{item.signed_by || "-"}</td>
                                                                                  <td className="hide-on-view-only">{item.date_uploaded || "-"}</td>
                                                                                  <td className="hide-on-view-only">{item.uploaded_by || "-"}</td>
                                                                                  <td>
                                                                                      <div className="action-btn">
                                                                                          <a href={item.url} target="_blank" className="btn btn-view">
                                                                                              View Document
                                                                                          </a>
                                                                                          <button
                                                                                              className="btn btn-delete hide-on-view-only"
                                                                                              onClick={() => this.removeUnsavedAttachment(item.id)}
                                                                                          >
                                                                                              <span className="material-icons">close</span>
                                                                                          </button>
                                                                                      </div>
                                                                                  </td>
                                                                              </tr>
                                                                          ) : null}
                                                                      </>
                                                                  ))
                                                                : null}
                                                            {!selectedSurveyDocuments.length &&
                                                            surveyDetails.survey_documents &&
                                                            !surveyDetails.survey_documents.length ? (
                                                                <tr>
                                                                    <td className="text-center" colSpan="8">
                                                                        No records found !!
                                                                    </td>
                                                                </tr>
                                                            ) : null}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="btn-sec btn-survey-sec">
                                            {errorParams &&
                                                Object.keys(errorParams).map(key =>
                                                    showErrorBorder && errorParams[key] ? (
                                                        <p className="text-red text-error">* {errorParams[key]}</p>
                                                    ) : null
                                                )}

                                            <div className="btn-out-1">
                                                {checkPermission("event", "edit", "allow") ? (
                                                    <button
                                                        className="btn btn-create save mr-2 hide-on-view-only"
                                                        onClick={() => this.saveActivityEvent()}
                                                    >
                                                        <i className="material-icons tic"> check</i> Save
                                                    </button>
                                                ) : null}
                                                <button className="btn btn-create email mr-2 hide-on-view-only" onClick={() => this.sendEventEmail()}>
                                                    <i className="material-icons tic"> mail_outline</i> Send Email
                                                </button>
                                                {checkPermission("event", "modify_schedule", "allow") ? (
                                                    <button
                                                        className="btn btn-create modify hide-on-view-only"
                                                        onClick={() =>
                                                            showCreateActivityEventSchedule(
                                                                surveyDetails.schedule.id,
                                                                new Date(surveyDetails.due_date).getMonth(),
                                                                new Date(surveyDetails.due_date).getFullYear(),
                                                                "edit"
                                                            )
                                                        }
                                                    >
                                                        <i className="material-icons tic"> event</i>Modify Schedule
                                                    </button>
                                                ) : null}
                                                <button className="btn btn-cncl-back ml-2" onClick={() => this.onCancel()}>
                                                    <i className="material-icons tic"> close</i>Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : activeTab === 2 ? (
                                    <div className="aep-tab-contents">
                                        <div className="infoPageContent">
                                            <div className="cmon-ara">
                                                <Procedures hasAction={false} activityId={formParams.activity_id} viewOnly={true} />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="aep-tab-contents">
                                        <div className="infoPageContent">
                                            <div className="cmon-ara">
                                                <Forms hasAction={false} activityId={formParams.activity_id} viewOnly={true} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {this.renderConfirmationModal()}
                {this.renderPreviousSurveyModal()}
                {this.renderSendEmailModal()}
                {this.rendeDayWarningModal()}
                {this.rendeLocationWarningModal()}
                {this.rendeIntervalWarningModal()}
            </React.Fragment>
        );
    }
}

export default FireDrillsQuaterlyFormModal;
