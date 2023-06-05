import * as actionTypes from "./contstants";
import * as Service from "./services";

const login = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.LOGIN_REQUEST });
            const res = await Service.login(params);
            if (res && res.status === 200) {
                const loginData = res.data;
                //TODO change loginData.access_token to emailData.success (change api response)
                if (loginData.access_token) {
                    dispatch({ type: actionTypes.LOGIN_SUCCESS, response: loginData });
                } else {
                    dispatch({ type: actionTypes.LOGIN_FAILURE, error: loginData });
                }
            } else {
                dispatch({ type: actionTypes.LOGIN_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.LOGIN_FAILURE, error: e.response && e.response.data });
        }
    };
};

const Login = {
   login
};
export default Login
