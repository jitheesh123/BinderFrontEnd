import * as actionTypes from "./constants";
import * as Service from "./services";

const getConsultancyLogbook = (params, path) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CONSULTANCY_LOGBOOK_REQUEST });
            const res = await Service.getConsultancyLogbook(params, path);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_CONSULTANCY_LOGBOOK_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_CONSULTANCY_LOGBOOK_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_CONSULTANCY_LOGBOOK_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_CONSULTANCY_LOGBOOK_FAILURE, error: e.response && e.response.data });
        }
    };
};

const addConsultancyLogbook = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_CONSULTANCY_LOGBOOK_REQUEST });
            const res = await Service.addConsultancyLogbook(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_CONSULTANCY_LOGBOOK_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ADD_CONSULTANCY_LOGBOOK_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ADD_CONSULTANCY_LOGBOOK_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_CONSULTANCY_LOGBOOK_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteConsultancyLogbook = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_CONSULTANCY_LOGBOOK_REQUEST });
            const res = await Service.deleteConsultancyLogbook(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_CONSULTANCY_LOGBOOK_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_CONSULTANCY_LOGBOOK_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_CONSULTANCY_LOGBOOK_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_CONSULTANCY_LOGBOOK_FAILURE, error: e.response && e.response.data });
        }
    };
};

const editConsultancyLogbook = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_CONSULTANCY_LOGBOOK_REQUEST });
            const res = await Service.editConsultancyLogbook(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_CONSULTANCY_LOGBOOK_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.EDIT_CONSULTANCY_LOGBOOK_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.EDIT_CONSULTANCY_LOGBOOK_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_CONSULTANCY_LOGBOOK_FAILURE, error: e.response && e.response.data });
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

const getConsultancyLogbookById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CONSULTANCY_LOGBOOK_BY_ID_REQUEST });
            const res = await Service.getConsultancyLogbookById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_CONSULTANCY_LOGBOOK_BY_ID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_CONSULTANCY_LOGBOOK_BY_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_CONSULTANCY_LOGBOOK_BY_ID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_CONSULTANCY_LOGBOOK_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const exportConsultancyLogbook = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_CONSULTANCY_LOGBOOK_TABLE_REQUEST });
            const response = await Service.exportConsultancyLogbook(params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_CONSULTANCY_LOGBOOK_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.EXPORT_CONSULTANCY_LOGBOOK_TABLE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_CONSULTANCY_LOGBOOK_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllConsultancyLogbookLogs = (params,id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_LOGBOOK_LOG_REQUEST });
            const res = await Service.getAllConsultancyLogbookLogs(params,id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_LOGBOOK_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_LOGBOOK_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_LOGBOOK_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_LOGBOOK_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const restoreConsultancyLogbookLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_CONSULTANCY_LOGBOOK_LOG_REQUEST });
            const res = await Service.restoreConsultancyLogbookLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_CONSULTANCY_LOGBOOK_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_CONSULTANCY_LOGBOOK_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_CONSULTANCY_LOGBOOK_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_CONSULTANCY_LOGBOOK_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteConsultancyLogbookLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_CONSULTANCY_LOGBOOK_LOG_REQUEST });
            const res = await Service.deleteConsultancyLogbookLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_CONSULTANCY_LOGBOOK_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_CONSULTANCY_LOGBOOK_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_CONSULTANCY_LOGBOOK_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_CONSULTANCY_LOGBOOK_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateLogbookEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_CONSULTANCY_LOGBOOK_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_CONSULTANCY_LOGBOOK_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};


export default {
    getConsultancyLogbook,
    addConsultancyLogbook,
    deleteConsultancyLogbook,
    editConsultancyLogbook,
    getListForCommonFilterForLogbook,
    getConsultancyLogbookById,
    exportConsultancyLogbook,
    getAllConsultancyLogbookLogs,
    restoreConsultancyLogbookLog,
    deleteConsultancyLogbookLog,
    updateLogbookEntityParams
};
