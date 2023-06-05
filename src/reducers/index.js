import { combineReducers } from "redux";
import loginReducer from "../components/login/reducers";
import logbooksReducer from "../components/logbooks/reducers";
import consultancyReducer from "../components/settings/consultancy/reducers";
import clientReducer from "../components/settings/clients/reducers";
import sectorReducer from "../components/settings/sector/reducers";
import campusReducer from "../components/settings/campuses/reducers";
import settingsCommonReducer from "../components/settings/reducers";
import buildingReducer from "../components/settings/building/reducers";
import logbookReducer from "../components/settings/logbook/reducers";
import activityReducer from "../components/settings/activity/reducers";
import commonReducer from "../components/common/reducers";
import deemingAgencyReducer from "../components/settings/deemingAgency/reducers";
import consultancyLogbookReducer from "../components/settings/consultancyLogbook/reducers";
import consultancyActivityReducer from "../components/settings/consultancyActivity/reducers";
import clientLogbookReducer from "../components/settings/clientLogbook/reducers";
import clientActivityReducer from "../components/settings/clientActivity/reducers";
import buildingLogbookReducer from "../components/settings/buildingLogbook/reducers";
import buildingActivityReducer from "../components/settings/buildingActivity/reducers";
import reportReducer from "../components/reports/emailReports/reducers";
import activityConsultancyReducer from "../components/settings/activityConsultancy/reducers";
import logbookConsultancyReducer from "../components/settings/logbookConsultancy/reducers";
import activityClientReducer from "../components/settings/activityClient/reducers";
import logbookClientReducer from "../components/settings/logbookClient/reducers";
import activityBuildingReducer from "../components/settings/activityBuilding/reducers";
import logbookBuildingReducer from "../components/settings/logbookBuilding/reducers";
import frequencyReducer from "../components/settings/frequency/reducers";
import deemingAgencyFrequencyReducer from "../components/settings/deemingAgencyFrequency/reducers";
import userReducer from "../components/settings/users/reducers";
import userPermissionReducer from "../components/settings/userPermission/reducers";
import templateReducer from "../components/settings/template/reducers";
import sectorUserReducer from "../components/settings/sectorUsers/reducers";
import campusUserReducer from "../components/settings/campusUsers/reducers";
import buildingUserReducer from "../components/settings/buildingUsers/reducers";
import buildingTypeReducer from "../components/settings/buildingType/reducers";
import notificationReducer from "../components/settings/notification/reducers";
import userBuildingReducer from "../components/settings/userBuilding/reducers";
import userBuildingLogbookReducer from "../components/settings/userBuildingLogbook/reducers";
import procedureReducer from "../components/settings/procedures/reducers";
import activityProcedureReducer from "../components/settings/activityProcedure/reducers";
import formReducer from "../components/settings/forms/reducers";
// import activityFormReducer from "../components/settings/activityForm/reducers";
import dashboardReducer from "../components/dashboard/reducers";
import smartReportReducer from "../components/smartReports/reducers";
import activityFormReducer from "../components/settings/activityForm/reducers";
import emailReducer from "../components/email/reducers";
import floorReducer from "../components/settings/floor/reducers";
import assetConditionReducer from "../components/settings/assetCondition/reducers";
import assetReducer from "../components/settings/asset/reducers";
import formTypeReducer from "../components/settings/formType/reducers";
import documentReducer from "../components/settings/Documents/reducers"

const rootReducer = combineReducers({
    loginReducer,
    logbooksReducer,
    consultancyReducer,
    clientReducer,
    sectorReducer,
    campusReducer,
    settingsCommonReducer,
    buildingReducer,
    logbookReducer,
    activityReducer,
    commonReducer,
    deemingAgencyReducer,
    consultancyLogbookReducer,
    consultancyActivityReducer,
    clientLogbookReducer,
    clientActivityReducer,
    buildingLogbookReducer,
    buildingActivityReducer,
    reportReducer,
    activityConsultancyReducer,
    logbookConsultancyReducer,
    activityClientReducer,
    logbookClientReducer,
    activityBuildingReducer,
    logbookBuildingReducer,
    frequencyReducer,
    deemingAgencyFrequencyReducer,
    userReducer,
    userPermissionReducer,
    templateReducer,
    sectorUserReducer,
    campusUserReducer,
    buildingUserReducer,
    buildingTypeReducer,
    userBuildingReducer,
    userBuildingLogbookReducer,
    procedureReducer,
    activityProcedureReducer,
    formReducer,
    notificationReducer,
    dashboardReducer,
    smartReportReducer,
    activityFormReducer,
    emailReducer,
    floorReducer,
    assetConditionReducer,
    assetReducer,
    formTypeReducer,
    documentReducer
});

export default rootReducer;
