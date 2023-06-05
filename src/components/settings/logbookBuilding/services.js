import { logbookGateWay } from '../../../services/authorizationService'
import * as serviceEndPoints from '../../../config/serviceEndPoints'

export const getLogbookBuildingData = (params,id) => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getLogbook}/${id}/assigned_buildings`, { params })
export const addBuilding = params => logbookGateWay.post(serviceEndPoints.userEndPoints.getBuildingData, params)
export const editBuilding = (params, id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getBuildingData}/${id}`, params)
export const deleteLogbookBuilding = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getLogbookBuildingData}/${id}`)
export const getListForCommonFilterForBuilding = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getBuildingData}/get_list`, {
        params
    });
export const getLogbookBuildingById = (id,buildingId) => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getBuildingData}/${buildingId}`);
export const exportBuilding = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getBuildingData}/export_xl`, {
        method: "GET", responseType: "blob", params
    });
export const getAllBuildingLogs = (params,id) => {
        return logbookGateWay.get(`${serviceEndPoints.userEndPoints.getBuildingData}/${id}/logs`,{params});
    };
export const restoreBuildingLog = (id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogs}/${id}/restore`);
export const deleteBuildingLog = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getLogs}/${id}`);

