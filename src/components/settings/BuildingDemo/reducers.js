import { initial } from "lodash";
import * as actionTypes from "./constants";

const initialState = {
    buildingData: {},
    addBuildingData: {},
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
        case actionTypes.ADD_BUILDING_SUCCESS:
            return {
                ...state,
                addBuildingData: { success: true, ...action.response }
            };
        case actionTypes.ADD_BUILDING_FAILURE:
            return {
                ...state,
                addBuildingData: { success: false, ...action.error }
            };
        case actionTypes.GET_BUILDING_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_BUILDING_BY_ID_SUCCESS:
            console.log(action.response);
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
