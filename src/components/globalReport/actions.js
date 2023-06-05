import * as actionTypes from "./constants";
import * as Service from "./services";

const getReports = (params, path) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_REPORT_REQUEST });
            const res = await Service.getReports(params, path);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_REPORT_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_REPORT_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_REPORT_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_REPORT_FAILURE, error: e.response && e.response.data });
        }
    };
};

const addLogbook = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_REPORT_REQUEST });
            const res = await Service.addLogbook(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_REPORT_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ADD_REPORT_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ADD_REPORT_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_REPORT_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteLogbook = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_REPORT_REQUEST });
            const res = await Service.deleteLogbook(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_REPORT_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_REPORT_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_REPORT_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_REPORT_FAILURE, error: e.response && e.response.data });
        }
    };
};

const editLogbook = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_REPORT_REQUEST });
            const res = await Service.editLogbook(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_REPORT_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.EDIT_REPORT_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.EDIT_REPORT_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_REPORT_FAILURE, error: e.response && e.response.data });
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

const getLogbookById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_REPORT_BY_ID_REQUEST });
            const res = await Service.getLogbookById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_REPORT_BY_ID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_REPORT_BY_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_REPORT_BY_ID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_REPORT_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const exportReports = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_REPORT_TABLE_REQUEST });
            const response = await Service.exportReports(params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_REPORT_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.EXPORT_REPORT_TABLE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_REPORT_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllLogbookLogs = (params,id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_REPORT_LOG_REQUEST });
            const res = await Service.getAllLogbookLogs(params,id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_REPORT_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_REPORT_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_REPORT_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_REPORT_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const restoreLogbookLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_REPORT_LOG_REQUEST });
            const res = await Service.restoreLogbookLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_REPORT_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_REPORT_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_REPORT_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_REPORT_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteLogbookLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_REPORT_LOG_REQUEST });
            const res = await Service.deleteLogbookLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_REPORT_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_REPORT_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_REPORT_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_REPORT_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateLogbookEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_REPORT_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_REPORT_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};


export default {
    getReports,
    addLogbook,
    deleteLogbook,
    editLogbook,
    getListForCommonFilterForLogbook,
    getLogbookById,
    exportReports,
    getAllLogbookLogs,
    restoreLogbookLog,
    deleteLogbookLog,
    updateLogbookEntityParams
};
