import { logbookGateWay } from '../../../services/authorizationService'
import * as serviceEndPoints from '../../../config/serviceEndPoints'

export const getBuildingActivityList = (params, path) => logbookGateWay.get(serviceEndPoints.userEndPoints.getBuildingActivity, { params })
export const addBuildingActivity = params => logbookGateWay.post(serviceEndPoints.userEndPoints.getBuildingActivity, params)
export const deleteBuildingActivity = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getBuildingActivity}/${id}`)
export const editBuildingActivity = (params, id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getBuildingActivity}/${id}`, params)
export const getListForCommonFilterForBuildingActivity = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getBuildingActivity}/get_list`, {
        params
    });
export const getBuildingActivityById = id => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getBuildingActivity}/${id}`);
export const exportBuildingActivity = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getBuildingActivity}/export_xl`, {
        method: "GET", responseType: "blob", params
    });
export const getAllBuildingActivityLogs = (params,id) => {
        return logbookGateWay.get(`${serviceEndPoints.userEndPoints.getBuildingActivity}/${id}/logs`,{params});
    };
export const restoreBuildingActivityLog = (id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogs}/${id}/restore`);
export const deleteBuildingActivityLog = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getLogs}/${id}`);
export const editBuildingShiftActivity = (params, id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getBuildingEditShift}/${id}`, params)

