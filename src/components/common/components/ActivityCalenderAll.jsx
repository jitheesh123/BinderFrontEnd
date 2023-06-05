import React, { Component } from "react";
import { connect } from "react-redux";

import TopSlider from "./TopSlider";
import commonActions from "../actions";
import ActivityCalendarTableHeader from "./ActivityCalendarTableHeader";
import ActivityCalendarTableActivity from "./ActivityCalendarTableActivity";
import ActivityEventDocumentsModal from "./ActivityEventDocumentsModal";
import CreateActivityEventScheduleModal from "./CreateActivityEventScheduleModal";
import UploadDocumentModal from "./UploadDocumentModal";
import IconsAndColorLegandsModal from "./IconsAndColorLegandsModal";
import FastFormModal from "./eventForms/FastFormModal";
import ToastMsg from "../ToastMessage";
import Portal from "./Portal";
import Pagination from "./Pagination";
import { activityCalenderAllTableData } from "../../../config/tableConfig";
import ViewModal from "./ViewModal";
import ConfirmationModal from "./ConfirmationModal";
import DeviceCountModal from "./DeviceCountModal";

class ActivityCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCalendarExpanded: false,
            selectedLogbook: null,
            schedules: [],
            activityTableWidth: this.props.commonReducer.activityTableWidth || "0px",
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
            newActivityMonth: new Date().getMonth() || 0,
            newActivityYear: new Date().getFullYear() || 0,
            params: this.props.commonReducer.entityParamsAnnual.params,
            paginationParams: this.props.commonReducer.entityParamsAnnual.paginationParams,
            fastFormModaltype: "add",
            tableData: {
                keys: activityCalenderAllTableData.keys,
                config: activityCalenderAllTableData.config
            },
            showViewModal: false,
            showConfirmation: false,
            selectedItem: "",
            scrollTop: 0,
            showWildCardFilter: true,
            building_activity_id: null,
            showDeviceCountModal: false,
            device_documents: []
        };
    }

    componentDidMount = async () => {
        await this.setState({
            selectedLogbook: this.props.location.state && this.props.location.state.logbook,
            activityTableWidth: this.props.commonReducer.activityTableWidth || "0px",
            tableData: {
                keys: activityCalenderAllTableData.keys,
                config: activityCalenderAllTableData.config
            }
        });
        await this.refreshScheduleList();
    };

    updateYearParam = async tempYears => {
        const { params } = this.state;
        await this.setState({
            params: {
                ...params,
                years: tempYears
            }
        });
        await this.updateEntityParams();
        this.refreshScheduleList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            paginationParams: this.state.paginationParams,
            params: this.state.params
        };
        await this.props.updateActivityCalendarEntityParamsAnnual(entityParams);
        return true;
    };
    refreshScheduleList = async () => {
        const { paginationParams, params } = this.state;
        await this.props.getSchedulesByLogbookId({ ...params });
        const {
            commonReducer: {
                getSchedulesByLogbookId: { success, schedules, count }
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
        return true;
    };

    toggleIsCalendarExpanded = () => {
        const { isCalendarExpanded } = this.state;
        this.setState({
            isCalendarExpanded: !isCalendarExpanded
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
            this.toggleShowCreateActivityEventSchedule();
            await this.setState({
                showFastFormModal: false
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

    renderFastFormModal = () => {
        const { showFastFormModal, selectedEvent, selectedSchedule, surveyDetails, selectedSurveyDocuments, logbookDocuments } = this.state;
        if (!showFastFormModal) return null;
        return (
            <Portal
                body={
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
                }
                onCancel={this.toggleShowFastFormModal}
            />
        );
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

    saveActivityEvent = async formParams => {
        await this.props.saveActivityEvent(formParams, formParams.id);
        const {
            commonReducer: {
                saveActivityEventResponse: { message }
            }
        } = this.props;
        await this.refreshScheduleList();
        this.toggleShowFastFormModal();
        ToastMsg(message, "info");
    };

    handleActivityEventClick = async (selectedEvent, selectedSchedule) => {
        await this.setState({
            selectedEvent,
            selectedSchedule
        });
        await this.getSurveyDetails(selectedEvent, selectedSchedule);
        this.toggleShowFastFormModal();
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
                getLogbookDocumentsResponse: { documents = [] }
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
        await this.refreshScheduleList();
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
        await this.refreshScheduleList();
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
        await this.refreshScheduleList();
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
        await this.refreshScheduleList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        await this.refreshScheduleList();
    };

    exportTable = async () => {
        const { params } = this.state;
        await this.props.exportSchedules({
            search: params.search,
            filters: params.filters,
            list: params.list,
            order: params.order,
            years: params.years
        });
    };

    checkBuildingCount = () => {
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
        await this.refreshScheduleList();
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
                config: activityCalenderAllTableData.config
            }
        });
        await this.refreshScheduleList();
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
                onCancel={this.togglShowConfirmation}
            />
        );
    };

    deleteItemConfirm = async id => {
        await this.setState({
            selectedItem: id
        });
        this.togglShowConfirmation();
    };

    deleteItem = async () => {
        const { selectedItem } = this.state;
        this.togglShowConfirmation();
        await this.props.deleteSchedule(selectedItem);
        await this.refreshScheduleList();
        ToastMsg(this.props.commonReducer.deleteScheduleByIdResponse.message, "info");
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
        await this.reMountWildCardFilter();
        await this.refreshScheduleList();
        await this.reMountWildCardFilter();
    };

    reMountWildCardFilter = async () => {
        const { showWildCardFilter } = this.state;
        await this.setState({
            showWildCardFilter: !showWildCardFilter
        });
        return true;
    };

    getListForCommonFilter = async params => {
        const { search, filters, list } = this.state.params;
        params.search = search;
        params.filters = filters;
        params.list = list;
        await this.props.getListForCommonFilterForActivityCalender(params);
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
        this.refreshScheduleList();
    };

    toggleFilter = () => {
        this.setState({
            showWildCardFilter: !this.state.showWildCardFilter
        });
    };

    updateScrollTop = async scrollTop => {
        await this.setState({
            scrollTop
        });
    };

    handleDeviceCountClick = () => {
        return null;
    };

    handleDeviceCountClick = async (building_activity_id,asset_id) => {
        await this.setState({
            isPopUpLoading: true,
            building_activity_id,
            asset_id
        });
        await this.getDeviceDocuments();
        this.toggleShowDeviceCountModal();
        await this.setState({
            isPopUpLoading: false
        });
    };

    getDeviceDocuments = async () => {
        const { building_activity_id,asset_id } = this.state;
        await this.props.getDeviceDocuments(building_activity_id,asset_id);
        const {
            commonReducer: {
                getDeviceDocumentsResponse: { device_documents, success }
            }
        } = this.props;
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
        const { showDeviceCountModal, building_activity_id, device_documents } = this.state;
        if (!showDeviceCountModal) return null;
        return (
            <Portal
                body={
                    <DeviceCountModal
                        building_activity_id={building_activity_id}
                        device_documents={device_documents}
                        deleteDeviceCount={this.deleteDeviceCount}
                        saveDeviceCount={this.saveDeviceCount}
                        onCancel={this.toggleShowDeviceCountModal}
                    />
                }
                onCancel={this.toggleShowDeviceCountModal}
            />
        );
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

    render() {
        const {
            isCalendarExpanded,
            selectedLogbook,
            schedules,
            activityTableWidth,
            paginationParams,
            params,
            tableData,
            scrollTop,
            showWildCardFilter
        } = this.state;

        return (
            <section className="cont-ara">
                <div className="list-area fire-systm-cover zoom-point">
                    <TopSlider activeLogbook={selectedLogbook && selectedLogbook.id} />
                    <div className="lst-bt-nav fire-sytem-otr">
                        <div className="table table-ara">
                            <ActivityCalendarTableHeader
                                selectedLogbook={{}}
                                updateYearParam={this.updateYearParam}
                                params={params}
                                toggleShowIconsAndColorLegandsModal={this.toggleShowIconsAndColorLegandsModal}
                                handleGlobalSearch={this.handleGlobalSearch}
                                globalSearchKey={this.state.params.search}
                                showViewModal={this.showViewModal}
                                tableParams={params}
                                resetSort={this.resetSort}
                                exportTable={this.exportTable}
                                checkBuildingCount={this.checkBuildingCount}
                                resetAllFilters={this.resetAllFilters}
                                logbookById={false}
                                resetWildCardFilter={this.resetWildCardFilter}
                                toggleFilter={this.toggleFilter}
                            />
                            <div className="list-sec">
                                <div className="file-system-table-cover activity-all">
                                    <ActivityCalendarTableActivity
                                        setActivityTableWidth={this.setActivityTableWidth}
                                        activityTableWidth={activityTableWidth}
                                        isCalendarExpanded={isCalendarExpanded}
                                        schedules={schedules}
                                        tableData={tableData}
                                        updateTableSortFilters={this.updateTableSortFilters}
                                        tableParams={params}
                                        updateWildCardFilter={this.updateWildCardFilter}
                                        logbookById={false}
                                        deleteItem={this.deleteItemConfirm}
                                        updateScrollTop={this.updateScrollTop}
                                        handleDeviceCountClick={this.handleDeviceCountClick}
                                        scrollTop={scrollTop}
                                        getListForCommonFilter={this.getListForCommonFilter}
                                        updateCommonFilter={this.updateCommonFilter}
                                        showWildCardFilter={showWildCardFilter}
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
                {this.renderActivityEventDocumentsModal()}
                {this.renderCreateActivityEventSchedule()}
                {this.renderUploadDocumentModal()}
                {this.renderFastFormModal()}
                {this.renderIconsAndColorLegandsModal()}
                {this.renderColumnViewHideModal()}
                {this.renderConfirmationModal()}
                {this.renderDeviceCountModal()}
            </section>
        );
    }
}

const mapStateToProps = state => {
    const { commonReducer } = state;
    return { commonReducer };
};

export default connect(mapStateToProps, { ...commonActions })(ActivityCalendar);
