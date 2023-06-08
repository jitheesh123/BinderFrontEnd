import { initial } from "lodash";
import * as actionTypes from "./constants";

const initialState = {
    buildingData: {},
    CommonResposeReduer: {},
    getBuildingByIdResponse: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_BUILDING_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_BUILDING_SUCCESS:
            return {
                ...state,
                buildingData: { success: true, ...action.response }
            };
        case actionTypes.GET_BUILDING_FAILURE:
            return {
                ...state,
                buildingData: { success: false, ...action.error }
            };
        case actionTypes.COMMON_BUILDING_SUCCESS:
            return {
                ...state,
                CommonResposeReduer: { success: true, ...action.response }
            };
        case actionTypes.COMMON_BUILDING_FAILURE:
            return {
                ...state,
                CommonResposeReduer: { success: false, ...action.error }
            };
        case actionTypes.CLEAR_ADDBUILDING_DATA:
            return {
                ...state,
                CommonResposeReduer: {}
            };
        case actionTypes.GET_BUILDING_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_BUILDING_BY_ID_SUCCESS:
            return {
                ...state,
                getBuildingByIdResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_BUILDING_BY_ID_FAILURE:
            return {
                ...state,
                getBuildingByIdResponse: { success: false, ...action.error }
            };
        default:
            return {
                ...state
            };
    }
};
