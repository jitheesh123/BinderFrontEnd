import * as actionTypes from "./constants";
import * as Service from "./services";

const getCampuses = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CAMPUSES_REQUEST });
            const res = await Service.getCampuses(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_CAMPUSES_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_CAMPUSES_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_CAMPUSES_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_CAMPUSES_FAILURE, error: e.response && e.response.data });
        }
    };
};

const addCampus = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_CAMPUSES_REQUEST });
            const res = await Service.addCampus(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_CAMPUSES_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ADD_CAMPUSES_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ADD_CAMPUSES_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_CAMPUSES_FAILURE, error: e.response && e.response.data });
        }
    };
};

const editCampusById = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_CAMPUSES_BYID_REQUEST });
            const res = await Service.editCampusById(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_CAMPUSES_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.EDIT_CAMPUSES_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.EDIT_CAMPUSES_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_CAMPUSES_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteCampus = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_CAMPUSES_BYID_REQUEST });
            const res = await Service.deleteCampus(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_CAMPUSES_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_CAMPUSES_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_CAMPUSES_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_CAMPUSES_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getListForCommonFilterForCampus = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForCampus(params);
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

const getCampusById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CAMPUS_BY_ID_REQUEST });
            const res = await Service.getCampusById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_CAMPUS_BY_ID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_CAMPUS_BY_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_CAMPUS_BY_ID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_CAMPUS_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    }
}
const exportCampus = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_CAMPUSES_TABLE_REQUEST });
            const response = await Service.exportCampus(params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_CAMPUSES_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.EXPORT_CAMPUSES_TABLE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_CAMPUSES_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllCampusLogs = (params,id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_CAMPUS_LOG_REQUEST });
            const res = await Service.getAllCampusLogs(params,id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_CAMPUS_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_CAMPUS_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_CAMPUS_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_CAMPUS_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const restoreCampusLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_CAMPUS_LOG_REQUEST });
            const res = await Service.restoreCampusLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_CAMPUS_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_CAMPUS_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_CAMPUS_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_CAMPUS_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteCampusLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_CAMPUS_LOG_REQUEST });
            const res = await Service.deleteCampusLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_CAMPUS_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_CAMPUS_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_CAMPUS_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_CAMPUS_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateCampusEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_CAMPUS_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_CAMPUS_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

export default {
    getCampuses,
    addCampus,
    editCampusById,
    deleteCampus,
    getListForCommonFilterForCampus,
    getCampusById,
    exportCampus,
    getAllCampusLogs,
    restoreCampusLog,
    deleteCampusLog,
    updateCampusEntityParams
};
