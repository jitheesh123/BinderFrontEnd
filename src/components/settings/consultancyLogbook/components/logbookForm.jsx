import React, { Component } from "react";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import { withRouter } from "react-router-dom";

import history from "../../../../config/history";
import ToastMsg from "../../../common/ToastMessage";
import TopSlider from "../../../common/components/TopSlider";
import commonActions from "../../actions";
import actions from "../actions";

class editLogbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formParams: {
                name: null,
                comments: null,
                display_name: null,
                color: null,
                text_color: null,
                line: null,
                order: null
            },
            errorParams: {
                name: false
            },

            logbookId: null,
            consultancyIdList: [],
            clientIdList: [],
            selectedLogbook: props.match.params.id
        };
    }

    componentDidMount = async () => {
        const { selectedLogbook } = this.state;
        if (selectedLogbook) {
            await this.props.getConsultancyLogbookById(selectedLogbook);
            const {
                consultancyLogbookReducer: {
                    getConsultancyLogbookByIdResponse: {
                        consultancy_logbook: { name, display_name, color, code, order, line, text_color, comments },
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
                        color,
                        text_color,
                        line,
                        order,
                        code
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
            name: false
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

    editLogbook = async () => {
        const { formParams } = this.state;
        if (this.validate()) {
            await this.props.editConsultancyLogbook(formParams, this.props.match.params.id);
            ToastMsg(this.props.consultancyLogbookReducer.editConsultancyLogbookData.message, "info");
            if (this.props.consultancyLogbookReducer.editConsultancyLogbookData.success) {
                if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                    history.push(`/consultancyLogbook/consultancyLogbookInfo/${this.props.match.params.id}/basicdetails`);
                } else {
                    history.goBack();
                }
            }
        }
    };

    addLogbook = async () => {
        const { formParams } = this.state;
        if (this.validate()) {
            await this.props.addConsultancyLogbook({ consultancy_logbook: formParams });
            ToastMsg(this.props.consultancyLogbookReducer.addConsultancyLogbookData.message, "info");
            if (this.props.consultancyLogbookReducer.addConsultancyLogbookData.success) {
                history.goBack();
            }
        }
    };

    cancelForm = () => {
        if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
            history.push(`/consultancyLogbook/consultancyLogbookInfo/${this.props.match.params.id}/basicdetails`);
        } else {
            history.goBack();
        }
    };

    render() {
        const { formParams, showErrorBorder, errorParams, selectedLogbook } = this.state;
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
                                        />
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
                                        />
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="form-group select-group">
                                        <label className="form-control-placeholder">Client User</label>
                                        <div className="custom-selecbox">
                                            <select className="form-control custom-selecbox">
                                                <option value="">Select</option>
                                                <option value="">Select</option>
                                                <option value="">Select</option>
                                                <option value="">Select</option>
                                                <option value="">Select</option>
                                                <option value="">Select</option>
                                                <option value="">Select</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="itm">
                                    <div className="form-group select-group">
                                        <label className="form-control-placeholder">Consultancy User</label>
                                        <div className="custom-selecbox">
                                            <select className="form-control custom-selecbox">
                                                <option value="">Select</option>
                                                <option value="">Select</option>
                                                <option value="">Select</option>
                                                <option value="">Select</option>
                                            </select>
                                        </div>
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
            </section>
        );
    }
}

const mapStateToProps = state => {
    const { consultancyLogbookReducer, settingsCommonReducer } = state;
    return { consultancyLogbookReducer, settingsCommonReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions, ...commonActions })(editLogbook));
