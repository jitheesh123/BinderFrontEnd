import * as actionTypes from "./constants";
import * as Service from "./services";

const getTemplates = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_TEMPLATES_REQUEST });
            const res = await Service.getTemplates(params);
            if (res && res.status === 200) {
                const getTemplatesData = res.data;
                if (getTemplatesData) {
                    dispatch({ type: actionTypes.GET_TEMPLATES_SUCCESS, response: getTemplatesData });
                } else {
                    dispatch({ type: actionTypes.GET_TEMPLATES_FAILURE, error: getTemplatesData });
                }
            } else {
                dispatch({ type: actionTypes.GET_TEMPLATES_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_TEMPLATES_FAILURE, error: e.response && e.response.data });
        }
    };
};

const addTemplates = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_TEMPLATES_REQUEST });
            const res = await Service.addTemplates(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_TEMPLATES_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ADD_TEMPLATES_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ADD_TEMPLATES_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_TEMPLATES_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getTemplatesById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_TEMPLATES_BYID_REQUEST });
            const res = await Service.getTemplatesById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_TEMPLATES_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_TEMPLATES_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_TEMPLATES_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_TEMPLATES_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteTemplates = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_TEMPLATES_BYID_REQUEST });
            const res = await Service.deleteTemplates(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_TEMPLATES_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_TEMPLATES_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_TEMPLATES_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_TEMPLATES_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const editTemplatesById = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_TEMPLATES_BYID_REQUEST });
            const res = await Service.editTemplatesById(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_TEMPLATES_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.EDIT_TEMPLATES_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.EDIT_TEMPLATES_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_TEMPLATES_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getListForCommonFilterForTemplates = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForTemplates(params);
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

// const getTemplatesById = id => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_TEMPLATES_BY_ID_REQUEST });
//             const res = await Service.getTemplatesById(id);
//             if (res && res.status === 200) {
//                 if (res.data) {
//                     dispatch({ type: actionTypes.GET_TEMPLATES_BY_ID_SUCCESS, response: res.data });
//                 } else {
//                     dispatch({ type: actionTypes.GET_TEMPLATES_BY_ID_FAILURE, error: res.data });
//                 }
//             } else {
//                 dispatch({ type: actionTypes.GET_TEMPLATES_BY_ID_FAILURE, error: res.data });
//             }
//         } catch (e) {
//             dispatch({ type: actionTypes.GET_TEMPLATES_BY_ID_FAILURE, error: e.response && e.response.data });
//         }
//     }
// }
const exportTemplates = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_TEMPLATES_TABLE_REQUEST });
            const response = await Service.exportTemplates(params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_TEMPLATES_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.EXPORT_TEMPLATES_TABLE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_TEMPLATES_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllTemplatesLogs = (params,id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_TEMPLATES_LOG_REQUEST });
            const res = await Service.getAllTemplatesLogs(params,id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_TEMPLATES_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_TEMPLATES_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_TEMPLATES_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_TEMPLATES_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const restoreTemplatesLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_TEMPLATES_LOG_REQUEST });
            const res = await Service.restoreTemplatesLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_TEMPLATES_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_TEMPLATES_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_TEMPLATES_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_TEMPLATES_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteTemplatesLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_TEMPLATES_LOG_REQUEST });
            const res = await Service.deleteTemplatesLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_TEMPLATES_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_TEMPLATES_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_TEMPLATES_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_TEMPLATES_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateTemplatesEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_TEMPLATES_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_TEMPLATES_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

export default {
    getTemplates,
    addTemplates,
    getTemplatesById,
    editTemplatesById,
    deleteTemplates,
    getListForCommonFilterForTemplates,
    // getTemplatesById,
    exportTemplates,
    getAllTemplatesLogs,
    restoreTemplatesLog,
    deleteTemplatesLog,
    updateTemplatesEntityParams
};
