import React, { Component } from "react";
import DatePicker from "react-date-picker";
import _ from "lodash";
import moment from "moment";

import BuildModalHeader from "./BuildModalHeader";
import { checkPermission } from "../../../config/utils";
import Portal from "./Portal";
import ConfirmationModal from "./ConfirmationModal";

class CreateActivityEventScheduleModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formParams: {
                id: null,
                schedule_id: null,
                date: new Date(new Date().setFullYear(props.newActivityYear || new Date().getFullYear(), props.newActivityMonth || 0, 1)),
                end_date: null,
                years: [],
                delete: null, // 'empty events' OR 'data events'
                event: null, // 'single event' OR 'multi events' OR 'na'
                delete_current: false
            },
            initialFormParams: null,
            isCancelConfirmation: false,
            showConfirmation: false,
            errorParams: {
                date: false,
                end_date: false,
                action: false
            },
            showErrorBorder: false,
            yearsList:
                props.schedulePopupDetails.years &&
                props.schedulePopupDetails.years.filter(year => props.newActivityYear && year >= props.newActivityYear)
        };
    }

    componentDidMount = async () => {
        const { formParams } = this.state;
        const { schedulePopupDetails, type, selectedEvent } = this.props;
        await this.setState({
            formParams: {
                ...formParams,
                schedule_id: schedulePopupDetails.schedule.id || null,
                id: selectedEvent || null
            }
        });
        if (type === "edit") {
            await this.setState({
                formParams: {
                    ...formParams,
                    schedule_id: schedulePopupDetails.schedule.id || null,
                    id: selectedEvent || null,
                    // yearsList: schedulePopupDetails.years || [],
                    date: schedulePopupDetails.start_date ? new Date(schedulePopupDetails.start_date) : null,
                    end_date: schedulePopupDetails.end_date ? new Date(schedulePopupDetails.end_date) : null
                }
            });
        }
        this.setInitialFormParams();
    };

    setInitialFormParams = async () => {
        const { formParams } = this.state;
        await this.setState({
            initialFormParams: formParams
        });
    };

    updateFormParamYears = async year => {
        const { formParams } = this.state;
        let tempMaxDate = null;
        let tempMinDate = null;
        let tempArray = formParams.years;
        if (tempArray && tempArray.length) {
            if (tempArray.includes(year)) {
                tempArray = tempArray.filter(item => item !== year);
            } else {
                tempArray.push(year);
            }
        } else {
            tempArray.push(year);
        }
        if (tempArray.length) {
            tempMaxDate = new Date();
            tempMinDate = new Date();
            tempMaxDate.setFullYear(parseInt(_.max(tempArray)));
            tempMinDate.setFullYear(parseInt(_.min(tempArray)));
            tempMaxDate.setMonth(11, 31);
            tempMinDate.setMonth(0, 1);
        }
        await this.setState({
            formParams: {
                ...formParams,
                years: tempArray,
                end_date: tempMaxDate
                // date: tempMinDate
            }
        });
    };

    selectAllFormParamsYear = async isAllSelected => {
        const { formParams, yearsList } = this.state;
        let tempArray = [];
        let tempMaxDate = null;
        let tempMinDate = null;
        if (!isAllSelected) {
            tempArray = yearsList.map(item => item);
        }
        if (tempArray.length) {
            tempMaxDate = new Date();
            tempMaxDate.setFullYear(parseInt(_.max(tempArray)));
            tempMaxDate.setMonth(11, 31);
            tempMinDate = new Date();
            tempMinDate.setFullYear(parseInt(_.min(tempArray)));
            tempMinDate.setMonth(0, 1);
        }
        await this.setState({
            formParams: {
                ...formParams,
                years: tempArray,
                end_date: tempMaxDate
                // date: tempMinDate
            }
        });
    };

    updateYearListBasedOnStartDate = async () => {
        const {
            formParams: { date, end_date },
            formParams
        } = this.state;
        const {
            schedulePopupDetails: { years: yearsList }
        } = this.props;
        let tempYearsList = yearsList;
        let minYear = _.min(yearsList);
        let maxYear = end_date ? new Date(end_date).getFullYear() : _.max(yearsList);
        let startDateYear = date ? new Date(date).getFullYear() : _.min(yearsList);
        if (startDateYear < minYear) {
            for (let i = startDateYear; i < minYear; i++) {
                tempYearsList.push(`${i}`);
            }
            tempYearsList.sort();
        } else if (startDateYear > maxYear) {
            tempYearsList = [`${startDateYear}`];
        } else {
            tempYearsList = [];
            for (let i = startDateYear; i <= maxYear; i++) {
                tempYearsList.push(`${i}`);
            }
            tempYearsList.sort();
        }
        await this.setState({
            yearsList: tempYearsList,
            formParams: { ...formParams, years: formParams.years.filter(year => tempYearsList.includes(year)) }
        });
    };

    updateYearListBasedOnEndDate = async () => {
        const {
            formParams: { end_date, date },
            formParams
        } = this.state;
        const {
            schedulePopupDetails: { years: yearsList }
        } = this.props;
        let tempYearsList = yearsList;
        let minYear = _.min(yearsList);
        let maxYear = _.max(yearsList);
        let startDateYear = date ? new Date(date).getFullYear() : _.min(yearsList);
        let endDateYear = end_date ? new Date(end_date).getFullYear() : _.max(yearsList);
        if (endDateYear < minYear) {
            tempYearsList = [`${endDateYear}`];
        } else if (endDateYear > maxYear) {
            tempYearsList = [];
            for (let i = startDateYear; i <= endDateYear; i++) {
                tempYearsList.push(`${i}`);
            }
            tempYearsList.sort();
        } else {
            tempYearsList = [];
            for (let i = startDateYear; i <= endDateYear; i++) {
                tempYearsList.push(`${i}`);
            }
            tempYearsList.sort();
        }
        await this.setState({
            yearsList: tempYearsList,
            formParams: { ...formParams, years: formParams.years.filter(year => tempYearsList.includes(year)) }
        });
    };

    validate = () => {
        const { formParams } = this.state;
        let errorParams = {
            date: false,
            end_date: false,
            action: false
        };
        let showErrorBorder = false;
        if (!formParams.date || !_.isDate(formParams.date)) {
            errorParams.date = true;
            showErrorBorder = true;
        }
        if (
            formParams.event !== "single event" &&
            formParams.event !== "modify event" &&
            !formParams.delete_current &&
            (!formParams.end_date || !_.isDate(formParams.end_date))
        ) {
            errorParams.end_date = true;
            showErrorBorder = true;
        }
        if (!formParams.event && !formParams.delete && !formParams.delete_current) {
            errorParams.action = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });

        if (showErrorBorder) return false;
        return true;
    };

    executeActivityEvent = () => {
        const { formParams } = this.state;
        if (this.validate()) {
            this.props.executeActivityEvent(formParams);
        }
    };

    setDeleteOptions = async type => {
        const { formParams } = this.state;
        let tempDeleteOpt = null;
        if (formParams.delete === "empty events") {
            if (type === "empty events") {
                tempDeleteOpt = null;
            } else if (type === "data events") {
                tempDeleteOpt = "empty and data events";
            }
        } else if (formParams.delete === "data events") {
            if (type === "data events") {
                tempDeleteOpt = null;
            } else if (type === "empty events") {
                tempDeleteOpt = "empty and data events";
            }
        } else if (formParams.delete === "empty and data events") {
            if (type === "data events") {
                tempDeleteOpt = "empty events";
            } else if (type === "empty events") {
                tempDeleteOpt = "data events";
            }
        } else {
            tempDeleteOpt = type;
        }
        await this.setState({
            formParams: {
                ...formParams,
                delete: tempDeleteOpt
            }
        });
    };

    togglShowConfirmation = () => {
        const { showConfirmation } = this.state;
        this.setState({
            showConfirmation: !showConfirmation
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmation } = this.state;
        if (!showConfirmation) return null;

        return (
            <Portal
                body={
                    <ConfirmationModal
                        onCancel={this.togglShowConfirmation}
                        onOk={this.props.onCancel}
                        heading={"Do you want to Continue ?"}
                        paragraph={"All your changes will be lost, Do you want to continue?"}
                    />
                }
                onCancel={this.togglShowConfirmation}
            />
        );
    };

    onCancel = async () => {
        const { formParams, initialFormParams } = this.state;
        if (!_.isEqual(formParams, initialFormParams)) {
            await this.setState({
                isCancelConfirmation: true
            });
            this.togglShowConfirmation();
        } else {
            this.props.onCancel();
        }
    };

    render() {
        const { schedulePopupDetails, newActivityMonth, newActivityYear, type } = this.props;
        const { formParams, showErrorBorder, errorParams, yearsList } = this.state;
        return (
            <React.Fragment>
                <div className="modal create-activity-schedule" role="dialog" style={{ display: "block" }} id="modalId">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader
                                title={type === "edit" ? "Modify Activity Event" : "Create Activity Event"}
                                onCancel={this.onCancel}
                                modalClass="create-activity-schedule"
                            />
                            <div className="modal-body">
                                <div className="box-section">
                                    <div className="col-md-6 box-layer">
                                        <h3>Building</h3>
                                        <h4>{schedulePopupDetails.building ? schedulePopupDetails.building.name : "-"}</h4>
                                    </div>
                                    <div className="col-md-6 box-layer">
                                        <h3>Activity</h3>
                                        <h4>{schedulePopupDetails.schedule ? schedulePopupDetails.schedule.activity_description : "-"}</h4>
                                    </div>
                                    <div className="col-md-6 box-layer">
                                        <h3>Test Frequency</h3>
                                        <h4>{schedulePopupDetails.schedule ? schedulePopupDetails.schedule.test_frequency : "-"}</h4>
                                    </div>
                                    <div className="col-md-3 box-layer">
                                        <h3 className={showErrorBorder && errorParams.date ? "text-red" : ""}>Date *</h3>
                                        <div className="form-group calendar">
                                            <DatePicker
                                                format="MM-dd-y"
                                                className={`form-control ${formParams.years && formParams.years.length ? "cursor-not-allowed" : ""}`}
                                                /* onCalendarOpen={() =>
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            date: formParams.date
                                                                ? formParams.date
                                                                : moment(
                                                                      new Date().setFullYear(
                                                                          newActivityYear || new Date().getFullYear(),
                                                                          newActivityMonth || 0,
                                                                          1
                                                                      )
                                                                  ).format("MM-DD-YYYY")
                                                        }
                                                    })
                                                } */
                                                onChange={async value => {
                                                    await this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            date: value
                                                        }
                                                    });
                                                    await this.updateYearListBasedOnStartDate();
                                                }}
                                                value={formParams.date && new Date(formParams.date)}
                                                // disabled={formParams.years && formParams.years.length}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3 box-layer">
                                        <h3 className={showErrorBorder && errorParams.end_date ? "text-red" : ""}>
                                            End Date {formParams.event !== "single event" ? "*" : ""}
                                        </h3>
                                        <div className="form-group calendar">
                                            <DatePicker
                                                format="MM-dd-y"
                                                className={`form-control ${formParams.years && formParams.years.length ? "cursor-not-allowed" : ""}`}
                                                onCalendarOpen={() =>
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            end_date: formParams.end_date
                                                                ? formParams.end_date
                                                                : moment(
                                                                      new Date().setFullYear(
                                                                          newActivityYear || new Date().getFullYear(),
                                                                          newActivityMonth || 0,
                                                                          1
                                                                      )
                                                                  ).format("MM-DD-YYYY")
                                                        }
                                                    })
                                                }
                                                onChange={async value => {
                                                    await this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            end_date: value
                                                        }
                                                    });
                                                    await this.updateYearListBasedOnEndDate();
                                                }}
                                                value={formParams.end_date && new Date(formParams.end_date)}
                                                // disabled={formParams.years && formParams.years.length}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="table-label"> Select Years to Update </div>
                                <div className="table-section">
                                    <div className="table-data">
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th className="chk-box">
                                                        <div className="custom-control custom-checkbox">
                                                            <input
                                                                checked={yearsList.length && formParams.years.length === yearsList.length}
                                                                type="checkbox"
                                                                className="custom-control-input"
                                                                id="customCheck"
                                                                name="example1"
                                                                onClick={() =>
                                                                    this.selectAllFormParamsYear(formParams.years.length === yearsList.length)
                                                                }
                                                            />
                                                            <label className="custom-control-label" for="customCheck"></label>
                                                        </div>
                                                    </th>
                                                    <th className="selt-all">
                                                        <label className="" for="customCheck">
                                                            Select All
                                                        </label>
                                                    </th>
                                                    <th className="chk-box"></th>
                                                    <th className="unselt-all"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {yearsList &&
                                                    yearsList.map(year => (
                                                        <tr>
                                                            <td>
                                                                <div className="custom-control custom-checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="custom-control-input"
                                                                        id="customCheck3"
                                                                        name="example1"
                                                                        checked={formParams.years.includes(year)}
                                                                    />
                                                                    <label
                                                                        className="custom-control-label"
                                                                        for="customCheck3"
                                                                        onClick={() => this.updateFormParamYears(year)}
                                                                    ></label>
                                                                </div>
                                                            </td>
                                                            <td colspan="3">{year}</td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                {checkPermission("event", "delete", "allow") ? (
                                    <div className="tag-sec">
                                        <div className="itm">
                                            <div className="custom-control custom-checkbox">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    id="deleteEmptyEvent"
                                                    name="delete"
                                                    checked={formParams.delete === "empty events" || formParams.delete === "empty and data events"}
                                                />
                                                <label
                                                    className="custom-control-label"
                                                    for="deleteEmptyEvent"
                                                    onClick={() => this.setDeleteOptions("empty events")}
                                                >
                                                    Delete existing EMPTY Events Schedule in Selected Year (s)
                                                </label>
                                            </div>
                                        </div>
                                        <div className="itm">
                                            <div className="custom-control custom-checkbox">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    id="deleteDataEvents"
                                                    name="delete"
                                                    checked={formParams.delete === "data events" || formParams.delete === "empty and data events"}
                                                />
                                                <label
                                                    className="custom-control-label"
                                                    for="deleteDataEvents"
                                                    onClick={() => this.setDeleteOptions("data events")}
                                                >
                                                    Delete existing Event Schedule WITH DATA in Selected Year (s)
                                                </label>
                                            </div>
                                        </div>
                                        {type === "edit" ? (
                                            <div className="itm">
                                                <div className="custom-control custom-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        className="custom-control-input"
                                                        id="deleteDataEvents"
                                                        name="delete"
                                                        checked={formParams.delete_current}
                                                    />
                                                    <label
                                                        className="custom-control-label"
                                                        for="deleteDataEvents"
                                                        onClick={() =>
                                                            this.setState({
                                                                formParams: {
                                                                    ...formParams,
                                                                    delete_current: !formParams.delete_current
                                                                }
                                                            })
                                                        }
                                                    >
                                                        Delete Current Event Cell
                                                    </label>
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                ) : null}
                                <div className="tag-radio">
                                    {checkPermission("event", "create", "allow") ? (
                                        <div className="custom-control custom-radio">
                                            <input
                                                type="radio"
                                                className="custom-control-input"
                                                id="customRadio1"
                                                name="create"
                                                value="customEx"
                                                checked={formParams.event === "multi events"}
                                            />
                                            <label
                                                className="custom-control-label"
                                                for="customRadio1"
                                                onClick={() =>
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            event: formParams.event === "multi events" ? null : "multi events"
                                                        }
                                                    })
                                                }
                                            >
                                                Create NEW Events Schedule in Selected Year (s)
                                            </label>
                                        </div>
                                    ) : null}
                                    {type === "edit" ? (
                                        <>
                                            <div className="custom-control custom-radio">
                                                <input
                                                    type="radio"
                                                    className="custom-control-input"
                                                    id="customRadio2"
                                                    name="create"
                                                    value="customEx"
                                                    checked={formParams.event === "modify event"}
                                                />
                                                <label
                                                    className="custom-control-label"
                                                    for="customRadio2"
                                                    onClick={() =>
                                                        this.setState({
                                                            formParams: {
                                                                ...formParams,
                                                                event: formParams.event === "modify event" ? null : "modify event"
                                                            }
                                                        })
                                                    }
                                                >
                                                    Modify Current Event Cell Schedule
                                                </label>
                                            </div>
                                            <div className="custom-control custom-radio">
                                                <input
                                                    type="radio"
                                                    className="custom-control-input"
                                                    id="customRadio2"
                                                    name="create"
                                                    value="customEx"
                                                    checked={formParams.event === "modify series"}
                                                />
                                                <label
                                                    className="custom-control-label"
                                                    for="customRadio2"
                                                    onClick={() =>
                                                        this.setState({
                                                            formParams: {
                                                                ...formParams,
                                                                event: formParams.event === "modify series" ? null : "modify series"
                                                            }
                                                        })
                                                    }
                                                >
                                                    Modify Series
                                                </label>
                                            </div>
                                        </>
                                    ) : checkPermission("event", "create", "allow") ? (
                                        <div className="custom-control custom-radio">
                                            <input
                                                type="radio"
                                                className="custom-control-input"
                                                id="customRadio2"
                                                name="create"
                                                value="customEx"
                                                checked={formParams.event === "single event"}
                                            />
                                            <label
                                                className="custom-control-label"
                                                for="customRadio2"
                                                onClick={() =>
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            event: formParams.event === "single event" ? null : "single event"
                                                        }
                                                    })
                                                }
                                            >
                                                Create a NEW Single Event Cell Schedule
                                            </label>
                                        </div>
                                    ) : null}
                                    {checkPermission("event", "na", "allow") ? (
                                        <div className="custom-control custom-radio">
                                            <input
                                                type="radio"
                                                className="custom-control-input"
                                                checked={formParams.event === "na"}
                                                id="customRadio3"
                                                name="create"
                                                value="customEx"
                                            />
                                            <label
                                                className="custom-control-label"
                                                for="customRadio3"
                                                onClick={() =>
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            event: formParams.event === "na" ? null : "na"
                                                        }
                                                    })
                                                }
                                            >
                                                Set to N/A
                                            </label>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="modal-foter">
                                <div className="btn-sec btn-survey-sec">
                                    <div className="btn-out-1">
                                        {showErrorBorder && errorParams.action ? (
                                            <span className="text-red mr-2 p-2">Select any create or delete action</span>
                                        ) : null}
                                        <button className="btn btn-create" onClick={() => this.executeActivityEvent()}>
                                            <i className="material-icons tic"> cached</i> Execute
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.renderConfirmationModal()}
            </React.Fragment>
        );
    }
}

export default CreateActivityEventScheduleModal;
