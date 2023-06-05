import { logbookGateWay } from '../../../services/authorizationService'
import * as serviceEndPoints from '../../../config/serviceEndPoints'

export const getUserBuildingLogbook = params => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getUserBuildingLogbook}`, { params })
export const deleteUserBuildingLogbook = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getUserBuildingLogbook}/${id}`)
export const getListForCommonFilterForUserBuildingLogbook = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getUserBuildingLogbook}/get_list`, {
        params
    });
export const getUserBuildingLogbookById = id => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getUserBuildingLogbook}/${id}`);
export const exportUserBuildingLogbook = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getUserBuildingLogbook}/export_xl`, {
        method: "GET", responseType: "blob", params
    });
