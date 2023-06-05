import * as actionTypes from "./constants";
import * as Service from "./services";

const getDashboardData = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_DASHBOARD_DATA_REQUEST });
            const res = await Service.getDashboardData(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_DASHBOARD_DATA_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_DASHBOARD_DATA_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_DASHBOARD_DATA_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_DASHBOARD_DATA_FAILURE, error: e.response && e.response.data });
        }
    };
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getDashboardData
};
