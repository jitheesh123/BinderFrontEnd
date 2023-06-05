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
            consultancyIdList: [],
            clientIdList: [],
            sectorIdList: [],
            campusIdList: [],
            buildingIdList: [],
            formParams: {
                code: "",
                name: "",
                consultancy_id: "",
                client_id: "",
                // sector_id: "",
                // campus_id: "",
                building_id: "",
                comment: ""
            },
            errorParams: {
                name: false,
                consultancy_id: false,
                client_id: false,
                // sector_id: false,
                // campus_id: false,
                building_id: false
            },
            isEdit: false,
            showErrorBorder: false,
            selectedFloor: props.match.params.id,
            initialData: {
                code: "",
                name: "",
                consultancy_id: "",
                client_id: "",
                // sector_id: "",
                // campus_id: "",
                building_id: "",
                comment: ""
            },
            selectedBuilding: (this.props.location.state && this.props.location.state.buildingId) || null,
            showConfirmModal: false
        };
    }

    componentDidMount = async () => {
        const { selectedFloor, selectedBuilding } = this.state;
        await this.props.getConsultancyDropdown();
        await this.setState({
            consultancyIdList: this.props.settingsCommonReducer.consultancyDropdownData.data,
            formParams: {
                ...this.state.formParams,
                building_id: selectedBuilding || ""
            }
        });
        if (selectedFloor) {
            await this.props.getFloorById(selectedFloor);
            const {
                floorReducer: {
                    getFloorByIdResponse: {
                        floor: { name, code, comment, consultancy, client, building },
                        success
                    }
                }
            } = this.props;
            if (success) {
                this.getClientDropdown(consultancy.id);
                this.getBuildingsDropdown(client.id);
                await this.setState({
                    formParams: {
                        name,
                        code,
                        comment,
                        consultancy_id: consultancy.id || "",
                        // sector_id: sector.id || "",
                        // campus_id: campus.id || "",
                        client_id: client.id || "",
                        building_id: building.id || ""
                    },
                    initialData: {
                        name,
                        code,
                        comment,
                        consultancy_id: consultancy.id || "",
                        // sector_id: sector.id || "",
                        // campus_id: campus.id || "",
                        client_id: client.id || "",
                        building_id: building.id || ""
                    },
                    isEdit: true
                });
            }
        }
    };

    validate = () => {
        const { formParams, selectedBuilding } = this.state;
        let errorParams = {
            name: false,
            consultancy_id: false,
            client_id: false,
            // sector_id: false,
            // campus_id: false,
            building_id: false
        };
        let showErrorBorder = false;
        if (!formParams.name || !formParams.name.trim().length) {
            errorParams.name = true;
            showErrorBorder = true;
        }
        if (!selectedBuilding && (!formParams.consultancy_id || !formParams.consultancy_id.trim().length)) {
            errorParams.consultancy_id = true;
            showErrorBorder = true;
        }
        if (!selectedBuilding && (!formParams.client_id || !formParams.client_id.trim().length)) {
            errorParams.client_id = true;
            showErrorBorder = true;
        }
        if (!selectedBuilding && (!formParams.building_id || !formParams.building_id.trim().length)) {
            errorParams.building_id = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });

        if (showErrorBorder) return false;
        return true;
    };

    addFloor = async () => {
        const { formParams } = this.state;
        let path = (this.props.location.state && this.props.location.state.prevPath) || "/floors";
        if (this.validate()) {
            await this.props.addFloor({ floor: formParams });
            ToastMsg(this.props.floorReducer.addFloorData.message, "info");
            if (this.props.floorReducer.addFloorData.success) {
                history.push(path);
            }
        }
    };

    editFloor = async () => {
        const { formParams } = this.state;
        let path = (this.props.location.state && this.props.location.state.prevPath) || "/floors";
        let prePrevPath = (this.props.location.state && this.props.location.state.prePrevPath) || "/floors";
        if (this.validate()) {
            await this.props.editFloorById({ floor: formParams }, this.props.match.params.id);
            ToastMsg(this.props.floorReducer.editFloorResponse.message, "info");
            if (this.props.floorReducer.editFloorResponse.success) {
                history.push(path, { prevPath: prePrevPath });
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
        let path = (this.props.location.state && this.props.location.state.prevPath) || "/floors";
        let prePrevPath = (this.props.location.state && this.props.location.state.prePrevPath) || "/floors";
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

    selectConsultancyId = async value => {
        const { formParams } = this.state;
        await this.setState({
            formParams: {
                ...formParams,
                consultancy_id: value,
                client_id: "",
                building_id: ""
            }
        });
        this.getClientDropdown(value);
    };

    getClientDropdown = async consultancy_id => {
        await this.props.getClientDropdown({ consultancy_id });
        await this.setState({
            clientIdList: this.props.settingsCommonReducer.clientDropdownData.data
        });
    };

    selectClientId = async value => {
        const { formParams } = this.state;
        await this.setState({
            formParams: {
                ...formParams,
                client_id: value,
                building_id: ""
            }
        });
        this.getBuildingsDropdown(value);
    };

    getSectorDropdown = async client_id => {
        await this.props.getSectorDropdown({ client_id });
        await this.setState({
            sectorIdList: this.props.settingsCommonReducer.sectorDropdownData.data
        });
    };

    selectSectorId = async value => {
        const { formParams } = this.state;
        await this.setState({
            formParams: {
                ...formParams,
                sector_id: value,
                campus_id: "",
                building_id: ""
            }
        });
        this.getCampusDropdown(value);
    };

    getCampusDropdown = async sector_id => {
        await this.props.getCampusesDropdown({ sector_id });
        await this.setState({
            campusIdList: this.props.settingsCommonReducer.campusDropdownData.data
        });
    };

    selectCampusId = async value => {
        const { client_id } = this.state.formParams;
        const { formParams } = this.state;
        await this.setState({
            formParams: {
                ...formParams,
                campus_id: value,
                building_id: ""
            }
        });
        this.getBuildingsDropdown(client_id);
    };

    getBuildingsDropdown = async client_id => {
        await this.props.getBuildingsDropdown({ client_id });
        await this.setState({
            buildingIdList: this.props.settingsCommonReducer.buildingDropdownData.data
        });
    };

    render() {
        const {
            consultancyIdList,
            clientIdList,
            sectorIdList,
            campusIdList,
            buildingIdList,
            formParams,
            errorParams,
            isEdit,
            showErrorBorder,
            selectedFloor,
            selectedBuilding
        } = this.state;
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
                                        <h4>{selectedFloor ? "Edit" : "Add"} Floor</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="form-area">
                                {selectedFloor ? (
                                    <div className="itm col-md-3">
                                        <div className="form-group">
                                            <label>Floor Code</label>
                                            <input type="text" className="form-control" placeholder="" value={formParams.code} disabled={true} />
                                        </div>
                                    </div>
                                ) : null}
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label className={showErrorBorder && errorParams.name ? "text-red" : ""}>Floor Name *</label>
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
                                {!selectedBuilding ? (
                                    <>
                                        <div className="itm col-md-3">
                                            <div className="form-group">
                                                <label
                                                    className={`${
                                                        showErrorBorder && errorParams.consultancy_id ? "text-red " : ""
                                                    }form-control-placeholder`}
                                                >
                                                    Consultancy *
                                                </label>
                                                <div className="custom-selecbox">
                                                    <select
                                                        className="custom-selecbox form-control"
                                                        value={formParams.consultancy_id}
                                                        onChange={e => this.selectConsultancyId(e.target.value)}
                                                    >
                                                        <option value="">Select</option>
                                                        {consultancyIdList &&
                                                            consultancyIdList.length &&
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

                                        <div className="itm col-md-3">
                                            <div className="form-group">
                                                <label
                                                    className={`${
                                                        showErrorBorder && errorParams.client_id ? "text-red " : ""
                                                    }form-control-placeholder`}
                                                >
                                                    Client *
                                                </label>
                                                <div className="custom-selecbox">
                                                    <select
                                                        className="form-control custom-selecbox"
                                                        value={formParams.client_id}
                                                        onChange={e => {
                                                            this.selectClientId(e.target.value);
                                                        }}
                                                    >
                                                        <option value="">Select</option>
                                                        {clientIdList &&
                                                            clientIdList.map((item, idex) => {
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
                                        <div className="itm col-md-3">
                                            <div className="form-group">
                                                <label
                                                    className={`${
                                                        showErrorBorder && errorParams.building_id ? "text-red " : ""
                                                    }form-control-placeholder`}
                                                >
                                                    Building *
                                                </label>
                                                <div className="custom-selecbox">
                                                    <select
                                                        className="form-control custom-selecbox"
                                                        value={formParams.building_id}
                                                        onChange={e => {
                                                            this.setState({
                                                                formParams: {
                                                                    ...formParams,
                                                                    building_id: e.target.value
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        <option value="">Select</option>
                                                        {buildingIdList.length &&
                                                            buildingIdList.map((item, idex) => {
                                                                return <option value={item.id}> {item.name} </option>;
                                                            })}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : null}
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label>Comment</label>
                                        <input
                                            type="text"
                                            id="comment"
                                            value={formParams.comment}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        comment: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Comment"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="btn-sec">
                                <button className="btn btn-cncl-back mr-2" onClick={() => this.cancelForm()}>
                                    <i className="material-icons tic"> close</i>Cancel
                                </button>
                                {selectedFloor ? (
                                    <button className="btn btn-create" onClick={() => this.editFloor()}>
                                        <i className="material-icons tic"> check</i> Update Floor
                                    </button>
                                ) : (
                                    <button className="btn btn-create" onClick={() => this.addFloor()}>
                                        <i className="material-icons tic"> check</i> Add Floor
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
    const { floorReducer, settingsCommonReducer } = state;
    return { floorReducer, settingsCommonReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions, ...commonActions })(Form));
