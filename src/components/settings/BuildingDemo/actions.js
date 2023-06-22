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
            dispatch({ type: actionTypes.COMMON_BUILDING_FAILURE, error: e.response && e.response.data });
        }
    };
};

export const addBuilding = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_BUILDING_REQUEST });
            const res = await Service.addBuilding(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.COMMON_BUILDING_SUCCESS, response: res.data });
                    dispatch(clearCommonResposeReduer());
                } else {
                    dispatch({ type: actionTypes.COMMON_BUILDING_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.COMMON_BUILDING_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.COMMON_BUILDING_FAILURE, error: e.response && e.response.data });
        }
    };
};

export const clearCommonResposeReduer = () => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.CLEAR_ADDBUILDING_DATA });
        } catch (e) {
            dispatch({ type: actionTypes.COMMON_BUILDING_FAILURE, error: e.response && e.response.data });
        }
    };
};

export const clearDropdown = () => {
    return async dispatch => {
        dispatch({ type: "CLEAR_DROPDOWN" });
    };
};

export const getBuildingById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_BUILDING_BY_ID_REQUEST });
            const res = await Service.getBuildingById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_BUILDING_BY_ID_SUCCESS, response: res.data });
                    return res.data;
                } else {
                    dispatch({ type: actionTypes.GET_BUILDING_BY_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_BUILDING_BY_ID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_BUILDING_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    };
};

export const editBuilding = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_BUILDING_REQUEST });
            const res = await Service.editBuilding(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.COMMON_BUILDING_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.COMMON_BUILDING_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.EDIT_BUILDING_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_BUILDING_FAILURE, error: e.response && e.response.data });
        }
    };
};

export const deleteBuilding = (id, setIsLoading, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_BUILDING_REQUEST });
            const res = await Service.deleteBuilding(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.COMMON_BUILDING_SUCCESS, response: res.data });
                    dispatch(getBuildingData(setIsLoading, params));
                } else {
                    dispatch({ type: actionTypes.COMMON_BUILDING_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.COMMON_BUILDING_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.COMMON_BUILDING_FAILURE, error: e.response && e.response.data });
        }
    };
};

export const exportBuilding = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_BUILDING_TABLE_REQUEST });
            const response = await Service.exportBuilding(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_BUILDING_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.EXPORT_BUILDING_TABLE_SUCCESS, response: {} });
                }
            }
            const { data } = response;
            const name = response.headers["content-disposition"].split("filename=");
            const fileName = name[1].split('"')[1];
            const downloadUrl = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", `${fileName}`); //any other extension
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            dispatch({
                type: actionTypes.EXPORT_BUILDING_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export const getAllBuildingLogs = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_BUILDING_LOG_REQUEST });
            const res = await Service.getAllBuildingLogs(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_BUILDING_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_BUILDING_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_BUILDING_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_BUILDING_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

export const deleteBuildingLog = (id, GetData) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_BUILDING_LOG_REQUEST });
            const res = await Service.deleteBuildingLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch(getAllBuildingLogs(GetData?.historyParams, GetData?.id));
                    dispatch({ type: actionTypes.DELETE_BUILDING_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_BUILDING_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_BUILDING_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_BUILDING_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

export const restoreBuildingLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_BUILDING_LOG_REQUEST });
            const res = await Service.restoreBuildingLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_BUILDING_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_BUILDING_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_BUILDING_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_BUILDING_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

export default {
    getBuildingData,
    addBuilding,
    clearCommonResposeReduer,
    getBuildingById,
    editBuilding,
    deleteBuilding
};
