import React, { Component } from "react";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import DatePicker from "react-date-picker";
import _ from "lodash";

import history from "../../../config/history";
import Portal from "../../common/components/Portal";
import ToastMsg from "../../common/ToastMessage";
import FrequencyModel from "../../common/components/FrequencyModel";
import TopSlider from "../../common/components/TopSlider";
import commonActions from "../actions";
import actions from "./actions";
import { RRule } from "rrule";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import TimePicker from "react-time-picker";


class addActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventFormList: [],
            consultancy_id: null,
            client_id: null,
            consultancyIdList: [],
            clientIdList: [],
            logbookIdList: [],
            deeming_agencies: [],
            formParams: {
                code: "",
                activity_type: null,
                display_order: null,
                standard: null,
                activity_description: null,
                activity_text: null,
                activity_tooltip: null,
                frequency: null,
                test_frequency: null,
                interval_type: null,
                completion_threshold: 0,
                email_threshold: null,
                code_reference: null,
                code_reference_tooltip: null,
                quarterly_view: "no",
                edit_form: null,
                default_total_devices: "0",
                start_date: null,
                end_date: null,
                logbook_id: null,
                is_active: "yes",
                deeming_agency_id: null,
                flexible_date_calculation: "",
                standard_tooltip: "",
                parent: "Asset",
                can_be_linked: "no",
                linked_activity_id: null,
                category: null,
                shift: null,
                shift_start: "",
                shift_end: ""
            },
            errorParams: {
                logbook_id: false,
                activity_description: false,
                frequency: false,
                parent: false,
                edit_form: false
            },
            isEdit: false,
            showErrorBorder: false,
            showFrequencyModal: false,
            freequencyInterval: "0",
            selectedActivity: props.match.params.id,
            deeming_agency_frequencies: [],
            frequencyList: [
                { name: "Year", key: "YEARLY", value: 0 },
                { name: "Month", key: "MONTHLY", value: 1 },
                { name: "Week", key: "WEEKLY", value: 2 },
                { name: "Day", key: "DAILY", value: 3 },
                { name: "Hour", key: "HOURLY", value: 4 }
            ],
            showConfirmModal: false,
            linkedActivityList: [],
            categories: [],
            logbookType: null,

        };
    }

    componentDidMount = async () => {
        const { selectedActivity } = this.state;
        await this.getLogbookDropDown();
        await this.getEventFormDropDown();
        await this.props.getDeemingAgencyDropdown();
        await this.props.getCategoryDropdown();
        const {
            activityReducer: {
                getCategoryDropdownResponse: { categories = [] }
            }
        } = this.props;
        await this.setState({
            deeming_agencies: this.props.settingsCommonReducer.deemingAgencyDropdownData.data,
            logbookIdList: this.props.settingsCommonReducer.logbookDropdownData.data,
            categories
        });
        if (selectedActivity) {
            await this.props.getActivityById(selectedActivity);
            const {
                activityReducer: {
                    getActivityByIdResponse: {
                        activity: {
                            code,
                            activity_type,
                            display_order,
                            standard,
                            activity_description,
                            activity_text,
                            activity_tooltip,
                            frequency,
                            deeming_agency_frequency,
                            test_frequency,
                            interval_type,
                            completion_threshold,
                            email_threshold,
                            code_reference,
                            code_reference_tooltip,
                            quarterly_view,
                            edit_form,
                            default_total_devices,
                            start_date,
                            end_date,
                            logbook,
                            is_active,
                            type,
                            deeming_agency,
                            flexible_date_calculation,
                            standard_tooltip,
                            parent,
                            can_be_linked,
                            linked_activity,
                            category,
                            shift,
                            shift_start,
                            shift_end
                        },
                        success
                    }
                }
            } = this.props;
            if (success) {
                await this.getLinkedActivityList(logbook.id, deeming_agency.id);
                await this.setLogbookType(logbook.id);
                await this.onDeeminAgencySelect(deeming_agency.id || "");
                await this.onDeeminAgencyFrequencySelect(deeming_agency_frequency.id || "");
                await this.setState({
                    formParams: {
                        activity_type: type,
                        code,
                        display_order,
                        standard,
                        deeming_agency_frequency_id: deeming_agency_frequency.id,
                        activity_description,
                        activity_text,
                        activity_tooltip,
                        frequency,
                        test_frequency,
                        interval_type,
                        completion_threshold,
                        email_threshold,
                        code_reference,
                        code_reference_tooltip,
                        quarterly_view,
                        edit_form,
                        default_total_devices,
                        start_date: start_date ? new Date(start_date) : "",
                        end_date: end_date ? new Date(end_date) : "",
                        is_active,
                        logbook_id: logbook.id,
                        deeming_agency_id: deeming_agency.id || "",
                        flexible_date_calculation,
                        standard_tooltip,
                        parent,
                        can_be_linked,
                        linked_activity_id: linked_activity.id || "",
                        category,
                        shift,
                        shift_start,
                        shift_end

                    },
                    isEdit: true
                });
            }
        }
        await this.setInitialFromParams();
    };

    setInitialFromParams = async () => {
        const { formParams } = this.state;
        await this.setState({
            initialData: formParams
        });
        return true;
    };

    getLinkedActivityList = async (logbook_id, deeming_agency_id) => {
        if (logbook_id && deeming_agency_id) {
            await this.props.getLinkedActivityList(logbook_id, deeming_agency_id);
            const {
                activityReducer: {
                    getLinkedActivityListResponse: { activities, success }
                }
            } = this.props;
            await this.setState({
                linkedActivityList: activities
            });
        }
    };

    renderFrequencyModal = () => {
        const { showFrequencyModal, formParams, freequencyInterval } = this.state;
        if (!showFrequencyModal) return null;
        return (
            <Portal
                body={
                    <FrequencyModel
                        onCancel={this.toggleShowFrequencyModal}
                        setFrequencyData={this.setFrequencyData}
                        frequency={formParams.frequency}
                        freequencyInterval={freequencyInterval}
                        test_frequency={formParams.test_frequency}
                        isEdit={formParams.deeming_agency_frequency_id ? true : false}
                        type={formParams.deeming_agency_frequency_id ? "view" : "form"}
                    />
                }
                onCancel={this.toggleShowFrequencyModal}
            />
        );
    };

    toggleShowFrequencyModal = () => {
        const { showFrequencyModal } = this.state;
        this.setState({
            showFrequencyModal: !showFrequencyModal
        });
    };

    setFrequencyData = (frequency, test_frequency) => {
        const { formParams } = this.state;
        this.setState({
            formParams: {
                ...formParams,
                frequency,
                test_frequency
            }
        });
    };

    getLogbookDropDown = async client_id => {
        await this.props.getLogbookDropdown({ client_id });
        await this.setState({
            logbookIdList: this.props.settingsCommonReducer.logbookDropdownData.data
        });
        return true;
    };

    getEventFormDropDown = async () => {
        await this.props.getEventFormDropDown();
        await this.setState({
            eventFormList:
                (this.props.settingsCommonReducer.getEventFormDropDownData.data &&
                    this.props.settingsCommonReducer.getEventFormDropDownData.data.forms) ||
                []
        });
        return true;
    };

    getClientDropDown = async consultancy_id => {
        await this.props.getClientDropdown({ consultancy_id });
        await this.setState({
            clientIdList: this.props.settingsCommonReducer.clientDropdownData.data
        });
        return true;
    };

    selectConsultancyId = async consultancy_id => {
        const { formParams } = this.state;
        await this.setState({
            formParams: {
                ...formParams,
                consultancy_id,
                client_id: null
            }
        });
        this.getClientDropDown(consultancy_id);
    };

    validate = () => {
        const { formParams } = this.state;
        let errorParams = {
            logbook_id: false,
            activity_description: false,
            frequency: false,
            edit_form: false,
            parent: false
        };
        let showErrorBorder = false;
        if (!formParams.logbook_id || !formParams.logbook_id.trim().length) {
            errorParams.logbook_id = true;
            showErrorBorder = true;
        }
        if (!formParams.frequency || !formParams.frequency.trim().length) {
            errorParams.frequency = true;
            showErrorBorder = true;
        }
        if (!formParams.activity_description || !formParams.activity_description.trim().length) {
            errorParams.activity_description = true;
            showErrorBorder = true;
        }
        if (!formParams.edit_form || !formParams.edit_form.trim().length) {
            errorParams.edit_form = true;
            showErrorBorder = true;
        }
        if (!formParams.parent || !formParams.parent.trim().length) {
            errorParams.parent = true;
            showErrorBorder = true;
        }
        if (formParams.deeming_agency_id && (!formParams.deeming_agency_frequency_id || !formParams.deeming_agency_frequency_id.trim().length)) {
            errorParams.deeming_agency_frequency_id = true;
            showErrorBorder = true;
        }
        if (formParams.deeming_agency_id && (!formParams.flexible_date_calculation || !formParams.flexible_date_calculation.trim().length)) {
            errorParams.flexible_date_calculation = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });

        if (showErrorBorder) return false;
        return true;
    };

    addActivity = async () => {
        const { formParams } = this.state;
        let previousPath = this.props.location && this.props.location.state && this.props.location.state.prevPath;
        if (this.validate()) {
            await this.props.addActivity(formParams);
            ToastMsg(this.props.activityReducer.addActivityData.message, "info");
            if (this.props.activityReducer.addActivityData.success) {
                history.push(previousPath || "/activities");
            }
        }
    };

    editActivity = async () => {
        const { formParams } = this.state;
        let previousPath = this.props.location && this.props.location.state && this.props.location.state.prevPath;
        let beforePrevPath = this.props.location && this.props.location.state && this.props.location.state.beforePrevPath;
        if (this.validate()) {
            await this.props.editActivity(formParams, this.props.match.params.id);
            ToastMsg(this.props.activityReducer.editActivityData.message, "info");
            if (this.props.activityReducer.editActivityData.success) {
                if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                    history.push(previousPath || `/activity/activityinfo/${this.props.match.params.id}/basicdetails`, { prevPath: beforePrevPath });
                } else {
                    history.push(previousPath || "/activities");
                }
            }
        }
    };

    onDeeminAgencySelect = async (deeming_agency_id, standard_prefix) => {
        const { formParams, deeming_agencies } = this.state;
        let tempDeemingAgency = deeming_agencies.length ? deeming_agencies.filter(item => item.id === deeming_agency_id) : [];
        await this.props.getFrequencyDropdown({ deeming_agency_id });
        await this.getLinkedActivityList(formParams.logbook_id, deeming_agency_id);
        await this.setState({
            deeming_agency_frequencies: this.props.settingsCommonReducer.getFrequencyDropdownResponse.data || [],
            formParams: {
                ...formParams,
                deeming_agency_frequency_id: null,
                deeming_agency_id,
                flexible_date_calculation: "",
                standard: tempDeemingAgency.length ? tempDeemingAgency[0].standard_prefix : ""
            }
        });
    };

    onDeeminAgencyFrequencySelect = async deeming_agency_frequency_id => {
        const { formParams, deeming_agency_frequencies, frequencyList } = this.state;
        let tempSelectedDeemingFrequency = deeming_agency_frequencies.find(item => item.id === deeming_agency_frequency_id);
        let tempFrequency = "";
        // if (deeming_agency_frequency_id) {
        //     let tempIntervalType = frequencyList.find(i => i.name === tempSelectedDeemingFrequency.interval_type);
        //     let rRuleGen = {
        //         freq: RRule[tempIntervalType.key],
        //         interval: tempSelectedDeemingFrequency.interval || "",
        //         wkst: RRule.MO,
        //         byweekday: [],
        //         bymonth: []
        //     };
        //     const rule = new RRule(rRuleGen);
        //     tempFrequency = rule.toString();
        // }
        if (tempSelectedDeemingFrequency) {
            let tempIntervalType = frequencyList.find(i => i.name === tempSelectedDeemingFrequency.interval_type);
            let rRuleGen = {
                freq: RRule[tempIntervalType.key],
                interval: tempSelectedDeemingFrequency.interval || "",
                wkst: RRule.MO,
                byweekday: [],
                bymonth: []
            };
            const rule = new RRule(rRuleGen);
            tempFrequency = rule.toString();
            await this.setState({
                formParams: {
                    ...formParams,
                    completion_threshold: tempSelectedDeemingFrequency.completion_threshold,
                    email_threshold: tempSelectedDeemingFrequency.email_threshold,
                    interval_type: tempSelectedDeemingFrequency.interval_type,
                    test_frequency: tempSelectedDeemingFrequency.test_frequency,
                    deeming_agency_frequency_id,
                    flexible_date_calculation: "",
                    frequency: tempFrequency || ""
                },
                freequencyInterval: tempSelectedDeemingFrequency.interval
            });
        } else {
            await this.setState({
                formParams: {
                    ...formParams,
                    completion_threshold: 0,
                    email_threshold: 0,
                    interval_type: "",
                    test_frequency: "",
                    deeming_agency_frequency_id,
                    flexible_date_calculation: ""
                },
                freequencyInterval: "0"
            });
        }
    };

    cancelForm = async () => {
        let previousPath = this.props.location && this.props.location.state && this.props.location.state.prevPath;
        let beforePrevPath = this.props.location && this.props.location.state && this.props.location.state.beforePrevPath;
        if (this.state.showConfirmModal) {
            await this.setState({ showConfirmModal: false });
            if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                history.push(`/activity/activityinfo/${this.props.match.params.id}/basicdetails`, { prevPath: beforePrevPath });
            } else {
                history.push(previousPath || "/activities");
            }
        } else if (_.isEqual(this.state.initialData, this.state.formParams)) {
            if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                history.push(`/activity/activityinfo/${this.props.match.params.id}/basicdetails`, { prevPath: beforePrevPath });
            } else {
                history.push(previousPath || "/activities");
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

    setLogbookType = async logbookId => {
        const { logbookIdList } = this.state;
        let logbookType = logbookIdList.find(item => item.id === logbookId) && logbookIdList.find(item => item.id === logbookId).logbook_type;
        await this.setState({
            logbookType
        });
    };
    // onKeyPress = (e) => {
    //     if (e.keyCode === 13 && e.shiftKey) {
    //        e.preventDefault();
    //        let start = e.target.selectionStart,
    //            end = e.target.selectionEnd;
    //        this.setState(prevState => ({ 

    //         ...prevState,
    //               formParams: {
    //                   ...prevState.formParams,
    //                   standard: 
    //                      prevState.formParams.standard.substring(0, start)
    //                      + '\n' +
    //                      prevState.formParams.standard.substring(end)
    //               }
    //        }),()=>{
    //            this.input.selectionStart = this.input.selectionEnd = start + 1;
    //        })
    //    }else if (e.keyCode === 13) { // block enter
    //      e.preventDefault();
    //    }

    //  };

    render() {
        const {
            logbookIdList,
            formParams,
            isEdit,
            showErrorBorder,
            errorParams,
            deeming_agencies,
            selectedActivity,
            deeming_agency_frequencies,
            eventFormList,
            linkedActivityList,
            categories,
            logbookType
        } = this.state;
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
                                            <h4>Push  Activity</h4>
                                        </div>
                                        {/* <Breadcrumb /> */}
                                    </div>
                                </div>
                                <div className="activity form-area">
                                    {selectedActivity ? (
                                        <div className="itm">
                                            <div className="form-group">
                                                <label>Code</label>
                                                <input type="text" className="form-control" placeholder="" value={formParams.code} disabled={true} />
                                            </div>
                                        </div>
                                    ) : null}
                                    <div className="itm">
                                        <div className="form-group calendar">
                                            <label className={showErrorBorder && errorParams.logbook_id ? "text-red" : ""}>Logbook *</label>
                                            <div className="custom-selecbox">
                                                <select
                                                    className="custom-selecbox form-control"
                                                    value={formParams.logbook_id}
                                                    onChange={async e => {
                                                        this.setState({
                                                            formParams: {
                                                                ...formParams,
                                                                logbook_id: e.target.value
                                                            },
                                                            logbookType: e.target.logbookType
                                                        });
                                                        await this.setLogbookType(e.target.value);
                                                        await this.getLinkedActivityList(formParams.logbook_id, formParams.deeming_agency_id);
                                                    }}
                                                >
                                                    <option value="">Select</option>
                                                    {logbookIdList.length &&
                                                        logbookIdList.map((item, idex) => {
                                                            return (
                                                                <option key={idex} value={item.id} logbookType={item.logbook_type || "null"}>
                                                                    {item.name}
                                                                </option>
                                                            );
                                                        })}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="itm">
                                        <div className="form-group">
                                            <label className={`form-control-placeholder`}>Deeming Agency</label>
                                            <div className="custom-selecbox">
                                                <select
                                                    className="custom-selecbox form-control"
                                                    value={formParams.deeming_agency_id}
                                                    onChange={e => this.onDeeminAgencySelect(e.target.value, e.target.name)}
                                                >
                                                    <option value="">Select</option>
                                                    {deeming_agencies.length &&
                                                        deeming_agencies.map((item, idex) => {
                                                            return (
                                                                <option key={idex} name={idex + "k"} value={item.id}>
                                                                    {item.name}
                                                                </option>
                                                            );
                                                        })}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="itm">
                                        <div className="form-group">
                                            <label className={showErrorBorder && errorParams.parent ? "text-red" : ""}>Parent *</label>
                                            <div className="custom-selecbox">
                                                <select
                                                    className="custom-selecbox form-control"
                                                    value={formParams.parent}
                                                    onChange={e =>
                                                        this.setState({
                                                            formParams: {
                                                                ...formParams,
                                                                parent: e.target.value
                                                            }
                                                        })
                                                    }
                                                >
                                                    <option value="Asset">Asset</option>
                                                    <option value="Building">Building</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    {formParams.deeming_agency_id ? (
                                        <div className="itm">
                                            <div className="form-group">
                                                <label
                                                    className={`${showErrorBorder && errorParams.deeming_agency_frequency_id
                                                        ? "text-red"
                                                        : "form-control-placeholder"
                                                        }`}
                                                >
                                                    Deeming Agency Frequency *
                                                </label>
                                                <div className="custom-selecbox">
                                                    <select
                                                        className="custom-selecbox form-control"
                                                        value={formParams.deeming_agency_frequency_id}
                                                        onChange={e => this.onDeeminAgencyFrequencySelect(e.target.value)}
                                                    >
                                                        <option value="">Select</option>
                                                        {deeming_agency_frequencies.length &&
                                                            deeming_agency_frequencies.map((item, idex) => {
                                                                return (
                                                                    <option key={idex} value={item.id}>
                                                                        {item.name}
                                                                    </option>
                                                                );
                                                            })}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                    {formParams.deeming_agency_id ? (
                                        <div className="itm">
                                            <div className="form-group">
                                                <label
                                                    className={`${showErrorBorder && errorParams.flexible_date_calculation
                                                        ? "text-red"
                                                        : "form-control-placeholder"
                                                        }`}
                                                >
                                                    Flexible Date Calculation *
                                                </label>
                                                <div className="custom-selecbox">
                                                    <select
                                                        className="custom-selecbox form-control"
                                                        value={formParams.flexible_date_calculation}
                                                        onChange={e =>
                                                            this.setState({
                                                                formParams: {
                                                                    ...formParams,
                                                                    flexible_date_calculation: e.target.value
                                                                }
                                                            })
                                                        }
                                                    >
                                                        <option value="">Select</option>
                                                        {formParams.deeming_agency_frequency_id ? (
                                                            <>
                                                                <option value="Frequency and Threshold">Frequency and Threshold</option>
                                                                <option value="Window and Threshold">Window and Threshold</option>
                                                                <option value="Window and Month Threshold">Window and Month Threshold</option>
                                                            </>
                                                        ) : null}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                    <div className="itm">
                                        <div className="form-group">
                                            <label className={showErrorBorder && errorParams.edit_form ? "text-red" : ""}>Event Form *</label>
                                            <div className="custom-selecbox">
                                                <select
                                                    className="custom-selecbox form-control"
                                                    value={formParams.edit_form}
                                                    onChange={e =>
                                                        this.setState({
                                                            formParams: {
                                                                ...formParams,
                                                                edit_form: e.target.value
                                                            }
                                                        })
                                                    }
                                                >
                                                    <option value="">Select</option>
                                                    {eventFormList && eventFormList.length
                                                        ? eventFormList.map(item => <option value={item.name}>{item.name}</option>)
                                                        : null}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="itm">
                                        <div className="form-group">
                                            <label>Activity Type</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder=" "
                                                value={formParams.activity_type}
                                                onChange={e =>
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            activity_type: e.target.value
                                                        }
                                                    })
                                                }
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                    <div className="itm">
                                        <div className="form-group">
                                            <label>Standard</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder=" "
                                                value={formParams.standard}
                                                onChange={e =>
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            standard: e.target.value
                                                        }
                                                    })
                                                }
                                                autoComplete="off"
                                            // ref={(input)=> this.input = input}
                                            // onKeyDown={this.onKeyPress}
                                            />
                                        </div>
                                    </div>
                                    <div className="itm wid-50">
                                        <div className="form-group">
                                            <label>Standard Tooltip</label>
                                            <textarea
                                                className="form-control"
                                                placeholder=" "
                                                value={formParams.standard_tooltip}
                                                onChange={e =>
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            standard_tooltip: e.target.value
                                                        }
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="itm">
                                        <div className="form-group">
                                            <label className={showErrorBorder && errorParams.activity_description ? "text-red" : ""}>
                                                Activity Description *
                                            </label>
                                            <textarea
                                                className="form-control"
                                                placeholder=" "
                                                value={formParams.activity_description}
                                                onChange={e =>
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            activity_description: e.target.value
                                                        }
                                                    })
                                                }
                                                onBlur={e => {
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            activity_text: !formParams.activity_text ? e.target.value : formParams.activity_text,
                                                            activity_tooltip: !formParams.activity_tooltip
                                                                ? e.target.value
                                                                : formParams.activity_tooltip
                                                        }
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="itm">
                                        <div className="form-group">
                                            <label>Activity text</label>
                                            <textarea
                                                className="form-control"
                                                placeholder=" "
                                                value={formParams.activity_text}
                                                onChange={e =>
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            activity_text: e.target.value
                                                        }
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="itm wid-50">
                                        <div className="form-group">
                                            <label>Activity Tooltip</label>
                                            <textarea
                                                className="form-control"
                                                placeholder=" "
                                                value={formParams.activity_tooltip}
                                                onChange={e =>
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            activity_tooltip: e.target.value
                                                        }
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="itm">
                                        <div className="form-group">
                                            <label>Code Reference</label>
                                            <textarea
                                                className="form-control"
                                                placeholder=" "
                                                value={formParams.code_reference}
                                                onChange={e =>
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            code_reference: e.target.value
                                                        }
                                                    })
                                                }
                                                onBlur={e => {
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            code_reference_tooltip: !formParams.code_reference_tooltip
                                                                ? e.target.value
                                                                : formParams.code_reference_tooltip
                                                        }
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="itm wid-50">
                                        <div className="form-group">
                                            <label>Code Reference Tooltip</label>
                                            <textarea
                                                className="form-control"
                                                placeholder=" "
                                                value={formParams.code_reference_tooltip}
                                                onChange={e =>
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            code_reference_tooltip: e.target.value
                                                        }
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="itm">
                                        <div className="form-group">
                                            <label className={showErrorBorder && errorParams.frequency ? "text-red" : ""}>Frequency *</label>
                                            <button className="btn btn-frqy" onClick={() => this.toggleShowFrequencyModal()}>
                                                {formParams.deeming_agency_frequency_id ? "View Frequency" : "Set Frequency"}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="itm">
                                        <div className="form-group">
                                            <label>Test Frequency</label>
                                            <input
                                                type="text"
                                                disabled={true}
                                                className="form-control cursor-not-allowed"
                                                value={formParams.test_frequency}
                                            />
                                        </div>
                                    </div>
                                    <div className="itm">
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
                                    <div className="itm">
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
                                    <div className="itm">
                                        <div className="form-group">
                                            <label>Quarterly View</label>
                                            <div className="custom-selecbox">
                                                <select
                                                    className="custom-selecbox form-control"
                                                    value={formParams.quarterly_view}
                                                    onChange={e =>
                                                        this.setState({
                                                            formParams: {
                                                                ...formParams,
                                                                quarterly_view: e.target.value
                                                            }
                                                        })
                                                    }
                                                >
                                                    <option value="">Select</option>
                                                    <option value="yes">YES</option>
                                                    <option value="no">NO</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="itm">
                                        <div className="form-group">
                                            <label>Default Total Devices</label>
                                            <input
                                                type="number"
                                                min="0"
                                                className="form-control"
                                                placeholder=" "
                                                value={formParams.default_total_devices}
                                                onChange={e =>
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            default_total_devices: e.target.value
                                                        }
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="itm">
                                        <div className="form-group calendar">
                                            <label>Valid From</label>
                                            <DatePicker
                                                className="form-control"
                                                onChange={value => {
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            start_date: value
                                                        }
                                                    });
                                                }}
                                                value={formParams.start_date && new Date(formParams.start_date)}
                                            />
                                        </div>
                                    </div>
                                    <div className="itm">
                                        <div className="form-group calendar">
                                            <label>Valid To</label>
                                            <DatePicker
                                                className="form-control"
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
                                    <div className="itm">
                                        <div className="form-group">
                                            <label>Display Order</label>
                                            <input
                                                type="number"
                                                min="0"
                                                className="form-control"
                                                placeholder=" "
                                                value={formParams.display_order}
                                                onChange={e =>
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            display_order: e.target.value
                                                        }
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="itm">
                                        <div className="form-group">
                                            <label>Is Active</label>
                                            <div className="custom-selecbox">
                                                <select
                                                    className="custom-selecbox form-control"
                                                    value={formParams.is_active}
                                                    onChange={e =>
                                                        this.setState({
                                                            formParams: {
                                                                ...formParams,
                                                                is_active: e.target.value
                                                            }
                                                        })
                                                    }
                                                >
                                                    <option value="yes">YES</option>
                                                    <option value="no">NO</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="itm">
                                        <div className="form-group">
                                            <label>Can Be Linked?</label>
                                            <div className="custom-selecbox">
                                                <select
                                                    className="custom-selecbox form-control"
                                                    value={formParams.can_be_linked}
                                                    onChange={e =>
                                                        this.setState({
                                                            formParams: {
                                                                ...formParams,
                                                                can_be_linked: e.target.value,
                                                                linked_activity_id: e.target.value === "no" ? null : formParams.linked_activity_id
                                                            }
                                                        })
                                                    }
                                                >
                                                    <option value="yes">YES</option>
                                                    <option value="no">NO</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    {formParams.can_be_linked === "no" ? (
                                        <div className="itm">
                                            <div className="form-group">
                                                <label>Linked Activity</label>
                                                <div className="custom-selecbox">
                                                    <select
                                                        className="custom-selecbox form-control"
                                                        value={formParams.linked_activity_id}
                                                        onChange={e =>
                                                            this.setState({
                                                                formParams: {
                                                                    ...formParams,
                                                                    linked_activity_id: e.target.value
                                                                }
                                                            })
                                                        }
                                                    >
                                                        <option value="">Select</option>
                                                        {linkedActivityList.length &&
                                                            linkedActivityList.map((item, idex) => {
                                                                return (
                                                                    <option key={idex} value={item.id}>
                                                                        {item.activity_description}
                                                                    </option>
                                                                );
                                                            })}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                    {logbookType === "Fire-Drills" ? (
                                        <>
                                            <div className="itm">
                                                <div className="form-group">
                                                    <label>Shift</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        className="form-control"
                                                        placeholder=" "
                                                        value={formParams.shift}
                                                        onChange={e =>
                                                            this.setState({
                                                                formParams: {
                                                                    ...formParams,
                                                                    shift: e.target.value
                                                                }
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="itm">
                                                <div className="form-group">
                                                    <label>Category</label>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            className="custom-selecbox form-control"
                                                            value={formParams.category}
                                                            onChange={e =>
                                                                this.setState({
                                                                    formParams: {
                                                                        ...formParams,
                                                                        category: e.target.value
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <option value="">Select</option>
                                                            {categories.length &&
                                                                categories.map((item, idex) => {
                                                                    return (
                                                                        <option key={idex} value={item}>
                                                                            {item}
                                                                        </option>
                                                                    );
                                                                })}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
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
                                                        value={(formParams.shift_start && formParams.shift_start) || 0}
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
                                                        value={(formParams.shift_end && formParams.shift_end) || 0}
                                                    />
                                                </div>
                                            </div>

                                        </>
                                    ) : null}
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
                                    ) : null}
                                </div>
                                <div className="btn-sec">
                                    <button className="btn btn-cncl-back mr-2" onClick={() => this.cancelForm()}>
                                        <i className="material-icons tic"> close</i>Cancel
                                    </button>
                                    {selectedActivity ? (
                                        <button className="btn btn-create" onClick={() => this.editActivity()}>
                                            <i className="material-icons tic"> check</i> Update Activity
                                        </button>
                                    ) : (
                                        <button className="btn btn-create" onClick={() => this.addActivity()}>
                                            <i className="material-icons tic"> check</i> Add Activity
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.renderFrequencyModal()}
                    {this.renderConfirmationModal()}
                </section>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { activityReducer, settingsCommonReducer } = state;
    return { activityReducer, settingsCommonReducer };
};

export default connect(mapStateToProps, { ...actions, ...commonActions })(addActivity);
