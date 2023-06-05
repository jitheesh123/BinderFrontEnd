import * as actionTypes from "./constants";
import * as Service from "./services";

const getUsers = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SECTOR_USERS_REQUEST });
            const res = await Service.getUsers(params);
            if (res && res.status === 200) {
                const getUsersData = res.data;
                if (getUsersData) {
                    dispatch({ type: actionTypes.GET_SECTOR_USERS_SUCCESS, response: getUsersData });
                } else {
                    dispatch({ type: actionTypes.GET_SECTOR_USERS_FAILURE, error: getUsersData });
                }
            } else {
                dispatch({ type: actionTypes.GET_SECTOR_USERS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_SECTOR_USERS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const addUsers = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_SECTOR_USERS_REQUEST });
            const res = await Service.addUsers(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_SECTOR_USERS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ADD_SECTOR_USERS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ADD_SECTOR_USERS_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_SECTOR_USERS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getUsersById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SECTOR_USERS_BYID_REQUEST });
            const res = await Service.getUsersById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_SECTOR_USERS_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_SECTOR_USERS_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_SECTOR_USERS_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_SECTOR_USERS_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteUsers = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_SECTOR_USERS_BYID_REQUEST });
            const res = await Service.deleteUsers(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_SECTOR_USERS_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_SECTOR_USERS_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_SECTOR_USERS_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_SECTOR_USERS_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const editUsersById = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_SECTOR_USERS_BYID_REQUEST });
            const res = await Service.editUsersById(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_SECTOR_USERS_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.EDIT_SECTOR_USERS_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.EDIT_SECTOR_USERS_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_SECTOR_USERS_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getListForCommonFilterForUsers = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForUsers(params);
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

// const getUsersById = id => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_SECTOR_USERS_BY_ID_REQUEST });
//             const res = await Service.getUsersById(id);
//             if (res && res.status === 200) {
//                 if (res.data) {
//                     dispatch({ type: actionTypes.GET_SECTOR_USERS_BY_ID_SUCCESS, response: res.data });
//                 } else {
//                     dispatch({ type: actionTypes.GET_SECTOR_USERS_BY_ID_FAILURE, error: res.data });
//                 }
//             } else {
//                 dispatch({ type: actionTypes.GET_SECTOR_USERS_BY_ID_FAILURE, error: res.data });
//             }
//         } catch (e) {
//             dispatch({ type: actionTypes.GET_SECTOR_USERS_BY_ID_FAILURE, error: e.response && e.response.data });
//         }
//     }
// }
const exportUsers = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_SECTOR_USERS_TABLE_REQUEST });
            const response = await Service.exportUsers(params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_SECTOR_USERS_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.EXPORT_SECTOR_USERS_TABLE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_SECTOR_USERS_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllUsersLogs = (params,id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_SECTOR_USERS_LOG_REQUEST });
            const res = await Service.getAllUsersLogs(params,id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_SECTOR_USERS_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_SECTOR_USERS_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_SECTOR_USERS_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_SECTOR_USERS_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const restoreUsersLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_SECTOR_USERS_LOG_REQUEST });
            const res = await Service.restoreUsersLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.RESTORE_SECTOR_USERS_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.RESTORE_SECTOR_USERS_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.RESTORE_SECTOR_USERS_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESTORE_SECTOR_USERS_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteUsersLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_SECTOR_USERS_LOG_REQUEST });
            const res = await Service.deleteUsersLog(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_SECTOR_USERS_LOG_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_SECTOR_USERS_LOG_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_SECTOR_USERS_LOG_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_SECTOR_USERS_LOG_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateUsersEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_SECTOR_USERS_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_SECTOR_USERS_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

export default {
    getUsers,
    addUsers,
    getUsersById,
    editUsersById,
    deleteUsers,
    getListForCommonFilterForUsers,
    // getUsersById,
    exportUsers,
    getAllUsersLogs,
    restoreUsersLog,
    deleteUsersLog,
    updateUsersEntityParams
};
