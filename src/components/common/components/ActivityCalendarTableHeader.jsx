import React, { Component } from "react";
import { Multiselect } from "multiselect-react-dropdown";
import { withRouter } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import _ from "lodash";
import moment from "moment";

import ToastMsg from "../ToastMessage";
import GlobalSearch from "./GlobalSearch";
import history from "../../../config/history";
import { yearsListForDD } from "../../../config/utils";
import SendEmailModal from "../../email/components/sendEmailModal";
import Portal from "./Portal";
import ConfirmationModal from "./ConfirmationModal";
class ActivityCalendarTableHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearsList: yearsListForDD,
            selectedYears: [{ id: new Date().getFullYear(), name: new Date().getFullYear() }],
            selectedYearList: [{ id: new Date().getFullYear(), name: new Date().getFullYear() }],
            exportLoading: false,
            exportFireDrillLoading: false,
            showYearSelect: true,
            showSendEmailModal: false,
            showCountWarningModal: false,
            warningCountMessage: "No / Multiple Buildings are selected. Please select one and try again!"
        };
    }

    componentDidMount = async () => {
        const {
            params: { years = [new Date().getFullYear().toString()] }
        } = this.props;
        let tempSelectedYears = years && years.map(year => ({ id: year, name: year }));
        await this.setState({
            selectedYears: tempSelectedYears
        });
        await this.setYearsList();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.masterFilters !== this.props.masterFilters) {
            await this.setYearsList();
        }
    };

    setYearsList = async () => {
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
        const { params } = this.props;
        let tempSelectedYears = params.years && params.years.map(year => ({ id: year, name: year }));
        let tempYearsList = yearsListForDD;
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        if (!_.isEqual(defaultMasterFilters, master_filters)) {
            if (master_filters && master_filters.view === "annual") {
                await this.setState({
                    yearsList: master_filters.annual_years && master_filters.annual_years.map(year => ({ id: year, name: year })),
                    selectedYears: master_filters.annual_years && master_filters.annual_years.map(year => ({ id: year, name: year }))
                });
                if (this.props.setParams) {
                    this.props.setParams(master_filters.annual_years && master_filters.annual_years.map(year => year));
                }
            } else if (master_filters && master_filters.view !== "annual") {
                await this.setState({
                    yearsList: tempYearsList
                });
            }
        } else {
            await this.setState({
                selectedYears: tempSelectedYears,
                yearsList: tempYearsList
            });
        }
        return true;
    };

    onYearSelect = async selectedList => {
        let tempYearList = [];
        tempYearList = selectedList.map(item => item.id);
        selectedList = _.orderBy(selectedList, ["name"], ["asc"]);
        await this.setState({
            selectedYears: selectedList
        });

        this.props.updateYearParam(tempYearList.sort());
    };

    onYearRemove = async selectedList => {
        let tempYearList = [];
        const { selectedYears } = this.state;
        if (selectedList.length) {
            tempYearList = selectedList.map(item => item.id);
            await this.setState({
                selectedYears: selectedList
            });
            await this.props.updateYearParam(tempYearList.sort());
        } else {
            await this.setState({
                showYearSelect: false,
                selectedYears
            });
            ToastMsg("At least one year must be selected !", "warn");
            await this.setState({
                showYearSelect: true
            });
        }
    };

    isSorted = () => {
        const { tableParams = {} } = this.props;
        if (tableParams.order && !_.isEmpty(tableParams.order)) {
            return true;
        }
        return false;
    };

    exportData = async () => {
        let isAllowed = await this.props.checkBuildingCount();
        if (isAllowed) {
            this.setState({
                exportLoading: true
            });
            await this.props.exportTable();
            this.setState({
                exportLoading: false
            });
        } else {
            this.toggleShowCountWarningModal();
        }
    };

    exportFireDrill = async () => {
        let isAllowed = await this.props.checkBuildingCount();
        const { selectedYears } = this.state;
        let tempYearList = selectedYears ? selectedYears.map(item => item.id) : [new Date().getFullYear().toString()];
        if (!tempYearList || tempYearList.length !== 1) {
            await this.setState({
                warningCountMessage: `No / Multiple ${!isAllowed ? "Buildings and" : ""} Years are selected. Please select one and try again!`
            });
            isAllowed = false;
        }
        if (isAllowed) {
            this.setState({
                exportFireDrillLoading: true
            });
            await this.props.exportFireDrill(tempYearList);
            this.setState({
                exportFireDrillLoading: false
            });
        } else {
            this.toggleShowCountWarningModal();
        }
    };

    isWildCardActive = () => {
        const { tableParams = {} } = this.props;
        if (
            (tableParams.filters && !_.isEmpty(tableParams.filters)) ||
            (tableParams.list && !_.isEmpty(tableParams.list)) ||
            (tableParams.date_filters && !_.isEmpty(tableParams.date_filters))
        ) {
            if (tableParams.filters && !_.isEmpty(tableParams.filters)) {
                let res = Object.keys(tableParams.filters).map(filter =>
                    filter && tableParams.filters[filter] && tableParams.filters[filter].key && tableParams.filters[filter].key.length ? true : false
                );
                if (res.includes(true)) {
                    return true;
                }
            }
            if (tableParams.date_filters && !_.isEmpty(tableParams.date_filters)) {
                let res = Object.keys(tableParams.date_filters).map(filter =>
                    filter &&
                    tableParams.date_filters[filter] &&
                    tableParams.date_filters[filter].key &&
                    (tableParams.date_filters[filter].key.length ||
                        tableParams.date_filters[filter].status.length ||
                        tableParams.date_filters[filter].start_date.length ||
                        tableParams.date_filters[filter].end_date.length)
                        ? true
                        : false
                );
                if (res.includes(true)) {
                    return true;
                }
            }
            if (tableParams.list && !_.isEmpty(tableParams.list)) {
                let res = Object.keys(tableParams.list).map(filter =>
                    filter && tableParams.list[filter] && tableParams.list[filter].length ? true : false
                );
                if (res.includes(true)) {
                    return true;
                }
            }
        } else {
            return false;
        }
    };

    checkHasWildCardFiltersForDates = searchKey => {
        const { tableParams = null } = this.props;
        let returnVal = false;
        moment.monthsShort().map((month, i) => {
            if (tableParams && tableParams.date_filters && tableParams.date_filters[month]) {
                if (tableParams.date_filters[month].key && tableParams.date_filters[month].key.trim().length) {
                    returnVal = true;
                }
                if (tableParams.date_filters[month].status && tableParams.date_filters[month].status.length) {
                    returnVal = true;
                }
                if (tableParams.date_filters[month].not_null) {
                    returnVal = true;
                }
            }
        });
        return returnVal;
    };

    sendEmail = async () => {
        let isAllowed = await this.props.checkBuildingCount();
        if (isAllowed) {
            this.toggleShowSendEmailModal();
        } else {
            this.toggleShowCountWarningModal();
        }
    };

    toggleShowSendEmailModal = () => {
        const { showSendEmailModal } = this.state;
        this.setState({ showSendEmailModal: !showSendEmailModal });
    };

    renderSendEmailModal = () => {
        const { showSendEmailModal } = this.state;
        const {
            tableParams,
            location: { pathname = null },
            selectedLogbook
        } = this.props;

        let path = null;

        if (pathname && pathname === "/activityCalendar") {
            path = "email_annual_calendar";
        } else if (pathname && pathname === "/trailingCalendar") {
            path = "email_trailing_calendar";
        }
        if (!showSendEmailModal) return null;
        return (
            <Portal
                body={
                    <SendEmailModal
                        entity={"schedule"}
                        path={path}
                        tableParams={tableParams}
                        logbook_id={selectedLogbook.id}
                        onCancel={() => this.setState({ showSendEmailModal: false })}
                    />
                }
                onCancel={() => this.setState({ showSendEmailModal: false })}
            />
        );
    };

    toggleShowCountWarningModal = () => {
        const { showCountWarningModal } = this.state;
        this.setState({ showCountWarningModal: !showCountWarningModal });
    };

    rendeCountWarningModal = () => {
        const { showCountWarningModal, warningCountMessage } = this.state;
        if (!showCountWarningModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        onCancel={this.toggleShowCountWarningModal}
                        onOk={this.toggleShowCountWarningModal}
                        okText={"OK"}
                        cancelText={"Cancel"}
                        heading={"Invalid conditions for exporting !!"}
                        paragraph={warningCountMessage}
                    />
                }
                onCancel={() => this.setState({ showCountWarningModal: false })}
            />
        );
    };

    onClickDates = event => {
        let wrapperRef = document.getElementsByClassName("optionContainer") && document.getElementsByClassName("optionContainer")[0];
        if (wrapperRef && !wrapperRef.contains(event.target)) {
            if (this.state.showYearSelect) {
                let multiselectContainer = document.getElementById("multiselectContainerReact");
                let liOption = multiselectContainer && multiselectContainer.getElementsByTagName("li");
                let currentYearLi = null;
                if (liOption) {
                    for (let i = 0; i < liOption.length; i++) {
                        if (parseInt(liOption[i].innerText.trim()) === new Date().getFullYear()) {
                            currentYearLi = liOption[i];
                        }
                    }
                    if (currentYearLi) currentYearLi.scrollIntoView();
                }
            }
        }
    };

    filterAll = e => {
        const { refreshScheduleList, calendarView } = this.props;
        const completed = ["Completed"];
        const failed = [
            "Incomplete",
            "Incomplete Document",
            "Incomplete Device",
            "Failed 30 Minute Run",
            "Failed 10 sec transfer",
            "Other Failure",
            "Failed 30% Load"
        ];
        const repaired = [
            "Completed with Failures",
            "Completed with Device",
            "Corrected with Failed 30 Minute Run",
            "Corrected with failed 10 sec transfer",
            "Corrected with Other Failure",
            "Corrected with Failed 30% Load"
        ];
        const maintenence = ["Non-Compliant"];
        if (e.target.value === "completed") {
            refreshScheduleList(completed, calendarView);
        } else if (e.target.value === "failed") {
            refreshScheduleList(failed, calendarView);
        } else if (e.target.value === "repaired") {
            refreshScheduleList(repaired, calendarView);
        } else if (e.target.value === "maintenence") {
            refreshScheduleList(maintenence, calendarView);
        } else {
            refreshScheduleList();
        }
    };
    render() {
        const {
            selectedLogbook,
            toggleShowIconsAndColorLegandsModal,
            handleGlobalSearch,
            globalSearchKey = null,
            showViewModal,
            resetSort,
            resetAllFilters,
            logbookById = true,
            resetWildCardFilter,
            toggleFilter,
            match: { path },
            toggleCalendarView,
            calendarView,
            toggleLastPerformed,
            showLastPerformedColumn
        } = this.props;
        const { yearsList, selectedYears, showYearSelect } = this.state;
        let audit_mode = localStorage.getItem("audit_mode") && localStorage.getItem("audit_mode") === "true" ? true : false;
        let view_only_surveyor = localStorage.getItem("view_only_surveyor") && localStorage.getItem("view_only_surveyor") === "true" ? true : false;
        return (
            <div className="top-fil-ara title-btn-wrapper">
                <ReactTooltip id="calendar_header" effect="solid" />
                <div className="cap">
                    {logbookById ? <h4>{selectedLogbook.name || "-"}</h4> : <h4>Edit Building Activity Properties</h4>}
                    {selectedLogbook.has_asset === "yes" ? (
                        <div className="btn-section ml-1">
                            <button
                                type="button"
                                onClick={() => toggleLastPerformed()}
                                className="lp-button grey-btn green-btn"
                                data-for="calendar_header"
                                data-tip={showLastPerformedColumn ? "Hide Last Performed" : "Show Last Performed"}
                                data-place="top"
                            >
                                {showLastPerformedColumn ? "Hide LP" : "Show LP"}
                            </button>
                        </div>
                    ) : null}
                </div>

                <div className="right-cont">
                    {logbookById && path === "/activityCalendar" ? (
                        <div className="btn-section p-1 year-activity-cal-header" onClick={e => this.onClickDates(e)}>
                            {showYearSelect ? (
                                <Multiselect
                                    options={yearsList}
                                    selectedValues={selectedYears}
                                    onSelect={this.onYearSelect}
                                    onRemove={this.onYearRemove}
                                    placeholder={"Select Year"}
                                    displayValue="name"
                                    showCheckbox={true}
                                    showArrow={true}
                                    closeOnSelect={false}
                                />
                            ) : null}
                        </div>
                    ) : (
                        <>
                            {logbookById ? (
                                <div className="toggle-section">
                                    <span className="first-itm">Legacy</span>
                                    <span className="toggle-btn">
                                        <input type="checkbox" id="switch" checked={calendarView} />
                                        <label for="switch" onClick={() => toggleCalendarView()}>
                                            Toggle
                                        </label>
                                    </span>
                                    <span className="last-itm">New</span>
                                </div>
                            ) : null}
                        </>
                    )}
                    {!audit_mode && (
                        <div className="custom-elem">
                            <select defaultValue="All" onChange={e => this.filterAll(e)}>
                                <option value="All">All</option>
                                <option value="completed">Total completed</option>
                                <option value="failed">Total Failed</option>
                                <option value="repaired">Total Repaired</option>
                                <option value="maintenence">Non-Compliant</option>
                            </select>
                        </div>
                    )}
                    {selectedLogbook.logbook_type === "Fire-Drills" ? (
                        this.state.exportFireDrillLoading ? (
                            <button className="btn btn-top">
                                <div className="spinner-border cus-spin text-primary" role="status"></div>
                            </button>
                        ) : (
                            <div className="btn-section-2">
                                <button
                                    type="button"
                                    className="btn btn-top grey-btn"
                                    onClick={() => this.exportFireDrill()}
                                    data-for="calendar_header"
                                    data-tip={"Export Quarterly"}
                                    data-place="top"
                                >
                                    <img src="/images/export.svg" alt="" />
                                    <span className="ml-2">Export</span>
                                </button>
                            </div>
                        )
                    ) : null}
                    <div className="btn-section ml-1">
                        {logbookById ? (
                            <>
                                <button
                                    type="button"
                                    disabled={view_only_surveyor}
                                    className={`${path !== "/activityCalendar" ? "grey-btn" : ""} green-btn ${
                                        view_only_surveyor ? "cursor-not-allowed" : ""
                                    }`}
                                    onClick={() => history.push("/activityCalendar", { logbook: selectedLogbook })}
                                >
                                    Annual
                                </button>
                                <button
                                    type="button"
                                    className={`${path !== "/trailingCalendar" ? "grey-btn" : ""} green-btn`}
                                    onClick={() => history.push("/trailingCalendar", { logbook: selectedLogbook })}
                                >
                                    Trailing
                                </button>
                            </>
                        ) : null}
                    </div>
                    <div className="btn-section-2">
                        {logbookById && !audit_mode ? (
                            <button className="btn btn-top" title="Icon &amp; color info" onClick={() => toggleShowIconsAndColorLegandsModal()}>
                                <img alt="" src="/images/color-wheel.svg" />
                            </button>
                        ) : null}
                        <button
                            className={`btn btn-top`}
                            title="Filter"
                            onClick={() => {
                                toggleFilter();
                            }}
                        >
                            <img src="/images/wild-card.svg" className="mr-0" alt="" />{" "}
                        </button>
                        <button
                            className={`btn btn-top text-center ${
                                this.checkHasWildCardFiltersForDates() || this.isWildCardActive() || globalSearchKey ? "active-reset" : ""
                            }`}
                            title="Clear Filter"
                            onClick={() =>
                                (this.checkHasWildCardFiltersForDates() || this.isWildCardActive() || globalSearchKey) && resetWildCardFilter()
                            }
                        >
                            <img src="/images/reset-wild-card.svg" className="mr-0" alt="" />
                        </button>
                        <button
                            className={`btn btn-top text-center ${this.isSorted() ? "active-reset" : ""}`}
                            title="Reset Sort"
                            onClick={() => this.isSorted() && resetSort()}
                        >
                            <img src="/images/reset-icon.svg" className="mr-0" alt="" />
                        </button>
                        {this.state.exportLoading ? (
                            <button className="btn btn-top">
                                <div className="spinner-border cus-spin text-primary" role="status"></div>
                            </button>
                        ) : (
                            <button className="btn btn-top" onClick={() => this.exportData()} title="Export Excel">
                                <img src="/images/export.svg" alt="" />
                            </button>
                        )}
                        <button className="btn btn-top" title="Email" onClick={() => this.sendEmail()}>
                            <img alt="" src="/images/mail.svg" />
                        </button>
                        <button className="btn btn-top" onClick={() => showViewModal()} title="Column Window">
                            <img alt="" src="/images/colmns.svg" />
                        </button>
                        <button className={`btn btn-top text-center`} onClick={() => resetAllFilters()} title="Reset All">
                            <img alt="" src="/images/reset-column.svg" />
                        </button>
                    </div>
                    <GlobalSearch handleGlobalSearch={handleGlobalSearch} globalSearchKey={globalSearchKey} />
                </div>
                {this.renderSendEmailModal()}
                {this.rendeCountWarningModal()}
            </div>
        );
    }
}

export default withRouter(ActivityCalendarTableHeader);
