import * as actionTypes from "./constants";
import * as Service from "./services";

const getAllFormTypes = (params, path = null) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_FORM_TYPES_REQUEST });
            const res = await Service.getAllFormTypes(params, path);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_FORM_TYPES_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_FORM_TYPES_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_FORM_TYPES_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_FORM_TYPES_FAILURE, error: e.response && e.response.data });
        }
    };
};
const fetchEventFormData = (id, path = null) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.FETCH_EVENT_FORM_DATA_REQUEST });
            const res = await Service.fetchEventFormData(id, path);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.FETCH_EVENT_FORM_DATA_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.FETCH_EVENT_FORM_DATA_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.FETCH_EVENT_FORM_DATA_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.FETCH_EVENT_FORM_DATA_FAILURE, error: e.response && e.response.data });
        }
    };
};
const updateEventForms = (event_form, id, path = null) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_EVENT_FORMS_REQUEST });
            const res = await Service.updateEventForms(event_form, id, path);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.UPDATE_EVENT_FORMS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.UPDATE_EVENT_FORMS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.UPDATE_EVENT_FORMS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.UPDATE_EVENT_FORMS_FAILURE, error: e.response && e.response.data });
        }
    };
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getAllFormTypes,
    fetchEventFormData,
    updateEventForms
};
