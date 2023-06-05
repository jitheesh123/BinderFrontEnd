import { logbookGateWay } from '../../../services/authorizationService'
import * as serviceEndPoints from '../../../config/serviceEndPoints'

export const getAssetCondition = params => logbookGateWay.get(serviceEndPoints.assetConditionEndPoints.getAssetConditions, { params })
export const addAssetCondition = params => logbookGateWay.post(serviceEndPoints.assetConditionEndPoints.getAssetConditions, params)
export const editAssetConditionById = (params, id) => logbookGateWay.patch(`${serviceEndPoints.assetConditionEndPoints.getAssetConditions}/${id}`, params)
export const deleteAssetCondition = id => logbookGateWay.delete(`${serviceEndPoints.assetConditionEndPoints.getAssetConditions}/${id}`)
export const getListForCommonFilterForAssetCondition = params =>
    logbookGateWay.get(`${serviceEndPoints.assetConditionEndPoints.getAssetConditions}/get_list`, {
        params
    });
export const getAssetConditionById = id => logbookGateWay.get(`${serviceEndPoints.assetConditionEndPoints.getAssetConditions}/${id}`);

export const exportAssetCondition = params =>
    logbookGateWay.get(`${serviceEndPoints.assetConditionEndPoints.getAssetConditions}/export_xl`, {
        method: "GET", responseType: "blob", params
    });
export const getAllAssetConditionLogs = (params,id) => {
        return logbookGateWay.get(`${serviceEndPoints.assetConditionEndPoints.getAssetConditions}/${id}/logs`,{params});
    };
export const restoreAssetConditionLog = (id) => logbookGateWay.patch(`${serviceEndPoints.assetConditionEndPoints.getLogs}/${id}/restore`);
export const deleteAssetConditionLog = id => logbookGateWay.delete(`${serviceEndPoints.assetConditionEndPoints.getLogs}/${id}`);
