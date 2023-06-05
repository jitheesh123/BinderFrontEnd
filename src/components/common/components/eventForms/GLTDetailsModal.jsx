import React, { Component } from "react";
import { connect } from "react-redux";

import BuildModalHeader from "../BuildModalHeader";
import commonActions from "../../actions";

class GLTDetailsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gltDetails: null
        };
    }

    componentDidMount = async () => {
        const { survey_date_id } = this.props;
        await this.props.getGLTDetails(survey_date_id);

        const {
            commonReducer: {
                getGLTDetailsResponse: { annual_load_bank_event_details = null }
            }
        } = this.props;

        await this.setState({
            gltDetails: annual_load_bank_event_details
        });
    };

    render() {
        const { onCancel } = this.props;
        const { gltDetails } = this.state;
        return (
            <React.Fragment>
                <div className="modal glt-details-modal" role="dialog" style={{ display: "block" }} id="modalId">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader title={`Generator Load Test Details`} onCancel={onCancel} modalClass="glt-details-modal" />
                            <div className="modal-body">
                                <div className="box-section">
                                    <div class="col-md-12 box-layer">
                                        <h3>Activity</h3>
                                        <h4>{(gltDetails && gltDetails.activity_description) || "-"}</h4>
                                    </div>
                                    <div class="col-md-12 box-layer">
                                        <h3>Performed By</h3>
                                        <h4>{(gltDetails && gltDetails.performed_by) || "-"}</h4>
                                    </div>
                                    <div class="col-md-6 box-layer">
                                        <h3>Due Date</h3>
                                        <h4>{(gltDetails && gltDetails.due_date) || "-"}</h4>
                                    </div>
                                    <div class="col-md-6 box-layer">
                                        <h3>Actual Date</h3>
                                        <h4>{(gltDetails && gltDetails.actual_date) || "-"}</h4>
                                    </div>
                                    <div class="col-md-4 box-layer">
                                        <h3>Total Devices</h3>
                                        <h4>{(gltDetails && gltDetails.total_devices) || "-"}</h4>
                                    </div>
                                    <div class="col-md-4 box-layer">
                                        <h3>Number Pass</h3>
                                        <h4>{(gltDetails && gltDetails.number_pass) || "-"}</h4>
                                    </div>
                                    <div class="col-md-4 box-layer">
                                        <h3>Number Fail</h3>
                                        <h4>{(gltDetails && gltDetails.number_fail) || "-"}</h4>
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
const mapStateToProps = state => {
    const { commonReducer } = state;
    return { commonReducer };
};

export default connect(mapStateToProps, { ...commonActions })(GLTDetailsModal);
