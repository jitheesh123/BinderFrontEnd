import * as actionTypes from "./constants";
import * as Service from "./services";

const getForm = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_FORM_REQUEST });
            const res = await Service.getForm(params);
            if (res && res.status === 200) {
                const getFormData = res.data;
                if (getFormData) {
                    dispatch({ type: actionTypes.GET_FORM_SUCCESS, response: getFormData });
                } else {
                    dispatch({ type: actionTypes.GET_FORM_FAILURE, error: getFormData });
                }
            } else {
                dispatch({ type: actionTypes.GET_FORM_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_FORM_FAILURE, error: e.response && e.response.data });
        }
    };
};

const addForm = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_FORM_REQUEST });
            const res = await Service.addForm(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_FORM_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ADD_FORM_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ADD_FORM_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_FORM_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteForm = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_FORM_BYID_REQUEST });
            const res = await Service.deleteForm(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_FORM_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_FORM_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_FORM_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_FORM_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const editFormById = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_FORM_BYID_REQUEST });
            const res = await Service.editFormById(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_FORM_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.EDIT_FORM_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.EDIT_FORM_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_FORM_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getListForCommonFilterForForm = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForForm(params);
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

const getFormById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_FORM_BY_ID_REQUEST });
            const res = await Service.getFormById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_FORM_BY_ID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_FORM_BY_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_FORM_BY_ID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_FORM_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const exportForm = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_FORM_TABLE_REQUEST });
            const response = await Service.exportForm(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_FORM_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.EXPORT_FORM_TABLE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_FORM_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllFormLogs = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_FORM_LOG_REQUEST });
            const res = await Service.getAllFormLogs(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_FORM_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_FORM_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_FORM_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_FORM_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const restoreFormLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_FORM_LOG_REQUEST });
            const res = await Service.restoreFormLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_FORM_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_FORM_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_FORM_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_FORM_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteFormLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_FORM_LOG_REQUEST });
            const res = await Service.deleteFormLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_FORM_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_FORM_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_FORM_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_FORM_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateFormEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_FORM_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_FORM_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

const uploadFormRecords = (formData, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPLOAD_RECORD_IN_FORM_REQUEST });
            const res = await Service.uploadFormRecords(formData, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.UPLOAD_RECORD_IN_FORM_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.UPLOAD_RECORD_IN_FORM_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.UPLOAD_RECORD_IN_FORM_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.UPLOAD_RECORD_IN_FORM_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getFormRecords = () => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_FORM_RECORD_REQUEST });
            const res = await Service.getFormRecords();
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_FORM_RECORD_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_FORM_RECORD_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_FORM_RECORD_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_FORM_RECORD_FAILURE, error: e.response && e.response.data });
        }
    };
};

const removeAttachment = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.REMOVE_ATTACHMENT_REQUEST });
            const res = await Service.removeAttachment(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.REMOVE_ATTACHMENT_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.REMOVE_ATTACHMENT_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.REMOVE_ATTACHMENT_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.REMOVE_ATTACHMENT_FAILURE, error: e.response && e.response.data });
        }
    };
};

export default {
    getForm,
    getFormById,
    addForm,
    editFormById,
    deleteForm,
    getListForCommonFilterForForm,
    exportForm,
    getAllFormLogs,
    restoreFormLog,
    deleteFormLog,
    updateFormEntityParams,
    uploadFormRecords,
    getFormRecords,
    removeAttachment
};
