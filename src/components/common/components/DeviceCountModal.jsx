/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from "react";
import LoadingOverlay from "react-loading-overlay";
import _ from "lodash";

import Loader from "./Loader";
import BuildModalHeader from "./BuildModalHeader";
import { checkPermission } from "../../../config/utils";
import ConfirmationModal from "./ConfirmationModal";
import Portal from "./Portal";

class DeviceCountModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formParams: {
                total_devices: null,
                document: null,
                notes: null,
                building_activity_id: props.building_activity_id || null,
                asset_id:props.asset_id || null,
                schedule_id:props.schedule_id
            },
            initialFormParams: {
                total_devices: null,
                document: null,
                notes: null,
                building_activity_id: props.building_activity_id || null,
                asset_id:props.asset_id || null,
                schedule_id:props.schedule_id
            },
            errorParams: {
                total_devices: false,
                document: false
            },
            showErrorBorder: false,
            isLoading: true,
            showConfirmation: false,
            showDelConfirmation: false,
            selectedDeviceCount: null,
            confirmModalData: {
                heading: null,
                paragraph: null,
                onOk: null
            }
        };
    }

    componentDidMount = async () => {
        this.setState({
            isLoading: false
        });
    };

    componentDidUpdate = async (prevProps, prevState) => {};

    togglShowConfirmation = () => {
        const { showConfirmation } = this.state;
        this.setState({
            showConfirmation: !showConfirmation
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmation, confirmModalData } = this.state;
        if (!showConfirmation) return null;

        return (
            <Portal
                body={
                    <ConfirmationModal
                        onCancel={this.togglShowConfirmation}
                        onOk={confirmModalData.onOk}
                        heading={confirmModalData.heading}
                        paragraph={confirmModalData.paragraph}
                    />
                }
                onCancel={this.togglShowConfirmation}
            />
        );
    };

    onCancel = async () => {
        const { formParams, initialFormParams } = this.state;
        if (!_.isEqual(formParams, initialFormParams)) {
            await this.setState({
                confirmModalData: {
                    ...this.state.confirmModalData,
                    heading: "Do you want to Close ?",
                    paragraph: "All your changes will be lost, are you sure that you need to continue ?",
                    onOk: this.props.onCancel
                }
            });
            this.togglShowConfirmation();
        } else {
            this.props.onCancel();
        }
    };

    validate = () => {
        const { formParams } = this.state;
        let errorParams = {
            total_devices: false,
            document: false
        };
        let showErrorBorder = false;
        if (!formParams.total_devices || !formParams.total_devices.trim().length) {
            errorParams.total_devices = true;
            showErrorBorder = true;
        }
        if (!formParams.document) {
            errorParams.document = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });

        if (showErrorBorder) return false;
        return true;
    };

    handleAddAttachment = async e => {
        const { formParams } = this.state;
        await this.setState({
            formParams: {
                ...formParams,
                document: e.target.files[0] || null
            }
        });
    };

    saveDeviceCount = async () => {
        if (this.validate()) {
            await this.setState({
                isLoading: true
            });
            const { formParams } = this.state;
            const { saveDeviceCount } = this.props;
            let params = new FormData();
            console.log("so",formParams)
            params.append("device_document[total_devices]", formParams.total_devices);
            params.append("device_document[document]", formParams.document);
            params.append("device_document[notes]", formParams.notes);
            params.append("device_document[building_activity_id]", formParams.building_activity_id);
            params.append("device_document[asset_id]", formParams.asset_id);
            params.append("schedule_id",formParams.schedule_id)
            await saveDeviceCount(params);
            await this.setState({
                isLoading: false,
                formParams: {
                    ...formParams,
                    total_devices: null,
                    document: null,
                    notes: null
                }
            });
        }
    };

    handleDeleteDeviceCount = async selectedDeviceCount => {
        this.togglShowConfirmation();
        await this.setState({
            selectedDeviceCount,
            confirmModalData: {
                ...this.state.confirmModalData,
                heading: "Do you want to delete ?",
                paragraph: "This action cannot be reverted, are you sure that you need to delete this item ?",
                onOk: async () => {
                    await this.setState({
                        isLoading: true
                    });
                    this.togglShowConfirmation();
                    await this.props.deleteDeviceCount(selectedDeviceCount);
                    await this.setState({
                        isLoading: false
                    });
                }
            }
        });
    };

    render() {
        const { device_documents } = this.props;
        const { formParams, showErrorBorder, errorParams, isLoading } = this.state;
console.log("ui34",formParams)
        let user_role = localStorage.getItem("user_role");
        let audit_mode = localStorage.getItem("audit_mode") && localStorage.getItem("audit_mode") === "true" ? true : false;

        return (
            <React.Fragment>
                <div className="modal activity-event-modal device-count-modal" role="dialog" style={{ display: "block" }} id="modalId">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <LoadingOverlay fadeSpeed={0} active={isLoading} spinner={<Loader />}>
                                <BuildModalHeader title={`Device Count`} onCancel={this.onCancel} modalClass="device-count-modal" />
                                <div className="modal-body">
                                    {checkPermission("forms", "device_count", "edit") && !audit_mode ? (
                                        <div className="frm-ara">
                                            <div className="row">
                                                <div className="col-md-12 pr-0">
                                                    <div className="row m-0">
                                                        <div className="col-md-4 pl-0 mb-3">
                                                            <div className="form-group">
                                                                <label className={showErrorBorder && errorParams.total_devices ? "text-red" : ""}>
                                                                    Total Devices *
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    min={0}
                                                                    autocomplete="off"
                                                                    className="form-control"
                                                                    placeholder="Total Devices"
                                                                    value={formParams.total_devices || ""}
                                                                    onChange={e => {
                                                                        this.setState({
                                                                            formParams: {
                                                                                ...formParams,
                                                                                total_devices: e.target.value
                                                                            }
                                                                        });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 pl-0 mb-3">
                                                            <label className={showErrorBorder && errorParams.document ? "text-red" : ""}>
                                                                Document *
                                                            </label>
                                                            <div className="upload-sec">
                                                                <div className="uplod-sec-fld">
                                                                    <div className="custom-file">
                                                                        <input
                                                                            type="file"
                                                                            multiple
                                                                            className="custom-file-input"
                                                                            id="customFile"
                                                                            onChange={this.handleAddAttachment}
                                                                        />
                                                                        <label className="custom-file-label" for="customFile">
                                                                            {formParams.document
                                                                                ? formParams.document && formParams.document.name
                                                                                : "Select a File to Upload .."}
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 pl-0 mb-3">
                                                            <div className="form-group">
                                                                <label className="form-control-placeholder">Notes</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Notes"
                                                                    autocomplete="off"
                                                                    value={formParams.notes || ""}
                                                                    onChange={e => {
                                                                        this.setState({
                                                                            formParams: {
                                                                                ...formParams,
                                                                                notes: e.target.value
                                                                            }
                                                                        });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                    <div className="table-sec">
                                        <div className="table-hed">
                                            <h3>Documents</h3>
                                        </div>
                                        <div className="table-section">
                                            <div className="table-data">
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th className="img-sq-box">
                                                                <img alt="" src="/images/table-blue-dots.svg" />
                                                            </th>
                                                            <th className="date-sign">Total Devices</th>
                                                            <th className="doc-type">Notes</th>
                                                            <th className="sign-by">Updated By</th>
                                                            <th className="sign-by">Updated At</th>
                                                            <th className="doc-type">Document</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {device_documents && device_documents.length ? (
                                                            device_documents.map((item, i) => (
                                                                <tr>
                                                                    <td className="img-sq-box">
                                                                        <img alt="" src="/images/table-dot-white.svg" />
                                                                    </td>
                                                                    <td>{item.total_devices}</td>
                                                                    <td>{item.notes}</td>
                                                                    <td>{item.updated_by}</td>
                                                                    <td>{item.updated_at}</td>
                                                                    <td>
                                                                        <div className="action-btn">
                                                                            <a href={item.document} target="_blank" className="btn btn-view">
                                                                                View Document
                                                                            </a>
                                                                            {user_role === "super_admin" ? (
                                                                                <img
                                                                                    className="row-delete-icon"
                                                                                    src="/images/delete.svg"
                                                                                    alt=""
                                                                                    onClick={() => this.handleDeleteDeviceCount(item.id)}
                                                                                    title="Delete"
                                                                                />
                                                                            ) : null}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td className="text-center" colSpan="8">
                                                                    No records found !!
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="btn-sec btn-survey-sec">
                                        <div className="btn-out-1">
                                            {checkPermission("forms", "device_count", "edit") && !audit_mode ? (
                                                <button className="btn btn-create save mr-2" onClick={() => this.saveDeviceCount()}>
                                                    <i className="material-icons tic"> check</i> Save
                                                </button>
                                            ) : null}
                                            <button className="btn btn-cncl-back ml-2" onClick={() => this.onCancel()}>
                                                <i className="material-icons tic"> close</i>Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </LoadingOverlay>
                        </div>
                    </div>
                </div>
                {this.renderConfirmationModal()}
            </React.Fragment>
        );
    }
}

export default DeviceCountModal;
