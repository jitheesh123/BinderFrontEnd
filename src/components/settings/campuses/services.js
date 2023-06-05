import { logbookGateWay } from '../../../services/authorizationService'
import * as serviceEndPoints from '../../../config/serviceEndPoints'

export const getCampuses = params => logbookGateWay.get(serviceEndPoints.userEndPoints.getCampuses, { params })
export const addCampus = params => logbookGateWay.post(serviceEndPoints.userEndPoints.getCampuses, params)
export const editCampusById = (params, id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getCampuses}/${id}`, params)
export const deleteCampus = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getCampuses}/${id}`)
export const getListForCommonFilterForCampus = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getCampuses}/get_list`, {
        params
    });
export const getCampusById = id => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getCampuses}/${id}`);
export const exportCampus = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getCampuses}/export_xl`, {
        method: "GET", responseType: "blob", params
    });
export const getAllCampusLogs = (params,id) => {
        return logbookGateWay.get(`${serviceEndPoints.userEndPoints.getCampuses}/${id}/logs`,{params});
    };
export const restoreCampusLog = (id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogs}/${id}/restore`);
export const deleteCampusLog = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getLogs}/${id}`);
