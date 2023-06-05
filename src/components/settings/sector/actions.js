import * as actionTypes from "./constants";
import * as Service from "./services";

const getSector = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SECTOR_REQUEST });
            const res = await Service.getSector(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_SECTOR_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_SECTOR_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_SECTOR_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_SECTOR_FAILURE, error: e.response && e.response.data });
        }
    };
};
const addSector = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_SECTOR_REQUEST });
            const res = await Service.addSector(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_SECTOR_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ADD_SECTOR_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ADD_SECTOR_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_SECTOR_FAILURE, error: e.response && e.response.data });
        }
    };
};

const editSectorById = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_SECTOR_BYID_REQUEST });
            const res = await Service.editSectorById(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_SECTOR_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.EDIT_SECTOR_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.EDIT_SECTOR_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_SECTOR_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteSector = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_SECTOR_BYID_REQUEST });
            const res = await Service.deleteSector(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_SECTOR_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_SECTOR_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_SECTOR_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_SECTOR_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getListForCommonFilterForSector = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForSector(params);
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

const getSectorById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SECTOR_BY_ID_REQUEST });
            const res = await Service.getSectorById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_SECTOR_BY_ID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_SECTOR_BY_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_SECTOR_BY_ID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_SECTOR_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    }
}
const exportSector = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_SECTOR_TABLE_REQUEST });
            const response = await Service.exportSector(params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_SECTOR_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.EXPORT_SECTOR_TABLE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_SECTOR_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllSectorLogs = (params,id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_SECTOR_LOG_REQUEST });
            const res = await Service.getAllSectorLogs(params,id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_SECTOR_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_SECTOR_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_SECTOR_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_SECTOR_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const restoreSectorLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_SECTOR_LOG_REQUEST });
            const res = await Service.restoreSectorLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_SECTOR_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_SECTOR_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_SECTOR_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_SECTOR_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteSectorLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_SECTOR_LOG_REQUEST });
            const res = await Service.deleteSectorLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_SECTOR_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_SECTOR_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_SECTOR_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_SECTOR_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateSectorEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_SECTOR_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_SECTOR_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

export default {
    getSector,
    addSector,
    editSectorById,
    deleteSector,
    getListForCommonFilterForSector,
    getSectorById,
    exportSector,
    getAllSectorLogs,
    restoreSectorLog,
    deleteSectorLog,
    updateSectorEntityParams
};
