import * as actionTypes from './constants' 

const initialState = {
    usersData: {},
    addUsersData: {},
    getUsersById: {},
    editUsersById: {},
    deleteUsersById:{},
    getListForCommonFilterResponse:{},
    getUsersByIdResponse:{},
    getAllUsersLogResponse:{},
    restoreUsersLogResponse:{},
    deleteUsersLogResponse:{},
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
        case actionTypes.GET_BUILDING_USERS_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_BUILDING_USERS_SUCCESS:
            // let tempArray =
            //     action.response.Users && action.response.Users.length ? action.response.Users.map(temp => { return JSON.parse(temp) }) : []
            return {
                ...state,
                // UsersData: { success: true, Users: tempArray, count: action.response.count }
                usersData: { success: true, ...action.response }
            }
        case actionTypes.GET_BUILDING_USERS_FAILURE:
            return {
                ...state,
                usersData: { success: false, ...action.error }
            }

        case actionTypes.ADD_BUILDING_USERS_REQUEST:
            return {
                ...state
            }
        case actionTypes.ADD_BUILDING_USERS_SUCCESS:
            return {
                ...state,
                addUsersData: { success: true, ...action.response }
            }
        case actionTypes.ADD_BUILDING_USERS_FAILURE:
            return {
                ...state,
                addUsersData: { success: false, ...action.error }
            }

        case actionTypes.GET_BUILDING_USERS_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_BUILDING_USERS_BYID_SUCCESS:

            return {

                ...state,
                getUsersById: { success: true, ...action.response }
            }
        case actionTypes.GET_BUILDING_USERS_BYID_FAILURE:
            return {
                ...state,
                getUsersById: { success: false, ...action.error }
            }

        case actionTypes.EDIT_BUILDING_USERS_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.EDIT_BUILDING_USERS_BYID_SUCCESS:
            return {
                ...state,
                editUsersById: { success: true, ...action.response }
            }
        case actionTypes.EDIT_BUILDING_USERS_BYID_FAILURE:
            return {
                ...state,
                editUsersById: { success: false, ...action.error }
            }

            case actionTypes.DELETE_BUILDING_USERS_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_BUILDING_USERS_BYID_SUCCESS:
            return {
                ...state,
                deleteUsersById: { success: true, ...action.response }
            }
        case actionTypes.DELETE_BUILDING_USERS_BYID_FAILURE:
            return {
                ...state,
                deleteUsersById: { success: false, ...action.error }
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
        case actionTypes.GET_BUILDING_USERS_BY_ID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_BUILDING_USERS_BY_ID_SUCCESS:
            return {
                ...state,
                getUsersByIdResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_BUILDING_USERS_BY_ID_FAILURE:
            return {
                ...state,
                getUsersByIdResponse: { success: false, ...action.error }
            }
        case actionTypes.GET_ALL_BUILDING_USERS_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ALL_BUILDING_USERS_LOG_SUCCESS: 
            return {
                ...state,
                getAllUsersLogResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_ALL_BUILDING_USERS_LOG_FAILURE:
            return {
                ...state,
                getAllUsersLogResponse: { success: false, ...action.error }
            }
        case actionTypes.RESTORE_BUILDING_USERS_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.RESTORE_BUILDING_USERS_LOG_SUCCESS: 
            return {
                ...state,
                restoreUsersLogResponse: { success: true, ...action.response }
            }
        case actionTypes.RESTORE_BUILDING_USERS_LOG_FAILURE:
            return {
                ...state,
                restoreUsersLogResponse: { success: false, ...action.error }
            }
        case actionTypes.DELETE_BUILDING_USERS_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_BUILDING_USERS_LOG_SUCCESS: 
            return {
                ...state,
                deleteUsersLogResponse: { success: true, ...action.response }
            }
        case actionTypes.DELETE_BUILDING_USERS_LOG_FAILURE:
            return {
                ...state,
                deleteUsersLogResponse: { success: false, ...action.error }
            }
        case actionTypes.UPDATE_BUILDING_USERS_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_BUILDING_USERS_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };

        default:
            return state;
    }
}