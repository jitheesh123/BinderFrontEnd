import * as actionTypes from './constants'

const initialState ={
    ConsultanciesData:{}
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState,action)=>{    
    
    switch(action.type){
        case actionTypes.GET_CONSULTANCIES_REQUEST :
            return {
                ...state
            }
        case actionTypes.GET_CONSULTANCIES_SUCCESS :
            return {
                ...state, 
                ConsultanciesData : {success:true, ...action.response }
            }
        case actionTypes.GET_CONSULTANCIES_FAILURE :
            return {
                ...state,
                ConsultanciesData :{success: false, ...action.error}
            }

        case actionTypes.GET_ALL_LOGBOOKS_REQUEST:
            return {
                ...state
            };
        case actionTypes.GET_ALL_LOGBOOKS_SUCCESS:
            return {
                ...state,
                allLogbooksResponse: { success: true, ...action.response }
            };
        case actionTypes.GET_ALL_LOGBOOKS_FAILURE:
            return {
                ...state,
                allLogbooksResponse: { success: false, ...action.error }
            };
        default :
            return state;
    }
}