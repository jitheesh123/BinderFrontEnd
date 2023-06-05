import React, { Component } from "react";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import _ from "lodash";

import history from "../../../../config/history";
import ToastMsg from "../../../common/ToastMessage";
import TopSlider from "../../../common/components/TopSlider";
import actions from "../actions";
import commonActions from "../../actions";
import ConfirmationModal from "../../../common/components/ConfirmationModal";
import Portal from "../../../common/components/Portal";

class editCampus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formParams: {
                name: null,
                display_name: null,
                consultancy_id: null,
                client_id: null,
                sector_id: null,
                comments: null
            },
            errorParams: {
                name: false,
                consultancy_id: false,
                client_id: false,
                sector_id: false
            },
            consultancyIdList: [],
            clientIdList: [],
            sectorIdList: [],
            selectedCampus: props.match.params.id,
            initialData: {
                name: null,
                display_name: null,
                consultancy_id: null,
                client_id: null,
                sector_id: null,
                comments: null
            },
            showConfirmModal: false
        };
    }

    componentDidMount = async () => {
        const { selectedCampus } = this.state;
        await this.props.getConsultancyDropdown();
        await this.setState({
            consultancyIdList: this.props.settingsCommonReducer.consultancyDropdownData.data
        });
        if (selectedCampus) {
            await this.props.getCampusById(selectedCampus);
            const {
                campusReducer: {
                    getCampusByIdResponse: {
                        campus: { name, consultancy, display_name, sector, code, client, comments },
                        success
                    }
                }
            } = this.props;
            if (success) {
                this.getClientDropdown(consultancy.id);
                this.getSectorDataDropdown(client.id);
                await this.setState({
                    formParams: {
                        name,
                        comments,
                        display_name,
                        consultancy_id: consultancy.id,
                        client_id: client.id,
                        code,
                        sector_id: sector.id
                    },
                    initialData: {
                        name,
                        comments,
                        display_name,
                        consultancy_id: consultancy.id,
                        client_id: client.id,
                        code,
                        sector_id: sector.id
                    },
                    isEdit: true
                });
            }
        }
        // if (this.props.history.location.state && this.props.history.location.state.campusItem) {
        //     let tempFormParam = this.props.history.location.state.campusItem;
        //     tempFormParam.client_id = tempFormParam.client.id;
        //     tempFormParam.consultancy_id = tempFormParam.consultancy.id;
        //     tempFormParam.sector_id = tempFormParam.sector.id;
        //     this.getClientDropdown(this.props.history.location.state.consultancy_id);
        //     this.getSectorDataDropdown(this.props.history.location.state.client_id);
        //     await this.setState({
        //         formParams: tempFormParam,
        //         isEdit: true
        //     });
        // }
    };

    getClientDropdown = async consultancy_id => {
        await this.props.getClientDropdown({ consultancy_id });
        await this.setState({
            clientIdList: this.props.settingsCommonReducer.clientDropdownData.data
        });
    };

    getSectorDataDropdown = async client_id => {
        await this.props.getSectorDropdown({ client_id });
        await this.setState({
            sectorIdList: this.props.settingsCommonReducer.sectorDropdownData.data
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

    selectClientId = async client_id => {
        const { formParams } = this.state;
        await this.setState({
            formParams: {
                ...formParams,
                client_id
            }
        });
        this.getSectorDataDropdown(client_id);
    };

    validate = () => {
        const { formParams } = this.state;
        let errorParams = {
            name: false,
            consultancy_id: false,
            client_id: false,
            sector_id: false
        };
        let showErrorBorder = false;
        if (!formParams.name || !formParams.name.trim().length) {
            errorParams.name = true;
            showErrorBorder = true;
        }
        if (!formParams.consultancy_id || !formParams.consultancy_id.trim().length) {
            errorParams.consultancy_id = true;
            showErrorBorder = true;
        }
        if (!formParams.client_id || !formParams.client_id.trim().length) {
            errorParams.client_id = true;
            showErrorBorder = true;
        }
        if (!formParams.sector_id || !formParams.sector_id.trim().length) {
            errorParams.sector_id = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });

        if (showErrorBorder) return false;
        return true;
    };

    editCampus = async () => {
        const { formParams } = this.state;
        if (this.validate()) {
            await this.props.editCampusById({ campus: formParams }, this.props.match.params.id);
            ToastMsg(this.props.campusReducer.editCampusData.message, "info");
            if (this.props.campusReducer.editCampusData.success) {
                if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                    history.push(`/campus/campusinfo/${this.props.match.params.id}/basicdetails`);
                } else {
                    history.push("/campuses");
                }
            }
        }
    };

    addCampus = async () => {
        const { formParams } = this.state;
        if (this.validate()) {
            await this.props.addCampus({ campus: formParams });
            ToastMsg(this.props.campusReducer.addCampusData.message, "info");
            if (this.props.campusReducer.addCampusData.success) {
                history.push("/campuses");
            }
        }
    };

    cancelForm = async () => {
        if (this.state.showConfirmModal) {
            await this.setState({ showConfirmModal: false });
            if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                history.push(`/campus/campusinfo/${this.props.match.params.id}/basicdetails`);
            } else {
                history.push("/campuses");
            }
        } else if (_.isEqual(this.state.initialData, this.state.formParams)) {
            if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                history.push(`/campus/campusinfo/${this.props.match.params.id}/basicdetails`);
            } else {
                history.push("/campuses");
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
        const { formParams, consultancyIdList, clientIdList, showErrorBorder, errorParams, isEdit, sectorIdList, selectedCampus } = this.state;
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
                                        <h4>{selectedCampus ? "Edit" : "Add"} Campus</h4>
                                    </div>
                                    {/* <Breadcrumb /> */}
                                </div>
                            </div>
                            <div className="form-area">
                                {selectedCampus ? (
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
                                            Campus Name *
                                        </label>
                                        <input
                                            type="text"
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
                                            placeholder="Enter Campus Name"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>

                                <div className="itm">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">Display Name</label>
                                        <input
                                            type="text"
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
                                    <div className="form-group select-group">
                                        <label
                                            className={`${showErrorBorder && errorParams.consultancy_id ? "text-red " : ""}form-control-placeholder`}
                                        >
                                            Consultancy *
                                        </label>
                                        <div className="custom-selecbox">
                                            <select
                                                className="form-control custom-selecbox"
                                                value={formParams.consultancy_id}
                                                onChange={e => {
                                                    this.selectConsultancyId(e.target.value);
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {consultancyIdList.length &&
                                                    consultancyIdList.map((item, idex) => {
                                                        return <option value={item.id}> {item.name} </option>;
                                                    })}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="itm">
                                    <div className="form-group select-group">
                                        <label className={`${showErrorBorder && errorParams.client_id ? "text-red " : ""}form-control-placeholder`}>
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
                                                        return <option value={item.id}> {item.name} </option>;
                                                    })}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="itm">
                                    <div className="form-group select-group">
                                        <label className={`${showErrorBorder && errorParams.sector_id ? "text-red " : ""}form-control-placeholder`}>
                                            Sector *
                                        </label>
                                        <select
                                            className="form-control custom-selecbox"
                                            value={formParams.sector_id}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        sector_id: e.target.value
                                                    }
                                                });
                                            }}
                                        >
                                            <option value="">Select</option>
                                            {sectorIdList.length &&
                                                sectorIdList.map((item, idex) => {
                                                    return <option value={item.id}> {item.name} </option>;
                                                })}
                                        </select>
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">Comments</label>
                                        <textarea
                                            type="text-area"
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
                                </div>
                            </div>
                            <div className="btn-sec">
                                <button className="btn btn-cncl-back mr-2" onClick={() => this.cancelForm()}>
                                    <i className="material-icons tic"> close</i>Cancel
                                </button>
                                {selectedCampus ? (
                                    <button className="btn btn-create" onClick={() => this.editCampus()}>
                                        <i className="material-icons tic"> check</i> Update Campus
                                    </button>
                                ) : (
                                    <button className="btn btn-create" onClick={() => this.addCampus()}>
                                        <i className="material-icons tic"> check</i> Add Campus
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
    const { campusReducer, settingsCommonReducer } = state;
    return { campusReducer, settingsCommonReducer };
};

export default connect(mapStateToProps, { ...actions, ...commonActions })(editCampus);
