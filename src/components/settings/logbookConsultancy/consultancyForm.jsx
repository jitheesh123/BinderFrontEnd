import React, { Component } from "react";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import { withRouter } from "react-router-dom";
import history from "../../../config/history";
import TopSlider from "../../common/components/TopSlider";
import actions from "./actions";
import ToastMsg from "../../common/ToastMessage";

const mapStateToProps = state => {
    const { consultancyReducer } = state;
    return { consultancyReducer };
};

class editConsultancy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formParams: {
                name: "",
                comments: "",
                image: null,
                image_description: ""
            },
            errorParams: {
                name: false
            },
            isEdit: false,
            showErrorBorder: false,
            selectedConsultancy: props.match.params.id,
            selectedImage: ""
        };
    }

    componentDidMount = async () => {
        const { selectedConsultancy } = this.state;
        if (selectedConsultancy) {
            await this.props.getConsultancyById(selectedConsultancy);
            const {
                consultancyReducer: {
                    getConsultancyByIdResponse: {
                        consultancy: { name, image, code, comments },
                        success
                    }
                }
            } = this.props;
            if (success) {
                await this.setState({
                    formParams: {
                        name,
                        comments,
                        image,
                        code,
                        image_description: image.description,
                        image_id: image ? image.url : ""
                    },
                    isEdit: true,
                    selectedImage: image
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

    updateConsultancies = async () => {
        const { formParams, selectedImage } = this.state;
        if (this.validate()) {
            let params = new FormData();
            params.append("consultancy[name]", formParams.name);
            params.append("consultancy[comments]", formParams.comments);
            params.append("consultancy[image_description]", formParams.image_description);
            if (selectedImage && selectedImage.name !== formParams.image.name) {
                params.append("consultancy[image]", formParams.image);
            } else if (!formParams.image_id && formParams.image) {
                params.append("consultancy[image]", formParams.image);
            }
            await this.props.editConsultanciesById(params, this.props.match.params.id);
            ToastMsg(this.props.consultancyReducer.editConsultancyById.message, "info");
            if (this.props.consultancyReducer.editConsultancyById.success) {
                if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                    history.push(`/consultancy/consultancyinfo/${this.props.match.params.id}/basicdetails`);
                } else {
                    history.push("/consultancies");
                }
            }
        }
    };

    addConsultancies = async () => {
        const { formParams } = this.state;
        if (this.validate()) {
            let params = new FormData();
            params.append("consultancy[name]", formParams.name);
            params.append("consultancy[comments]", formParams.comments);
            params.append("consultancy[image_description]", formParams.image_description);
            params.append("consultancy[image]", formParams.image);
            await this.props.addConsultancies(params);
            ToastMsg(this.props.consultancyReducer.addConsultanciesData.message, "info");
            if (this.props.consultancyReducer.addConsultanciesData.success) {
                history.push("/consultancies");
            }
        }
    };

    handleAddAttachment = async e => {
        const { formParams } = this.state;
        await this.setState({
            formParams: {
                ...formParams,
                image: e.target.files[0]
            }
        });
    };

    cancelForm = () => {
        if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
            history.push(`/consultancy/consultancyinfo/${this.props.match.params.id}/basicdetails`);
        } else {
            history.push("/consultancies");
        }
    };

    render() {
        const { formParams, isEdit, showErrorBorder, errorParams, selectedConsultancy } = this.state;
        return (
            <section className="cont-ara">
                <div className="list-area">
                    <ToastContainer />
                    <TopSlider />
                    <div className="lst-bt-nav create">
                        <div className="table table-ara">
                            <div className="list-sec">
                                <div className="nav-ara">
                                    <div className="head">
                                        <h4>{selectedConsultancy ? "Edit" : "Add"} Consultancy </h4>
                                    </div>
                                </div>
                            </div>

                            <div className="cr-frm">
                                <div className="frm-ara">
                                    <div className="row">
                                        <div className="col-md-8 pr-0">
                                            <div className="row m-0">
                                                {selectedConsultancy ? (
                                                    <div className="col-md-6 pl-0 mb-3">
                                                        <div className="form-group">
                                                            <label className="form-control-placeholder">Code</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder=""
                                                                value={formParams.code}
                                                                disabled={true}
                                                            />
                                                        </div>
                                                    </div>
                                                ) : null}
                                                <div className="col-md-6 pl-0 mb-3">
                                                    <div className="form-group">
                                                        <label className={showErrorBorder && errorParams.name ? "text-red" : ""}>
                                                            Consultancy Name *
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
                                                            placeholder="Enter Consultancy Name"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6 pl-0 mb-3">
                                                    <div className="form-group">
                                                        <label className="form-control-placeholder">Image Description</label>
                                                        <input
                                                            type="text"
                                                            id="text"
                                                            value={formParams.image_description}
                                                            onChange={e => {
                                                                this.setState({
                                                                    formParams: {
                                                                        ...formParams,
                                                                        image_description: e.target.value
                                                                    }
                                                                });
                                                            }}
                                                            className="form-control"
                                                            placeholder="Enter Image Description"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-12 pl-0">
                                                    <div className="form-group">
                                                        <label>Comments</label>
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
                                        </div>
                                        <div className="col-md-4 pl-0">
                                            <div className="file-upload">
                                                {formParams.image && formParams.image.url === null ? (
                                                    <img src="/images/add-img.svg" alt="" />
                                                ) : formParams.image ? (
                                                    <>
                                                        <img
                                                            src={formParams.image.url ? formParams.image.url : URL.createObjectURL(formParams.image)}
                                                            alt=""
                                                        />
                                                    </>
                                                ) : (
                                                    <img src="/images/add-img.svg" alt="" />
                                                )}

                                                <div className="btn-upload">
                                                    <input type="file" id="attachmentFiles" name="profilePic" onChange={this.handleAddAttachment} />
                                                    <img src="/images/add-btn.svg" alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="btn-sec">
                                <button className="btn btn-cncl-back mr-2" onClick={() => this.cancelForm()}>
                                    <i className="material-icons tic"> close</i>Cancel
                                </button>
                                {selectedConsultancy ? (
                                    <button className="btn btn-create" onClick={() => this.updateConsultancies()}>
                                        <i className="material-icons tic"> check</i> Update Consultancy
                                    </button>
                                ) : (
                                    <button className="btn btn-create" onClick={() => this.addConsultancies()}>
                                        <i className="material-icons tic"> check</i> Add Consultancy
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

export default withRouter(connect(mapStateToProps, { ...actions })(editConsultancy));
