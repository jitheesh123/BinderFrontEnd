import * as actionTypes from './constants'

const initialState = {
    userBuildingData: {},
    deleteUserBuildingData:{},
    getListForCommonFilterResponse:{},
    getUserBuildingByIdResponse:{},
    entityParams: {
        params: {
            limit: 40,
            page: 1,
            search: "",
            filters:null,
            order:null,
            list:null
        },
        paginationParams: {
            totalPages: 0,
            perPage: 10,
            currentPage: 0,
            totalCount: 0
        },
        tableConfig: null,
    }
}


export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_USER_BUILDING_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_USER_BUILDING_SUCCESS: 
            return {
                ...state,
                userBuildingData: { success: true, ...action.response }
            }
        case actionTypes.GET_USER_BUILDING_FAILURE:
            return {
                ...state,
                userBuildingData: { success: false, ...action.error }
            }

        case actionTypes.DELETE_USER_BUILDING_REQUEST:
                return {
                    ...state
                }
        case actionTypes.DELETE_USER_BUILDING_SUCCESS:
                return {
                    ...state,
                    deleteUserBuildingData: { success: true, ...action.response }
                }
        case actionTypes.DELETE_USER_BUILDING_FAILURE:
                return {
                    ...state,
                    deleteUserBuildingData: { success: false, ...action.error }
                }

        case actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST:
                    return {
                        ...state
                    }
        case actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS: 
                    return {
                        ...state,
                        getListForCommonFilterResponse: { success: true, ...action.response }
                    }
        case actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE:
                    return {
                        ...state,
                        getListForCommonFilterResponse: { success: false, ...action.error }
                    }
        case actionTypes.GET_USER_BUILDING_BY_ID_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_USER_BUILDING_BY_ID_SUCCESS: 
            return {
                ...state,
                getUserBuildingByIdResponse: { success: true, ...action.response }
            }
        case actionTypes.GET_USER_BUILDING_BY_ID_FAILURE:
            return {
                ...state,
                getUserBuildingByIdResponse: { success: false, ...action.error }
            }
        case actionTypes.UPDATE_USER_BUILDING_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_USER_BUILDING_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };
                
 
         
            default :
            return{
                ...state
            }
    }
}