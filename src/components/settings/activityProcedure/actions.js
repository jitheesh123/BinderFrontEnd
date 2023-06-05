import * as actionTypes from "./constants";
import * as Service from "./services";

const getActivityProcedure = (params,id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ACTIVITY_PROCEDURE_REQUEST });
            const res = await Service.getActivityProcedure(params,id);
            if (res && res.status === 200) {
                const getProcedureData = res.data;
                if (getProcedureData) {
                    dispatch({ type: actionTypes.GET_ACTIVITY_PROCEDURE_SUCCESS, response: getProcedureData });
                } else {
                    dispatch({ type: actionTypes.GET_ACTIVITY_PROCEDURE_FAILURE, error: getProcedureData });
                }
            } else {
                dispatch({ type: actionTypes.GET_ACTIVITY_PROCEDURE_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ACTIVITY_PROCEDURE_FAILURE, error: e.response && e.response.data });
        }
    };
};

const addProcedure = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_ACTIVITY_PROCEDURE_REQUEST });
            const res = await Service.addProcedure(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_ACTIVITY_PROCEDURE_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ADD_ACTIVITY_PROCEDURE_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ADD_ACTIVITY_PROCEDURE_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_ACTIVITY_PROCEDURE_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getActivityProcedureById = (id,ProcedureId) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ACTIVITY_PROCEDURE_BYID_REQUEST });
            const res = await Service.getActivityProcedureById(id,ProcedureId);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ACTIVITY_PROCEDURE_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ACTIVITY_PROCEDURE_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ACTIVITY_PROCEDURE_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ACTIVITY_PROCEDURE_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteActivityProcedure = (id,params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_ACTIVITY_PROCEDURE_BYID_REQUEST });
            const res = await Service.deleteActivityProcedure(id,params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_ACTIVITY_PROCEDURE_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_ACTIVITY_PROCEDURE_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_ACTIVITY_PROCEDURE_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_ACTIVITY_PROCEDURE_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const editProcedureById = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_ACTIVITY_PROCEDURE_BYID_REQUEST });
            const res = await Service.editProcedureById(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_ACTIVITY_PROCEDURE_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.EDIT_ACTIVITY_PROCEDURE_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.EDIT_ACTIVITY_PROCEDURE_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_ACTIVITY_PROCEDURE_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getListForCommonFilterForProcedure = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForProcedure(params);
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

const getProcedureById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_PROCEDURE_BY_ID_REQUEST });
            const res = await Service.getProcedureById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_PROCEDURE_BY_ID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_PROCEDURE_BY_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_PROCEDURE_BY_ID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_PROCEDURE_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    }
}
const exportProcedure = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_PROCEDURE_TABLE_REQUEST });
            const response = await Service.exportProcedure(params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_PROCEDURE_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.EXPORT_PROCEDURE_TABLE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_PROCEDURE_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllProcedureLogs = (params,id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_PROCEDURE_LOG_REQUEST });
            const res = await Service.getAllProcedureLogs(params,id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_PROCEDURE_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_PROCEDURE_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_PROCEDURE_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_PROCEDURE_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const restoreProcedureLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_PROCEDURE_LOG_REQUEST });
            const res = await Service.restoreProcedureLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_PROCEDURE_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_PROCEDURE_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_PROCEDURE_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_PROCEDURE_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteProcedureLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_PROCEDURE_LOG_REQUEST });
            const res = await Service.deleteProcedureLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_PROCEDURE_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_PROCEDURE_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_PROCEDURE_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_PROCEDURE_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateProcedureEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_PROCEDURE_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_PROCEDURE_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

export default {
    getActivityProcedure,
    addProcedure,
    getActivityProcedureById,
    editProcedureById,
    deleteActivityProcedure,
    getListForCommonFilterForProcedure,
    getProcedureById,
    exportProcedure,
    getAllProcedureLogs,
    restoreProcedureLog,
    deleteProcedureLog,
    updateProcedureEntityParams
};
