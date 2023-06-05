import * as actionTypes from "./constants";

const initialState = {
    assetData: {},
    addAssetData: {},
    editAssetResponse: {},
    deleteAssetResponse: {},
    getListForCommonFilterResponse: {},
    getAssetByIdResponse: {},
    getAllAssetLogResponse: {},
    restoreAssetLogResponse: {},
    deleteAssetLogResponse: {},
    getAllImagesResponse: {},
    getCreateSurveyPopupDetailsForAssetLogbookSchedulingResponse: {},
    getCreateSurveyPopupDetailsForAssetActivitiesSchedulingResponse: {},
    createSurveyResponse: {},
    entityParams: {
        params: {
            limit: 40,
            page: 1,
            search: "",
            filters: null,
            order: null,
            list: null
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
        tableConfig: null
    }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ASSET_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ASSET_SUCCESS:
            return {
                ...state,
                assetData: { success: true, ...action.response }
            };
        case actionTypes.GET_ASSET_FAILURE:
            return {
                ...state,
                assetData: { success: false, ...action.error }
            };

        case actionTypes.ADD_ASSET_REQUEST:
            return {
                ...state
            };
        case actionTypes.ADD_ASSET_SUCCESS:
            return {
                ...state,
                addAssetData: { success: true, ...action.response }
            };
        case actionTypes.ADD_ASSET_FAILURE:
            return {
                ...state,
                addAssetData: { success: false, ...action.error }
            };
        case actionTypes.EDIT_ASSET_BYID_REQUEST:
            return {
                ...state
            };
        case actionTypes.EDIT_ASSET_BYID_SUCCESS:
            return {
                ...state,
                editAssetResponse: { success: true, ...action.response }
            };
        case actionTypes.EDIT_ASSET_BYID_FAILURE:
            return {
                ...state,
                editAssetResponse: { success: false, ...action.error }
            };

        case actionTypes.DELETE_ASSET_BYID_REQUEST:
            return {
                ...state
            };
        case actionTypes.DELETE_ASSET_BYID_SUCCESS:
            return {
                ...state,
                deleteAssetResponse: { success: true, ...action.response }
            };
        case actionTypes.DELETE_ASSET_BYID_FAILURE:
            return {
                ...state,
                deleteAssetResponse: { success: false, ...action.error }
            };
        case actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS:
            return {
                ...state,
                getListForCommonFilterResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE:
            return {
                ...state,
                getListForCommonFilterResponse: { success: false, ...action.error }
            };
        case actionTypes.GET_ASSET_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ASSET_BY_ID_SUCCESS:
            return {
                ...state,
                getAssetByIdResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ASSET_BY_ID_FAILURE:
            return {
                ...state,
                getAssetByIdResponse: { success: false, ...action.error }
            };
        case actionTypes.GET_ALL_ASSET_LOG_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ALL_ASSET_LOG_SUCCESS:
            return {
                ...state,
                getAllAssetLogResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ALL_ASSET_LOG_FAILURE:
            return {
                ...state,
                getAllAssetLogResponse: { success: false, ...action.error }
            };
        case actionTypes.RESTORE_ASSET_LOG_REQUEST:
            return {
                ...state
            };
        case actionTypes.RESTORE_ASSET_LOG_SUCCESS:
            return {
                ...state,
                restoreAssetLogResponse: { success: true, ...action.response }
            };
        case actionTypes.RESTORE_ASSET_LOG_FAILURE:
            return {
                ...state,
                restoreAssetLogResponse: { success: false, ...action.error }
            };
        case actionTypes.DELETE_ASSET_LOG_REQUEST:
            return {
                ...state
            };
        case actionTypes.DELETE_ASSET_LOG_SUCCESS:
            return {
                ...state,
                deleteAssetLogResponse: { success: true, ...action.response }
            };
        case actionTypes.DELETE_ASSET_LOG_FAILURE:
            return {
                ...state,
                deleteAssetLogResponse: { success: false, ...action.error }
            };
        case actionTypes.UPDATE_ASSET_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_ASSET_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };

        case actionTypes.GET_ALL_ASSET_IMAGE_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ALL_ASSET_IMAGE_SUCCESS:
            return {
                ...state,
                getAllImagesResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ALL_ASSET_IMAGE_FAILURE:
            return {
                ...state,
                getAllImagesResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_CREATE_SURVEY_DETAILS_ASSET_LOGBOOK_SCHEDULING_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_CREATE_SURVEY_DETAILS_ASSET_LOGBOOK_SCHEDULING_SUCCESS:
            return {
                ...state,
                getCreateSurveyPopupDetailsForAssetLogbookSchedulingResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_CREATE_SURVEY_DETAILS_ASSET_LOGBOOK_SCHEDULING_FAILURE:
            return {
                ...state,
                getCreateSurveyPopupDetailsForAssetLogbookSchedulingResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_CREATE_SURVEY_DETAILS_ASSET_ACTIVITIES_SCHEDULING_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_CREATE_SURVEY_DETAILS_ASSET_ACTIVITIES_SCHEDULING_SUCCESS:
            return {
                ...state,
                getCreateSurveyPopupDetailsForAssetActivitiesSchedulingResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_CREATE_SURVEY_DETAILS_ASSET_ACTIVITIES_SCHEDULING_FAILURE:
            return {
                ...state,
                getCreateSurveyPopupDetailsForAssetActivitiesSchedulingResponse: { success: false, ...action.error }
            };

        case actionTypes.CREATE_SURVEY_REQUEST:
            return {
                ...state
            };
        case actionTypes.CREATE_SURVEY_SUCCESS:
            return {
                ...state,
                createSurveyResponse: { success: true, ...action.response }
            };
        case actionTypes.CREATE_SURVEY_FAILURE:
            return {
                ...state,
                createSurveyResponse: { success: false, ...action.error }
            };

        default:
            return state;
    }
};
