import { logbookGateWay } from '../../../services/authorizationService'
import * as serviceEndPoints from '../../../config/serviceEndPoints'

export const getConsultancyActivityList = (params, path) => logbookGateWay.get(serviceEndPoints.userEndPoints.getConsultancyActivity, { params })
export const addConsultancyActivity = params => logbookGateWay.post(serviceEndPoints.userEndPoints.getConsultancyActivity, params)
export const deleteConsultancyActivity = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getConsultancyActivity}/${id}`)
export const editConsultancyActivity = (params, id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getConsultancyActivity}/${id}`, params)
export const getListForCommonFilterForConsultancyActivity = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getConsultancyActivity}/get_list`, {
        params
    });
export const getConsultancyActivityById = id => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getConsultancyActivity}/${id}`);
export const exportConsultancyActivity = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getConsultancyActivity}/export_xl`, {
        method: "GET", responseType: "blob", params
    });
export const getAllConsultancyActivityLogs = (params,id) => {
        return logbookGateWay.get(`${serviceEndPoints.userEndPoints.getConsultancyActivity}/${id}/logs`,{params});
    };
export const restoreConsultancyActivityLog = (id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogs}/${id}/restore`);
export const deleteConsultancyActivityLog = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getLogs}/${id}`);

