import React, { Component } from "react";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import { withRouter } from "react-router-dom";
import _ from "lodash";

import history from "../../../config/history";
import TopSlider from "../../common/components/TopSlider";
import ToastMsg from "../../common/ToastMessage";
import actions from "./actions";
import commonActions from "../actions";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";

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
            selectedFrequency: props.match.params.id,
            initialData: {
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
            showConfirmModal: false
        };
    }

    componentDidMount = async () => {
        const { selectedFrequency } = this.state;
        if (selectedFrequency) {
            await this.props.getFrequencyById(selectedFrequency);
            const {
                frequencyReducer: {
                    getFrequencyByIdResponse: {
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
                    initialData: {
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
            ToastMsg(this.props.frequencyReducer.addFrequencyData.message, "info");
            if (this.props.frequencyReducer.addFrequencyData.success) {
                history.push("/deeming_agencies");
            }
        }
    };

    editFrequency = async () => {
        const { formParams } = this.state;
        if (this.validate()) {
            await this.props.editFrequencyById({ frequency: formParams }, this.props.match.params.id);
            ToastMsg(this.props.frequencyReducer.editFrequencyById.message, "info");
            if (this.props.frequencyReducer.editFrequencyById.success) {
                if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                    history.push(`/frequency/frequencyinfo/${this.props.match.params.id}/basicdetails`);
                } else {
                    history.push("/frequencies");
                }
            }
        }
    };

    cancelForm = async () => {
        if (this.state.showConfirmModal) {
            await this.setState({ showConfirmModal: false });
            if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                history.push(`/frequency/frequencyinfo/${this.props.match.params.id}/basicdetails`);
            } else {
                history.push("/frequencies");
            }
        } else if (_.isEqual(this.state.initialData, this.state.formParams)) {
            if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                history.push(`/frequency/frequencyinfo/${this.props.match.params.id}/basicdetails`);
            } else {
                history.push("/frequencies");
            }
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to clear and lose all changes?"}
                        paragraph={"This action cannot be reverted, are you sure that you need to cancel?"}
                        onCancel={() => this.setState({ showConfirmModal: false })}
                        onOk={this.cancelForm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
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
                                            autoComplete="off"
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
                                            autoComplete="off"
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
                {this.renderConfirmationModal()}
            </section>
        );
    }
}

const mapStateToProps = state => {
    const { frequencyReducer, settingsCommonReducer } = state;
    return { frequencyReducer, settingsCommonReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions, ...commonActions })(editFrequency));
