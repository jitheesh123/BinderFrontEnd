import * as actionTypes from "./constants";
import * as Service from "./services";

const getConsultancies = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CONSULTANCIES_REQUEST });
            const res = await Service.getConsultancies(params);
            if (res && res.status === 200) {
                const getConsultancyData = res.data;
                if (getConsultancyData) {
                    dispatch({ type: actionTypes.GET_CONSULTANCIES_SUCCESS, response: getConsultancyData });
                } else {
                    dispatch({ type: actionTypes.GET_CONSULTANCIES_FAILURE, error: getConsultancyData });
                }
            } else {
                dispatch({ type: actionTypes.GET_CONSULTANCIES_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_CONSULTANCIES_FAILURE, error: e.response && e.response.data });
        }
    };
};

const addConsultancies = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_CONSULTANCIES_REQUEST });
            const res = await Service.addConsultancies(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_CONSULTANCIES_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ADD_CONSULTANCIES_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ADD_CONSULTANCIES_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_CONSULTANCIES_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getConsultanciesById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CONSULTANCIES_BYID_REQUEST });
            const res = await Service.getConsultanciesById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_CONSULTANCIES_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_CONSULTANCIES_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_CONSULTANCIES_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_CONSULTANCIES_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteConsultancy = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_CONSULTANCIES_BYID_REQUEST });
            const res = await Service.deleteConsultancy(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_CONSULTANCIES_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_CONSULTANCIES_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_CONSULTANCIES_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_CONSULTANCIES_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const editConsultanciesById = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_CONSULTANCIES_BYID_REQUEST });
            const res = await Service.editConsultanciesById(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_CONSULTANCIES_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.EDIT_CONSULTANCIES_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.EDIT_CONSULTANCIES_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_CONSULTANCIES_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getListForCommonFilterForConsultancy = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForConsultancy(params);
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

const getConsultancyById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CONSULTANCY_BY_ID_REQUEST });
            const res = await Service.getConsultancyById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_CONSULTANCY_BY_ID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_CONSULTANCY_BY_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_CONSULTANCY_BY_ID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_CONSULTANCY_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    }
}
const exportConsultancy = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_CONSULTANCY_TABLE_REQUEST });
            const response = await Service.exportConsultancy(params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_CONSULTANCY_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.EXPORT_CONSULTANCY_TABLE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_CONSULTANCY_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllConsultancyLogs = (params,id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_LOG_REQUEST });
            const res = await Service.getAllConsultancyLogs(params,id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const restoreConsultancyLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_CONSULTANCY_LOG_REQUEST });
            const res = await Service.restoreConsultancyLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_CONSULTANCY_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_CONSULTANCY_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_CONSULTANCY_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_CONSULTANCY_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteConsultancyLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_CONSULTANCY_LOG_REQUEST });
            const res = await Service.deleteConsultancyLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_CONSULTANCY_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_CONSULTANCY_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_CONSULTANCY_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_CONSULTANCY_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateConsultancyEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_CONSULTANCY_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_CONSULTANCY_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

export default {
    getConsultancies,
    addConsultancies,
    getConsultanciesById,
    editConsultanciesById,
    deleteConsultancy,
    getListForCommonFilterForConsultancy,
    getConsultancyById,
    exportConsultancy,
    getAllConsultancyLogs,
    restoreConsultancyLog,
    deleteConsultancyLog,
    updateConsultancyEntityParams
};
