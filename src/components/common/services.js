import { logbookGateWay } from "../../services/authorizationService";
import * as serviceEndPoints from "../../config/serviceEndPoints";

export const getAllLogbooks = params => logbookGateWay.get(serviceEndPoints.commonEndPoints.getAllLogbooks, { params });
export const getSchedulesByLogbookId = params => logbookGateWay.get(serviceEndPoints.commonEndPoints.getSchedulesByLogbookId, { params });
export const getTrailingSchedulesByLogbookId = params =>
    logbookGateWay.get(serviceEndPoints.commonEndPoints.getTrailingSchedulesByLogbookId, { params });
export const getScheduleDates = (params, url) => logbookGateWay.get(`${serviceEndPoints.commonEndPoints.getScheduleDates}/${url}`, { params });
export const setActivityTableWidth = () => logbookGateWay.put(serviceEndPoints.commonEndPoints.setActivityTableWidth);
export const getActivityTableWidth = () => logbookGateWay.get(serviceEndPoints.commonEndPoints.getActivityTableWidth);
export const getSurveyDetails = (id, schedule_id) =>
    logbookGateWay.get(`${serviceEndPoints.commonEndPoints.getSurveyDetails}/${id}?schedule_id=${schedule_id}`);
export const getLogbookDocuments = (id, survey_date_id, schedule_id, building_id) =>
    logbookGateWay.get(
        `${serviceEndPoints.commonEndPoints.getLogbookDocuments}/${id}/documents?schedule_id=${schedule_id}&survey_date_id=${survey_date_id}&building_id=${building_id}`
    );
export const saveActivityEvent = (survey, id) => logbookGateWay.patch(`${serviceEndPoints.commonEndPoints.saveActivityEvent}/${id}`, survey);
export const uploadDocuments = (formData, id) =>
    logbookGateWay.post(`${serviceEndPoints.commonEndPoints.uploadDocuments}/${id}/upload_documents`, formData);
export const removeAttachment = id => logbookGateWay.delete(`${serviceEndPoints.commonEndPoints.removeAttachment}/${id}/remove_document`);
export const deleteDeviceCount = id => logbookGateWay.delete(`${serviceEndPoints.commonEndPoints.deleteDeviceCount}/${id}`);
export const getActivityEventPopupDetails = (id, survey_date_id) =>
    logbookGateWay.get(
        `${serviceEndPoints.commonEndPoints.getActivityEventPopupDetails}/${id}/activity_event_schedule_popup?survey_date_id=${survey_date_id}`
    );
export const executeActivityEvent = formData =>
    logbookGateWay.post(`${serviceEndPoints.commonEndPoints.executeActivityEvent}`, {
        survey_date: formData
    });

export const modifyNa = formData =>
    logbookGateWay.patch(`${serviceEndPoints.commonEndPoints.modifyNa}`, {
        survey_date: formData
    });

export const undoNa = formData => logbookGateWay.patch(`${serviceEndPoints.commonEndPoints.undoNa}`, { survey_date: formData });

export const getAssignActivityPopupDetails = id =>
    logbookGateWay.get(`${serviceEndPoints.commonEndPoints.getAssignActivityPopupDetails}?activity_id=${id}`);
export const getAssignBuildingActivitiesPopupDetails = id =>
    logbookGateWay.get(`${serviceEndPoints.commonEndPoints.getAssignBuildingActivitiesPopupDetails}?building_id=${id}`);
export const getCreateSurveyPopupDetails = id =>
    logbookGateWay.get(`${serviceEndPoints.commonEndPoints.getCreateSurveyPopupDetails}?activity_id=${id}`);
export const getCurrentAssignments = id => logbookGateWay.get(`${serviceEndPoints.commonEndPoints.getCurrentAssignments}/${id}/assigned_buildings`);
export const assignActivityToBuilding = (activity_id, building_ids) =>
    logbookGateWay.post(`${serviceEndPoints.commonEndPoints.assignActivityToBuilding}`, { activity_id, building_ids });
export const assignClientActivityToBuilding = (building_id, activity_ids) =>
    logbookGateWay.post(`${serviceEndPoints.commonEndPoints.assignClientActivityToBuilding}`, { building_id, client_activity_ids: activity_ids });
export const createSurvey = surveyParams => logbookGateWay.post(`${serviceEndPoints.commonEndPoints.createSurvey}`, surveyParams);

export const getAssignLogbookPopupDetails = id =>
    logbookGateWay.get(`${serviceEndPoints.commonEndPoints.getAssignLogbookPopupDetails}?building_id=${id}`);
export const getCreateSurveyPopupDetailsForBuilding = id =>
    logbookGateWay.get(`${serviceEndPoints.commonEndPoints.getCreateSurveyPopupDetailsForBuilding}?building_id=${id}`);
export const getCreateSurveyPopupDetailsForBuildingActivities = id =>
    logbookGateWay.get(`${serviceEndPoints.commonEndPoints.getCreateSurveyPopupDetailsForBuildingActivities}?building_id=${id}`);
export const assignLogbookToBuilding = (building_id, logbook_ids) =>
    logbookGateWay.post(`${serviceEndPoints.commonEndPoints.assignLogbookToBuilding}`, { building_id, logbook_ids });

export const getAssignLogbookForConsultancyPopupDetails = id =>
    logbookGateWay.get(`${serviceEndPoints.commonEndPoints.getAssignLogbookForConsultancyPopupDetails}?consultancy_id=${id}`);
export const getAssignLogbookForClientPopupDetails = id =>
    logbookGateWay.get(`${serviceEndPoints.commonEndPoints.getAssignLogbookForClientPopupDetails}?client_id=${id}`);

export const assignLogbookToConsultancy = (consultancy_id, logbook_ids) =>
    logbookGateWay.patch(`${serviceEndPoints.commonEndPoints.assignLogbookToConsultancy}`, { consultancy_id, logbook_ids });
export const assignLogbookToClient = (client_id, consultancy_logbook_ids) =>
    logbookGateWay.patch(`${serviceEndPoints.commonEndPoints.assignLogbookToClient}`, { client_id, consultancy_logbook_ids });

export const getAssignActivityForConsultancyPopupDetails = id =>
    logbookGateWay.get(`${serviceEndPoints.commonEndPoints.getAssignActivityForConsultancyPopupDetails}?consultancy_id=${id}`);
export const assignActivityToConsultancy = (consultancy_id, activity_ids) =>
    logbookGateWay.patch(`${serviceEndPoints.commonEndPoints.assignActivityToConsultancy}`, { consultancy_id, activity_ids });

export const getAssignActivityForClientPopupDetails = id =>
    logbookGateWay.get(`${serviceEndPoints.commonEndPoints.getAssignActivityForClientPopupDetails}?client_id=${id}`);
export const assignActivityToClient = (client_id, activity_ids) =>
    logbookGateWay.patch(`${serviceEndPoints.commonEndPoints.assignActivityToClient}`, { client_id, consultancy_activity_ids: activity_ids });

export const exportSchedules = (params, path) =>
    logbookGateWay.get(`${serviceEndPoints.commonEndPoints.getSchedulesByLogbookId}/${path || "export_xl"}`, {
        method: "GET",
        responseType: "blob",
        params
    });
export const deleteSchedule = id => logbookGateWay.delete(`${serviceEndPoints.commonEndPoints.getSchedulesByLogbookId}/${id}`);
export const getListForCommonFilterForActivityCalender = params =>
    logbookGateWay.get(`${serviceEndPoints.commonEndPoints.getSchedulesByLogbookId}/get_list`, {
        params
    });
export const getUndoNaPopupDetails = id => logbookGateWay.get(`${serviceEndPoints.commonEndPoints.getUndoNaPopupDetails}/${id}/undo_na_popup`);
export const getAssignDeemingAgencyForfrequencyPopupDetails = id =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getFrequencies}/${id}/deeming_agency_assign_popup`);
export const assignDeemingAgencyToFrequency = (id, deeming_agency_ids) =>
    logbookGateWay.post(`${serviceEndPoints.userEndPoints.getFrequencies}/${id}/deeming_agency_assign`, { deeming_agency_ids: deeming_agency_ids });
export const getAssignFrequencyForDeemingAgencyPopupDetails = id =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getDeemingAgencies}/${id}/frequency_assign_popup`);
export const assignFrequencyToDeemingAgency = (id, deeming_agency_ids) =>
    logbookGateWay.post(`${serviceEndPoints.userEndPoints.getDeemingAgencies}/${id}/frequency_assign`, { frequency_ids: deeming_agency_ids });
export const getAssignUserForSectorPopupDetails = id => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getSector}/${id}/assign_users_popup`);
export const assignUsersToSection = (id, user_ids) =>
    logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getSector}/${id}/assign_users`, { user_ids: user_ids });
export const getAssignUserForCampusPopupDetails = id => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getCampuses}/${id}/assign_users_popup`);
export const assignUsersToCampus = (id, user_ids) =>
    logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getCampuses}/${id}/assign_users`, { user_ids: user_ids });
export const getAssignUserForBuildingPopupDetails = id =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getBuildingData}/${id}/assign_users_popup`);
export const assignUsersToBuilding = (id, user_ids) =>
    logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getBuildingData}/${id}/assign_users`, { user_ids: user_ids });
export const getAssignBuildingLogbookToUserPopupDetails = id =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getUsers}/${id}/assign_building_logbooks_popup`);
export const assignBuildingLogbookToUser = (id, user_ids) =>
    logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getUsers}/${id}/assign_building_logbooks`, { building_logbook_ids: user_ids });
export const getAssignBuildingToUserPopupDetails = id =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getUsers}/${id}/assign_buildings_popup`);
export const assignBuildingToUser = (id, building_ids) =>
    logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getUsers}/${id}/assign_buildings`, { building_ids: building_ids });
export const getAssignConsultancyToLogbookPopupDetails = id =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getLogbook}/${id}/assign_to_consultancies_popup`);
export const assignConsultancyToLogbook = (id, building_ids) =>
    logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogbook}/${id}/assign_to_consultancies`, { consultancy_ids: building_ids });
export const getAssignClientToLogbookPopupDetails = id =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getLogbook}/${id}/assign_to_clients_popup`);
export const assignClientToLogbook = (id, building_ids) =>
    logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogbook}/${id}/assign_to_clients`, { client_ids: building_ids });
export const getAssignBuildingToLogbookPopupDetails = id =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getLogbook}/${id}/assign_to_buildings_popup`);
export const assignBuildingToLogbook = (id, building_ids) =>
    logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogbook}/${id}/assign_to_buildings`, { building_ids: building_ids });
export const getLogbookCreateSurveyPopupDetails = id => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getLogbook}/${id}/create_survey_popup`);
export const createSurveyBuildingLogbook = (surveyParams, id) =>
    logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogbook}/${id}/create_survey`, surveyParams);
export const getAssignConsultancyToActivityPopupDetails = id =>
    logbookGateWay.get(`${serviceEndPoints.activityEndPoints.getActivityList}/${id}/assign_to_consultancies_popup`);
export const assignConsultancyToActivity = (id, building_ids) =>
    logbookGateWay.patch(`${serviceEndPoints.activityEndPoints.getActivityList}/${id}/assign_to_consultancies`, { consultancy_ids: building_ids });
export const getAssignClientToActivityPopupDetails = id =>
    logbookGateWay.get(`${serviceEndPoints.activityEndPoints.getActivityList}/${id}/assign_to_clients_popup`);
export const assignClientToActivity = (id, building_ids) =>
    logbookGateWay.patch(`${serviceEndPoints.activityEndPoints.getActivityList}/${id}/assign_to_clients`, { client_ids: building_ids });
export const getAssignBuildingToActivityPopupDetails = id =>
    logbookGateWay.get(`${serviceEndPoints.activityEndPoints.getActivityList}/${id}/assign_to_buildings_popup`);
export const assignBuildingToActivity = (id, building_ids) =>
    logbookGateWay.patch(`${serviceEndPoints.activityEndPoints.getActivityList}/${id}/assign_to_buildings`, { building_ids: building_ids });
export const getActivityCreateSurveyPopupDetails = id =>
    logbookGateWay.get(`${serviceEndPoints.activityEndPoints.getActivityList}/${id}/create_survey_popup`);
export const createSurveyBuildingActivity = (surveyParams, id) =>
    logbookGateWay.patch(`${serviceEndPoints.activityEndPoints.getActivityList}/${id}/create_survey`, surveyParams);
export const getAssignProcedureToActivityPopupDetails = id =>
    logbookGateWay.get(`${serviceEndPoints.activityEndPoints.getActivityList}/${id}/assign_procedures_popup`);
export const assignProcedureToActivity = (id, procedure_ids) =>
    logbookGateWay.patch(`${serviceEndPoints.activityEndPoints.getActivityList}/${id}/assign_procedures`, { procedure_ids: procedure_ids });

export const getUnReadNotifications = login => logbookGateWay.get(`${serviceEndPoints.commonEndPoints.getUnReadNotifications}?login=${login}`);
export const deleteUnReadNotifications = id => logbookGateWay.delete(`${serviceEndPoints.commonEndPoints.deleteUnReadNotifications}/${id}`);
export const readNotification = id => logbookGateWay.patch(`${serviceEndPoints.commonEndPoints.readNotification}/${id}/read`);

export const getFilterDropdownData = (params, path) =>
    logbookGateWay.get(`${serviceEndPoints.commonEndPoints.getFilterDropdownData}/${path}`, { params });

export const getDeviceDocuments = (id,asset_id) => {

    if(asset_id){
       return  logbookGateWay.get(`${serviceEndPoints.commonEndPoints.getDeviceDocuments}?building_activity_id=${id}&asset_id=${asset_id}`)
    }else{
        return logbookGateWay.get(`${serviceEndPoints.commonEndPoints.getDeviceDocuments}?building_activity_id=${id}`)
    }
    }
export const saveDeviceCount = params => logbookGateWay.post(`${serviceEndPoints.commonEndPoints.saveDeviceCount}`, params);
export const setAuditMode = params => logbookGateWay.patch(`${serviceEndPoints.commonEndPoints.setAuditMode}`, params);
export const resetPassword = (params,id) => logbookGateWay.patch(`${serviceEndPoints.commonEndPoints.resetPassword}/${id}/update_password`, params);

export const getGLTDetails = survey_date_id =>
    logbookGateWay.get(`${serviceEndPoints.commonEndPoints.getGLTDetails}?survey_date_id=${survey_date_id}`);

export const getPreviousSurveys = survey_date_id =>
    logbookGateWay.get(`${serviceEndPoints.commonEndPoints.getPreviousSurveys}?survey_date_id=${survey_date_id}`);

export const getPreviousLocations = survey_date_id =>
    logbookGateWay.get(`${serviceEndPoints.commonEndPoints.getPreviousLocations}?survey_date_id=${survey_date_id}`);

export const getPreviousDays = survey_date_id =>
    logbookGateWay.get(`${serviceEndPoints.commonEndPoints.getPreviousDays}?survey_date_id=${survey_date_id}`);
export const fetchFormSettings = id => logbookGateWay.get(`${serviceEndPoints.commonEndPoints.fetchFormSettings}/${id}/fetch_form_settings`);

export const checkBuildingCount = (params, path) => logbookGateWay.get(`${serviceEndPoints.commonEndPoints.checkBuildingCount}/${path}`, { params });
