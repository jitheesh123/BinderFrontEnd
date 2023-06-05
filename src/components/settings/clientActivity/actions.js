import * as actionTypes from './constants'
import * as Service from './services'

const getClientActivityList = (params, path) => {

    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CLIENT_ACTIVITY_LIST_REQUEST })
            const res = await Service.getClientActivityList(params, path)
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_CLIENT_ACTIVITY_LIST_SUCCESS, response: res.data })
                } else {
                    dispatch({ type: actionTypes.GET_CLIENT_ACTIVITY_LIST_FAILURE, error: res.data })
                }
            } else {
                dispatch({ type: actionTypes.GET_CLIENT_ACTIVITY_LIST_FAILURE, error: res.data })
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_CLIENT_ACTIVITY_LIST_FAILURE, error: e.response && e.response.data })
        }
    }
}

const addClientActivity = params => {

    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_CLIENT_ACTIVITY_REQUEST })
            const res = await Service.addClientActivity(params)
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_CLIENT_ACTIVITY_SUCCESS, response: res.data })
                } else {
                    dispatch({ type: actionTypes.ADD_CLIENT_ACTIVITY_FAILURE, error: res.data })
                }
            } else {
                dispatch({ type: actionTypes.ADD_CLIENT_ACTIVITY_FAILURE, error: res.data })
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_CLIENT_ACTIVITY_FAILURE, error: e.response && e.response.data })
        }
    }
}

const deleteClientActivity = id => {

    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_CLIENT_ACTIVITY_REQUEST })
            const res = await Service.deleteClientActivity(id)
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_CLIENT_ACTIVITY_SUCCESS, response: res.data })
                } else {
                    dispatch({ type: actionTypes.DELETE_CLIENT_ACTIVITY_FAILURE, error: res.data })
                }
            } else {
                dispatch({ type: actionTypes.DELETE_CLIENT_ACTIVITY_FAILURE, error: res.data })
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_CLIENT_ACTIVITY_FAILURE, error: e.response && e.response.data })
        }
    }
}

const editClientActivity = (params, id) => {

    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_CLIENT_ACTIVITY_REQUEST })
            const res = await Service.editClientActivity(params, id)
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_CLIENT_ACTIVITY_SUCCESS, response: res.data })
                } else {
                    dispatch({ type: actionTypes.EDIT_CLIENT_ACTIVITY_FAILURE, error: res.data })
                }
            } else {
                dispatch({ type: actionTypes.EDIT_CLIENT_ACTIVITY_FAILURE, error: res.data })
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_CLIENT_ACTIVITY_FAILURE, error: e.response && e.response.data })
        }
    }
}

const getListForCommonFilterForClientActivity = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForClientActivity(params);
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

const getClientActivityById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CLIENT_ACTIVITY_BY_ID_REQUEST });
            const res = await Service.getClientActivityById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_CLIENT_ACTIVITY_BY_ID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_CLIENT_ACTIVITY_BY_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_CLIENT_ACTIVITY_BY_ID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_CLIENT_ACTIVITY_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    }
}

const exportClientActivity = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_CLIENT_ACTIVITY_TABLE_REQUEST });
            const response = await Service.exportClientActivity(params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_CLIENT_ACTIVITY_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.EXPORT_CLIENT_ACTIVITY_TABLE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_CLIENT_ACTIVITY_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllClientActivityLogs = (params,id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_CLIENT_ACTIVITY_LOG_REQUEST });
            const res = await Service.getAllClientActivityLogs(params,id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_CLIENT_ACTIVITY_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_CLIENT_ACTIVITY_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_CLIENT_ACTIVITY_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_CLIENT_ACTIVITY_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const restoreClientActivityLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_CLIENT_ACTIVITY_LOG_REQUEST });
            const res = await Service.restoreClientActivityLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_CLIENT_ACTIVITY_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_CLIENT_ACTIVITY_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_CLIENT_ACTIVITY_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_CLIENT_ACTIVITY_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteClientActivityLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_CLIENT_ACTIVITY_LOG_REQUEST });
            const res = await Service.deleteClientActivityLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_CLIENT_ACTIVITY_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_CLIENT_ACTIVITY_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_CLIENT_ACTIVITY_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_CLIENT_ACTIVITY_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateActivityEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_CLIENT_ACTIVITY_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_CLIENT_ACTIVITY_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

const editClientShiftActivity = (params, id) => {

    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_CLIENT_SHIFT_ACTIVITY_REQUEST })
            const res = await Service.editClientShiftActivity(params, id)
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_CLIENT_SHIFT_ACTIVITY_SUCCESS, response: res.data })
                } else {
                    dispatch({ type: actionTypes.EDIT_CLIENT_SHIFT_ACTIVITY_FAILURE, error: res.data })
                }
            } else {
                dispatch({ type: actionTypes.EDIT_CLIENT_SHIFT_ACTIVITY_FAILURE, error: res.data })
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_CLIENT_SHIFT_ACTIVITY_FAILURE, error: e.response && e.response.data })
        }
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getClientActivityList,
    addClientActivity,
    deleteClientActivity,
    editClientActivity,
    getListForCommonFilterForClientActivity,
    getClientActivityById,
    exportClientActivity,
    getAllClientActivityLogs,
    restoreClientActivityLog,
    deleteClientActivityLog,
    updateActivityEntityParams,
    editClientShiftActivity
}