import * as actionTypes from "./constants";

const initialState = {
    procedureData: {},
    addprocedureData: {},
    getprocedureById: {},
    editprocedureById: {},
    deleteprocedureById: {},
    getListForCommonFilterResponse: {},
    getprocedureByIdResponse: {},
    getAllprocedureLogResponse: {},
    restoreprocedureLogResponse: {},
    deleteprocedureLogResponse: {},
    uploadDocumentsResponse: {},
    getProcedureDocumentsResponse: {},
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
        case actionTypes.GET_PROCEDURE_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_PROCEDURE_SUCCESS:
            // let tempArray =
            //     action.response.procedure && action.response.procedure.length ? action.response.procedure.map(temp => { return JSON.parse(temp) }) : []
            return {
                ...state,
                // procedureData: { success: true, procedure: tempArray, count: action.response.count }
                procedureData: { success: true, ...action.response }
            };
        case actionTypes.GET_PROCEDURE_FAILURE:
            return {
                ...state,
                procedureData: { success: false, ...action.error }
            };

        case actionTypes.ADD_PROCEDURE_REQUEST:
            return {
                ...state
            };
        case actionTypes.ADD_PROCEDURE_SUCCESS:
            return {
                ...state,
                addprocedureData: { success: true, ...action.response }
            };
        case actionTypes.ADD_PROCEDURE_FAILURE:
            return {
                ...state,
                addprocedureData: { success: false, ...action.error }
            };

        case actionTypes.GET_PROCEDURE_BYID_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_PROCEDURE_BYID_SUCCESS:
            return {
                ...state,
                getprocedureById: { success: true, ...action.response }
            };
        case actionTypes.GET_PROCEDURE_BYID_FAILURE:
            return {
                ...state,
                getprocedureById: { success: false, ...action.error }
            };

        case actionTypes.EDIT_PROCEDURE_BYID_REQUEST:
            return {
                ...state
            };
        case actionTypes.EDIT_PROCEDURE_BYID_SUCCESS:
            return {
                ...state,
                editprocedureById: { success: true, ...action.response }
            };
        case actionTypes.EDIT_PROCEDURE_BYID_FAILURE:
            return {
                ...state,
                editprocedureById: { success: false, ...action.error }
            };

        case actionTypes.DELETE_PROCEDURE_BYID_REQUEST:
            return {
                ...state
            };
        case actionTypes.DELETE_PROCEDURE_BYID_SUCCESS:
            return {
                ...state,
                deleteprocedureById: { success: true, ...action.response }
            };
        case actionTypes.DELETE_PROCEDURE_BYID_FAILURE:
            return {
                ...state,
                deleteprocedureById: { success: false, ...action.error }
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
        case actionTypes.GET_PROCEDURE_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_PROCEDURE_BY_ID_SUCCESS:
            return {
                ...state,
                getprocedureByIdResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_PROCEDURE_BY_ID_FAILURE:
            return {
                ...state,
                getprocedureByIdResponse: { success: false, ...action.error }
            };
        case actionTypes.GET_ALL_PROCEDURE_LOG_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ALL_PROCEDURE_LOG_SUCCESS:
            return {
                ...state,
                getAllprocedureLogResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ALL_PROCEDURE_LOG_FAILURE:
            return {
                ...state,
                getAllprocedureLogResponse: { success: false, ...action.error }
            };
        case actionTypes.RESTORE_PROCEDURE_LOG_REQUEST:
            return {
                ...state
            };
        case actionTypes.RESTORE_PROCEDURE_LOG_SUCCESS:
            return {
                ...state,
                restoreprocedureLogResponse: { success: true, ...action.response }
            };
        case actionTypes.RESTORE_PROCEDURE_LOG_FAILURE:
            return {
                ...state,
                restoreprocedureLogResponse: { success: false, ...action.error }
            };
        case actionTypes.DELETE_PROCEDURE_LOG_REQUEST:
            return {
                ...state
            };
        case actionTypes.DELETE_PROCEDURE_LOG_SUCCESS:
            return {
                ...state,
                deleteprocedureLogResponse: { success: true, ...action.response }
            };
        case actionTypes.DELETE_PROCEDURE_LOG_FAILURE:
            return {
                ...state,
                deleteprocedureLogResponse: { success: false, ...action.error }
            };
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
        case actionTypes.UPLOAD_DOCUMENTS_IN_PROCEDURE_REQUEST:
            return {
                ...state
            };
        case actionTypes.UPLOAD_DOCUMENTS_IN_PROCEDURE_SUCCESS:
            return {
                ...state,
                uploadDocumentsResponse: { success: true, ...action.response }
            };
        case actionTypes.UPLOAD_DOCUMENTS_IN_PROCEDURE_FAILURE:
            return {
                ...state,
                uploadDocumentsResponse: { success: false, ...action.error }
            };
        case actionTypes.GET_PROCEDURE_DOCUMENTS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_PROCEDURE_DOCUMENTS_SUCCESS:
            return {
                ...state,
                getProcedureDocumentsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_PROCEDURE_DOCUMENTS_FAILURE:
            return {
                ...state,
                getProcedureDocumentsResponse: { success: false, ...action.error }
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
