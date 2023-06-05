import { logbookGateWay } from "../../../services/authorizationService";
import * as serviceEndPoints from "../../../config/serviceEndPoints";

export const getActivityList = params => logbookGateWay.get(serviceEndPoints.activityEndPoints.addActivity, { params });
export const addActivity = params => logbookGateWay.post(serviceEndPoints.activityEndPoints.addActivity, params);
export const deleteActivity = id => logbookGateWay.delete(`${serviceEndPoints.activityEndPoints.deleteActivity}/${id}`);
export const editActivity = (params, id) => logbookGateWay.patch(`${serviceEndPoints.activityEndPoints.editActivity}/${id}`, params);
export const pushActivity = (params, id) => logbookGateWay.patch(`${serviceEndPoints.activityEndPoints.pushActivity}/${id}/push`, params);
export const getListForCommonFilterForActivity = params =>
    logbookGateWay.get(`${serviceEndPoints.activityEndPoints.getListForCommonFilterForActivity}/get_list`, {
        params
    });
export const getActivityById = id => logbookGateWay.get(`${serviceEndPoints.activityEndPoints.getActivityList}/${id}`);
export const exportActivity = params =>
    logbookGateWay.get(`${serviceEndPoints.activityEndPoints.getActivityList}/export_xl`, {
        method: "GET",
        responseType: "blob",
        params
    });
export const getAllActivityLogs = (params, id) => {
    return logbookGateWay.get(`${serviceEndPoints.activityEndPoints.getActivityList}/${id}/logs`, { params });
};
export const restoreActivityLog = id => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogs}/${id}/restore`);
export const deleteActivityLog = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getLogs}/${id}`);
export const getAssignFormToActivityPopupDetails = id =>
    logbookGateWay.get(`${serviceEndPoints.activityEndPoints.getActivityList}/${id}/assign_forms_popup`);
export const assignFormToActivity = (id, form_ids) =>
    logbookGateWay.patch(`${serviceEndPoints.activityEndPoints.getActivityList}/${id}/assign_forms`, { form_ids: form_ids });

export const getLinkedActivityList = (logbook_id, deeming_agency_id) =>
    logbookGateWay.get(`${serviceEndPoints.activityEndPoints.getLinkedActivityList}?logbook_id=${logbook_id}&deeming_agency_id=${deeming_agency_id}`);

export const getCategoryDropdown = () => logbookGateWay.get(`${serviceEndPoints.activityEndPoints.getCategoryDropdown}`);
