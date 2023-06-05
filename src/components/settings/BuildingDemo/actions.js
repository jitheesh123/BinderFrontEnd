import * as actionTypes from "./constants";
import * as Service from "./services";
export const getBuildingData = (setIsLoading, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_BUILDING_REQUEST });
            setIsLoading(true);
            const res = await Service.getBuildingData(params);
            if (res && res.status === 200) {
                setIsLoading(false);
                if (res.data) {
                    dispatch({ type: actionTypes.GET_BUILDING_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_BUILDING_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_BUILDING_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_BUILDING_FAILURE, error: e.response && e.response.data });
        }
    };
};
const addBuilding = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_BUILDING_REQUEST });
            const res = await Service.addBuilding(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_BUILDING_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ADD_BUILDING_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ADD_BUILDING_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_BUILDING_FAILURE, error: e.response && e.response.data });
        }
    };
};

export default {
    getBuildingData,
    addBuilding
};
