import { logbookGateWay } from "../../../services/authorizationService";
import * as serviceEndPoints from "../../../config/serviceEndPoints";

export const getFloor = params => logbookGateWay.get(serviceEndPoints.floorEndPoints.getFloors, { params });
export const addFloor = params => logbookGateWay.post(serviceEndPoints.floorEndPoints.getFloors, params);
export const editFloorById = (params, id) => logbookGateWay.patch(`${serviceEndPoints.floorEndPoints.getFloors}/${id}`, params);
export const deleteFloor = id => logbookGateWay.delete(`${serviceEndPoints.floorEndPoints.getFloors}/${id}`);
export const getListForCommonFilterForFloor = params =>
    logbookGateWay.get(`${serviceEndPoints.floorEndPoints.getFloors}/get_list`, {
        params
    });
export const getFloorById = id => logbookGateWay.get(`${serviceEndPoints.floorEndPoints.getFloors}/${id}`);

export const exportFloor = params =>
    logbookGateWay.get(`${serviceEndPoints.floorEndPoints.getFloors}/export_xl`, {
        method: "GET",
        responseType: "blob",
        params
    });
export const getAllFloorLogs = (params, id) => {
    return logbookGateWay.get(`${serviceEndPoints.floorEndPoints.getFloors}/${id}/logs`, { params });
};
export const restoreFloorLog = id => logbookGateWay.patch(`${serviceEndPoints.floorEndPoints.getLogs}/${id}/restore`);
export const deleteFloorLog = id => logbookGateWay.delete(`${serviceEndPoints.floorEndPoints.getLogs}/${id}`);
