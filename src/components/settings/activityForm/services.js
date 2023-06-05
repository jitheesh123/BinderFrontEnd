import { logbookGateWay } from "../../../services/authorizationService";
import * as serviceEndPoints from "../../../config/serviceEndPoints";

export const getActivityForm = params => logbookGateWay.get(`${serviceEndPoints.activityFormEndPoints.getActivityForm}`, { params });
export const addForm = params => logbookGateWay.post(serviceEndPoints.activityFormEndPoints.getForm, params);
export const getActivityFormById = (id, formId) => logbookGateWay.get(`${serviceEndPoints.activityFormEndPoints.getActivityForm}/${formId}`);
export const editFormById = (params, id) => logbookGateWay.patch(`${serviceEndPoints.activityFormEndPoints.getForm}/${id}`, params);
export const deleteActivityForm = (id, params) =>
    logbookGateWay.delete(`${serviceEndPoints.activityFormEndPoints.getActivityForm}/${id}`, { params });
export const getListForCommonFilterForForm = params =>
    logbookGateWay.get(`${serviceEndPoints.activityFormEndPoints.getActivityForm}/get_list`, {
        params
    });
export const getFormById = id => logbookGateWay.get(`${serviceEndPoints.activityFormEndPoints.getForm}/${id}`);

export const exportForm = params =>
    logbookGateWay.get(`${serviceEndPoints.activityFormEndPoints.getActivityForm}/export_xl`, {
        method: "GET",
        responseType: "blob",
        params
    });
export const getAllFormLogs = (params, id) => {
    return logbookGateWay.get(`${serviceEndPoints.activityFormEndPoints.getForm}/${id}/logs`, { params });
};
export const restoreFormLog = id => logbookGateWay.patch(`${serviceEndPoints.activityFormEndPoints.getLogs}/${id}/restore`);
export const deleteFormLog = id => logbookGateWay.delete(`${serviceEndPoints.activityFormEndPoints.getLogs}/${id}`);
export const getFormRecords = () => logbookGateWay.get(`${serviceEndPoints.formEndPoints.getForms}/records`);
export const uploadFormRecords = formData => logbookGateWay.patch(`${serviceEndPoints.formEndPoints.getForms}/upload_records`, formData);
export const removeAttachment = id => logbookGateWay.delete(`${serviceEndPoints.formEndPoints.removeAttachment}/${id}/remove_record`);
