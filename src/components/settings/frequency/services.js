import { logbookGateWay } from '../../../services/authorizationService'
import * as serviceEndPoints from '../../../config/serviceEndPoints'

export const getFrequency = params => logbookGateWay.get(serviceEndPoints.userEndPoints.getFrequencies, { params })
export const addFrequency = params => logbookGateWay.post(serviceEndPoints.userEndPoints.getFrequencies, params)
export const editFrequencyById = (params, id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getFrequencies}/${id}`, params)
export const deleteFrequency = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getFrequencies}/${id}`)
export const getListForCommonFilterForFrequency = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getFrequencies}/get_list`, {
        params
    });
export const getFrequencyById = id => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getFrequencies}/${id}`);

export const exportFrequency = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getFrequencies}/export_xl`, {
        method: "GET", responseType: "blob", params
    });
export const getAllFrequencyLogs = (params,id) => {
        return logbookGateWay.get(`${serviceEndPoints.userEndPoints.getFrequencies}/${id}/logs`,{params});
    };
export const restoreFrequencyLog = (id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogs}/${id}/restore`);
export const deleteFrequencyLog = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getLogs}/${id}`);
