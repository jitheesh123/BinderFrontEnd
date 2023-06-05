import * as actionTypes from "./constants";
import * as Service from "./services";

const getConsultancyDropdown = () => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CONSULTANCY_DROPDOWN_REQUEST });
            const res = await Service.getConsultancyDropdown();
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_CONSULTANCY_DROPDOWN_SUCCESS, response: res });
                } else {
                    dispatch({ type: actionTypes.GET_CONSULTANCY_DROPDOWN_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_CONSULTANCY_DROPDOWN_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_CONSULTANCY_DROPDOWN_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getClientDropdown = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CLIENTS_DROPDOWN_REQUEST });
            const res = await Service.getClientDropdown(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_CLIENTS_DROPDOWN_SUCCESS, response: res });
                } else {
                    dispatch({ type: actionTypes.GET_CLIENTS_DROPDOWN_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_CLIENTS_DROPDOWN_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_CLIENTS_DROPDOWN_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getTemplateDropdown = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_TEMPLATE_DROPDOWN_REQUEST });
            const res = await Service.getTemplateDropdown(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_TEMPLATE_DROPDOWN_SUCCESS, response: res });
                } else {
                    dispatch({ type: actionTypes.GET_TEMPLATE_DROPDOWN_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_TEMPLATE_DROPDOWN_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_TEMPLATE_DROPDOWN_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getTemplateInitialValues = () => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_TEMPLATE_INITIAL_VALUES_REQUEST });
            const res = await Service.getTemplateInitialValues();
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_TEMPLATE_INITIAL_VALUES_SUCCESS, response: res });
                } else {
                    dispatch({ type: actionTypes.GET_TEMPLATE_INITIAL_VALUES_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_TEMPLATE_INITIAL_VALUES_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_TEMPLATE_INITIAL_VALUES_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getSectorDropdown = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SECTOR_DROPDOWN_REQUEST });
            const res = await Service.getSectorDropdown(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_SECTOR_DROPDOWN_SUCCESS, response: res });
                } else {
                    dispatch({ type: actionTypes.GET_SECTOR_DROPDOWN_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_SECTOR_DROPDOWN_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_SECTOR_DROPDOWN_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getCampusesDropdown = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CAMPUSES_DROPDOWN_REQUEST });
            const res = await Service.getCampusesDropdown(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_CAMPUSES_DROPDOWN_SUCCESS, response: res });
                } else {
                    dispatch({ type: actionTypes.GET_CAMPUSES_DROPDOWN_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_CAMPUSES_DROPDOWN_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_CAMPUSES_DROPDOWN_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getFrequencyDropdown = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_FREQUENCY_DROPDOWN_REQUEST });
            const res = await Service.getFrequencyDropdown(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_FREQUENCY_DROPDOWN_SUCCESS, response: res });
                } else {
                    dispatch({ type: actionTypes.GET_FREQUENCY_DROPDOWN_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_FREQUENCY_DROPDOWN_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_FREQUENCY_DROPDOWN_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getLogbookDropdown = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LOGBOOK_DROPDOWN_REQUEST });
            const res = await Service.getLogbookDropdown(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_LOGBOOK_DROPDOWN_SUCCESS, response: res });
                } else {
                    dispatch({ type: actionTypes.GET_LOGBOOK_DROPDOWN_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_LOGBOOK_DROPDOWN_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_LOGBOOK_DROPDOWN_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getEventFormDropDown = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_EVENT_FORM_DROPDOWN_REQUEST });
            const res = await Service.getEventFormDropDown(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_EVENT_FORM_DROPDOWN_SUCCESS, response: res });
                } else {
                    dispatch({ type: actionTypes.GET_EVENT_FORM_DROPDOWN_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_EVENT_FORM_DROPDOWN_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_EVENT_FORM_DROPDOWN_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getDeemingAgencyDropdown = () => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_DEEMING_AGENCY_DROPDOWN_REQUEST });
            const res = await Service.getDeemingAgencyDropdown();
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_DEEMING_AGENCY_DROPDOWN_SUCCESS, response: res });
                } else {
                    dispatch({ type: actionTypes.GET_DEEMING_AGENCY_DROPDOWN_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_DEEMING_AGENCY_DROPDOWN_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_DEEMING_AGENCY_DROPDOWN_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getRoleDropdown = () => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ROLE_DROPDOWN_REQUEST });
            const res = await Service.getRoleDropdown();
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ROLE_DROPDOWN_SUCCESS, response: res });
                } else {
                    dispatch({ type: actionTypes.GET_ROLE_DROPDOWN_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ROLE_DROPDOWN_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ROLE_DROPDOWN_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getBuildingTypeDropdown = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_BUILDING_TYPE_DROPDOWN_REQUEST });
            const res = await Service.getBuildingTypeDropdown(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_BUILDING_TYPE_DROPDOWN_SUCCESS, response: res });
                } else {
                    dispatch({ type: actionTypes.GET_BUILDING_TYPE_DROPDOWN_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_BUILDING_TYPE_DROPDOWN_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_BUILDING_TYPE_DROPDOWN_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getBuildingsDropdown = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_BUILDINGS_DROPDOWN_REQUEST });
            const res = await Service.getBuildingsDropdown(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_BUILDINGS_DROPDOWN_SUCCESS, response: res });
                } else {
                    dispatch({ type: actionTypes.GET_BUILDINGS_DROPDOWN_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_BUILDINGS_DROPDOWN_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_BUILDINGS_DROPDOWN_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getAssetConditionsDropdown = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSET_CONDITIONS_DROPDOWN_REQUEST });
            const res = await Service.getAssetConditionsDropdown(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ASSET_CONDITIONS_DROPDOWN_SUCCESS, response: res });
                } else {
                    dispatch({ type: actionTypes.GET_ASSET_CONDITIONS_DROPDOWN_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ASSET_CONDITIONS_DROPDOWN_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ASSET_CONDITIONS_DROPDOWN_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getFloorsDropdown = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_FLOORS_DROPDOWN_REQUEST });
            const res = await Service.getFloorsDropdown(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_FLOORS_DROPDOWN_SUCCESS, response: res });
                } else {
                    dispatch({ type: actionTypes.GET_FLOORS_DROPDOWN_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_FLOORS_DROPDOWN_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_FLOORS_DROPDOWN_FAILURE, error: e.response && e.response.data });
        }
    };
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getConsultancyDropdown,
    getClientDropdown,
    getSectorDropdown,
    getCampusesDropdown,
    getLogbookDropdown,
    getDeemingAgencyDropdown,
    getFrequencyDropdown,
    getRoleDropdown,
    getBuildingTypeDropdown,
    getTemplateDropdown,
    getTemplateInitialValues,
    getBuildingsDropdown,
    getAssetConditionsDropdown,
    getFloorsDropdown,
    getEventFormDropDown
};
