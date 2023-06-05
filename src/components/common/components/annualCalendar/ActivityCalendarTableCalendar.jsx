import React, { Component } from "react";
import moment from "moment";
import ReactTooltip from "react-tooltip";
import Highlighter from "react-highlight-words";
import _, { isNull } from "lodash";

import WildCardFilter from "../WildCardFilter";
import Loader from "../Loader";
import { fastTooltips, generatorTooltips, firedrillsTooltips, emptyTooltips } from "../../../../config/utils";

let quaterlyBackgroundColor = {};
class ActivityCalendarTableCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFieldForCommonSearch: null,
            filterList: [],
            commonFilterParams: this.props.commonFilter || {},
            selectAll: "",
            isCancel: false,
            isOk: false,
            isLoadingDropdown: false
        };
    }

    componentDidMount = () => {
        window.addEventListener("click", e => {
            let activityCalendarTableHeaderRow = document.getElementById("activityCalendarTableHeaderRow");
            if (activityCalendarTableHeaderRow && !activityCalendarTableHeaderRow.contains(e.target) && !e.target.hasAttribute("is-dropdown-item")) {
                this.setState({
                    selectedFieldForCommonSearch: null
                });
            }
        });
        for (let i = 0; i <= 15; i++) {
            this.initiateResize(i);
        }
        this.setScrollTopToTableContainer();
        if (this.props.commonFilter) {
            if (!this.state.isOk && Object.keys(this.props.commonFilter).length !== 0) {
                let initialValue = {};
                Object.keys(this.props.commonFilter).map(fil => {
                    initialValue = { ...initialValue, [fil]: true };
                });
                this.setState({
                    isOk: initialValue,
                    isCancel: initialValue
                });
            }
        }

        // this.setQuaterlyBackGroundColor();
    };

    setScrollTopToTableContainer = () => {
        let tabContainer = document.getElementById("calendar-table-container");
        tabContainer.scrollTop = this.props.scrollTop;
    };

    componentDidUpdate = prevProps => {
        if (this.props.scrollTop !== prevProps.scrollTop) {
            this.setScrollTopToTableContainer();
        }
        if (this.props.showLastPerformedColumn !== prevProps.showLastPerformedColumn) {
            this.initiateResize(2);
        }
        if (prevProps.commonFilter !== this.props.commonFilter) {
            if (!_.isEmpty(this.props.commonFilter)) {
                const { selectAll } = [];
                let temp = selectAll;
                Object.keys(this.props.commonFilter).map(fil => {
                    if (this.props.commonFilter[fil] && this.props.commonFilter[fil].length == this.state.filterList.length) {
                        temp = { ...selectAll, [fil]: true };
                        this.setState({
                            selectAll: temp
                        });
                    }
                });
            } else {
                this.setState({
                    selectAll: {}
                });
            }
            this.setState({
                commonFilterParams: this.props.commonFilter || {},
                selectedFieldForCommonSearch: !this.props.commonFilter ? null : this.state.selectedFieldForCommonSearch
            });
        }

        // this.setQuaterlyBackGroundColor();
    };

    OnScroll = event => {
        const { updateScrollTop } = this.props;
        updateScrollTop(event.target.scrollTop);
    };

    monthIsNA = (na_start, na_end, month) => {
        let na_start_month = new Date(na_start).getMonth();
        let na_end_month = new Date(na_end).getMonth();

        if (month >= na_start_month && month <= na_end_month) {
            return true;
        }
        return false;
    };

    renderCellContent = dateObjOfMonth => {
        return (
            <span className="pos-date">
                {moment(new Date(dateObjOfMonth.date)).format("MM-DD-YY")}
                <br />
                {dateObjOfMonth.actual_date ? moment(new Date(dateObjOfMonth.actual_date)).format("MM-DD-YY") : null}
                {dateObjOfMonth.actual_day || dateObjOfMonth.actual_time ? (
                    <>
                        <br />
                        {dateObjOfMonth.actual_day.substring(0, 3) || "-"}
                        {" - " + moment(dateObjOfMonth.actual_time, ["HH.mm"]).format("hh:mm a").toUpperCase() || "-"}
                    </>
                ) : null}
            </span>
        );}
    searchColorInArray = (colorKey, dateList) => {
        for (var i = 0; i < dateList.length; i++) {
            if (dateList[i].color === colorKey) {
                return dateList[i];
            }
        }
        return null;
    };

    checkAnyDateInArrayPassed = (dateList, completion_threshold) => {
        for (var i = 0; i < dateList.length; i++) {
            if (this.isDatePassed(new Date(dateList[i].date), completion_threshold, dateList[i])) {
                dateList[i].color = "#F59089";
                dateList[i].icon = "plus-icn-red.svg";
            } else {
                dateList[i].color = "#BFFFBF";
                dateList[i].icon = "plus-icn.svg";
            }
            return dateList[i];
        }
        return null;
    };

    searchWeekOrDayInArray = (week, day, dateList) => {
        for (var i = 0; i < dateList.length; i++) {
            if (dateList[i].week && dateList[i].week === week - 1) {
                return dateList[i];
            } else if (
                dateList[i].date &&
                new Date(dateList[i].date).getMonth() === new Date().getMonth() &&
                new Date(dateList[i].date).getDate() === new Date(day).getDate()
            ) {
                return dateList[i];
            } else if (
                dateList[i].date &&
                new Date(dateList[i].date).getMonth() !== new Date().getMonth() &&
                new Date(dateList[i].date).getDate() === 1
            ) {
                return dateList[i];
            }
        }
        return null;
    };

    findWorstCaseDateObject = (item, monthIndex, year) => {
        let schedule_dates = JSON.parse(localStorage.getItem("schedule_dates"));
        const getScheduleDates = schedule_dates.schedules
            .find(temp => temp.id === item.id)
            ?.dates.filter(dateItem => new Date(dateItem.date).getMonth() === monthIndex);

        let dateList = item.dates && item.dates.length ? item.dates.filter(dateItem => new Date(dateItem.date).getMonth() === monthIndex) : [];
        dateList = _.orderBy(dateList, "date", "asc");
        let hasUpdatedWorstCaseColor = false;
        let tempObject = { color: "#BFFFBF", icon: "plus-icn.svg" };
        let hasNullObj = false;

        let worstCaseDateObject =
            this.searchWeekOrDayInArray(moment(new Date(), "MM-DD-YYYY").week(), moment(new Date(), "MM-DD-YYYY"), dateList) || dateList[0];

        if (getScheduleDates) {
            if (this.searchColorInArray(null, getScheduleDates)) {
                tempObject = this.searchColorInArray(null, getScheduleDates);
                hasNullObj = true;
            } else if (this.searchColorInArray("#FF0000", getScheduleDates)) {
                tempObject = this.searchColorInArray("#FF0000", getScheduleDates);
                hasUpdatedWorstCaseColor = true;
            } else if (this.searchColorInArray("#FF8000", getScheduleDates)) {
                tempObject = this.searchColorInArray("#FF8000", getScheduleDates);
                hasUpdatedWorstCaseColor = true;
            } else if (this.searchColorInArray("#FF6060", getScheduleDates)) {
                tempObject = this.searchColorInArray("#FF6060", getScheduleDates);
                hasUpdatedWorstCaseColor = true;
            } else if (this.searchColorInArray("#80FF80", getScheduleDates)) {
                tempObject = this.searchColorInArray("#80FF80", getScheduleDates);
                hasUpdatedWorstCaseColor = true;
            } else if (this.searchColorInArray("#00FF00", getScheduleDates)) {
                tempObject = this.searchColorInArray("#00FF00", getScheduleDates);
                hasUpdatedWorstCaseColor = true;
            }

            if (!hasUpdatedWorstCaseColor) {
                if (this.checkAnyDateInArrayPassed(dateList, item.completion_threshold)) {
                    tempObject = this.checkAnyDateInArrayPassed(dateList, item.completion_threshold);
                }
            }
            if (this.searchColorInArray("#FF0000", getScheduleDates)) {
                tempObject.color = "#FF0000";
            } else if (this.searchColorInArray("#FF8000", getScheduleDates)) {
                tempObject.color = "#FF8000";
            } else if (this.searchColorInArray("#FF6060", getScheduleDates)) {
                tempObject.color = "#FF6060";
            } else if (this.searchColorInArray("#80FF80", getScheduleDates) && !hasNullObj) {
                tempObject.color = "#80FF80";
            } else if (this.searchColorInArray("#00FF00", getScheduleDates) && !hasNullObj) {
                tempObject.color = "#00FF00";
            }
        }
        if (worstCaseDateObject) {
            worstCaseDateObject.color = tempObject.color;
            worstCaseDateObject.icon = tempObject.icon;
            return worstCaseDateObject;
        }
        return null;
    };

    renderMonthlySchedule = item => {
        const { handleActivityEventClick, showCreateActivityEventSchedule, handleNAClick } = this.props;
        let audit_mode = localStorage.getItem("audit_mode") && localStorage.getItem("audit_mode") === "true" ? true : false;

        const { selectedLogbook } = this.props;
        let rulesForToolTip = generatorTooltips;
        if (selectedLogbook.logbook_type === "Fire-Drills") {
            rulesForToolTip = firedrillsTooltips;
        } else if (selectedLogbook.logbook_type === "FAST") {
            rulesForToolTip = fastTooltips;
        }
        if (audit_mode) {
            rulesForToolTip = emptyTooltips;
        }

        let tableContentHtml = moment.monthsShort().map((month, i) => {
            if (item.na_start && item.na_end) {
                if (this.monthIsNA(item.na_start, item.na_end, i)) {
                    return (
                        <td className="date-wrapper cursor-pointer" key={i}>
                            <div className="icon-date-wrapper na-container" onClick={() => handleNAClick(item.id, i, item.year)}>
                                <span>NA</span>
                            </div>
                        </td>
                    );
                }
            }
            let dateObjOfMonth = this.findDatesOfMonth(item.dates, i);
            if (dateObjOfMonth) {
                if (dateObjOfMonth.day || dateObjOfMonth.week) {
                    let worstCaseDateObject = this.findWorstCaseDateObject(item, i, item.year);
                    if (worstCaseDateObject) {
                        return (
                            <td
                                className="date-wrapper cursor-pointer"
                                style={!audit_mode ? { background: `${worstCaseDateObject.color}` } : null}
                                onClick={() =>
                                    handleActivityEventClick(
                                        worstCaseDateObject.id,
                                        worstCaseDateObject.schedule_id,
                                        item.edit_form,
                                        item.dates,
                                        i,
                                        item.year,
                                        dateObjOfMonth.week ? "weekly" : "daily",
                                        item.id
                                    )
                                }
                                data-for="event_rules"
                                data-tip={`<span>This activity has multiple events scheduled.</span></br><span>Click on this cell to open the Activity Event Form to make or view any entry.</span>`}
                                data-place="top"
                                data-html={true}
                            >
                                <div className="icon-date-wrapper">
                                    {!audit_mode ? (
                                        <span className="icon-img">
                                            <img src={`/images/multiple_files_blue.svg`} alt="" />
                                        </span>
                                    ) : null}
                                    {!audit_mode && worstCaseDateObject.icon ? (
                                        <span className="icon-img">
                                            <img src={`/images/${worstCaseDateObject.icon}`} alt="" />
                                        </span>
                                    ) : null}
                                </div>
                            </td>
                        );
                    }
                } else if (dateObjOfMonth.icon && dateObjOfMonth.color) {
                    return (
                        <td
                            className="date-wrapper cursor-pointer"
                            style={!audit_mode ? { background: `${dateObjOfMonth.color}` } : null}
                            onClick={() => handleActivityEventClick(dateObjOfMonth.id, dateObjOfMonth.schedule_id, item.edit_form, item.dates)}
                            data-for="event_rules"
                            data-tip={rulesForToolTip[dateObjOfMonth.icon]}
                            key={i}
                        >
                            <div className="icon-date-wrapper">
                                {!audit_mode ? (
                                    <span className="icon-img">
                                        <img src={`/images/${dateObjOfMonth.icon}`} alt="" />
                                    </span>
                                ) : null}
                                {this.renderCellContent(dateObjOfMonth)}
                            </div>
                        </td>
                    );
                } else if (dateObjOfMonth.color) {
                    return (
                        <td
                            className="date-wrapper cursor-pointer"
                            style={!audit_mode ? { background: `${dateObjOfMonth.color}` } : null}
                            onClick={() => handleActivityEventClick(dateObjOfMonth.id, dateObjOfMonth.schedule_id, item.edit_form, item.dates)}
                            data-for="event_rules"
                            data-tip={rulesForToolTip.completed}
                            key={i}
                        >
                            <div className="icon-date-wrapper">{this.renderCellContent(dateObjOfMonth)}</div>
                        </td>
                    );
                } else {
                    if (this.isDatePassed(new Date(dateObjOfMonth.date), item.completion_threshold, dateObjOfMonth)) {
                        return (
                            <td
                                className="date-wrapper cursor-pointer"
                                style={
                                    !audit_mode
                                        ? {
                                              background: "#F59089"
                                          }
                                        : null
                                }
                                onClick={() => handleActivityEventClick(dateObjOfMonth.id, dateObjOfMonth.schedule_id, item.edit_form, item.dates)}
                                data-for="event_rules"
                                data-tip={rulesForToolTip["plus-icn-red.svg"]}
                                key={i}
                            >
                                <div className="icon-date-wrapper">
                                    {!audit_mode ? (
                                        <span className="icon-img">
                                            <img src={`/images/plus-icn-red.svg`} alt="" />
                                        </span>
                                    ) : null}
                                    {this.renderCellContent(dateObjOfMonth)}
                                </div>
                            </td>
                        );
                    } else {
                        return (
                            <td
                                className={`date-wrapper cursor-pointer`}
                                style={
                                    !audit_mode
                                        ? {
                                              background: "#BFFFBF"
                                          }
                                        : null
                                }
                                onClick={() => handleActivityEventClick(dateObjOfMonth.id, dateObjOfMonth.schedule_id, item.edit_form, item.dates)}
                                data-for="event_rules"
                                data-tip={
                                    !audit_mode
                                        ? this.hasBorder(dateObjOfMonth)
                                            ? "Add Survey in Threshold"
                                            : rulesForToolTip["plus-icn.svg"]
                                        : null
                                }
                                key={i}
                            >
                                <div className={`icon-date-wrapper ${this.hasBorder(dateObjOfMonth) ? "border-highlight" : ""}`}>
                                    {!audit_mode ? (
                                        <span className="icon-img">
                                            <img src={`/images/plus-icn.svg`} alt="" />
                                        </span>
                                    ) : null}
                                    {this.renderCellContent(dateObjOfMonth)}
                                </div>
                            </td>
                        );
                    }
                }
            } else {
                return <td className="cursor-pointer" onClick={() => showCreateActivityEventSchedule(item.id, i, item.year, "add")} key={i}></td>;
            }
        });
        return tableContentHtml;
    };

    setQuaterlyBackGroundColorValues = async (className, color) => {
        quaterlyBackgroundColor[className] = color;
    };

    renderQuaterlySchedule = item => {
        const { handleActivityEventClick, showCreateActivityEventSchedule, handleNAClick } = this.props;
        let audit_mode = localStorage.getItem("audit_mode") && localStorage.getItem("audit_mode") === "true" ? true : false;

        const { selectedLogbook } = this.props;
        let rulesForToolTip = generatorTooltips;
        if (selectedLogbook.logbook_type === "Fire-Drills") {
            rulesForToolTip = firedrillsTooltips;
        } else if (selectedLogbook.logbook_type === "FAST") {
            rulesForToolTip = fastTooltips;
        }
        if (audit_mode) {
            rulesForToolTip = emptyTooltips;
        }

        let quaterClass = "";
        let quaterMainClass = "";
        let tableContentHtml = moment.monthsShort().map((month, i) => {
            if (i < 3) {
                quaterMainClass = `quater_one_${item.id}`;
                quaterClass = quaterMainClass + " quater_one";
                if (i === 2) {
                    quaterClass = quaterClass + " last";
                }
            } else if (i < 6) {
                quaterMainClass = `quater_two_${item.id}`;
                quaterClass = quaterMainClass + " quater_two";
                if (i === 5) {
                    quaterClass = quaterClass + " last";
                }
            } else if (i < 9) {
                quaterMainClass = `quater_three_${item.id}`;
                quaterClass = quaterMainClass + " quater_three";
                if (i === 8) {
                    quaterClass = quaterClass + " last";
                }
            } else {
                quaterMainClass = `quater_four_${item.id}`;
                quaterClass = quaterMainClass + " quater_four";
                if (i === 11) {
                    quaterClass = quaterClass + " last";
                }
            }

            if (item.na_start && item.na_end) {
                if (this.monthIsNA(item.na_start, item.na_end, i)) {
                    return (
                        <td className={`date-wrapper cursor-pointer ${quaterClass}`} key={i}>
                            <div className="icon-date-wrapper na-container" onClick={() => handleNAClick(item.id, i, item.year)}>
                                <span>NA</span>
                            </div>
                        </td>
                    );
                }
            }
            let dateObjOfMonth = this.findDatesOfMonth(item.dates, i);
            if (dateObjOfMonth) {
                if (dateObjOfMonth.icon && dateObjOfMonth.color) {
                    this.setQuaterlyBackGroundColorValues(quaterMainClass, !audit_mode ? dateObjOfMonth.color : "#eee");
                    return (
                        <td
                            className={`date-wrapper cursor-pointer ${quaterClass}`}
                            style={!audit_mode ? { background: `${dateObjOfMonth.color}` } : null}
                            onClick={() => handleActivityEventClick(dateObjOfMonth.id, dateObjOfMonth.schedule_id, item.edit_form, item.dates)}
                            data-for="event_rules"
                            data-tip={rulesForToolTip[dateObjOfMonth.icon]}
                            key={i}
                        >
                            <div className="icon-date-wrapper">
                                {!audit_mode ? (
                                    <span className="icon-img">
                                        <img src={`/images/${dateObjOfMonth.icon}`} alt="" />
                                    </span>
                                ) : null}
                                {this.renderCellContent(dateObjOfMonth)}
                            </div>
                        </td>
                    );
                } else if (dateObjOfMonth.color) {
                    this.setQuaterlyBackGroundColorValues(quaterMainClass, !audit_mode ? dateObjOfMonth.color : "#eee");
                    return (
                        <td
                            className={`date-wrapper cursor-pointer ${quaterClass}`}
                            style={!audit_mode ? { background: `${dateObjOfMonth.color}` } : null}
                            onClick={() => handleActivityEventClick(dateObjOfMonth.id, dateObjOfMonth.schedule_id, item.edit_form, item.dates)}
                            data-for="event_rules"
                            data-tip={rulesForToolTip.completed}
                            key={i}
                        >
                            <div className="icon-date-wrapper">{this.renderCellContent(dateObjOfMonth)}</div>
                        </td>
                    );
                } else {
                    if (this.isDatePassed(new Date(dateObjOfMonth.date), item.completion_threshold, dateObjOfMonth)) {
                        this.setQuaterlyBackGroundColorValues(quaterMainClass, !audit_mode ? "#F59089" : "#eee");
                        return (
                            <td
                                className={`date-wrapper cursor-pointer ${quaterClass}`}
                                style={
                                    !audit_mode
                                        ? {
                                              background: "#F59089"
                                          }
                                        : null
                                }
                                onClick={() => handleActivityEventClick(dateObjOfMonth.id, dateObjOfMonth.schedule_id, item.edit_form, item.dates)}
                                data-for="event_rules"
                                data-tip={rulesForToolTip["plus-icn-red.svg"]}
                                key={i}
                            >
                                <div className="icon-date-wrapper">
                                    {!audit_mode ? (
                                        <span className="icon-img">
                                            <img src={`/images/plus-icn-red.svg`} alt="" />
                                        </span>
                                    ) : null}
                                    {this.renderCellContent(dateObjOfMonth)}
                                </div>
                            </td>
                        );
                    } else {
                        this.setQuaterlyBackGroundColorValues(quaterMainClass, !audit_mode ? "#BFFFBF" : "#eee");
                        return (
                            <td
                                className={`date-wrapper cursor-pointer ${quaterClass}`}
                                style={
                                    !audit_mode
                                        ? {
                                              background: "#BFFFBF"
                                          }
                                        : null
                                }
                                onClick={() => handleActivityEventClick(dateObjOfMonth.id, dateObjOfMonth.schedule_id, item.edit_form, item.dates)}
                                data-for="event_rules"
                                data-tip={
                                    !audit_mode
                                        ? this.hasBorder(dateObjOfMonth)
                                            ? "Add Survey in Threshold"
                                            : rulesForToolTip["plus-icn.svg"]
                                        : null
                                }
                                key={i}
                            >
                                <div className={`icon-date-wrapper ${this.hasBorder(dateObjOfMonth) ? "border-highlight" : ""}`}>
                                    {!audit_mode ? (
                                        <span className="icon-img">
                                            <img src={`/images/plus-icn.svg`} alt="" />
                                        </span>
                                    ) : null}
                                    {this.renderCellContent(dateObjOfMonth)}
                                </div>
                            </td>
                        );
                    }
                }
            } else {
                if (i % 3 === 0) {
                    let dateObjOfMonthNext = this.findDatesOfMonth(item.dates, i + 1);
                    let dateObjOfMonthSuperNext = this.findDatesOfMonth(item.dates, i + 2);
                    if (dateObjOfMonthNext) {
                        return (
                            <td
                                className={`cursor-pointer ${quaterClass}`}
                                style={{
                                    background: !audit_mode
                                        ? dateObjOfMonthNext.color
                                            ? dateObjOfMonthNext.color
                                            : this.isDatePassed(new Date(dateObjOfMonthNext.date), item.completion_threshold, dateObjOfMonthNext)
                                            ? "#F59089"
                                            : "#BFFFBF"
                                        : "#eee"
                                }}
                                onClick={() => handleActivityEventClick(dateObjOfMonthNext.id, dateObjOfMonthNext.schedule_id, item.edit_form)}
                            ></td>
                        );
                    }
                    if (dateObjOfMonthSuperNext) {
                        return (
                            <td
                                className={`cursor-pointer ${quaterClass}`}
                                style={{
                                    background: !audit_mode
                                        ? dateObjOfMonthSuperNext.color
                                            ? dateObjOfMonthSuperNext.color
                                            : this.isDatePassed(
                                                  new Date(dateObjOfMonthSuperNext.date),
                                                  item.completion_threshold,
                                                  dateObjOfMonthSuperNext
                                              )
                                            ? "#F59089"
                                            : "#BFFFBF"
                                        : "#eee"
                                }}
                                onClick={() =>
                                    handleActivityEventClick(dateObjOfMonthSuperNext.id, dateObjOfMonthSuperNext.schedule_id, item.edit_form)
                                }
                            ></td>
                        );
                    }
                } else if (i % 3 === 1) {
                    let dateObjOfMonthPrev = this.findDatesOfMonth(item.dates, i - 1);
                    let dateObjOfMonthNext = this.findDatesOfMonth(item.dates, i + 1);
                    if (dateObjOfMonthPrev) {
                        return (
                            <td
                                className={`cursor-pointer ${quaterClass}`}
                                style={{
                                    background: !audit_mode
                                        ? dateObjOfMonthPrev.color
                                            ? dateObjOfMonthPrev.color
                                            : this.isDatePassed(new Date(dateObjOfMonthPrev.date), item.completion_threshold, dateObjOfMonthPrev)
                                            ? "#F59089"
                                            : "#BFFFBF"
                                        : "#eee"
                                }}
                                onClick={() => handleActivityEventClick(dateObjOfMonthPrev.id, dateObjOfMonthPrev.schedule_id, item.edit_form)}
                            ></td>
                        );
                    }
                    if (dateObjOfMonthNext) {
                        return (
                            <td
                                className={`cursor-pointer ${quaterClass}`}
                                style={{
                                    background: !audit_mode
                                        ? dateObjOfMonthNext.color
                                            ? dateObjOfMonthNext.color
                                            : this.isDatePassed(new Date(dateObjOfMonthNext.date), item.completion_threshold, dateObjOfMonthNext)
                                            ? "#F59089"
                                            : "#BFFFBF"
                                        : "#eee"
                                }}
                                onClick={() => handleActivityEventClick(dateObjOfMonthNext.id, dateObjOfMonthNext.schedule_id, item.edit_form)}
                            ></td>
                        );
                    }
                } else if (i % 3 === 2) {
                    let dateObjOfMonthPrev = this.findDatesOfMonth(item.dates, i - 1);
                    let dateObjOfMonthSuperPrev = this.findDatesOfMonth(item.dates, i - 2);
                    if (dateObjOfMonthPrev) {
                        return (
                            <td
                                className={`cursor-pointer ${quaterClass}`}
                                style={{
                                    background: !audit_mode
                                        ? dateObjOfMonthPrev.color
                                            ? dateObjOfMonthPrev.color
                                            : this.isDatePassed(new Date(dateObjOfMonthPrev.date), item.completion_threshold, dateObjOfMonthPrev)
                                            ? "#F59089"
                                            : "#BFFFBF"
                                        : "#eee"
                                }}
                                onClick={() => handleActivityEventClick(dateObjOfMonthPrev.id, dateObjOfMonthPrev.schedule_id, item.edit_form)}
                            ></td>
                        );
                    }
                    if (dateObjOfMonthSuperPrev) {
                        return (
                            <td
                                className={`cursor-pointer ${quaterClass}`}
                                style={{
                                    background: !audit_mode
                                        ? dateObjOfMonthSuperPrev.color
                                            ? dateObjOfMonthSuperPrev.color
                                            : this.isDatePassed(
                                                  new Date(dateObjOfMonthSuperPrev.date),
                                                  item.completion_threshold,
                                                  dateObjOfMonthSuperPrev
                                              )
                                            ? "#F59089"
                                            : "#BFFFBF"
                                        : "#eee"
                                }}
                                onClick={() =>
                                    handleActivityEventClick(dateObjOfMonthSuperPrev.id, dateObjOfMonthSuperPrev.schedule_id, item.edit_form)
                                }
                            ></td>
                        );
                    }
                }
                return (
                    <td
                        className={`cursor-pointer ${quaterClass}`}
                        onClick={() => showCreateActivityEventSchedule(item.id, i, item.year, "add")}
                        key={i}
                    ></td>
                );
            }
        });
        return tableContentHtml;
    };

    isDatePassed = (date, treshold, dateObjOfMonth) => {
        let today = new Date();
        if (new Date(dateObjOfMonth.threshold_end).setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)) {
            return true;
        }
        return false;
    };

    hasBorder = dateObjOfMonth => {
        return (
            new Date(dateObjOfMonth.threshold_start).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0) &&
            new Date(dateObjOfMonth.threshold_end).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)
        );
    };

    findDatesOfMonth = (dates, month) => {
        let dateOfMonth = null;
        dates.map((dateObj, i) => {
            if (new Date(dateObj.date).getMonth() === month) {
                dateOfMonth = dateObj;
            }
        });
        return dateOfMonth;
    };

    initiateResize = index => {
        let className = ".calendar-acticity-column" + index;
        let activityTable = document.querySelector(className);
        if (activityTable) {
            activityTable.className = activityTable.className + " resizable";
            let resizer = document.createElement("div");
            resizer.className = `resizer${index}`;
            activityTable.appendChild(resizer);
            resizer.addEventListener("mousedown", initDrag, false);
            let startX, startWidth;

            function initDrag(e) {
                e.preventDefault();
                startX = e.clientX;
                startWidth = parseInt(document.defaultView.getComputedStyle(activityTable).width, 10);
                document.documentElement.addEventListener("mousemove", doDrag, false);
                document.documentElement.addEventListener("mouseup", stopDrag, false);
            }

            function doDrag(e) {
                let currentWidth = startWidth + e.clientX - startX;
                activityTable.style.width = currentWidth + "px";
                activityTable.style.minWidth = currentWidth + "px";
            }

            function stopDrag(e) {
                document.documentElement.removeEventListener("mousemove", doDrag, false);
                document.documentElement.removeEventListener("mouseup", stopDrag, false);
            }
        }
    };

    setSearchKeysArray = () => {
        const { tableParams = {} } = this.props;
        let returnArray = [];
        if (tableParams && tableParams.search) {
            returnArray.push(tableParams.search.toString());
        }
        if (tableParams && tableParams.filters && !_.isEmpty(tableParams.filters)) {
            const filters = Object.keys(tableParams.filters);
            for (const item of filters) {
                if (tableParams.filters[item] && tableParams.filters[item].key && tableParams.filters[item].key.length) {
                    if (tableParams.filters[item].filters[0] === "like") {
                        returnArray = returnArray.concat(tableParams.filters[item].key.toString().split("_").join("").split("%").join("").split("~"));
                    } else if (tableParams.filters[item].key.toString().includes("~")) {
                        returnArray = returnArray.concat(tableParams.filters[item].key.toString().split("~"));
                    } else {
                        returnArray.push(tableParams.filters[item].key.toString());
                    }
                }
            }
        }
        return returnArray;
    };

    filterHighlighter = searchKey => {
        let returnVal = false;
        if (this.props.tableParams && this.props.tableParams.filters) {
            Object.keys(this.props.tableParams.filters).map(fill => {
                if (fill === searchKey && this.props.tableParams.filters[searchKey].key && this.props.tableParams.filters[searchKey].key.length) {
                    returnVal = true;
                }
            });
        }
        if (this.props.tableParams && this.props.tableParams.search && this.props.tableParams.search.length) {
            returnVal = true;
        }
        return returnVal;
    };

    showCommonSearchDropDown = async (keyItem, searchKey) => {
        this.setState({
            selectedFieldForCommonSearch: this.state.selectedFieldForCommonSearch === keyItem ? null : keyItem,
            filterList: [],
            isLoadingDropdown: true
        });
        let getListParsms = { field: searchKey };
        let filterList = this.state.selectedFieldForCommonSearch === keyItem ? null : await this.props.getListForCommonFilter(getListParsms);
        this.setState({
            filterList,
            isLoadingDropdown: false
        });
    };

    renderFiltersForCommonSearch = keyItem => {
        if (this.state.selectedFieldForCommonSearch !== keyItem) {
            return null;
        }
        const { tableData } = this.props;

        let { filterList, isLoadingDropdown } = this.state;
        filterList = filterList.filter(item => item.name !== null && item.name !== "");

        let filterListToCheck = this.state.commonFilterParams[tableData.config[keyItem].searchKey]
            ? this.state.commonFilterParams[tableData.config[keyItem].searchKey]
            : [];

        return (
            <div className="dropdown-menu dropdown-table tempDrop" aria-labelledby="dropdownMenuButton">
                <div className="dropdown-item">
                    <div className="custom-control custom-checkbox">
                        <input
                            type="checkbox"
                            className="custom-control-input"
                            id="customCheck"
                            name="example1"
                            is-dropdown-item="true"
                            checked={this.state.selectAll && this.state.selectAll[tableData.config[keyItem].searchKey]}
                            onChange={() => this.selectAllHandler(tableData.config[keyItem])}
                        />
                        <label className="custom-control-label" for="customCheck">
                            Select All
                        </label>
                    </div>
                </div>
                <hr />
                {!isLoadingDropdown ? (
                    <div className="dropdown-item drp-scroll" onScroll={e => e.stopPropagation()}>
                        {filterList.length ? (
                            <>
                                {filterList.map((item, i) =>
                                    filterListToCheck && filterListToCheck.length && filterListToCheck.includes(item.name) ? (
                                        <div className="custom-control custom-checkbox" key={i}>
                                            {item.name !== null && item.name !== "" ? (
                                                <>
                                                    <input
                                                        type="checkbox"
                                                        className="custom-control-input"
                                                        checked={
                                                            filterListToCheck && filterListToCheck.length && filterListToCheck.includes(item.name)
                                                        }
                                                        id={`customCheck${i}`}
                                                        name="example1"
                                                        is-dropdown-item="true"
                                                        onClick={e => {
                                                            this.setCommonFilterParams(item.name, tableData.config[keyItem].searchKey, keyItem);
                                                        }}
                                                    />
                                                    <label className="custom-control-label" for={`customCheck${i}`}>
                                                        {item.name} ({item.count})
                                                    </label>
                                                </>
                                            ) : null}
                                        </div>
                                    ) : null
                                )}
                                {filterListToCheck && filterListToCheck.length ? <hr className="filter-devider" /> : null}
                                {filterList.map((item, i) =>
                                    !filterListToCheck || !filterListToCheck.length || !filterListToCheck.includes(item.name) ? (
                                        <div className="custom-control custom-checkbox" key={i}>
                                            {item.name !== null && item.name !== "" ? (
                                                <>
                                                    <input
                                                        type="checkbox"
                                                        className="custom-control-input"
                                                        checked={
                                                            filterListToCheck && filterListToCheck.length && filterListToCheck.includes(item.name)
                                                        }
                                                        id={`customCheck${i}`}
                                                        name="example1"
                                                        is-dropdown-item="true"
                                                        onClick={e => {
                                                            this.setCommonFilterParams(item.name, tableData.config[keyItem].searchKey, keyItem);
                                                        }}
                                                    />
                                                    <label className="custom-control-label" for={`customCheck${i}`}>
                                                        {item.name.trim()} ({item.count})
                                                    </label>
                                                </>
                                            ) : null}
                                        </div>
                                    ) : null
                                )}
                            </>
                        ) : (
                            <div className="col-md-6">No data</div>
                        )}
                    </div>
                ) : (
                    <div className="dropdown-item">
                        <Loader />
                    </div>
                )}
                {filterList.length ? (
                    <div className="btn-otr d-flex justify-content-center">
                        <button className="btn btn-create" onClick={() => this.updateCommonFilterHandler(tableData.config[keyItem].searchKey)}>
                            OK
                        </button>
                        <button
                            className="btn btn-cncl-back ml-2"
                            onClick={() =>
                                this.cancelCommonFilterHandler(
                                    tableData.config[keyItem].commonSearchKey,
                                    tableData.config[keyItem],
                                    tableData.config[keyItem].searchKey
                                )
                            }
                        >
                            Cancel
                        </button>
                    </div>
                ) : null}
            </div>
        );
    };

    cancelCommonFilterHandler = async () => {
        await this.setState({
            commonFilterParams: { ...this.props.commonFilter } || {},
            selectedFieldForCommonSearch: null
        });
    };

    updateCommonFilterHandler = searchKey => {
        const { commonFilterParams } = this.state;
        this.props.updateCommonFilter(commonFilterParams);
        this.setState({
            selectedFieldForCommonSearch: null
        });
    };

    setCommonFilterParams = async (value, searchKey, keyItem) => {
        let tempList = { ...this.state.commonFilterParams };
        if (tempList[searchKey]) {
            if (!tempList[searchKey].includes(value)) {
                tempList[searchKey].push(value);
            } else {
                tempList[searchKey] = tempList[searchKey].filter(item => item !== value);
            }
            if (!tempList[searchKey].length) delete tempList[searchKey];
        } else {
            tempList[searchKey] = [value];
        }
        let isSelectAll;
        if (tempList && tempList[searchKey] && tempList[searchKey].length === this.state.filterList.length) {
            isSelectAll = true;
        } else {
            isSelectAll = false;
        }
        this.setState(prevState => ({
            commonFilterParams: tempList,
            selectAll: { ...prevState.selectAll, [searchKey]: isSelectAll }
        }));
    };

    selectAllHandler = async keyItem => {
        const selctAll = !this.state.selectAll[keyItem.searchKey];
        let { filterList } = this.state;
        filterList = filterList.filter(item => item.name !== null && item.name !== "");
        let tempList = this.state.commonFilterParams;

        if (selctAll) {
            tempList[keyItem.searchKey] = filterList.map(item => item.name);
            this.setState(prevState => ({
                selectAll: { ...prevState.selectAll, [keyItem.searchKey]: selctAll },
                commonFilterParams: tempList
            }));
        } else {
            this.setState(prevState => ({
                selectAll: { ...prevState.selectAll, [keyItem.searchKey]: selctAll },
                commonFilterParams: {}
            }));
        }
    };

    checkHasCommonFilters = searchKey => {
        const { tableParams = null } = this.props;
        if (tableParams) {
            if (tableParams.list && tableParams.list[searchKey] && tableParams.list[searchKey].length) {
                return true;
            }
        }
        return false;
    };

    checkHasWildCardFilters = searchKey => {
        const { tableParams = null } = this.props;
        if (tableParams && tableParams.filters && tableParams.filters[searchKey] && tableParams.filters[searchKey].key) {
            if (typeof tableParams.filters[searchKey].key === "string" && tableParams.filters[searchKey].key.trim().length) {
                return true;
            }
            if (typeof tableParams.filters[searchKey].key === "object" && !_.isEmpty(tableParams.filters[searchKey].key)) {
                return true;
            }
            return true;
        }
        return false;
    };

    checkHasWildCardFiltersForDates = searchKey => {
        const { tableParams = null } = this.props;
        if (tableParams && tableParams.date_filters && tableParams.date_filters[searchKey]) {
            if (tableParams.date_filters[searchKey].key && tableParams.date_filters[searchKey].key.trim().length) {
                return true;
            }
            if (tableParams.date_filters[searchKey].status && tableParams.date_filters[searchKey].status.length) {
                return true;
            }
            if (tableParams.date_filters[searchKey].not_null) {
                return true;
            }
        }
        return false;
    };

    setQuaterlyBackGroundColor = () => {
        Object.keys(quaterlyBackgroundColor).map(className => {
            if (quaterlyBackgroundColor[className] && quaterlyBackgroundColor[className].length) {
                if (document.getElementsByClassName(className)) {
                    var elements = document.getElementsByClassName(className);
                    for (var i = 0; i < elements.length; i++) {
                        elements[i].style.background = `${quaterlyBackgroundColor[className]}`;
                    }
                }
            }
        });
    };

    renderCellData = (type, data, keyItem) => {
        let returnData = data;
        if(keyItem==="standard"){
        switch (type) {
            
            case "window":
                if (data?.includes("~")) {
                    // returnData = data.replace(/~/g, "\n");
                    let dataToArray = data?.split("~").map(item => `${item.trim()}`).join("\n")
                    ;  
                    returnData = dataToArray || "-";
                //     returnData = (
                //         <ul type="i" className="listForWindow">
                //             {dataToArray}
                //         </ul>
                //     );
                } else {
                    returnData = data || "-";
                }
                break;
                
            default:
                returnData = data || "-";
                break;
        }
        
        return returnData;
    }
    };
    
    render() {
        const {
            isCalendarExpanded,
            schedules,
            tableData,
            updateWildCardFilter,
            showWildCardFilter,
            wildCardFilter,
            handleActivityEventClick,
            hasLastPerformedClick,
            wildCardFilterMonth,
            handleDeviceCountClick,
            updateWildCardFilterMonth,
            selectedLogbook,
            showLastPerformedColumn
        } = this.props;

        let searchKeysArray = this.setSearchKeysArray();
        // this.setQuaterlyBackGroundColor();
        return (
            <div className={`file-system-sec-right ${isCalendarExpanded ? "mob-sec" : ""}`}>
                <div className="tab-btm-cover">
                    <div className={`file-calendar-cover ${isCalendarExpanded ? "cal-tab-active" : ""}`}>
                        <div className="calendar-tab-cover" id="calendar-table-container" onScroll={e => this.OnScroll(e)}>
                            <table className="calendar-table">
                                <thead>
                                    <tr id="activityCalendarTableHeaderRow">
                                        {selectedLogbook.has_asset === "yes" ? (
                                            <th
                                                className={`calendar-acticity-column0 drop-fil drop-content min-width-110 ${
                                                    this.checkHasCommonFilters("assets.name") || this.checkHasWildCardFilters("assets.name")
                                                        ? "active-head"
                                                        : ""
                                                }`}
                                            >
                                                Asset
                                                <span
                                                    className="dropdown-toggle"
                                                    id="dropdownMenuButton"
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                    onClick={e => {
                                                        this.showCommonSearchDropDown("asset", "assets.name");
                                                    }}
                                                >
                                                    <span className="material-icons drop-icn">keyboard_arrow_down</span>
                                                </span>
                                                {this.renderFiltersForCommonSearch("asset")}
                                            </th>
                                        ) : null}
                                        {showLastPerformedColumn ? (
                                            <th
                                                className={`calendar-acticity-column1 drop-fil drop-content min-width-110 ${
                                                    this.checkHasCommonFilters("schedules.date_last_performed") ||
                                                    this.checkHasWildCardFilters("schedules.date_last_performed")
                                                        ? "active-head"
                                                        : ""
                                                }`}
                                            >
                                                Last Performed
                                            </th>
                                        ) : null}
                                        <th
                                            className={`calendar-acticity-column2 drop-fil drop-content ${
                                                this.checkHasCommonFilters("schedules.standard") || this.checkHasWildCardFilters("schedules.standard")
                                                    ? "active-head"
                                                    : ""
                                            }`}
                                        >
                                            Std
                                            <span
                                                className="dropdown-toggle"
                                                id="dropdownMenuButton"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                                onClick={e => {
                                                    this.showCommonSearchDropDown("standard", "schedules.standard");
                                                }}
                                            >
                                                <span className="material-icons drop-icn">keyboard_arrow_down</span>
                                            </span>
                                            {this.renderFiltersForCommonSearch("standard")}
                                        </th>

                                        <th
                                            className={`drop-fil drop-content calendar-acticity-column3 min-width-110 ${
                                                this.checkHasCommonFilters("schedules.activity_description") ||
                                                this.checkHasWildCardFilters("schedules.activity_description")
                                                    ? "active-head"
                                                    : ""
                                            }`}
                                        >
                                            Activity
                                            {/* <span> */}
                                            <span
                                                className="dropdown-toggle"
                                                id="dropdownMenuButton"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                                onClick={e => {
                                                    this.showCommonSearchDropDown("activity_description", "schedules.activity_description");
                                                }}
                                            >
                                                <span className="material-icons drop-icn">keyboard_arrow_down</span>
                                            </span>
                                            {/* </span> */}
                                            {this.renderFiltersForCommonSearch("activity_description")}
                                        </th>
                                        {moment.monthsShort().map((month, i) => (
                                            <th
                                                className={`${this.checkHasWildCardFiltersForDates(month) ? "active-head" : ""} ${
                                                    new Date().getMonth() === i
                                                        ? `th-active calendar-acticity-column${i + 4}`
                                                        : `calendar-acticity-column${i + 4}`
                                                }`}
                                                key={i}
                                            >
                                                <span>{month}</span>
                                            </th>
                                        ))}
                                    </tr>
                                    {showWildCardFilter ? (
                                        <WildCardFilter
                                            config={tableData.config}
                                            keys={tableData.keys}
                                            updateWildCardFilter={updateWildCardFilter}
                                            isNormalTable={false}
                                            actionShow={false}
                                            closView={true}
                                            filterBlue="filter-blue filters"
                                            wildCardFilter={wildCardFilter}
                                            isMonthFilter={true}
                                            wildCardFilterMonth={wildCardFilterMonth}
                                            updateWildCardFilterMonth={updateWildCardFilterMonth}
                                        />
                                    ) : null}
                                </thead>

                                <tbody>
                                    {schedules.length ? (
                                        <>
                                            <ReactTooltip id="annual_calendar" effect="solid" />
                                            <ReactTooltip id="event_rules" effect="solid" />
                                            {schedules.map((item, i) => (
                                                <tr key={i}>
                                                    {selectedLogbook.has_asset === "yes" ? (
                                                        <td className="calendar-acticity-column height-max"
                                                        data-for="annual_calendar"
                                                        data-tip={item.asset && item.asset.name}
                                                        data-place="top">
                                                            <Highlighter
                                                                searchWords={
                                                                    this.filterHighlighter(
                                                                        tableData.config["asset"] && tableData.config["asset"].searchKey
                                                                    )
                                                                        ? searchKeysArray
                                                                        : []
                                                                }
                                                                textToHighlight={(item.asset && item.asset.name) || "-"}
                                                            />
                                                        </td>
                                                    ) : null}
                                                    {showLastPerformedColumn ? (
                                                        <td className="calendar-acticity-column height-max">
                                                            {item.date_last_performed_id && hasLastPerformedClick ? (
                                                                <div
                                                                    className="cursor-pointer"
                                                                    onClick={() =>
                                                                        handleActivityEventClick(
                                                                            item.date_last_performed_id,
                                                                            item.id,
                                                                            item.edit_form,
                                                                            item.dates
                                                                        )
                                                                    }
                                                                >
                                                                    <Highlighter
                                                                        searchWords={
                                                                            this.filterHighlighter(tableData.config["date_last_performed"].searchKey)
                                                                                ? searchKeysArray
                                                                                : []
                                                                        }
                                                                        textToHighlight={item.date_last_performed || "-"}
                                                                        className="highlighter"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <Highlighter
                                                                    searchWords={
                                                                        this.filterHighlighter(
                                                                            tableData.config["date_last_performed"] &&
                                                                                tableData.config["date_last_performed"].searchKey
                                                                        )
                                                                            ? searchKeysArray
                                                                            : []
                                                                    }
                                                                    textToHighlight={item.date_last_performed || "-"}
                                                                />
                                                            )}
                                                        </td>
                                                    ) : null}
                                                    <td
                                                        className="calendar-acticity-column height-max"
                                                        data-for="annual_calendar"
                                                        data-tip={item.standard_tooltip}
                                                        data-place="top"
                                                    ><span className="customWindow">
                                                        <Highlighter
                                                            searchWords={
                                                                this.filterHighlighter(
                                                                    tableData.config["standard"] && tableData.config["standard"].searchKey
                                                                )
                                                                    ? searchKeysArray
                                                                    : []
                                                            }
                                                            textToHighlight={(this.renderCellData("window", item?.standard, "standard") &&
                                                            this.renderCellData("window", item?.standard, "standard")) || "-"}
                                                        />
                                                     </span>
                                                    </td>
                                                    <td
                                                        className="calendar-acticity-column height-max"
                                                        data-for="annual_calendar"
                                                        data-tip={`<p class="dc-tooltip"><span class="dc-click-text">Click for Device Count</span><span>${item.activity_tooltip?.trim()}</span></p>`}
                                                        data-place="top"
                                                        data-html={true}
                                                    >
                                                        <div
                                                            className="cursor-pointer"
                                                            onClick={() => handleDeviceCountClick(item.building_activity_id,item?.asset?.id,item?.id)}
                                                        >
                                                            <Highlighter
                                                                searchWords={
                                                                    this.filterHighlighter(tableData.config["activity_description"].searchKey)
                                                                        ? searchKeysArray
                                                                        : []
                                                                }
                                                                textToHighlight={item.activity_description || "-"}
                                                            />
                                                        </div>
                                                    </td>
                                                    {item.quarterly_view && item.quarterly_view === "yes"
                                                        ? this.renderQuaterlySchedule(item)
                                                        : this.renderMonthlySchedule(item)}
                                                </tr>
                                            ))}
                                        </>
                                    ) : (
                                        <tr>
                                            <td colSpan={showLastPerformedColumn ? 16 : 15} className="text-center">
                                                No data found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ActivityCalendarTableCalendar;
