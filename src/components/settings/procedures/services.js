import { logbookGateWay } from "../../../services/authorizationService";
import * as serviceEndPoints from "../../../config/serviceEndPoints";

export const getProcedure = params => logbookGateWay.get(serviceEndPoints.procedureEndPoints.getProcedures, { params });
export const addProcedure = params => logbookGateWay.post(serviceEndPoints.procedureEndPoints.getProcedures, params);
export const editProcedureById = (params, id) => logbookGateWay.patch(`${serviceEndPoints.procedureEndPoints.getProcedures}/${id}`, params);
export const deleteProcedure = id => logbookGateWay.delete(`${serviceEndPoints.procedureEndPoints.getProcedures}/${id}`);
export const getListForCommonFilterForProcedure = params =>
    logbookGateWay.get(`${serviceEndPoints.procedureEndPoints.getProcedures}/get_list`, {
        params
    });
export const getProcedureById = id => logbookGateWay.get(`${serviceEndPoints.procedureEndPoints.getProcedures}/${id}`);

export const exportProcedure = params =>
    logbookGateWay.get(`${serviceEndPoints.procedureEndPoints.getProcedures}/export_xl`, {
        method: "GET",
        responseType: "blob",
        params
    });
export const getAllProcedureLogs = (params, id) => {
    return logbookGateWay.get(`${serviceEndPoints.procedureEndPoints.getProcedures}/${id}/logs`, { params });
};
export const restoreProcedureLog = id => logbookGateWay.patch(`${serviceEndPoints.procedureEndPoints.getLogs}/${id}/restore`);
export const deleteProcedureLog = id => logbookGateWay.delete(`${serviceEndPoints.procedureEndPoints.getLogs}/${id}`);
export const uploadDocumentsProcedure = (formData, id) =>
    logbookGateWay.patch(`${serviceEndPoints.procedureEndPoints.getProcedures}/upload_documents`, formData);
export const getProcedureDocuments = () => logbookGateWay.get(`${serviceEndPoints.procedureEndPoints.getProcedures}/documents`);
export const removeAttachment = id => logbookGateWay.delete(`${serviceEndPoints.procedureEndPoints.removeAttachment}/${id}/remove_document`);
