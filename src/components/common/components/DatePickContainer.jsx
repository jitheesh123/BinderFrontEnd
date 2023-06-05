import React, { Component } from "react";
import DatePicker from "react-date-picker";
import { withRouter } from "react-router-dom";
import moment from "moment";

class DatePickContainer extends Component {
    state = {
        date: "",
        noOfDays: 0
    };
    render() {
        const { date } = this.state;
        const {
            match: {
                params: { section }
            }
        } = this.props;

        const renderDateRange = (section) => {
            switch (section) {
                case "currentWeek":
                case "nextWeek":
                case "nextMonth":
                case "overDue":
                case "nonCompliant":
                case "completed":
                case "incomplete":
                case "trailingViewReport":
                    return (
                        <>
                            <label>To :</label>
                            <div className="dropdown drop-fil drop1">
                                <DatePicker
                                    format="MM-dd-y"
                                    className="datePickerReport"
                                    required={true}
                                    onChange={async value => {
                                        await this.setState({
                                            date: value
                                        });
                                        this.props.endDateChange(value);
                                    }}
                                    value={this.props.endDate}
                                />
                            </div>
                        </>
                    );
                case "threshold3DayeEnd":
                    return (
                        <>
                            <label>Number of Days :</label>
                            <div className="number-type">
                                <input
                                    type="number"
                                    value={this.props.noOfDays}
                                    onChange={e => {
                                        this.setState({
                                            noOfDays: e.target.value
                                        });
                                        this.props.threshold3DayHandler(e.target.value);
                                    }}
                                />
                            </div>
                        </>
                    );
                default:
                    return null;
            }
        };

        return (
            <div className="drop-right">
                <label>From :</label>
                <div className="dropdown drop-fil drop1">
                    <DatePicker
                        format="MM-dd-y"
                        // className="datePickerReport"
                        required={true}
                        onChange={async value => {
                            await this.setState({
                                date: value
                            });
                            this.props.dateChange(value);
                        }}
                        value={this.props.selectedDate}
                    />
                </div>
                {renderDateRange(section)}
            </div>
        );
    }
}

export default withRouter(DatePickContainer);
