import * as actionTypes from "./constants";
import * as Service from "./services";

const getDeemingAgency = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_DEEMING_AGENCY_REQUEST });
            const res = await Service.getDeemingAgency(params);
            if (res && res.status === 200) {
                const getDeemingAgencyData = res.data;
                if (getDeemingAgencyData) {
                    dispatch({ type: actionTypes.GET_DEEMING_AGENCY_SUCCESS, response: getDeemingAgencyData });
                } else {
                    dispatch({ type: actionTypes.GET_DEEMING_AGENCY_FAILURE, error: getDeemingAgencyData });
                }
            } else {
                dispatch({ type: actionTypes.GET_DEEMING_AGENCY_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_DEEMING_AGENCY_FAILURE, error: e.response && e.response.data });
        }
    };
};

const addDeemingAgency = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_DEEMING_AGENCY_REQUEST });
            const res = await Service.addDeemingAgency(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_DEEMING_AGENCY_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ADD_DEEMING_AGENCY_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ADD_DEEMING_AGENCY_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_DEEMING_AGENCY_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteDeemingAgency = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_DEEMING_AGENCY_BYID_REQUEST });
            const res = await Service.deleteDeemingAgency(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_DEEMING_AGENCY_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_DEEMING_AGENCY_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_DEEMING_AGENCY_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_DEEMING_AGENCY_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const editDeemingAgencyById = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_DEEMING_AGENCY_BYID_REQUEST });
            const res = await Service.editDeemingAgencyById(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_DEEMING_AGENCY_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.EDIT_DEEMING_AGENCY_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.EDIT_DEEMING_AGENCY_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_DEEMING_AGENCY_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getListForCommonFilterForDeemingAgency = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForDeemingAgency(params);
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

const getDeemingAgencyById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_DEEMING_AGENCY_BY_ID_REQUEST });
            const res = await Service.getDeemingAgencyById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_DEEMING_AGENCY_BY_ID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_DEEMING_AGENCY_BY_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_DEEMING_AGENCY_BY_ID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_DEEMING_AGENCY_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    }
}
const exportDeemingAgency = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_DEEMING_AGENCY_TABLE_REQUEST });
            const response = await Service.exportDeemingAgency(params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_DEEMING_AGENCY_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.EXPORT_DEEMING_AGENCY_TABLE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_DEEMING_AGENCY_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllDeemingAgencyLogs = (params,id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_DEEMING_AGENCY_LOG_REQUEST });
            const res = await Service.getAllDeemingAgencyLogs(params,id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_DEEMING_AGENCY_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_DEEMING_AGENCY_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_DEEMING_AGENCY_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_DEEMING_AGENCY_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const restoreDeemingAgencyLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_DEEMING_AGENCY_LOG_REQUEST });
            const res = await Service.restoreDeemingAgencyLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_DEEMING_AGENCY_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_DEEMING_AGENCY_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_DEEMING_AGENCY_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_DEEMING_AGENCY_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteDeemingAgencyLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_DEEMING_AGENCY_LOG_REQUEST });
            const res = await Service.deleteDeemingAgencyLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_DEEMING_AGENCY_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_DEEMING_AGENCY_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_DEEMING_AGENCY_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_DEEMING_AGENCY_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateDeemingAgencyEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_DEEMING_AGENCY_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_DEEMING_AGENCY_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

export default {
    getDeemingAgency,
    getDeemingAgencyById,
    addDeemingAgency,
    editDeemingAgencyById,
    deleteDeemingAgency,
    getListForCommonFilterForDeemingAgency,
    exportDeemingAgency,
    getAllDeemingAgencyLogs,
    restoreDeemingAgencyLog,
    deleteDeemingAgencyLog,
    updateDeemingAgencyEntityParams
};
