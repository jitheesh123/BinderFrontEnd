import * as actionTypes from "./constants";
import * as Service from "./services";

const getDeemingAgencyFrequency = (params, path) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_DEEMING_AGENCY_FREQUENCY_REQUEST });
            const res = await Service.getDeemingAgencyFrequency(params, path);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_DEEMING_AGENCY_FREQUENCY_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_DEEMING_AGENCY_FREQUENCY_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_DEEMING_AGENCY_FREQUENCY_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_DEEMING_AGENCY_FREQUENCY_FAILURE, error: e.response && e.response.data });
        }
    };
};

const addDeemingAgencyFrequency = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_DEEMING_AGENCY_FREQUENCY_REQUEST });
            const res = await Service.addDeemingAgencyFrequency(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_DEEMING_AGENCY_FREQUENCY_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ADD_DEEMING_AGENCY_FREQUENCY_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ADD_DEEMING_AGENCY_FREQUENCY_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_DEEMING_AGENCY_FREQUENCY_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteDeemingAgencyFrequency = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_DEEMING_AGENCY_FREQUENCY_REQUEST });
            const res = await Service.deleteDeemingAgencyFrequency(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_DEEMING_AGENCY_FREQUENCY_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_DEEMING_AGENCY_FREQUENCY_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_DEEMING_AGENCY_FREQUENCY_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_DEEMING_AGENCY_FREQUENCY_FAILURE, error: e.response && e.response.data });
        }
    };
};

const editDeemingAgencyFrequency = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_DEEMING_AGENCY_FREQUENCY_REQUEST });
            const res = await Service.editDeemingAgencyFrequency(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_DEEMING_AGENCY_FREQUENCY_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.EDIT_DEEMING_AGENCY_FREQUENCY_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.EDIT_DEEMING_AGENCY_FREQUENCY_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_DEEMING_AGENCY_FREQUENCY_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getListForCommonFilterForLogbook = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForLogbook(params);
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

const getDeemingAgencyFrequencyById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_DEEMING_AGENCY_FREQUENCY_BY_ID_REQUEST });
            const res = await Service.getDeemingAgencyFrequencyById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_DEEMING_AGENCY_FREQUENCY_BY_ID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_DEEMING_AGENCY_FREQUENCY_BY_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_DEEMING_AGENCY_FREQUENCY_BY_ID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_DEEMING_AGENCY_FREQUENCY_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const exportDeemingAgencyFrequency = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_DEEMING_AGENCY_FREQUENCY_TABLE_REQUEST });
            const response = await Service.exportDeemingAgencyFrequency(params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_DEEMING_AGENCY_FREQUENCY_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.EXPORT_DEEMING_AGENCY_FREQUENCY_TABLE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_DEEMING_AGENCY_FREQUENCY_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllDeemingAgencyFrequencyLogs = (params,id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_DEEMING_AGENCY_FREQUENCY_LOG_REQUEST });
            const res = await Service.getAllDeemingAgencyFrequencyLogs(params,id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_DEEMING_AGENCY_FREQUENCY_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_DEEMING_AGENCY_FREQUENCY_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_DEEMING_AGENCY_FREQUENCY_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_DEEMING_AGENCY_FREQUENCY_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const restoreDeemingAgencyFrequencyLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_DEEMING_AGENCY_FREQUENCY_LOG_REQUEST });
            const res = await Service.restoreDeemingAgencyFrequencyLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_DEEMING_AGENCY_FREQUENCY_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_DEEMING_AGENCY_FREQUENCY_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_DEEMING_AGENCY_FREQUENCY_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_DEEMING_AGENCY_FREQUENCY_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteDeemingAgencyFrequencyLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_DEEMING_AGENCY_FREQUENCY_LOG_REQUEST });
            const res = await Service.deleteDeemingAgencyFrequencyLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_DEEMING_AGENCY_FREQUENCY_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_DEEMING_AGENCY_FREQUENCY_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_DEEMING_AGENCY_FREQUENCY_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_DEEMING_AGENCY_FREQUENCY_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateLogbookEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_DEEMING_AGENCY_FREQUENCY_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_DEEMING_AGENCY_FREQUENCY_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};


export default {
    getDeemingAgencyFrequency,
    addDeemingAgencyFrequency,
    deleteDeemingAgencyFrequency,
    editDeemingAgencyFrequency,
    getListForCommonFilterForLogbook,
    getDeemingAgencyFrequencyById,
    exportDeemingAgencyFrequency,
    getAllDeemingAgencyFrequencyLogs,
    restoreDeemingAgencyFrequencyLog,
    deleteDeemingAgencyFrequencyLog,
    updateLogbookEntityParams
};
