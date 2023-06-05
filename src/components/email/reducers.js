/* eslint-disable import/no-anonymous-default-export */
import * as actionTypes from "./constants";

const initialState = {
    userEmailList: [],
    sendMailWithAttachmentResponse: {},
    sendEmailResponse: {},
    emailListResponse: {},
    getEmailDetailsResponse: {},
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
        }
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_USER_EMAIL_LIST_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_USER_EMAIL_LIST_SUCCESS:
            return {
                ...state,
                userEmailList: [...action.response]
            };
        case actionTypes.GET_USER_EMAIL_LIST_FAILURE:
            return {
                ...state,
                userEmailList: [...action.error]
            };

        case actionTypes.GET_SENT_MAILS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_SENT_MAILS_SUCCESS:
            return {
                ...state,
                emailListResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_SENT_MAILS_FAILURE:
            return {
                ...state,
                emailListResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_INBOX_MAILS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_INBOX_MAILS_SUCCESS:
            return {
                ...state,
                emailListResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_INBOX_MAILS_FAILURE:
            return {
                ...state,
                emailListResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_ALL_SENT_MAILS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ALL_SENT_MAILS_SUCCESS:
            return {
                ...state,
                emailListResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ALL_SENT_MAILS_FAILURE:
            return {
                ...state,
                emailListResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_EMAIL_DETAILS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_EMAIL_DETAILS_SUCCESS:
            return {
                ...state,
                getEmailDetailsResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_EMAIL_DETAILS_FAILURE:
            return {
                ...state,
                getEmailDetailsResponse: { success: false, ...action.error }
            };

        case actionTypes.SEND_EMAIL_REQUEST:
            return {
                ...state
            };
        case actionTypes.SEND_EMAIL_SUCCESS:
            return {
                ...state,
                sendEmailResponse: { success: true, ...action.response }
            };
        case actionTypes.SEND_EMAIL_FAILURE:
            return {
                ...state,
                sendEmailResponse: { success: false, ...action.error }
            };

        case actionTypes.SEND_MAIL_WITH_ATTACHMENT_REQUEST:
            return {
                ...state
            };
        case actionTypes.SEND_MAIL_WITH_ATTACHMENT_SUCCESS:
            return {
                ...state,
                sendMailWithAttachmentResponse: { success: true, ...action.response }
            };
        case actionTypes.SEND_MAIL_WITH_ATTACHMENT_FAILURE:
            return {
                ...state,
                sendMailWithAttachmentResponse: { success: false, ...action.error }
            };

        default:
            return {
                ...state
            };
    }
};
