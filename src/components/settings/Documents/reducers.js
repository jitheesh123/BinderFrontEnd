import * as actionTypes from './constants' 

const initialState = {
    documentData: {},
    // addUsersData: {},
    getDocumentById: {},
    // editUsersById: {},
    // deleteUsersById:{},
    getListForCommonFilterResponse:{},
    // getUsersByIdResponse:{},
    // getAllUsersLogResponse:{},
    // restoreUsersLogResponse:{},
    // deleteUsersLogResponse:{},
    // existingEmailResponse:{},
    // userPermissionDropdownResponse:{permissions:[]},
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
        case actionTypes.GET_ALL_DOCUMENT_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ALL_DOCUMENT_SUCCESS:
            // let tempArray =
            //     action.response.Users && action.response.Users.length ? action.response.Users.map(temp => { return JSON.parse(temp) }) : []
            return {
                ...state,
                // UsersData: { success: true, Users: tempArray, count: action.response.count }
                documentData: { success: true, ...action.response }
            }
        case actionTypes.GET_ALL_DOCUMENT_FAILURE:
            return {
                ...state,
                documentData: { success: false, ...action.error }
            }

        // case actionTypes.ADD_USERS_REQUEST:
        //     return {
        //         ...state
        //     }
        // case actionTypes.ADD_USERS_SUCCESS:
        //     return {
        //         ...state,
        //         addUsersData: { success: true, ...action.response }
        //     }
        // case actionTypes.ADD_USERS_FAILURE:
        //     return {
        //         ...state,
        //         addUsersData: { success: false, ...action.error }
        //     }

        case actionTypes.GET_DOCUMENTS_BY_ID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_DOCUMENTS_BY_ID_SUCCESS:

            return {

                ...state,
                getDocumentById: { success: true, ...action.response }
            }
        case actionTypes.GET_DOCUMENTS_BY_ID_FAILURE:
            return {
                ...state,
                getDocumentById: { success: false, ...action.error }
            }

        // case actionTypes.EDIT_USERS_BYID_REQUEST:
        //     return {
        //         ...state
        //     }
        // case actionTypes.EDIT_USERS_BYID_SUCCESS:
        //     return {
        //         ...state,
        //         editUsersById: { success: true, ...action.response }
        //     }
        // case actionTypes.EDIT_USERS_BYID_FAILURE:
        //     return {
        //         ...state,
        //         editUsersById: { success: false, ...action.error }
        //     }

        //     case actionTypes.DELETE_USERS_BYID_REQUEST:
        //     return {
        //         ...state
        //     }
        // case actionTypes.DELETE_USERS_BYID_SUCCESS:
        //     return {
        //         ...state,
        //         deleteUsersById: { success: true, ...action.response }
        //     }
        // case actionTypes.DELETE_USERS_BYID_FAILURE:
        //     return {
        //         ...state,
        //         deleteUsersById: { success: false, ...action.error }
        //     }
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
        // case actionTypes.GET_USERS_BY_ID_REQUEST:
        //     return {
        //         ...state
        //     }
        // case actionTypes.GET_USERS_BY_ID_SUCCESS:
        //     return {
        //         ...state,
        //         getUsersByIdResponse: { success: true, ...action.response }
        //     }
        // case actionTypes.GET_USERS_BY_ID_FAILURE:
        //     return {
        //         ...state,
        //         getUsersByIdResponse: { success: false, ...action.error }
        //     }
        // case actionTypes.GET_ALL_USERS_LOG_REQUEST:
        //     return {
        //         ...state
        //     }
        // case actionTypes.GET_ALL_USERS_LOG_SUCCESS: 
        //     return {
        //         ...state,
        //         getAllUsersLogResponse: { success: true, ...action.response }
        //     }
        // case actionTypes.GET_ALL_USERS_LOG_FAILURE:
        //     return {
        //         ...state,
        //         getAllUsersLogResponse: { success: false, ...action.error }
        //     }
        // case actionTypes.RESTORE_USERS_LOG_REQUEST:
        //     return {
        //         ...state
        //     }
        // case actionTypes.RESTORE_USERS_LOG_SUCCESS: 
        //     return {
        //         ...state,
        //         restoreUsersLogResponse: { success: true, ...action.response }
        //     }
        // case actionTypes.RESTORE_USERS_LOG_FAILURE:
        //     return {
        //         ...state,
        //         restoreUsersLogResponse: { success: false, ...action.error }
        //     }
        // case actionTypes.DELETE_USERS_LOG_REQUEST:
        //     return {
        //         ...state
        //     }
        // case actionTypes.DELETE_USERS_LOG_SUCCESS: 
        //     return {
        //         ...state,
        //         deleteUsersLogResponse: { success: true, ...action.response }
        //     }
        // case actionTypes.DELETE_USERS_LOG_FAILURE:
        //     return {
        //         ...state,
        //         deleteUsersLogResponse: { success: false, ...action.error }
        //     }
        case actionTypes.UPDATE_DOCUMENT_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_DOCUMENT_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };
        // case actionTypes.GET_EXISTING_USERS_REQUEST:
        //     return {
        //         ...state
        //     }
        // case actionTypes.GET_EXISTING_USERS_SUCCESS:

        //     return {
        //         ...state,
        //         existingEmailResponse: { success: true, ...action.response }
        //     }
        // case actionTypes.GET_EXISTING_USERS_FAILURE:
        //     return {
        //         ...state,
        //         existingEmailResponse: { success: false, ...action.error }
        //     }
        // case actionTypes.GET_USER_PERMISSION_DROPDOWN_DATA_REQUEST:
        //     return {
        //         ...state
        //     }
        // case actionTypes.GET_USER_PERMISSION_DROPDOWN_DATA_SUCCESS:

        //     return {
        //         ...state,
        //         userPermissionDropdownResponse: { permissions:[ ...action.response] }
        //     }
        // case actionTypes.GET_USER_PERMISSION_DROPDOWN_DATA_FAILURE:
        //     return {
        //         ...state,
        //         userPermissionDropdownResponse: { userPermissionDropdownResponse: { permissions:[] } }
        //     }

        default:
            return state;
    }
}