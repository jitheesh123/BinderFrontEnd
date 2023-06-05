import React, { Component } from "react";
import DatePicker from "react-date-picker";
import _ from "lodash";
import moment from "moment";

import BuildModalHeader from "./BuildModalHeader";

class ModifyNAModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formParams: {
                schedule_id: null,
                years: [],
                date: null,
                end_date: null
            },
            errorParams: {
                years: false,
                date: false,
                end_date: false
            },
            formType: "undo_na",
            showErrorBorder: false,
            yearsList: props.undoNAPopupDetails.years || []
        };
    }

    componentDidMount = async () => {
        const { formParams } = this.state;
        const { scheduleId, undoNAPopupDetails } = this.props;
        await this.setState({
            formParams: {
                ...formParams,
                schedule_id: scheduleId,
                date: new Date(undoNAPopupDetails.na_start),
                end_date: new Date(undoNAPopupDetails.na_end)
            }
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
                end_date: tempMaxDate,
                date: tempMinDate
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
            tempMinDate.setFullYear(parseInt(_.max(tempArray)));
            tempMinDate.setMonth(11, 31);
        }
        await this.setState({
            formParams: {
                ...formParams,
                years: tempArray,
                end_date: tempMaxDate,
                date: tempMinDate
            }
        });
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

    validate = () => {
        const { formParams, formType } = this.state;
        let errorParams = {
            date: false,
            end_date: false,
            years: false
        };
        let showErrorBorder = false;

        if (formType === "undo_na") {
            if (!formParams.years || !formParams.years.length) {
                errorParams.years = true;
                showErrorBorder = true;
            }
        } else {
            if (!formParams.years || !formParams.years.length) {
                if (!formParams.date || !_.isDate(formParams.date)) {
                    errorParams.date = true;
                    showErrorBorder = true;
                }
                if (!formParams.end_date || !_.isDate(formParams.end_date)) {
                    errorParams.end_date = true;
                    showErrorBorder = true;
                }
            }
        }

        this.setState({
            showErrorBorder,
            errorParams
        });

        if (showErrorBorder) return false;
        return true;
    };

    modifyNa = () => {
        if (this.validate()) {
            const { formParams } = this.state;
            const { executeActivityEvent } = this.props;
            executeActivityEvent(formParams, true);
        }
    };

    undoNa = () => {
        if (this.validate()) {
            const {
                formParams: { schedule_id, years }
            } = this.state;
            const { undoNa } = this.props;
            let temFormData = {};
            undoNa({ ...temFormData, schedule_id, years });
        }
    };

    render() {
        const { onCancel, undoNAPopupDetails, naMonth, naYear, type, executeActivityEvent } = this.props;
        const { formParams, showErrorBorder, errorParams, yearsList, formType } = this.state;
        return (
            <React.Fragment>
                <div className="modal create-activity-schedule modify-na" role="dialog" style={{ display: "block" }} id="modalId">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader title="Modify NA" onCancel={onCancel} modalClass="modify-na" />
                            <div className="modal-body">
                                <div className="tag-radio">
                                    <div className="custom-control custom-radio">
                                        <input
                                            type="radio"
                                            className="custom-control-input"
                                            id="customRadio1"
                                            name="create"
                                            value="customEx"
                                            checked={formType === "undo_na"}
                                        />
                                        <label
                                            className="custom-control-label"
                                            for="customRadio1"
                                            onClick={() =>
                                                this.setState({
                                                    formType: "undo_na"
                                                })
                                            }
                                        >
                                            Undo NA
                                        </label>
                                    </div>
                                    <div className="custom-control custom-radio">
                                        <input
                                            type="radio"
                                            className="custom-control-input"
                                            id="customRadio2"
                                            name="create"
                                            value="customEx"
                                            checked={formType === "modify_na"}
                                        />
                                        <label
                                            className="custom-control-label"
                                            for="customRadio2"
                                            onClick={() =>
                                                this.setState({
                                                    formType: "modify_na"
                                                })
                                            }
                                        >
                                            Modify NA
                                        </label>
                                    </div>
                                </div>
                                <div className="box-section">
                                    <div className="col-md-6 box-layer">
                                        <h3>Building</h3>
                                        <h4>{undoNAPopupDetails.building ? undoNAPopupDetails.building.name : "-"}</h4>
                                    </div>
                                    <div className="col-md-6 box-layer">
                                        <h3>Activity</h3>
                                        <h4>{undoNAPopupDetails.schedule ? undoNAPopupDetails.schedule.activity_description : "-"}</h4>
                                    </div>
                                    <div className="col-md-6 box-layer">
                                        <h3>Test Frequency</h3>
                                        <h4>{undoNAPopupDetails.schedule ? undoNAPopupDetails.schedule.test_frequency : "-"}</h4>
                                    </div>
                                    {formType === "modify_na" ? (
                                        <>
                                            <div className="col-md-3 box-layer">
                                                <h3 className={showErrorBorder && errorParams.date ? "text-red" : ""}>Date *</h3>
                                                <div className="form-group calendar">
                                                    <DatePicker
                                                        format="MM-dd-y"
                                                        className="form-control"
                                                        onCalendarOpen={() =>
                                                            this.setState({
                                                                formParams: {
                                                                    ...formParams,
                                                                    date: formParams.date
                                                                        ? formParams.date
                                                                        : moment(
                                                                              new Date().setFullYear(
                                                                                  naYear || new Date().getFullYear(),
                                                                                  naMonth || 0,
                                                                                  1
                                                                              )
                                                                          ).format("MM-DD-YYYY")
                                                                }
                                                            })
                                                        }
                                                        onChange={value => {
                                                            this.setState({
                                                                formParams: {
                                                                    ...formParams,
                                                                    date: value
                                                                }
                                                            });
                                                        }}
                                                        value={formParams.date && new Date(formParams.date)}
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
                                                        className="form-control"
                                                        onCalendarOpen={() =>
                                                            this.setState({
                                                                formParams: {
                                                                    ...formParams,
                                                                    end_date: formParams.end_date
                                                                        ? formParams.end_date
                                                                        : moment(
                                                                              new Date().setFullYear(
                                                                                  naYear || new Date().getFullYear(),
                                                                                  naMonth || 0,
                                                                                  1
                                                                              )
                                                                          ).format("MM-DD-YYYY")
                                                                }
                                                            })
                                                        }
                                                        onChange={value => {
                                                            this.setState({
                                                                formParams: {
                                                                    ...formParams,
                                                                    end_date: value
                                                                }
                                                            });
                                                        }}
                                                        value={formParams.end_date && new Date(formParams.end_date)}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ) : null}
                                </div>
                                <div className={showErrorBorder && errorParams.years ? "text-red table-label" : "table-label"}>
                                    Select Years to Update
                                </div>
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
                            </div>
                            <div className="modal-foter">
                                <div className="btn-sec btn-survey-sec">
                                    <div className="btn-out-1">
                                        {showErrorBorder && errorParams.years ? <span className="text-red mr-2 p-2">Select year(s)</span> : null}
                                        {showErrorBorder && (errorParams.date || errorParams.end_date) ? (
                                            <span className="text-red mr-2 p-2">Select year(s) or Start Date and End Date</span>
                                        ) : null}
                                        {formType === "modify_na" ? (
                                            <button className="btn btn-create" onClick={() => this.modifyNa()}>
                                                <i className="material-icons tic"> cached</i> Execute
                                            </button>
                                        ) : (
                                            <button className="btn btn-create" onClick={() => this.undoNa()}>
                                                <i className="material-icons tic"> cached</i> Execute
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ModifyNAModal;
