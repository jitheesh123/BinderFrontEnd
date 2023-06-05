import { logbookGateWay } from '../../services/authorizationService'
import * as serviceEndPoints from '../../config/serviceEndPoints';

export const getSmartReports = (params, path) => logbookGateWay.get(`${serviceEndPoints.dashboardEndPoints.getDashboardData}/smart_reports`, { params })
export const getListForCommonFilterForSmartReport = params =>
    logbookGateWay.get(`${serviceEndPoints.dashboardEndPoints.getDashboardData}/get_list`, {
        params
    });
export const exportSmartReports = params =>
    logbookGateWay.get(`${serviceEndPoints.dashboardEndPoints.getDashboardData}/export_xl`, {
        method: "GET", responseType: "blob", params
    });
