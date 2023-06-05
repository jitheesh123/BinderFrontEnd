import { logbookGateWay } from "../../services/authorizationService";
import * as serviceEndPoints from "../../config/serviceEndPoints";

export const getConsultancies = params => logbookGateWay.get(serviceEndPoints.userEndPoints.getConsultancies, { params });
export const getAllLogbooks = params => logbookGateWay.get(serviceEndPoints.dashboardEndPoints.getAllLogbooks, { params });
