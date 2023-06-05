import * as actionTypes from './constants'

const initialState = {
    ClientLogbookData: {},
    addClientLogbookData: {},
    deleteClientLogbookData:{},
    editClientLogbookData:{},
    getListForCommonFilterResponse:{},
    getClientLogbookByIdResponse:{},
    getAllClientLogbookLogResponse:{},
    restoreClientLogbookLogResponse:{},
    deleteClientLogbookLogResponse:{},
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
}


export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_CLIENT_LOGBOOK_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_CLIENT_LOGBOOK_SUCCESS: 
            return {
                ...state,
                ClientLogbookData: { success: true, ...action.response }
            }
        case actionTypes.GET_CLIENT_LOGBOOK_FAILURE:
            return {
                ...state,
                ClientLogbookData: { success: false, ...action.error }
            }

            case actionTypes.ADD_CLIENT_LOGBOOK_REQUEST:
            return {
                ...state
            }
        case actionTypes.ADD_CLIENT_LOGBOOK_SUCCESS:
            return {
                ...state,
                addClientLogbookData: { success: true, ...action.response }
            }
        case actionTypes.ADD_CLIENT_LOGBOOK_FAILURE:
            return {
                ...state,
                addClientLogbookData: { success: false, ...action.error }
            }

            case actionTypes.DELETE_CLIENT_LOGBOOK_REQUEST:
                return {
                    ...state
                }
            case actionTypes.DELETE_CLIENT_LOGBOOK_SUCCESS:
                return {
                    ...state,
                    deleteClientLogbookData: { success: true, ...action.response }
                }
            case actionTypes.DELETE_CLIENT_LOGBOOK_FAILURE:
                return {
                    ...state,
                    deleteClientLogbookData: { success: false, ...action.error }
                }

                case actionTypes.EDIT_CLIENT_LOGBOOK_REQUEST:
                    return {
                        ...state
                    }
                case actionTypes.EDIT_CLIENT_LOGBOOK_SUCCESS:
                    return {
                        ...state,
                        editClientLogbookData: { success: true, ...action.response }
                    }
                case actionTypes.EDIT_CLIENT_LOGBOOK_FAILURE:
                    return {
                        ...state,
                        editClientLogbookData: { success: false, ...action.error }
                    }
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
        case actionTypes.GET_CLIENT_LOGBOOK_BY_ID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_CLIENT_LOGBOOK_BY_ID_SUCCESS: 
            return {
                ...state,
                getClientLogbookByIdResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_CLIENT_LOGBOOK_BY_ID_FAILURE:
            return {
                ...state,
                getClientLogbookByIdResponse: { success: false, ...action.error }
            }
        case actionTypes.GET_ALL_CLIENT_LOGBOOK_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ALL_CLIENT_LOGBOOK_LOG_SUCCESS: 
            return {
                ...state,
                getAllClientLogbookLogResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_ALL_CLIENT_LOGBOOK_LOG_FAILURE:
            return {
                ...state,
                getAllClientLogbookLogResponse: { success: false, ...action.error }
            }
        case actionTypes.RESTORE_CLIENT_LOGBOOK_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.RESTORE_CLIENT_LOGBOOK_LOG_SUCCESS: 
            return {
                ...state,
                restoreClientLogbookLogResponse: { success: true, ...action.response }
            }
        case actionTypes.RESTORE_CLIENT_LOGBOOK_LOG_FAILURE:
            return {
                ...state,
                restoreClientLogbookLogResponse: { success: false, ...action.error }
            }
        case actionTypes.DELETE_CLIENT_LOGBOOK_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_CLIENT_LOGBOOK_LOG_SUCCESS: 
            return {
                ...state,
                deleteClientLogbookLogResponse: { success: true, ...action.response }
            }
        case actionTypes.DELETE_CLIENT_LOGBOOK_LOG_FAILURE:
            return {
                ...state,
                deleteClientLogbookLogResponse: { success: false, ...action.error }
            }
        case actionTypes.UPDATE_CLIENT_LOGBOOK_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_CLIENT_LOGBOOK_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };
                
 
         
            default :
            return{
                ...state
            }
    }
}