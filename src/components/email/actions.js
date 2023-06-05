/* eslint-disable import/no-anonymous-default-export */
import * as actionTypes from "./constants";
import * as Service from "./services";

const getUserEmailLists = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_USER_EMAIL_LIST_REQUEST });
            const res = await Service.getUserEmailLists(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_USER_EMAIL_LIST_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_USER_EMAIL_LIST_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_USER_EMAIL_LIST_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_USER_EMAIL_LIST_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getInboxMails = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_INBOX_MAILS_REQUEST });
            const res = await Service.getInboxMails(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_INBOX_MAILS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_INBOX_MAILS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_INBOX_MAILS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_INBOX_MAILS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getSentMails = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SENT_MAILS_REQUEST });
            const res = await Service.getSentMails(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_SENT_MAILS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_SENT_MAILS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_SENT_MAILS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_SENT_MAILS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getAllSentMails = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_SENT_MAILS_REQUEST });
            const res = await Service.getAllSentMails(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_SENT_MAILS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_SENT_MAILS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_SENT_MAILS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_SENT_MAILS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getEmailDetails = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_EMAIL_DETAILS_REQUEST });
            const res = await Service.getEmailDetails(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_EMAIL_DETAILS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_EMAIL_DETAILS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_EMAIL_DETAILS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_EMAIL_DETAILS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const sendEmail = (params, entity, path = null) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.SEND_EMAIL_REQUEST });
            const res = await Service.sendEmail(params, entity, path);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.SEND_EMAIL_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.SEND_EMAIL_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.SEND_EMAIL_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.SEND_EMAIL_FAILURE, error: e.response && e.response.data });
        }
    };
};

const sendMailWithAttachment = (params, path = null) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.SEND_MAIL_WITH_ATTACHMENT_REQUEST });
            const res = await Service.sendMailWithAttachment(params, path);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.SEND_MAIL_WITH_ATTACHMENT_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.SEND_MAIL_WITH_ATTACHMENT_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.SEND_MAIL_WITH_ATTACHMENT_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.SEND_MAIL_WITH_ATTACHMENT_FAILURE, error: e.response && e.response.data });
        }
    };
};

export default {
    getUserEmailLists,
    sendEmail,
    getInboxMails,
    getSentMails,
    getEmailDetails,
    sendMailWithAttachment,
    getAllSentMails
};
