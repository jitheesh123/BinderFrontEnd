import * as actionTypes from './constants' 

const initialState = {
    floorData: {},
    addFloorData: {},
    editFloorResponse: {},
    deleteFloorResponse:{},
    getListForCommonFilterResponse:{},
    getFloorByIdResponse:{},
    getAllFloorLogResponse:{},
    restorebuildingTypeLogResponse:{},
    deletebuildingTypeLogResponse:{},
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
        case actionTypes.GET_FLOOR_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_FLOOR_SUCCESS:
            return {
                ...state,
                floorData: { success: true, ...action.response }
            }
        case actionTypes.GET_FLOOR_FAILURE:
            return {
                ...state,
                floorData: { success: false, ...action.error }
            }

        case actionTypes.ADD_FLOOR_REQUEST:
            return {
                ...state
            }
        case actionTypes.ADD_FLOOR_SUCCESS:
            return {
                ...state,
                addFloorData: { success: true, ...action.response }
            }
        case actionTypes.ADD_FLOOR_FAILURE:
            return {
                ...state,
                addFloorData: { success: false, ...action.error }
            }
        case actionTypes.EDIT_FLOOR_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.EDIT_FLOOR_BYID_SUCCESS:
            return {
                ...state,
                editFloorResponse: { success: true, ...action.response }
            }
        case actionTypes.EDIT_FLOOR_BYID_FAILURE:
            return {
                ...state,
                editFloorResponse: { success: false, ...action.error }
            }

            case actionTypes.DELETE_FLOOR_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_FLOOR_BYID_SUCCESS:
            return {
                ...state,
                deleteFloorResponse: { success: true, ...action.response }
            }
        case actionTypes.DELETE_FLOOR_BYID_FAILURE:
            return {
                ...state,
                deleteFloorResponse: { success: false, ...action.error }
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
        case actionTypes.GET_FLOOR_BY_ID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_FLOOR_BY_ID_SUCCESS:
            return {
                ...state,
                getFloorByIdResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_FLOOR_BY_ID_FAILURE:
            return {
                ...state,
                getFloorByIdResponse: { success: false, ...action.error }
            }
        case actionTypes.GET_ALL_FLOOR_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ALL_FLOOR_LOG_SUCCESS: 
            return {
                ...state,
                getAllFloorLogResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_ALL_FLOOR_LOG_FAILURE:
            return {
                ...state,
                getAllFloorLogResponse: { success: false, ...action.error }
            }
        case actionTypes.RESTORE_FLOOR_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.RESTORE_FLOOR_LOG_SUCCESS: 
            return {
                ...state,
                restorebuildingTypeLogResponse: { success: true, ...action.response }
            }
        case actionTypes.RESTORE_FLOOR_LOG_FAILURE:
            return {
                ...state,
                restorebuildingTypeLogResponse: { success: false, ...action.error }
            }
        case actionTypes.DELETE_FLOOR_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_FLOOR_LOG_SUCCESS: 
            return {
                ...state,
                deletebuildingTypeLogResponse: { success: true, ...action.response }
            }
        case actionTypes.DELETE_FLOOR_LOG_FAILURE:
            return {
                ...state,
                deletebuildingTypeLogResponse: { success: false, ...action.error }
            }
        case actionTypes.UPDATE_FLOOR_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_FLOOR_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };

        default:
            return state;
    }
}