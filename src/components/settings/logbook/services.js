import { logbookGateWay } from "../../../services/authorizationService";
import * as serviceEndPoints from "../../../config/serviceEndPoints";

export const getLogbook = (params, path) => logbookGateWay.get(path, { params });
export const addLogbook = params => logbookGateWay.post(serviceEndPoints.userEndPoints.getLogbook, params);
export const deleteLogbook = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getLogbook}/${id}`);
export const editLogbook = (params, id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogbook}/${id}`, params);
export const getListForCommonFilterForLogbook = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getListForCommonFilterForLogbook}/get_list`, {
        params
    });
export const getLogbookById = id => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getLogbook}/${id}`);
export const exportLogbook = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getListForCommonFilterForLogbook}/export_xl`, {
        method: "GET",
        responseType: "blob",
        params
    });
export const getAllLogbookLogs = (params, id) => {
    return logbookGateWay.get(`${serviceEndPoints.userEndPoints.getLogbook}/${id}/logs`, { params });
};
export const restoreLogbookLog = id => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogs}/${id}/restore`);
export const deleteLogbookLog = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getLogs}/${id}`);
export const getAllLogbookImages = id => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getLogbook}/${id}/images`);
export const uploadLogbookImage = (imageData, id) => logbookGateWay.post(`${serviceEndPoints.userEndPoints.getLogbook}/${id}/upload`, imageData);
export const updateLogbookImageComment = imageData =>
    logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogbook}/${imageData.id}/update_image`, {
        description: imageData.description,
        default: imageData.default ? imageData.default : null
    });
export const deleteLogbookImage = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getLogbook}/${id}/remove_image`);
export const getLogbookTypeDropdown = () => logbookGateWay.get(`${serviceEndPoints.logbookEndPoints.getLogbookTypeDropdown}`);
