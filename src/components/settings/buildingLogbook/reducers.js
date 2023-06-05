import * as actionTypes from './constants'

const initialState = {
    BuildingLogbookData: {},
    addBuildingLogbookData: {},
    deleteBuildingLogbookData:{},
    editBuildingLogbookData:{},
    getListForCommonFilterResponse:{},
    getBuildingLogbookByIdResponse:{},
    getAllBuildingLogbookLogResponse:{},
    restoreBuildingLogbookLogResponse:{},
    deleteBuildingLogbookLogResponse:{},
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
        case actionTypes.GET_BUILDING_LOGBOOK_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_BUILDING_LOGBOOK_SUCCESS: 
            return {
                ...state,
                BuildingLogbookData: { success: true, ...action.response }
            }
        case actionTypes.GET_BUILDING_LOGBOOK_FAILURE:
            return {
                ...state,
                BuildingLogbookData: { success: false, ...action.error }
            }

            case actionTypes.ADD_BUILDING_LOGBOOK_REQUEST:
            return {
                ...state
            }
        case actionTypes.ADD_BUILDING_LOGBOOK_SUCCESS:
            return {
                ...state,
                addBuildingLogbookData: { success: true, ...action.response }
            }
        case actionTypes.ADD_BUILDING_LOGBOOK_FAILURE:
            return {
                ...state,
                addBuildingLogbookData: { success: false, ...action.error }
            }

            case actionTypes.DELETE_BUILDING_LOGBOOK_REQUEST:
                return {
                    ...state
                }
            case actionTypes.DELETE_BUILDING_LOGBOOK_SUCCESS:
                return {
                    ...state,
                    deleteBuildingLogbookData: { success: true, ...action.response }
                }
            case actionTypes.DELETE_BUILDING_LOGBOOK_FAILURE:
                return {
                    ...state,
                    deleteBuildingLogbookData: { success: false, ...action.error }
                }

                case actionTypes.EDIT_BUILDING_LOGBOOK_REQUEST:
                    return {
                        ...state
                    }
                case actionTypes.EDIT_BUILDING_LOGBOOK_SUCCESS:
                    return {
                        ...state,
                        editBuildingLogbookData: { success: true, ...action.response }
                    }
                case actionTypes.EDIT_BUILDING_LOGBOOK_FAILURE:
                    return {
                        ...state,
                        editBuildingLogbookData: { success: false, ...action.error }
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
        case actionTypes.GET_BUILDING_LOGBOOK_BY_ID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_BUILDING_LOGBOOK_BY_ID_SUCCESS: 
            return {
                ...state,
                getBuildingLogbookByIdResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_BUILDING_LOGBOOK_BY_ID_FAILURE:
            return {
                ...state,
                getBuildingLogbookByIdResponse: { success: false, ...action.error }
            }
        case actionTypes.GET_ALL_BUILDING_LOGBOOK_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ALL_BUILDING_LOGBOOK_LOG_SUCCESS: 
            return {
                ...state,
                getAllBuildingLogbookLogResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_ALL_BUILDING_LOGBOOK_LOG_FAILURE:
            return {
                ...state,
                getAllBuildingLogbookLogResponse: { success: false, ...action.error }
            }
        case actionTypes.RESTORE_BUILDING_LOGBOOK_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.RESTORE_BUILDING_LOGBOOK_LOG_SUCCESS: 
            return {
                ...state,
                restoreBuildingLogbookLogResponse: { success: true, ...action.response }
            }
        case actionTypes.RESTORE_BUILDING_LOGBOOK_LOG_FAILURE:
            return {
                ...state,
                restoreBuildingLogbookLogResponse: { success: false, ...action.error }
            }
        case actionTypes.DELETE_BUILDING_LOGBOOK_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_BUILDING_LOGBOOK_LOG_SUCCESS: 
            return {
                ...state,
                deleteBuildingLogbookLogResponse: { success: true, ...action.response }
            }
        case actionTypes.DELETE_BUILDING_LOGBOOK_LOG_FAILURE:
            return {
                ...state,
                deleteBuildingLogbookLogResponse: { success: false, ...action.error }
            }
        case actionTypes.UPDATE_BUILDING_LOGBOOK_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_BUILDING_LOGBOOK_ENTITY_PARAMS_FAILURE:
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