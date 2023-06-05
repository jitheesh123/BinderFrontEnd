import * as actionTypes from "./constants";

const initialState = {
    getBuildingActivityListResponse: {},
    addBuildingActivityData: {},
    deleteBuildingActivityData: {},
    editBuildingActivityData: {},
    getListForCommonFilterResponse:{},
    getBuildingActivityByIdResponse:{},
    getAllBuildingActivityLogResponse:{},
    restoreBuildingActivityLogResponse:{},
    deleteBuildingActivityLogResponse:{},
    editBuildingShiftActivityResponse:{},
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
};

const reducerResp = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_BUILDING_ACTIVITY_LIST_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_BUILDING_ACTIVITY_LIST_SUCCESS:
            return {
                ...state,
                getBuildingActivityListResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_BUILDING_ACTIVITY_LIST_FAILURE:
            return {
                ...state,
                getBuildingActivityListResponse: { success: false, ...action.error }
            };

        case actionTypes.ADD_BUILDING_ACTIVITY_REQUEST:
            return {
                ...state
            };
        case actionTypes.ADD_BUILDING_ACTIVITY_SUCCESS:
            return {
                ...state,
                addBuildingActivityData: { success: true, ...action.response }
            };
        case actionTypes.ADD_BUILDING_ACTIVITY_FAILURE:
            return {
                ...state,
                addBuildingActivityData: { success: false, ...action.error }
            };

        case actionTypes.DELETE_BUILDING_ACTIVITY_REQUEST:
            return {
                ...state
            };
        case actionTypes.DELETE_BUILDING_ACTIVITY_SUCCESS:
            return {
                ...state,
                deleteBuildingActivityData: { success: true, ...action.response }
            };
        case actionTypes.DELETE_BUILDING_ACTIVITY_FAILURE:
            return {
                ...state,
                deleteBuildingActivityData: { success: false, ...action.error }
            };

        case actionTypes.EDIT_BUILDING_ACTIVITY_REQUEST:
            return {
                ...state
            };
        case actionTypes.EDIT_BUILDING_ACTIVITY_SUCCESS:
            return {
                ...state,
                editBuildingActivityData: { success: true, ...action.response }
            };
        case actionTypes.EDIT_BUILDING_ACTIVITY_FAILURE:
            return {
                ...state,
                editBuildingActivityData: { success: false, ...action.error }
            };
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
        case actionTypes.GET_BUILDING_ACTIVITY_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_BUILDING_ACTIVITY_BY_ID_SUCCESS:
            return {
                ...state,
                getBuildingActivityByIdResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_BUILDING_ACTIVITY_BY_ID_FAILURE:
            return {
                ...state,
                getBuildingActivityByIdResponse: { success: false, ...action.error }
            };
        case actionTypes.GET_ALL_BUILDING_ACTIVITY_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ALL_BUILDING_ACTIVITY_LOG_SUCCESS: 
            return {
                ...state,
                getAllBuildingActivityLogResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_ALL_BUILDING_ACTIVITY_LOG_FAILURE:
            return {
                ...state,
                getAllBuildingActivityLogResponse: { success: false, ...action.error }
            }
        case actionTypes.RESTORE_BUILDING_ACTIVITY_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.RESTORE_BUILDING_ACTIVITY_LOG_SUCCESS: 
            return {
                ...state,
                restoreBuildingActivityLogResponse: { success: true, ...action.response }
            }
        case actionTypes.RESTORE_BUILDING_ACTIVITY_LOG_FAILURE:
            return {
                ...state,
                restoreBuildingActivityLogResponse: { success: false, ...action.error }
            }
        case actionTypes.DELETE_BUILDING_ACTIVITY_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_BUILDING_ACTIVITY_LOG_SUCCESS: 
            return {
                ...state,
                deleteBuildingActivityLogResponse: { success: true, ...action.response }
            }
        case actionTypes.DELETE_BUILDING_ACTIVITY_LOG_FAILURE:
            return {
                ...state,
                deleteBuildingActivityLogResponse: { success: false, ...action.error }
            }
        case actionTypes.UPDATE_BUILDING_ACTIVITY_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_BUILDING_ACTIVITY_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };
        //shiftbuildingedit
        case actionTypes.EDIT_BUILDING_SHIFT_ACTIVITY_REQUEST:
            return {
                ...state
            };
        case actionTypes.EDIT_BUILDING_SHIFT_ACTIVITY_SUCCESS:
            return {
                ...state,
                editBuildingShiftActivityResponse: { success: true, ...action.response }
            };
        case actionTypes.EDIT_BUILDING_SHIFT_ACTIVITY_FAILURE:
            return {
                ...state,
                editBuildingShiftActivityResponse: { success: false, ...action.error }
            };

        default:
            return {
                ...state
            };
    }
};

export default reducerResp;
