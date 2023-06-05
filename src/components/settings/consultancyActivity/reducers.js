import * as actionTypes from "./constants";

const initialState = {
    getConsultancyActivityListResponse: {},
    addConsultancyActivityData: {},
    deleteConsultancyActivityData: {},
    editConsultancyActivityData: {},
    getListForCommonFilterResponse:{},
    getConsultancyActivityByIdResponse:{},
    getAllConsultancyActivityLogResponse:{},
    restoreConsultancyActivityLogResponse:{},
    deleteConsultancyActivityLogResponse:{},
    entityParams: {
        params: {
            limit: 40,
            page: 1,
            search: "",
            filters:null,
            order:null,
            list:null
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
        tableConfig: null,
    }
};

const reducerResp = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_CONSULTANCY_ACTIVITY_LIST_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_CONSULTANCY_ACTIVITY_LIST_SUCCESS:
            return {
                ...state,
                getConsultancyActivityListResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_CONSULTANCY_ACTIVITY_LIST_FAILURE:
            return {
                ...state,
                getConsultancyActivityListResponse: { success: false, ...action.error }
            };

        case actionTypes.ADD_CONSULTANCY_ACTIVITY_REQUEST:
            return {
                ...state
            };
        case actionTypes.ADD_CONSULTANCY_ACTIVITY_SUCCESS:
            return {
                ...state,
                addConsultancyActivityData: { success: true, ...action.response }
            };
        case actionTypes.ADD_CONSULTANCY_ACTIVITY_FAILURE:
            return {
                ...state,
                addConsultancyActivityData: { success: false, ...action.error }
            };

        case actionTypes.DELETE_CONSULTANCY_ACTIVITY_REQUEST:
            return {
                ...state
            };
        case actionTypes.DELETE_CONSULTANCY_ACTIVITY_SUCCESS:
            return {
                ...state,
                deleteConsultancyActivityData: { success: true, ...action.response }
            };
        case actionTypes.DELETE_CONSULTANCY_ACTIVITY_FAILURE:
            return {
                ...state,
                deleteConsultancyActivityData: { success: false, ...action.error }
            };

        case actionTypes.EDIT_CONSULTANCY_ACTIVITY_REQUEST:
            return {
                ...state
            };
        case actionTypes.EDIT_CONSULTANCY_ACTIVITY_SUCCESS:
            return {
                ...state,
                editConsultancyActivityData: { success: true, ...action.response }
            };
        case actionTypes.EDIT_CONSULTANCY_ACTIVITY_FAILURE:
            return {
                ...state,
                editConsultancyActivityData: { success: false, ...action.error }
            };
        case actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS: 
            return {
                ...state,
                getListForCommonFilterResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE:
            return {
                ...state,
                getListForCommonFilterResponse: { success: false, ...action.error }
            }
        case actionTypes.GET_CONSULTANCY_ACTIVITY_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_CONSULTANCY_ACTIVITY_BY_ID_SUCCESS:
            return {
                ...state,
                getConsultancyActivityByIdResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_CONSULTANCY_ACTIVITY_BY_ID_FAILURE:
            return {
                ...state,
                getConsultancyActivityByIdResponse: { success: false, ...action.error }
            };
        case actionTypes.GET_ALL_CONSULTANCY_ACTIVITY_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ALL_CONSULTANCY_ACTIVITY_LOG_SUCCESS: 
            return {
                ...state,
                getAllConsultancyActivityLogResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_ALL_CONSULTANCY_ACTIVITY_LOG_FAILURE:
            return {
                ...state,
                getAllConsultancyActivityLogResponse: { success: false, ...action.error }
            }
        case actionTypes.RESTORE_CONSULTANCY_ACTIVITY_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.RESTORE_CONSULTANCY_ACTIVITY_LOG_SUCCESS: 
            return {
                ...state,
                restoreConsultancyActivityLogResponse: { success: true, ...action.response }
            }
        case actionTypes.RESTORE_CONSULTANCY_ACTIVITY_LOG_FAILURE:
            return {
                ...state,
                restoreConsultancyActivityLogResponse: { success: false, ...action.error }
            }
        case actionTypes.DELETE_CONSULTANCY_ACTIVITY_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_CONSULTANCY_ACTIVITY_LOG_SUCCESS: 
            return {
                ...state,
                deleteConsultancyActivityLogResponse: { success: true, ...action.response }
            }
        case actionTypes.DELETE_CONSULTANCY_ACTIVITY_LOG_FAILURE:
            return {
                ...state,
                deleteConsultancyActivityLogResponse: { success: false, ...action.error }
            }
        case actionTypes.UPDATE_CONSULTANCY_ACTIVITY_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_CONSULTANCY_ACTIVITY_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };

        default:
            return {
                ...state
            };
    }
};

export default reducerResp;
