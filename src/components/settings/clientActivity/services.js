import { logbookGateWay } from '../../../services/authorizationService'
import * as serviceEndPoints from '../../../config/serviceEndPoints'

export const getClientActivityList = (params, path) => logbookGateWay.get(serviceEndPoints.userEndPoints.getClientActivity, { params })
export const addClientActivity = params => logbookGateWay.post(serviceEndPoints.userEndPoints.getClientActivity, params)
export const deleteClientActivity = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getClientActivity}/${id}`)
export const editClientActivity = (params, id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getClientActivity}/${id}`, params)
export const getListForCommonFilterForClientActivity = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getClientActivity}/get_list`, {
        params
    });
export const getClientActivityById = id => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getClientActivity}/${id}`);
export const exportClientActivity = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getClientActivity}/export_xl`, {
        method: "GET", responseType: "blob", params
    });
export const getAllClientActivityLogs = (params,id) => {
        return logbookGateWay.get(`${serviceEndPoints.userEndPoints.getClientActivity}/${id}/logs`,{params});
    };
export const restoreClientActivityLog = (id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogs}/${id}/restore`);
export const deleteClientActivityLog = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getLogs}/${id}`);
export const editClientShiftActivity = (params, id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getClientEditShift}/${id}`, params)

