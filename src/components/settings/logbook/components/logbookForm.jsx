import React, { Component } from "react";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import { withRouter } from "react-router-dom";
import _ from "lodash";

import history from "../../../../config/history";
import ToastMsg from "../../../common/ToastMessage";
import TopSlider from "../../../common/components/TopSlider";
import commonActions from "../../actions";
import actions from "../actions";
import Breadcrumb from "../../../common/components/Breadcrumb";
import ConfirmationModal from "../../../common/components/ConfirmationModal";
import Portal from "../../../common/components/Portal";

class editLogbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formParams: {
                name: null,
                comments: null,
                display_name: null,
                logbook_type: null,
                color: null,
                text_color: null,
                line: null,
                order: null,
                is_active: "yes",
                has_asset: "no"
            },
            errorParams: {
                name: false,
                logbook_type: false
            },

            logbookId: null,
            consultancyIdList: [],
            clientIdList: [],
            selectedLogbook: props.match.params.id,
            initialData: {
                name: null,
                comments: null,
                display_name: null,
                logbook_type: null,
                color: null,
                text_color: null,
                line: null,
                order: null,
                is_active: "yes",
                has_asset: "no"
            },
            logbook_types: [],
            showConfirmModal: false
        };
    }

    componentDidMount = async () => {
        const { selectedLogbook } = this.state;
        await this.props.getLogbookTypeDropdown();
        const {
            logbookReducer: {
                getLogbookTypeDropdownResponse: { types, success }
            }
        } = this.props;
        await this.setState({
            logbook_types: types || []
        });
        if (selectedLogbook) {
            await this.props.getLogbookById(selectedLogbook);
            const {
                logbookReducer: {
                    getLogbookByIdResponse: {
                        logbook: { name, logbook_type, display_name, is_active, has_asset, color, code, order, line, text_color, comments },
                        success
                    }
                }
            } = this.props;
            if (success) {
                await this.setState({
                    formParams: {
                        name,
                        comments,
                        display_name,
                        logbook_type,
                        color,
                        text_color,
                        line,
                        order,
                        code,
                        is_active,
                        has_asset
                    },
                    initialData: {
                        name,
                        comments,
                        display_name,
                        logbook_type,
                        color,
                        text_color,
                        line,
                        order,
                        code,
                        is_active,
                        has_asset
                    },
                    isEdit: true
                });
            }
        }
    };

    getClientDropdown = async consultancy_id => {
        await this.props.getClientDropdown({ consultancy_id });
        await this.setState({
            clientIdList: this.props.settingsCommonReducer.clientDropdownData.data
        });
    };

    selectConsultancyId = async consultancy_id => {
        const { formParams } = this.state;
        await this.setState({
            formParams: {
                ...formParams,
                consultancy_id
            }
        });
        this.getClientDropdown(consultancy_id);
    };

    validate = () => {
        const { formParams } = this.state;
        let errorParams = {
            name: false,
            logbook_type: false
        };
        let showErrorBorder = false;
        if (!formParams.name || !formParams.name.trim().length) {
            errorParams.name = true;
            showErrorBorder = true;
        }
        if (!formParams.logbook_type || !formParams.logbook_type.trim().length) {
            errorParams.logbook_type = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });

        if (showErrorBorder) return false;
        return true;
    };

    editLogbook = async () => {
        const { formParams } = this.state;
        if (this.validate()) {
            await this.props.editLogbook(formParams, this.props.match.params.id);
            ToastMsg(this.props.logbookReducer.editLogbookData.message, "info");
            if (this.props.logbookReducer.editLogbookData.success) {
                if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                    history.push(`/logbook/logbookinfo/${this.props.match.params.id}/basicdetails`);
                } else {
                    history.push("/logbooks");
                }
            }
        }
    };

    addLogbook = async () => {
        const { formParams } = this.state;
        if (this.validate()) {
            await this.props.addLogbook(formParams);
            ToastMsg(this.props.logbookReducer.addLogbookData.message, "info");
            if (this.props.logbookReducer.addLogbookData.success) {
                history.push("/logbooks");
            }
        }
    };

    cancelForm = async () => {
        if (this.state.showConfirmModal) {
            await this.setState({ showConfirmModal: false });
            if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                history.push(`/logbook/logbookinfo/${this.props.match.params.id}/basicdetails`);
            } else {
                history.push("/logbooks");
            }
        } else if (_.isEqual(this.state.initialData, this.state.formParams)) {
            if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                history.push(`/logbook/logbookinfo/${this.props.match.params.id}/basicdetails`);
            } else {
                history.push("/logbooks");
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
        const { formParams, showErrorBorder, errorParams, selectedLogbook, logbook_types } = this.state;
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
                                        <h4>{selectedLogbook ? "Edit" : "Add"} Logbook</h4>
                                    </div>
                                    {/* <Breadcrumb /> */}
                                </div>
                            </div>
                            <div className="form-area">
                                {selectedLogbook ? (
                                    <div className="itm">
                                        <div className="form-group">
                                            <label>Code</label>
                                            <input type="text" className="form-control" placeholder="" value={formParams.code} disabled={true} />
                                        </div>
                                    </div>
                                ) : null}
                                <div className="itm">
                                    <div className="form-group">
                                        <label className={`${showErrorBorder && errorParams.name ? "text-red " : ""}form-control-placeholder`}>
                                            Logbook Name *
                                        </label>
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
                                            placeholder="Enter Logbook Name"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="form-group">
                                        <label
                                            className={`${showErrorBorder && errorParams.logbook_type ? "text-red " : ""}form-control-placeholder`}
                                        >
                                            Logbook Type
                                        </label>
                                        <div className="custom-selecbox">
                                            <select
                                                className="custom-selecbox form-control"
                                                value={formParams.logbook_type}
                                                onChange={e =>
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            logbook_type: e.target.value
                                                        }
                                                    })
                                                }
                                            >
                                                <option value="">Select</option>
                                                {logbook_types.map(logbook_type => (
                                                    <option value={logbook_type}>{logbook_type}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">Display Name</label>
                                        <input
                                            type="text"
                                            id="text"
                                            value={formParams.display_name}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        display_name: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Enter Display Name"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">Color</label>
                                        <input
                                            type="text"
                                            value={formParams.color}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        color: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Enter Color"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>

                                <div className="itm">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">Text Color</label>
                                        <input
                                            type="text"
                                            value={formParams.text_color}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        text_color: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Enter Text Color"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">Line</label>
                                        <input
                                            type="number"
                                            value={formParams.line}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        line: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Enter Line"
                                        />
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">Order</label>
                                        <input
                                            type="number"
                                            value={formParams.order}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        order: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Enter Order"
                                        />
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="form-group">
                                        <label>Has Asset?</label>
                                        <div className="custom-selecbox">
                                            <select
                                                className="custom-selecbox form-control"
                                                value={formParams.has_asset}
                                                onChange={e =>
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            has_asset: e.target.value
                                                        }
                                                    })
                                                }
                                            >
                                                <option value="no">NO</option>
                                                <option value="yes">YES</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="form-group">
                                        <label>Is Active?</label>
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
                                {/* <div className="itm">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">Comments</label>
                                        <textarea
                                            value={formParams.comments}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        comments: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Enter Comments"
                                        />
                                    </div>
                                </div> */}
                            </div>
                            <div className="btn-sec">
                                <button className="btn btn-cncl-back mr-2" onClick={() => this.cancelForm()}>
                                    <i className="material-icons tic"> close</i>Cancel
                                </button>
                                {selectedLogbook ? (
                                    <button className="btn btn-create" onClick={() => this.editLogbook()}>
                                        <i className="material-icons tic"> check</i> Update Logbook
                                    </button>
                                ) : (
                                    <button className="btn btn-create" onClick={() => this.addLogbook()}>
                                        <i className="material-icons tic"> check</i> Add Logbook
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
    const { logbookReducer, settingsCommonReducer } = state;
    return { logbookReducer, settingsCommonReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions, ...commonActions })(editLogbook));
