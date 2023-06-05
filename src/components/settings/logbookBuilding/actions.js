import * as actionTypes from "./constants";
import * as Service from "./services";

const getLogbookBuildingData = (params,id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LOGBOOK_BUILDING_REQUEST });
            const res = await Service.getLogbookBuildingData(params,id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_LOGBOOK_BUILDING_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_LOGBOOK_BUILDING_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_LOGBOOK_BUILDING_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_LOGBOOK_BUILDING_FAILURE, error: e.response && e.response.data });
        }
    };
};

const addBuilding = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_LOGBOOK_BUILDING_REQUEST });
            const res = await Service.addBuilding(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_LOGBOOK_BUILDING_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ADD_LOGBOOK_BUILDING_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ADD_LOGBOOK_BUILDING_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_LOGBOOK_BUILDING_FAILURE, error: e.response && e.response.data });
        }
    };
};

const editBuilding = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_LOGBOOK_BUILDING_REQUEST });
            const res = await Service.editBuilding(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_LOGBOOK_BUILDING_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.EDIT_LOGBOOK_BUILDING_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.EDIT_LOGBOOK_BUILDING_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_LOGBOOK_BUILDING_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteLogbookBuilding = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_LOGBOOK_BUILDING_REQUEST });
            const res = await Service.deleteLogbookBuilding(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_LOGBOOK_BUILDING_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_LOGBOOK_BUILDING_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_LOGBOOK_BUILDING_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_LOGBOOK_BUILDING_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getListForCommonFilterForBuilding = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForBuilding(params);
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

const getLogbookBuildingById = (id,buildingId) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LOGBOOK_BUILDING_BY_ID_REQUEST });
            const res = await Service.getLogbookBuildingById(id,buildingId);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_LOGBOOK_BUILDING_BY_ID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_LOGBOOK_BUILDING_BY_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_LOGBOOK_BUILDING_BY_ID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_LOGBOOK_BUILDING_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    }
}
const exportBuilding = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_LOGBOOK_BUILDING_TABLE_REQUEST });
            const response = await Service.exportBuilding(params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_LOGBOOK_BUILDING_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.EXPORT_LOGBOOK_BUILDING_TABLE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_LOGBOOK_BUILDING_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllBuildingLogs = (params,id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_LOGBOOK_BUILDING_LOG_REQUEST });
            const res = await Service.getAllBuildingLogs(params,id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_LOGBOOK_BUILDING_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_LOGBOOK_BUILDING_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_LOGBOOK_BUILDING_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_LOGBOOK_BUILDING_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const restoreBuildingLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_LOGBOOK_BUILDING_LOG_REQUEST });
            const res = await Service.restoreBuildingLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_LOGBOOK_BUILDING_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_LOGBOOK_BUILDING_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_LOGBOOK_BUILDING_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_LOGBOOK_BUILDING_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteBuildingLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_LOGBOOK_BUILDING_LOG_REQUEST });
            const res = await Service.deleteBuildingLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_LOGBOOK_BUILDING_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_LOGBOOK_BUILDING_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_LOGBOOK_BUILDING_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_LOGBOOK_BUILDING_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateBuildingEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_LOGBOOK_BUILDING_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_LOGBOOK_BUILDING_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

export default {
    getLogbookBuildingData,
    addBuilding,
    editBuilding,
    deleteLogbookBuilding,
    getListForCommonFilterForBuilding,
    getLogbookBuildingById,
    exportBuilding,
    getAllBuildingLogs,
    restoreBuildingLog,
    deleteBuildingLog,
    updateBuildingEntityParams
};
