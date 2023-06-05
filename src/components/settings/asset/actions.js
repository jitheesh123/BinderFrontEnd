import * as actionTypes from "./constants";
import * as Service from "./services";

const getAsset = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSET_REQUEST });
            const res = await Service.getAsset(params);
            if (res && res.status === 200) {
                const getAssetData = res.data;
                if (getAssetData) {
                    dispatch({ type: actionTypes.GET_ASSET_SUCCESS, response: getAssetData });
                } else {
                    dispatch({ type: actionTypes.GET_ASSET_FAILURE, error: getAssetData });
                }
            } else {
                dispatch({ type: actionTypes.GET_ASSET_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ASSET_FAILURE, error: e.response && e.response.data });
        }
    };
};

const addAsset = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_ASSET_REQUEST });
            const res = await Service.addAsset(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_ASSET_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ADD_ASSET_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ADD_ASSET_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_ASSET_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteAsset = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_ASSET_BYID_REQUEST });
            const res = await Service.deleteAsset(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_ASSET_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_ASSET_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_ASSET_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_ASSET_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const editAssetById = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_ASSET_BYID_REQUEST });
            const res = await Service.editAssetById(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_ASSET_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.EDIT_ASSET_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.EDIT_ASSET_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_ASSET_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getListForCommonFilterForAsset = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForAsset(params);
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

const getAssetById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSET_BY_ID_REQUEST });
            const res = await Service.getAssetById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ASSET_BY_ID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ASSET_BY_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ASSET_BY_ID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ASSET_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    };
};
const exportAsset = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_ASSET_TABLE_REQUEST });
            const response = await Service.exportAsset(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_ASSET_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.EXPORT_ASSET_TABLE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_ASSET_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllAssetLogs = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_ASSET_LOG_REQUEST });
            const res = await Service.getAllAssetLogs(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_ASSET_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_ASSET_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_ASSET_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_ASSET_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const restoreAssetLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_ASSET_LOG_REQUEST });
            const res = await Service.restoreAssetLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_ASSET_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_ASSET_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_ASSET_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_ASSET_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteAssetLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_ASSET_LOG_REQUEST });
            const res = await Service.deleteAssetLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_ASSET_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_ASSET_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_ASSET_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_ASSET_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateAssetEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_ASSET_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_ASSET_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

const getAllAssetImages = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_ASSET_IMAGE_REQUEST });
            const res = await Service.getAllAssetImages(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_ASSET_IMAGE_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_ASSET_IMAGE_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_ASSET_IMAGE_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_ASSET_IMAGE_FAILURE, error: e.response && e.response.data });
        }
    };
};

const uploadAssetImage = (imageData, id) => {
    let newImageData = new FormData();
    newImageData.append("image", imageData.file);
    newImageData.append("description", imageData.comments);
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPLOAD_ASSET_IMAGE_REQUEST });
            const res = await Service.uploadAssetImage(newImageData, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.UPLOAD_ASSET_IMAGE_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.UPLOAD_ASSET_IMAGE_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.UPLOAD_ASSET_IMAGE_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.UPLOAD_ASSET_IMAGE_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateAssetImageComment = imageData => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_ASSET_IMAGE_REQUEST });
            const res = await Service.updateAssetImageComment(imageData);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.UPDATE_ASSET_IMAGE_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.UPDATE_ASSET_IMAGE_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.UPDATE_ASSET_IMAGE_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.UPDATE_ASSET_IMAGE_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteAssetImage = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_ASSET_IMAGE_REQUEST });
            const res = await Service.deleteAssetImage(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_ASSET_IMAGE_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_ASSET_IMAGE_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_ASSET_IMAGE_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_ASSET_IMAGE_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getCreateSurveyPopupDetailsForAssetLogbookScheduling = (id, building_id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CREATE_SURVEY_DETAILS_ASSET_LOGBOOK_SCHEDULING_REQUEST });
            const res = await Service.getCreateSurveyPopupDetailsForAssetLogbookScheduling(id, building_id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_CREATE_SURVEY_DETAILS_ASSET_LOGBOOK_SCHEDULING_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_CREATE_SURVEY_DETAILS_ASSET_LOGBOOK_SCHEDULING_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_CREATE_SURVEY_DETAILS_ASSET_LOGBOOK_SCHEDULING_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CREATE_SURVEY_DETAILS_ASSET_LOGBOOK_SCHEDULING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getCreateSurveyPopupDetailsForAssetActivitiesScheduling = (id, building_id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CREATE_SURVEY_DETAILS_ASSET_ACTIVITIES_SCHEDULING_REQUEST });
            const res = await Service.getCreateSurveyPopupDetailsForAssetActivitiesScheduling(id, building_id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_CREATE_SURVEY_DETAILS_ASSET_ACTIVITIES_SCHEDULING_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_CREATE_SURVEY_DETAILS_ASSET_ACTIVITIES_SCHEDULING_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_CREATE_SURVEY_DETAILS_ASSET_ACTIVITIES_SCHEDULING_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CREATE_SURVEY_DETAILS_ASSET_ACTIVITIES_SCHEDULING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const createSurvey = (id, surveyParams) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.CREATE_SURVEY_REQUEST });
            const res = await Service.createSurvey(id, surveyParams);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.CREATE_SURVEY_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.CREATE_SURVEY_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.CREATE_SURVEY_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.CREATE_SURVEY_FAILURE, error: e.response && e.response.data });
        }
    };
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getAsset,
    getAssetById,
    addAsset,
    editAssetById,
    deleteAsset,
    getListForCommonFilterForAsset,
    exportAsset,
    getAllAssetLogs,
    restoreAssetLog,
    deleteAssetLog,
    updateAssetEntityParams,
    getAllAssetImages,
    uploadAssetImage,
    updateAssetImageComment,
    deleteAssetImage,
    getCreateSurveyPopupDetailsForAssetLogbookScheduling,
    getCreateSurveyPopupDetailsForAssetActivitiesScheduling,
    createSurvey
};
