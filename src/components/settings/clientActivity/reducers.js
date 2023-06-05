import * as actionTypes from "./constants";

const initialState = {
    getClientActivityListResponse: {},
    addClientActivityData: {},
    deleteClientActivityData: {},
    editClientActivityData: {},
    getListForCommonFilterResponse:{},
    getClientActivityByIdResponse:{},
    getAllClientActivityLogResponse:{},
    restoreClientActivityLogResponse:{},
    deleteClientActivityLogResponse:{},
    editClientShiftActivityData: {},
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
        case actionTypes.GET_CLIENT_ACTIVITY_LIST_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_CLIENT_ACTIVITY_LIST_SUCCESS:
            return {
                ...state,
                getClientActivityListResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_CLIENT_ACTIVITY_LIST_FAILURE:
            return {
                ...state,
                getClientActivityListResponse: { success: false, ...action.error }
            };

        case actionTypes.ADD_CLIENT_ACTIVITY_REQUEST:
            return {
                ...state
            };
        case actionTypes.ADD_CLIENT_ACTIVITY_SUCCESS:
            return {
                ...state,
                addClientActivityData: { success: true, ...action.response }
            };
        case actionTypes.ADD_CLIENT_ACTIVITY_FAILURE:
            return {
                ...state,
                addClientActivityData: { success: false, ...action.error }
            };

        case actionTypes.DELETE_CLIENT_ACTIVITY_REQUEST:
            return {
                ...state
            };
        case actionTypes.DELETE_CLIENT_ACTIVITY_SUCCESS:
            return {
                ...state,
                deleteClientActivityData: { success: true, ...action.response }
            };
        case actionTypes.DELETE_CLIENT_ACTIVITY_FAILURE:
            return {
                ...state,
                deleteClientActivityData: { success: false, ...action.error }
            };

        case actionTypes.EDIT_CLIENT_ACTIVITY_REQUEST:
            return {
                ...state
            };
        case actionTypes.EDIT_CLIENT_ACTIVITY_SUCCESS:
            return {
                ...state,
                editClientActivityData: { success: true, ...action.response }
            };
        case actionTypes.EDIT_CLIENT_ACTIVITY_FAILURE:
            return {
                ...state,
                editClientActivityData: { success: false, ...action.error }
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
        case actionTypes.GET_CLIENT_ACTIVITY_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_CLIENT_ACTIVITY_BY_ID_SUCCESS:
            return {
                ...state,
                getClientActivityByIdResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_CLIENT_ACTIVITY_BY_ID_FAILURE:
            return {
                ...state,
                getClientActivityByIdResponse: { success: false, ...action.error }
            };
        case actionTypes.GET_ALL_CLIENT_ACTIVITY_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ALL_CLIENT_ACTIVITY_LOG_SUCCESS: 
            return {
                ...state,
                getAllClientActivityLogResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_ALL_CLIENT_ACTIVITY_LOG_FAILURE:
            return {
                ...state,
                getAllClientActivityLogResponse: { success: false, ...action.error }
            }
        case actionTypes.RESTORE_CLIENT_ACTIVITY_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.RESTORE_CLIENT_ACTIVITY_LOG_SUCCESS: 
            return {
                ...state,
                restoreClientActivityLogResponse: { success: true, ...action.response }
            }
        case actionTypes.RESTORE_CLIENT_ACTIVITY_LOG_FAILURE:
            return {
                ...state,
                restoreClientActivityLogResponse: { success: false, ...action.error }
            }
        case actionTypes.DELETE_CLIENT_ACTIVITY_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_CLIENT_ACTIVITY_LOG_SUCCESS: 
            return {
                ...state,
                deleteClientActivityLogResponse: { success: true, ...action.response }
            }
        case actionTypes.DELETE_CLIENT_ACTIVITY_LOG_FAILURE:
            return {
                ...state,
                deleteClientActivityLogResponse: { success: false, ...action.error }
            }
        case actionTypes.UPDATE_CLIENT_ACTIVITY_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_CLIENT_ACTIVITY_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };
        //clientshift
        case actionTypes.EDIT_CLIENT_SHIFT_ACTIVITY_REQUEST:
            return {
                ...state
            };
        case actionTypes.EDIT_CLIENT_SHIFT_ACTIVITY_SUCCESS:
            return {
                ...state,
                editClientShiftActivityData: { success: true, ...action.response }
            };
        case actionTypes.EDIT_CLIENT_SHIFT_ACTIVITY_FAILURE:
            return {
                ...state,
                editClientShiftActivityData: { success: false, ...action.error }
            };
        default:
            return {
                ...state
            };
    }
};

export default reducerResp;
