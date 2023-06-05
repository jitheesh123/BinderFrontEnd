import React, { Component } from "react";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import { withRouter } from "react-router-dom";

import history from "../../../config/history";
import TopSlider from "../../common/components/TopSlider";
import ToastMsg from "../../common/ToastMessage";
import actions from "./actions";
import commonActions from "../actions";

class editDeemingAgency extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consultancyIdList: [],
            clientIdList: [],
            formParams: {
                name: "",
                description: ""
            },
            errorParams: {
                name: false
            },
            isEdit: false,
            showErrorBorder: false,
            selectedBuildingType: props.match.params.id
        };
    }

    componentDidMount = async () => {
        const { selectedBuildingType } = this.state;
        await this.props.getConsultancyDropdown();
        await this.setState({
            consultancyIdList: this.props.settingsCommonReducer.consultancyDropdownData.data
        });
        if (selectedBuildingType) {
            await this.props.getBuildingTypeById(selectedBuildingType);
            const {
                buildingTypeReducer: {
                    getbuildingTypeByIdResponse: {
                        building_type: { name, code, description },
                        success
                    }
                }
            } = this.props;
            if (success) {
                await this.setState({
                    formParams: {
                        name,
                        code,
                        description
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
            await this.props.addBuildingType({ building_type: formParams });
            ToastMsg(this.props.buildingTypeReducer.addbuildingTypeData.message, "info");
            if (this.props.buildingTypeReducer.addbuildingTypeData.success) {
                history.push("/building_types");
            }
        }
    };

    editDeemingAgency = async () => {
        const { formParams } = this.state;
        if (this.validate()) {
            await this.props.editBuildingTypeById({ building_type: formParams }, this.props.match.params.id);
            ToastMsg(this.props.buildingTypeReducer.editbuildingTypeById.message, "info");
            if (this.props.buildingTypeReducer.editbuildingTypeById.success) {
                if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                    history.push(`/building_type/building_typeinfo/${this.props.match.params.id}/basicdetails`);
                } else {
                    history.push("/building_types");
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

    cancelForm = () => {
        if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
            history.push(`/building_type/building_typeinfo/${this.props.match.params.id}/basicdetails`);
        } else {
            history.push("/building_types");
        }
    };

    render() {
        const { consultancyIdList, clientIdList, formParams, errorParams, isEdit, showErrorBorder, selectedBuildingType } = this.state;
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
                                        <h4>{selectedBuildingType ? "Edit" : "Add"} Building Type</h4>
                                    </div>
                                    {/* <Breadcrumb /> */}
                                </div>
                            </div>
                            <div className="form-area">
                                {selectedBuildingType ? (
                                    <div className="itm col-md-4">
                                        <div className="form-group">
                                            <label>Building Type Code</label>
                                            <input type="text" className="form-control" placeholder="" value={formParams.code} disabled={true} />
                                        </div>
                                    </div>
                                ) : null}
                                <div className="itm col-md-4">
                                    <div className="form-group">
                                        <label className={showErrorBorder && errorParams.name ? "text-red" : ""}>Building Type Name *</label>
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
                                <div className="itm  col-md-4">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">Description</label>
                                        <input
                                            type="text-area"
                                            id="text"
                                            value={formParams.description}
                                            onChange={e =>
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        description: e.target.value
                                                    }
                                                })
                                            }
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
                                {selectedBuildingType ? (
                                    <button className="btn btn-create" onClick={() => this.editDeemingAgency()}>
                                        <i className="material-icons tic"> check</i> Update Building Type
                                    </button>
                                ) : (
                                    <button className="btn btn-create" onClick={() => this.addDeemingAgency()}>
                                        <i className="material-icons tic"> check</i> Add Building Type
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
    const { buildingTypeReducer, settingsCommonReducer } = state;
    return { buildingTypeReducer, settingsCommonReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions, ...commonActions })(editDeemingAgency));
