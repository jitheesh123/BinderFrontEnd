import { logbookGateWay } from '../../../services/authorizationService'
import * as serviceEndPoints from '../../../config/serviceEndPoints'

export const getLogbookConsultancies = (params,id) => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getLogbook}/${id}/assigned_consultancies`, { params })
export const addConsultancies = params => logbookGateWay.post(serviceEndPoints.userEndPoints.getConsultancies, params)
export const getLogbookConsultancyById = (id,consultancyId) => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getConsultancies}/${consultancyId}`)
export const editConsultanciesById = (params, id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getConsultancies}/${id}`, params)
export const deleteLogbookConsultancy = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getLogbookConsultancies}/${id}`)
export const getListForCommonFilterForConsultancy = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getConsultancies}/get_list`, {
        params
    });
export const getConsultancyById = id => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getConsultancies}/${id}`);

export const exportConsultancy = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getConsultancies}/export_xl`, {
        method: "GET", responseType: "blob", params
    });
export const getAllConsultancyLogs = (params,id) => {
        return logbookGateWay.get(`${serviceEndPoints.userEndPoints.getConsultancies}/${id}/logs`,{params});
    };
export const restoreConsultancyLog = (id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogs}/${id}/restore`);
export const deleteConsultancyLog = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getLogs}/${id}`);
