import React, { Component } from "react";
// import DatePicker from "react-date-picker";
import DatePicker from "react-datepicker";
import moment from "moment";
import _ from "lodash";

import "react-datepicker/dist/react-datepicker.css";

class EmptyEventFormModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDate: this.props.startDate
                ? new Date(this.props.startDate)
                : new Date(parseInt(this.props.selectedEventDetails.year), parseInt(this.props.selectedEventDetails.month), 1),
            activeDateObjects: [],
            showDatesDetails: false
        };
    }

    componentDidMount = async () => {
        const { selectedEventDetails } = this.props;
        if (selectedEventDetails) {
            const {
                selectedEventDetails: { dates = null }
            } = this.props;
            await this.setState({
                activeDateObjects: dates
            });
        }
    };

    componentDidUpdate = async (prevProps, prevState) => {
        const { selectedEventDetails } = this.props;
        if (selectedEventDetails) {
            const {
                selectedEventDetails: { dates = null }
            } = this.props;
            if (prevProps.selectedEventDetails !== this.props.selectedEventDetails) {
                await this.setState({
                    activeDateObjects: dates
                });
            }
        }
    };

    findDateObjectsOfMonth = () => {
        const {
            selectedEventDetails,
            selectedEventDetails: { month = null, year = null },
            surveyDetails
        } = this.props;

        let dates = surveyDetails?.dates || selectedEventDetails?.dates;
        let filteredDates =
            dates &&
            dates.filter((dateObj, i) => new Date(dateObj.date).getMonth() === month && new Date(dateObj.date).getFullYear() === parseInt(year));

        return _.orderBy(filteredDates, "date", "asc");
    };

    // disable the list of custom dates
    disableCustomDt = current => {
        const { activeDateObjects = null } = this.state;
        let customDates = activeDateObjects && activeDateObjects.map(item => moment(item.date).format("YYYY-MM-DD"));
        return customDates && customDates.includes(moment(current).format("YYYY-MM-DD"));
    };

    onDateSelect = date => {
        const {
            selectedEventDetails: { dates, edit_form },
            handleActivityEventClick,
            onCancel
        } = this.props;
        let selectedDateObj = dates.find((dateObj, i) => moment(dateObj.date).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD"));
        onCancel();
        handleActivityEventClick(
            selectedDateObj.id,
            selectedDateObj.schedule_id,
            edit_form,
            dates,
            new Date(date).getMonth(),
            new Date(date).getFullYear(),
            selectedDateObj.week ? "weekly" : "daily"
        );
        this.setState({
            selectedDate: date
        });
    };

    toggleDateDetaislsDropDown = value => {
        const { showDatesDetails } = this.state;
        this.setState({
            showDatesDetails: value ? value : !showDatesDetails
        });
    };

    isDatePassed = threshold_end => {
        let today = new Date();
        if (new Date(threshold_end).setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)) {
            return true;
        }
        return false;
    };

    hasBorder = (threshold_start, threshold_end) => {
        return (
            new Date(threshold_start).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0) &&
            new Date(threshold_end).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)
        );
    };

    renderDates = () => {
        const { surveyDetails } = this.props;
        let activeDates = this.findDateObjectsOfMonth();
        return (
            activeDates &&
            activeDates.map(dateItem => (
                <div className={`${dateItem.week ? "col-md-12" : "cstm-wid-14"} p-0 pr-1 mb-1 box-layer hide-on-view-only`}>
                    {dateItem.icon && dateItem.color ? (
                        <div className="icon-date-wrapper text-center title-tip title-tip-up" style={{ background: `${dateItem.color}` }}>
                            <span className="icon-img text-center">
                                <img src={`/images/${dateItem.icon}`} alt="" />
                            </span>
                            <span className="pos-date">
                                {moment(new Date(dateItem.date)).format("MM-DD-YY")} <br />
                                {dateItem.actual_date ? moment(new Date(dateItem.actual_date)).format("MM-DD-YY") : null}
                            </span>
                        </div>
                    ) : dateItem.color ? (
                        <div className="icon-date-wrapper text-center" style={{ background: `${dateItem.color}` }}>
                            <span className="pos-date">
                                {moment(new Date(dateItem.date)).format("MM-DD-YY")} <br />
                                {dateItem.actual_date ? moment(new Date(dateItem.actual_date)).format("MM-DD-YY") : null}
                            </span>
                        </div>
                    ) : this.isDatePassed(dateItem.threshold_end) ? (
                        <div className="icon-date-wrapper text-center" style={{ background: "#F59089" }}>
                            <span className="icon-img text-center">
                                <img src={`/images/plus-icn-red.svg`} alt="" />
                            </span>
                            <span className="pos-date">
                                {moment(new Date(dateItem.date)).format("MM-DD-YY")} <br />
                                {dateItem.actual_date ? moment(new Date(dateItem.actual_date)).format("MM-DD-YY") : null}
                            </span>
                        </div>
                    ) : (
                        <div
                            className={`icon-date-wrapper text-center ${
                                this.hasBorder(dateItem.threshold_start, dateItem.threshold_end) ? "border-highlight" : ""
                            }`}
                            style={{ background: "#BFFFBF" }}
                        >
                            <span className="icon-img text-center">
                                <img src={`/images/plus-icn.svg`} alt="" />
                            </span>
                            <span className="pos-date">
                                {moment(new Date(dateItem.date)).format("MM-DD-YY")} <br />
                                {dateItem.actual_date ? moment(new Date(dateItem.actual_date)).format("MM-DD-YY") : null}
                            </span>
                        </div>
                    )}
                </div>
            ))
        );
    };

    render() {
        const { selectedEventDetails } = this.props;
        if (!selectedEventDetails) {
            return null;
        }

        const {
            onCancel,
            selectedEventDetails: { month, year, itemId, frequency = "weekly" },
            showCreateActivityEventSchedule
        } = this.props;
        const { showDatesDetails } = this.state;

        return (
            <React.Fragment>
                <div className={`tab-row-actions ${frequency}`}>
                    <ul
                        className="prf-lst show-legends-eye"
                        onMouseEnter={() => this.toggleDateDetaislsDropDown(true)}
                        onClick={() => this.toggleDateDetaislsDropDown(false)}
                    >
                        <span class="material-icons">info</span>
                        {showDatesDetails ? (
                            <div className="dropdown-menu profile-view show" aria-labelledby="profile-info">
                                <div className="dropdown-content">
                                    <div className="row m-0">{this.renderDates()}</div>
                                </div>
                            </div>
                        ) : null}
                    </ul>
                    <label className="date-label">Select Date</label>
                    <div className="form-group calendar">
                        <DatePicker
                            className="form-control"
                            selected={this.state.selectedDate}
                            onChange={date => this.onDateSelect(date)}
                            filterDate={this.disableCustomDt}
                            calendarStartDay={1}
                        />
                    </div>
                    <button
                        className="btn btn-create save mr-2 hide-on-view-only"
                        onClick={() => {
                            onCancel();
                            showCreateActivityEventSchedule(itemId, month, year, "add");
                        }}
                    >
                        <i className="material-icons tic">add</i> Add New Event
                    </button>
                </div>
            </React.Fragment>
        );
    }
}

export default EmptyEventFormModal;
