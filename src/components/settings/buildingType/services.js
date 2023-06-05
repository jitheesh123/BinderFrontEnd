import { logbookGateWay } from '../../../services/authorizationService'
import * as serviceEndPoints from '../../../config/serviceEndPoints'

export const getBuildingType = params => logbookGateWay.get(serviceEndPoints.userEndPoints.getBuildingTypes, { params })
export const addBuildingType = params => logbookGateWay.post(serviceEndPoints.userEndPoints.getBuildingTypes, params)
export const editBuildingTypeById = (params, id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getBuildingTypes}/${id}`, params)
export const deleteBuildingType = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getBuildingTypes}/${id}`)
export const getListForCommonFilterForBuildingType = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getBuildingTypes}/get_list`, {
        params
    });
export const getBuildingTypeById = id => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getBuildingTypes}/${id}`);

export const exportBuildingType = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getBuildingTypes}/export_xl`, {
        method: "GET", responseType: "blob", params
    });
export const getAllBuildingTypeLogs = (params,id) => {
        return logbookGateWay.get(`${serviceEndPoints.userEndPoints.getBuildingTypes}/${id}/logs`,{params});
    };
export const restoreBuildingTypeLog = (id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogs}/${id}/restore`);
export const deleteBuildingTypeLog = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getLogs}/${id}`);
