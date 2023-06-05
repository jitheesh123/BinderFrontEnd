import { logbookGateWay } from '../../../services/authorizationService'
import * as serviceEndPoints from '../../../config/serviceEndPoints'

export const getUserBuilding = params => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getUserBuilding}`, { params })
export const deleteUserBuilding = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getUserBuilding}/${id}`)
export const getListForCommonFilterForUserBuilding = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getUserBuilding}/get_list`, {
        params
    });
export const getUserBuildingById = id => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getUserBuilding}/${id}`);
export const exportUserBuilding = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getUserBuilding}/export_xl`, {
        method: "GET", responseType: "blob", params
    });
