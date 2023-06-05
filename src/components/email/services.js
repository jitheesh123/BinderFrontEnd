import { logbookGateWay } from "../../services/authorizationService";
import * as serviceEndPoints from "../../config/serviceEndPoints";

export const getUserEmailLists = params => logbookGateWay.get(`${serviceEndPoints.emailEndPoints.getUserEmail}/user_list`, { params });
export const sendEmail = (params, entity, path) =>
    logbookGateWay.get(`${serviceEndPoints.emailEndPoints.sendEmail}/${entity}/${path ? path : "send_email"}`, { params });
export const getSentMails = params => logbookGateWay.get(serviceEndPoints.emailEndPoints.getSentMails, { params });
export const getAllSentMails = params => logbookGateWay.get(serviceEndPoints.emailEndPoints.getAllSentMails, { params });
export const getInboxMails = params => logbookGateWay.get(serviceEndPoints.emailEndPoints.getInboxMails, { params });
export const getEmailDetails = id => logbookGateWay.get(`${serviceEndPoints.emailEndPoints.getEmailDetails}/${id}`);
export const sendMailWithAttachment = (params, path) => logbookGateWay.post(path || serviceEndPoints.emailEndPoints.sendMailWithAttachment, params);
