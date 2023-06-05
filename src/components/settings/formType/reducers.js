import * as actionTypes from "./constants";

const initialState = {
    getAllFormTypesResponse: {},
    fetchEventFormDataResponse: {},
    updateEventFormsResponse: {}
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ALL_FORM_TYPES_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ALL_FORM_TYPES_SUCCESS:
            return {
                ...state,
                getAllFormTypesResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ALL_FORM_TYPES_FAILURE:
            return {
                ...state,
                getAllFormTypesResponse: { success: false, ...action.error }
            };

        case actionTypes.FETCH_EVENT_FORM_DATA_REQUEST:
            return {
                ...state
            };
        case actionTypes.FETCH_EVENT_FORM_DATA_SUCCESS:
            return {
                ...state,
                fetchEventFormDataResponse: { success: true, ...action.response }
            };
        case actionTypes.FETCH_EVENT_FORM_DATA_FAILURE:
            return {
                ...state,
                fetchEventFormDataResponse: { success: false, ...action.error }
            };

        case actionTypes.UPDATE_EVENT_FORMS_REQUEST:
            return {
                ...state
            };
        case actionTypes.UPDATE_EVENT_FORMS_SUCCESS:
            return {
                ...state,
                updateEventFormsResponse: { success: true, ...action.response }
            };
        case actionTypes.UPDATE_EVENT_FORMS_FAILURE:
            return {
                ...state,
                updateEventFormsResponse: { success: false, ...action.error }
            };

        default:
            return state;
    }
};
