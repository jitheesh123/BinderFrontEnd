import { logbookGateWay } from '../../../services/authorizationService'
import * as serviceEndPoints from '../../../config/serviceEndPoints'

export const getConsultancies = params => logbookGateWay.get(serviceEndPoints.userEndPoints.getConsultancies, { params })
export const addConsultancies = params => logbookGateWay.post(serviceEndPoints.userEndPoints.getConsultancies, params)
export const getConsultanciesById = id => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getConsultancies}/${id}`)
export const editConsultanciesById = (params, id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getConsultancies}/${id}`, params)
export const deleteConsultancy = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getConsultancies}/${id}`)
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
