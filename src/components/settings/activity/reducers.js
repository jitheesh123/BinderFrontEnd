import * as actionTypes from "./constants";

const initialState = {
    getActivityListResponse: {},
    addActivityData: {},
    deleteActivityData: {},
    editActivityData: {},
    pushActivityData: {},
    getListForCommonFilterResponse: {},
    getActivityByIdResponse: {},
    getAllActivityLogResponse: {},
    restoreActivityLogResponse: {},
    deleteActivityLogResponse: {},
    getAssignFormToActivityPopupDetailsResponse: {},
    assignFormToActivityResponse: {},
    getLinkedActivityListResponse: {},
    getCategoryDropdownResponse: {},
    entityParams: {
        params: {
            limit: 150,
            page: 1,
            search: "",
            filters: null,
            order: null,
            list: null
        },
        paginationParams: {
            totalPages: 0,
            perPage: 150,
            currentPage: 0,
            totalCount: 0
        },
        historyPaginationParams: {
            totalPages: 0,
            perPage: 40,
            currentPage: 0,
            totalCount: 0
        },
        historyParams: {
            limit: 40,
            page: 1,
            search: ""
        },
        tableConfig: null
    }
};

const reducerResp = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ACTIVITY_LIST_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ACTIVITY_LIST_SUCCESS:
            return {
                ...state,
                getActivityListResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ACTIVITY_LIST_FAILURE:
            return {
                ...state,
                getActivityListResponse: { success: false, ...action.error }
            };

        case actionTypes.ADD_ACTIVITY_REQUEST:
            return {
                ...state
            };
        case actionTypes.ADD_ACTIVITY_SUCCESS:
            return {
                ...state,
                addActivityData: { success: true, ...action.response }
            };
        case actionTypes.ADD_ACTIVITY_FAILURE:
            return {
                ...state,
                addActivityData: { success: false, ...action.error }
            };

        case actionTypes.DELETE_ACTIVITY_REQUEST:
            return {
                ...state
            };
        case actionTypes.DELETE_ACTIVITY_SUCCESS:
            return {
                ...state,
                deleteActivityData: { success: true, ...action.response }
            };
        case actionTypes.DELETE_ACTIVITY_FAILURE:
            return {
                ...state,
                deleteActivityData: { success: false, ...action.error }
            };

        case actionTypes.EDIT_ACTIVITY_REQUEST:
            return {
                ...state
            };
        case actionTypes.EDIT_ACTIVITY_SUCCESS:
            return {
                ...state,
                editActivityData: { success: true, ...action.response }
            };
        case actionTypes.EDIT_ACTIVITY_FAILURE:
            return {
                ...state,
                editActivityData: { success: false, ...action.error }
            };
        case actionTypes.PUSH_ACTIVITY_REQUEST:
            return {
                ...state
            };
        case actionTypes.PUSH_ACTIVITY_SUCCESS:
            return {
                ...state,
                pushActivityData: { success: true, ...action.response }
            };
        case actionTypes.PUSH_ACTIVITY_FAILURE:
            return {
                ...state,
                pushActivityData: { success: false, ...action.error }
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
        case actionTypes.GET_ACTIVITY_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ACTIVITY_BY_ID_SUCCESS:
            return {
                ...state,
                getActivityByIdResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ACTIVITY_BY_ID_FAILURE:
            return {
                ...state,
                getActivityByIdResponse: { success: false, ...action.error }
            };
        case actionTypes.GET_ALL_ACTIVITY_LOG_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ALL_ACTIVITY_LOG_SUCCESS:
            return {
                ...state,
                getAllActivityLogResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ALL_ACTIVITY_LOG_FAILURE:
            return {
                ...state,
                getAllActivityLogResponse: { success: false, ...action.error }
            };
        case actionTypes.RESTORE_ACTIVITY_LOG_REQUEST:
            return {
                ...state
            };
        case actionTypes.RESTORE_ACTIVITY_LOG_SUCCESS:
            return {
                ...state,
                restoreActivityLogResponse: { success: true, ...action.response }
            };
        case actionTypes.RESTORE_ACTIVITY_LOG_FAILURE:
            return {
                ...state,
                restoreActivityLogResponse: { success: false, ...action.error }
            };
        case actionTypes.DELETE_ACTIVITY_LOG_REQUEST:
            return {
                ...state
            };
        case actionTypes.DELETE_ACTIVITY_LOG_SUCCESS:
            return {
                ...state,
                deleteActivityLogResponse: { success: true, ...action.response }
            };
        case actionTypes.DELETE_ACTIVITY_LOG_FAILURE:
            return {
                ...state,
                deleteActivityLogResponse: { success: false, ...action.error }
            };
        case actionTypes.UPDATE_ACTIVITY_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_ACTIVITY_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };
        case actionTypes.GET_ASSIGN_FORM_TO_ACTIVITY_POPUP_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ASSIGN_FORM_TO_ACTIVITY_POPUP_SUCCESS:
            return {
                ...state,
                getAssignFormToActivityPopupDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ASSIGN_FORM_TO_ACTIVITY_POPUP_FAILURE:
            return {
                ...state,
                getAssignFormToActivityPopupDetailsResponse: { success: false, ...action.error }
            };

        case actionTypes.ASSIGN_FORM_TO_ACTIVITY_REQUEST:
            return {
                ...state
            };
        case actionTypes.ASSIGN_FORM_TO_ACTIVITY_SUCCESS:
            return {
                ...state,
                assignFormToActivityResponse: { success: true, ...action.response }
            };
        case actionTypes.ASSIGN_FORM_TO_ACTIVITY_FAILURE:
            return {
                ...state,
                assignFormToActivityResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_LINKED_ACTIVITY_LIST_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_LINKED_ACTIVITY_LIST_SUCCESS:
            return {
                ...state,
                getLinkedActivityListResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_LINKED_ACTIVITY_LIST_FAILURE:
            return {
                ...state,
                getLinkedActivityListResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_CATEGORY_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_CATEGORY_DROPDOWN_SUCCESS:
            return {
                ...state,
                getCategoryDropdownResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_CATEGORY_DROPDOWN_FAILURE:
            return {
                ...state,
                getCategoryDropdownResponse: { success: false, ...action.error }
            };

        default:
            return {
                ...state
            };
    }
};

export default reducerResp;
