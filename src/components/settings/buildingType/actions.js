import * as actionTypes from "./constants";
import * as Service from "./services";

const getBuildingType = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_BUILDING_TYPE_REQUEST });
            const res = await Service.getBuildingType(params);
            if (res && res.status === 200) {
                const getBuildingTypeData = res.data;
                if (getBuildingTypeData) {
                    dispatch({ type: actionTypes.GET_BUILDING_TYPE_SUCCESS, response: getBuildingTypeData });
                } else {
                    dispatch({ type: actionTypes.GET_BUILDING_TYPE_FAILURE, error: getBuildingTypeData });
                }
            } else {
                dispatch({ type: actionTypes.GET_BUILDING_TYPE_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_BUILDING_TYPE_FAILURE, error: e.response && e.response.data });
        }
    };
};

const addBuildingType = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_BUILDING_TYPE_REQUEST });
            const res = await Service.addBuildingType(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_BUILDING_TYPE_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ADD_BUILDING_TYPE_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ADD_BUILDING_TYPE_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_BUILDING_TYPE_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteBuildingType = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_BUILDING_TYPE_BYID_REQUEST });
            const res = await Service.deleteBuildingType(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_BUILDING_TYPE_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_BUILDING_TYPE_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_BUILDING_TYPE_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_BUILDING_TYPE_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const editBuildingTypeById = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_BUILDING_TYPE_BYID_REQUEST });
            const res = await Service.editBuildingTypeById(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_BUILDING_TYPE_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.EDIT_BUILDING_TYPE_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.EDIT_BUILDING_TYPE_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_BUILDING_TYPE_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getListForCommonFilterForBuildingType = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForBuildingType(params);
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

const getBuildingTypeById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_BUILDING_TYPE_BY_ID_REQUEST });
            const res = await Service.getBuildingTypeById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_BUILDING_TYPE_BY_ID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_BUILDING_TYPE_BY_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_BUILDING_TYPE_BY_ID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_BUILDING_TYPE_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    }
}
const exportBuildingType = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_BUILDING_TYPE_TABLE_REQUEST });
            const response = await Service.exportBuildingType(params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_BUILDING_TYPE_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.EXPORT_BUILDING_TYPE_TABLE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_BUILDING_TYPE_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllBuildingTypeLogs = (params,id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_BUILDING_TYPE_LOG_REQUEST });
            const res = await Service.getAllBuildingTypeLogs(params,id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_BUILDING_TYPE_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_BUILDING_TYPE_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_BUILDING_TYPE_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_BUILDING_TYPE_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const restoreBuildingTypeLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_BUILDING_TYPE_LOG_REQUEST });
            const res = await Service.restoreBuildingTypeLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_BUILDING_TYPE_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_BUILDING_TYPE_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_BUILDING_TYPE_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_BUILDING_TYPE_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteBuildingTypeLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_BUILDING_TYPE_LOG_REQUEST });
            const res = await Service.deleteBuildingTypeLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_BUILDING_TYPE_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_BUILDING_TYPE_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_BUILDING_TYPE_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_BUILDING_TYPE_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateBuildingTypeEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_BUILDING_TYPE_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_BUILDING_TYPE_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

export default {
    getBuildingType,
    getBuildingTypeById,
    addBuildingType,
    editBuildingTypeById,
    deleteBuildingType,
    getListForCommonFilterForBuildingType,
    exportBuildingType,
    getAllBuildingTypeLogs,
    restoreBuildingTypeLog,
    deleteBuildingTypeLog,
    updateBuildingTypeEntityParams
};
