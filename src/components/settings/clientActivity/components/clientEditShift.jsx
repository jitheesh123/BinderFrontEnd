import React, { Component } from "react";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import DatePicker from "react-date-picker";

import history from "../../../../config/history";
import Portal from "../../../common/components/Portal";
import ToastMsg from "../../../common/ToastMessage";
import FrequencyModel from "../../../common/components/FrequencyModel";
import TopSlider from "../../../common/components/TopSlider";
import commonActions from "../../actions";
import actions from "../actions";
import TimePicker from "react-time-picker";

class addActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formParams: {
                shift_start: "",
                shift_end: "",
                activity_description: null
            },
            errorParams: {
                logbook_id: false,
                edit_form: false
            },
            isEdit: false,
            showErrorBorder: false,
            showFrequencyModal: false,
            selectedActivity: props.match.params.id
        };
    }

    componentDidMount = async () => {
        const { selectedActivity } = this.state;
        if (selectedActivity) {
            await this.props.getClientActivityById(selectedActivity);
            const {
                clientActivityReducer: {
                    getClientActivityByIdResponse: {
                        client_activity: {
                            shift_start,
                            shift_end,
                            activity_description
                        },
                        success
                    }
                }
            } = this.props;
            if (success) {
                await this.setState({
                    formParams: {
                        shift_start,
                        shift_end,
                        activity_description
                    },
                    isEdit: true
                });
            }
        }
    };

    // validate = () => {
    //     const { formParams } = this.state;
    //     let errorParams = {
    //         logbook_id: false,
    //         edit_form: false
    //     };
    //     let showErrorBorder = false;
    //     if (!formParams.logbook_id || !formParams.logbook_id.trim().length) {
    //         errorParams.logbook_id = true;
    //         showErrorBorder = true;
    //     }
    //     if (!formParams.edit_form || !formParams.edit_form.trim().length) {
    //         errorParams.edit_form = true;
    //         showErrorBorder = true;
    //     }
    //     this.setState({
    //         showErrorBorder,
    //         errorParams
    //     });

    //     if (showErrorBorder) return false;
    //     return true;
    // };


    editActivity = async () => {
        const { formParams } = this.state;
        // if (this.validate()) {
        await this.props.editClientShiftActivity(formParams, this.props.match.params.id);
        ToastMsg(this.props.clientActivityReducer.editClientShiftActivityData.message, "info");
        if (this.props.clientActivityReducer.editClientShiftActivityData.success) {
            // if (this.props.location && this.props.location.pathname) {
                history.goBack()
            // } else {
            //     history.push("/clients");
            // }
        }
        // }
    };

    cancelForm = () => {
        // if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
        //     history.push(`/clientActivity/clientActivityInfo/${this.props.match.params.id}/assignedactivities`);
        // } else {
            history.goBack();
        // }
    };

    render() {
        const { logbookIdList, formParams, isEdit, showErrorBorder, errorParams, deeming_agencies, selectedActivity } = this.state;
        return (
            <React.Fragment>
                <section className="cont-ara act-main">
                    <div className="list-area">
                        <ToastContainer />
                        <TopSlider />
                        <div className="lst-bt-nav create">
                            <div className="table table-ara">
                                <div className="list-sec">
                                    <div className="nav-ara">
                                        <div className="head">
                                            <h4>Edit Activity - {(formParams && formParams.activity_description) || ""}</h4>
                                        </div>
                                        {/* <Breadcrumb /> */}
                                    </div>
                                </div>

                                <div className="activity form-area">
                                    <div className="itm">
                                        <div className="form-group">
                                            <label>Shift Start</label>
                                            <TimePicker
                                                className="form-control"
                                                disableClock={true}
                                                onChange={value =>
                                                    typeof value === "string" &&
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            shift_start: value
                                                        }
                                                    })
                                                }
                                                value={formParams.shift_start || 0}
                                            />
                                        </div>
                                    </div>
                                    <div className="itm">
                                        <div className="form-group">
                                            <label>Shift end</label>
                                            <TimePicker
                                                className="form-control"
                                                disableClock={true}

                                                onChange={value =>
                                                    typeof value === "string" &&
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            shift_end: value
                                                        }
                                                    })
                                                }
                                                value={formParams.shift_end || 0}
                                            />
                                        </div>
                                    </div>
                                    {/*                               
                                    {isEdit ? (
                                        <React.Fragment>
                                            <div className="itm">
                                                <div className="form-group calendar">
                                                    <label>Created At</label>
                                                    <input
                                                        type="text"
                                                        disabled="true"
                                                        value={formParams.created_at}
                                                        className="form-control cursor-not-allowed"
                                                        placeholder=" "
                                                    />
                                                    <div className="icon" data-toggle="modal" data-target="#myModal">
                                                        <img src="/images/calendar-gray.svg" alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="itm">
                                                <div className="form-group calendar">
                                                    <label>Updated At</label>
                                                    <input
                                                        type="text"
                                                        disabled="true"
                                                        value={formParams.updated_at}
                                                        className="form-control cursor-not-allowed"
                                                        placeholder=" "
                                                    />
                                                    <div className="icon" data-toggle="modal" data-target="#myModal">
                                                        <img src="/images/calendar-gray.svg" alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    ) : null} */}
                                </div>
                                <div className="btn-sec">
                                    <button className="btn btn-cncl-back mr-2" onClick={() => this.cancelForm()}>
                                        <i className="material-icons tic"> close</i>Cancel
                                    </button>

                                    <button className="btn btn-create" onClick={() => this.editActivity()}>
                                        <i className="material-icons tic"> check</i> Update Activity
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* {this.renderFrequencyModal()} */}
                </section>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { clientActivityReducer, settingsCommonReducer } = state;
    return { clientActivityReducer, settingsCommonReducer };
};

export default connect(mapStateToProps, { ...actions, ...commonActions })(addActivity);
