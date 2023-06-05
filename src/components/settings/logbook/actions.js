import * as actionTypes from "./constants";
import * as Service from "./services";

const getLogbook = (params, path) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LOGBOOK_REQUEST });
            const res = await Service.getLogbook(params, path);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_LOGBOOK_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_LOGBOOK_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_LOGBOOK_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_LOGBOOK_FAILURE, error: e.response && e.response.data });
        }
    };
};

const addLogbook = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_LOGBOOK_REQUEST });
            const res = await Service.addLogbook(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_LOGBOOK_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ADD_LOGBOOK_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ADD_LOGBOOK_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_LOGBOOK_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteLogbook = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_LOGBOOK_REQUEST });
            const res = await Service.deleteLogbook(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_LOGBOOK_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_LOGBOOK_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_LOGBOOK_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_LOGBOOK_FAILURE, error: e.response && e.response.data });
        }
    };
};

const editLogbook = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_LOGBOOK_REQUEST });
            const res = await Service.editLogbook(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_LOGBOOK_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.EDIT_LOGBOOK_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.EDIT_LOGBOOK_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_LOGBOOK_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getListForCommonFilterForLogbook = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForLogbook(params);
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

const getLogbookById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LOGBOOK_BY_ID_REQUEST });
            const res = await Service.getLogbookById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_LOGBOOK_BY_ID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_LOGBOOK_BY_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_LOGBOOK_BY_ID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_LOGBOOK_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const exportLogbook = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_LOGBOOK_TABLE_REQUEST });
            const response = await Service.exportLogbook(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_LOGBOOK_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.EXPORT_LOGBOOK_TABLE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_LOGBOOK_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllLogbookLogs = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_LOGBOOK_LOG_REQUEST });
            const res = await Service.getAllLogbookLogs(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_LOGBOOK_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_LOGBOOK_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_LOGBOOK_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_LOGBOOK_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const restoreLogbookLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_LOGBOOK_LOG_REQUEST });
            const res = await Service.restoreLogbookLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_LOGBOOK_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_LOGBOOK_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_LOGBOOK_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_LOGBOOK_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteLogbookLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_LOGBOOK_LOG_REQUEST });
            const res = await Service.deleteLogbookLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_LOGBOOK_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_LOGBOOK_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_LOGBOOK_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_LOGBOOK_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateLogbookEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_LOGBOOK_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_LOGBOOK_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

const getAllLogbookImages = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_LOGBOOK_IMAGE_REQUEST });
            const res = await Service.getAllLogbookImages(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_LOGBOOK_IMAGE_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_LOGBOOK_IMAGE_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_LOGBOOK_IMAGE_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_LOGBOOK_IMAGE_FAILURE, error: e.response && e.response.data });
        }
    };
};

const uploadLogbookImage = (imageData, id) => {
    let newImageData = new FormData();
    newImageData.append("image", imageData.file);
    newImageData.append("description", imageData.comments);
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPLOAD_LOGBOOK_IMAGE_REQUEST });
            const res = await Service.uploadLogbookImage(newImageData, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.UPLOAD_LOGBOOK_IMAGE_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.UPLOAD_LOGBOOK_IMAGE_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.UPLOAD_LOGBOOK_IMAGE_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.UPLOAD_LOGBOOK_IMAGE_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateLogbookImageComment = imageData => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_LOGBOOK_IMAGE_REQUEST });
            const res = await Service.updateLogbookImageComment(imageData);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.UPDATE_LOGBOOK_IMAGE_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.UPDATE_LOGBOOK_IMAGE_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.UPDATE_LOGBOOK_IMAGE_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.UPDATE_LOGBOOK_IMAGE_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteLogbookImage = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_LOGBOOK_IMAGE_REQUEST });
            const res = await Service.deleteLogbookImage(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_LOGBOOK_IMAGE_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_LOGBOOK_IMAGE_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_LOGBOOK_IMAGE_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_LOGBOOK_IMAGE_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getLogbookTypeDropdown = () => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LOGBOOK_TYPE_DROPDOWN_REQUEST });
            const res = await Service.getLogbookTypeDropdown();
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_LOGBOOK_TYPE_DROPDOWN_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_LOGBOOK_TYPE_DROPDOWN_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_LOGBOOK_TYPE_DROPDOWN_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_LOGBOOK_TYPE_DROPDOWN_FAILURE, error: e.response && e.response.data });
        }
    };
};

export default {
    getLogbook,
    addLogbook,
    deleteLogbook,
    editLogbook,
    getListForCommonFilterForLogbook,
    getLogbookById,
    exportLogbook,
    getAllLogbookLogs,
    restoreLogbookLog,
    deleteLogbookLog,
    updateLogbookEntityParams,
    getAllLogbookImages,
    uploadLogbookImage,
    updateLogbookImageComment,
    deleteLogbookImage,
    getLogbookTypeDropdown
};
