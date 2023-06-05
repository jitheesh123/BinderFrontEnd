import { logbookGateWay } from '../../../services/authorizationService'
import * as serviceEndPoints from '../../../config/serviceEndPoints'

export const getReports = (params, path) => logbookGateWay.get(serviceEndPoints.userEndPoints.getReports, { params })
export const addLogbook = params => logbookGateWay.post(serviceEndPoints.userEndPoints.getLogbook, params)
export const deleteLogbook = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getLogbook}/${id}`)
export const editLogbook = (params, id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogbook}/${id}`, params)
export const getListForCommonFilterForLogbook = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getReports}/get_list`, {
        params
    });
export const getLogbookById = id => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getLogbook}/${id}`);
export const exportReports = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getReports}/export_xl`, {
        method: "GET", responseType: "blob", params
    });
export const getAllLogbookLogs = (params,id) => {
        return logbookGateWay.get(`${serviceEndPoints.userEndPoints.getLogbook}/${id}/logs`,{params});
    };
export const restoreLogbookLog = (id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogs}/${id}/restore`);
export const deleteLogbookLog = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getLogs}/${id}`);
