import * as actionTypes from "./constants";
import * as Service from "./services";

const getSmartReports = (params, path) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SMART_REPORT_REQUEST });
            const res = await Service.getSmartReports(params, path);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_SMART_REPORT_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_SMART_REPORT_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_SMART_REPORT_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_SMART_REPORT_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getListForCommonFilterForSmartReport = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForSmartReport(params);
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

const exportSmartReports = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_SMART_REPORT_TABLE_REQUEST });
            const response = await Service.exportSmartReports(params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_SMART_REPORT_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.EXPORT_SMART_REPORT_TABLE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_SMART_REPORT_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateSmartReportEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_SMART_REPORT_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_SMART_REPORT_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};


export default {
    getSmartReports,
    getListForCommonFilterForSmartReport,
    exportSmartReports,
    updateSmartReportEntityParams
};
