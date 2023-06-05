import { logbookGateWay } from '../../../services/authorizationService'
import * as serviceEndPoints from '../../../config/serviceEndPoints'

export const getDeemingAgency = params => logbookGateWay.get(serviceEndPoints.userEndPoints.getDeemingAgencies, { params })
export const addDeemingAgency = params => logbookGateWay.post(serviceEndPoints.userEndPoints.getDeemingAgencies, params)
export const editDeemingAgencyById = (params, id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getDeemingAgencies}/${id}`, params)
export const deleteDeemingAgency = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getDeemingAgencies}/${id}`)
export const getListForCommonFilterForDeemingAgency = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getDeemingAgencies}/get_list`, {
        params
    });
export const getDeemingAgencyById = id => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getDeemingAgencies}/${id}`);

export const exportDeemingAgency = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getDeemingAgencies}/export_xl`, {
        method: "GET", responseType: "blob", params
    });
export const getAllDeemingAgencyLogs = (params,id) => {
        return logbookGateWay.get(`${serviceEndPoints.userEndPoints.getDeemingAgencies}/${id}/logs`,{params});
    };
export const restoreDeemingAgencyLog = (id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogs}/${id}/restore`);
export const deleteDeemingAgencyLog = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getLogs}/${id}`);
