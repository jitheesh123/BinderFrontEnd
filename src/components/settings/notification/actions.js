import * as actionTypes from "./constants";
import * as Service from "./services";

const getNotification = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_NOTIFICATION_REQUEST });
            const res = await Service.getNotification(params);
            if (res && res.status === 200) {
                const getNotificationData = res.data;
                if (getNotificationData) {
                    dispatch({ type: actionTypes.GET_NOTIFICATION_SUCCESS, response: getNotificationData });
                } else {
                    dispatch({ type: actionTypes.GET_NOTIFICATION_FAILURE, error: getNotificationData });
                }
            } else {
                dispatch({ type: actionTypes.GET_NOTIFICATION_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_NOTIFICATION_FAILURE, error: e.response && e.response.data });
        }
    };
};

const addNotification = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_NOTIFICATION_REQUEST });
            const res = await Service.addNotification(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_NOTIFICATION_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ADD_NOTIFICATION_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ADD_NOTIFICATION_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_NOTIFICATION_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteNotification = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_NOTIFICATION_BYID_REQUEST });
            const res = await Service.deleteNotification(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_NOTIFICATION_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_NOTIFICATION_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_NOTIFICATION_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_NOTIFICATION_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const editNotificationById = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_NOTIFICATION_BYID_REQUEST });
            const res = await Service.editNotificationById(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_NOTIFICATION_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.EDIT_NOTIFICATION_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.EDIT_NOTIFICATION_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_NOTIFICATION_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getListForCommonFilterForNotification = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForNotification(params);
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

const getNotificationById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_NOTIFICATION_BY_ID_REQUEST });
            const res = await Service.getNotificationById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_NOTIFICATION_BY_ID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_NOTIFICATION_BY_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_NOTIFICATION_BY_ID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_NOTIFICATION_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    }
}
const exportNotification = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_NOTIFICATION_TABLE_REQUEST });
            const response = await Service.exportNotification(params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_NOTIFICATION_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.EXPORT_NOTIFICATION_TABLE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_NOTIFICATION_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllNotificationLogs = (params,id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_NOTIFICATION_LOG_REQUEST });
            const res = await Service.getAllNotificationLogs(params,id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_NOTIFICATION_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_NOTIFICATION_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_NOTIFICATION_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_NOTIFICATION_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const restoreNotificationLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_NOTIFICATION_LOG_REQUEST });
            const res = await Service.restoreNotificationLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_NOTIFICATION_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_NOTIFICATION_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_NOTIFICATION_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_NOTIFICATION_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteNotificationLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_NOTIFICATION_LOG_REQUEST });
            const res = await Service.deleteNotificationLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_NOTIFICATION_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_NOTIFICATION_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_NOTIFICATION_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_NOTIFICATION_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateNotificationEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_NOTIFICATION_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_NOTIFICATION_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

export default {
    getNotification,
    getNotificationById,
    addNotification,
    editNotificationById,
    deleteNotification,
    getListForCommonFilterForNotification,
    exportNotification,
    getAllNotificationLogs,
    restoreNotificationLog,
    deleteNotificationLog,
    updateNotificationEntityParams
};
