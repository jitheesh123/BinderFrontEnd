import * as actionTypes from "./constants";

const initialState = {
    sectorData: {},
    addSectorData: {},
    editSectorData: {},
    deleteSectorData: {},
    getListForCommonFilterResponse:{},
    getSectorByIdResponse:{},
    getAllSectorLogResponse:{},
    restoreSectorLogResponse:{},
    deleteSectorLogResponse:{},
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

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_SECTOR_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_SECTOR_SUCCESS:
            return {
                ...state,
                sectorData: { success: true, ...action.response }
            };
        case actionTypes.GET_SECTOR_FAILURE:
            return {
                ...state,
                sectorData: { success: false, ...action.error }
            };

        case actionTypes.ADD_SECTOR_REQUEST:
            return {
                ...state
            };
        case actionTypes.ADD_SECTOR_SUCCESS:
            return {
                ...state,
                addSectorData: { success: true, ...action.response }
            };
        case actionTypes.ADD_SECTOR_FAILURE:
            return {
                ...state,
                addSectorData: { success: false, ...action.error }
            };

        case actionTypes.EDIT_SECTOR_BYID_REQUEST:
            return {
                ...state
            };
        case actionTypes.EDIT_SECTOR_BYID_SUCCESS:
            return {
                ...state,
                editSectorData: { success: true, ...action.response }
            };
        case actionTypes.EDIT_SECTOR_BYID_FAILURE:
            return {
                ...state,
                editSectorData: { success: false, ...action.error }
            };

        case actionTypes.DELETE_SECTOR_BYID_REQUEST:
            return {
                ...state
            };
        case actionTypes.DELETE_SECTOR_BYID_SUCCESS:
            return {
                ...state,
                deleteSectorData: { success: true, ...action.response }
            };
        case actionTypes.DELETE_SECTOR_BYID_FAILURE:
            return {
                ...state,
                deleteSectorData: { success: false, ...action.error }
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
        case actionTypes.GET_SECTOR_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_SECTOR_BY_ID_SUCCESS:
            return {
                ...state,
                getSectorByIdResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_SECTOR_BY_ID_FAILURE:
            return {
                ...state,
                getSectorByIdResponse: { success: false, ...action.error }
            };
        case actionTypes.GET_ALL_SECTOR_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ALL_SECTOR_LOG_SUCCESS: 
            return {
                ...state,
                getAllSectorLogResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_ALL_SECTOR_LOG_FAILURE:
            return {
                ...state,
                getAllSectorLogResponse: { success: false, ...action.error }
            }
        case actionTypes.RESTORE_SECTOR_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.RESTORE_SECTOR_LOG_SUCCESS: 
            return {
                ...state,
                restoreSectorLogResponse: { success: true, ...action.response }
            }
        case actionTypes.RESTORE_SECTOR_LOG_FAILURE:
            return {
                ...state,
                restoreSectorLogResponse: { success: false, ...action.error }
            }
        case actionTypes.DELETE_SECTOR_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_SECTOR_LOG_SUCCESS: 
            return {
                ...state,
                deleteSectorLogResponse: { success: true, ...action.response }
            }
        case actionTypes.DELETE_SECTOR_LOG_FAILURE:
            return {
                ...state,
                deleteSectorLogResponse: { success: false, ...action.error }
            }
        case actionTypes.UPDATE_SECTOR_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_SECTOR_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };

        default:
            return {
                ...state
            };
    }
};
