import * as actionTypes from './constants'

const initialState = {
    reportData: {},
    getListForCommonFilterResponse:{},
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
            perPage: 40,
            currentPage: 0,
            totalCount: 0
        },
        tableConfig: null,
    }
}


export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_SMART_REPORT_REQUEST:
            return {
                ...state
            }
        case actionTypes.GET_SMART_REPORT_SUCCESS: 
            return {
                ...state,
                reportData: { success: true, ...action.response }
            }
        case actionTypes.GET_SMART_REPORT_FAILURE:
            return {
                ...state,
                reportData: { success: false, ...action.error }
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
        case actionTypes.UPDATE_SMART_REPORT_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionTypes.UPDATE_SMART_REPORT_ENTITY_PARAMS_FAILURE:
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