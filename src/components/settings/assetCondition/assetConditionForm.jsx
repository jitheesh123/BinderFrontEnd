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

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formParams: {
                code: "",
                name: "",
                description: ""
            },
            errorParams: {
                name: false
            },
            isEdit: false,
            showErrorBorder: false,
            selectedAssetCondition: props.match.params.id,
            initialData: {
                code: "",
                name: "",
                description: ""
            },
            showConfirmModal: false
        };
    }

    componentDidMount = async () => {
        const { selectedAssetCondition } = this.state;
        if (selectedAssetCondition) {
            await this.props.getAssetConditionById(selectedAssetCondition);
            const {
                assetConditionReducer: {
                    getAssetConditionByIdResponse: {
                        asset_condition: { name, code, description },
                        success
                    }
                }
            } = this.props;
            if (success) {
                await this.setState({
                    formParams: {
                        code,
                        name,
                        description
                    },
                    initialData: {
                        code,
                        name,
                        description
                    },
                    isEdit: true
                });
            }
        }
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

    addAssetCondition = async () => {
        const { formParams } = this.state;
        let path = (this.props.location.state && this.props.location.state.prevPath) || "/assetConditions";
        if (this.validate()) {
            await this.props.addAssetCondition({ asset_condition: formParams });
            ToastMsg(this.props.assetConditionReducer.addAssetConditionData.message, "info");
            if (this.props.assetConditionReducer.addAssetConditionData.success) {
                history.push(path);
            }
        }
    };

    editAssetCondition = async () => {
        const { formParams } = this.state;
        let path = (this.props.location.state && this.props.location.state.prevPath) || "/assetConditions";
        let prePrevPath = (this.props.location.state && this.props.location.state.prePrevPath) || "/assetConditions";
        if (this.validate()) {
            await this.props.editAssetConditionById({ asset_condition: formParams }, this.props.match.params.id);
            ToastMsg(this.props.assetConditionReducer.editAssetConditionResponse.message, "info");
            if (this.props.assetConditionReducer.editAssetConditionResponse.success) {
                history.push(path, { prevPath: prePrevPath });
            }
        }
    };

    cancelForm = async () => {
        let path = (this.props.location.state && this.props.location.state.prevPath) || "/assetConditions";
        let prePrevPath = (this.props.location.state && this.props.location.state.prePrevPath) || "/assetConditions";
        if (this.state.showConfirmModal) {
            await this.setState({ showConfirmModal: false });
            history.push(path, { prevPath: prePrevPath });
        } else if (_.isEqual(this.state.initialData, this.state.formParams)) {
            history.push(path, { prevPath: prePrevPath });
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
        const { formParams, errorParams, isEdit, showErrorBorder, selectedAssetCondition } = this.state;
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
                                        <h4>{selectedAssetCondition ? "Edit" : "Add"} Asset Condition</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="form-area">
                                {selectedAssetCondition ? (
                                    <div className="itm">
                                        <div className="form-group">
                                            <label>Asset Condition Code</label>
                                            <input
                                                type="text"
                                                id="text"
                                                value={formParams.code}
                                                className="form-control"
                                                placeholder="code"
                                                autoComplete="off"
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                ) : null}
                                <div className="itm">
                                    <div className="form-group">
                                        <label className={showErrorBorder && errorParams.name ? "text-red" : ""}>Asset Condition Name *</label>
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
                                            placeholder="Name"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="form-group">
                                        <label>Description</label>
                                        <input
                                            type="text"
                                            id="comment"
                                            value={formParams.description}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        description: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Description"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="btn-sec">
                                <button className="btn btn-cncl-back mr-2" onClick={() => this.cancelForm()}>
                                    <i className="material-icons tic"> close</i>Cancel
                                </button>
                                {selectedAssetCondition ? (
                                    <button className="btn btn-create" onClick={() => this.editAssetCondition()}>
                                        <i className="material-icons tic"> check</i> Update Asset Condition
                                    </button>
                                ) : (
                                    <button className="btn btn-create" onClick={() => this.addAssetCondition()}>
                                        <i className="material-icons tic"> check</i> Add Asset Condition
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
    const { assetConditionReducer, settingsCommonReducer } = state;
    return { assetConditionReducer, settingsCommonReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions, ...commonActions })(Form));
