import * as actionTypes from './constants'
import * as Service from './services'

const getConsultancyActivityList = (params, path) => {

    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CONSULTANCY_ACTIVITY_LIST_REQUEST })
            const res = await Service.getConsultancyActivityList(params, path)
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_CONSULTANCY_ACTIVITY_LIST_SUCCESS, response: res.data })
                } else {
                    dispatch({ type: actionTypes.GET_CONSULTANCY_ACTIVITY_LIST_FAILURE, error: res.data })
                }
            } else {
                dispatch({ type: actionTypes.GET_CONSULTANCY_ACTIVITY_LIST_FAILURE, error: res.data })
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_CONSULTANCY_ACTIVITY_LIST_FAILURE, error: e.response && e.response.data })
        }
    }
}

const addConsultancyActivity = params => {

    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_CONSULTANCY_ACTIVITY_REQUEST })
            const res = await Service.addConsultancyActivity(params)
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_CONSULTANCY_ACTIVITY_SUCCESS, response: res.data })
                } else {
                    dispatch({ type: actionTypes.ADD_CONSULTANCY_ACTIVITY_FAILURE, error: res.data })
                }
            } else {
                dispatch({ type: actionTypes.ADD_CONSULTANCY_ACTIVITY_FAILURE, error: res.data })
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_CONSULTANCY_ACTIVITY_FAILURE, error: e.response && e.response.data })
        }
    }
}

const deleteConsultancyActivity = id => {

    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_CONSULTANCY_ACTIVITY_REQUEST })
            const res = await Service.deleteConsultancyActivity(id)
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_CONSULTANCY_ACTIVITY_SUCCESS, response: res.data })
                } else {
                    dispatch({ type: actionTypes.DELETE_CONSULTANCY_ACTIVITY_FAILURE, error: res.data })
                }
            } else {
                dispatch({ type: actionTypes.DELETE_CONSULTANCY_ACTIVITY_FAILURE, error: res.data })
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_CONSULTANCY_ACTIVITY_FAILURE, error: e.response && e.response.data })
        }
    }
}

const editConsultancyActivity = (params, id) => {

    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_CONSULTANCY_ACTIVITY_REQUEST })
            const res = await Service.editConsultancyActivity(params, id)
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_CONSULTANCY_ACTIVITY_SUCCESS, response: res.data })
                } else {
                    dispatch({ type: actionTypes.EDIT_CONSULTANCY_ACTIVITY_FAILURE, error: res.data })
                }
            } else {
                dispatch({ type: actionTypes.EDIT_CONSULTANCY_ACTIVITY_FAILURE, error: res.data })
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_CONSULTANCY_ACTIVITY_FAILURE, error: e.response && e.response.data })
        }
    }
}

const getListForCommonFilterForConsultancyActivity = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForConsultancyActivity(params);
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

const getConsultancyActivityById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CONSULTANCY_ACTIVITY_BY_ID_REQUEST });
            const res = await Service.getConsultancyActivityById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_CONSULTANCY_ACTIVITY_BY_ID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_CONSULTANCY_ACTIVITY_BY_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_CONSULTANCY_ACTIVITY_BY_ID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_CONSULTANCY_ACTIVITY_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    }
}

const exportConsultancyActivity = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_CONSULTANCY_ACTIVITY_TABLE_REQUEST });
            const response = await Service.exportConsultancyActivity(params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_CONSULTANCY_ACTIVITY_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.EXPORT_CONSULTANCY_ACTIVITY_TABLE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_CONSULTANCY_ACTIVITY_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllConsultancyActivityLogs = (params,id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_ACTIVITY_LOG_REQUEST });
            const res = await Service.getAllConsultancyActivityLogs(params,id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_ACTIVITY_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_ACTIVITY_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_ACTIVITY_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_ACTIVITY_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const restoreConsultancyActivityLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_CONSULTANCY_ACTIVITY_LOG_REQUEST });
            const res = await Service.restoreConsultancyActivityLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_CONSULTANCY_ACTIVITY_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_CONSULTANCY_ACTIVITY_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_CONSULTANCY_ACTIVITY_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_CONSULTANCY_ACTIVITY_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteConsultancyActivityLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_CONSULTANCY_ACTIVITY_LOG_REQUEST });
            const res = await Service.deleteConsultancyActivityLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_CONSULTANCY_ACTIVITY_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_CONSULTANCY_ACTIVITY_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_CONSULTANCY_ACTIVITY_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_CONSULTANCY_ACTIVITY_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateActivityEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_CONSULTANCY_ACTIVITY_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_CONSULTANCY_ACTIVITY_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getConsultancyActivityList,
    addConsultancyActivity,
    deleteConsultancyActivity,
    editConsultancyActivity,
    getListForCommonFilterForConsultancyActivity,
    getConsultancyActivityById,
    exportConsultancyActivity,
    getAllConsultancyActivityLogs,
    restoreConsultancyActivityLog,
    deleteConsultancyActivityLog,
    updateActivityEntityParams
}