import * as actionTypes from "./constants";

const initialState = {
    getDashboardDataResponse: {}
};

const reducerResp = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_DASHBOARD_DATA_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_DASHBOARD_DATA_SUCCESS:
            return {
                ...state,
                getDashboardDataResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_DASHBOARD_DATA_FAILURE:
            return {
                ...state,
                getDashboardDataResponse: { success: false, ...action.error }
            };

        default:
            return {
                ...state
            };
    }
};

export default reducerResp;
