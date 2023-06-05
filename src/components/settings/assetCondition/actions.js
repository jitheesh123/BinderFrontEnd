import * as actionTypes from "./constants";
import * as Service from "./services";

const getAssetCondition = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSET_CONDITION_REQUEST });
            const res = await Service.getAssetCondition(params);
            if (res && res.status === 200) {
                const getAssetConditionData = res.data;
                if (getAssetConditionData) {
                    dispatch({ type: actionTypes.GET_ASSET_CONDITION_SUCCESS, response: getAssetConditionData });
                } else {
                    dispatch({ type: actionTypes.GET_ASSET_CONDITION_FAILURE, error: getAssetConditionData });
                }
            } else {
                dispatch({ type: actionTypes.GET_ASSET_CONDITION_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ASSET_CONDITION_FAILURE, error: e.response && e.response.data });
        }
    };
};

const addAssetCondition = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_ASSET_CONDITION_REQUEST });
            const res = await Service.addAssetCondition(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_ASSET_CONDITION_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ADD_ASSET_CONDITION_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ADD_ASSET_CONDITION_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_ASSET_CONDITION_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteAssetCondition = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_ASSET_CONDITION_BYID_REQUEST });
            const res = await Service.deleteAssetCondition(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_ASSET_CONDITION_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_ASSET_CONDITION_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_ASSET_CONDITION_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_ASSET_CONDITION_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const editAssetConditionById = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_ASSET_CONDITION_BYID_REQUEST });
            const res = await Service.editAssetConditionById(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_ASSET_CONDITION_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.EDIT_ASSET_CONDITION_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.EDIT_ASSET_CONDITION_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_ASSET_CONDITION_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getListForCommonFilterForAssetCondition = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForAssetCondition(params);
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

const getAssetConditionById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSET_CONDITION_BY_ID_REQUEST });
            const res = await Service.getAssetConditionById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ASSET_CONDITION_BY_ID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ASSET_CONDITION_BY_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ASSET_CONDITION_BY_ID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ASSET_CONDITION_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    }
}
const exportAssetCondition = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_ASSET_CONDITION_TABLE_REQUEST });
            const response = await Service.exportAssetCondition(params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_ASSET_CONDITION_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.EXPORT_ASSET_CONDITION_TABLE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_ASSET_CONDITION_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllAssetConditionLogs = (params,id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_ASSET_CONDITION_LOG_REQUEST });
            const res = await Service.getAllAssetConditionLogs(params,id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_ASSET_CONDITION_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_ASSET_CONDITION_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_ASSET_CONDITION_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_ASSET_CONDITION_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const restoreAssetConditionLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_ASSET_CONDITION_LOG_REQUEST });
            const res = await Service.restoreAssetConditionLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_ASSET_CONDITION_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_ASSET_CONDITION_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_ASSET_CONDITION_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_ASSET_CONDITION_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteAssetConditionLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_ASSET_CONDITION_LOG_REQUEST });
            const res = await Service.deleteAssetConditionLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_ASSET_CONDITION_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_ASSET_CONDITION_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_ASSET_CONDITION_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_ASSET_CONDITION_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateAssetConditionEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_ASSET_CONDITION_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_ASSET_CONDITION_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

export default {
    getAssetCondition,
    getAssetConditionById,
    addAssetCondition,
    editAssetConditionById,
    deleteAssetCondition,
    getListForCommonFilterForAssetCondition,
    exportAssetCondition,
    getAllAssetConditionLogs,
    restoreAssetConditionLog,
    deleteAssetConditionLog,
    updateAssetConditionEntityParams
};
