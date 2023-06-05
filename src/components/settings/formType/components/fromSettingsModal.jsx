import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";

import BuildModalHeader from "../../../common/components/BuildModalHeader";
import ToastMsg from "../../../common/ToastMessage";
import actions from "../actions";
import Loader from "../../../common/components/Loader";

class fireDrillsFromSettingsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            settings: null,
            isLoading: true
        };
    }

    componentDidMount = async () => {
        await this.fetchEventFormData();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.selectedForm !== this.props.selectedForm) {
            await this.fetchEventFormData();
        }
    };

    fetchEventFormData = async () => {
        const { selectedForm, path } = this.props;
        await this.props.fetchEventFormData(selectedForm.id, path);
        const {
            formTypeReducer: {
                fetchEventFormDataResponse: {
                    form: { settings }
                }
            }
        } = this.props;
        await this.setState({
            settings,
            isLoading: false
        });
    };

    updateEventForms = async () => {
        const { settings } = this.state;
        const { selectedForm, path } = this.props;

        let event_form = { event_form: { settings: settings } };
        if (path === "building_event_forms") {
            event_form = { building_event_form: { settings: settings } };
        }
        if (path === "client_event_forms") {
            event_form = { client_event_form: { settings: settings } };
        }

        await this.props.updateEventForms(event_form, selectedForm.id, path);
        const {
            formTypeReducer: {
                updateEventFormsResponse: { message }
            }
        } = this.props;
        ToastMsg(message, "info");
        this.props.onCancel();
    };

    render() {
        const { settings, isLoading } = this.state;
        const { onCancel, selectedForm } = this.props;
        return (
            <React.Fragment>
                <div className="modal activity-event-modal form-settings-modal" role="dialog" style={{ display: "block" }} id="modalId">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader title={`${selectedForm.name} From Settings`} onCancel={onCancel} modalClass="form-settings-modal" />
                            <div className="modal-body">
                                <div className="aep-tab-contents">
                                    <div className="box-form-sec">
                                        {settings && !_.isEmpty(settings) ? (
                                            Object.keys(settings).map(key => (
                                                <div className="col-md-12 form-itm p-0">
                                                    <div className="min-width-150">
                                                        <label className="">{key}</label>
                                                    </div>
                                                    {Object.keys(settings[key]).map(config => (
                                                        <div className={`itm itm-check ${key}_${config}`}>
                                                            <div className="custom-control custom-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    onClick={async e => {
                                                                        await this.setState({
                                                                            settings: {
                                                                                ...settings,
                                                                                [key]: {
                                                                                    ...settings[key],
                                                                                    [config]: settings[key][config] ? false : true
                                                                                }
                                                                            }
                                                                        });
                                                                        if (config === "visible") {
                                                                            this.setState({
                                                                                settings: {
                                                                                    ...this.state.settings,
                                                                                    [key]: {
                                                                                        ...this.state.settings[key],
                                                                                        required: settings[key][config] ? false : true
                                                                                    }
                                                                                }
                                                                            });
                                                                        }
                                                                    }}
                                                                    checked={settings[key][config] ? true : false}
                                                                    className="custom-control-input"
                                                                    id={`${key}_${config}`}
                                                                    disabled={config === "required"}
                                                                    name="example1"
                                                                />
                                                                <label className="custom-control-label" for={`${key}_${config}`}>
                                                                    {config}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))
                                        ) : isLoading ? (
                                            <Loader />
                                        ) : (
                                            <div className="coming-soon-layer col-md-12">
                                                <div className="lst-bt-nav fire-sytem-otr">
                                                    <div className="col-md-12 coming-soon-outer">
                                                        <div className="coming-soon-img">
                                                            <img src="/images/coming-soon.svg" alt="" />
                                                        </div>
                                                        <h3>COMING SOON</h3>
                                                        <h4>The page is in under Construction</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="btn-sec btn-survey-sec">
                                    <div className="btn-out-1">
                                        <button className="btn btn-create save mr-2 hide-on-view-only" onClick={() => this.updateEventForms()}>
                                            <i className="material-icons tic"> check</i> Save
                                        </button>

                                        <button className="btn btn-cncl-back ml-2" onClick={() => onCancel()}>
                                            <i className="material-icons tic"> close</i>Cancel
                                        </button>
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
    const { formTypeReducer } = state;
    return { formTypeReducer };
};

export default connect(mapStateToProps, { ...actions })(fireDrillsFromSettingsModal);
