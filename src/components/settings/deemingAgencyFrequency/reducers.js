import * as actionTypes from './constants'

const initialState = {
    deemingAgencyFrequencyData: {},
    addDeemingAgencyFrequencyData: {},
    deleteDeemingAgencyFrequencyData:{},
    editDeemingAgencyFrequencyData:{},
    getListForCommonFilterResponse:{},
    getDeemingAgencyFrequencyByIdResponse:{},
    getAllDeemingAgencyFrequencyLogResponse:{},
    restoreDeemingAgencyFrequencyLogResponse:{},
    deleteDeemingAgencyFrequencyLogResponse:{},
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
            perPage: 10,
            currentPage: 0,
            totalCount: 0
        },
        historyPaginationParams: {
            totalPages: 0,
            perPage: 10,
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
        case actionTypes.GET_DEEMING_AGENCY_FREQUENCY_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_DEEMING_AGENCY_FREQUENCY_SUCCESS: 
            return {
                ...state,
                deemingAgencyFrequencyData: { success: true, ...action.response }
            }
        case actionTypes.GET_DEEMING_AGENCY_FREQUENCY_FAILURE:
            return {
                ...state,
                deemingAgencyFrequencyData: { success: false, ...action.error }
            }

            case actionTypes.ADD_DEEMING_AGENCY_FREQUENCY_REQUEST:
            return {
                ...state
            }
        case actionTypes.ADD_DEEMING_AGENCY_FREQUENCY_SUCCESS:
            return {
                ...state,
                addDeemingAgencyFrequencyData: { success: true, ...action.response }
            }
        case actionTypes.ADD_DEEMING_AGENCY_FREQUENCY_FAILURE:
            return {
                ...state,
                addDeemingAgencyFrequencyData: { success: false, ...action.error }
            }

            case actionTypes.DELETE_DEEMING_AGENCY_FREQUENCY_REQUEST:
                return {
                    ...state
                }
            case actionTypes.DELETE_DEEMING_AGENCY_FREQUENCY_SUCCESS:
                return {
                    ...state,
                    deleteDeemingAgencyFrequencyData: { success: true, ...action.response }
                }
            case actionTypes.DELETE_DEEMING_AGENCY_FREQUENCY_FAILURE:
                return {
                    ...state,
                    deleteDeemingAgencyFrequencyData: { success: false, ...action.error }
                }

                case actionTypes.EDIT_DEEMING_AGENCY_FREQUENCY_REQUEST:
                    return {
                        ...state
                    }
                case actionTypes.EDIT_DEEMING_AGENCY_FREQUENCY_SUCCESS:
                    return {
                        ...state,
                        editDeemingAgencyFrequencyData: { success: true, ...action.response }
                    }
                case actionTypes.EDIT_DEEMING_AGENCY_FREQUENCY_FAILURE:
                    return {
                        ...state,
                        editDeemingAgencyFrequencyData: { success: false, ...action.error }
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
        case actionTypes.GET_DEEMING_AGENCY_FREQUENCY_BY_ID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_DEEMING_AGENCY_FREQUENCY_BY_ID_SUCCESS: 
            return {
                ...state,
                getDeemingAgencyFrequencyByIdResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_DEEMING_AGENCY_FREQUENCY_BY_ID_FAILURE:
            return {
                ...state,
                getDeemingAgencyFrequencyByIdResponse: { success: false, ...action.error }
            }
        case actionTypes.GET_ALL_DEEMING_AGENCY_FREQUENCY_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ALL_DEEMING_AGENCY_FREQUENCY_LOG_SUCCESS: 
            return {
                ...state,
                getAllDeemingAgencyFrequencyLogResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_ALL_DEEMING_AGENCY_FREQUENCY_LOG_FAILURE:
            return {
                ...state,
                getAllDeemingAgencyFrequencyLogResponse: { success: false, ...action.error }
            }
        case actionTypes.RESTORE_DEEMING_AGENCY_FREQUENCY_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.RESTORE_DEEMING_AGENCY_FREQUENCY_LOG_SUCCESS: 
            return {
                ...state,
                restoreDeemingAgencyFrequencyLogResponse: { success: true, ...action.response }
            }
        case actionTypes.RESTORE_DEEMING_AGENCY_FREQUENCY_LOG_FAILURE:
            return {
                ...state,
                restoreDeemingAgencyFrequencyLogResponse: { success: false, ...action.error }
            }
        case actionTypes.DELETE_DEEMING_AGENCY_FREQUENCY_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_DEEMING_AGENCY_FREQUENCY_LOG_SUCCESS: 
            return {
                ...state,
                deleteDeemingAgencyFrequencyLogResponse: { success: true, ...action.response }
            }
        case actionTypes.DELETE_DEEMING_AGENCY_FREQUENCY_LOG_FAILURE:
            return {
                ...state,
                deleteDeemingAgencyFrequencyLogResponse: { success: false, ...action.error }
            }
        case actionTypes.UPDATE_DEEMING_AGENCY_FREQUENCY_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_DEEMING_AGENCY_FREQUENCY_ENTITY_PARAMS_FAILURE:
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