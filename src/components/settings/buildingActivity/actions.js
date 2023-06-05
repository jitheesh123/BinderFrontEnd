import * as actionTypes from './constants'
import * as Service from './services'

const getBuildingActivityList = (params, path) => {

    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_BUILDING_ACTIVITY_LIST_REQUEST })
            const res = await Service.getBuildingActivityList(params, path)
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_BUILDING_ACTIVITY_LIST_SUCCESS, response: res.data })
                } else {
                    dispatch({ type: actionTypes.GET_BUILDING_ACTIVITY_LIST_FAILURE, error: res.data })
                }
            } else {
                dispatch({ type: actionTypes.GET_BUILDING_ACTIVITY_LIST_FAILURE, error: res.data })
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_BUILDING_ACTIVITY_LIST_FAILURE, error: e.response && e.response.data })
        }
    }
}

const addBuildingActivity = params => {

    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_BUILDING_ACTIVITY_REQUEST })
            const res = await Service.addBuildingActivity(params)
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_BUILDING_ACTIVITY_SUCCESS, response: res.data })
                } else {
                    dispatch({ type: actionTypes.ADD_BUILDING_ACTIVITY_FAILURE, error: res.data })
                }
            } else {
                dispatch({ type: actionTypes.ADD_BUILDING_ACTIVITY_FAILURE, error: res.data })
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_BUILDING_ACTIVITY_FAILURE, error: e.response && e.response.data })
        }
    }
}

const deleteBuildingActivity = id => {

    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_BUILDING_ACTIVITY_REQUEST })
            const res = await Service.deleteBuildingActivity(id)
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_BUILDING_ACTIVITY_SUCCESS, response: res.data })
                } else {
                    dispatch({ type: actionTypes.DELETE_BUILDING_ACTIVITY_FAILURE, error: res.data })
                }
            } else {
                dispatch({ type: actionTypes.DELETE_BUILDING_ACTIVITY_FAILURE, error: res.data })
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_BUILDING_ACTIVITY_FAILURE, error: e.response && e.response.data })
        }
    }
}

const editBuildingActivity = (params, id) => {

    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_BUILDING_ACTIVITY_REQUEST })
            const res = await Service.editBuildingActivity(params, id)
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_BUILDING_ACTIVITY_SUCCESS, response: res.data })
                } else {
                    dispatch({ type: actionTypes.EDIT_BUILDING_ACTIVITY_FAILURE, error: res.data })
                }
            } else {
                dispatch({ type: actionTypes.EDIT_BUILDING_ACTIVITY_FAILURE, error: res.data })
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_BUILDING_ACTIVITY_FAILURE, error: e.response && e.response.data })
        }
    }
}

const getListForCommonFilterForBuildingActivity = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForBuildingActivity(params);
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

const getBuildingActivityById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_BUILDING_ACTIVITY_BY_ID_REQUEST });
            const res = await Service.getBuildingActivityById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_BUILDING_ACTIVITY_BY_ID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_BUILDING_ACTIVITY_BY_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_BUILDING_ACTIVITY_BY_ID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_BUILDING_ACTIVITY_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    }
}

const exportBuildingActivity = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_BUILDING_ACTIVITY_TABLE_REQUEST });
            const response = await Service.exportBuildingActivity(params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_BUILDING_ACTIVITY_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.EXPORT_BUILDING_ACTIVITY_TABLE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_BUILDING_ACTIVITY_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllBuildingActivityLogs = (params,id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_BUILDING_ACTIVITY_LOG_REQUEST });
            const res = await Service.getAllBuildingActivityLogs(params,id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_BUILDING_ACTIVITY_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_BUILDING_ACTIVITY_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_BUILDING_ACTIVITY_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_BUILDING_ACTIVITY_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const restoreBuildingActivityLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_BUILDING_ACTIVITY_LOG_REQUEST });
            const res = await Service.restoreBuildingActivityLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_BUILDING_ACTIVITY_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_BUILDING_ACTIVITY_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_BUILDING_ACTIVITY_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_BUILDING_ACTIVITY_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteBuildingActivityLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_BUILDING_ACTIVITY_LOG_REQUEST });
            const res = await Service.deleteBuildingActivityLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_BUILDING_ACTIVITY_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_BUILDING_ACTIVITY_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_BUILDING_ACTIVITY_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_BUILDING_ACTIVITY_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};


const updateActivityEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_BUILDING_ACTIVITY_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_BUILDING_ACTIVITY_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

const editBuildingShiftActivity = (params, id) => {

    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_BUILDING_SHIFT_ACTIVITY_REQUEST })
            const res = await Service.editBuildingShiftActivity(params, id)
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_BUILDING_SHIFT_ACTIVITY_SUCCESS, response: res.data })
                } else {
                    dispatch({ type: actionTypes.EDIT_BUILDING_SHIFT_ACTIVITY_FAILURE, error: res.data })
                }
            } else {
                dispatch({ type: actionTypes.EDIT_BUILDING_SHIFT_ACTIVITY_FAILURE, error: res.data })
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_BUILDING_SHIFT_ACTIVITY_FAILURE, error: e.response && e.response.data })
        }
    }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getBuildingActivityList,
    addBuildingActivity,
    deleteBuildingActivity,
    editBuildingActivity,
    getListForCommonFilterForBuildingActivity,
    getBuildingActivityById,
    exportBuildingActivity,
    getAllBuildingActivityLogs,
    restoreBuildingActivityLog,
    deleteBuildingActivityLog,
    updateActivityEntityParams,
    editBuildingShiftActivity
}