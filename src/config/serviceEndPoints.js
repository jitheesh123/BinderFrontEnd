export const userEndPoints = {
    loginUser: "/oauth/token",
    getConsultancies: "/api/v1/consultancies",
    getClients: "/api/v1/clients",
    getSector: "/api/v1/sectors",
    getCampuses: "/api/v1/campus",
    getConsultancyDropdown: "/api/v1/consultancies/consultancies_dropdown",
    getClientDropdown: "/api/v1/clients/clients_dropdown",
    getSectorDropdown: "/api/v1/sectors/sectors_dropdown",
    getBuildingData: "/api/v1/buildings",
    getCampusesDropdown: "/api/v1/campus/campus_dropdown",
    getLogbook: "/api/v1/logbooks",
    getListForCommonFilterForLogbook: "/api/v1/logbooks",
    getLogs: "/api/v1/logs",
    getDeemingAgencies: "/api/v1/deeming_agencies",
    getConsultancyLogbook: "/api/v1/consultancy_logbooks",
    getConsultancyActivity: "/api/v1/consultancy_activities",
    getClientLogbook: "/api/v1/client_logbooks",
    getClientActivity: "/api/v1/client_activities",
    getBuildingLogbook: "/api/v1/building_logbooks",
    getBuildingActivity: "/api/v1/building_activities",
    getReports: "/api/v1/reports",
    getActivityConsultancies: "/api/v1/consultancy_activities",
    getLogbookConsultancies: "/api/v1/consultancy_logbooks",
    getActivityClients: "/api/v1/client_activities",
    getActivityBuildingData: "/api/v1/building_activities",
    getLogbookClients: "/api/v1/client_logbooks",
    getLogbookBuildingData: "/api/v1/building_logbooks",
    getFrequencies: "/api/v1/frequencies",
    getDeemingAgencyFrequency: "api/v1/deeming_agency_frequencies",
    getUsers: "/api/v1/users",
    getSectorUsers: "/api/v1/sector_users",
    getRoleDropdown: "/api/v1/users/roles_dropdown",
    getCampusUsers: "/api/v1/campus_users",
    getBuildingUsers: "/api/v1/building_users",
    getBuildingTypes: "/api/v1/building_types",
    getUserBuilding: "/api/v1/user_buildings",
    getUserBuildingLogbook: "/api/v1/building_logbook_users",
    getActivityProcedure: "/api/v1/activity_procedures",
    getBuildingEditShift: "api/v1/building_activities",
    getClientEditShift: "/api/v1/client_activities",

    
};

export const procedureEndPoints = {
    getProcedures: "/api/v1/procedures",
    removeAttachment: "/api/v1/procedures"
};

export const formEndPoints = {
    getForms: "/api/v1/forms",
    removeAttachment: "/api/v1/forms",
    getActivityForms: "/api/v1/activity_forms"
};

export const userPermissionEndPoints = {
    getUserPermissions: "/api/v1/permissions",
    addUserPermission: "/api/v1/permissions",
    editUserPermission: "/api/v1/permissions",
    deleteUserPermission: "/api/v1/permissions",
    getListForCommonFilterForUserPermission: "/api/v1/permissions",
    getUserPermissionTemplates: "/api/v1/permissions/templates",
    getUserListForPermissions: "/api/v1/permissions/assign_users"
};

export const notificationEndPoints = {
    getNotifications: "/api/v1/notifications",
    getLogs: "/api/v1/logs"
};

export const templateEndPoints = {
    getTemplates: "/api/v1/permissions/templates",
    addTemplate: "/api/v1/permissions",
    getTemplatesById: "/api/v1/permissions",
    editTemplate: "/api/v1/permissions",
    deleteTemplate: "/api/v1/permissions",
    getListForCommonFilterForTemplate: "/api/v1/permissions/templates",
    exportTemplate: "/api/v1/permissions"
};

export const activityEndPoints = {
    getActivityList: "/api/v1/activities",
    addActivity: "/api/v1/activities",
    editActivity: "/api/v1/activities",
    deleteActivity: "/api/v1/activities",
    getListForCommonFilterForActivity: "/api/v1/activities",
    getLinkedActivityList: "/api/v1/activities/linkable_activities_dropdown",
    getCategoryDropdown: "/api/v1/activities/categories",
    pushActivity:"/api/v1/activities"

};

export const commonEndPoints = {
    getLogbookDropdown: "/api/v1/logbooks/logbooks_dropdown",
    getFrequencyDropdown: "/api/v1/deeming_agency_frequencies/frequencies_dropdown",
    getAllLogbooks: "/api/v1/dashboards/logbooks",
    getSchedulesByLogbookId: "/api/v1/schedules",
    getTrailingSchedulesByLogbookId: "/api/v1/schedules/trailing",
    getScheduleDates: "/api/v1/schedules",
    getActivityEventPopupDetails: "/api/v1/schedules",
    setActivityTableWidth: "/api/v1/activity_table_width",
    getActivityTableWidth: "/api/v1/activity_table_width",
    getSurveyDetails: "/api/v1/surveys",
    saveActivityEvent: "/api/v1/surveys",
    getLogbookDocuments: "/api/v1/logbooks",
    uploadDocuments: "/api/v1/logbooks",
    removeAttachment: "/api/v1/surveys",
    executeActivityEvent: "/api/v1/survey_dates",
    modifyNa: "/api/v1/survey_dates/modify_na",
    undoNa: "/api/v1/survey_dates/undo_na",
    getDeemingAgencyDropdown: "/api/v1/deeming_agencies/deeming_agencies_dropdown",

    getAssignActivityPopupDetails: "/api/v1/building_activities/assign_activity_popup",
    getAssignBuildingActivitiesPopupDetails: "/api/v1/building_activities/assign_client_activities_popup",
    getCreateSurveyPopupDetails: "/api/v1/building_activities/create_survey_popup",
    getCurrentAssignments: "/api/v1/activities",
    assignActivityToBuilding: "/api/v1/building_activities",
    assignClientActivityToBuilding: "/api/v1/building_activities",
    createSurvey: "/api/v1/schedules",

    getAssignLogbookPopupDetails: "/api/v1/building_logbooks/assign_logbooks_popup",
    getCreateSurveyPopupDetailsForBuilding: "/api/v1/building_logbooks/create_survey_popup",
    getCreateSurveyPopupDetailsForBuildingActivities: "/api/v1/building_activities/create_survey_popup",
    assignLogbookToBuilding: "/api/v1/building_logbooks",

    getAssignLogbookForConsultancyPopupDetails: "/api/v1/consultancies/assign_logbooks_popup",
    getAssignLogbookForClientPopupDetails: "/api/v1/clients/assign_consultancy_logbooks_popup",
    assignLogbookToConsultancy: "/api/v1/consultancies/assign_logbooks",
    assignLogbookToClient: "/api/v1/clients/assign_consultancy_logbooks",
    getUndoNaPopupDetails: "/api/v1/schedules",

    getAssignActivityForConsultancyPopupDetails: "/api/v1/consultancies/assign_activities_popup",
    assignActivityToConsultancy: "/api/v1/consultancies/assign_activities",

    getAssignActivityForClientPopupDetails: "/api/v1/clients/assign_consultancy_activities_popup",
    assignActivityToClient: "/api/v1/clients/assign_consultancy_activities",

    getTemplateDropdown: "/api/v1/permissions/templates_dropdown",
    getTemplateInitialValues: "/api/v1/permissions/initial_values",

    getUnReadNotifications: "/api/v1/notifications/unread",
    deleteUnReadNotifications: "/api/v1/notifications",
    readNotification: "/api/v1/notifications",

    getFilterDropdownData: "/api/v1/master_filters",
    getDeviceDocuments: "/api/v1/device_documents",
    saveDeviceCount: "/api/v1/device_documents",
    setAuditMode: "/api/v1/users/set_audit_mode",
    resetPassword: "/api/v1/users",
    getGLTDetails: "/api/v1/surveys/annual_load_bank_event_details",
    getPreviousSurveys: "/api/v1/surveys/previous_fire_drills",
    getPreviousLocations: "/api/v1/surveys/previous_locations",
    getPreviousDays: "/api/v1/surveys/previous_days",
    checkBuildingCount: "/api/v1/schedules",
    fetchFormSettings: "/api/v1/schedules",
    deleteDeviceCount: "/api/v1/device_documents"
};

export const dashboardEndPoints = {
    getAllLogbooks: "/api/v1/dashboards/logbooks",
    getDashboardData: "/api/v1/dashboards"
};

export const activityFormEndPoints = {
    getActivityForm: "/api/v1/activity_forms"
};

export const emailEndPoints = {
    getUserEmail: "/api/v1/emails",
    sendEmail: "/api/v1",
    sendMailWithAttachment: "/api/v1/email_logs/compose",
    getSentMails: "/api/v1/email_logs/sent",
    getAllSentMails: "/api/v1/email_logs/all_sent",
    getInboxMails: "/api/v1/email_logs/inbox",
    getEmailDetails: "/api/v1/email_logs"
};

export const floorEndPoints = {
    getFloors: "/api/v1/floors",
    getLogs: "/api/v1/logs"
};

export const buildingEndPoints = {
    getBuilding: "/api/v1/buildings"
};

export const assetConditionEndPoints = {
    getAssetConditions: "/api/v1/asset_conditions"
};

export const assetEndPoints = {
    getAssets: "/api/v1/assets",
    getCreateSurveyPopupDetailsForAssetLogbookScheduling: "/api/v1/assets",
    getCreateSurveyPopupDetailsForAssetActivitiesScheduling: "/api/v1/assets",
    createSurvey: "/api/v1/assets"
};

export const formTypeEndPoints = {
    getAllFormTypes: "/api/v1",
    fetchEventFormData: "/api/v1",
    updateEventForms: "/api/v1"
};

export const logbookEndPoints = {
    getLogbookTypeDropdown: "/api/v1/logbooks/types"
};

export const documentEndPoints = {
    getAllDocument: "/api/v1/logbook_documents",
};
