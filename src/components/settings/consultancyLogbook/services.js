import { logbookGateWay } from '../../../services/authorizationService'
import * as serviceEndPoints from '../../../config/serviceEndPoints'

export const getConsultancyLogbook = params => logbookGateWay.get(serviceEndPoints.userEndPoints.getConsultancyLogbook, { params })
export const addConsultancyLogbook = params => logbookGateWay.post(serviceEndPoints.userEndPoints.getConsultancyLogbook, params)
export const deleteConsultancyLogbook = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getConsultancyLogbook}/${id}`)
export const editConsultancyLogbook = (params, id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getConsultancyLogbook}/${id}`, params)
export const getListForCommonFilterForLogbook = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getListForCommonFilterForLogbook}/get_list`, {
        params
    });
export const getConsultancyLogbookById = id => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getConsultancyLogbook}/${id}`);
export const exportConsultancyLogbook = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getConsultancyLogbook}/export_xl`, {
        method: "GET", responseType: "blob", params
    });
export const getAllConsultancyLogbookLogs = (params,id) => {
        return logbookGateWay.get(`${serviceEndPoints.userEndPoints.getConsultancyLogbook}/${id}/logs`,{params});
    };
export const restoreConsultancyLogbookLog = (id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogs}/${id}/restore`);
export const deleteConsultancyLogbookLog = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getLogs}/${id}`);
