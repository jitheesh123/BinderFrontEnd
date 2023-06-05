import React from "react";
import { Route, Redirect } from "react-router-dom";

const PublicRoute = ({ component: Component, ...rest }) => {
    let audit_mode = localStorage.getItem("audit_mode") && localStorage.getItem("audit_mode") === "true" ? true : false;
    return (
        <Route
            {...rest}
            render={props =>
                localStorage.getItem("logbook-token") ? (
                    <Redirect to={audit_mode ? { pathname: "/logbooksmain" } : { pathname: "/dashboard" }} />
                ) : (
                    <Component {...props} />
                )
            }
        />
    );
};
export default PublicRoute;
