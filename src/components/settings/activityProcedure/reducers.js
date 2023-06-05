import * as actionTypes from './constants' 

const initialState = {
    procedureData: {},
    addProcedureData: {},
    getProcedureByIdResponse: {},
    editProcedureById: {},
    deleteProcedureById:{},
    getListForCommonFilterResponse:{},
    getProcedureByIdResponse:{},
    getAllProcedureLogResponse:{},
    restoreProcedureLogResponse:{},
    deleteProcedureLogResponse:{},
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
        case actionTypes.GET_ACTIVITY_PROCEDURE_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ACTIVITY_PROCEDURE_SUCCESS:
            // let tempArray =
            //     action.response.consultancies && action.response.consultancies.length ? action.response.consultancies.map(temp => { return JSON.parse(temp) }) : []
            return {
                ...state,
                // procedureData: { success: true, consultancies: tempArray, count: action.response.count }
                procedureData: { success: true, ...action.response }
            }
        case actionTypes.GET_ACTIVITY_PROCEDURE_FAILURE:
            return {
                ...state,
                procedureData: { success: false, ...action.error }
            }

        case actionTypes.ADD_ACTIVITY_PROCEDURE_REQUEST:
            return {
                ...state
            }
        case actionTypes.ADD_ACTIVITY_PROCEDURE_SUCCESS:
            return {
                ...state,
                addProcedureData: { success: true, ...action.response }
            }
        case actionTypes.ADD_ACTIVITY_PROCEDURE_FAILURE:
            return {
                ...state,
                addProcedureData: { success: false, ...action.error }
            }

        case actionTypes.GET_ACTIVITY_PROCEDURE_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ACTIVITY_PROCEDURE_BYID_SUCCESS:

            return {

                ...state,
                getProcedureByIdResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_ACTIVITY_PROCEDURE_BYID_FAILURE:
            return {
                ...state,
                getProcedureByIdResponse: { success: false, ...action.error }
            }

        case actionTypes.EDIT_ACTIVITY_PROCEDURE_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.EDIT_ACTIVITY_PROCEDURE_BYID_SUCCESS:
            return {
                ...state,
                editProcedureById: { success: true, ...action.response }
            }
        case actionTypes.EDIT_ACTIVITY_PROCEDURE_BYID_FAILURE:
            return {
                ...state,
                editProcedureById: { success: false, ...action.error }
            }

            case actionTypes.DELETE_ACTIVITY_PROCEDURE_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_ACTIVITY_PROCEDURE_BYID_SUCCESS:
            return {
                ...state,
                deleteProcedureById: { success: true, ...action.response }
            }
        case actionTypes.DELETE_ACTIVITY_PROCEDURE_BYID_FAILURE:
            return {
                ...state,
                deleteProcedureById: { success: false, ...action.error }
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
        case actionTypes.GET_PROCEDURE_BY_ID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_PROCEDURE_BY_ID_SUCCESS:
            return {
                ...state,
                getProcedureByIdResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_PROCEDURE_BY_ID_FAILURE:
            return {
                ...state,
                getProcedureByIdResponse: { success: false, ...action.error }
            }
        case actionTypes.GET_ALL_PROCEDURE_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ALL_PROCEDURE_LOG_SUCCESS: 
            return {
                ...state,
                getAllProcedureLogResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_ALL_PROCEDURE_LOG_FAILURE:
            return {
                ...state,
                getAllProcedureLogResponse: { success: false, ...action.error }
            }
        case actionTypes.RESTORE_PROCEDURE_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.RESTORE_PROCEDURE_LOG_SUCCESS: 
            return {
                ...state,
                restoreProcedureLogResponse: { success: true, ...action.response }
            }
        case actionTypes.RESTORE_PROCEDURE_LOG_FAILURE:
            return {
                ...state,
                restoreProcedureLogResponse: { success: false, ...action.error }
            }
        case actionTypes.DELETE_PROCEDURE_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_PROCEDURE_LOG_SUCCESS: 
            return {
                ...state,
                deleteProcedureLogResponse: { success: true, ...action.response }
            }
        case actionTypes.DELETE_PROCEDURE_LOG_FAILURE:
            return {
                ...state,
                deleteProcedureLogResponse: { success: false, ...action.error }
            }
        case actionTypes.UPDATE_PROCEDURE_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_PROCEDURE_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };

        default:
            return state;
    }
}