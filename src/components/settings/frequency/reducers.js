import * as actionTypes from './constants' 

const initialState = {
    frequencyData: {},
    addFrequencyData: {},
    getFrequencyById: {},
    editFrequencyById: {},
    deleteFrequencyById:{},
    getListForCommonFilterResponse:{},
    getFrequencyByIdResponse:{},
    getAllFrequencyLogResponse:{},
    restoreFrequencyLogResponse:{},
    deleteFrequencyLogResponse:{},
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
        case actionTypes.GET_FREQUENCY_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_FREQUENCY_SUCCESS:
            // let tempArray =
            //     action.response.frequency && action.response.frequency.length ? action.response.frequency.map(temp => { return JSON.parse(temp) }) : []
            return {
                ...state,
                // frequencyData: { success: true, frequency: tempArray, count: action.response.count }
                frequencyData: { success: true, ...action.response }
            }
        case actionTypes.GET_FREQUENCY_FAILURE:
            return {
                ...state,
                frequencyData: { success: false, ...action.error }
            }

        case actionTypes.ADD_FREQUENCY_REQUEST:
            return {
                ...state
            }
        case actionTypes.ADD_FREQUENCY_SUCCESS:
            return {
                ...state,
                addFrequencyData: { success: true, ...action.response }
            }
        case actionTypes.ADD_FREQUENCY_FAILURE:
            return {
                ...state,
                addFrequencyData: { success: false, ...action.error }
            }

        case actionTypes.GET_FREQUENCY_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_FREQUENCY_BYID_SUCCESS:

            return {

                ...state,
                getFrequencyById: { success: true, ...action.response }
            }
        case actionTypes.GET_FREQUENCY_BYID_FAILURE:
            return {
                ...state,
                getFrequencyById: { success: false, ...action.error }
            }

        case actionTypes.EDIT_FREQUENCY_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.EDIT_FREQUENCY_BYID_SUCCESS:
            return {
                ...state,
                editFrequencyById: { success: true, ...action.response }
            }
        case actionTypes.EDIT_FREQUENCY_BYID_FAILURE:
            return {
                ...state,
                editFrequencyById: { success: false, ...action.error }
            }

            case actionTypes.DELETE_FREQUENCY_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_FREQUENCY_BYID_SUCCESS:
            return {
                ...state,
                deleteFrequencyById: { success: true, ...action.response }
            }
        case actionTypes.DELETE_FREQUENCY_BYID_FAILURE:
            return {
                ...state,
                deleteFrequencyById: { success: false, ...action.error }
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
        case actionTypes.GET_FREQUENCY_BY_ID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_FREQUENCY_BY_ID_SUCCESS:
            return {
                ...state,
                getFrequencyByIdResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_FREQUENCY_BY_ID_FAILURE:
            return {
                ...state,
                getFrequencyByIdResponse: { success: false, ...action.error }
            }
        case actionTypes.GET_ALL_FREQUENCY_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ALL_FREQUENCY_LOG_SUCCESS: 
            return {
                ...state,
                getAllFrequencyLogResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_ALL_FREQUENCY_LOG_FAILURE:
            return {
                ...state,
                getAllFrequencyLogResponse: { success: false, ...action.error }
            }
        case actionTypes.RESTORE_FREQUENCY_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.RESTORE_FREQUENCY_LOG_SUCCESS: 
            return {
                ...state,
                restoreFrequencyLogResponse: { success: true, ...action.response }
            }
        case actionTypes.RESTORE_FREQUENCY_LOG_FAILURE:
            return {
                ...state,
                restoreFrequencyLogResponse: { success: false, ...action.error }
            }
        case actionTypes.DELETE_FREQUENCY_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_FREQUENCY_LOG_SUCCESS: 
            return {
                ...state,
                deleteFrequencyLogResponse: { success: true, ...action.response }
            }
        case actionTypes.DELETE_FREQUENCY_LOG_FAILURE:
            return {
                ...state,
                deleteFrequencyLogResponse: { success: false, ...action.error }
            }
        case actionTypes.UPDATE_FREQUENCY_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_FREQUENCY_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };

        default:
            return state;
    }
}