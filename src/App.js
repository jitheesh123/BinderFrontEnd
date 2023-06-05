import React from "react";
import { Router, Switch } from "react-router-dom";

import history from "./config/history";
import PrivateRoute from "./components/common/components/PrivateRoute";
import PublicRoute from "./components/common/components/publicRoute";

import LoginForm from "./components/login/index";
import Logbooks from "./components/logbooks/index";

import Consultancy from "./components/settings/consultancy/index";
import AddConsultancy from "./components/settings/consultancy/consultancyForm";
import editConsultancy from "./components/settings/consultancy/consultancyForm";

import Clients from "./components/settings/clients/index";
import AddClients from "./components/settings/clients/components/clientForm";
import editClients from "./components/settings/clients/components/clientForm";

import Sectors from "./components/settings/sector/index";
import addSector from "./components/settings/sector/components/sectorForm";

import Campuses from "./components/settings/campuses/index";
import addCampus from "./components/settings/campuses/components/campusForm";
import editCampus from "./components/settings/campuses/components/campusForm";

import building from "./components/settings/building/index";
import addBuilding from "./components/settings/building/buildingForm";
import editBuilding from "./components/settings/building/buildingForm";

import logbook from "./components/settings/logbook/index";
import addLogbook from "./components/settings/logbook/components/logbookForm";

import activity from "./components/settings/activity/index";
import addActivity from "./components/settings/activity/activityForm";
import editActivity from "./components/settings/activity/activityForm";

import email from "./components/email/index";

import UserPermission from "./components/settings/userPermission/index";

import ActivityCalendar from "./components/common/components/annualCalendar/ActivityCalendar";
import TrailingCalendar from "./components/common/components/trailingCalendar/TrailingCalendar";
import ComingSoon from "./components/common/components/ComingSoon";

import DeemingAgency from "./components/settings/deemingAgency/index";
import AddDeemingAgency from "./components/settings/deemingAgency/deemingAgencyForm";
import editDeemingAgency from "./components/settings/deemingAgency/deemingAgencyForm";

import ActivityCalendarAll from "./components/common/components/ActivityCalenderAll";

import ConsultancyLogbook from "./components/settings/consultancyLogbook/index";
import ConsultancyLogbookForm from "./components/settings/consultancyLogbook/components/logbookForm";

import ConsultancyActivity from "./components/settings/consultancyActivity/index";

import ClientLogbook from "./components/settings/clientLogbook/index";

import ClientActivity from "./components/settings/clientActivity/index";

import BuildingLogbook from "./components/settings/buildingLogbook/index";

import BuildingActivity from "./components/settings/buildingActivity/index";

import Reports from "./components/reports/emailReports/index";

import ActivityConsultancy from "./components/settings/activityConsultancy/index";

import LogbookConsultancy from "./components/settings/logbookConsultancy/index";

import ActivityClient from "./components/settings/activityClient/index";

import LogbookClient from "./components/settings/logbookClient/index";

import ActivityBuilding from "./components/settings/activityBuilding/index";
import LogbookBuilding from "./components/settings/logbookBuilding/index";
import Frequency from "./components/settings/frequency/index";
import FrequencyForm from "./components/settings/frequency/frequencyForm";
import DeemingAgencyFrequency from "./components/settings/deemingAgencyFrequency/index";
import DeemingAgencyFrequencyForm from "./components/settings/deemingAgencyFrequency/frequencyForm";

import Users from "./components/settings/users/index";

import userForm from "./components/settings/users/userForm";

import UserPermissions from "./components/settings/userPermission/index";
import userPermissionForm from "./components/settings/userPermission/userPermissionForm";

import Templates from "./components/settings/template/index";
import TemplateForm from "./components/settings/template/templateForm";

import SectorConsultancyUser from "./components/settings/sectorUsers/index";
import CampusUser from "./components/settings/campusUsers/index";
import BuildingUser from "./components/settings/buildingUsers/index";
import BuildingType from "./components/settings/buildingType/index";
import BuildingTypeForm from "./components/settings/buildingType/buildingTypeForm";
import Notification from "./components/settings/notification/index";
import NotificationForm from "./components/settings/notification/notificationForm";
import UserBuilding from "./components/settings/userBuilding/index";
import UserBuildingLogbook from "./components/settings/userBuildingLogbook/index";
import Procedure from "./components/settings/procedures/index";
import ActivityProcedure from "./components/settings/activityProcedure/index";
import Form from "./components/settings/forms/index";
import Dashboard from "./components/dashboard/index";
import Floor from "./components/settings/floor/index";
import FloorForm from "./components/settings/floor/floorForm";
import AssetCondition from "./components/settings/assetCondition/index";
import AssetConditionForm from "./components/settings/assetCondition/assetConditionForm";
import Asset from "./components/settings/asset/index";
import AssetForm from "./components/settings/asset/components/assetForm";
import FormType from "./components/settings/formType/index";
import buildingEditShift from "./components/settings/buildingActivity/buildingEditShift";
import clientEditShift from "./components/settings/clientActivity/components/clientEditShift";
import Documents from "./components/settings/Documents"
import documentForm from "./components/settings/Documents/userForm";
import globalReport from "./components/globalReport";

function App() {
    return (
        <Router history={history}>
            <Switch>
                <PublicRoute exact path="/" component={LoginForm} />

                <PublicRoute exact path="/login" component={LoginForm} />
                <PrivateRoute exact path="/logbooksmain" component={Logbooks} />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />

                <PrivateRoute exact path="/consultancies" component={Consultancy} />
                <PrivateRoute exact path="/consultancy/:section" component={AddConsultancy} />
                <PrivateRoute exact path="/consultancy/:section/:id" component={editConsultancy} />
                <PrivateRoute exact path="/consultancy/:section/:id/:tab" component={Consultancy} />

                <PrivateRoute exact path="/clients" component={Clients} />
                <PrivateRoute exact path="/client/:section" component={AddClients} />
                <PrivateRoute exact path="/client/:section/:id" component={editClients} />
                <PrivateRoute exact path="/client/:section/:id/:tab" component={Clients} />

                <PrivateRoute exact path="/buildings" component={building} />
                <PrivateRoute exact path="/building/:section" component={addBuilding} />
                <PrivateRoute exact path="/building/:section/:id" component={editBuilding} />
                <PrivateRoute exact path="/building/:section/:id/:tab" component={building} />

                <PrivateRoute exact path="/sectors" component={Sectors} />
                <PrivateRoute exact path="/sector/:section" component={addSector} />
                <PrivateRoute exact path="/sector/:section/:id" component={addSector} />
                <PrivateRoute exact path="/sector/:section/:id/:tab" component={Sectors} />

                <PrivateRoute exact path="/campuses" component={Campuses} />
                <PrivateRoute exact path="/campus/:section" component={addCampus} />
                <PrivateRoute exact path="/campus/:section/:id" component={editCampus} />
                <PrivateRoute exact path="/campus/:section/:id/:tab" component={Campuses} />

                <PrivateRoute exact path="/logbooks" component={logbook} />
                <PrivateRoute exact path="/logbook/:section" component={addLogbook} />
                <PrivateRoute exact path="/logbook/:section/:id" component={addLogbook} />
                <PrivateRoute exact path="/logbook/:section/:id/:tab" component={logbook} />

                <PrivateRoute exact path="/activities" component={activity} />
                <PrivateRoute exact path="/activity/:section" component={addActivity} />
                <PrivateRoute exact path="/activity/:section/:id" component={editActivity} />
                <PrivateRoute exact path="/activity/:section/:id/:tab" component={activity} />

                <PrivateRoute exact path="/emails" component={email} />
                <PrivateRoute exact path="/emails/:section" component={email} />
                <PrivateRoute exact path="/emails/:section/:id" component={email} />

                <PrivateRoute exact path="/deeming_agencies" component={DeemingAgency} />
                <PrivateRoute exact path="/deeming_agency/:section" component={AddDeemingAgency} />
                <PrivateRoute exact path="/deeming_agency/:section/:id" component={editDeemingAgency} />
                <PrivateRoute exact path="/deeming_agency/:section/:id/:tab" component={DeemingAgency} />

                <PrivateRoute exact path="/userPermission" component={UserPermission} />

                <PrivateRoute exact path="/trailingCalendar" component={TrailingCalendar} />
                <PrivateRoute exact path="/consultancyLogbook/:section" component={ConsultancyLogbookForm} />
                <PrivateRoute exact path="/consultancyLogbook/:section/:id" component={ConsultancyLogbookForm} />
                <PrivateRoute exact path="/consultancyLogbook/:section/:id/:tab" component={ConsultancyLogbook} />

                <PrivateRoute exact path="/consultancyActivity/:section/:id/:tab" component={ConsultancyActivity} />

                <PrivateRoute exact path="/clientLogbook/:section/:id/:tab" component={ClientLogbook} />

                <PrivateRoute exact path="/clientActivity/:section/:id/:tab" component={ClientActivity} />
                <PrivateRoute exact path="/clientActivity/:section/:id" component={clientEditShift} />

                <PrivateRoute exact path="/buildingLogbook/:section/:id/:tab" component={BuildingLogbook} />

                <PrivateRoute exact path="/buildingActivity/:section/:id/:tab" component={BuildingActivity} />
                <PrivateRoute exact path="/buildingActivity/:section/:id" component={buildingEditShift} />

                <PrivateRoute exact path="/activityConsultancy/:section/:id/:tab" component={ActivityConsultancy} />

                <PrivateRoute exact path="/activityProcedure/:section/:id/:tab" component={ActivityProcedure} />
                {/* <PrivateRoute exact path="/activityForm/:section/:id/:tab" component={ActivityForm} /> */}

                <PrivateRoute exact path="/activityClient/:section/:id/:tab" component={ActivityClient} />

                <PrivateRoute exact path="/logbookConsultancy/:section/:id/:tab" component={LogbookConsultancy} />
                <PrivateRoute exact path="/logbookClient/:section/:id/:tab" component={LogbookClient} />
                <PrivateRoute exact path="/activityBuilding/:section/:id/:tab" component={ActivityBuilding} />
                <PrivateRoute exact path="/logbookBuilding/:section/:id/:tab" component={LogbookBuilding} />

                <PrivateRoute exact path="/buildingActivities" component={BuildingActivity} />

                <PrivateRoute exact path="/activityCalendar" component={ActivityCalendar} />
                <PrivateRoute exact path="/allActivityCalendar" component={ActivityCalendarAll} />
                <PrivateRoute exact path="/reports/:section" component={Reports} />
                <PrivateRoute exact path="/global-report" component={globalReport} />

                <PrivateRoute exact path="/frequencies" component={Frequency} />
                <PrivateRoute exact path="/frequency/:section" component={FrequencyForm} />
                <PrivateRoute exact path="/frequency/:section/:id" component={FrequencyForm} />
                <PrivateRoute exact path="/frequency/:section/:id/:tab" component={Frequency} />

                <PrivateRoute exact path="/deemingAgencyFrequency/:section/:id/:tab" component={DeemingAgencyFrequency} />
                <PrivateRoute exact path="/deemingAgencyFrequency/:section" component={DeemingAgencyFrequencyForm} />
                <PrivateRoute exact path="/deemingAgencyFrequency/:section/:id" component={DeemingAgencyFrequencyForm} />

                <PrivateRoute exact path="/users" component={Users} />
                <PrivateRoute exact path="/user/:section" component={userForm} />
                <PrivateRoute exact path="/user/:section/:id" component={userForm} />
                <PrivateRoute exact path="/user/:section/:id/:tab" component={Users} />

                <PrivateRoute exact path="/templates" component={Templates} />
                <PrivateRoute exact path="/template/:section" component={TemplateForm} />
                <PrivateRoute exact path="/template/:section/:id" component={TemplateForm} />
                <PrivateRoute exact path="/template/:section/:id/:tab" component={Templates} />

                <PrivateRoute exact path="/userpermissions" component={UserPermissions} />
                <PrivateRoute exact path="/userpermission/:section" component={userPermissionForm} />
                <PrivateRoute exact path="/userpermission/:section/:id" component={userPermissionForm} />
                <PrivateRoute exact path="/userpermission/:section/:id/:tab" component={UserPermissions} />

                <PrivateRoute exact path="/sectoruser/:section/:id/:tab" component={SectorConsultancyUser} />
                <PrivateRoute exact path="/campususer/:section/:id/:tab" component={CampusUser} />
                <PrivateRoute exact path="/buildinguser/:section/:id/:tab" component={BuildingUser} />

                <PrivateRoute exact path="/building_types" component={BuildingType} />
                <PrivateRoute exact path="/building_type/:section" component={BuildingTypeForm} />
                <PrivateRoute exact path="/building_type/:section/:id" component={BuildingTypeForm} />
                <PrivateRoute exact path="/building_type/:section/:id/:tab" component={BuildingType} />

                <PrivateRoute exact path="/notifications" component={Notification} />
                <PrivateRoute exact path="/notification/:section" component={NotificationForm} />
                <PrivateRoute exact path="/notification/:section/:id" component={NotificationForm} />
                <PrivateRoute exact path="/notification/:section/:id/:tab" component={Notification} />

                <PrivateRoute exact path="/userBuilding/:section/:id/:tab" component={UserBuilding} />
                <PrivateRoute exact path="/userBuildingLogbook/:section/:id/:tab" component={UserBuildingLogbook} />

                <PrivateRoute exact path="/procedures" component={Procedure} />
                <PrivateRoute exact path="/forms" component={Form} />

                <PrivateRoute exact path="/floors" component={Floor} />
                <PrivateRoute exact path="/floor/:section" component={FloorForm} />
                <PrivateRoute exact path="/floor/:section/:id" component={FloorForm} />
                <PrivateRoute exact path="/floor/:section/:id/:tab" component={Floor} />

                <PrivateRoute exact path="/assetConditions" component={AssetCondition} />
                <PrivateRoute exact path="/assetCondition/:section" component={AssetConditionForm} />
                <PrivateRoute exact path="/assetCondition/:section/:id" component={AssetConditionForm} />
                <PrivateRoute exact path="/assetCondition/:section/:id/:tab" component={AssetCondition} />

                <PrivateRoute exact path="/assets" component={Asset} />
                <PrivateRoute exact path="/asset/:section" component={AssetForm} />
                <PrivateRoute exact path="/asset/:section/:id" component={AssetForm} />
                <PrivateRoute exact path="/asset/:section/:id/:tab" component={Asset} />

                <PrivateRoute exact path="/form_types" component={FormType} />

                <PrivateRoute exact path="/document" component={Documents} />
                <PrivateRoute exact path="/document/:section" component={documentForm} />
                <PrivateRoute exact path="/document/:section/:id" component={documentForm} />
                <PrivateRoute exact path="/document/:section/:id/:tab" component={Documents} />

                <PrivateRoute exact path="/comingSoon" component={ComingSoon} />
            </Switch>
        </Router>
    );
}

export default App;
