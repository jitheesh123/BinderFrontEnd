import { logbookGateWay } from '../../../services/authorizationService'
import * as serviceEndPoints from '../../../config/serviceEndPoints'

export const getClientLogbook = params => logbookGateWay.get(serviceEndPoints.userEndPoints.getClientLogbook, { params })
export const addClientLogbook = params => logbookGateWay.post(serviceEndPoints.userEndPoints.getClientLogbook, params)
export const deleteClientLogbook = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getClientLogbook}/${id}`)
export const editClientLogbook = (params, id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getClientLogbook}/${id}`, params)
export const getListForCommonFilterForClientLogbook = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getClientLogbook}/get_list`, {
        params
    });
export const getClientLogbookById = id => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getClientLogbook}/${id}`);
export const exportClientLogbook = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getClientLogbook}/export_xl`, {
        method: "GET", responseType: "blob", params
    });
export const getAllClientLogbookLogs = (params,id) => {
        return logbookGateWay.get(`${serviceEndPoints.userEndPoints.getClientLogbook}/${id}/logs`,{params});
    };
export const restoreClientLogbookLog = (id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogs}/${id}/restore`);
export const deleteClientLogbookLog = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getLogs}/${id}`);
