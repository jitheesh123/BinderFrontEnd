import { logbookGateWay } from "../../../services/authorizationService";
import * as serviceEndPoints from "../../../config/serviceEndPoints";

export const getBuildingData = params => logbookGateWay.get(serviceEndPoints.userEndPoints.getBuildingData, { params });
export const addBuilding = params => logbookGateWay.post(serviceEndPoints.userEndPoints.getBuildingData, params);
export const editBuilding = (params, id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getBuildingData}/${id}`, params);
export const deleteBuilding = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getBuildingData}/${id}`);
export const getBuildingById = id => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getBuildingData}/${id}`);
export const deleteBuildingLog = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getLogs}/${id}`);
export const restoreBuildingLog = id => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogs}/${id}/restore`);
export const getAllBuildingLogs = (params, id) => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getBuildingData}/${id}/logs`, { params });
export const exportBuilding = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getBuildingData}/export_xl`, { method: "GET", responseType: "blob", params });
export const getListForCommonFilterForBuilding = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getBuildingData}/get_list`, { params });
