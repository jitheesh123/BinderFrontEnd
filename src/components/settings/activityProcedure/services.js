import { logbookGateWay } from '../../../services/authorizationService'
import * as serviceEndPoints from '../../../config/serviceEndPoints'

export const getActivityProcedure = (params) => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getActivityProcedure}`, { params })
export const addProcedure = params => logbookGateWay.post(serviceEndPoints.userEndPoints.getProcedure, params)
export const getActivityProcedureById = (id,ProcedureId) => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getActivityProcedure}/${ProcedureId}`)
export const editProcedureById = (params, id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getProcedure}/${id}`, params)
export const deleteActivityProcedure = (id,params) => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getActivityProcedure}/${id}`,{params})
export const getListForCommonFilterForProcedure = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getActivityProcedure}/get_list`, {
        params
    });
export const getProcedureById = id => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getProcedure}/${id}`);

export const exportProcedure = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getActivityProcedure}/export_xl`, {
        method: "GET", responseType: "blob", params
    });
export const getAllProcedureLogs = (params,id) => {
        return logbookGateWay.get(`${serviceEndPoints.userEndPoints.getProcedure}/${id}/logs`,{params});
    };
export const restoreProcedureLog = (id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogs}/${id}/restore`);
export const deleteProcedureLog = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getLogs}/${id}`);
