import React, { Component } from "react";

import Portal from "../Portal";
import GLTDetailsModal from "./GLTDetailsModal";
class GeneratorTestingQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    togglShowGLTDetails = () => {
        const { showGLTDetails } = this.state;
        this.setState({
            showGLTDetails: !showGLTDetails
        });
    };

    renderGLTDetailsModal = () => {
        const { showGLTDetails } = this.state;
        if (!showGLTDetails) return null;
        const { annual_load_bank_event_id } = this.props;
        return (
            <Portal
                body={<GLTDetailsModal onCancel={this.togglShowGLTDetails} survey_date_id={annual_load_bank_event_id} />}
                onCancel={this.togglShowGLTDetails}
            />
        );
    };

    render() {
        const { updateFormPaarams, formParams, isViewOnly = false } = this.props;

        return (
            <React.Fragment>
                <div className="gt-form-questions-container">
                    <div className="gt-form-question">
                        <label className="question-label">1. Did Generator run for 30 minutes?</label>
                        <div className="itm">
                            <div className="chek">
                                <div className="chekbox-sec">
                                    <label className="container">
                                        Yes
                                        <input
                                            type="radio"
                                            name="thirty_min_run"
                                            value="yes"
                                            onChange={e => updateFormPaarams("thirty_min_run", e.target.value)}
                                            checked={formParams.thirty_min_run === "yes"}
                                            disabled={isViewOnly}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                    <label className="container">
                                        No
                                        <input
                                            type="radio"
                                            name="thirty_min_run"
                                            value="no"
                                            onChange={e => updateFormPaarams("thirty_min_run", e.target.value)}
                                            checked={formParams.thirty_min_run === "no"}
                                            disabled={isViewOnly}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="gt-form-question">
                        <label className="question-label">2. Did Transfer occur within less than 10 seconds?</label>
                        <div className="itm">
                            <div className="chek">
                                <div className="chekbox-sec">
                                    <label className="container">
                                        Yes
                                        <input
                                            type="radio"
                                            name="ten_sec_transfer"
                                            value="yes"
                                            onChange={e => updateFormPaarams("ten_sec_transfer", e.target.value)}
                                            checked={formParams.ten_sec_transfer === "yes"}
                                            disabled={isViewOnly}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                    <label className="container">
                                        No
                                        <input
                                            type="radio"
                                            name="ten_sec_transfer"
                                            value="no"
                                            onChange={e => updateFormPaarams("ten_sec_transfer", e.target.value)}
                                            checked={formParams.ten_sec_transfer === "no"}
                                            disabled={isViewOnly}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="gt-form-question">
                        <label className="question-label">3. Did Generator meet 30% Load?</label>
                        <div className="itm">
                            <div className="chek">
                                <div className="chekbox-sec">
                                    <label className="container">
                                        Yes
                                        <input
                                            type="radio"
                                            name="meet_30_percent_load"
                                            value="yes"
                                            onChange={e => updateFormPaarams("meet_30_percent_load", e.target.value)}
                                            checked={formParams.meet_30_percent_load === "yes"}
                                            disabled={isViewOnly}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                    <label className="container">
                                        No
                                        <input
                                            type="radio"
                                            name="meet_30_percent_load"
                                            value="no"
                                            onChange={e => updateFormPaarams("meet_30_percent_load", e.target.value)}
                                            checked={formParams.meet_30_percent_load === "no"}
                                            disabled={isViewOnly}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="gt-form-question gt-form-sub-question cursor-not-allowed">
                        <label className="question-label cursor-not-allowed">3.1. Was ‘Annual Load Bank’ conducted in the last 11 months?</label>
                        {formParams.annual_load_bank_conducted === "yes" ? (
                            <button className="btn btn-details" onClick={() => this.togglShowGLTDetails()}>
                                Details
                            </button>
                        ) : null}
                        <div className={`itm ${formParams.annual_load_bank_conducted === "yes" ? "mr-0" : ""}`}>
                            <div className="chek">
                                <div className="chekbox-sec">
                                    <label className="container cursor-not-allowed">
                                        Yes
                                        <input
                                            type="radio"
                                            name="annual_load_bank_conducted"
                                            value="yes"
                                            onChange={e => updateFormPaarams("annual_load_bank_conducted", e.target.value)}
                                            checked={formParams.annual_load_bank_conducted === "yes"}
                                            disabled={true}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                    <label className="container cursor-not-allowed">
                                        No
                                        <input
                                            type="radio"
                                            name="annual_load_bank_conducted"
                                            value="no"
                                            onChange={e => updateFormPaarams("annual_load_bank_conducted", e.target.value)}
                                            checked={formParams.annual_load_bank_conducted === "no"}
                                            disabled={true}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="gt-form-question">
                        <label className="question-label">4. All Else Passed?</label>
                        <div className="itm">
                            <div className="chek">
                                <div className="chekbox-sec">
                                    <label className="container">
                                        Yes
                                        <input
                                            type="radio"
                                            name="all_else_passed"
                                            value="yes"
                                            onChange={e => updateFormPaarams("all_else_passed", e.target.value)}
                                            checked={formParams.all_else_passed === "yes"}
                                            disabled={isViewOnly}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                    <label className="container">
                                        No
                                        <input
                                            type="radio"
                                            name="all_else_passed"
                                            value="no"
                                            onChange={e => updateFormPaarams("all_else_passed", e.target.value)}
                                            checked={formParams.all_else_passed === "no"}
                                            disabled={isViewOnly}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.renderGLTDetailsModal()}
            </React.Fragment>
        );
    }
}

export default GeneratorTestingQuestions;
