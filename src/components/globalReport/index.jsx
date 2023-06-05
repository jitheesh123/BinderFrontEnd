import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";

import TopSlider from "../common/components/TopSlider";
import Loader from "../common/components/Loader";
import actions from "./actions";
import ToastMsg from "../common/ToastMessage";
import history from "../../config/history";
import CommonTable from "../common/components/CommonTable";
import TableTopHeader from "../common/components/TableTopHeader";
import Pagination from "../common/components/Pagination";
import Portal from "../common/components/Portal";
import ConfirmationModal from "../common/components/ConfirmationModal";
import { reportTableData } from "./components/tableConfig";
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
import { checkPermission } from "../../config/utils";
import CreateActivityEventScheduleModal from "../common/components/CreateActivityEventScheduleModal";


class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            historyPaginationParams: this.props.reportReducer.entityParams.historyPaginationParams,
            paginationParams: this.props.reportReducer.entityParams.paginationParams,
            historyParams: this.props.reportReducer.entityParams.historyParams,
            params: this.props.reportReducer.entityParams.params,
            selectedLogbook: this.props.match.params.id,
            newActivityYear: new Date().getFullYear(),
            newActivityMonth: new Date().getMonth(),
            showCreateActivityEventSchedule: false,
            showActivityEventDocumentsModal: false,
            showUploadDocumentModal: false,
            showFastFormModal: false,
            fastFormModaltype: "add",
            selectedSurveyDocuments: [],
            showConfirmModalLog: false,
            tableData: reportTableData,
            showWildCardFilter: false,
            showModifyNAModal: false,
            schedulePopupDetails: {},
            showConfirmation: false,
            showViewModal: false,
            selectedSchedule: null,
            isPopUpLoading: false,
            isRestoreOrDelete: "",
            logbookDocuments: [],
            selectedEvent: null,
            activeDocType: null,
            surveyDetails: null,
            selectedItem: null,
            reportDataList: [],
            reportsTitle: "",
            selectedLog: "",
            loading: true,
            logData: {
                count: "",
                data: []
            },
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
                keys: reportTableData.keys,
                config: 
                this.props.reportReducer.entityParams.tableConfig ||
                 reportTableData.config
            }
        });
        await this.getReportsData();
    };

    componentDidUpdate = async prevProps => {
        if (prevProps.masterFilters !== this.props.masterFilters) {
            await this.getReportsData();
        }
    };

    getReportsData = async () => {
        // this.props.setIsLoading(true);
        const {
            match: {
                params: { section }
            }
        } = this.props;
        const { params, paginationParams, } = this.state;
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        let responseData = [];
        let tempTitle = "";
        // console.log("check",master_filters)
        if(this.props.logbook_document_id && this.props.reportType){
            await this.props.getReports({ ...params,report_type:this.props.reportType,logbook_document_id:this.props.logbook_document_id, ...master_filters});
        }else{
            await this.props.getReports({ ...params, ...master_filters});
        }
        responseData = this.props.reportReducer.reportData.schedules || [];
        const { tableData } = this.state;
        if (this.props.reportReducer.reportData.success) {
            await this.setState({
                tableData: {
                    ...tableData,
                    data: responseData
                },
                paginationParams: {
                    ...paginationParams,
                    totalCount: this.props.reportReducer.reportData.count,
                    totalPages: Math.ceil(this.props.reportReducer.reportData.count / paginationParams.perPage)
                },
                showWildCardFilter: this.state.params.filters ? true : false,
                reportsTitle: tempTitle
            });
        }
        // this.props.setIsLoading(false);
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
        await this.getReportsData();
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
            selectedLogbook: id
        });
        this.togglShowConfirmation();
    };

    deleteItem = async () => {
        const { selectedLogbook } = this.state;
        this.togglShowConfirmation();
        await this.props.deleteLogbook(selectedLogbook);
        await this.getReportsData();
        ToastMsg(this.props.reportReducer.deletereportData.message, "info");
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
        params.search = search;
        params.filters = filters;
        params.list = list;
        if(this.props.logbook_document_id && this.props.reportType){
            await this.props.getListForCommonFilterForLogbook({ ...params,report_type:this.props.reportType,logbook_document_id:this.props.logbook_document_id});
        }else{
            await this.props.getListForCommonFilterForLogbook(params);
        }
        
        return (this.props.reportReducer.getListForCommonFilterResponse && this.props.reportReducer.getListForCommonFilterResponse.list) || [];
    };

    showInfoPage = id => {
        const { history } = this.props;
        this.setState({
            selectedLogbook: id,
            infoTabsData: [
                { label: "Basic Details", path: `/logbook/logbookinfo/${id}/basicdetails`, key: "basicdetails" },
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
        return this.props.reportReducer.getLogbookByIdResponse;
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
    //     let reportParams = this.setReportParams();
    if(this.props.logbook_document_id && this.props.reportType){
        await await this.props.exportReports({ ...params,report_type:this.props.reportType,logbook_document_id:this.props.logbook_document_id,name:"Assigned Report"});
    }else{
        await await this.props.exportReports(params);
    }
    };

    // setReportParams = () => {
    //     const { selectedDate, endDate } = this.state;
    //     const {
    //         match: {
    //             params: { section }
    //         }
    //     } = this.props;
    //     switch (section) {
    //         case "thresholdStart":
    //             return { report_type: "threshold_start", date: selectedDate, name: "Threshold Start" };
    //         case "thresholdWindow":
    //             return { report_type: "threshold_window", date: selectedDate, name: "Threshold Window" };
    //         case "thresholdMiddle":
    //             return { report_type: "threshold_middle", date: selectedDate, name: "Threshold Middle" };
    //         case "dueNextDay":
    //             return { report_type: "date", date: selectedDate, name: "Due Next Day" };
    //         case "dueToday":
    //             return { report_type: "date", date: selectedDate, name: "Due Today" };
    //         case "overDue":
    //             return { report_type: "over_due", date: selectedDate, end_date: endDate, name: "Over Due" };
    //         case "currentWeek":
    //             return { report_type: "range", date: selectedDate, end_date: endDate, name: "Current Week" };
    //         case "nextWeek":
    //             return { report_type: "range", date: selectedDate, end_date: endDate, name: "Next Week" };
    //         case "nextMonth":
    //             return { report_type: "range", date: selectedDate, end_date: endDate, name: "Next Month" };
    //         case "threshold3DayeEnd":
    //             return { report_type: "before_threshold", date: selectedDate, name: "Threshold 3 Day End" };
    //         case "nonCompliant":
    //             return { report_type: "non_compliant", date: selectedDate, end_date: endDate, name: "Non-Compliant" };
    //         case "incomplete":
    //             return { report_type: "incomplete", date: selectedDate, end_date: endDate, name: "Incomplete" };
    //         case "trailingViewReport":
    //             return { report_type: "trailing_view_report", date: selectedDate, end_date: endDate, name: "Trailing View Report" };
    //         case "completed":
    //             return { report_type: "completed", date: selectedDate, end_date: endDate, name: "Completed" };
    //         default:
    //             return { report_type: "completed", date: selectedDate, end_date: endDate, name: "Completed" };
    //     }
    // };

    getLogData = async id => {
        const { historyParams } = this.state;
        await this.props.getAllLogbookLogs(historyParams, id);
        const {
            reportReducer: {
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
        await this.props.restoreLogbookLog(id);
        await this.getReportsData();
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
                config: reportTableData.config
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
        });
        this.updateEntityParams();
        await this.getReportsData();
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

    // dateChange = async date => {
    //     await this.setState({
    //         selectedDate: date
    //     });
    //     this.getReportsData();
    // };

    // threshold3DayHandler = async days => {
    //     const tDate = new Date(moment(new Date()).add(days, "days"));
    //     await this.setState({
    //         selectedDate: tDate,
    //         noOfDays: days
    //     });
    //     this.getReportsData();
    // };

    // endDateChange = async date => {
    //     await this.setState({
    //         endDate: date
    //     });
    //     this.getReportsData();
    // };

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
                getSurveyDetailsResponse: { survey = {} }
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
                getLogbookDocumentsResponse: { documents = [] }
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
                saveActivityEventResponse: { message }
            }
        } = this.props;
        await this.getReportsData();
        this.toggleShowFastFormModal();
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
        const { tableData, params, paginationParams, showWildCardFilter, isPopUpLoading, noOfDays, reportsTitle } = this.state;
        const {
            match: {
                params: { section }
            },
            isLoading
        } = this.props;
        return (
            <React.Fragment>
                <section className="cont-ara">
                    <LoadingOverlay fadeSpeed={0} active={isPopUpLoading || isLoading} spinner={<Loader />}>
                        <div className="list-area">
                            <TopSlider />    
                            <div className="lst-bt-nav">
                                <div className="table table-ara">
                                    <TableTopHeader
                                        entity={reportsTitle + "Report"}
                                        isReportPage={true}
                                        // reportParams={this.setReportParams()}
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
                                        showAddButton={false}
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
                                                showInfoPage={this.handleActivityEventClick}
                                                exportTable={this.exportTable}
                                                updateCommonFilter={this.updateCommonFilter}
                                                hasActionColumn={false}
                                                hasTableViewDetails={true}
                                                isReportsPage={true}
                                                commonFilter={this.state.params.list}
                                                actionShow={false}
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
                    </LoadingOverlay>
                </section>
                {this.renderColumnViewHideModal()}
                {this.renderConfirmationModal()}
                {this.renderConfirmationModalLog()}
                {this.renderFastFormModal()}
                {this.renderActivityEventDocumentsModal()}
                {this.renderUploadDocumentModal()}
                {this.renderCreateActivityEventSchedule()}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { reportReducer, commonReducer } = state;
    return { reportReducer, commonReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions, ...commonActions  })(index));
