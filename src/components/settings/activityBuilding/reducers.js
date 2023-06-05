import { initial } from 'lodash';
import * as actionTypes from './constants'

const initialState ={
    buildingData:{},
    addBuildingData:{},
    editBuildingData:{},
    deleteBuildingData:{},
    getListForCommonFilterResponse:{},
    getBuildingByIdResponse:{},
    getAllBuildingLogResponse:{},
    restoreBuildingLogResponse:{},
    deleteBuildingLogResponse:{},
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

export default  (state=initialState, action) =>{
    switch(action.type){
        case actionTypes.GET_ACTIVITY_BUILDING_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ACTIVITY_BUILDING_SUCCESS:
            return {
                ...state,
                buildingData: { success: true, ...action.response }
            }
        case actionTypes.GET_ACTIVITY_BUILDING_FAILURE:
            return {
                ...state,
                buildingData: { success: false, ...action.error }
            }

            case actionTypes.ADD_ACTIVITY_BUILDING_REQUEST:
            return {
                ...state
            }
        case actionTypes.ADD_ACTIVITY_BUILDING_SUCCESS:
            return {
                ...state,
                addBuildingData: { success: true, ...action.response }
            }
        case actionTypes.ADD_ACTIVITY_BUILDING_FAILURE:
            return {
                ...state,
                addBuildingData: { success: false, ...action.error }
            }

            case actionTypes.EDIT_ACTIVITY_BUILDING_REQUEST:
                return {
                    ...state
                }
            case actionTypes.EDIT_ACTIVITY_BUILDING_SUCCESS:
                return {
                    ...state,
                    editBuildingData: { success: true, ...action.response }
                }
            case actionTypes.EDIT_ACTIVITY_BUILDING_FAILURE:
                return {
                    ...state,
                    editBuildingData: { success: false, ...action.error }
                }

                case actionTypes.DELETE_ACTIVITY_BUILDING_REQUEST:
                    return {
                        ...state
                    }
                case actionTypes.DELETE_ACTIVITY_BUILDING_SUCCESS:
                    return {
                        ...state,
                        deleteBuildingData: { success: true, ...action.response }
                    }
                case actionTypes.DELETE_ACTIVITY_BUILDING_FAILURE:
                    return {
                        ...state,
                        deleteBuildingData: { success: false, ...action.error }
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
        case actionTypes.GET_ACTIVITY_BUILDING_BY_ID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ACTIVITY_BUILDING_BY_ID_SUCCESS:
            return {
                ...state,
                getBuildingByIdResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_ACTIVITY_BUILDING_BY_ID_FAILURE:
            return {
                ...state,
                getBuildingByIdResponse: { success: false, ...action.error }
            }
        case actionTypes.GET_ALL_ACTIVITY_BUILDING_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ALL_ACTIVITY_BUILDING_LOG_SUCCESS: 
            return {
                ...state,
                getAllBuildingLogResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_ALL_ACTIVITY_BUILDING_LOG_FAILURE:
            return {
                ...state,
                getAllBuildingLogResponse: { success: false, ...action.error }
            }
        case actionTypes.RESTORE_ACTIVITY_BUILDING_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.RESTORE_ACTIVITY_BUILDING_LOG_SUCCESS: 
            return {
                ...state,
                restoreBuildingLogResponse: { success: true, ...action.response }
            }
        case actionTypes.RESTORE_ACTIVITY_BUILDING_LOG_FAILURE:
            return {
                ...state,
                restoreBuildingLogResponse: { success: false, ...action.error }
            }
        case actionTypes.DELETE_ACTIVITY_BUILDING_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_ACTIVITY_BUILDING_LOG_SUCCESS: 
            return {
                ...state,
                deleteBuildingLogResponse: { success: true, ...action.response }
            }
        case actionTypes.DELETE_ACTIVITY_BUILDING_LOG_FAILURE:
            return {
                ...state,
                deleteBuildingLogResponse: { success: false, ...action.error }
            }
        case actionTypes.UPDATE_ACTIVITY_BUILDING_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_ACTIVITY_BUILDING_ENTITY_PARAMS_FAILURE:
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