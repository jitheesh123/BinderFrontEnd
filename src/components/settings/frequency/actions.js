import * as actionTypes from "./constants";
import * as Service from "./services";

const getFrequency = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_FREQUENCY_REQUEST });
            const res = await Service.getFrequency(params);
            if (res && res.status === 200) {
                const getFrequencyData = res.data;
                if (getFrequencyData) {
                    dispatch({ type: actionTypes.GET_FREQUENCY_SUCCESS, response: getFrequencyData });
                } else {
                    dispatch({ type: actionTypes.GET_FREQUENCY_FAILURE, error: getFrequencyData });
                }
            } else {
                dispatch({ type: actionTypes.GET_FREQUENCY_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_FREQUENCY_FAILURE, error: e.response && e.response.data });
        }
    };
};

const addFrequency = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_FREQUENCY_REQUEST });
            const res = await Service.addFrequency(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_FREQUENCY_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ADD_FREQUENCY_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ADD_FREQUENCY_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_FREQUENCY_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteFrequency = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_FREQUENCY_BYID_REQUEST });
            const res = await Service.deleteFrequency(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_FREQUENCY_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_FREQUENCY_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_FREQUENCY_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_FREQUENCY_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const editFrequencyById = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_FREQUENCY_BYID_REQUEST });
            const res = await Service.editFrequencyById(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_FREQUENCY_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.EDIT_FREQUENCY_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.EDIT_FREQUENCY_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_FREQUENCY_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getListForCommonFilterForFrequency = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForFrequency(params);
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

const getFrequencyById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_FREQUENCY_BY_ID_REQUEST });
            const res = await Service.getFrequencyById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_FREQUENCY_BY_ID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_FREQUENCY_BY_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_FREQUENCY_BY_ID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_FREQUENCY_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    }
}
const exportFrequency = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_FREQUENCY_TABLE_REQUEST });
            const response = await Service.exportFrequency(params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_FREQUENCY_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.EXPORT_FREQUENCY_TABLE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_FREQUENCY_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllFrequencyLogs = (params,id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_FREQUENCY_LOG_REQUEST });
            const res = await Service.getAllFrequencyLogs(params,id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_FREQUENCY_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_FREQUENCY_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_FREQUENCY_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_FREQUENCY_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const restoreFrequencyLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_FREQUENCY_LOG_REQUEST });
            const res = await Service.restoreFrequencyLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_FREQUENCY_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_FREQUENCY_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_FREQUENCY_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_FREQUENCY_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteFrequencyLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_FREQUENCY_LOG_REQUEST });
            const res = await Service.deleteFrequencyLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_FREQUENCY_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_FREQUENCY_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_FREQUENCY_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_FREQUENCY_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateFrequencyEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_FREQUENCY_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_FREQUENCY_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

export default {
    getFrequency,
    getFrequencyById,
    addFrequency,
    editFrequencyById,
    deleteFrequency,
    getListForCommonFilterForFrequency,
    exportFrequency,
    getAllFrequencyLogs,
    restoreFrequencyLog,
    deleteFrequencyLog,
    updateFrequencyEntityParams
};
