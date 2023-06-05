import { logbookGateWay } from "../../../services/authorizationService";
import * as serviceEndPoints from "../../../config/serviceEndPoints";

export const getForm = params => logbookGateWay.get(serviceEndPoints.formEndPoints.getForms, { params });
export const addForm = params => logbookGateWay.post(serviceEndPoints.formEndPoints.getForms, params);
export const editFormById = (params, id) => logbookGateWay.patch(`${serviceEndPoints.formEndPoints.getForms}/${id}`, params);
export const deleteForm = id => logbookGateWay.delete(`${serviceEndPoints.formEndPoints.getForms}/${id}`);
export const getListForCommonFilterForForm = params =>
    logbookGateWay.get(`${serviceEndPoints.formEndPoints.getForms}/get_list`, {
        params
    });
export const getFormById = id => logbookGateWay.get(`${serviceEndPoints.formEndPoints.getForms}/${id}`);

export const exportForm = params =>
    logbookGateWay.get(`${serviceEndPoints.formEndPoints.getForms}/export_xl`, {
        method: "GET",
        responseType: "blob",
        params
    });
export const getAllFormLogs = (params, id) => {
    return logbookGateWay.get(`${serviceEndPoints.formEndPoints.getForms}/${id}/logs`, { params });
};
export const restoreFormLog = id => logbookGateWay.patch(`${serviceEndPoints.formEndPoints.getForms}/${id}/restore`);
export const deleteFormLog = id => logbookGateWay.delete(`${serviceEndPoints.formEndPoints.getForms}/${id}`);
export const getFormRecords = () => logbookGateWay.get(`${serviceEndPoints.formEndPoints.getForms}/records`);
export const uploadFormRecords = (formData, id) => logbookGateWay.patch(`${serviceEndPoints.formEndPoints.getForms}/upload_records`, formData);
export const removeAttachment = id => logbookGateWay.delete(`${serviceEndPoints.formEndPoints.removeAttachment}/${id}/remove_record`);
