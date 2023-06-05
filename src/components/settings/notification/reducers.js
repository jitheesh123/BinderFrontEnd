/* eslint-disable import/no-anonymous-default-export */
import * as actionTypes from './constants' 

const initialState = {
    notificationData: {},
    addNotificationData: {},
    getNotificationById: {},
    editNotificationById: {},
    deleteNotificationById:{},
    getListForCommonFilterResponse:{},
    getNotificationByIdResponse:{},
    getAllNotificationLogResponse:{},
    restoreNotificationLogResponse:{},
    deleteNotificationLogResponse:{},
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
        case actionTypes.GET_NOTIFICATION_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_NOTIFICATION_SUCCESS:
            return {
                ...state,
                notificationData: { success: true, ...action.response }
            }
        case actionTypes.GET_NOTIFICATION_FAILURE:
            return {
                ...state,
                notificationData: { success: false, ...action.error }
            }

        case actionTypes.ADD_NOTIFICATION_REQUEST:
            return {
                ...state
            }
        case actionTypes.ADD_NOTIFICATION_SUCCESS:
            return {
                ...state,
                addNotificationData: { success: true, ...action.response }
            }
        case actionTypes.ADD_NOTIFICATION_FAILURE:
            return {
                ...state,
                addNotificationData: { success: false, ...action.error }
            }

        case actionTypes.GET_NOTIFICATION_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_NOTIFICATION_BYID_SUCCESS:

            return {

                ...state,
                getNotificationById: { success: true, ...action.response }
            }
        case actionTypes.GET_NOTIFICATION_BYID_FAILURE:
            return {
                ...state,
                getNotificationById: { success: false, ...action.error }
            }

        case actionTypes.EDIT_NOTIFICATION_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.EDIT_NOTIFICATION_BYID_SUCCESS:
            return {
                ...state,
                editNotificationById: { success: true, ...action.response }
            }
        case actionTypes.EDIT_NOTIFICATION_BYID_FAILURE:
            return {
                ...state,
                editNotificationById: { success: false, ...action.error }
            }

            case actionTypes.DELETE_NOTIFICATION_BYID_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_NOTIFICATION_BYID_SUCCESS:
            return {
                ...state,
                deleteNotificationById: { success: true, ...action.response }
            }
        case actionTypes.DELETE_NOTIFICATION_BYID_FAILURE:
            return {
                ...state,
                deleteNotificationById: { success: false, ...action.error }
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
        case actionTypes.GET_NOTIFICATION_BY_ID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_NOTIFICATION_BY_ID_SUCCESS:
            return {
                ...state,
                getNotificationByIdResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_NOTIFICATION_BY_ID_FAILURE:
            return {
                ...state,
                getNotificationByIdResponse: { success: false, ...action.error }
            }
        case actionTypes.GET_ALL_NOTIFICATION_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_ALL_NOTIFICATION_LOG_SUCCESS: 
            return {
                ...state,
                getAllNotificationLogResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_ALL_NOTIFICATION_LOG_FAILURE:
            return {
                ...state,
                getAllNotificationLogResponse: { success: false, ...action.error }
            }
        case actionTypes.RESTORE_NOTIFICATION_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.RESTORE_NOTIFICATION_LOG_SUCCESS: 
            return {
                ...state,
                restoreNotificationLogResponse: { success: true, ...action.response }
            }
        case actionTypes.RESTORE_NOTIFICATION_LOG_FAILURE:
            return {
                ...state,
                restoreNotificationLogResponse: { success: false, ...action.error }
            }
        case actionTypes.DELETE_NOTIFICATION_LOG_REQUEST:
            return {
                ...state
            }
        case actionTypes.DELETE_NOTIFICATION_LOG_SUCCESS: 
            return {
                ...state,
                deleteNotificationLogResponse: { success: true, ...action.response }
            }
        case actionTypes.DELETE_NOTIFICATION_LOG_FAILURE:
            return {
                ...state,
                deleteNotificationLogResponse: { success: false, ...action.error }
            }
        case actionTypes.UPDATE_NOTIFICATION_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_NOTIFICATION_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };

        default:
            return state;
    }
}