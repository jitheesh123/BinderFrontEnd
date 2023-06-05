import * as actionTypes from "./constants";
import * as Service from "./services";

const getFloor = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_FLOOR_REQUEST });
            const res = await Service.getFloor(params);
            if (res && res.status === 200) {
                const getFloorData = res.data;
                if (getFloorData) {
                    dispatch({ type: actionTypes.GET_FLOOR_SUCCESS, response: getFloorData });
                } else {
                    dispatch({ type: actionTypes.GET_FLOOR_FAILURE, error: getFloorData });
                }
            } else {
                dispatch({ type: actionTypes.GET_FLOOR_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_FLOOR_FAILURE, error: e.response && e.response.data });
        }
    };
};

const addFloor = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_FLOOR_REQUEST });
            const res = await Service.addFloor(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_FLOOR_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ADD_FLOOR_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ADD_FLOOR_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_FLOOR_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteFloor = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_FLOOR_BYID_REQUEST });
            const res = await Service.deleteFloor(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_FLOOR_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_FLOOR_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_FLOOR_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_FLOOR_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const editFloorById = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_FLOOR_BYID_REQUEST });
            const res = await Service.editFloorById(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_FLOOR_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.EDIT_FLOOR_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.EDIT_FLOOR_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_FLOOR_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getListForCommonFilterForFloor = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForFloor(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getFloorById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_FLOOR_BY_ID_REQUEST });
            const res = await Service.getFloorById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_FLOOR_BY_ID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_FLOOR_BY_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_FLOOR_BY_ID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_FLOOR_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    }
}
const exportFloor = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_FLOOR_TABLE_REQUEST });
            const response = await Service.exportFloor(params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_FLOOR_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.EXPORT_FLOOR_TABLE_SUCCESS, response: {} });
                }
            }
            const { data } = response;
            const name = response.headers['content-disposition'].split('filename=');
            const fileName = name[1].split('"')[1];
            const downloadUrl = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `${fileName}`); //any other extension
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            dispatch({
                type: actionTypes.EXPORT_FLOOR_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllFloorLogs = (params,id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_FLOOR_LOG_REQUEST });
            const res = await Service.getAllFloorLogs(params,id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_FLOOR_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_FLOOR_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_FLOOR_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_FLOOR_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const restoreFloorLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_FLOOR_LOG_REQUEST });
            const res = await Service.restoreFloorLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_FLOOR_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_FLOOR_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_FLOOR_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_FLOOR_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteFloorLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_FLOOR_LOG_REQUEST });
            const res = await Service.deleteFloorLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_FLOOR_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_FLOOR_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_FLOOR_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_FLOOR_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateFloorEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_FLOOR_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_FLOOR_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

export default {
    getFloor,
    getFloorById,
    addFloor,
    editFloorById,
    deleteFloor,
    getListForCommonFilterForFloor,
    exportFloor,
    getAllFloorLogs,
    restoreFloorLog,
    deleteFloorLog,
    updateFloorEntityParams
};
