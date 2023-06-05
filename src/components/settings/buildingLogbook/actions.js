import * as actionTypes from "./constants";
import * as Service from "./services";

const getBuildingLogbook = (params, path) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_BUILDING_LOGBOOK_REQUEST });
            const res = await Service.getBuildingLogbook(params, path);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_BUILDING_LOGBOOK_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_BUILDING_LOGBOOK_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_BUILDING_LOGBOOK_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_BUILDING_LOGBOOK_FAILURE, error: e.response && e.response.data });
        }
    };
};

const addBuildingLogbook = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_BUILDING_LOGBOOK_REQUEST });
            const res = await Service.addBuildingLogbook(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_BUILDING_LOGBOOK_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ADD_BUILDING_LOGBOOK_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ADD_BUILDING_LOGBOOK_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_BUILDING_LOGBOOK_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteBuildingLogbook = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_BUILDING_LOGBOOK_REQUEST });
            const res = await Service.deleteBuildingLogbook(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_BUILDING_LOGBOOK_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_BUILDING_LOGBOOK_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_BUILDING_LOGBOOK_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_BUILDING_LOGBOOK_FAILURE, error: e.response && e.response.data });
        }
    };
};

const editBuildingLogbook = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_BUILDING_LOGBOOK_REQUEST });
            const res = await Service.editBuildingLogbook(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_BUILDING_LOGBOOK_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.EDIT_BUILDING_LOGBOOK_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.EDIT_BUILDING_LOGBOOK_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_BUILDING_LOGBOOK_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getListForCommonFilterForBuildingLogbook = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForBuildingLogbook(params);
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

const getBuildingLogbookById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_BUILDING_LOGBOOK_BY_ID_REQUEST });
            const res = await Service.getBuildingLogbookById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_BUILDING_LOGBOOK_BY_ID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_BUILDING_LOGBOOK_BY_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_BUILDING_LOGBOOK_BY_ID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_BUILDING_LOGBOOK_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const exportBuildingLogbook = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_BUILDING_LOGBOOK_TABLE_REQUEST });
            const response = await Service.exportBuildingLogbook(params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_BUILDING_LOGBOOK_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.EXPORT_BUILDING_LOGBOOK_TABLE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_BUILDING_LOGBOOK_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllBuildingLogbookLogs = (params,id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_BUILDING_LOGBOOK_LOG_REQUEST });
            const res = await Service.getAllBuildingLogbookLogs(params,id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_BUILDING_LOGBOOK_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_BUILDING_LOGBOOK_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_BUILDING_LOGBOOK_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_BUILDING_LOGBOOK_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const restoreBuildingLogbookLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_BUILDING_LOGBOOK_LOG_REQUEST });
            const res = await Service.restoreBuildingLogbookLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_BUILDING_LOGBOOK_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_BUILDING_LOGBOOK_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_BUILDING_LOGBOOK_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_BUILDING_LOGBOOK_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteBuildingLogbookLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_BUILDING_LOGBOOK_LOG_REQUEST });
            const res = await Service.deleteBuildingLogbookLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_BUILDING_LOGBOOK_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_BUILDING_LOGBOOK_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_BUILDING_LOGBOOK_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_BUILDING_LOGBOOK_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateBuildingLogbookEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_BUILDING_LOGBOOK_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_BUILDING_LOGBOOK_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};


export default {
    getBuildingLogbook,
    addBuildingLogbook,
    deleteBuildingLogbook,
    editBuildingLogbook,
    getListForCommonFilterForBuildingLogbook,
    getBuildingLogbookById,
    exportBuildingLogbook,
    getAllBuildingLogbookLogs,
    restoreBuildingLogbookLog,
    deleteBuildingLogbookLog,
    updateBuildingLogbookEntityParams
};
