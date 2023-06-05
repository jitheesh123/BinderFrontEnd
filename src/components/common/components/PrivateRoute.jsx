import React, { Fragment } from "react";
import { Route, Redirect } from "react-router-dom";
import _ from "lodash";

import { toggleTooltip } from "../../../config/utils";
import CommonNav from "./CommonNav";
import TopFilter from "./TopFilter";

let defaultMasterFilters = {
    logbook_ids: [],
    building_ids: [],
    building_type_ids: [],
    campus_ids: [],
    sector_ids: [],
    client_ids: [],
    consultancy_ids: [],
    view: "trailing",
    annual_years: [`${new Date().getFullYear()}`]
};
class PrivateRoute extends React.Component {
    state = {
        showNav: true,
        showEntityCount: false,
        showMasterFilter: false,
        isMasterFiltered: !_.isEqual(defaultMasterFilters, JSON.parse(localStorage.getItem("master_filters"))),
        isLoading: true,
        masterFilters: JSON.parse(localStorage.getItem("master_filters"))
    };

    toggleEntityCount = () => {
        this.setState({ showEntityCount: !this.state.showEntityCount });
    };

    toggleMasterFilter = () => {
        this.setState({ showMasterFilter: !this.state.showMasterFilter });
    };

    setIsLoading = isLoading => {
        this.setState({ isLoading });
    };

    setMasterFilter = masterFilters => {
        this.setState({ masterFilters, isMasterFiltered: this.isMasterFiltered() });
    };

    isMasterFiltered = () => {
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        return !_.isEqual(defaultMasterFilters, master_filters);
    };

    render() {
        const { component: Component, ...rest } = this.props;
        const { showEntityCount, isLoading, showMasterFilter, masterFilters, isMasterFiltered } = this.state;
        let audit_mode = localStorage.getItem("audit_mode") && localStorage.getItem("audit_mode") === "true" ? true : false;
        return (
            <Route
                {...rest}
                render={props =>
                    localStorage.getItem("logbook-token") ? (
                        <Fragment>
                            <div className={`${audit_mode ? "in-audit-mode" : ""} ${showMasterFilter ? "master-filter-visible" : ""}`}>
                                <CommonNav
                                    toggleMasterFilter={this.toggleMasterFilter}
                                    isMasterFiltered={isMasterFiltered}
                                    setMasterFilter={this.setMasterFilter}
                                    showMasterFilter={showMasterFilter}
                                />
                                {showMasterFilter ? (
                                    <TopFilter
                                        toggleEntityCount={this.toggleEntityCount}
                                        showEntityCount={showEntityCount}
                                        setIsLoading={this.setIsLoading}
                                        setMasterFilter={this.setMasterFilter}
                                        toggleMasterFilter={this.toggleMasterFilter}
                                    />
                                ) : null}
                                <Component
                                    {...props}
                                    toggleTooltip={toggleTooltip}
                                    showEntityCount={showEntityCount}
                                    isLoading={isLoading}
                                    setIsLoading={this.setIsLoading}
                                    masterFilters={masterFilters}
                                />
                            </div>
                        </Fragment>
                    ) : (
                        <Redirect to={{ pathname: "/" }} />
                    )
                }
            />
        );
    }
}
export default PrivateRoute;
