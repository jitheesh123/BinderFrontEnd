import { logbookGateWay } from "../../../services/authorizationService";
import * as serviceEndPoints from "../../../config/serviceEndPoints";

export const getAllFormTypes = (params, path = null) =>
    logbookGateWay.get(`${serviceEndPoints.formTypeEndPoints.getAllFormTypes}/${path || "event_forms"}`, { params });
export const fetchEventFormData = (id, path = null) =>
    logbookGateWay.get(`${serviceEndPoints.formTypeEndPoints.fetchEventFormData}/${path || "event_forms"}/${id}`);
export const updateEventForms = (event_form, id, path = null) =>
    logbookGateWay.patch(`${serviceEndPoints.formTypeEndPoints.updateEventForms}/${path || "event_forms"}/${id}`, event_form);
