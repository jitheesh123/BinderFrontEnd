import { logbookGateWay } from '../../../services/authorizationService'
import * as serviceEndPoints from '../../../config/serviceEndPoints'

export const getBuildingLogbook = params => logbookGateWay.get(serviceEndPoints.userEndPoints.getBuildingLogbook, { params })
export const addBuildingLogbook = params => logbookGateWay.post(serviceEndPoints.userEndPoints.getBuildingLogbook, params)
export const deleteBuildingLogbook = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getBuildingLogbook}/${id}`)
export const editBuildingLogbook = (params, id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getBuildingLogbook}/${id}`, params)
export const getListForCommonFilterForBuildingLogbook = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getBuildingLogbook}/get_list`, {
        params
    });
export const getBuildingLogbookById = id => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getBuildingLogbook}/${id}`);
export const exportBuildingLogbook = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getBuildingLogbook}/export_xl`, {
        method: "GET", responseType: "blob", params
    });
export const getAllBuildingLogbookLogs = (params,id) => {
        return logbookGateWay.get(`${serviceEndPoints.userEndPoints.getBuildingLogbook}/${id}/logs`,{params});
    };
export const restoreBuildingLogbookLog = (id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogs}/${id}/restore`);
export const deleteBuildingLogbookLog = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getLogs}/${id}`);
