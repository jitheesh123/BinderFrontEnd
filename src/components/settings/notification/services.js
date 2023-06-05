import { logbookGateWay } from '../../../services/authorizationService'
import * as serviceEndPoints from '../../../config/serviceEndPoints'

export const getNotification = params => logbookGateWay.get(serviceEndPoints.notificationEndPoints.getNotifications, { params })
export const addNotification = params => logbookGateWay.post(serviceEndPoints.notificationEndPoints.getNotifications, params)
export const editNotificationById = (params, id) => logbookGateWay.patch(`${serviceEndPoints.notificationEndPoints.getNotifications}/${id}`, params)
export const deleteNotification = id => logbookGateWay.delete(`${serviceEndPoints.notificationEndPoints.getNotifications}/${id}`)
export const restoreNotificationLog = (id) => logbookGateWay.patch(`${serviceEndPoints.notificationEndPoints.getLogs}/${id}/restore`);
export const deleteNotificationLog = id => logbookGateWay.delete(`${serviceEndPoints.notificationEndPoints.getLogs}/${id}`);
export const getListForCommonFilterForNotification = params =>
    logbookGateWay.get(`${serviceEndPoints.notificationEndPoints.getNotifications}/get_list`, {
        params
    });
export const getNotificationById = id => logbookGateWay.get(`${serviceEndPoints.notificationEndPoints.getNotifications}/${id}`);

export const exportNotification = params =>
    logbookGateWay.get(`${serviceEndPoints.notificationEndPoints.getNotifications}/export_xl`, {
        method: "GET", responseType: "blob", params
    });
export const getAllNotificationLogs = (params,id) => {
        return logbookGateWay.get(`${serviceEndPoints.notificationEndPoints.getNotifications}/${id}/logs`,{params});
    };
