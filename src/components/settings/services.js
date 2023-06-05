import { logbookGateWay } from "../../services/authorizationService";
import * as serviceEndPoints from "../../config/serviceEndPoints";

export const getConsultancyDropdown = () => logbookGateWay.get(serviceEndPoints.userEndPoints.getConsultancyDropdown);
export const getClientDropdown = params => logbookGateWay.get(serviceEndPoints.userEndPoints.getClientDropdown, { params });
export const getSectorDropdown = params => logbookGateWay.get(serviceEndPoints.userEndPoints.getSectorDropdown, { params });
export const getCampusesDropdown = params => logbookGateWay.get(serviceEndPoints.userEndPoints.getCampusesDropdown, { params });
export const getLogbookDropdown = params => logbookGateWay.get(serviceEndPoints.commonEndPoints.getLogbookDropdown, { params });
export const getFrequencyDropdown = params => logbookGateWay.get(serviceEndPoints.commonEndPoints.getFrequencyDropdown, { params });
export const getDeemingAgencyDropdown = () => logbookGateWay.get(serviceEndPoints.commonEndPoints.getDeemingAgencyDropdown);
export const getTemplateDropdown = () => logbookGateWay.get(serviceEndPoints.commonEndPoints.getTemplateDropdown);
export const getRoleDropdown = () => logbookGateWay.get(serviceEndPoints.userEndPoints.getRoleDropdown);
export const getBuildingTypeDropdown = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getBuildingTypes}/building_types_dropdown`, { params });
export const getTemplateInitialValues = () => logbookGateWay.get(serviceEndPoints.commonEndPoints.getTemplateInitialValues);
export const getBuildingsDropdown = params => logbookGateWay.get(`${serviceEndPoints.buildingEndPoints.getBuilding}/buildings_dropdown`, { params });
export const getAssetConditionsDropdown = params =>
    logbookGateWay.get(`${serviceEndPoints.assetConditionEndPoints.getAssetConditions}/asset_conditions_dropdown`, { params });
export const getFloorsDropdown = params => logbookGateWay.get(`${serviceEndPoints.floorEndPoints.getFloors}/floors_dropdown`, { params });
export const getEventFormDropDown = () => logbookGateWay.get(`${serviceEndPoints.formTypeEndPoints.getAllFormTypes}/event_forms`);
