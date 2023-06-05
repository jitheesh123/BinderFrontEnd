import * as actionTypes from './constants' 

const initialState = {
    templatesData: {},
    addTemplatesData: {},
    getTemplatesById: {},
    editTemplatesById: {},
    deleteTemplatesById:{},
    getListForCommonFilterResponse:{},
    getTemplatesByIdResponse:{},
    getAlltemplatesLogResponse:{},
    restoretemplatesLogResponse:{},
    deletetemplatesLogResponse:{},
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

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {

    switch (action.type) {
        case actionTypes.GET_TEMPLATES_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_TEMPLATES_SUCCESS:
            // let tempArray =
            //     action.response.templates && action.response.templates.length ? action.response.templates.map(temp => { return JSON.parse(temp) }) : []
            return {
                ...state,
                // templatesData: { success: true, templates: tempArray, count: action.response.count }
                templatesData: { success: true, ...action.response }
            }
        case actionTypes.GET_TEMPLATES_FAILURE:
            return {
                ...state,
                templatesData: { success: false, ...action.error }
            }

        case actionTypes.ADD_TEMPLATES_REQUEST:
            return {
                ...state
            }
        case actionTypes.ADD_TEMPLATES_SUCCESS:
            return {
                ...state,
                addTemplatesData: { success: true, ...action.response }
            }
        case actionTypes.ADD_TEMPLATES_FAILURE:
            return {
                ...state,
                addTemplatesData: { success: false, ...action.error }
            }

        case actionTypes.GET_TEMPLATES_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_TEMPLATES_BYID_SUCCESS:
            return {
                ...state,
                getTemplatesById: { success: true, ...action.response }
            }
        case actionTypes.GET_TEMPLATES_BYID_FAILURE:
            return {
                ...state,
                getTemplatesById: { success: false, ...action.error }
            }

        case actionTypes.EDIT_TEMPLATES_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.EDIT_TEMPLATES_BYID_SUCCESS:
            return {
                ...state,
                editTemplatesById: { success: true, ...action.response }
            }
        case actionTypes.EDIT_TEMPLATES_BYID_FAILURE:
            return {
                ...state,
                editTemplatesById: { success: false, ...action.error }
            }

            case actionTypes.DELETE_TEMPLATES_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_TEMPLATES_BYID_SUCCESS:
            return {
                ...state,
                deleteTemplatesById: { success: true, ...action.response }
            }
        case actionTypes.DELETE_TEMPLATES_BYID_FAILURE:
            return {
                ...state,
                deleteTemplatesById: { success: false, ...action.error }
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
        case actionTypes.GET_TEMPLATES_BY_ID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_TEMPLATES_BY_ID_SUCCESS:
            return {
                ...state,
                getTemplatesByIdResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_TEMPLATES_BY_ID_FAILURE:
            return {
                ...state,
                getTemplatesByIdResponse: { success: false, ...action.error }
            }
        case actionTypes.GET_ALL_TEMPLATES_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ALL_TEMPLATES_LOG_SUCCESS: 
            return {
                ...state,
                getAlltemplatesLogResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_ALL_TEMPLATES_LOG_FAILURE:
            return {
                ...state,
                getAlltemplatesLogResponse: { success: false, ...action.error }
            }
        case actionTypes.RESTORE_TEMPLATES_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.RESTORE_TEMPLATES_LOG_SUCCESS: 
            return {
                ...state,
                restoretemplatesLogResponse: { success: true, ...action.response }
            }
        case actionTypes.RESTORE_TEMPLATES_LOG_FAILURE:
            return {
                ...state,
                restoretemplatesLogResponse: { success: false, ...action.error }
            }
        case actionTypes.DELETE_TEMPLATES_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_TEMPLATES_LOG_SUCCESS: 
            return {
                ...state,
                deletetemplatesLogResponse: { success: true, ...action.response }
            }
        case actionTypes.DELETE_TEMPLATES_LOG_FAILURE:
            return {
                ...state,
                deletetemplatesLogResponse: { success: false, ...action.error }
            }
        case actionTypes.UPDATE_TEMPLATES_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_TEMPLATES_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };

        default:
            return state;
    }
}