import * as actionTypes from "./constants";
import * as Service from "./services";

const getUserBuilding = (params, path) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_USER_BUILDING_REQUEST });
            const res = await Service.getUserBuilding(params, path);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_USER_BUILDING_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_USER_BUILDING_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_USER_BUILDING_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_USER_BUILDING_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteUserBuilding = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_USER_BUILDING_REQUEST });
            const res = await Service.deleteUserBuilding(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_USER_BUILDING_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_USER_BUILDING_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_USER_BUILDING_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_USER_BUILDING_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getListForCommonFilterForUserBuilding = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForUserBuilding(params);
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

const getUserBuildingById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_USER_BUILDING_BY_ID_REQUEST });
            const res = await Service.getUserBuildingById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_USER_BUILDING_BY_ID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_USER_BUILDING_BY_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_USER_BUILDING_BY_ID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_USER_BUILDING_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const exportUserBuilding = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_USER_BUILDING_TABLE_REQUEST });
            const response = await Service.exportUserBuilding(params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_USER_BUILDING_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.EXPORT_USER_BUILDING_TABLE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_USER_BUILDING_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateUserBuildingEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_USER_BUILDING_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_USER_BUILDING_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};


export default {
    getUserBuilding,
    deleteUserBuilding,
    getListForCommonFilterForUserBuilding,
    getUserBuildingById,
    exportUserBuilding,
    updateUserBuildingEntityParams
};
