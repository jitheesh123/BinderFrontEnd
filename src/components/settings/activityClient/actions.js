import * as actionTypes from "./constants";
import * as Service from "./services";

const getActivityClients = (params,id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ACTIVITY_CLIENT_REQUEST });
            const res = await Service.getActivityClients(params,id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ACTIVITY_CLIENT_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ACTIVITY_CLIENT_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ACTIVITY_CLIENT_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ACTIVITY_CLIENT_FAILURE, error: e.response && e.response.data });
        }
    };
};

const addClients = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_ACTIVITY_CLIENT_REQUEST });
            const res = await Service.addClients(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_ACTIVITY_CLIENT_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ADD_ACTIVITY_CLIENT_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ADD_ACTIVITY_CLIENT_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_ACTIVITY_CLIENT_FAILURE, error: e.response && e.response.data });
        }
    };
};

const editClientsById = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_ACTIVITY_CLIENT_BYID_REQUEST });
            const res = await Service.editClientsById(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_ACTIVITY_CLIENT_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.EDIT_ACTIVITY_CLIENT_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.EDIT_ACTIVITY_CLIENT_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_ACTIVITY_CLIENT_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteActivityClient = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_ACTIVITY_CLIENT_BYID_REQUEST });
            const res = await Service.deleteActivityClient(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_ACTIVITY_CLIENT_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_ACTIVITY_CLIENT_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_ACTIVITY_CLIENT_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_ACTIVITY_CLIENT_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getListForCommonFilterForClient = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForClient(params);
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

const getActivityClientById = (id,clientId) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ACTIVITY_CLIENT_BY_ID_REQUEST });
            const res = await Service.getActivityClientById(id,clientId);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ACTIVITY_CLIENT_BY_ID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ACTIVITY_CLIENT_BY_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ACTIVITY_CLIENT_BY_ID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ACTIVITY_CLIENT_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    }
}
const exportClient = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_ACTIVITY_CLIENT_TABLE_REQUEST });
            const response = await Service.exportClient(params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_ACTIVITY_CLIENT_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.EXPORT_ACTIVITY_CLIENT_TABLE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_ACTIVITY_CLIENT_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllClientLogs = (params,id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_CLIENT_LOG_REQUEST });
            const res = await Service.getAllClientLogs(params,id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_CLIENT_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_CLIENT_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_CLIENT_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_CLIENT_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const restoreClientLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_CLIENT_LOG_REQUEST });
            const res = await Service.restoreClientLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_CLIENT_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_CLIENT_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_CLIENT_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_CLIENT_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteClientLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_CLIENT_LOG_REQUEST });
            const res = await Service.deleteClientLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_CLIENT_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_CLIENT_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_CLIENT_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_CLIENT_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateClientEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_CLIENT_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_CLIENT_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

export default {
    getActivityClients,
    addClients,
    editClientsById,
    deleteActivityClient,
    getListForCommonFilterForClient,
    getActivityClientById,
    exportClient,
    getAllClientLogs,
    restoreClientLog,
    deleteClientLog,
    updateClientEntityParams
};
