import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";

import BuildModalHeader from "../BuildModalHeader";
import commonActions from "../../actions";

class PreviousSurveyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gltDetails: null
        };
    }
    render() {
        const { onCancel, previous_surveys, previous_locations } = this.props;
        let duration = moment.duration({ minutes: 60 });
        return (
            <React.Fragment>
                <div className="modal previous-survey-modal" role="dialog" style={{ display: "block" }} id="modalId">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader
                                title={`Previous surveys for invalid time interval`}
                                onCancel={onCancel}
                                modalClass="previous-survey-modal"
                            />
                            <div className="modal-body">
                                <div className="table-section">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th className="img-sq-box">
                                                    <img alt="" src="/images/table-blue-dots.svg" />
                                                </th>
                                                <th>Due Date</th>
                                                <th>Actual Date</th>
                                                <th>Actual Time</th>
                                                <th>Actual Day</th>
                                                <th>Invalid Interval</th>
                                                <th>Location</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {previous_surveys && previous_surveys.length ? (
                                                previous_surveys.map((item, i) => (
                                                    <tr key={i}>
                                                        <td className="img-sq-box">
                                                            <img alt="" src="/images/table-blue-dots.svg" />
                                                        </td>
                                                        <td>{item.due_date || "-"}</td>
                                                        <td>{item.actual_date || "-"}</td>
                                                        <td>
                                                            {item.actual_time
                                                                ? moment(item.actual_time, ["HH.mm"]).format("hh:mm a").toUpperCase()
                                                                : "-"}
                                                        </td>
                                                        <td>{item.actual_day || "-"}</td>
                                                        <td>
                                                            {item.actual_time
                                                                ? moment(item.actual_time, "HH:mm").subtract(duration).format("hh:mm a").toUpperCase()
                                                                : "-"}{" "}
                                                            -
                                                            {item.actual_time
                                                                ? moment(item.actual_time, "HH:mm").add(duration).format("hh:mm a").toUpperCase()
                                                                : "-"}
                                                        </td>
                                                        <td>{item.location || previous_locations[i] || "-"}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="text-center">
                                                        No Records Found !!
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
const mapStateToProps = state => {
    const { commonReducer } = state;
    return { commonReducer };
};

export default connect(mapStateToProps, { ...commonActions })(PreviousSurveyModal);
