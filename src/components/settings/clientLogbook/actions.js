import * as actionTypes from "./constants";
import * as Service from "./services";

const getClientLogbook = (params, path) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CLIENT_LOGBOOK_REQUEST });
            const res = await Service.getClientLogbook(params, path);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_CLIENT_LOGBOOK_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_CLIENT_LOGBOOK_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_CLIENT_LOGBOOK_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_CLIENT_LOGBOOK_FAILURE, error: e.response && e.response.data });
        }
    };
};

const addClientLogbook = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_CLIENT_LOGBOOK_REQUEST });
            const res = await Service.addClientLogbook(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_CLIENT_LOGBOOK_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ADD_CLIENT_LOGBOOK_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ADD_CLIENT_LOGBOOK_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_CLIENT_LOGBOOK_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteClientLogbook = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_CLIENT_LOGBOOK_REQUEST });
            const res = await Service.deleteClientLogbook(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_CLIENT_LOGBOOK_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_CLIENT_LOGBOOK_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_CLIENT_LOGBOOK_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_CLIENT_LOGBOOK_FAILURE, error: e.response && e.response.data });
        }
    };
};

const editClientLogbook = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_CLIENT_LOGBOOK_REQUEST });
            const res = await Service.editClientLogbook(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_CLIENT_LOGBOOK_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.EDIT_CLIENT_LOGBOOK_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.EDIT_CLIENT_LOGBOOK_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_CLIENT_LOGBOOK_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getListForCommonFilterForClientLogbook = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForClientLogbook(params);
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

const getClientLogbookById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CLIENT_LOGBOOK_BY_ID_REQUEST });
            const res = await Service.getClientLogbookById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_CLIENT_LOGBOOK_BY_ID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_CLIENT_LOGBOOK_BY_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_CLIENT_LOGBOOK_BY_ID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_CLIENT_LOGBOOK_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const exportClientLogbook = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_CLIENT_LOGBOOK_TABLE_REQUEST });
            const response = await Service.exportClientLogbook(params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_CLIENT_LOGBOOK_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.EXPORT_CLIENT_LOGBOOK_TABLE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_CLIENT_LOGBOOK_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllClientLogbookLogs = (params,id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_CLIENT_LOGBOOK_LOG_REQUEST });
            const res = await Service.getAllClientLogbookLogs(params,id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_CLIENT_LOGBOOK_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_CLIENT_LOGBOOK_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_CLIENT_LOGBOOK_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_CLIENT_LOGBOOK_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const restoreClientLogbookLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_CLIENT_LOGBOOK_LOG_REQUEST });
            const res = await Service.restoreClientLogbookLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_CLIENT_LOGBOOK_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_CLIENT_LOGBOOK_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_CLIENT_LOGBOOK_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_CLIENT_LOGBOOK_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteClientLogbookLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_CLIENT_LOGBOOK_LOG_REQUEST });
            const res = await Service.deleteClientLogbookLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_CLIENT_LOGBOOK_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_CLIENT_LOGBOOK_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_CLIENT_LOGBOOK_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_CLIENT_LOGBOOK_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateClientLogbookEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_CLIENT_LOGBOOK_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_CLIENT_LOGBOOK_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};


export default {
    getClientLogbook,
    addClientLogbook,
    deleteClientLogbook,
    editClientLogbook,
    getListForCommonFilterForClientLogbook,
    getClientLogbookById,
    exportClientLogbook,
    getAllClientLogbookLogs,
    restoreClientLogbookLog,
    deleteClientLogbookLog,
    updateClientLogbookEntityParams
};
