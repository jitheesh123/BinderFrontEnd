import { logbookGateWay } from "../../services/authorizationService";
import * as serviceEndPoints from "../../config/serviceEndPoints";

export const getDashboardData = params => logbookGateWay.get(serviceEndPoints.dashboardEndPoints.getDashboardData, { params });
