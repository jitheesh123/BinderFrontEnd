import * as actionTypes from "./constants";
import * as Service from "./services";

const getConsultancies = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CONSULTANCIES_REQUEST });
            const res = await Service.getConsultancies(params);
        } catch (e) {}
    };
};

const getAllLogbooks = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_LOGBOOKS_REQUEST });
            const res = await Service.getAllLogbooks(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_LOGBOOKS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_LOGBOOKS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_LOGBOOKS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_LOGBOOKS_FAILURE, error: e.response && e.response.data });
        }
    };
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getConsultancies,
    getAllLogbooks
};
