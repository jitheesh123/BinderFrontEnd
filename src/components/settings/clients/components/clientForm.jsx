import React, { Component } from "react";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import { withRouter } from "react-router-dom";
import _ from "lodash";

import history from "../../../../config/history";
import ToastMsg from "../../../common/ToastMessage";
import TopSlider from "../../../common/components/TopSlider";
import actions from "../actions";
import commonActions from "../../actions";
import ConfirmationModal from "../../../common/components/ConfirmationModal";
import Portal from "../../../common/components/Portal";

class clientForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formParams: {
                name: "",
                comments: "",
                cmms_url: "",
                modify_next_due_date: "yes",
                lock_total_devices: "yes",
                request_email_recipt: "no",
                consultancy_id: "",
                enable_notification:"no",
                address:"",
                email:"",
                contact_number:"",
                is_active:"no"

            },
            errorParams: {
                name: false,
                consultancy_id: false
            },
            isEdit: false,
            showErrorBorder: false,
            consultancyIdList: [],
            selectedClient: props.match.params.id,
            initialData: {
                name: "",
                comments: "",
                cmms_url: "",
                modify_next_due_date: "yes",
                lock_total_devices: "yes",
                request_email_recipt: "no",
                consultancy_id: "",
                enable_notification:"no",
                address:"",
                email:"",
                contact_number:"",
                is_active:"yes"
            },
            showConfirmModal: false
        };
    }

    componentDidMount = async () => {
        const { selectedClient } = this.state;
        await this.props.getConsultancyDropdown();
        await this.setState({
            consultancyIdList: this.props.settingsCommonReducer.consultancyDropdownData.data
        });
        if (selectedClient) {
            await this.props.getClientById(selectedClient);
            const {
                clientReducer: {
                    getClientByIdResponse: {
                        client: { name, request_email_recipt, lock_total_devices, consultancy, cmms_url, modify_next_due_date, code, comments,enable_notification,address,is_active,contact_number,email},
                        success
                    }
                }
            } = this.props;
            if (success) {
                await this.setState({
                    formParams: {
                        name,
                        comments,
                        request_email_recipt,
                        cmms_url,
                        lock_total_devices,
                        consultancy_id: consultancy.id,
                        code,
                        modify_next_due_date,
                        enable_notification,
                        address,
                        email,
                        contact_number,
                        is_active
                    },
                    initialData: {
                        name,
                        comments,
                        request_email_recipt,
                        cmms_url,
                        lock_total_devices,
                        consultancy_id: consultancy.id,
                        code,
                        modify_next_due_date,
                        enable_notification,
                        address,
                        email,
                        contact_number,
                        is_active
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
            consultancy_id: false
        };
        let showErrorBorder = false;
        if (!formParams.name || !formParams.name.trim().length) {
            errorParams.name = true;
            showErrorBorder = true;
        }
        if (!formParams.email || !formParams.email.trim().length) {
            errorParams.email = true;
            showErrorBorder = true;
        }
        if (!formParams.consultancy_id || !formParams.consultancy_id.trim().length) {
            errorParams.consultancy_id = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });
        if (showErrorBorder) return false;
        return true;
    };

    addClient = async () => {
        const { formParams } = this.state;
        if (this.validate()) {
            await this.props.addClients({ client: formParams });
            ToastMsg(this.props.clientReducer.addClientData.message, "info");
            if (this.props.clientReducer.addClientData.success) {
                history.push("/clients");
            }
        }
    };

    editClient = async () => {
        const { formParams } = this.state;
        if (this.validate()) {
            await this.props.editClientsById({ client: formParams }, this.props.match.params.id);
            ToastMsg(this.props.clientReducer.editClientData.message, "info");
            if (this.props.clientReducer.editClientData.success) {
                if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                    history.push(`/client/clientinfo/${this.props.match.params.id}/basicdetails`);
                } else {
                    history.push("/clients");
                }
            }
        }
    };

    radioChanged = async e => {
        const { formParams } = this.state;
        await this.setState({
            formParams: {
                ...formParams,
                [e.target.name]: e.target.value
            }
        });
    };

    cancelForm = async () => {
        if (this.state.showConfirmModal) {
            await this.setState({ showConfirmModal: false });
            if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                history.push(`/client/clientinfo/${this.props.match.params.id}/basicdetails`);
            } else {
                history.push("/clients");
            }
        } else if (_.isEqual(this.state.initialData, this.state.formParams)) {
            if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                history.push(`/client/clientinfo/${this.props.match.params.id}/basicdetails`);
            } else {
                history.push("/clients");
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
                        type="cancel"
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
        const { consultancyIdList, formParams, showErrorBorder, errorParams, selectedClient } = this.state;
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
                                            <h4>{selectedClient ? "Edit" : "Add"} Client</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-area">
                                    {selectedClient ? (
                                        <div className="itm">
                                            <div className="form-group">
                                                <label>Client Code</label>
                                                <input type="text" className="form-control" placeholder="" value={formParams.code} disabled={true} />
                                            </div>
                                        </div>
                                    ) : null}
                                    <div className="itm">
                                        <div className="form-group">
                                            <label className={showErrorBorder && errorParams.name ? "text-red" : ""}>Client Name *</label>
                                            <input
                                                type="text"
                                                id="text"
                                                value={formParams.name}
                                                onChange={e =>
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            name: e.target.value
                                                        }
                                                    })
                                                }
                                                className="form-control"
                                                placeholder="Enter Client Name "
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>

                                    <div className="itm">
                                        <div className="form-group select-group">
                                            <label className={showErrorBorder && errorParams.consultancy_id ? "text-red" : ""}>Consultancy *</label>
                                            <div className="custom-selecbox">
                                                <select
                                                    className="form-control custom-selecbox"
                                                    value={formParams.consultancy_id}
                                                    onChange={e =>
                                                        this.setState({
                                                            formParams: {
                                                                ...formParams,
                                                                consultancy_id: e.target.value
                                                            }
                                                        })
                                                    }
                                                >
                                                    <option value="">Select</option>
                                                    {consultancyIdList.length &&
                                                        consultancyIdList.map((item, idex) => {
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
                                    <div className="itm">
                                        <div className="form-group">
                                            <label className="form-control-placeholder">Address</label>
                                            <textarea
                                                type="text-area"
                                                value={formParams.address}
                                                onChange={e =>
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            address: e.target.value
                                                        }
                                                    })
                                                }
                                                className="form-control"
                                                placeholder=" Enter Comments"
                                            />
                                        </div>
                                    </div>
                                    <div className="itm">
                                        <div className="form-group">
                                            <label className="form-control-placeholder">Contact Number</label>
                                            <input
                                                type="text-area"
                                                id="text"
                                                value={formParams.contact_number}
                                                onChange={e =>
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            contact_number: e.target.value
                                                        }
                                                    })
                                                }
                                                className="form-control"
                                                placeholder="Enter Contact Number"
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                    <div className="itm">
                                        <div className="form-group">
                                            <label  className={showErrorBorder && errorParams.email ? "text-red" : ""}>Email *</label>
                                            <input
                                                type="text-area"
                                                id="text"
                                                value={formParams.email}
                                                onChange={e =>
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            email: e.target.value
                                                        }
                                                    })
                                                }
                                                className="form-control"
                                                placeholder="Enter your Email"
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>

                                    <div className="itm">
                                        <div className="form-group">
                                            <label className="form-control-placeholder">CMMS Url</label>
                                            <input
                                                type="text-area"
                                                id="text"
                                                value={formParams.cmms_url}
                                                onChange={e =>
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            cmms_url: e.target.value
                                                        }
                                                    })
                                                }
                                                className="form-control"
                                                placeholder="Enter CMMS Url"
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>

                                    <div className="itm">
                                        <label>Modify Next Due Date</label>
                                        <div className="chek">
                                            <div className="chekbox-sec">
                                                <label className="container">
                                                    Yes
                                                    <input
                                                        type="radio"
                                                        name="modify_next_due_date"
                                                        value="yes"
                                                        onChange={e => this.radioChanged(e)}
                                                        checked={formParams.modify_next_due_date === "yes"}
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                                <label className="container">
                                                    No
                                                    <input
                                                        type="radio"
                                                        name="modify_next_due_date"
                                                        value="no"
                                                        onChange={e => this.radioChanged(e)}
                                                        checked={formParams.modify_next_due_date === "no"}
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="itm">
                                        <label> Lock Total Devices</label>
                                        <div className="chek">
                                            <div className="chekbox-sec">
                                                <label className="container">
                                                    Yes
                                                    <input
                                                        type="radio"
                                                        value="yes"
                                                        name="lock_total_devices"
                                                        onChange={e => this.radioChanged(e)}
                                                        checked={formParams.lock_total_devices === "yes"}
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                                <label className="container">
                                                    No
                                                    <input
                                                        type="radio"
                                                        value="no"
                                                        name="lock_total_devices"
                                                        onChange={e => this.radioChanged(e)}
                                                        checked={formParams.lock_total_devices === "no"}
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="itm">
                                        <label> Request Email Receipt</label>
                                        <div className="chek">
                                            <div className="chekbox-sec">
                                                <label className="container">
                                                    Yes
                                                    <input
                                                        type="radio"
                                                        value="yes"
                                                        name="request_email_recipt"
                                                        onChange={e => this.radioChanged(e)}
                                                        checked={formParams.request_email_recipt === "yes"}
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                                <label className="container">
                                                    No
                                                    <input
                                                        type="radio"
                                                        value="no"
                                                        name="request_email_recipt"
                                                        onChange={e => this.radioChanged(e)}
                                                        checked={formParams.request_email_recipt === "no"}
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="itm">
                                        <label> Enable Notification</label>
                                        <div className="chek">
                                            <div className="chekbox-sec">
                                                <label className="container">
                                                    Yes
                                                    <input
                                                        type="radio"
                                                        value="yes"
                                                        name="enable_notification"
                                                        onChange={e => this.radioChanged(e)}
                                                        checked={formParams.enable_notification === "yes"}
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                                <label className="container">
                                                    No
                                                    <input
                                                        type="radio"
                                                        value="no"
                                                        name="enable_notification"
                                                        onChange={e => this.radioChanged(e)}
                                                        checked={formParams.enable_notification === "no"}
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="itm">
                                        <label>is Active?</label>
                                        <div className="chek">
                                            <div className="chekbox-sec">
                                                <label className="container">
                                                    yes
                                                    <input
                                                        type="radio"
                                                        value="yes"
                                                        name="is_active"
                                                        onChange={e => this.radioChanged(e)}
                                                        checked={formParams.is_active === "yes"}
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                                <label className="container">
                                                    no
                                                    <input
                                                        type="radio"
                                                        value="no"
                                                        name="is_active"
                                                        onChange={e => this.radioChanged(e)}
                                                        checked={formParams.is_active === "no"}
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="itm">
                                        <div className="form-group">
                                            <label className="form-control-placeholder">Comments</label>
                                            <textarea
                                                type="text-area"
                                                value={formParams.comments}
                                                onChange={e =>
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            comments: e.target.value
                                                        }
                                                    })
                                                }
                                                className="form-control"
                                                placeholder=" Enter Comments"
                                            />
                                        </div>
                                    </div>
                                   
                                </div>

                               
                                <div className="btn-sec">
                                    <button className="btn btn-cncl-back mr-2" onClick={() => this.cancelForm()}>
                                        <i className="material-icons tic"> close</i>Cancel
                                    </button>
                                    {selectedClient ? (
                                        <button className="btn btn-create" onClick={() => this.editClient()}>
                                            <i className="material-icons tic"> check</i> Update Client
                                        </button>
                                    ) : (
                                        <button className="btn btn-create" onClick={() => this.addClient()}>
                                            <i className="material-icons tic"> check</i> Add Client
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.renderConfirmationModal()}
                </section>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { clientReducer, settingsCommonReducer } = state;
    return { clientReducer, settingsCommonReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions, ...commonActions })(clientForm));
