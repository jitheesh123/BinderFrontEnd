/* eslint-disable import/no-anonymous-default-export */
import * as actionTypes from "./constants";

const initialState = {
    formData: {},
    addFormData: {},
    getFormByIdResponse: {},
    editFormById: {},
    deleteFormById: {},
    getListForCommonFilterResponse: {},
    getAllFormLogResponse: {},
    restoreFormLogResponse: {},
    deleteFormLogResponse: {},
    getformRecordsResponse: {},
    uploadRecordsResponse: {},
    removeAttachmentResponse: {},
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

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ACTIVITY_FORM_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ACTIVITY_FORM_SUCCESS:
            // let tempArray =
            //     action.response.consultancies && action.response.consultancies.length ? action.response.consultancies.map(temp => { return JSON.parse(temp) }) : []
            return {
                ...state,
                // FormData: { success: true, consultancies: tempArray, count: action.response.count }
                formData: { success: true, ...action.response }
            };
        case actionTypes.GET_ACTIVITY_FORM_FAILURE:
            return {
                ...state,
                formData: { success: false, ...action.error }
            };

        case actionTypes.ADD_ACTIVITY_FORM_REQUEST:
            return {
                ...state
            };
        case actionTypes.ADD_ACTIVITY_FORM_SUCCESS:
            return {
                ...state,
                addFormData: { success: true, ...action.response }
            };
        case actionTypes.ADD_ACTIVITY_FORM_FAILURE:
            return {
                ...state,
                addFormData: { success: false, ...action.error }
            };

        case actionTypes.GET_ACTIVITY_FORM_BYID_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ACTIVITY_FORM_BYID_SUCCESS:
            return {
                ...state,
                getFormByIdResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ACTIVITY_FORM_BYID_FAILURE:
            return {
                ...state,
                getFormByIdResponse: { success: false, ...action.error }
            };

        case actionTypes.EDIT_ACTIVITY_FORM_BYID_REQUEST:
            return {
                ...state
            };
        case actionTypes.EDIT_ACTIVITY_FORM_BYID_SUCCESS:
            return {
                ...state,
                editFormById: { success: true, ...action.response }
            };
        case actionTypes.EDIT_ACTIVITY_FORM_BYID_FAILURE:
            return {
                ...state,
                editFormById: { success: false, ...action.error }
            };

        case actionTypes.DELETE_ACTIVITY_FORM_BYID_REQUEST:
            return {
                ...state
            };
        case actionTypes.DELETE_ACTIVITY_FORM_BYID_SUCCESS:
            return {
                ...state,
                deleteFormById: { success: true, ...action.response }
            };
        case actionTypes.DELETE_ACTIVITY_FORM_BYID_FAILURE:
            return {
                ...state,
                deleteFormById: { success: false, ...action.error }
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
        case actionTypes.GET_FORM_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_FORM_BY_ID_SUCCESS:
            return {
                ...state,
                getFormByIdResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_FORM_BY_ID_FAILURE:
            return {
                ...state,
                getFormByIdResponse: { success: false, ...action.error }
            };
        case actionTypes.GET_ALL_FORM_LOG_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ALL_FORM_LOG_SUCCESS:
            return {
                ...state,
                getAllFormLogResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ALL_FORM_LOG_FAILURE:
            return {
                ...state,
                getAllFormLogResponse: { success: false, ...action.error }
            };
        case actionTypes.RESTORE_FORM_LOG_REQUEST:
            return {
                ...state
            };
        case actionTypes.RESTORE_FORM_LOG_SUCCESS:
            return {
                ...state,
                restoreFormLogResponse: { success: true, ...action.response }
            };
        case actionTypes.RESTORE_FORM_LOG_FAILURE:
            return {
                ...state,
                restoreFormLogResponse: { success: false, ...action.error }
            };
        case actionTypes.DELETE_FORM_LOG_REQUEST:
            return {
                ...state
            };
        case actionTypes.DELETE_FORM_LOG_SUCCESS:
            return {
                ...state,
                deleteFormLogResponse: { success: true, ...action.response }
            };
        case actionTypes.DELETE_FORM_LOG_FAILURE:
            return {
                ...state,
                deleteFormLogResponse: { success: false, ...action.error }
            };
        case actionTypes.UPDATE_FORM_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_FORM_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };

        case actionTypes.GET_FORM_RECORD_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_FORM_RECORD_SUCCESS:
            return {
                ...state,
                getFormRecordsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_FORM_RECORD_FAILURE:
            return {
                ...state,
                getFormRecordsResponse: { success: false, ...action.error }
            };

        case actionTypes.UPLOAD_RECORD_IN_FORM_REQUEST:
            return {
                ...state
            };
        case actionTypes.UPLOAD_RECORD_IN_FORM_SUCCESS:
            return {
                ...state,
                uploadRecordsResponse: { success: true, ...action.response }
            };
        case actionTypes.UPLOAD_RECORD_IN_FORM_FAILURE:
            return {
                ...state,
                uploadRecordsResponse: { success: false, ...action.error }
            };
        case actionTypes.REMOVE_ATTACHMENT_REQUEST:
            return {
                ...state
            };
        case actionTypes.REMOVE_ATTACHMENT_SUCCESS:
            return {
                ...state,
                removeAttachmentResponse: { success: true, ...action.response }
            };
        case actionTypes.REMOVE_ATTACHMENT_FAILURE:
            return {
                ...state,
                removeAttachmentResponse: { success: false, ...action.error }
            };

        default:
            return state;
    }
};
