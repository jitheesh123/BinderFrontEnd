import * as actionTypes from "./constants";
import * as Service from "./services";

const getActivityList = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ACTIVITY_LIST_REQUEST });
            const res = await Service.getActivityList(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ACTIVITY_LIST_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ACTIVITY_LIST_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ACTIVITY_LIST_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ACTIVITY_LIST_FAILURE, error: e.response && e.response.data });
        }
    };
};

const addActivity = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_ACTIVITY_REQUEST });
            const res = await Service.addActivity(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_ACTIVITY_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ADD_ACTIVITY_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ADD_ACTIVITY_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_ACTIVITY_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteActivity = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_ACTIVITY_REQUEST });
            const res = await Service.deleteActivity(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_ACTIVITY_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_ACTIVITY_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_ACTIVITY_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_ACTIVITY_FAILURE, error: e.response && e.response.data });
        }
    };
};

const editActivity = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_ACTIVITY_REQUEST });
            const res = await Service.editActivity(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_ACTIVITY_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.EDIT_ACTIVITY_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.EDIT_ACTIVITY_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_ACTIVITY_FAILURE, error: e.response && e.response.data });
        }
    };
};
const pushActivity = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.PUSH_ACTIVITY_REQUEST });
            const res = await Service.pushActivity(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.PUSH_ACTIVITY_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.PUSH_ACTIVITY_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.PUSH_ACTIVITY_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.PUSH_ACTIVITY_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getListForCommonFilterForActivity = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForActivity(params);
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

const getActivityById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ACTIVITY_BY_ID_REQUEST });
            const res = await Service.getActivityById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ACTIVITY_BY_ID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ACTIVITY_BY_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ACTIVITY_BY_ID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ACTIVITY_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const exportActivity = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_ACTIVITY_TABLE_REQUEST });
            const response = await Service.exportActivity(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_ACTIVITY_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.EXPORT_ACTIVITY_TABLE_SUCCESS, response: {} });
                }
            }
            const { data } = response;
            const name = response.headers["content-disposition"].split("filename=");
            const fileName = name[1].split('"')[1];
            const downloadUrl = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", `${fileName}`); //any other extension
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            dispatch({
                type: actionTypes.EXPORT_ACTIVITY_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllActivityLogs = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_ACTIVITY_LOG_REQUEST });
            const res = await Service.getAllActivityLogs(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_ACTIVITY_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_ACTIVITY_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_ACTIVITY_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_ACTIVITY_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const restoreActivityLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_ACTIVITY_LOG_REQUEST });
            const res = await Service.restoreActivityLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_ACTIVITY_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_ACTIVITY_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_ACTIVITY_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_ACTIVITY_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteActivityLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_ACTIVITY_LOG_REQUEST });
            const res = await Service.deleteActivityLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_ACTIVITY_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_ACTIVITY_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_ACTIVITY_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_ACTIVITY_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateActivityEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_ACTIVITY_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_ACTIVITY_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

const getAssignFormToActivityPopupDetails = activity_id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSIGN_FORM_TO_ACTIVITY_POPUP_REQUEST });
            const res = await Service.getAssignFormToActivityPopupDetails(activity_id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ASSIGN_FORM_TO_ACTIVITY_POPUP_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ASSIGN_FORM_TO_ACTIVITY_POPUP_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ASSIGN_FORM_TO_ACTIVITY_POPUP_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ASSIGN_FORM_TO_ACTIVITY_POPUP_FAILURE, error: e.response && e.response.data });
        }
    };
};

const assignFormToActivity = (id, user_ids) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_FORM_TO_ACTIVITY_REQUEST });
            const res = await Service.assignFormToActivity(id, user_ids);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ASSIGN_FORM_TO_ACTIVITY_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ASSIGN_FORM_TO_ACTIVITY_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ASSIGN_FORM_TO_ACTIVITY_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ASSIGN_FORM_TO_ACTIVITY_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getLinkedActivityList = (logbook_id, deeming_agency_id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LINKED_ACTIVITY_LIST_REQUEST });
            const res = await Service.getLinkedActivityList(logbook_id, deeming_agency_id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_LINKED_ACTIVITY_LIST_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_LINKED_ACTIVITY_LIST_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_LINKED_ACTIVITY_LIST_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_LINKED_ACTIVITY_LIST_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getCategoryDropdown = () => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CATEGORY_DROPDOWN_REQUEST });
            const res = await Service.getCategoryDropdown();
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_CATEGORY_DROPDOWN_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_CATEGORY_DROPDOWN_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_CATEGORY_DROPDOWN_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_CATEGORY_DROPDOWN_FAILURE, error: e.response && e.response.data });
        }
    };
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getActivityList,
    addActivity,
    deleteActivity,
    editActivity,
    getListForCommonFilterForActivity,
    getActivityById,
    exportActivity,
    getAllActivityLogs,
    restoreActivityLog,
    deleteActivityLog,
    updateActivityEntityParams,
    getAssignFormToActivityPopupDetails,
    assignFormToActivity,
    getLinkedActivityList,
    getCategoryDropdown,
    pushActivity
};
