import * as actionTypes from "./constants";

const initialState = {
    consultancyDropdownData: {},
    clientDropdownData: {},
    sectorDropdownData: {},
    campusDropdownData: {},
    getFrequencyDropdownResponse: {},
    logbookDropdownData: {},
    deemingAgencyDropdownData: {},
    roleDropdownData: {},
    buildingTypeDropdownData: {},
    getTemplateDropdownResponse: {},
    getTemplateInitialValuesResponse: {},
    buildingDropdownData: {},
    assetConditionDropdownData: {},
    floorDropdownData: {},
    getEventFormDropDownData: {}
};

const conmmonRedRes = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_CONSULTANCY_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_CONSULTANCY_DROPDOWN_SUCCESS:
            return {
                ...state,
                consultancyDropdownData: { success: true, ...action.response }
            };
        case actionTypes.GET_CONSULTANCY_DROPDOWN_FAILURE:
            return {
                ...state,
                consultancyDropdownData: { success: false, ...action.error }
            };

        case actionTypes.GET_CLIENTS_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_CLIENTS_DROPDOWN_SUCCESS:
            return {
                ...state,
                clientDropdownData: { success: true, ...action.response }
            };
        case actionTypes.GET_CLIENTS_DROPDOWN_FAILURE:
            return {
                ...state,
                clientDropdownData: { success: false, ...action.error }
            };

        case actionTypes.GET_SECTOR_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_SECTOR_DROPDOWN_SUCCESS:
            return {
                ...state,
                sectorDropdownData: { success: true, ...action.response }
            };
        case actionTypes.GET_SECTOR_DROPDOWN_FAILURE:
            return {
                ...state,
                sectorDropdownData: { success: false, ...action.error }
            };

        case actionTypes.GET_CAMPUSES_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_CAMPUSES_DROPDOWN_SUCCESS:
            return {
                ...state,
                campusDropdownData: { success: true, ...action.response }
            };
        case actionTypes.GET_CAMPUSES_DROPDOWN_FAILURE:
            return {
                ...state,
                campusDropdownData: { success: false, ...action.error }
            };

        case actionTypes.GET_FREQUENCY_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_FREQUENCY_DROPDOWN_SUCCESS:
            return {
                ...state,
                getFrequencyDropdownResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_FREQUENCY_DROPDOWN_FAILURE:
            return {
                ...state,
                getFrequencyDropdownResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_LOGBOOK_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_LOGBOOK_DROPDOWN_SUCCESS:
            return {
                ...state,
                logbookDropdownData: { success: true, ...action.response }
            };
        case actionTypes.GET_LOGBOOK_DROPDOWN_FAILURE:
            return {
                ...state,
                logbookDropdownData: { success: false, ...action.error }
            };
        case actionTypes.GET_DEEMING_AGENCY_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_DEEMING_AGENCY_DROPDOWN_SUCCESS:
            return {
                ...state,
                deemingAgencyDropdownData: { success: true, ...action.response }
            };
        case actionTypes.GET_DEEMING_AGENCY_DROPDOWN_FAILURE:
            return {
                ...state,
                deemingAgencyDropdownData: { success: false, ...action.error }
            };
        case actionTypes.GET_ROLE_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ROLE_DROPDOWN_SUCCESS:
            return {
                ...state,
                roleDropdownData: { success: true, ...action.response }
            };
        case actionTypes.GET_ROLE_DROPDOWN_FAILURE:
            return {
                ...state,
                roleDropdownData: { success: false, ...action.error }
            };

        case actionTypes.GET_BUILDING_TYPE_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_BUILDING_TYPE_DROPDOWN_SUCCESS:
            return {
                ...state,
                buildingTypeDropdownData: { success: true, ...action.response }
            };
        case actionTypes.GET_BUILDING_TYPE_DROPDOWN_FAILURE:
            return {
                ...state,
                buildingTypeDropdownData: { success: false, ...action.error }
            };

        case actionTypes.GET_TEMPLATE_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_TEMPLATE_DROPDOWN_SUCCESS:
            return {
                ...state,
                getTemplateDropdownResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_TEMPLATE_DROPDOWN_FAILURE:
            return {
                ...state,
                getTemplateDropdownResponse: { success: false, ...action.error }
            };

        case actionTypes.GET_TEMPLATE_INITIAL_VALUES_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_TEMPLATE_INITIAL_VALUES_SUCCESS:
            return {
                ...state,
                getTemplateInitialValuesResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_TEMPLATE_INITIAL_VALUES_FAILURE:
            return {
                ...state,
                getTemplateInitialValuesResponse: { success: false, ...action.error }
            };
        case actionTypes.GET_BUILDINGS_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_BUILDINGS_DROPDOWN_SUCCESS:
            return {
                ...state,
                buildingDropdownData: { success: true, ...action.response }
            };
        case actionTypes.GET_BUILDINGS_DROPDOWN_FAILURE:
            return {
                ...state,
                buildingDropdownData: { success: false, ...action.error }
            };
        case actionTypes.GET_ASSET_CONDITIONS_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ASSET_CONDITIONS_DROPDOWN_SUCCESS:
            return {
                ...state,
                assetConditionDropdownData: { success: true, ...action.response }
            };
        case actionTypes.GET_ASSET_CONDITIONS_DROPDOWN_FAILURE:
            return {
                ...state,
                assetConditionDropdownData: { success: false, ...action.error }
            };
        case actionTypes.GET_FLOORS_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_FLOORS_DROPDOWN_SUCCESS:
            return {
                ...state,
                floorDropdownData: { success: true, ...action.response }
            };
        case actionTypes.GET_FLOORS_DROPDOWN_FAILURE:
            return {
                ...state,
                floorDropdownData: { success: false, ...action.error }
            };

        case actionTypes.GET_EVENT_FORM_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_EVENT_FORM_DROPDOWN_SUCCESS:
            return {
                ...state,
                getEventFormDropDownData: { success: true, ...action.response }
            };
        case actionTypes.GET_EVENT_FORM_DROPDOWN_FAILURE:
            return {
                ...state,
                getEventFormDropDownData: { success: false, ...action.error }
            };

        default:
            return {
                ...state
            };
    }
};

export default conmmonRedRes;
