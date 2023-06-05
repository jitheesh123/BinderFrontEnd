import { logbookGateWay } from '../../../services/authorizationService'
import * as serviceEndPoints from '../../../config/serviceEndPoints'

export const getTemplates = params => logbookGateWay.get(serviceEndPoints.templateEndPoints.getTemplates, { params })
export const addTemplates = params => logbookGateWay.post(serviceEndPoints.templateEndPoints.addTemplate, params)
export const getTemplatesById = id => logbookGateWay.get(`${serviceEndPoints.templateEndPoints.getTemplatesById}/${id}`)
export const editTemplatesById = (params, id) => logbookGateWay.patch(`${serviceEndPoints.templateEndPoints.editTemplate}/${id}`, params)
export const deleteTemplates = id => logbookGateWay.delete(`${serviceEndPoints.templateEndPoints.deleteTemplate}/${id}`)
export const getListForCommonFilterForTemplates = params =>
    logbookGateWay.get(`${serviceEndPoints.templateEndPoints.getTemplates}/get_list`, {
        params
    });
// export const getTemplatesById = id => logbookGateWay.get(`${serviceEndPoints.templateEndPoints.getTemplates}/${id}`);

export const exportTemplates = params =>
    logbookGateWay.get(`${serviceEndPoints.templateEndPoints.exportTemplate}/export_xl`, {
        method: "GET", responseType: "blob", params
    });
export const getAllTemplatesLogs = (params,id) => {
        return logbookGateWay.get(`${serviceEndPoints.templateEndPoints.getTemplates}/${id}/logs`,{params});
    };
export const restoreTemplatesLog = (id) => logbookGateWay.patch(`${serviceEndPoints.templateEndPoints.getLogs}/${id}/restore`);
export const deleteTemplatesLog = id => logbookGateWay.delete(`${serviceEndPoints.templateEndPoints.getLogs}/${id}`);
