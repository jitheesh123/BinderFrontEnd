import * as actionTypes from './constants'

const initialState = {
    clientData: {},
    addClientData: {},
    editClientData: {},
    deleteClientData:{},
    getListForCommonFilterResponse:{},
    getClientByIdResponse:{},
    getAllClientLogResponse:{},
    restoreClientLogResponse:{},
    deleteClientLogResponse:{},
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
        wildCardFilterParams: {},
        filterParams: {},
        tableConfig: null,
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_CLIENTS_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_CLIENTS_SUCCESS:
            return {
                ...state,
                clientData: { success: true, ...action.response }
            }
        case actionTypes.GET_CLIENTS_FAILURE:
            return {
                ...state,
                clientData: { success: false, ...action.error }
            }
        case actionTypes.ADD_CLIENTS_REQUEST:
            return {
                ...state
            }
        case actionTypes.ADD_CLIENTS_SUCCESS:
            return {
                ...state,
                addClientData: { success: true, ...action.response }
            }
        case actionTypes.ADD_CLIENTS_FAILURE:
            return {
                ...state,
                addClientData: { success: false, ...action.error }
            }

            case actionTypes.EDIT_CLIENTS_BYID_REQUEST:
                return {
                    ...state
                }
            case actionTypes.EDIT_CLIENTS_BYID_SUCCESS:
                return {
                    ...state,
                    editClientData: { success: true, ...action.response }
                }
            case actionTypes.EDIT_CLIENTS_BYID_FAILURE:
                return {
                    ...state,
                    editClientData: { success: false, ...action.error }
                }

                case actionTypes.DELETE_CLIENTS_BYID_REQUEST:
                    return {
                        ...state
                    }
                case actionTypes.DELETE_CLIENTS_BYID_SUCCESS:
                    return {
                        ...state,
                        deleteClientData: { success: true, ...action.response }
                    }
                case actionTypes.DELETE_CLIENTS_BYID_FAILURE:
                    return {
                        ...state,
                        deleteClientData: { success: false, ...action.error }
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
        case actionTypes.GET_CLIENT_BY_ID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_CLIENT_BY_ID_SUCCESS:
            return {
                ...state,
                getClientByIdResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_CLIENT_BY_ID_FAILURE:
            return {
                ...state,
                getClientByIdResponse: { success: false, ...action.error }
            }
        case actionTypes.GET_ALL_CLIENT_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ALL_CLIENT_LOG_SUCCESS: 
            return {
                ...state,
                getAllClientLogResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_ALL_CLIENT_LOG_FAILURE:
            return {
                ...state,
                getAllClientLogResponse: { success: false, ...action.error }
            }
        case actionTypes.RESTORE_CLIENT_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.RESTORE_CLIENT_LOG_SUCCESS: 
            return {
                ...state,
                restoreClientLogResponse: { success: true, ...action.response }
            }
        case actionTypes.RESTORE_CLIENT_LOG_FAILURE:
            return {
                ...state,
                restoreClientLogResponse: { success: false, ...action.error }
            }
        case actionTypes.DELETE_CLIENT_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_CLIENT_LOG_SUCCESS: 
            return {
                ...state,
                deleteClientLogResponse: { success: true, ...action.response }
            }
        case actionTypes.DELETE_CLIENT_LOG_FAILURE:
            return {
                ...state,
                deleteClientLogResponse: { success: false, ...action.error }
            }
        case actionTypes.UPDATE_CLIENT_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_CLIENT_ENTITY_PARAMS_FAILURE:
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