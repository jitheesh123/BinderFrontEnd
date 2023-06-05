import * as actionTypes from './constants' 

const initialState = {
    consultanciesData: {},
    addConsultanciesData: {},
    getConsulatancyById: {},
    editConsultancyById: {},
    deleteConsultancyById:{},
    getListForCommonFilterResponse:{},
    getConsultancyByIdResponse:{},
    getAllConsultancyLogResponse:{},
    restoreConsultancyLogResponse:{},
    deleteConsultancyLogResponse:{},
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
        case actionTypes.GET_CONSULTANCIES_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_CONSULTANCIES_SUCCESS:
            // let tempArray =
            //     action.response.consultancies && action.response.consultancies.length ? action.response.consultancies.map(temp => { return JSON.parse(temp) }) : []
            return {
                ...state,
                // consultanciesData: { success: true, consultancies: tempArray, count: action.response.count }
                consultanciesData: { success: true, ...action.response }
            }
        case actionTypes.GET_CONSULTANCIES_FAILURE:
            return {
                ...state,
                consultanciesData: { success: false, ...action.error }
            }

        case actionTypes.ADD_CONSULTANCIES_REQUEST:
            return {
                ...state
            }
        case actionTypes.ADD_CONSULTANCIES_SUCCESS:
            return {
                ...state,
                addConsultanciesData: { success: true, ...action.response }
            }
        case actionTypes.ADD_CONSULTANCIES_FAILURE:
            return {
                ...state,
                addConsultanciesData: { success: false, ...action.error }
            }

        case actionTypes.GET_CONSULTANCIES_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_CONSULTANCIES_BYID_SUCCESS:

            return {

                ...state,
                getConsulatancyById: { success: true, ...action.response }
            }
        case actionTypes.GET_CONSULTANCIES_BYID_FAILURE:
            return {
                ...state,
                getConsulatancyById: { success: false, ...action.error }
            }

        case actionTypes.EDIT_CONSULTANCIES_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.EDIT_CONSULTANCIES_BYID_SUCCESS:
            return {
                ...state,
                editConsultancyById: { success: true, ...action.response }
            }
        case actionTypes.EDIT_CONSULTANCIES_BYID_FAILURE:
            return {
                ...state,
                editConsultancyById: { success: false, ...action.error }
            }

            case actionTypes.DELETE_CONSULTANCIES_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_CONSULTANCIES_BYID_SUCCESS:
            return {
                ...state,
                deleteConsultancyById: { success: true, ...action.response }
            }
        case actionTypes.DELETE_CONSULTANCIES_BYID_FAILURE:
            return {
                ...state,
                deleteConsultancyById: { success: false, ...action.error }
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
        case actionTypes.GET_CONSULTANCY_BY_ID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_CONSULTANCY_BY_ID_SUCCESS:
            return {
                ...state,
                getConsultancyByIdResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_CONSULTANCY_BY_ID_FAILURE:
            return {
                ...state,
                getConsultancyByIdResponse: { success: false, ...action.error }
            }
        case actionTypes.GET_ALL_CONSULTANCY_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ALL_CONSULTANCY_LOG_SUCCESS: 
            return {
                ...state,
                getAllConsultancyLogResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_ALL_CONSULTANCY_LOG_FAILURE:
            return {
                ...state,
                getAllConsultancyLogResponse: { success: false, ...action.error }
            }
        case actionTypes.RESTORE_CONSULTANCY_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.RESTORE_CONSULTANCY_LOG_SUCCESS: 
            return {
                ...state,
                restoreConsultancyLogResponse: { success: true, ...action.response }
            }
        case actionTypes.RESTORE_CONSULTANCY_LOG_FAILURE:
            return {
                ...state,
                restoreConsultancyLogResponse: { success: false, ...action.error }
            }
        case actionTypes.DELETE_CONSULTANCY_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_CONSULTANCY_LOG_SUCCESS: 
            return {
                ...state,
                deleteConsultancyLogResponse: { success: true, ...action.response }
            }
        case actionTypes.DELETE_CONSULTANCY_LOG_FAILURE:
            return {
                ...state,
                deleteConsultancyLogResponse: { success: false, ...action.error }
            }
        case actionTypes.UPDATE_CONSULTANCY_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_CONSULTANCY_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };

        default:
            return state;
    }
}