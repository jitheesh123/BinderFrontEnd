import { logbookGateWay } from '../../../services/authorizationService'
import * as serviceEndPoints from '../../../config/serviceEndPoints'

export const getActivityClients = (params,id )=> logbookGateWay.get(`${serviceEndPoints.activityEndPoints.getActivityList}/${id}/assigned_clients`, { params })
export const addClients = params => logbookGateWay.post(serviceEndPoints.userEndPoints.getClients, params)
export const editClientsById = (params, id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getClients}/${id}`, params)
export const deleteActivityClient = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getActivityClients}/${id}`)
export const getListForCommonFilterForClient = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getClients}/get_list`, {
        params
    });
export const getActivityClientById = (id,clientId) => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getClients}/${clientId}`);
export const exportClient = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getClients}/export_xl`, {
        method: "GET", responseType: "blob", params
    });
export const getAllClientLogs = (params,id) => {
        return logbookGateWay.get(`${serviceEndPoints.userEndPoints.getClients}/${id}/logs`,{params});
    };
export const restoreClientLog = (id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogs}/${id}/restore`);
export const deleteClientLog = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getLogs}/${id}`);


