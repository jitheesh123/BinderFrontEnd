import * as actionTypes from "./constants";

const initialState = {
    logbookData: {},
    addLogbookData: {},
    deleteLogbookData: {},
    editLogbookData: {},
    getListForCommonFilterResponse: {},
    getLogbookByIdResponse: {},
    getAllLogbookLogResponse: {},
    restoreLogbookLogResponse: {},
    deleteLogbookLogResponse: {},
    getAllImagesResponse: {},
    getLogbookTypeDropdownResponse: {},
    entityParams: {
        params: {
            limit: 40,
            page: 1,
            search: "",
            filters: null,
            order: null,
            list: null
        },
        paginationParams: {
            totalPages: 0,
            perPage: 40,
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

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_LOGBOOK_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_LOGBOOK_SUCCESS:
            return {
                ...state,
                logbookData: { success: true, ...action.response }
            };
        case actionTypes.GET_LOGBOOK_FAILURE:
            return {
                ...state,
                logbookData: { success: false, ...action.error }
            };

        case actionTypes.ADD_LOGBOOK_REQUEST:
            return {
                ...state
            };
        case actionTypes.ADD_LOGBOOK_SUCCESS:
            return {
                ...state,
                addLogbookData: { success: true, ...action.response }
            };
        case actionTypes.ADD_LOGBOOK_FAILURE:
            return {
                ...state,
                addLogbookData: { success: false, ...action.error }
            };

        case actionTypes.DELETE_LOGBOOK_REQUEST:
            return {
                ...state
            };
        case actionTypes.DELETE_LOGBOOK_SUCCESS:
            return {
                ...state,
                deleteLogbookData: { success: true, ...action.response }
            };
        case actionTypes.DELETE_LOGBOOK_FAILURE:
            return {
                ...state,
                deleteLogbookData: { success: false, ...action.error }
            };

        case actionTypes.EDIT_LOGBOOK_REQUEST:
            return {
                ...state
            };
        case actionTypes.EDIT_LOGBOOK_SUCCESS:
            return {
                ...state,
                editLogbookData: { success: true, ...action.response }
            };
        case actionTypes.EDIT_LOGBOOK_FAILURE:
            return {
                ...state,
                editLogbookData: { success: false, ...action.error }
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
        case actionTypes.GET_LOGBOOK_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_LOGBOOK_BY_ID_SUCCESS:
            return {
                ...state,
                getLogbookByIdResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_LOGBOOK_BY_ID_FAILURE:
            return {
                ...state,
                getLogbookByIdResponse: { success: false, ...action.error }
            };
        case actionTypes.GET_ALL_LOGBOOK_LOG_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ALL_LOGBOOK_LOG_SUCCESS:
            return {
                ...state,
                getAllLogbookLogResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ALL_LOGBOOK_LOG_FAILURE:
            return {
                ...state,
                getAllLogbookLogResponse: { success: false, ...action.error }
            };
        case actionTypes.RESTORE_LOGBOOK_LOG_REQUEST:
            return {
                ...state
            };
        case actionTypes.RESTORE_LOGBOOK_LOG_SUCCESS:
            return {
                ...state,
                restoreLogbookLogResponse: { success: true, ...action.response }
            };
        case actionTypes.RESTORE_LOGBOOK_LOG_FAILURE:
            return {
                ...state,
                restoreLogbookLogResponse: { success: false, ...action.error }
            };
        case actionTypes.DELETE_LOGBOOK_LOG_REQUEST:
            return {
                ...state
            };
        case actionTypes.DELETE_LOGBOOK_LOG_SUCCESS:
            return {
                ...state,
                deleteLogbookLogResponse: { success: true, ...action.response }
            };
        case actionTypes.DELETE_LOGBOOK_LOG_FAILURE:
            return {
                ...state,
                deleteLogbookLogResponse: { success: false, ...action.error }
            };
        case actionTypes.UPDATE_LOGBOOK_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_LOGBOOK_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };
        case actionTypes.GET_ALL_LOGBOOK_IMAGE_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ALL_LOGBOOK_IMAGE_SUCCESS:
            return {
                ...state,
                getAllImagesResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ALL_LOGBOOK_IMAGE_FAILURE:
            return {
                ...state,
                getAllImagesResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_LOGBOOK_TYPE_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_LOGBOOK_TYPE_DROPDOWN_SUCCESS:
            return {
                ...state,
                getLogbookTypeDropdownResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_LOGBOOK_TYPE_DROPDOWN_FAILURE:
            return {
                ...state,
                getLogbookTypeDropdownResponse: { success: false, ...action.error }
            };

        default:
            return {
                ...state
            };
    }
};
