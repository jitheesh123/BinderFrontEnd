import React, { Component } from "react";
import ReactTooltip from "react-tooltip";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";

import Loader from "./Loader";
import ToastMsg from "../ToastMessage";
import actions from "../actions";
import Portal from "./Portal";
import AppliedMasterFiltersModal from "./AppliedMasterFiltersModal";
import { defaultYearsList } from "../../../config/utils";

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
class TopFilter extends Component {
    constructor(props) {
        super(props);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        let master_filters_applied = JSON.parse(localStorage.getItem("master_filters_applied"));
        let user_role = localStorage.getItem("user_role");
        this.state = {
            yearsList: defaultYearsList,
            selectedYears: [],
            masterFilterList: [
                { key: "consultancies", isVisible: user_role === "super_admin" ? true : false, paramKey: "consultancy_ids", label: "Consultancies" },
                {
                    key: "clients",
                    isVisible: user_role === "super_admin" || user_role === "consultancy_user" ? true : false,
                    paramKey: "client_ids",
                    label: "Clients"
                },
                { key: "logbooks", isVisible: true, paramKey: "logbook_ids", label: "Logbooks" },
                { key: "sectors", isVisible: true, paramKey: "sector_ids", label: "Sectors" },
                { key: "campus", isVisible: true, paramKey: "campus_ids", label: "Campuses" },
                { key: "buildings", isVisible: true, paramKey: "building_ids", label: "Buildings" },
                { key: "building_types", isVisible: true, paramKey: "building_type_ids", label: "Building types" }
            ],
            master_filters,
            master_filters_applied,
            selectedFiterDropdown: null,
            filterDriodownList: [],
            isLoadingDropdown: true,
            showAppliedMasterFilterModal: false
        };
    }

    componentDidMount = async () => {
        document.addEventListener("mousedown", this.handleClickOutside);
    };

    componentWillUnmount = () => {
        document.removeEventListener("mousedown", this.handleClickOutside);
    };

    setWrapperRef = node => {
        this.wrapperRef = node;
    };

    handleClickOutside = event => {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.getFilterDropdownData(null);
        }
    };

    getFilterDropdownData = async (key, doGetFilters) => {
        const { selectedFiterDropdown } = this.state;
        await this.setState({
            selectedFiterDropdown: selectedFiterDropdown === key ? null : key,
            isLoadingDropdown: true
        });
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        if (doGetFilters) {
            await this.props.getFilterDropdownData(master_filters, key);
            const {
                commonReducer: { getFilterDropdownDataResponse }
            } = this.props;
            if (getFilterDropdownDataResponse && getFilterDropdownDataResponse.success) {
                await this.setState({
                    filterDriodownList: getFilterDropdownDataResponse[key]
                });
            }
        }
        await this.setState({
            isLoadingDropdown: false,
            master_filters
        });
        if(key==="annual_years")
        {
        let myDiv = document.getElementById(`customCheck${new Date().getFullYear()}`);
        if (myDiv) myDiv.scrollIntoView();
        }
    };

    toggleAnnualTrailing = async choice => {
        const { master_filters, master_filters_applied } = this.state;
        const { toggleMasterFilter } = this.props;
        let annual_years = choice === "trailing" ? [`${new Date().getFullYear()}`] : master_filters.annual_years;
        await this.setState({
            master_filters: {
                ...master_filters,
                view: choice,
                annual_years
            },
            master_filters_applied: {
                ...master_filters_applied,
                view: choice,
                annual_years
            }
        });
        toggleMasterFilter();
        this.updateMMasterFilter();
    };

    setMasterFilterParams = async (key, id, name) => {
        const { master_filters, master_filters_applied, filterDriodownList, yearsList } = this.state;
        let tempList = master_filters[key];
        let tempAppliedFilters = master_filters_applied[key];
        if (id === "all") {
            if (key === "annual_years") {
                if (yearsList && yearsList.length && yearsList.length === tempList.length) {
                    tempList = [`${new Date().getFullYear()}`];
                } else {
                    tempList = yearsList.map(item => item);
                    tempList.sort();
                }
                tempList.sort();
                tempAppliedFilters = tempList;
            } else {
                if (filterDriodownList && filterDriodownList.length && filterDriodownList.length === tempList.length) {
                    tempList = [];
                    tempAppliedFilters = [];
                } else {
                    tempList = filterDriodownList.map(item => item.id);
                    tempAppliedFilters = filterDriodownList.map(item => item.name);
                }
            }
        } else {
            if (key === "annual_years") {
                if (!tempList.includes(id)) {
                    tempList.push(id);
                } else {
                    if (tempList.length > 1) {
                        tempList = tempList.filter(item => item !== id);
                    } else {
                        ToastMsg("At least one year must be selected !", "warn");
                    }
                }
                tempList.sort();
                tempAppliedFilters = tempList.sort();
            } else {
                if (!tempList.includes(id)) {
                    tempList.push(id);
                } else {
                    tempList = tempList.filter(item => item !== id);
                }
                if (!tempAppliedFilters.includes(name)) {
                    tempAppliedFilters.push(name);
                } else {
                    tempAppliedFilters = tempAppliedFilters.filter(item => item !== name);
                }
            }
        }
        await this.setState({
            master_filters: {
                ...master_filters,
                [key]: tempList
            },
            master_filters_applied: {
                ...master_filters_applied,
                [key]: tempAppliedFilters
            }
        });
    };

    updateMMasterFilter = async () => {
        const { master_filters, master_filters_applied } = this.state;
        const { setMasterFilter } = this.props;
        await localStorage.setItem("master_filters", JSON.stringify(master_filters));
        await localStorage.setItem("master_filters_applied", JSON.stringify(master_filters_applied));
        await this.setState({
            selectedFiterDropdown: null
        });
        setMasterFilter(master_filters);
    };

    isMasterFiltered = key => {
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        let initialAnnualYears = [`${new Date().getFullYear()}`];
        if (key === "checkAll") {
            return !_.isEqual(defaultMasterFilters, master_filters);
        } else {
            if (key === "view") {
                if (master_filters.view === "annual") return true;
            } else if (key === "annual_years") {
                if (master_filters.view === "annual") {
                    return !_.isEqual(initialAnnualYears, master_filters.annual_years);
                } else {
                    return false;
                }
            } else {
                if (master_filters[key].length) return true;
            }
        }
    };

    resetMasterFilter = async () => {
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
        await this.setState({
            master_filters: defaultMasterFilters,
            master_filters_applied: defaultMasterFilters
        });
        this.updateMMasterFilter();
    };

    toggleAppliedMasterFilterModal = item => {
        const { showAppliedMasterFilterModal } = this.state;
        this.setState({
            showAppliedMasterFilterModal: !showAppliedMasterFilterModal
        });
    };

    renderAppliedMasterFiltersModal = () => {
        const { showAppliedMasterFilterModal } = this.state;
        if (!showAppliedMasterFilterModal) return null;
        return (
            <Portal
                body={<AppliedMasterFiltersModal onCancel={this.toggleAppliedMasterFilterModal} />}
                onCancel={this.toggleAppliedMasterFilterModal}
            />
        );
    };

    render() {
        const { yearsList, masterFilterList, filterDriodownList, isLoadingDropdown, selectedFiterDropdown, master_filters } = this.state;
        const {
            showEntityCount,
            location: { pathname },
            toggleMasterFilter
        } = this.props;
        
        return (
            <>
                <div className="hd-top master-filter-container" ref={this.setWrapperRef}>
                    <ReactTooltip effect="solid" />
                    <div className="collapse show" id="masterFilters">
                        <div className="lft-element drop-fil">
                            {masterFilterList && masterFilterList.length
                                ? masterFilterList.map(item =>
                                      item.isVisible ? (
                                          <div className={`${this.isMasterFiltered(item.paramKey) ? "filtered" : ""} dropdown show`}>
                                              <button
                                                  className="btn btn-secondary dropdown-toggle"
                                                  type="button"
                                                  id={item.key}
                                                  onClick={() => this.getFilterDropdownData(item.key, true)}
                                              >
                                                  {item.label} <i className="d-arrow"></i>
                                              </button>
                                              {selectedFiterDropdown && selectedFiterDropdown === item.key ? (
                                                  <div className="dropdown-menu show" aria-labelledby={item.key} x-placement="bottom-start">
                                                      <div className="dropdown-item">
                                                          <div className="custom-control custom-checkbox">
                                                              <input
                                                                  type="checkbox"
                                                                  className="custom-control-input"
                                                                  id="customCheck"
                                                                  checked={
                                                                      filterDriodownList &&
                                                                      filterDriodownList.length &&
                                                                      filterDriodownList.length === master_filters[item.paramKey].length
                                                                  }
                                                                  onClick={() => this.setMasterFilterParams(item.paramKey, "all", "")}
                                                              />
                                                              <label className="custom-control-label" for="customCheck">
                                                                  Select All
                                                              </label>
                                                          </div>
                                                      </div>
                                                      <hr />
                                                      {!isLoadingDropdown ? (
                                                          <div className="drp-scroll">
                                                              {filterDriodownList && filterDriodownList.length ? (
                                                                  filterDriodownList.map((dropdownItem, i) => (
                                                                      <div className="dropdown-item">
                                                                          <div className="custom-control custom-checkbox">
                                                                              <input
                                                                                  type="checkbox"
                                                                                  className="custom-control-input"
                                                                                  id={`customCheck${i}`}
                                                                                  checked={master_filters[item.paramKey].includes(dropdownItem.id)}
                                                                                  onClick={() =>
                                                                                      this.setMasterFilterParams(
                                                                                          item.paramKey,
                                                                                          dropdownItem.id,
                                                                                          dropdownItem.name
                                                                                      )
                                                                                  }
                                                                              />
                                                                              <label className="custom-control-label" for={`customCheck${i}`}>
                                                                                  {dropdownItem.name}
                                                                              </label>
                                                                          </div>
                                                                      </div>
                                                                  ))
                                                              ) : (
                                                                  <div className="dropdown-item">
                                                                      <div>No Data</div>
                                                                  </div>
                                                              )}
                                                          </div>
                                                      ) : (
                                                          <div className="dropdown-item">
                                                              <Loader />
                                                          </div>
                                                      )}
                                                      <div className="btn-otr d-flex justify-content-center">
                                                          <button
                                                              className="btn btn-create justify-content-center"
                                                              onClick={() => this.updateMMasterFilter()}
                                                          >
                                                              Update View
                                                          </button>
                                                      </div>
                                                  </div>
                                              ) : null}
                                          </div>
                                      ) : null
                                  )
                                : null}

                            {master_filters.view === "annual" ? (
                                <div className={`${this.isMasterFiltered("annual_years") ? "filtered" : ""} dropdown show`}>
                                    <button
                                        className="btn btn-secondary dropdown-toggle"
                                        type="button"
                                        id="AnnualYearsDropdown"
                                        onClick={() => this.getFilterDropdownData("annual_years", false)}
                                    >
                                        Annual Years<i className="d-arrow"></i>
                                    </button>
                                    {selectedFiterDropdown && selectedFiterDropdown === "annual_years" ? (
                                        <div className="dropdown-menu show" aria-labelledby="AnnualYearsDropdown">
                                            <div className="dropdown-item">
                                                <div className="custom-control custom-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        className="custom-control-input"
                                                        id="customCheck"
                                                        checked={
                                                            yearsList && yearsList.length && yearsList.length === master_filters.annual_years.length
                                                        }
                                                        onClick={() => this.setMasterFilterParams("annual_years", "all", "")}
                                                    />
                                                    <label className="custom-control-label" for="customCheck">
                                                        Select All
                                                    </label>
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="drp-scroll">
                                                {yearsList && yearsList.length ? (
                                                    yearsList.map(year => (
                                                        <div className="dropdown-item">
                                                            <div className="custom-control custom-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="custom-control-input"
                                                                    checked={master_filters.annual_years.includes(year)}
                                                                    id={`customCheck${year}`}
                                                                    onClick={() => this.setMasterFilterParams("annual_years", year, year)}
                                                                />
                                                                <label className="custom-control-label" for={`customCheck${year}`}>
                                                                    {year}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="dropdown-item">
                                                        <div>No data</div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="btn-otr d-flex justify-content-center">
                                                <button className="btn btn-create justify-content-center" onClick={() => this.updateMMasterFilter()}>
                                                    Update View
                                                </button>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            ) : null}

                            <div className={`${this.isMasterFiltered("view") ? "filtered" : ""} toggle-section`}>
                                <span class="first-itm">Annual</span>
                                <span class="toggle-btn">
                                    <input type="checkbox" id="masterFilterSwitch" checked={master_filters.view === "trailing"} />
                                    <label
                                        for="masterFilterSwitch"
                                        onClick={() => this.toggleAnnualTrailing(master_filters.view === "trailing" ? "annual" : "trailing")}
                                    >
                                        Toggle
                                    </label>
                                </span>
                                <span class="last-itm">Trailing</span>
                            </div>
                            <div className="btn-grp btn-grp-top">
                                {pathname === "/dashboard" ? (
                                    <>
                                        {showEntityCount ? (
                                            <button
                                                className="active btn"
                                                onClick={() => this.props.toggleEntityCount()}
                                                data-tip="Hide Counts"
                                                data-place="bottom"
                                            >
                                                <img src="/images/view-cross.svg" alt="" />
                                            </button>
                                        ) : (
                                            <button
                                                className="btn"
                                                onClick={() => this.props.toggleEntityCount()}
                                                data-tip="Show Counts"
                                                data-place="bottom"
                                            >
                                                <img src="/images/view.svg" alt="" />
                                            </button>
                                        )}
                                    </>
                                ) : null}
                                {this.isMasterFiltered("checkAll") ? (
                                    <>
                                        <button
                                            className="btn"
                                            onClick={() => this.toggleAppliedMasterFilterModal()}
                                            data-tip="View Filters"
                                            data-place="bottom"
                                        >
                                            <img src="/images/wild-card.svg" alt="" />
                                        </button>
                                        <button className="btn active" onClick={() => this.resetMasterFilter()} data-tip="Reset" data-place="bottom">
                                            <img src="/images/reset-wild-card.svg" alt="" />
                                        </button>
                                    </>
                                ) : null}
                                <button type="button" class="btn close" onClick={() => toggleMasterFilter()} data-tip="Close" data-place="bottom">
                                    <i class="material-icons">close </i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {this.renderAppliedMasterFiltersModal()}
            </>
        );
    }
}

const mapStateToProps = state => {
    const { commonReducer } = state;
    return { commonReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(TopFilter));
