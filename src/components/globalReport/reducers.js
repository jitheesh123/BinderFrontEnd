import * as actionTypes from './constants'

const initialState = {
    reportData: {},
    addReportData: {},
    deleteReportData:{},
    editReportData:{},
    getListForCommonFilterResponse:{},
    getLogbookByIdResponse:{},
    getAllLogbookLogResponse:{},
    restoreLogbookLogResponse:{},
    deleteLogbookLogResponse:{},
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
        case actionTypes.GET_REPORT_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_REPORT_SUCCESS: 
            return {
                ...state,
                reportData: { success: true, ...action.response }
            }
        case actionTypes.GET_REPORT_FAILURE:
            return {
                ...state,
                reportData: { success: false, ...action.error }
            }

            case actionTypes.ADD_REPORT_REQUEST:
            return {
                ...state
            }
        case actionTypes.ADD_REPORT_SUCCESS:
            return {
                ...state,
                addReportData: { success: true, ...action.response }
            }
        case actionTypes.ADD_REPORT_FAILURE:
            return {
                ...state,
                addReportData: { success: false, ...action.error }
            }

            case actionTypes.DELETE_REPORT_REQUEST:
                return {
                    ...state
                }
            case actionTypes.DELETE_REPORT_SUCCESS:
                return {
                    ...state,
                    deleteReportData: { success: true, ...action.response }
                }
            case actionTypes.DELETE_REPORT_FAILURE:
                return {
                    ...state,
                    deleteReportData: { success: false, ...action.error }
                }

                case actionTypes.EDIT_REPORT_REQUEST:
                    return {
                        ...state
                    }
                case actionTypes.EDIT_REPORT_SUCCESS:
                    return {
                        ...state,
                        editReportData: { success: true, ...action.response }
                    }
                case actionTypes.EDIT_REPORT_FAILURE:
                    return {
                        ...state,
                        editReportData: { success: false, ...action.error }
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
        case actionTypes.GET_REPORT_BY_ID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_REPORT_BY_ID_SUCCESS: 
            return {
                ...state,
                getLogbookByIdResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_REPORT_BY_ID_FAILURE:
            return {
                ...state,
                getLogbookByIdResponse: { success: false, ...action.error }
            }
        case actionTypes.GET_ALL_REPORT_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ALL_REPORT_LOG_SUCCESS: 
            return {
                ...state,
                getAllLogbookLogResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_ALL_REPORT_LOG_FAILURE:
            return {
                ...state,
                getAllLogbookLogResponse: { success: false, ...action.error }
            }
        case actionTypes.RESTORE_REPORT_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.RESTORE_REPORT_LOG_SUCCESS: 
            return {
                ...state,
                restoreLogbookLogResponse: { success: true, ...action.response }
            }
        case actionTypes.RESTORE_REPORT_LOG_FAILURE:
            return {
                ...state,
                restoreLogbookLogResponse: { success: false, ...action.error }
            }
        case actionTypes.DELETE_REPORT_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_REPORT_LOG_SUCCESS: 
            return {
                ...state,
                deleteLogbookLogResponse: { success: true, ...action.response }
            }
        case actionTypes.DELETE_REPORT_LOG_FAILURE:
            return {
                ...state,
                deleteLogbookLogResponse: { success: false, ...action.error }
            }
        case actionTypes.UPDATE_REPORT_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_REPORT_ENTITY_PARAMS_FAILURE:
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