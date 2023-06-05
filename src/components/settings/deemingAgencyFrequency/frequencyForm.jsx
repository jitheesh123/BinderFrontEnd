import React, { Component } from "react";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import { withRouter } from "react-router-dom";

import history from "../../../config/history";
import TopSlider from "../../common/components/TopSlider";
import ToastMsg from "../../common/ToastMessage";
import actions from "./actions";
import commonActions from "../actions";

class editFrequency extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consultancyIdList: [],
            clientIdList: [],
            formParams: {
                name: "",
                completion_threshold: 0,
                email_threshold: null,
                test_frequency: "",
                performance_window: "",
                recurrence: "",
                window: "",
                interval: "",
                interval_type: ""
            },
            errorParams: {
                name: false,
                consultancy_id: false,
                client_id: false
            },
            isEdit: false,
            showErrorBorder: false,
            selectedFrequency: props.match.params.id
        };
    }

    componentDidMount = async () => {
        const { selectedFrequency } = this.state;
        if (selectedFrequency) {
            await this.props.getDeemingAgencyFrequencyById(selectedFrequency);
            const {
                deemingAgencyFrequencyReducer: {
                    getDeemingAgencyFrequencyByIdResponse: {
                        frequency: {
                            name,
                            interval_type,
                            completion_threshold,
                            email_threshold,
                            test_frequency,
                            performance_window,
                            window,
                            recurrence,
                            interval
                        },
                        success
                    }
                }
            } = this.props;
            if (success) {
                await this.setState({
                    formParams: {
                        name,
                        interval_type,
                        completion_threshold,
                        email_threshold,
                        test_frequency,
                        recurrence,
                        performance_window,
                        window,
                        interval
                    },
                    isEdit: true
                });
            }
        }
    };

    validate = () => {
        const { formParams } = this.state;
        let errorParams = {
            name: false,
            consultancy_id: false,
            client_id: false
        };
        let showErrorBorder = false;
        if (!formParams.name || !formParams.name.trim().length) {
            errorParams.name = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });

        if (showErrorBorder) return false;
        return true;
    };

    addFrequency = async () => {
        const { formParams } = this.state;
        if (this.validate()) {
            await this.props.addFrequency({ deeming_agency: formParams });
            ToastMsg(this.props.deemingAgencyFrequencyReducer.addFrequencyData.message, "info");
            if (this.props.deemingAgencyFrequencyReducer.addFrequencyData.success) {
                history.push("/deeming_agencies");
            }
        }
    };

    editFrequency = async () => {
        const { formParams } = this.state;
        let previousPath = this.props.location && this.props.location.state && this.props.location.state.prevPath;
        let beforePrevPath = this.props.location && this.props.location.state && this.props.location.state.beforePrevPath;
        if (this.validate()) {
            await this.props.editDeemingAgencyFrequency({ deeming_agency_frequency: formParams }, this.props.match.params.id);
            ToastMsg(this.props.deemingAgencyFrequencyReducer.editDeemingAgencyFrequencyData.message, "info");
            if (this.props.deemingAgencyFrequencyReducer.editDeemingAgencyFrequencyData.success) {
                if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                    history.push(previousPath || `/deemingAgencyFrequency/deemingAgencyFrequencyInfo/${this.props.match.params.id}/basicdetails`, {
                        prevPath: beforePrevPath
                    });
                } else {
                    history.push(previousPath || "/deeming_agencies");
                }
            }
        }
    };

    cancelForm = () => {
        let previousPath = this.props.location && this.props.location.state && this.props.location.state.prevPath;
        let beforePrevPath = this.props.location && this.props.location.state && this.props.location.state.beforePrevPath;
        if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
            history.push(`/deemingAgencyFrequency/deemingAgencyFrequencyInfo/${this.props.match.params.id}/basicdetails`, {
                prevPath: beforePrevPath
            });
        } else {
            history.push(previousPath || "/deeming_agencies");
        }
    };

    render() {
        const { formParams, errorParams, showErrorBorder, selectedFrequency } = this.state;
        return (
            <section className="cont-ara act-main">
                <div className="list-area">
                    <ToastContainer />
                    <TopSlider />
                    <div className="lst-bt-nav create">
                        <div className="table table-ara">
                            <div className="list-sec">
                                <div className="nav-ara">
                                    <div className="head">
                                        <h4>{selectedFrequency ? "Edit" : "Add"} Frequency</h4>
                                    </div>
                                    {/* <Breadcrumb /> */}
                                </div>
                            </div>
                            <div className="form-area">
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label className={showErrorBorder && errorParams.name ? "text-red" : ""}>Frequency Name *</label>
                                        <input
                                            type="text"
                                            id="text"
                                            value={formParams.name}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        name: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Enter Name"
                                        />
                                    </div>
                                </div>
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label>Performance Window</label>
                                        <input
                                            type="text"
                                            id="text"
                                            disabled={true}
                                            value={formParams.performance_window}
                                            className="form-control  cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label>Window</label>
                                        <input
                                            type="text"
                                            id="text"
                                            disabled={true}
                                            value={formParams.window}
                                            className="form-control  cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label>Recurrence in a Year</label>
                                        <input
                                            type="text"
                                            id="text"
                                            disabled={true}
                                            value={formParams.recurrence}
                                            className="form-control  cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label>Interval</label>
                                        <input
                                            type="text"
                                            id="text"
                                            disabled={true}
                                            value={formParams.interval}
                                            className="form-control  cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label>Interval Type</label>
                                        <input
                                            type="text"
                                            id="text"
                                            disabled={true}
                                            value={formParams.interval_type}
                                            className="form-control  cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label>Test Frequency</label>
                                        <input
                                            type="text"
                                            value={formParams.test_frequency}
                                            className="form-control"
                                            onChange={e =>
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        test_frequency: e.target.value
                                                    }
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label>Completion Threshold</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control"
                                            placeholder=" "
                                            value={formParams.completion_threshold}
                                            onChange={e =>
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        completion_threshold: e.target.value
                                                    }
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="itm  col-md-3">
                                    <div className="form-group">
                                        <label>Email Threshold</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control"
                                            placeholder=" "
                                            value={formParams.email_threshold}
                                            onChange={e =>
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        email_threshold: e.target.value
                                                    }
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="btn-sec">
                                <button className="btn btn-cncl-back mr-2" onClick={() => this.cancelForm()}>
                                    <i className="material-icons tic"> close</i>Cancel
                                </button>
                                {selectedFrequency ? (
                                    <button className="btn btn-create" onClick={() => this.editFrequency()}>
                                        <i className="material-icons tic"> check</i> Update Frequency
                                    </button>
                                ) : (
                                    <button className="btn btn-create" onClick={() => this.addFrequency()}>
                                        <i className="material-icons tic"> check</i> Add Frequency
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

const mapStateToProps = state => {
    const { deemingAgencyFrequencyReducer, settingsCommonReducer } = state;
    return { deemingAgencyFrequencyReducer, settingsCommonReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions, ...commonActions })(editFrequency));
