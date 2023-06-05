import * as actionTypes from './constants'

const initialState = {
    consultancyLogbookData: {},
    addConsultancyLogbookData: {},
    deleteConsultancyLogbookData:{},
    editConsultancyLogbookData:{},
    getListForCommonFilterResponse:{},
    getConsultancyLogbookByIdResponse:{},
    getAllConsultancyLogbookLogResponse:{},
    restoreConsultancyLogbookLogResponse:{},
    deleteConsultancyLogbookLogResponse:{},
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
        case actionTypes.GET_CONSULTANCY_LOGBOOK_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_CONSULTANCY_LOGBOOK_SUCCESS: 
            return {
                ...state,
                consultancyLogbookData: { success: true, ...action.response }
            }
        case actionTypes.GET_CONSULTANCY_LOGBOOK_FAILURE:
            return {
                ...state,
                consultancyLogbookData: { success: false, ...action.error }
            }

            case actionTypes.ADD_CONSULTANCY_LOGBOOK_REQUEST:
            return {
                ...state
            }
        case actionTypes.ADD_CONSULTANCY_LOGBOOK_SUCCESS:
            return {
                ...state,
                addConsultancyLogbookData: { success: true, ...action.response }
            }
        case actionTypes.ADD_CONSULTANCY_LOGBOOK_FAILURE:
            return {
                ...state,
                addConsultancyLogbookData: { success: false, ...action.error }
            }

            case actionTypes.DELETE_CONSULTANCY_LOGBOOK_REQUEST:
                return {
                    ...state
                }
            case actionTypes.DELETE_CONSULTANCY_LOGBOOK_SUCCESS:
                return {
                    ...state,
                    deleteConsultancyLogbookData: { success: true, ...action.response }
                }
            case actionTypes.DELETE_CONSULTANCY_LOGBOOK_FAILURE:
                return {
                    ...state,
                    deleteConsultancyLogbookData: { success: false, ...action.error }
                }

                case actionTypes.EDIT_CONSULTANCY_LOGBOOK_REQUEST:
                    return {
                        ...state
                    }
                case actionTypes.EDIT_CONSULTANCY_LOGBOOK_SUCCESS:
                    return {
                        ...state,
                        editConsultancyLogbookData: { success: true, ...action.response }
                    }
                case actionTypes.EDIT_CONSULTANCY_LOGBOOK_FAILURE:
                    return {
                        ...state,
                        editConsultancyLogbookData: { success: false, ...action.error }
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
        case actionTypes.GET_CONSULTANCY_LOGBOOK_BY_ID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_CONSULTANCY_LOGBOOK_BY_ID_SUCCESS: 
            return {
                ...state,
                getConsultancyLogbookByIdResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_CONSULTANCY_LOGBOOK_BY_ID_FAILURE:
            return {
                ...state,
                getConsultancyLogbookByIdResponse: { success: false, ...action.error }
            }
        case actionTypes.GET_ALL_CONSULTANCY_LOGBOOK_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ALL_CONSULTANCY_LOGBOOK_LOG_SUCCESS: 
            return {
                ...state,
                getAllConsultancyLogbookLogResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_ALL_CONSULTANCY_LOGBOOK_LOG_FAILURE:
            return {
                ...state,
                getAllConsultancyLogbookLogResponse: { success: false, ...action.error }
            }
        case actionTypes.RESTORE_CONSULTANCY_LOGBOOK_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.RESTORE_CONSULTANCY_LOGBOOK_LOG_SUCCESS: 
            return {
                ...state,
                restoreConsultancyLogbookLogResponse: { success: true, ...action.response }
            }
        case actionTypes.RESTORE_CONSULTANCY_LOGBOOK_LOG_FAILURE:
            return {
                ...state,
                restoreConsultancyLogbookLogResponse: { success: false, ...action.error }
            }
        case actionTypes.DELETE_CONSULTANCY_LOGBOOK_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_CONSULTANCY_LOGBOOK_LOG_SUCCESS: 
            return {
                ...state,
                deleteConsultancyLogbookLogResponse: { success: true, ...action.response }
            }
        case actionTypes.DELETE_CONSULTANCY_LOGBOOK_LOG_FAILURE:
            return {
                ...state,
                deleteConsultancyLogbookLogResponse: { success: false, ...action.error }
            }
        case actionTypes.UPDATE_CONSULTANCY_LOGBOOK_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_CONSULTANCY_LOGBOOK_ENTITY_PARAMS_FAILURE:
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