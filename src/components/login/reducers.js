import * as actionTypes from "./contstants";
const initialState = {
    loginUser: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_REQUEST:
            return {
                ...state
            };
        case actionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                loginUser: { success: true, ...action.response }
            };
        case actionTypes.LOGIN_FAILURE:
            return {
                ...state,
                loginUser: { success: false, ...action.error }
            };
        default:
            return state;
    }
};
