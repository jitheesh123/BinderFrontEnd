import * as actionTypes from "./constants";
import * as Service from "./services";

const getAllLogbooks = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_LOGBOOKS_REQUEST });
            const res = await Service.getAllLogbooks(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ALL_LOGBOOKS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_LOGBOOKS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_LOGBOOKS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_LOGBOOKS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getSurveyDetails = (id, schedule_id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SURVEY_DETAILS_REQUEST });
            const res = await Service.getSurveyDetails(id, schedule_id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_SURVEY_DETAILS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_SURVEY_DETAILS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_SURVEY_DETAILS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_SURVEY_DETAILS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getSchedulesByLogbookId = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SCHEDULES_BY_LOGBOOK_ID_REQUEST });
            const res = await Service.getSchedulesByLogbookId(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_SCHEDULES_BY_LOGBOOK_ID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_SCHEDULES_BY_LOGBOOK_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_SCHEDULES_BY_LOGBOOK_ID_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_SCHEDULES_BY_LOGBOOK_ID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getTrailingSchedulesByLogbookId = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_TRAILING_SCHEDULES_BY_LOGBOOK_ID_REQUEST });
            const response = await Service.getTrailingSchedulesByLogbookId(params);
            if (response && response.status === 200) {
                if (response.data) {
                    dispatch({ type: actionTypes.GET_TRAILING_SCHEDULES_BY_LOGBOOK_ID_SUCCESS, response: response.data });
                } else {
                    dispatch({ type: actionTypes.GET_TRAILING_SCHEDULES_BY_LOGBOOK_ID_FAILURE, error: response.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_TRAILING_SCHEDULES_BY_LOGBOOK_ID_FAILURE, error: response.response && response.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_TRAILING_SCHEDULES_BY_LOGBOOK_ID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getScheduleDates = (params, url) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SCHEDULE_DATES_REQUEST });
            const response = await Service.getScheduleDates(params, url);
            if (response && response.status === 200) {
                if (response.data) {
                    dispatch({ type: actionTypes.GET_SCHEDULE_DATES_SUCCESS, response: response.data });
                    localStorage.setItem("schedule_dates", JSON.stringify(response.data));
                } else {
                    dispatch({ type: actionTypes.GET_SCHEDULE_DATES_FAILURE, error: response.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_SCHEDULE_DATES_FAILURE, error: response.response && response.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_SCHEDULE_DATES_FAILURE, error: e.response && e.response.data });
        }
    };
};

const setActivityTableWidth = width => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.SET_ACTIVITY_TABLE_WIDTH_REQUEST });
            // const res = await Service.setActivityTableWidth(width);
            const res = { status: 200, data: true, response: { data: null } };
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.SET_ACTIVITY_TABLE_WIDTH_SUCCESS, response: width });
                } else {
                    dispatch({ type: actionTypes.SET_ACTIVITY_TABLE_WIDTH_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.SET_ACTIVITY_TABLE_WIDTH_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.SET_ACTIVITY_TABLE_WIDTH_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getActivityTableWidth = () => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ACTIVITY_TABLE_WIDTH_REQUEST });
            const res = await Service.getActivityTableWidth();
            // const res = {status : 200, data : true, response: {data : null} }
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ACTIVITY_TABLE_WIDTH_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ACTIVITY_TABLE_WIDTH_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ACTIVITY_TABLE_WIDTH_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ACTIVITY_TABLE_WIDTH_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getLogbookDocuments = (id, survey_date_id, schedule_id, building_id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LOGBOOK_DOCUMENTS_REQUEST });
            const res = await Service.getLogbookDocuments(id, survey_date_id, schedule_id, building_id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_LOGBOOK_DOCUMENTS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_LOGBOOK_DOCUMENTS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_LOGBOOK_DOCUMENTS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_LOGBOOK_DOCUMENTS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const saveActivityEvent = (survey, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.SAVE_ACTIVITY_EVENT_REQUEST });
            const res = await Service.saveActivityEvent(survey, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.SAVE_ACTIVITY_EVENT_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.SAVE_ACTIVITY_EVENT_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.SAVE_ACTIVITY_EVENT_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.SAVE_ACTIVITY_EVENT_FAILURE, error: e.response && e.response.data });
        }
    };
};

const uploadDocuments = (formData, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPLOAD_DOCUMENTS_REQUEST });
            const res = await Service.uploadDocuments(formData, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.UPLOAD_DOCUMENTS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.UPLOAD_DOCUMENTS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.UPLOAD_DOCUMENTS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.UPLOAD_DOCUMENTS_FAILURE, error: e.response && e.response.data });
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

const getActivityEventPopupDetails = (id, survey_date_id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ACTIVITY_EVENT_POPUP_DETAILS_REQUEST });
            const res = await Service.getActivityEventPopupDetails(id, survey_date_id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ACTIVITY_EVENT_POPUP_DETAILS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ACTIVITY_EVENT_POPUP_DETAILS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ACTIVITY_EVENT_POPUP_DETAILS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ACTIVITY_EVENT_POPUP_DETAILS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const executeActivityEvent = (formData, modify) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXECUTE_ACTIVITY_EVENT_REQUEST });
            const res = modify ? await Service.modifyNa(formData) : await Service.executeActivityEvent(formData);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EXECUTE_ACTIVITY_EVENT_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.EXECUTE_ACTIVITY_EVENT_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.EXECUTE_ACTIVITY_EVENT_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.EXECUTE_ACTIVITY_EVENT_FAILURE, error: e.response && e.response.data });
        }
    };
};

const undoNa = formData => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UNDO_NA_REQUEST });
            const res = await Service.undoNa(formData);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.UNDO_NA_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.UNDO_NA_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.UNDO_NA_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.UNDO_NA_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getAssignActivityPopupDetails = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSIGN_ACTIVITY_POPUP_DETAILS_REQUEST });
            const res = await Service.getAssignActivityPopupDetails(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ASSIGN_ACTIVITY_POPUP_DETAILS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ASSIGN_ACTIVITY_POPUP_DETAILS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ASSIGN_ACTIVITY_POPUP_DETAILS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ASSIGN_ACTIVITY_POPUP_DETAILS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getAssignBuildingActivitiesPopupDetails = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSIGN_BUILDING_ACTIVITIES_POPUP_DETAILS_REQUEST });
            const res = await Service.getAssignBuildingActivitiesPopupDetails(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ASSIGN_BUILDING_ACTIVITIES_POPUP_DETAILS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ASSIGN_BUILDING_ACTIVITIES_POPUP_DETAILS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ASSIGN_BUILDING_ACTIVITIES_POPUP_DETAILS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ASSIGN_BUILDING_ACTIVITIES_POPUP_DETAILS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getAssignLogbookPopupDetails = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSIGN_LOGBOOK_POPUP_DETAILS_REQUEST });
            const res = await Service.getAssignLogbookPopupDetails(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ASSIGN_LOGBOOK_POPUP_DETAILS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ASSIGN_LOGBOOK_POPUP_DETAILS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ASSIGN_LOGBOOK_POPUP_DETAILS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ASSIGN_LOGBOOK_POPUP_DETAILS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getAssignLogbookForConsultancyPopupDetails = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSIGN_LOGBOOK_POPUP_FOR_CONSULTANCY_DETAILS_REQUEST });
            const res = await Service.getAssignLogbookForConsultancyPopupDetails(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ASSIGN_LOGBOOK_POPUP_FOR_CONSULTANCY_DETAILS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ASSIGN_LOGBOOK_POPUP_FOR_CONSULTANCY_DETAILS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ASSIGN_LOGBOOK_POPUP_FOR_CONSULTANCY_DETAILS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ASSIGN_LOGBOOK_POPUP_FOR_CONSULTANCY_DETAILS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getAssignActivityForConsultancyPopupDetails = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSIGN_ACTIVITY_POPUP_FOR_CONSULTANCY_DETAILS_REQUEST });
            const res = await Service.getAssignActivityForConsultancyPopupDetails(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ASSIGN_ACTIVITY_POPUP_FOR_CONSULTANCY_DETAILS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ASSIGN_ACTIVITY_POPUP_FOR_CONSULTANCY_DETAILS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ASSIGN_ACTIVITY_POPUP_FOR_CONSULTANCY_DETAILS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ASSIGN_ACTIVITY_POPUP_FOR_CONSULTANCY_DETAILS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getAssignLogbookForClientPopupDetails = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSIGN_LOGBOOK_POPUP_FOR_CLIENT_DETAILS_REQUEST });
            const res = await Service.getAssignLogbookForClientPopupDetails(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ASSIGN_LOGBOOK_POPUP_FOR_CLIENT_DETAILS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ASSIGN_LOGBOOK_POPUP_FOR_CLIENT_DETAILS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ASSIGN_LOGBOOK_POPUP_FOR_CLIENT_DETAILS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ASSIGN_LOGBOOK_POPUP_FOR_CLIENT_DETAILS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getAssignActivityForClientPopupDetails = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSIGN_ACTIVITY_POPUP_FOR_CLIENT_DETAILS_REQUEST });
            const res = await Service.getAssignActivityForClientPopupDetails(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ASSIGN_ACTIVITY_POPUP_FOR_CLIENT_DETAILS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ASSIGN_ACTIVITY_POPUP_FOR_CLIENT_DETAILS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ASSIGN_ACTIVITY_POPUP_FOR_CLIENT_DETAILS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ASSIGN_ACTIVITY_POPUP_FOR_CLIENT_DETAILS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getCreateSurveyPopupDetails = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CREATE_SURVEY_POPUP_DETAILS_REQUEST });
            const res = await Service.getCreateSurveyPopupDetails(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_CREATE_SURVEY_POPUP_DETAILS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_CREATE_SURVEY_POPUP_DETAILS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_CREATE_SURVEY_POPUP_DETAILS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_CREATE_SURVEY_POPUP_DETAILS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getCreateSurveyPopupDetailsForBuilding = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CREATE_SURVEY_POPUP_DETAILS_FOR_BUILDING_REQUEST });
            const res = await Service.getCreateSurveyPopupDetailsForBuilding(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_CREATE_SURVEY_POPUP_DETAILS_FOR_BUILDING_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_CREATE_SURVEY_POPUP_DETAILS_FOR_BUILDING_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_CREATE_SURVEY_POPUP_DETAILS_FOR_BUILDING_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_CREATE_SURVEY_POPUP_DETAILS_FOR_BUILDING_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getCreateSurveyPopupDetailsForBuildingActivities = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CREATE_SURVEY_POPUP_DETAILS_FOR_BUILDING_ACTIVITIES_REQUEST });
            const res = await Service.getCreateSurveyPopupDetailsForBuildingActivities(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_CREATE_SURVEY_POPUP_DETAILS_FOR_BUILDING_ACTIVITIES_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_CREATE_SURVEY_POPUP_DETAILS_FOR_BUILDING_ACTIVITIES_FAILURE, error: res.data });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CREATE_SURVEY_POPUP_DETAILS_FOR_BUILDING_ACTIVITIES_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_CREATE_SURVEY_POPUP_DETAILS_FOR_BUILDING_ACTIVITIES_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getCurrentAssignments = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CURRENT_ASSIGNMENTS_REQUEST });
            const res = await Service.getCurrentAssignments(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_CURRENT_ASSIGNMENTS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_CURRENT_ASSIGNMENTS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_CURRENT_ASSIGNMENTS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_CURRENT_ASSIGNMENTS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const assignActivityToBuilding = (activity_id, building_ids) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_ACTIVITY_TO_BUILDING_REQUEST });
            const res = await Service.assignActivityToBuilding(activity_id, building_ids);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ASSIGN_ACTIVITY_TO_BUILDING_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ASSIGN_ACTIVITY_TO_BUILDING_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ASSIGN_ACTIVITY_TO_BUILDING_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ASSIGN_ACTIVITY_TO_BUILDING_FAILURE, error: e.response && e.response.data });
        }
    };
};

const assignClientActivityToBuilding = (building_id, activity_ids) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_CLIENT_ACTIVITY_TO_BUILDING_REQUEST });
            const res = await Service.assignClientActivityToBuilding(building_id, activity_ids);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ASSIGN_CLIENT_ACTIVITY_TO_BUILDING_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ASSIGN_CLIENT_ACTIVITY_TO_BUILDING_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ASSIGN_CLIENT_ACTIVITY_TO_BUILDING_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ASSIGN_CLIENT_ACTIVITY_TO_BUILDING_FAILURE, error: e.response && e.response.data });
        }
    };
};

const assignLogbookToBuilding = (building_id, logbook_ids) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_LOGBOOK_TO_BUILDING_REQUEST });
            const res = await Service.assignLogbookToBuilding(building_id, logbook_ids);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ASSIGN_LOGBOOK_TO_BUILDING_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ASSIGN_LOGBOOK_TO_BUILDING_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ASSIGN_LOGBOOK_TO_BUILDING_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ASSIGN_LOGBOOK_TO_BUILDING_FAILURE, error: e.response && e.response.data });
        }
    };
};

const assignLogbookToConsultancy = (consultancy_id, logbook_ids) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_LOGBOOK_TO_CONSULTANCY_REQUEST });
            const res = await Service.assignLogbookToConsultancy(consultancy_id, logbook_ids);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ASSIGN_LOGBOOK_TO_CONSULTANCY_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ASSIGN_LOGBOOK_TO_CONSULTANCY_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ASSIGN_LOGBOOK_TO_CONSULTANCY_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ASSIGN_LOGBOOK_TO_CONSULTANCY_FAILURE, error: e.response && e.response.data });
        }
    };
};

const assignActivityToConsultancy = (consultancy_id, activity_ids) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_ACTIVITY_TO_CONSULTANCY_REQUEST });
            const res = await Service.assignActivityToConsultancy(consultancy_id, activity_ids);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ASSIGN_ACTIVITY_TO_CONSULTANCY_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ASSIGN_ACTIVITY_TO_CONSULTANCY_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ASSIGN_ACTIVITY_TO_CONSULTANCY_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ASSIGN_ACTIVITY_TO_CONSULTANCY_FAILURE, error: e.response && e.response.data });
        }
    };
};

const assignActivityToClient = (consultancy_id, activity_ids) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_ACTIVITY_TO_CLIENT_REQUEST });
            const res = await Service.assignActivityToClient(consultancy_id, activity_ids);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ASSIGN_ACTIVITY_TO_CLIENT_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ASSIGN_ACTIVITY_TO_CLIENT_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ASSIGN_ACTIVITY_TO_CLIENT_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ASSIGN_ACTIVITY_TO_CLIENT_FAILURE, error: e.response && e.response.data });
        }
    };
};

const assignLogbookToClient = (client_id, logbook_ids) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_LOGBOOK_TO_CLIENT_REQUEST });
            const res = await Service.assignLogbookToClient(client_id, logbook_ids);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ASSIGN_LOGBOOK_TO_CLIENT_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ASSIGN_LOGBOOK_TO_CLIENT_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ASSIGN_LOGBOOK_TO_CLIENT_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ASSIGN_LOGBOOK_TO_CLIENT_FAILURE, error: e.response && e.response.data });
        }
    };
};

const createSurvey = surveyParams => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.CREATE_SURVEY_REQUEST });
            const res = await Service.createSurvey(surveyParams);
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

const updateActivityCalendarEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_ACTIVITY_CALENDAR_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_ACTIVITY_CALENDAR_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

const exportSchedules = (params, path) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_SCHEDULE_TABLE_REQUEST });
            const res = await Service.exportSchedules(params, path);
            if (res && res.status === 200 && res.data) {
                const text = await new Response(res.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_SCHEDULE_TABLE_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.EXPORT_SCHEDULE_TABLE_SUCCESS, response: {} });
                }
                const { data } = res;
                const name = res.headers["content-disposition"].split("filename=");
                const fileName = name[1].split('"')[1];
                const downloadUrl = window.URL.createObjectURL(new Blob([data]));
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.setAttribute("download", `${fileName}`); //any other extension
                document.body.appendChild(link);
                link.click();
                link.remove();
            } else {
                dispatch({ type: actionTypes.EXPORT_SCHEDULE_TABLE_FAILURE, error: res.response.data });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.EXPORT_SCHEDULE_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteSchedule = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_SCHEDULE_BY_ID_REQUEST });
            const res = await Service.deleteSchedule(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_SCHEDULE_BY_ID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_SCHEDULE_BY_ID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_SCHEDULE_BY_ID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_SCHEDULE_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getListForCommonFilterForActivityCalender = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterForActivityCalender(params);
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

const updateActivityCalendarEntityParamsAnnual = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_ACTIVITY_CALENDAR_ENTITY_PARAMS_ANNUAL_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_ACTIVITY_CALENDAR_ENTITY_PARAMS_ANNUAL_FAILURE,
                error: entityParams
            });
        }
    };
};

const getUndoNaPopupDetails = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_UNDO_NA_POPUP_DETAILS_REQUEST });
            const res = await Service.getUndoNaPopupDetails(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_UNDO_NA_POPUP_DETAILS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_UNDO_NA_POPUP_DETAILS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_UNDO_NA_POPUP_DETAILS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_UNDO_NA_POPUP_DETAILS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getAssignDeemingAgencyForfrequencyPopupDetails = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSIGN_DEEMING_AGENCY_POPUP_FOR_FREQUENCY_DETAILS_REQUEST });
            const res = await Service.getAssignDeemingAgencyForfrequencyPopupDetails(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ASSIGN_DEEMING_AGENCY_POPUP_FOR_FREQUENCY_DETAILS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ASSIGN_DEEMING_AGENCY_POPUP_FOR_FREQUENCY_DETAILS_FAILURE, error: res.data });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ASSIGN_DEEMING_AGENCY_POPUP_FOR_FREQUENCY_DETAILS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ASSIGN_DEEMING_AGENCY_POPUP_FOR_FREQUENCY_DETAILS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const assignDeemingAgencyToFrequency = (id, deeming_agency_ids) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_DEEMING_AGENCY_TO_FREQUENCY_REQUEST });
            const res = await Service.assignDeemingAgencyToFrequency(id, deeming_agency_ids);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ASSIGN_DEEMING_AGENCY_TO_FREQUENCY_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ASSIGN_DEEMING_AGENCY_TO_FREQUENCY_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ASSIGN_DEEMING_AGENCY_TO_FREQUENCY_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ASSIGN_DEEMING_AGENCY_TO_FREQUENCY_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getAssignFrequencyForDeemingAgencyPopupDetails = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSIGN_FREQUENCY_POPUP_FOR_DEEMING_AGENCY_DETAILS_REQUEST });
            const res = await Service.getAssignFrequencyForDeemingAgencyPopupDetails(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ASSIGN_FREQUENCY_POPUP_FOR_DEEMING_AGENCY_DETAILS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ASSIGN_FREQUENCY_POPUP_FOR_DEEMING_AGENCY_DETAILS_FAILURE, error: res.data });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ASSIGN_FREQUENCY_POPUP_FOR_DEEMING_AGENCY_DETAILS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ASSIGN_FREQUENCY_POPUP_FOR_DEEMING_AGENCY_DETAILS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const assignFrequencyToDeemingAgency = (id, deeming_agency_ids) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_FREQUENCY_TO_DEEMING_AGENCY_REQUEST });
            const res = await Service.assignFrequencyToDeemingAgency(id, deeming_agency_ids);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ASSIGN_FREQUENCY_TO_DEEMING_AGENCY_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ASSIGN_FREQUENCY_TO_DEEMING_AGENCY_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ASSIGN_FREQUENCY_TO_DEEMING_AGENCY_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ASSIGN_FREQUENCY_TO_DEEMING_AGENCY_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateAssignPopUpApiTrigger = value => {
    return async dispatch => {
        try {
            if (value) {
                dispatch({
                    type: actionTypes.UPDATE_ASSIGN_POPUP_API_TRIGGER_SUCCESS,
                    response: value
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_ASSIGN_POPUP_API_TRIGGER_FAILURE,
                error: value
            });
        }
    };
};

const updateFrequencyDeemingAgencyApiTrigger = value => {
    return async dispatch => {
        try {
            if (value) {
                dispatch({
                    type: actionTypes.UPDATE_FREQUENCY_DEEMING_AGENCY_API_TRIGGER_SUCCESS,
                    response: value
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_FREQUENCY_DEEMING_AGENCY_API_TRIGGER_FAILURE,
                error: value
            });
        }
    };
};

const getAssignUserForSectorPopupDetails = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSIGN_USER_POPUP_FOR_SECTOR_DETAILS_REQUEST });
            const res = await Service.getAssignUserForSectorPopupDetails(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ASSIGN_USER_POPUP_FOR_SECTOR_DETAILS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ASSIGN_USER_POPUP_FOR_SECTOR_DETAILS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ASSIGN_USER_POPUP_FOR_SECTOR_DETAILS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ASSIGN_USER_POPUP_FOR_SECTOR_DETAILS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const assignUsersToSection = (id, user_ids) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_USER_TO_SECTOR_REQUEST });
            const res = await Service.assignUsersToSection(id, user_ids);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ASSIGN_USER_TO_SECTOR_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ASSIGN_USER_TO_SECTOR_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ASSIGN_USER_TO_SECTOR_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ASSIGN_USER_TO_SECTOR_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getAssignUserForCampusPopupDetails = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSIGN_USER_POPUP_FOR_CAMPUS_DETAILS_REQUEST });
            const res = await Service.getAssignUserForCampusPopupDetails(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ASSIGN_USER_POPUP_FOR_CAMPUS_DETAILS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ASSIGN_USER_POPUP_FOR_CAMPUS_DETAILS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ASSIGN_USER_POPUP_FOR_CAMPUS_DETAILS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ASSIGN_USER_POPUP_FOR_CAMPUS_DETAILS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const assignUsersToCampus = (id, user_ids) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_USER_TO_CAMPUS_REQUEST });
            const res = await Service.assignUsersToCampus(id, user_ids);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ASSIGN_USER_TO_CAMPUS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ASSIGN_USER_TO_CAMPUS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ASSIGN_USER_TO_CAMPUS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ASSIGN_USER_TO_CAMPUS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getAssignUserForBuildingPopupDetails = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSIGN_USER_POPUP_FOR_BUILDING_DETAILS_REQUEST });
            const res = await Service.getAssignUserForBuildingPopupDetails(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ASSIGN_USER_POPUP_FOR_BUILDING_DETAILS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ASSIGN_USER_POPUP_FOR_BUILDING_DETAILS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ASSIGN_USER_POPUP_FOR_BUILDING_DETAILS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ASSIGN_USER_POPUP_FOR_BUILDING_DETAILS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const assignUsersToBuilding = (id, user_ids) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_USER_TO_BUILDING_REQUEST });
            const res = await Service.assignUsersToBuilding(id, user_ids);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ASSIGN_USER_TO_BUILDING_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ASSIGN_USER_TO_BUILDING_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ASSIGN_USER_TO_BUILDING_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ASSIGN_USER_TO_BUILDING_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getAssignBuildingLogbookToUserPopupDetails = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSIGN_BUILDING_LOGBOOK_TO_USER_POPUP_REQUEST });
            const res = await Service.getAssignBuildingLogbookToUserPopupDetails(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ASSIGN_BUILDING_LOGBOOK_TO_USER_POPUP_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ASSIGN_BUILDING_LOGBOOK_TO_USER_POPUP_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ASSIGN_BUILDING_LOGBOOK_TO_USER_POPUP_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ASSIGN_BUILDING_LOGBOOK_TO_USER_POPUP_FAILURE, error: e.response && e.response.data });
        }
    };
};

const assignBuildingLogbookToUser = (id, user_ids) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_BUILDING_LOGBOOK_TO_USER_REQUEST });
            const res = await Service.assignBuildingLogbookToUser(id, user_ids);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ASSIGN_BUILDING_LOGBOOK_TO_USER_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ASSIGN_BUILDING_LOGBOOK_TO_USER_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ASSIGN_BUILDING_LOGBOOK_TO_USER_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ASSIGN_BUILDING_LOGBOOK_TO_USER_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getAssignBuildingToUserPopupDetails = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSIGN_BUILDING_TO_USER_POPUP_REQUEST });
            const res = await Service.getAssignBuildingToUserPopupDetails(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ASSIGN_BUILDING_TO_USER_POPUP_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ASSIGN_BUILDING_TO_USER_POPUP_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ASSIGN_BUILDING_TO_USER_POPUP_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ASSIGN_BUILDING_TO_USER_POPUP_FAILURE, error: e.response && e.response.data });
        }
    };
};

const assignBuildingToUser = (id, user_ids) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_BUILDING_TO_USER_REQUEST });
            const res = await Service.assignBuildingToUser(id, user_ids);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ASSIGN_BUILDING_TO_USER_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ASSIGN_BUILDING_TO_USER_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ASSIGN_BUILDING_TO_USER_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ASSIGN_BUILDING_TO_USER_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getAssignConsultancyToLogbookPopupDetails = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSIGN_CONSULTANCY_TO_LOGBOOK_POPUP_REQUEST });
            const res = await Service.getAssignConsultancyToLogbookPopupDetails(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ASSIGN_CONSULTANCY_TO_LOGBOOK_POPUP_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ASSIGN_CONSULTANCY_TO_LOGBOOK_POPUP_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ASSIGN_CONSULTANCY_TO_LOGBOOK_POPUP_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ASSIGN_CONSULTANCY_TO_LOGBOOK_POPUP_FAILURE, error: e.response && e.response.data });
        }
    };
};

const assignConsultancyToLogbook = (id, user_ids) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_CONSULTANCY_TO_LOGBOOK_REQUEST });
            const res = await Service.assignConsultancyToLogbook(id, user_ids);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ASSIGN_CONSULTANCY_TO_LOGBOOK_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ASSIGN_CONSULTANCY_TO_LOGBOOK_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ASSIGN_CONSULTANCY_TO_LOGBOOK_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ASSIGN_CONSULTANCY_TO_LOGBOOK_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getAssignClientToLogbookPopupDetails = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSIGN_CLIENT_TO_LOGBOOK_POPUP_REQUEST });
            const res = await Service.getAssignClientToLogbookPopupDetails(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ASSIGN_CLIENT_TO_LOGBOOK_POPUP_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ASSIGN_CLIENT_TO_LOGBOOK_POPUP_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ASSIGN_CLIENT_TO_LOGBOOK_POPUP_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ASSIGN_CLIENT_TO_LOGBOOK_POPUP_FAILURE, error: e.response && e.response.data });
        }
    };
};

const assignClientToLogbook = (id, user_ids) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_CLIENT_TO_LOGBOOK_REQUEST });
            const res = await Service.assignClientToLogbook(id, user_ids);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ASSIGN_CLIENT_TO_LOGBOOK_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ASSIGN_CLIENT_TO_LOGBOOK_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ASSIGN_CLIENT_TO_LOGBOOK_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ASSIGN_CLIENT_TO_LOGBOOK_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getAssignBuildingToLogbookPopupDetails = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSIGN_BUILDING_TO_LOGBOOK_POPUP_REQUEST });
            const res = await Service.getAssignBuildingToLogbookPopupDetails(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ASSIGN_BUILDING_TO_LOGBOOK_POPUP_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ASSIGN_BUILDING_TO_LOGBOOK_POPUP_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ASSIGN_BUILDING_TO_LOGBOOK_POPUP_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ASSIGN_BUILDING_TO_LOGBOOK_POPUP_FAILURE, error: e.response && e.response.data });
        }
    };
};

const assignBuildingToLogbook = (id, user_ids) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_BUILDING_TO_LOGBOOK_REQUEST });
            const res = await Service.assignBuildingToLogbook(id, user_ids);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ASSIGN_BUILDING_TO_LOGBOOK_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ASSIGN_BUILDING_TO_LOGBOOK_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ASSIGN_BUILDING_TO_LOGBOOK_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ASSIGN_BUILDING_TO_LOGBOOK_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getLogbookCreateSurveyPopupDetails = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LOGBOOK_CREATE_SURVEY_POPUP_REQUEST });
            const res = await Service.getLogbookCreateSurveyPopupDetails(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_LOGBOOK_CREATE_SURVEY_POPUP_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_LOGBOOK_CREATE_SURVEY_POPUP_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_LOGBOOK_CREATE_SURVEY_POPUP_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_LOGBOOK_CREATE_SURVEY_POPUP_FAILURE, error: e.response && e.response.data });
        }
    };
};

const createSurveyBuildingLogbook = (surveyParams, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.CREATE_SURVEY_BUILDING_LOGBOOK_REQUEST });
            const res = await Service.createSurveyBuildingLogbook(surveyParams, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.CREATE_SURVEY_BUILDING_LOGBOOK_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.CREATE_SURVEY_BUILDING_LOGBOOK_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.CREATE_SURVEY_BUILDING_LOGBOOK_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.CREATE_SURVEY_BUILDING_LOGBOOK_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getAssignConsultancyToActivityPopupDetails = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSIGN_CONSULTANCY_TO_ACTIVITY_POPUP_REQUEST });
            const res = await Service.getAssignConsultancyToActivityPopupDetails(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ASSIGN_CONSULTANCY_TO_ACTIVITY_POPUP_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ASSIGN_CONSULTANCY_TO_ACTIVITY_POPUP_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ASSIGN_CONSULTANCY_TO_ACTIVITY_POPUP_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ASSIGN_CONSULTANCY_TO_ACTIVITY_POPUP_FAILURE, error: e.response && e.response.data });
        }
    };
};

const assignConsultancyToActivity = (id, user_ids) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_CONSULTANCY_TO_ACTIVITY_REQUEST });
            const res = await Service.assignConsultancyToActivity(id, user_ids);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ASSIGN_CONSULTANCY_TO_ACTIVITY_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ASSIGN_CONSULTANCY_TO_ACTIVITY_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ASSIGN_CONSULTANCY_TO_ACTIVITY_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ASSIGN_CONSULTANCY_TO_ACTIVITY_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getAssignClientToActivityPopupDetails = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSIGN_CLIENT_TO_ACTIVITY_POPUP_REQUEST });
            const res = await Service.getAssignClientToActivityPopupDetails(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ASSIGN_CLIENT_TO_ACTIVITY_POPUP_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ASSIGN_CLIENT_TO_ACTIVITY_POPUP_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ASSIGN_CLIENT_TO_ACTIVITY_POPUP_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ASSIGN_CLIENT_TO_ACTIVITY_POPUP_FAILURE, error: e.response && e.response.data });
        }
    };
};

const assignClientToActivity = (id, user_ids) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_CLIENT_TO_ACTIVITY_REQUEST });
            const res = await Service.assignClientToActivity(id, user_ids);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ASSIGN_CLIENT_TO_ACTIVITY_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ASSIGN_CLIENT_TO_ACTIVITY_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ASSIGN_CLIENT_TO_ACTIVITY_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ASSIGN_CLIENT_TO_ACTIVITY_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getAssignBuildingToActivityPopupDetails = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSIGN_BUILDING_TO_ACTIVITY_POPUP_REQUEST });
            const res = await Service.getAssignBuildingToActivityPopupDetails(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ASSIGN_BUILDING_TO_ACTIVITY_POPUP_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ASSIGN_BUILDING_TO_ACTIVITY_POPUP_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ASSIGN_BUILDING_TO_ACTIVITY_POPUP_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ASSIGN_BUILDING_TO_ACTIVITY_POPUP_FAILURE, error: e.response && e.response.data });
        }
    };
};

const assignBuildingToActivity = (id, user_ids) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_BUILDING_TO_ACTIVITY_REQUEST });
            const res = await Service.assignBuildingToActivity(id, user_ids);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ASSIGN_BUILDING_TO_ACTIVITY_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ASSIGN_BUILDING_TO_ACTIVITY_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ASSIGN_BUILDING_TO_ACTIVITY_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ASSIGN_BUILDING_TO_ACTIVITY_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getActivityCreateSurveyPopupDetails = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ACTIVITY_CREATE_SURVEY_POPUP_REQUEST });
            const res = await Service.getActivityCreateSurveyPopupDetails(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ACTIVITY_CREATE_SURVEY_POPUP_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ACTIVITY_CREATE_SURVEY_POPUP_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ACTIVITY_CREATE_SURVEY_POPUP_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ACTIVITY_CREATE_SURVEY_POPUP_FAILURE, error: e.response && e.response.data });
        }
    };
};

const createSurveyBuildingActivity = (surveyParams, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.CREATE_SURVEY_BUILDING_ACTIVITY_REQUEST });
            const res = await Service.createSurveyBuildingActivity(surveyParams, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.CREATE_SURVEY_BUILDING_ACTIVITY_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.CREATE_SURVEY_BUILDING_ACTIVITY_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.CREATE_SURVEY_BUILDING_ACTIVITY_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.CREATE_SURVEY_BUILDING_ACTIVITY_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getAssignProcedureToActivityPopupDetails = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSIGN_PROCEDURE_TO_ACTIVITY_POPUP_REQUEST });
            const res = await Service.getAssignProcedureToActivityPopupDetails(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_ASSIGN_PROCEDURE_TO_ACTIVITY_POPUP_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_ASSIGN_PROCEDURE_TO_ACTIVITY_POPUP_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_ASSIGN_PROCEDURE_TO_ACTIVITY_POPUP_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ASSIGN_PROCEDURE_TO_ACTIVITY_POPUP_FAILURE, error: e.response && e.response.data });
        }
    };
};

const assignProcedureToActivity = (id, user_ids) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_PROCEDURE_TO_ACTIVITY_REQUEST });
            const res = await Service.assignProcedureToActivity(id, user_ids);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ASSIGN_PROCEDURE_TO_ACTIVITY_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ASSIGN_PROCEDURE_TO_ACTIVITY_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ASSIGN_PROCEDURE_TO_ACTIVITY_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ASSIGN_PROCEDURE_TO_ACTIVITY_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getUnReadNotifications = login => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_UNREAD_NOTIFICATIONS_REQUEST });
            const res = await Service.getUnReadNotifications(login);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_UNREAD_NOTIFICATIONS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_UNREAD_NOTIFICATIONS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_UNREAD_NOTIFICATIONS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_UNREAD_NOTIFICATIONS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteUnReadNotifications = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_UNREAD_NOTIFICATIONS_REQUEST });
            const res = await Service.deleteUnReadNotifications(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_UNREAD_NOTIFICATIONS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_UNREAD_NOTIFICATIONS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_UNREAD_NOTIFICATIONS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_UNREAD_NOTIFICATIONS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const readNotification = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.READ_NOTIFICATION_REQUEST });
            const res = await Service.readNotification(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.READ_NOTIFICATION_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.READ_NOTIFICATION_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.READ_NOTIFICATION_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.READ_NOTIFICATION_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getFilterDropdownData = (params, path) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_FILTER_DROPDOWN_DATA_REQUEST });
            const res = await Service.getFilterDropdownData(params, path);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_FILTER_DROPDOWN_DATA_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_FILTER_DROPDOWN_DATA_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_FILTER_DROPDOWN_DATA_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_FILTER_DROPDOWN_DATA_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getDeviceDocuments = (id,asset_id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_DEVICE_DOCUMENTS_REQUEST });
            const res = await Service.getDeviceDocuments(id,asset_id);
            console.log('ss00',res)
            if (res && res.status === 200) {
                if (res.data) {
                    console.log("hh",res.data)
                    dispatch({ type: actionTypes.GET_DEVICE_DOCUMENTS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_DEVICE_DOCUMENTS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_DEVICE_DOCUMENTS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_DEVICE_DOCUMENTS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const saveDeviceCount = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.SAVE_DEVICE_COUNT_REQUEST });
            const res = await Service.saveDeviceCount(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.SAVE_DEVICE_COUNT_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.SAVE_DEVICE_COUNT_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.SAVE_DEVICE_COUNT_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.SAVE_DEVICE_COUNT_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deleteDeviceCount = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_DEVICE_COUNT_REQUEST });
            const res = await Service.deleteDeviceCount(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.DELETE_DEVICE_COUNT_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.DELETE_DEVICE_COUNT_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_DEVICE_COUNT_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_DEVICE_COUNT_FAILURE, error: e.response && e.response.data });
        }
    };
};

const setAuditMode = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.SET_AUDIT_MODE_REQUEST });
            const res = await Service.setAuditMode(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.SET_AUDIT_MODE_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.SET_AUDIT_MODE_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.SET_AUDIT_MODE_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.SET_AUDIT_MODE_FAILURE, error: e.response && e.response.data });
        }
    };
};
const resetPassword = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.SET_RESET_PASSWORD_REQUEST });
            const user_id = localStorage.getItem("user_id")
            const res = await Service.resetPassword(params,user_id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.SET_RESET_PASSWORD_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.SET_RESET_PASSWORD_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.SET_RESET_PASSWORD_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.SET_RESET_PASSWORD_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getGLTDetails = survey_date_id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_G_L_T_DETAILS_REQUEST });
            const res = await Service.getGLTDetails(survey_date_id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_G_L_T_DETAILS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_G_L_T_DETAILS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_G_L_T_DETAILS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_G_L_T_DETAILS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getPreviousSurveys = survey_date_id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_PREVIOUS_SURVEYS_REQUEST });
            const res = await Service.getPreviousSurveys(survey_date_id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_PREVIOUS_SURVEYS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_PREVIOUS_SURVEYS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_PREVIOUS_SURVEYS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_PREVIOUS_SURVEYS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getPreviousLocations = survey_date_id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_PREVIOUS_LOCATIONS_REQUEST });
            const res = await Service.getPreviousLocations(survey_date_id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_PREVIOUS_LOCATIONS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_PREVIOUS_LOCATIONS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_PREVIOUS_LOCATIONS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_PREVIOUS_LOCATIONS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getPreviousDays = survey_date_id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_PREVIOUS_DAYS_REQUEST });
            const res = await Service.getPreviousDays(survey_date_id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_PREVIOUS_DAYS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_PREVIOUS_DAYS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_PREVIOUS_DAYS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_PREVIOUS_DAYS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const fetchFormSettings = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.FETCH_FORM_SETTINGS_REQUEST });
            const res = await Service.fetchFormSettings(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.FETCH_FORM_SETTINGS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.FETCH_FORM_SETTINGS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.FETCH_FORM_SETTINGS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.FETCH_FORM_SETTINGS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const checkBuildingCount = (params, path) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.CHECK_BUILDING_COUNT_REQUEST });
            const res = await Service.checkBuildingCount(params, path);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.CHECK_BUILDING_COUNT_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.CHECK_BUILDING_COUNT_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.CHECK_BUILDING_COUNT_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.CHECK_BUILDING_COUNT_FAILURE, error: e.response && e.response.data });
        }
    };
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getAllLogbooks,
    getSchedulesByLogbookId,
    getTrailingSchedulesByLogbookId,
    setActivityTableWidth,
    getActivityTableWidth,
    getSurveyDetails,
    getLogbookDocuments,
    saveActivityEvent,
    uploadDocuments,
    removeAttachment,
    getActivityEventPopupDetails,
    executeActivityEvent,
    getAssignActivityPopupDetails,
    getAssignBuildingActivitiesPopupDetails,
    getCreateSurveyPopupDetails,
    getCurrentAssignments,
    assignActivityToBuilding,
    assignClientActivityToBuilding,
    createSurvey,
    getAssignLogbookPopupDetails,
    getCreateSurveyPopupDetailsForBuilding,
    getCreateSurveyPopupDetailsForBuildingActivities,
    assignLogbookToBuilding,
    updateActivityCalendarEntityParams,
    getAssignLogbookForConsultancyPopupDetails,
    getAssignLogbookForClientPopupDetails,
    assignLogbookToConsultancy,
    assignLogbookToClient,
    exportSchedules,
    deleteSchedule,
    getListForCommonFilterForActivityCalender,
    updateActivityCalendarEntityParamsAnnual,
    getUndoNaPopupDetails,
    undoNa,
    getAssignActivityForConsultancyPopupDetails,
    assignActivityToConsultancy,
    getAssignActivityForClientPopupDetails,
    assignActivityToClient,
    getAssignDeemingAgencyForfrequencyPopupDetails,
    assignDeemingAgencyToFrequency,
    getAssignFrequencyForDeemingAgencyPopupDetails,
    assignFrequencyToDeemingAgency,
    updateAssignPopUpApiTrigger,
    updateFrequencyDeemingAgencyApiTrigger,
    getAssignUserForSectorPopupDetails,
    assignUsersToSection,
    getAssignUserForCampusPopupDetails,
    assignUsersToCampus,
    getAssignUserForBuildingPopupDetails,
    assignUsersToBuilding,
    getAssignBuildingLogbookToUserPopupDetails,
    assignBuildingLogbookToUser,
    getAssignBuildingToUserPopupDetails,
    assignBuildingToUser,
    assignConsultancyToLogbook,
    getAssignConsultancyToLogbookPopupDetails,
    getAssignClientToLogbookPopupDetails,
    assignClientToLogbook,
    assignBuildingToLogbook,
    getAssignBuildingToLogbookPopupDetails,
    getLogbookCreateSurveyPopupDetails,
    createSurveyBuildingLogbook,
    assignConsultancyToActivity,
    getAssignConsultancyToActivityPopupDetails,
    getAssignClientToActivityPopupDetails,
    assignClientToActivity,
    assignBuildingToActivity,
    getAssignBuildingToActivityPopupDetails,
    getActivityCreateSurveyPopupDetails,
    createSurveyBuildingActivity,
    getAssignProcedureToActivityPopupDetails,
    assignProcedureToActivity,
    getUnReadNotifications,
    deleteUnReadNotifications,
    getFilterDropdownData,
    getDeviceDocuments,
    saveDeviceCount,
    setAuditMode,
    readNotification,
    getGLTDetails,
    getPreviousSurveys,
    getPreviousLocations,
    getPreviousDays,
    checkBuildingCount,
    fetchFormSettings,
    deleteDeviceCount,
    getScheduleDates,
    resetPassword
};
