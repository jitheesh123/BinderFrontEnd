import * as actionTypes from './constants' 

const initialState = {
    userPermissionsData: {},
    addUserPermissionsData: {},
    getUserPermissionsById: {},
    editUserPermissionsById: {},
    getTemplatesById: {},
    deleteUserPermissionsById:{},
    getListForCommonFilterResponse:{},
    getUserPermissionsByIdResponse:{},
    getAllUserPermissionsLogResponse:{},
    restoreUserPermissionsLogResponse:{},
    deleteUserPermissionsLogResponse:{},
    getUserListForPermissionsResponse:{},
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
        case actionTypes.GET_USER_PERMISSIONS_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_USER_PERMISSIONS_SUCCESS:
            // let tempArray =
            //     action.response.UserPermissions && action.response.UserPermissions.length ? action.response.UserPermissions.map(temp => { return JSON.parse(temp) }) : []
            return {
                ...state,
                // UserPermissionsData: { success: true, UserPermissions: tempArray, count: action.response.count }
                userPermissionsData: { success: true, ...action.response }
            }
        case actionTypes.GET_USER_PERMISSIONS_FAILURE:
            return {
                ...state,
                userPermissionsData: { success: false, ...action.error }
            }

        case actionTypes.ADD_USER_PERMISSIONS_REQUEST:
            return {
                ...state
            }
        case actionTypes.ADD_USER_PERMISSIONS_SUCCESS:
            return {
                ...state,
                addUserPermissionsData: { success: true, ...action.response }
            }
        case actionTypes.ADD_USER_PERMISSIONS_FAILURE:
            return {
                ...state,
                addUserPermissionsData: { success: false, ...action.error }
            }

        case actionTypes.GET_USER_PERMISSIONS_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_USER_PERMISSIONS_BYID_SUCCESS:

            return {

                ...state,
                getUserPermissionsById: { success: true, ...action.response }
            }
        case actionTypes.GET_USER_PERMISSIONS_BYID_FAILURE:
            return {
                ...state,
                getUserPermissionsById: { success: false, ...action.error }
            }

        case actionTypes.EDIT_USER_PERMISSIONS_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.EDIT_USER_PERMISSIONS_BYID_SUCCESS:
            return {
                ...state,
                editUserPermissionsById: { success: true, ...action.response }
            }
        case actionTypes.EDIT_USER_PERMISSIONS_BYID_FAILURE:
            return {
                ...state,
                editUserPermissionsById: { success: false, ...action.error }
            }

            case actionTypes.DELETE_USER_PERMISSIONS_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_USER_PERMISSIONS_BYID_SUCCESS:
            return {
                ...state,
                deleteUserPermissionsById: { success: true, ...action.response }
            }
        case actionTypes.DELETE_USER_PERMISSIONS_BYID_FAILURE:
            return {
                ...state,
                deleteUserPermissionsById: { success: false, ...action.error }
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

        case actionTypes.GET_USER_PERMISSIONS_BY_ID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_USER_PERMISSIONS_BY_ID_SUCCESS:
            return {
                ...state,
                getUserPermissionsByIdResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_USER_PERMISSIONS_BY_ID_FAILURE:
            return {
                ...state,
                getUserPermissionsByIdResponse: { success: false, ...action.error }
            }

        case actionTypes.GET_USER_LIST_FOR_PERMISSIONS_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_USER_LIST_FOR_PERMISSIONS_SUCCESS:
            return {
                ...state,
                getUserListForPermissionsResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_USER_LIST_FOR_PERMISSIONS_FAILURE:
            return {
                ...state,
                getUserListForPermissionsResponse: { success: false, ...action.error }
            }

        case actionTypes.GET_ALL_USER_PERMISSIONS_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ALL_USER_PERMISSIONS_LOG_SUCCESS: 
            return {
                ...state,
                getAllUserPermissionsLogResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_ALL_USER_PERMISSIONS_LOG_FAILURE:
            return {
                ...state,
                getAllUserPermissionsLogResponse: { success: false, ...action.error }
            }
        case actionTypes.RESTORE_USER_PERMISSIONS_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.RESTORE_USER_PERMISSIONS_LOG_SUCCESS: 
            return {
                ...state,
                restoreUserPermissionsLogResponse: { success: true, ...action.response }
            }
        case actionTypes.RESTORE_USER_PERMISSIONS_LOG_FAILURE:
            return {
                ...state,
                restoreUserPermissionsLogResponse: { success: false, ...action.error }
            }
        case actionTypes.DELETE_USER_PERMISSIONS_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_USER_PERMISSIONS_LOG_SUCCESS: 
            return {
                ...state,
                deleteUserPermissionsLogResponse: { success: true, ...action.response }
            }
        case actionTypes.DELETE_USER_PERMISSIONS_LOG_FAILURE:
            return {
                ...state,
                deleteUserPermissionsLogResponse: { success: false, ...action.error }
            }
        case actionTypes.UPDATE_USER_PERMISSIONS_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_USER_PERMISSIONS_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };

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

        default:
            return state;
    }
}