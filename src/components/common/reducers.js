import * as actionTypes from "./constants";

const initialState = {
    isLoading: true,
    allLogbooksResponse: {},
    getSchedulesByLogbookId: {},
    getTrailingSchedulesByLogbookIdResponse: {},
    activityTableWidth: "0px",
    getSurveyDetailsResponse: {},
    getLogbookDocumentsResponse: {},
    saveActivityEventResponse: {},
    uploadDocumentsResponse: {},
    removeAttachmentResponse: {},
    getActivityEventPopupDetailsResponse: {},
    executeActivityEventResponse: {},
    getAssignActivityPopupDetailsResponse: {},
    getAssignBuildingActivitiesPopupDetailsResponse: {},
    getCreateSurveyPopupDetailsResponse: {},
    getCurrentAssignmentsResponse: {},
    assignActivityToBuildingResponse: {},
    assignClientActivityToBuildingResponse: {},
    createSurveyResponse: {},
    getAssignLogbookPopupDetailsResponse: {},
    getAssignLogbookForConsultancyPopupDetailsResponse: {},
    getAssignActivityForConsultancyPopupDetailsResponse: {},
    getAssignActivityForClientPopupDetailsResponse: {},
    getAssignLogbookForClientPopupDetailsResponse: {},
    getCreateSurveyPopupDetailsForBuildingResponse: {},
    getCreateSurveyPopupDetailsForBuildingActivitiesResponse: {},
    assignLogbookToBuildingResponse: {},
    assignLogbookToConsultancyResponse: {},
    assignActivityToConsultancyResponse: {},
    assignActivityToClientResponse: {},
    assignLogbookToClientResponse: {},
    deleteScheduleByIdResponse: {},
    getListForCommonFilterResponse: {},
    getUndoNaPopupDetailsResponse: {},
    undoNaResponse: {},
    getAssignDeemingAgencyForFrequencyPopupDetailsResponse: {},
    assignDeemingAgencyToFrequencyResponse: {},
    assignFrequencyToDeemingAgencyResponse: {},
    getAssignFrequencyForDeemingAgencyPopupDetailsResponse: {},
    AssignPopUpApiTrigger: {},
    frequencyDeemingAgencyApiTrigger: {},
    getAssignUserForSectorPopupDetailsResponse: {},
    assignUsersToSectionResponse: {},
    getAssignUserForCampusPopupDetailsResponse: {},
    assignUsersToCampusResponse: {},
    getAssignUserForBuildingPopupDetailsResponse: {},
    assignUsersToBuildingResponse: {},
    getAssignBuildingLogbookToUserPopupDetailsResponse: {},
    assignBuildingLogbookToUserResponse: {},
    getAssignBuildingToUserPopupDetailsResponse: {},
    assignBuildingToUserResponse: {},
    getAssignConsultancyToLogbookPopupDetailsResponse: {},
    assignConsultancyToLogbookResponse: {},
    getAssignClientToLogbookPopupDetailsResponse: {},
    assignClientToLogbookResponse: {},
    getAssignBuildingToLogbookPopupDetailsResponse: {},
    assignBuildingToLogbookResponse: {},
    getLogbookCreateSurveyPopupDetailsResponse: {},
    createSurveyBuildingLogbookResponse: {},
    getAssignConsultancyToActivityPopupDetailsResponse: {},
    assignConsultancyToActivityResponse: {},
    getAssignClientToActivityPopupDetailsResponse: {},
    assignClientToActivityResponse: {},
    getAssignBuildingToActivityPopupDetailsResponse: {},
    assignBuildingToActivityResponse: {},
    getActivityCreateSurveyPopupDetailsResponse: {},
    createSurveyBuildingActivityResponse: {},
    getAssignProcedureToActivityPopupDetailsResponse: {},
    assignProcedureToActivityResponse: {},
    getUnReadNotificationsResponse: {},
    readNotificationResponse: {},
    deleteUnReadNotificationsResponse: {},
    getFilterDropdownDataResponse: {},
    getDeviceDocumentsResponse: {},
    saveDeviceCountResponse: {},
    setAuditModeResponse: {},
    getGLTDetailsResponse: {},
    getPreviousSurveysResponse: {},
    getPreviousLocationsResponse: {},
    getPreviousDaysResponse: {},
    fetchFormSettingsResponse: {},
    exportSchedulesResponse: {},
    checkBuildingCountResponse: {},
    deleteDeviceCountResponse: {},
    getScheduleDatesResponse: {},
    resetPasswordResponse: {},
    entityParams: {
        params: {
            limit: 100,
            page: 1,
            search: "",
            years: [new Date().getFullYear().toString()],
            filters: null,
            order: null,
            list: null,
            date_filters: null,
            view: null
        },
        paginationParams: {
            totalPages: 0,
            perPage: 100,
            currentPage: 0,
            totalCount: 0
        }
    },
    entityParamsAnnual: {
        params: {
            limit: 100,
            page: 1,
            search: "",
            years: [new Date().getFullYear().toString()],
            filters: null,
            order: null,
            list: null,
            date_filters: null,
            view: null
        },
        paginationParams: {
            totalPages: 0,
            perPage: 100,
            currentPage: 0,
            totalCount: 0
        }
    }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ALL_LOGBOOKS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ALL_LOGBOOKS_SUCCESS:
            return {
                ...state,
                allLogbooksResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ALL_LOGBOOKS_FAILURE:
            return {
                ...state,
                allLogbooksResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_SCHEDULES_BY_LOGBOOK_ID_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case actionTypes.GET_SCHEDULES_BY_LOGBOOK_ID_SUCCESS:
            return {
                ...state,
                getSchedulesByLogbookId: { success: true, ...action.response },
                isLoading: false
            };
        case actionTypes.GET_SCHEDULES_BY_LOGBOOK_ID_FAILURE:
            return {
                ...state,
                getSchedulesByLogbookId: { success: false, ...action.error },
                isLoading: false
            };

        case actionTypes.GET_TRAILING_SCHEDULES_BY_LOGBOOK_ID_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case actionTypes.GET_TRAILING_SCHEDULES_BY_LOGBOOK_ID_SUCCESS:
            return {
                ...state,
                getTrailingSchedulesByLogbookIdResponse: { success: true, ...action.response },
                isLoading: false
            };
        case actionTypes.GET_TRAILING_SCHEDULES_BY_LOGBOOK_ID_FAILURE:
            return {
                ...state,
                getTrailingSchedulesByLogbookIdResponse: { success: false, ...action.error },
                isLoading: false
            };

        case actionTypes.SET_ACTIVITY_TABLE_WIDTH_REQUEST:
            return {
                ...state
            };
        case actionTypes.SET_ACTIVITY_TABLE_WIDTH_SUCCESS:
            return {
                ...state,
                activityTableWidth: action.response
            };
        case actionTypes.SET_ACTIVITY_TABLE_WIDTH_FAILURE:
            return {
                ...state,
                activityTableWidth: { success: false, ...action.error }
            };

        case actionTypes.GET_ACTIVITY_TABLE_WIDTH_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ACTIVITY_TABLE_WIDTH_SUCCESS:
            return {
                ...state,
                activityTableWidth: { success: true, ...action.response }
            };
        case actionTypes.GET_ACTIVITY_TABLE_WIDTH_FAILURE:
            return {
                ...state,
                activityTableWidth: { success: false, ...action.error }
            };

        case actionTypes.GET_SURVEY_DETAILS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_SURVEY_DETAILS_SUCCESS:
            return {
                ...state,
                getSurveyDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_SURVEY_DETAILS_FAILURE:
            return {
                ...state,
                getSurveyDetailsResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_LOGBOOK_DOCUMENTS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_LOGBOOK_DOCUMENTS_SUCCESS:
            return {
                ...state,
                getLogbookDocumentsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_LOGBOOK_DOCUMENTS_FAILURE:
            return {
                ...state,
                getLogbookDocumentsResponse: { success: false, ...action.error }
            };

        case actionTypes.SAVE_ACTIVITY_EVENT_REQUEST:
            return {
                ...state
            };
        case actionTypes.SAVE_ACTIVITY_EVENT_SUCCESS:
            return {
                ...state,
                saveActivityEventResponse: { success: true, ...action.response }
            };
        case actionTypes.SAVE_ACTIVITY_EVENT_FAILURE:
            return {
                ...state,
                saveActivityEventResponse: { success: false, ...action.error }
            };

        case actionTypes.UPLOAD_DOCUMENTS_REQUEST:
            return {
                ...state
            };
        case actionTypes.UPLOAD_DOCUMENTS_SUCCESS:
            return {
                ...state,
                uploadDocumentsResponse: { success: true, ...action.response }
            };
        case actionTypes.UPLOAD_DOCUMENTS_FAILURE:
            return {
                ...state,
                uploadDocumentsResponse: { success: false, ...action.error }
            };

        case actionTypes.REMOVE_ATTACHMENT_REQUEST:
            return {
                ...state
            };
        case actionTypes.REMOVE_ATTACHMENT_SUCCESS:
            return {
                ...state,
                removeAttachmentResponse: { success: true, ...action.response }
            };
        case actionTypes.REMOVE_ATTACHMENT_FAILURE:
            return {
                ...state,
                removeAttachmentResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_ACTIVITY_EVENT_POPUP_DETAILS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ACTIVITY_EVENT_POPUP_DETAILS_SUCCESS:
            return {
                ...state,
                getActivityEventPopupDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ACTIVITY_EVENT_POPUP_DETAILS_FAILURE:
            return {
                ...state,
                getActivityEventPopupDetailsResponse: { success: false, ...action.error }
            };

        case actionTypes.EXECUTE_ACTIVITY_EVENT_REQUEST:
            return {
                ...state
            };
        case actionTypes.EXECUTE_ACTIVITY_EVENT_SUCCESS:
            return {
                ...state,
                executeActivityEventResponse: { success: true, ...action.response }
            };
        case actionTypes.EXECUTE_ACTIVITY_EVENT_FAILURE:
            return {
                ...state,
                executeActivityEventResponse: { success: false, ...action.error }
            };

        case actionTypes.UNDO_NA_REQUEST:
            return {
                ...state
            };
        case actionTypes.UNDO_NA_SUCCESS:
            return {
                ...state,
                undoNaResponse: { success: true, ...action.response }
            };
        case actionTypes.UNDO_NA_FAILURE:
            return {
                ...state,
                undoNaResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_ASSIGN_ACTIVITY_POPUP_DETAILS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ASSIGN_ACTIVITY_POPUP_DETAILS_SUCCESS:
            return {
                ...state,
                getAssignActivityPopupDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ASSIGN_ACTIVITY_POPUP_DETAILS_FAILURE:
            return {
                ...state,
                getAssignActivityPopupDetailsResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_ASSIGN_BUILDING_ACTIVITIES_POPUP_DETAILS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ASSIGN_BUILDING_ACTIVITIES_POPUP_DETAILS_SUCCESS:
            return {
                ...state,
                getAssignBuildingActivitiesPopupDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ASSIGN_BUILDING_ACTIVITIES_POPUP_DETAILS_FAILURE:
            return {
                ...state,
                getAssignBuildingActivitiesPopupDetailsResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_CREATE_SURVEY_POPUP_DETAILS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_CREATE_SURVEY_POPUP_DETAILS_SUCCESS:
            return {
                ...state,
                getCreateSurveyPopupDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_CREATE_SURVEY_POPUP_DETAILS_FAILURE:
            return {
                ...state,
                getCreateSurveyPopupDetailsResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_CURRENT_ASSIGNMENTS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_CURRENT_ASSIGNMENTS_SUCCESS:
            return {
                ...state,
                getCurrentAssignmentsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_CURRENT_ASSIGNMENTS_FAILURE:
            return {
                ...state,
                getCurrentAssignmentsResponse: { success: false, ...action.error }
            };

        case actionTypes.ASSIGN_ACTIVITY_TO_BUILDING_REQUEST:
            return {
                ...state
            };
        case actionTypes.ASSIGN_ACTIVITY_TO_BUILDING_SUCCESS:
            return {
                ...state,
                assignActivityToBuildingResponse: { success: true, ...action.response }
            };
        case actionTypes.ASSIGN_ACTIVITY_TO_BUILDING_FAILURE:
            return {
                ...state,
                assignActivityToBuildingResponse: { success: false, ...action.error }
            };

        case actionTypes.ASSIGN_CLIENT_ACTIVITY_TO_BUILDING_REQUEST:
            return {
                ...state
            };
        case actionTypes.ASSIGN_CLIENT_ACTIVITY_TO_BUILDING_SUCCESS:
            return {
                ...state,
                assignClientActivityToBuildingResponse: { success: true, ...action.response }
            };
        case actionTypes.ASSIGN_CLIENT_ACTIVITY_TO_BUILDING_FAILURE:
            return {
                ...state,
                assignClientActivityToBuildingResponse: { success: false, ...action.error }
            };

        case actionTypes.CREATE_SURVEY_REQUEST:
            return {
                ...state
            };
        case actionTypes.CREATE_SURVEY_SUCCESS:
            return {
                ...state,
                createSurveyResponse: { success: true, ...action.response }
            };
        case actionTypes.CREATE_SURVEY_FAILURE:
            return {
                ...state,
                createSurveyResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_ASSIGN_LOGBOOK_POPUP_DETAILS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ASSIGN_LOGBOOK_POPUP_DETAILS_SUCCESS:
            return {
                ...state,
                getAssignLogbookPopupDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ASSIGN_LOGBOOK_POPUP_DETAILS_FAILURE:
            return {
                ...state,
                getAssignLogbookPopupDetailsResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_ASSIGN_LOGBOOK_POPUP_FOR_CONSULTANCY_DETAILS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ASSIGN_LOGBOOK_POPUP_FOR_CONSULTANCY_DETAILS_SUCCESS:
            return {
                ...state,
                getAssignLogbookForConsultancyPopupDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ASSIGN_LOGBOOK_POPUP_FOR_CONSULTANCY_DETAILS_FAILURE:
            return {
                ...state,
                getAssignLogbookForConsultancyPopupDetailsResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_ASSIGN_ACTIVITY_POPUP_FOR_CONSULTANCY_DETAILS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ASSIGN_ACTIVITY_POPUP_FOR_CONSULTANCY_DETAILS_SUCCESS:
            return {
                ...state,
                getAssignActivityForConsultancyPopupDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ASSIGN_ACTIVITY_POPUP_FOR_CONSULTANCY_DETAILS_FAILURE:
            return {
                ...state,
                getAssignActivityForConsultancyPopupDetailsResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_ASSIGN_ACTIVITY_POPUP_FOR_CLIENT_DETAILS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ASSIGN_ACTIVITY_POPUP_FOR_CLIENT_DETAILS_SUCCESS:
            return {
                ...state,
                getAssignActivityForClientPopupDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ASSIGN_ACTIVITY_POPUP_FOR_CLIENT_DETAILS_FAILURE:
            return {
                ...state,
                getAssignActivityForClientPopupDetailsResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_ASSIGN_LOGBOOK_POPUP_FOR_CLIENT_DETAILS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ASSIGN_LOGBOOK_POPUP_FOR_CLIENT_DETAILS_SUCCESS:
            return {
                ...state,
                getAssignLogbookForClientPopupDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ASSIGN_LOGBOOK_POPUP_FOR_CLIENT_DETAILS_FAILURE:
            return {
                ...state,
                getAssignLogbookForClientPopupDetailsResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_CREATE_SURVEY_POPUP_DETAILS_FOR_BUILDING_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_CREATE_SURVEY_POPUP_DETAILS_FOR_BUILDING_SUCCESS:
            return {
                ...state,
                getCreateSurveyPopupDetailsForBuildingResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_CREATE_SURVEY_POPUP_DETAILS_FOR_BUILDING_FAILURE:
            return {
                ...state,
                getCreateSurveyPopupDetailsForBuildingResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_CREATE_SURVEY_POPUP_DETAILS_FOR_BUILDING_ACTIVITIES_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_CREATE_SURVEY_POPUP_DETAILS_FOR_BUILDING_ACTIVITIES_SUCCESS:
            return {
                ...state,
                getCreateSurveyPopupDetailsForBuildingActivitiesResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_CREATE_SURVEY_POPUP_DETAILS_FOR_BUILDING_ACTIVITIES_FAILURE:
            return {
                ...state,
                getCreateSurveyPopupDetailsForBuildingActivitiesResponse: { success: false, ...action.error }
            };

        case actionTypes.ASSIGN_LOGBOOK_TO_BUILDING_REQUEST:
            return {
                ...state
            };
        case actionTypes.ASSIGN_LOGBOOK_TO_BUILDING_SUCCESS:
            return {
                ...state,
                assignLogbookToBuildingResponse: { success: true, ...action.response }
            };
        case actionTypes.ASSIGN_LOGBOOK_TO_BUILDING_FAILURE:
            return {
                ...state,
                assignLogbookToBuildingResponse: { success: false, ...action.error }
            };

        case actionTypes.ASSIGN_LOGBOOK_TO_CONSULTANCY_REQUEST:
            return {
                ...state
            };
        case actionTypes.ASSIGN_LOGBOOK_TO_CONSULTANCY_SUCCESS:
            return {
                ...state,
                assignLogbookToConsultancyResponse: { success: true, ...action.response }
            };
        case actionTypes.ASSIGN_LOGBOOK_TO_CONSULTANCY_FAILURE:
            return {
                ...state,
                assignLogbookToConsultancyResponse: { success: false, ...action.error }
            };

        case actionTypes.ASSIGN_ACTIVITY_TO_CONSULTANCY_REQUEST:
            return {
                ...state
            };
        case actionTypes.ASSIGN_ACTIVITY_TO_CONSULTANCY_SUCCESS:
            return {
                ...state,
                assignActivityToConsultancyResponse: { success: true, ...action.response }
            };
        case actionTypes.ASSIGN_ACTIVITY_TO_CONSULTANCY_FAILURE:
            return {
                ...state,
                assignActivityToConsultancyResponse: { success: false, ...action.error }
            };

        case actionTypes.ASSIGN_ACTIVITY_TO_CLIENT_REQUEST:
            return {
                ...state
            };
        case actionTypes.ASSIGN_ACTIVITY_TO_CLIENT_SUCCESS:
            return {
                ...state,
                assignActivityToClientResponse: { success: true, ...action.response }
            };
        case actionTypes.ASSIGN_ACTIVITY_TO_CLIENT_FAILURE:
            return {
                ...state,
                assignActivityToClientResponse: { success: false, ...action.error }
            };

        case actionTypes.ASSIGN_LOGBOOK_TO_CLIENT_REQUEST:
            return {
                ...state
            };
        case actionTypes.ASSIGN_LOGBOOK_TO_CLIENT_SUCCESS:
            return {
                ...state,
                assignLogbookToClientResponse: { success: true, ...action.response }
            };
        case actionTypes.ASSIGN_LOGBOOK_TO_CLIENT_FAILURE:
            return {
                ...state,
                assignLogbookToClientResponse: { success: false, ...action.error }
            };

        case actionTypes.UPDATE_ACTIVITY_CALENDAR_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_ACTIVITY_CALENDAR_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };
        case actionTypes.DELETE_SCHEDULE_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionTypes.DELETE_SCHEDULE_BY_ID_SUCCESS:
            return {
                ...state,
                deleteScheduleByIdResponse: { success: true, ...action.response }
            };
        case actionTypes.DELETE_SCHEDULE_BY_ID_FAILURE:
            return {
                ...state,
                deleteScheduleByIdResponse: { success: false, ...action.error }
            };
        case actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS:
            return {
                ...state,
                getListForCommonFilterResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE:
            return {
                ...state,
                getListForCommonFilterResponse: { success: false, ...action.error }
            };
        case actionTypes.UPDATE_ACTIVITY_CALENDAR_ENTITY_PARAMS_ANNUAL_SUCCESS:
            return {
                ...state,
                entityParamsAnnual: { ...action.response }
            };
        case actionTypes.UPDATE_ACTIVITY_CALENDAR_ENTITY_PARAMS_ANNUAL_FAILURE:
            return {
                ...state,
                entityParamsAnnual: { ...action.error }
            };

        case actionTypes.GET_UNDO_NA_POPUP_DETAILS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_UNDO_NA_POPUP_DETAILS_SUCCESS:
            return {
                ...state,
                getUndoNaPopupDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_UNDO_NA_POPUP_DETAILS_FAILURE:
            return {
                ...state,
                getUndoNaPopupDetailsResponse: { success: false, ...action.error }
            };
        case actionTypes.GET_ASSIGN_DEEMING_AGENCY_POPUP_FOR_FREQUENCY_DETAILS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ASSIGN_DEEMING_AGENCY_POPUP_FOR_FREQUENCY_DETAILS_SUCCESS:
            return {
                ...state,
                getAssignDeemingAgencyForFrequencyPopupDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ASSIGN_DEEMING_AGENCY_POPUP_FOR_FREQUENCY_DETAILS_FAILURE:
            return {
                ...state,
                getAssignDeemingAgencyForFrequencyPopupDetailsResponse: { success: false, ...action.error }
            };
        case actionTypes.ASSIGN_DEEMING_AGENCY_TO_FREQUENCY_REQUEST:
            return {
                ...state
            };
        case actionTypes.ASSIGN_DEEMING_AGENCY_TO_FREQUENCY_SUCCESS:
            return {
                ...state,
                assignDeemingAgencyToFrequencyResponse: { success: true, ...action.response }
            };
        case actionTypes.ASSIGN_DEEMING_AGENCY_TO_FREQUENCY_FAILURE:
            return {
                ...state,
                assignDeemingAgencyToFrequencyResponse: { success: false, ...action.error }
            };
        case actionTypes.GET_ASSIGN_FREQUENCY_POPUP_FOR_DEEMING_AGENCY_DETAILS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ASSIGN_FREQUENCY_POPUP_FOR_DEEMING_AGENCY_DETAILS_SUCCESS:
            return {
                ...state,
                getAssignFrequencyForDeemingAgencyPopupDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ASSIGN_FREQUENCY_POPUP_FOR_DEEMING_AGENCY_DETAILS_FAILURE:
            return {
                ...state,
                getAssignFrequencyForDeemingAgencyPopupDetailsResponse: { success: false, ...action.error }
            };
        case actionTypes.ASSIGN_FREQUENCY_TO_DEEMING_AGENCY_REQUEST:
            return {
                ...state
            };
        case actionTypes.ASSIGN_FREQUENCY_TO_DEEMING_AGENCY_SUCCESS:
            return {
                ...state,
                assignFrequencyToDeemingAgencyResponse: { success: true, ...action.response }
            };
        case actionTypes.ASSIGN_FREQUENCY_TO_DEEMING_AGENCY_FAILURE:
            return {
                ...state,
                assignFrequencyToDeemingAgencyResponse: { success: false, ...action.error }
            };
        case actionTypes.UPDATE_ASSIGN_POPUP_API_TRIGGER_SUCCESS:
            return {
                ...state,
                AssignPopUpApiTrigger: { ...action.response }
            };
        case actionTypes.UPDATE_ASSIGN_POPUP_API_TRIGGER_FAILURE:
            return {
                ...state,
                AssignPopUpApiTrigger: { ...action.error }
            };
        case actionTypes.UPDATE_FREQUENCY_DEEMING_AGENCY_API_TRIGGER_SUCCESS:
            return {
                ...state,
                frequencyDeemingAgencyApiTrigger: { ...action.response }
            };
        case actionTypes.UPDATE_FREQUENCY_DEEMING_AGENCY_API_TRIGGER_FAILURE:
            return {
                ...state,
                frequencyDeemingAgencyApiTrigger: { ...action.error }
            };
        case actionTypes.GET_ASSIGN_USER_POPUP_FOR_SECTOR_DETAILS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ASSIGN_USER_POPUP_FOR_SECTOR_DETAILS_SUCCESS:
            return {
                ...state,
                getAssignUserForSectorPopupDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ASSIGN_USER_POPUP_FOR_SECTOR_DETAILS_FAILURE:
            return {
                ...state,
                getAssignUserForSectorPopupDetailsResponse: { success: false, ...action.error }
            };
        case actionTypes.ASSIGN_USER_TO_SECTOR_REQUEST:
            return {
                ...state
            };
        case actionTypes.ASSIGN_USER_TO_SECTOR_SUCCESS:
            return {
                ...state,
                assignUsersToSectionResponse: { success: true, ...action.response }
            };
        case actionTypes.ASSIGN_USER_TO_SECTOR_FAILURE:
            return {
                ...state,
                assignUsersToSectionResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_ASSIGN_USER_POPUP_FOR_CAMPUS_DETAILS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ASSIGN_USER_POPUP_FOR_CAMPUS_DETAILS_SUCCESS:
            return {
                ...state,
                getAssignUserForCampusPopupDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ASSIGN_USER_POPUP_FOR_CAMPUS_DETAILS_FAILURE:
            return {
                ...state,
                getAssignUserForCampusPopupDetailsResponse: { success: false, ...action.error }
            };

        case actionTypes.ASSIGN_USER_TO_CAMPUS_REQUEST:
            return {
                ...state
            };
        case actionTypes.ASSIGN_USER_TO_CAMPUS_SUCCESS:
            return {
                ...state,
                assignUsersToCampusResponse: { success: true, ...action.response }
            };
        case actionTypes.ASSIGN_USER_TO_CAMPUS_FAILURE:
            return {
                ...state,
                assignUsersToCampusResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_ASSIGN_USER_POPUP_FOR_BUILDING_DETAILS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ASSIGN_USER_POPUP_FOR_BUILDING_DETAILS_SUCCESS:
            return {
                ...state,
                getAssignUserForBuildingPopupDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ASSIGN_USER_POPUP_FOR_BUILDING_DETAILS_FAILURE:
            return {
                ...state,
                getAssignUserForBuildingPopupDetailsResponse: { success: false, ...action.error }
            };

        case actionTypes.ASSIGN_USER_TO_BUILDING_REQUEST:
            return {
                ...state
            };
        case actionTypes.ASSIGN_USER_TO_BUILDING_SUCCESS:
            return {
                ...state,
                assignUsersToBuildingResponse: { success: true, ...action.response }
            };
        case actionTypes.ASSIGN_USER_TO_BUILDING_FAILURE:
            return {
                ...state,
                assignUsersToBuildingResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_ASSIGN_BUILDING_LOGBOOK_TO_USER_POPUP_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ASSIGN_BUILDING_LOGBOOK_TO_USER_POPUP_SUCCESS:
            return {
                ...state,
                getAssignBuildingLogbookToUserPopupDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ASSIGN_BUILDING_LOGBOOK_TO_USER_POPUP_FAILURE:
            return {
                ...state,
                getAssignBuildingLogbookToUserPopupDetailsResponse: { success: false, ...action.error }
            };

        case actionTypes.ASSIGN_BUILDING_LOGBOOK_TO_USER_REQUEST:
            return {
                ...state
            };
        case actionTypes.ASSIGN_BUILDING_LOGBOOK_TO_USER_SUCCESS:
            return {
                ...state,
                assignBuildingLogbookToUserResponse: { success: true, ...action.response }
            };
        case actionTypes.ASSIGN_BUILDING_LOGBOOK_TO_USER_FAILURE:
            return {
                ...state,
                assignBuildingLogbookToUserResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_ASSIGN_BUILDING_TO_USER_POPUP_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ASSIGN_BUILDING_TO_USER_POPUP_SUCCESS:
            return {
                ...state,
                getAssignBuildingToUserPopupDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ASSIGN_BUILDING_TO_USER_POPUP_FAILURE:
            return {
                ...state,
                getAssignBuildingToUserPopupDetailsResponse: { success: false, ...action.error }
            };

        case actionTypes.ASSIGN_BUILDING_TO_USER_REQUEST:
            return {
                ...state
            };
        case actionTypes.ASSIGN_BUILDING_TO_USER_SUCCESS:
            return {
                ...state,
                assignBuildingToUserResponse: { success: true, ...action.response }
            };
        case actionTypes.ASSIGN_BUILDING_TO_USER_FAILURE:
            return {
                ...state,
                assignBuildingToUserResponse: { success: false, ...action.error }
            };
        case actionTypes.GET_ASSIGN_CONSULTANCY_TO_LOGBOOK_POPUP_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ASSIGN_CONSULTANCY_TO_LOGBOOK_POPUP_SUCCESS:
            return {
                ...state,
                getAssignConsultancyToLogbookPopupDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ASSIGN_CONSULTANCY_TO_LOGBOOK_POPUP_FAILURE:
            return {
                ...state,
                getAssignConsultancyToLogbookPopupDetailsResponse: { success: false, ...action.error }
            };
        case actionTypes.ASSIGN_CONSULTANCY_TO_LOGBOOK_REQUEST:
            return {
                ...state
            };
        case actionTypes.ASSIGN_CONSULTANCY_TO_LOGBOOK_SUCCESS:
            return {
                ...state,
                assignConsultancyToLogbookResponse: { success: true, ...action.response }
            };
        case actionTypes.ASSIGN_CONSULTANCY_TO_LOGBOOK_FAILURE:
            return {
                ...state,
                assignConsultancyToLogbookResponse: { success: false, ...action.error }
            };
        case actionTypes.GET_ASSIGN_CLIENT_TO_LOGBOOK_POPUP_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ASSIGN_CLIENT_TO_LOGBOOK_POPUP_SUCCESS:
            return {
                ...state,
                getAssignClientToLogbookPopupDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ASSIGN_CLIENT_TO_LOGBOOK_POPUP_FAILURE:
            return {
                ...state,
                getAssignClientToLogbookPopupDetailsResponse: { success: false, ...action.error }
            };
        case actionTypes.ASSIGN_CLIENT_TO_LOGBOOK_REQUEST:
            return {
                ...state
            };
        case actionTypes.ASSIGN_CLIENT_TO_LOGBOOK_SUCCESS:
            return {
                ...state,
                assignClientToLogbookResponse: { success: true, ...action.response }
            };
        case actionTypes.ASSIGN_CLIENT_TO_LOGBOOK_FAILURE:
            return {
                ...state,
                assignClientToLogbookResponse: { success: false, ...action.error }
            };
        case actionTypes.GET_ASSIGN_BUILDING_TO_LOGBOOK_POPUP_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ASSIGN_BUILDING_TO_LOGBOOK_POPUP_SUCCESS:
            return {
                ...state,
                getAssignBuildingToLogbookPopupDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ASSIGN_BUILDING_TO_LOGBOOK_POPUP_FAILURE:
            return {
                ...state,
                getAssignBuildingToLogbookPopupDetailsResponse: { success: false, ...action.error }
            };
        case actionTypes.ASSIGN_BUILDING_TO_LOGBOOK_REQUEST:
            return {
                ...state
            };
        case actionTypes.ASSIGN_BUILDING_TO_LOGBOOK_SUCCESS:
            return {
                ...state,
                assignBuildingToLogbookResponse: { success: true, ...action.response }
            };
        case actionTypes.ASSIGN_BUILDING_TO_LOGBOOK_FAILURE:
            return {
                ...state,
                assignBuildingToLogbookResponse: { success: false, ...action.error }
            };
        case actionTypes.GET_LOGBOOK_CREATE_SURVEY_POPUP_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_LOGBOOK_CREATE_SURVEY_POPUP_SUCCESS:
            return {
                ...state,
                getLogbookCreateSurveyPopupDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_LOGBOOK_CREATE_SURVEY_POPUP_FAILURE:
            return {
                ...state,
                getLogbookCreateSurveyPopupDetailsResponse: { success: false, ...action.error }
            };
        case actionTypes.CREATE_SURVEY_BUILDING_LOGBOOK_REQUEST:
            return {
                ...state
            };
        case actionTypes.CREATE_SURVEY_BUILDING_LOGBOOK_SUCCESS:
            return {
                ...state,
                createSurveyBuildingLogbookResponse: { success: true, ...action.response }
            };
        case actionTypes.CREATE_SURVEY_BUILDING_LOGBOOK_FAILURE:
            return {
                ...state,
                createSurveyBuildingLogbookResponse: { success: false, ...action.error }
            };
        case actionTypes.GET_ASSIGN_CONSULTANCY_TO_ACTIVITY_POPUP_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ASSIGN_CONSULTANCY_TO_ACTIVITY_POPUP_SUCCESS:
            return {
                ...state,
                getAssignConsultancyToActivityPopupDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ASSIGN_CONSULTANCY_TO_ACTIVITY_POPUP_FAILURE:
            return {
                ...state,
                getAssignConsultancyToActivityPopupDetailsResponse: { success: false, ...action.error }
            };
        case actionTypes.ASSIGN_CONSULTANCY_TO_ACTIVITY_REQUEST:
            return {
                ...state
            };
        case actionTypes.ASSIGN_CONSULTANCY_TO_ACTIVITY_SUCCESS:
            return {
                ...state,
                assignConsultancyToActivityResponse: { success: true, ...action.response }
            };
        case actionTypes.ASSIGN_CONSULTANCY_TO_ACTIVITY_FAILURE:
            return {
                ...state,
                assignConsultancyToActivityResponse: { success: false, ...action.error }
            };
        case actionTypes.GET_ASSIGN_CLIENT_TO_ACTIVITY_POPUP_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ASSIGN_CLIENT_TO_ACTIVITY_POPUP_SUCCESS:
            return {
                ...state,
                getAssignClientToActivityPopupDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ASSIGN_CLIENT_TO_ACTIVITY_POPUP_FAILURE:
            return {
                ...state,
                getAssignClientToActivityPopupDetailsResponse: { success: false, ...action.error }
            };
        case actionTypes.ASSIGN_CLIENT_TO_ACTIVITY_REQUEST:
            return {
                ...state
            };
        case actionTypes.ASSIGN_CLIENT_TO_ACTIVITY_SUCCESS:
            return {
                ...state,
                assignClientToActivityResponse: { success: true, ...action.response }
            };
        case actionTypes.ASSIGN_CLIENT_TO_ACTIVITY_FAILURE:
            return {
                ...state,
                assignClientToActivityResponse: { success: false, ...action.error }
            };
        case actionTypes.GET_ASSIGN_BUILDING_TO_ACTIVITY_POPUP_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ASSIGN_BUILDING_TO_ACTIVITY_POPUP_SUCCESS:
            return {
                ...state,
                getAssignBuildingToActivityPopupDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ASSIGN_BUILDING_TO_ACTIVITY_POPUP_FAILURE:
            return {
                ...state,
                getAssignBuildingToActivityPopupDetailsResponse: { success: false, ...action.error }
            };
        case actionTypes.ASSIGN_BUILDING_TO_ACTIVITY_REQUEST:
            return {
                ...state
            };
        case actionTypes.ASSIGN_BUILDING_TO_ACTIVITY_SUCCESS:
            return {
                ...state,
                assignBuildingToActivityResponse: { success: true, ...action.response }
            };
        case actionTypes.ASSIGN_BUILDING_TO_ACTIVITY_FAILURE:
            return {
                ...state,
                assignBuildingToActivityResponse: { success: false, ...action.error }
            };
        case actionTypes.GET_ACTIVITY_CREATE_SURVEY_POPUP_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ACTIVITY_CREATE_SURVEY_POPUP_SUCCESS:
            return {
                ...state,
                getActivityCreateSurveyPopupDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ACTIVITY_CREATE_SURVEY_POPUP_FAILURE:
            return {
                ...state,
                getActivityCreateSurveyPopupDetailsResponse: { success: false, ...action.error }
            };
        case actionTypes.CREATE_SURVEY_BUILDING_ACTIVITY_REQUEST:
            return {
                ...state
            };
        case actionTypes.CREATE_SURVEY_BUILDING_ACTIVITY_SUCCESS:
            return {
                ...state,
                createSurveyBuildingActivityResponse: { success: true, ...action.response }
            };
        case actionTypes.CREATE_SURVEY_BUILDING_ACTIVITY_FAILURE:
            return {
                ...state,
                createSurveyBuildingActivityResponse: { success: false, ...action.error }
            };
        case actionTypes.GET_ASSIGN_PROCEDURE_TO_ACTIVITY_POPUP_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ASSIGN_PROCEDURE_TO_ACTIVITY_POPUP_SUCCESS:
            return {
                ...state,
                getAssignProcedureToActivityPopupDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ASSIGN_PROCEDURE_TO_ACTIVITY_POPUP_FAILURE:
            return {
                ...state,
                getAssignProcedureToActivityPopupDetailsResponse: { success: false, ...action.error }
            };

        case actionTypes.ASSIGN_PROCEDURE_TO_ACTIVITY_REQUEST:
            return {
                ...state
            };
        case actionTypes.ASSIGN_PROCEDURE_TO_ACTIVITY_SUCCESS:
            return {
                ...state,
                assignProcedureToActivityResponse: { success: true, ...action.response }
            };
        case actionTypes.ASSIGN_PROCEDURE_TO_ACTIVITY_FAILURE:
            return {
                ...state,
                assignProcedureToActivityResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_UNREAD_NOTIFICATIONS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_UNREAD_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                getUnReadNotificationsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_UNREAD_NOTIFICATIONS_FAILURE:
            return {
                ...state,
                getUnReadNotificationsResponse: { success: false, ...action.error }
            };

        case actionTypes.READ_NOTIFICATION_REQUEST:
            return {
                ...state
            };
        case actionTypes.READ_NOTIFICATION_SUCCESS:
            return {
                ...state,
                readNotificationResponse: { success: true, ...action.response }
            };
        case actionTypes.READ_NOTIFICATION_FAILURE:
            return {
                ...state,
                readNotificationResponse: { success: false, ...action.error }
            };

        case actionTypes.DELETE_UNREAD_NOTIFICATIONS_REQUEST:
            return {
                ...state
            };
        case actionTypes.DELETE_UNREAD_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                deleteUnReadNotificationsResponse: { success: true, ...action.response }
            };
        case actionTypes.DELETE_UNREAD_NOTIFICATIONS_FAILURE:
            return {
                ...state,
                deleteUnReadNotificationsResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_FILTER_DROPDOWN_DATA_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_FILTER_DROPDOWN_DATA_SUCCESS:
            return {
                ...state,
                getFilterDropdownDataResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_FILTER_DROPDOWN_DATA_FAILURE:
            return {
                ...state,
                getFilterDropdownDataResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_DEVICE_DOCUMENTS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_DEVICE_DOCUMENTS_SUCCESS:
            return {
                ...state,
                getDeviceDocumentsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_DEVICE_DOCUMENTS_FAILURE:
            return {
                ...state,
                getDeviceDocumentsResponse: { success: false, ...action.error }
            };

        case actionTypes.SAVE_DEVICE_COUNT_REQUEST:
            return {
                ...state
            };
        case actionTypes.SAVE_DEVICE_COUNT_SUCCESS:
            return {
                ...state,
                saveDeviceCountResponse: { success: true, ...action.response }
            };
        case actionTypes.SAVE_DEVICE_COUNT_FAILURE:
            return {
                ...state,
                saveDeviceCountResponse: { success: false, ...action.error }
            };

        case actionTypes.SET_AUDIT_MODE_REQUEST:
            return {
                ...state
            };
        case actionTypes.SET_AUDIT_MODE_SUCCESS:
            return {
                ...state,
                setAuditModeResponse: { success: true, ...action.response }
            };
        case actionTypes.SET_AUDIT_MODE_FAILURE:
            return {
                ...state,
                setAuditModeResponse: { success: false, ...action.error }
            };
        case actionTypes.SET_RESET_PASSWORD_REQUEST:
            return {
                ...state
            };
        case actionTypes.SET_RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                resetPasswordResponse: { success: true, ...action.response }
            };
        case actionTypes.SET_RESET_PASSWORD_FAILURE:
            return {
                ...state,
                resetPasswordResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_G_L_T_DETAILS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_G_L_T_DETAILS_SUCCESS:
            return {
                ...state,
                getGLTDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_G_L_T_DETAILS_FAILURE:
            return {
                ...state,
                getGLTDetailsResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_PREVIOUS_SURVEYS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_PREVIOUS_SURVEYS_SUCCESS:
            return {
                ...state,
                getPreviousSurveysResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_PREVIOUS_SURVEYS_FAILURE:
            return {
                ...state,
                getPreviousSurveysResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_PREVIOUS_LOCATIONS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_PREVIOUS_LOCATIONS_SUCCESS:
            return {
                ...state,
                getPreviousLocationsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_PREVIOUS_LOCATIONS_FAILURE:
            return {
                ...state,
                getPreviousLocationsResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_PREVIOUS_DAYS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_PREVIOUS_DAYS_SUCCESS:
            return {
                ...state,
                getPreviousDaysResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_PREVIOUS_DAYS_FAILURE:
            return {
                ...state,
                getPreviousDaysResponse: { success: false, ...action.error }
            };

        case actionTypes.FETCH_FORM_SETTINGS_REQUEST:
            return {
                ...state
            };
        case actionTypes.FETCH_FORM_SETTINGS_SUCCESS:
            return {
                ...state,
                fetchFormSettingsResponse: { success: true, ...action.response }
            };
        case actionTypes.FETCH_FORM_SETTINGS_FAILURE:
            return {
                ...state,
                fetchFormSettingsResponse: { success: false, ...action.error }
            };

        case actionTypes.EXPORT_SCHEDULE_TABLE_REQUEST:
            return {
                ...state
            };
        case actionTypes.EXPORT_SCHEDULE_TABLE_SUCCESS:
            return {
                ...state,
                exportSchedulesResponse: { success: true, ...action.response }
            };
        case actionTypes.EXPORT_SCHEDULE_TABLE_FAILURE:
            return {
                ...state,
                exportSchedulesResponse: { success: false, ...action.error }
            };

        case actionTypes.CHECK_BUILDING_COUNT_REQUEST:
            return {
                ...state
            };
        case actionTypes.CHECK_BUILDING_COUNT_SUCCESS:
            return {
                ...state,
                checkBuildingCountResponse: { success: true, ...action.response }
            };
        case actionTypes.CHECK_BUILDING_COUNT_FAILURE:
            return {
                ...state,
                checkBuildingCountResponse: { success: false, ...action.error }
            };

        case actionTypes.DELETE_DEVICE_COUNT_REQUEST:
            return {
                ...state
            };
        case actionTypes.DELETE_DEVICE_COUNT_SUCCESS:
            return {
                ...state,
                deleteDeviceCountResponse: { success: true, ...action.response }
            };
        case actionTypes.DELETE_DEVICE_COUNT_FAILURE:
            return {
                ...state,
                deleteDeviceCountResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_SCHEDULE_DATES_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_SCHEDULE_DATES_SUCCESS:
            return {
                ...state,
                getScheduleDatesResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_SCHEDULE_DATES_FAILURE:
            return {
                ...state,
                getScheduleDatesResponse: { success: false, ...action.error }
            };

        default:
            return {
                ...state
            };
    }
};
