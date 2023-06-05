import * as actionTypes from './constants'

const initialState = {
    campusData: {},
    addCampusData:{},
    editCampusData:{},
    deleteCampusData:{},
    getListForCommonFilterResponse:{},
    getCampusByIdResponse:{},
    getAllCampusLogResponse:{},
    restoreCampusLogResponse:{},
    deleteCampusLogResponse:{},
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
        case actionTypes.GET_CAMPUSES_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_CAMPUSES_SUCCESS:
            return {
                ...state,
                campusData: { success: true, ...action.response }
            }
        case actionTypes.GET_CAMPUSES_FAILURE:
            return {
                ...state,
                campusData: { success: false, ...action.error }
            }

            case actionTypes.ADD_CAMPUSES_REQUEST:
            return {
                ...state
            }
        case actionTypes.ADD_CAMPUSES_SUCCESS:
            return {
                ...state,
                addCampusData: { success: true, ...action.response }
            }
        case actionTypes.ADD_CAMPUSES_FAILURE:
            return {
                ...state,
                addCampusData: { success: false, ...action.error }
            }

            case actionTypes.EDIT_CAMPUSES_BYID_REQUEST:
                return {
                    ...state
                }
            case actionTypes.EDIT_CAMPUSES_BYID_SUCCESS:
                return {
                    ...state,
                    editCampusData: { success: true, ...action.response }
                }
            case actionTypes.EDIT_CAMPUSES_BYID_FAILURE:
                return {
                    ...state,
                    editCampusData: { success: false, ...action.error }
                }

                case actionTypes.DELETE_CAMPUSES_BYID_REQUEST:
                    return {
                        ...state
                    }
                case actionTypes.DELETE_CAMPUSES_BYID_SUCCESS:
                    return {
                        ...state,
                        deleteCampusData: { success: true, ...action.response }
                    }
                case actionTypes.DELETE_CAMPUSES_BYID_FAILURE:
                    return {
                        ...state,
                        deleteCampusData: { success: false, ...action.error }
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
        case actionTypes.GET_CAMPUS_BY_ID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_CAMPUS_BY_ID_SUCCESS:
            return {
                ...state,
                getCampusByIdResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_CAMPUS_BY_ID_FAILURE:
            return {
                ...state,
                getCampusByIdResponse: { success: false, ...action.error }
            }
        case actionTypes.GET_ALL_CAMPUS_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ALL_CAMPUS_LOG_SUCCESS: 
            return {
                ...state,
                getAllCampusLogResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_ALL_CAMPUS_LOG_FAILURE:
            return {
                ...state,
                getAllCampusLogResponse: { success: false, ...action.error }
            }
        case actionTypes.RESTORE_CAMPUS_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.RESTORE_CAMPUS_LOG_SUCCESS: 
            return {
                ...state,
                restoreCampusLogResponse: { success: true, ...action.response }
            }
        case actionTypes.RESTORE_CAMPUS_LOG_FAILURE:
            return {
                ...state,
                restoreCampusLogResponse: { success: false, ...action.error }
            }
        case actionTypes.DELETE_CAMPUS_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_CAMPUS_LOG_SUCCESS: 
            return {
                ...state,
                deleteCampusLogResponse: { success: true, ...action.response }
            }
        case actionTypes.DELETE_CAMPUS_LOG_FAILURE:
            return {
                ...state,
                deleteCampusLogResponse: { success: false, ...action.error }
            }
        case actionTypes.UPDATE_CAMPUS_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_CAMPUS_ENTITY_PARAMS_FAILURE:
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