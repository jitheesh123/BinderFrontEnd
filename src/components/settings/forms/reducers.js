import * as actionTypes from "./constants";

const initialState = {
    formData: {},
    addformData: {},
    getformById: {},
    editformById: {},
    deleteformById: {},
    getListForCommonFilterResponse: {},
    getformByIdResponse: {},
    getAllformLogResponse: {},
    restoreformLogResponse: {},
    deleteformLogResponse: {},
    uploadRecordsResponse: {},
    getformRecordsResponse: {},
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
        case actionTypes.GET_FORM_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_FORM_SUCCESS:
            return {
                ...state,
                formData: { success: true, ...action.response }
            };
        case actionTypes.GET_FORM_FAILURE:
            return {
                ...state,
                formData: { success: false, ...action.error }
            };

        case actionTypes.ADD_FORM_REQUEST:
            return {
                ...state
            };
        case actionTypes.ADD_FORM_SUCCESS:
            return {
                ...state,
                addformData: { success: true, ...action.response }
            };
        case actionTypes.ADD_FORM_FAILURE:
            return {
                ...state,
                addformData: { success: false, ...action.error }
            };

        case actionTypes.GET_FORM_BYID_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_FORM_BYID_SUCCESS:
            return {
                ...state,
                getformById: { success: true, ...action.response }
            };
        case actionTypes.GET_FORM_BYID_FAILURE:
            return {
                ...state,
                getformById: { success: false, ...action.error }
            };

        case actionTypes.EDIT_FORM_BYID_REQUEST:
            return {
                ...state
            };
        case actionTypes.EDIT_FORM_BYID_SUCCESS:
            return {
                ...state,
                editformById: { success: true, ...action.response }
            };
        case actionTypes.EDIT_FORM_BYID_FAILURE:
            return {
                ...state,
                editformById: { success: false, ...action.error }
            };

        case actionTypes.DELETE_FORM_BYID_REQUEST:
            return {
                ...state
            };
        case actionTypes.DELETE_FORM_BYID_SUCCESS:
            return {
                ...state,
                deleteformById: { success: true, ...action.response }
            };
        case actionTypes.DELETE_FORM_BYID_FAILURE:
            return {
                ...state,
                deleteformById: { success: false, ...action.error }
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
                getformByIdResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_FORM_BY_ID_FAILURE:
            return {
                ...state,
                getformByIdResponse: { success: false, ...action.error }
            };
        case actionTypes.GET_ALL_FORM_LOG_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ALL_FORM_LOG_SUCCESS:
            return {
                ...state,
                getAllformLogResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ALL_FORM_LOG_FAILURE:
            return {
                ...state,
                getAllformLogResponse: { success: false, ...action.error }
            };
        case actionTypes.RESTORE_FORM_LOG_REQUEST:
            return {
                ...state
            };
        case actionTypes.RESTORE_FORM_LOG_SUCCESS:
            return {
                ...state,
                restoreformLogResponse: { success: true, ...action.response }
            };
        case actionTypes.RESTORE_FORM_LOG_FAILURE:
            return {
                ...state,
                restoreformLogResponse: { success: false, ...action.error }
            };
        case actionTypes.DELETE_FORM_LOG_REQUEST:
            return {
                ...state
            };
        case actionTypes.DELETE_FORM_LOG_SUCCESS:
            return {
                ...state,
                deleteformLogResponse: { success: true, ...action.response }
            };
        case actionTypes.DELETE_FORM_LOG_FAILURE:
            return {
                ...state,
                deleteformLogResponse: { success: false, ...action.error }
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
