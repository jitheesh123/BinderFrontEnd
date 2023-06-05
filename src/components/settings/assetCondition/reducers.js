import * as actionTypes from './constants' 

const initialState = {
    assetConditionData: {},
    addAssetConditionData: {},
    editAssetConditionResponse: {},
    deleteAssetConditionResponse:{},
    getListForCommonFilterResponse:{},
    getAssetConditionByIdResponse:{},
    getAllAssetConditionLogResponse:{},
    restoreAssetConditionLogResponse:{},
    deleteAssetConditionLogResponse:{},
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
        case actionTypes.GET_ASSET_CONDITION_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ASSET_CONDITION_SUCCESS:
            return {
                ...state,
                assetConditionData: { success: true, ...action.response }
            }
        case actionTypes.GET_ASSET_CONDITION_FAILURE:
            return {
                ...state,
                assetConditionData: { success: false, ...action.error }
            }

        case actionTypes.ADD_ASSET_CONDITION_REQUEST:
            return {
                ...state
            }
        case actionTypes.ADD_ASSET_CONDITION_SUCCESS:
            return {
                ...state,
                addAssetConditionData: { success: true, ...action.response }
            }
        case actionTypes.ADD_ASSET_CONDITION_FAILURE:
            return {
                ...state,
                addAssetConditionData: { success: false, ...action.error }
            }
        case actionTypes.EDIT_ASSET_CONDITION_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.EDIT_ASSET_CONDITION_BYID_SUCCESS:
            return {
                ...state,
                editAssetConditionResponse: { success: true, ...action.response }
            }
        case actionTypes.EDIT_ASSET_CONDITION_BYID_FAILURE:
            return {
                ...state,
                editAssetConditionResponse: { success: false, ...action.error }
            }

            case actionTypes.DELETE_ASSET_CONDITION_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_ASSET_CONDITION_BYID_SUCCESS:
            return {
                ...state,
                deleteAssetConditionResponse: { success: true, ...action.response }
            }
        case actionTypes.DELETE_ASSET_CONDITION_BYID_FAILURE:
            return {
                ...state,
                deleteAssetConditionResponse: { success: false, ...action.error }
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
        case actionTypes.GET_ASSET_CONDITION_BY_ID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ASSET_CONDITION_BY_ID_SUCCESS:
            return {
                ...state,
                getAssetConditionByIdResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_ASSET_CONDITION_BY_ID_FAILURE:
            return {
                ...state,
                getAssetConditionByIdResponse: { success: false, ...action.error }
            }
        case actionTypes.GET_ALL_ASSET_CONDITION_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ALL_ASSET_CONDITION_LOG_SUCCESS: 
            return {
                ...state,
                getAllAssetConditionLogResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_ALL_ASSET_CONDITION_LOG_FAILURE:
            return {
                ...state,
                getAllAssetConditionLogResponse: { success: false, ...action.error }
            }
        case actionTypes.RESTORE_ASSET_CONDITION_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.RESTORE_ASSET_CONDITION_LOG_SUCCESS: 
            return {
                ...state,
                restoreAssetConditionLogResponse: { success: true, ...action.response }
            }
        case actionTypes.RESTORE_ASSET_CONDITION_LOG_FAILURE:
            return {
                ...state,
                restoreAssetConditionLogResponse: { success: false, ...action.error }
            }
        case actionTypes.DELETE_ASSET_CONDITION_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_ASSET_CONDITION_LOG_SUCCESS: 
            return {
                ...state,
                deleteAssetConditionLogResponse: { success: true, ...action.response }
            }
        case actionTypes.DELETE_ASSET_CONDITION_LOG_FAILURE:
            return {
                ...state,
                deleteAssetConditionLogResponse: { success: false, ...action.error }
            }
        case actionTypes.UPDATE_ASSET_CONDITION_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_ASSET_CONDITION_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };

        default:
            return state;
    }
}