import { logbookGateWay } from "../../../services/authorizationService";
import * as serviceEndPoints from "../../../config/serviceEndPoints";

export const getAsset = params => logbookGateWay.get(serviceEndPoints.assetEndPoints.getAssets, { params });
export const addAsset = params => logbookGateWay.post(serviceEndPoints.assetEndPoints.getAssets, params);
export const editAssetById = (params, id) => logbookGateWay.patch(`${serviceEndPoints.assetEndPoints.getAssets}/${id}`, params);
export const deleteAsset = id => logbookGateWay.delete(`${serviceEndPoints.assetEndPoints.getAssets}/${id}`);
export const getListForCommonFilterForAsset = params =>
    logbookGateWay.get(`${serviceEndPoints.assetEndPoints.getAssets}/get_list`, {
        params
    });
export const getAssetById = id => logbookGateWay.get(`${serviceEndPoints.assetEndPoints.getAssets}/${id}`);

export const exportAsset = params =>
    logbookGateWay.get(`${serviceEndPoints.assetEndPoints.getAssets}/export_xl`, {
        method: "GET",
        responseType: "blob",
        params
    });
export const getAllAssetLogs = (params, id) => {
    return logbookGateWay.get(`${serviceEndPoints.assetEndPoints.getAssets}/${id}/logs`, { params });
};
export const restoreAssetLog = id => logbookGateWay.patch(`${serviceEndPoints.assetEndPoints.getLogs}/${id}/restore`);
export const deleteAssetLog = id => logbookGateWay.delete(`${serviceEndPoints.assetEndPoints.getLogs}/${id}`);
export const getAllAssetImages = id => logbookGateWay.get(`${serviceEndPoints.assetEndPoints.getAssets}/${id}/images`);
export const uploadAssetImage = (imageData, id) => logbookGateWay.post(`${serviceEndPoints.assetEndPoints.getAssets}/${id}/upload`, imageData);
export const updateAssetImageComment = imageData =>
    logbookGateWay.patch(`${serviceEndPoints.assetEndPoints.getAssets}/${imageData.id}/update_image`, {
        description: imageData.description,
        default: imageData.default ? imageData.default : null
    });
export const deleteAssetImage = id => logbookGateWay.delete(`${serviceEndPoints.assetEndPoints.getAssets}/${id}/remove_image`);
export const getCreateSurveyPopupDetailsForAssetLogbookScheduling = (id, building_id) =>
    logbookGateWay.get(
        `${serviceEndPoints.assetEndPoints.getCreateSurveyPopupDetailsForAssetLogbookScheduling}/${id}/logbook_survey_popup?building_id=${building_id}`
    );
export const getCreateSurveyPopupDetailsForAssetActivitiesScheduling = (id, building_id) =>
    logbookGateWay.get(
        `${serviceEndPoints.assetEndPoints.getCreateSurveyPopupDetailsForAssetActivitiesScheduling}/${id}/activity_survey_popup?building_id=${building_id}`
    );
export const createSurvey = (id, surveyParams) =>
    logbookGateWay.put(`${serviceEndPoints.assetEndPoints.createSurvey}/${id}/create_survey`, surveyParams);
