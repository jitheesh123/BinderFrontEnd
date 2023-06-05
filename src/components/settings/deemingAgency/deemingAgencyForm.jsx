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

class editDeemingAgency extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consultancyIdList: [],
            clientIdList: [],
            formParams: {
                name: "",
                display_order: "",
                standard_prefix: ""
            },
            errorParams: {
                name: false,
                display_order: false
            },
            isEdit: false,
            showErrorBorder: false,
            selectedDeemingAgency: props.match.params.id,
            initialData: {
                name: "",
                display_order: "",
                standard_prefix: ""
            },
            showConfirmModal: false
        };
    }

    componentDidMount = async () => {
        const { selectedDeemingAgency } = this.state;
        await this.props.getConsultancyDropdown();
        await this.setState({
            consultancyIdList: this.props.settingsCommonReducer.consultancyDropdownData.data
        });
        if (selectedDeemingAgency) {
            await this.props.getDeemingAgencyById(selectedDeemingAgency);
            const {
                deemingAgencyReducer: {
                    getDeemingAgencyByIdResponse: {
                        deeming_agency: { name, display_order, code, standard_prefix },
                        success
                    }
                }
            } = this.props;
            if (success) {
                await this.setState({
                    formParams: {
                        name,
                        display_order,
                        code,
                        standard_prefix
                    },
                    initialData: {
                        name,
                        display_order,
                        code,
                        standard_prefix
                    },
                    isEdit: true
                });
            }
        }
    };

    getClientDropDown = async consultancy_id => {
        await this.props.getClientDropdown({ consultancy_id });
        await this.setState({
            clientIdList: this.props.settingsCommonReducer.clientDropdownData.data
        });
    };

    validate = () => {
        const { formParams } = this.state;
        let errorParams = {
            name: false,
            display_order: false
        };
        let showErrorBorder = false;
        if (!formParams.name || !formParams.name.trim().length) {
            errorParams.name = true;
            showErrorBorder = true;
        }
        if (!formParams.display_order || !formParams.display_order.toString().trim().length) {
            errorParams.display_order = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });

        if (showErrorBorder) return false;
        return true;
    };

    addDeemingAgency = async () => {
        const { formParams } = this.state;
        if (this.validate()) {
            await this.props.addDeemingAgency({ deeming_agency: formParams });
            ToastMsg(this.props.deemingAgencyReducer.adddeemingAgencyData.message, "info");
            if (this.props.deemingAgencyReducer.adddeemingAgencyData.success) {
                history.push("/deeming_agencies");
            }
        }
    };

    editDeemingAgency = async () => {
        const { formParams } = this.state;
        if (this.validate()) {
            await this.props.editDeemingAgencyById({ deeming_agency: formParams }, this.props.match.params.id);
            ToastMsg(this.props.deemingAgencyReducer.editDeemingAgencyById.message, "info");
            if (this.props.deemingAgencyReducer.editDeemingAgencyById.success) {
                if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                    history.push(`/deeming_agency/deeming_agencyinfo/${this.props.match.params.id}/basicdetails`);
                } else {
                    history.push("/deeming_agencies");
                }
            }
        }
    };

    selectConsultancyId = async consultancy_id => {
        const { formParams } = this.state;
        await this.setState({
            formParams: {
                ...formParams,
                consultancy_id
            }
        });
        this.getClientDropDown(consultancy_id);
    };

    cancelForm = async () => {
        if (this.state.showConfirmModal) {
            await this.setState({ showConfirmModal: false });
            if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                history.push(`/deeming_agency/deeming_agencyinfo/${this.props.match.params.id}/basicdetails`);
            } else {
                history.push("/deeming_agencies");
            }
        } else if (_.isEqual(this.state.initialData, this.state.formParams)) {
            if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                history.push(`/deeming_agency/deeming_agencyinfo/${this.props.match.params.id}/basicdetails`);
            } else {
                history.push("/deeming_agencies");
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
        const { consultancyIdList, clientIdList, formParams, errorParams, isEdit, showErrorBorder, selectedDeemingAgency } = this.state;
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
                                        <h4>{selectedDeemingAgency ? "Edit" : "Add"} Deeming Agency</h4>
                                    </div>
                                    {/* <Breadcrumb /> */}
                                </div>
                            </div>
                            <div className="form-area">
                                {selectedDeemingAgency ? (
                                    <div className="itm col-md-4">
                                        <div className="form-group">
                                            <label>Deeming Agency Code</label>
                                            <input type="text" className="form-control" placeholder="" value={formParams.code} disabled={true} />
                                        </div>
                                    </div>
                                ) : null}
                                <div className="itm col-md-4">
                                    <div className="form-group">
                                        <label className={showErrorBorder && errorParams.name ? "text-red" : ""}>Deeming Agency Name *</label>
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
                                <div className="itm col-md-4">
                                    <div className="form-group">
                                        <label className={showErrorBorder && errorParams.display_order ? "text-red" : ""}>Display Order *</label>
                                        <input
                                            type="number"
                                            value={formParams.display_order}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        display_order: e.target.value
                                                    }
                                                });
                                            }}
                                            min={0}
                                            className="form-control"
                                            placeholder="Enter Display Order"
                                        />
                                    </div>
                                </div>
                                <div className="itm  col-md-4">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">Standard Prefix</label>
                                        <input
                                            type="text-area"
                                            id="text"
                                            value={formParams.standard_prefix}
                                            onChange={e =>
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        standard_prefix: e.target.value
                                                    }
                                                })
                                            }
                                            className="form-control"
                                            placeholder="Enter Standard Prefix "
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="btn-sec">
                                <button className="btn btn-cncl-back mr-2" onClick={() => this.cancelForm()}>
                                    <i className="material-icons tic"> close</i>Cancel
                                </button>
                                {selectedDeemingAgency ? (
                                    <button className="btn btn-create" onClick={() => this.editDeemingAgency()}>
                                        <i className="material-icons tic"> check</i> Update Deeming Agency
                                    </button>
                                ) : (
                                    <button className="btn btn-create" onClick={() => this.addDeemingAgency()}>
                                        <i className="material-icons tic"> check</i> Add Deeming Agency
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
    const { deemingAgencyReducer, settingsCommonReducer } = state;
    return { deemingAgencyReducer, settingsCommonReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions, ...commonActions })(editDeemingAgency));
