import * as actionTypes from "./constants";
import * as Service from "./services";

const getUserPermissions = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_USER_PERMISSIONS_REQUEST });
            const res = await Service.getUserPermissions(params);
            if (res && res.status === 200) {
                const getUserPermissionsData = res.data;
                if (getUserPermissionsData) {
                    dispatch({ type: actionTypes.GET_USER_PERMISSIONS_SUCCESS, response: getUserPermissionsData });
                } else {
                    dispatch({ type: actionTypes.GET_USER_PERMISSIONS_FAILURE, error: getUserPermissionsData });
                }
            } else {
                dispatch({ type: actionTypes.GET_USER_PERMISSIONS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_USER_PERMISSIONS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const addUserPermissions = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_USER_PERMISSIONS_REQUEST });
            const res = await Service.addUserPermissions(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_USER_PERMISSIONS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ADD_USER_PERMISSIONS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ADD_USER_PERMISSIONS_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_USER_PERMISSIONS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getUserPermissionsById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_USER_PERMISSIONS_BYID_REQUEST });
            const res = await Service.getUserPermissionsById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_USER_PERMISSIONS_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_USER_PERMISSIONS_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_USER_PERMISSIONS_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_USER_PERMISSIONS_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteUserPermissions = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_USER_PERMISSIONS_BYID_REQUEST });
            const res = await Service.deleteUserPermissions(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_USER_PERMISSIONS_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_USER_PERMISSIONS_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_USER_PERMISSIONS_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_USER_PERMISSIONS_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const editUserPermissionsById = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_USER_PERMISSIONS_BYID_REQUEST });
            const res = await Service.editUserPermissionsById(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_USER_PERMISSIONS_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.EDIT_USER_PERMISSIONS_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.EDIT_USER_PERMISSIONS_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_USER_PERMISSIONS_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getListForCommonFilterForUserPermissions = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForUserPermissions(params);
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

// const getUserPermissionsById = id => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_USER_PERMISSIONS_BY_ID_REQUEST });
//             const res = await Service.getUserPermissionsById(id);
//             if (res && res.status === 200) {
//                 if (res.data) {
//                     dispatch({ type: actionTypes.GET_USER_PERMISSIONS_BY_ID_SUCCESS, response: res.data });
//                 } else {
//                     dispatch({ type: actionTypes.GET_USER_PERMISSIONS_BY_ID_FAILURE, error: res.data });
//                 }
//             } else {
//                 dispatch({ type: actionTypes.GET_USER_PERMISSIONS_BY_ID_FAILURE, error: res.data });
//             }
//         } catch (e) {
//             dispatch({ type: actionTypes.GET_USER_PERMISSIONS_BY_ID_FAILURE, error: e.response && e.response.data });
//         }
//     }
// }
const exportUserPermissions = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_USER_PERMISSIONS_TABLE_REQUEST });
            const response = await Service.exportUserPermissions(params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_USER_PERMISSIONS_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.EXPORT_USER_PERMISSIONS_TABLE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_USER_PERMISSIONS_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllUserPermissionsLogs = (params,id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_USER_PERMISSIONS_LOG_REQUEST });
            const res = await Service.getAllUserPermissionsLogs(params,id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_USER_PERMISSIONS_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_USER_PERMISSIONS_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_USER_PERMISSIONS_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_USER_PERMISSIONS_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const restoreUserPermissionsLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_USER_PERMISSIONS_LOG_REQUEST });
            const res = await Service.restoreUserPermissionsLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_USER_PERMISSIONS_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_USER_PERMISSIONS_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_USER_PERMISSIONS_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_USER_PERMISSIONS_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteUserPermissionsLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_USER_PERMISSIONS_LOG_REQUEST });
            const res = await Service.deleteUserPermissionsLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_USER_PERMISSIONS_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_USER_PERMISSIONS_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_USER_PERMISSIONS_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_USER_PERMISSIONS_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateUserPermissionsEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_USER_PERMISSIONS_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_USER_PERMISSIONS_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
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

const getUserListForPermissions = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_USER_LIST_FOR_PERMISSIONS_REQUEST });
            const res = await Service.getUserListForPermissions(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_USER_LIST_FOR_PERMISSIONS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_USER_LIST_FOR_PERMISSIONS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_USER_LIST_FOR_PERMISSIONS_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_USER_LIST_FOR_PERMISSIONS_FAILURE, error: e.response && e.response.data });
        }
    };
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getUserPermissions,
    addUserPermissions,
    getUserPermissionsById,
    editUserPermissionsById,
    deleteUserPermissions,
    getListForCommonFilterForUserPermissions,
    // getUserPermissionsById,
    exportUserPermissions,
    getAllUserPermissionsLogs,
    restoreUserPermissionsLog,
    deleteUserPermissionsLog,
    updateUserPermissionsEntityParams,
    getTemplatesById,
    getUserListForPermissions
};
