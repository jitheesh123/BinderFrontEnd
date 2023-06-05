import { logbookGateWay } from '../../../services/authorizationService'
import * as serviceEndPoints from '../../../config/serviceEndPoints'

export const getSector = params => logbookGateWay.get(serviceEndPoints.userEndPoints.getSector, { params })
export const addSector = params => logbookGateWay.post(serviceEndPoints.userEndPoints.getSector, params)
export const editSectorById = (params, id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getSector}/${id}`, params)
export const deleteSector = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getSector}/${id}`)
export const getListForCommonFilterForSector = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getSector}/get_list`, {
        params
    });
export const getSectorById = id => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getSector}/${id}`);

export const exportSector = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getSector}/export_xl`, {
        method: "GET", responseType: "blob", params
    });
export const getAllSectorLogs = (params,id) => {
        return logbookGateWay.get(`${serviceEndPoints.userEndPoints.getSector}/${id}/logs`,{params});
    };
export const restoreSectorLog = (id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogs}/${id}/restore`);
export const deleteSectorLog = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getLogs}/${id}`);
