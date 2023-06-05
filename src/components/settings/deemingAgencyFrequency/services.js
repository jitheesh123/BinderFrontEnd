import { logbookGateWay } from '../../../services/authorizationService'
import * as serviceEndPoints from '../../../config/serviceEndPoints'

export const getDeemingAgencyFrequency = params => logbookGateWay.get(serviceEndPoints.userEndPoints.getDeemingAgencyFrequency, { params })
export const addDeemingAgencyFrequency = params => logbookGateWay.post(serviceEndPoints.userEndPoints.getDeemingAgencyFrequency, params)
export const deleteDeemingAgencyFrequency = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getDeemingAgencyFrequency}/${id}`)
export const editDeemingAgencyFrequency = (params, id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getDeemingAgencyFrequency}/${id}`, params)
export const getListForCommonFilterForLogbook = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getListForCommonFilterForLogbook}/get_list`, {
        params
    });
export const getDeemingAgencyFrequencyById = id => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getDeemingAgencyFrequency}/${id}`);
export const exportDeemingAgencyFrequency = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getDeemingAgencyFrequency}/export_xl`, {
        method: "GET", responseType: "blob", params
    });
export const getAllDeemingAgencyFrequencyLogs = (params,id) => {
        return logbookGateWay.get(`${serviceEndPoints.userEndPoints.getDeemingAgencyFrequency}/${id}/logs`,{params});
    };
export const restoreDeemingAgencyFrequencyLog = (id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogs}/${id}/restore`);
export const deleteDeemingAgencyFrequencyLog = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getLogs}/${id}`);
