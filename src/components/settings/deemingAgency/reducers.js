import * as actionTypes from './constants' 

const initialState = {
    deemingAgencyData: {},
    adddeemingAgencyData: {},
    getDeemingAgencyById: {},
    editDeemingAgencyById: {},
    deleteDeemingAgencyById:{},
    getListForCommonFilterResponse:{},
    getDeemingAgencyByIdResponse:{},
    getAllDeemingAgencyLogResponse:{},
    restoreDeemingAgencyLogResponse:{},
    deleteDeemingAgencyLogResponse:{},
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
        case actionTypes.GET_DEEMING_AGENCY_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_DEEMING_AGENCY_SUCCESS:
            // let tempArray =
            //     action.response.deemingAgency && action.response.deemingAgency.length ? action.response.deemingAgency.map(temp => { return JSON.parse(temp) }) : []
            return {
                ...state,
                // deemingAgencyData: { success: true, deemingAgency: tempArray, count: action.response.count }
                deemingAgencyData: { success: true, ...action.response }
            }
        case actionTypes.GET_DEEMING_AGENCY_FAILURE:
            return {
                ...state,
                deemingAgencyData: { success: false, ...action.error }
            }

        case actionTypes.ADD_DEEMING_AGENCY_REQUEST:
            return {
                ...state
            }
        case actionTypes.ADD_DEEMING_AGENCY_SUCCESS:
            return {
                ...state,
                adddeemingAgencyData: { success: true, ...action.response }
            }
        case actionTypes.ADD_DEEMING_AGENCY_FAILURE:
            return {
                ...state,
                adddeemingAgencyData: { success: false, ...action.error }
            }

        case actionTypes.GET_DEEMING_AGENCY_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_DEEMING_AGENCY_BYID_SUCCESS:

            return {

                ...state,
                getDeemingAgencyById: { success: true, ...action.response }
            }
        case actionTypes.GET_DEEMING_AGENCY_BYID_FAILURE:
            return {
                ...state,
                getDeemingAgencyById: { success: false, ...action.error }
            }

        case actionTypes.EDIT_DEEMING_AGENCY_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.EDIT_DEEMING_AGENCY_BYID_SUCCESS:
            return {
                ...state,
                editDeemingAgencyById: { success: true, ...action.response }
            }
        case actionTypes.EDIT_DEEMING_AGENCY_BYID_FAILURE:
            return {
                ...state,
                editDeemingAgencyById: { success: false, ...action.error }
            }

            case actionTypes.DELETE_DEEMING_AGENCY_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_DEEMING_AGENCY_BYID_SUCCESS:
            return {
                ...state,
                deleteDeemingAgencyById: { success: true, ...action.response }
            }
        case actionTypes.DELETE_DEEMING_AGENCY_BYID_FAILURE:
            return {
                ...state,
                deleteDeemingAgencyById: { success: false, ...action.error }
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
        case actionTypes.GET_DEEMING_AGENCY_BY_ID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_DEEMING_AGENCY_BY_ID_SUCCESS:
            return {
                ...state,
                getDeemingAgencyByIdResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_DEEMING_AGENCY_BY_ID_FAILURE:
            return {
                ...state,
                getDeemingAgencyByIdResponse: { success: false, ...action.error }
            }
        case actionTypes.GET_ALL_DEEMING_AGENCY_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ALL_DEEMING_AGENCY_LOG_SUCCESS: 
            return {
                ...state,
                getAllDeemingAgencyLogResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_ALL_DEEMING_AGENCY_LOG_FAILURE:
            return {
                ...state,
                getAllDeemingAgencyLogResponse: { success: false, ...action.error }
            }
        case actionTypes.RESTORE_DEEMING_AGENCY_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.RESTORE_DEEMING_AGENCY_LOG_SUCCESS: 
            return {
                ...state,
                restoreDeemingAgencyLogResponse: { success: true, ...action.response }
            }
        case actionTypes.RESTORE_DEEMING_AGENCY_LOG_FAILURE:
            return {
                ...state,
                restoreDeemingAgencyLogResponse: { success: false, ...action.error }
            }
        case actionTypes.DELETE_DEEMING_AGENCY_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_DEEMING_AGENCY_LOG_SUCCESS: 
            return {
                ...state,
                deleteDeemingAgencyLogResponse: { success: true, ...action.response }
            }
        case actionTypes.DELETE_DEEMING_AGENCY_LOG_FAILURE:
            return {
                ...state,
                deleteDeemingAgencyLogResponse: { success: false, ...action.error }
            }
        case actionTypes.UPDATE_DEEMING_AGENCY_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_DEEMING_AGENCY_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };

        default:
            return state;
    }
}