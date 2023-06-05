import * as actionTypes from './constants' 

const initialState = {
    buildingTypeData: {},
    addbuildingTypeData: {},
    getbuildingTypeById: {},
    editbuildingTypeById: {},
    deletebuildingTypeById:{},
    getListForCommonFilterResponse:{},
    getbuildingTypeByIdResponse:{},
    getAllbuildingTypeLogResponse:{},
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
        case actionTypes.GET_BUILDING_TYPE_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_BUILDING_TYPE_SUCCESS:
            // let tempArray =
            //     action.response.buildingType && action.response.buildingType.length ? action.response.buildingType.map(temp => { return JSON.parse(temp) }) : []
            return {
                ...state,
                // buildingTypeData: { success: true, buildingType: tempArray, count: action.response.count }
                buildingTypeData: { success: true, ...action.response }
            }
        case actionTypes.GET_BUILDING_TYPE_FAILURE:
            return {
                ...state,
                buildingTypeData: { success: false, ...action.error }
            }

        case actionTypes.ADD_BUILDING_TYPE_REQUEST:
            return {
                ...state
            }
        case actionTypes.ADD_BUILDING_TYPE_SUCCESS:
            return {
                ...state,
                addbuildingTypeData: { success: true, ...action.response }
            }
        case actionTypes.ADD_BUILDING_TYPE_FAILURE:
            return {
                ...state,
                addbuildingTypeData: { success: false, ...action.error }
            }

        case actionTypes.GET_BUILDING_TYPE_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_BUILDING_TYPE_BYID_SUCCESS:

            return {

                ...state,
                getbuildingTypeById: { success: true, ...action.response }
            }
        case actionTypes.GET_BUILDING_TYPE_BYID_FAILURE:
            return {
                ...state,
                getbuildingTypeById: { success: false, ...action.error }
            }

        case actionTypes.EDIT_BUILDING_TYPE_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.EDIT_BUILDING_TYPE_BYID_SUCCESS:
            return {
                ...state,
                editbuildingTypeById: { success: true, ...action.response }
            }
        case actionTypes.EDIT_BUILDING_TYPE_BYID_FAILURE:
            return {
                ...state,
                editbuildingTypeById: { success: false, ...action.error }
            }

            case actionTypes.DELETE_BUILDING_TYPE_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_BUILDING_TYPE_BYID_SUCCESS:
            return {
                ...state,
                deletebuildingTypeById: { success: true, ...action.response }
            }
        case actionTypes.DELETE_BUILDING_TYPE_BYID_FAILURE:
            return {
                ...state,
                deletebuildingTypeById: { success: false, ...action.error }
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
        case actionTypes.GET_BUILDING_TYPE_BY_ID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_BUILDING_TYPE_BY_ID_SUCCESS:
            return {
                ...state,
                getbuildingTypeByIdResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_BUILDING_TYPE_BY_ID_FAILURE:
            return {
                ...state,
                getbuildingTypeByIdResponse: { success: false, ...action.error }
            }
        case actionTypes.GET_ALL_BUILDING_TYPE_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ALL_BUILDING_TYPE_LOG_SUCCESS: 
            return {
                ...state,
                getAllbuildingTypeLogResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_ALL_BUILDING_TYPE_LOG_FAILURE:
            return {
                ...state,
                getAllbuildingTypeLogResponse: { success: false, ...action.error }
            }
        case actionTypes.RESTORE_BUILDING_TYPE_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.RESTORE_BUILDING_TYPE_LOG_SUCCESS: 
            return {
                ...state,
                restorebuildingTypeLogResponse: { success: true, ...action.response }
            }
        case actionTypes.RESTORE_BUILDING_TYPE_LOG_FAILURE:
            return {
                ...state,
                restorebuildingTypeLogResponse: { success: false, ...action.error }
            }
        case actionTypes.DELETE_BUILDING_TYPE_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_BUILDING_TYPE_LOG_SUCCESS: 
            return {
                ...state,
                deletebuildingTypeLogResponse: { success: true, ...action.response }
            }
        case actionTypes.DELETE_BUILDING_TYPE_LOG_FAILURE:
            return {
                ...state,
                deletebuildingTypeLogResponse: { success: false, ...action.error }
            }
        case actionTypes.UPDATE_BUILDING_TYPE_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_BUILDING_TYPE_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };

        default:
            return state;
    }
}