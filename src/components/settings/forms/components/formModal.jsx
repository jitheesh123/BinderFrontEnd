/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from "react";
import _ from "lodash";

import BuildModalHeader from "../../../common/components/BuildModalHeader";
import Portal from "../../../common/components/Portal";
import ConfirmationModal from "../../../common/components/ConfirmationModal";
class FormModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formDetails: {},
            formParams: {
                form_id: "",
                description: "",
                record_ids: []
            },
            errorParams: {
                form_id: false
            },
            initialData: {
                form_id: "",
                description: "",
                record_ids: []
            },
            showErrorBorder: false,
            selectedAttachment: null,
            showConfirmation: false
        };
    }

    componentDidMount = async () => {
        const { formParams, initialData } = this.state;
        const { formDetails, selectedFormRecords, selectedForm } = this.props;
        if (selectedForm) {
            await this.setState({
                formParams: {
                    ...formParams,
                    form_id: formDetails.form_id || "",
                    description: formDetails.description || "",
                    record_ids: selectedFormRecords || []
                },
                initialData: {
                    ...initialData,
                    procedure_id: formDetails.procedure_id || "",
                    description: formDetails.description || "",
                    document_ids: [...selectedFormRecords] || []
                }
            });
        }
    };

    componentDidUpdate = async (prevProps, prevState) => {
        const { selectedFormRecords } = this.props;
        if (prevProps.selectedFormRecords !== selectedFormRecords) {
            const { formParams } = this.state;
            await this.setState({
                formParams: {
                    ...formParams,
                    record_ids: selectedFormRecords || []
                }
            });
        }
    };

    validate = () => {
        const { formParams } = this.state;
        let errorParams = {
            form_id: false
        };
        let showErrorBorder = false;
        if (!formParams.form_id || !formParams.form_id.trim().length) {
            errorParams.form_id = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });

        if (showErrorBorder) return false;

        return true;
    };

    saveActivityEvent = () => {
        const { formParams } = this.state;
        const { saveForm } = this.props;
        if (this.validate()) {
            saveForm({ form: formParams });
        }
    };

    updateForm = () => {
        const { formParams } = this.state;
        const { updateForm } = this.props;
        if (this.validate()) {
            updateForm({ form: formParams });
        }
    };

    removeAttachmentOnConfirm = async () => {
        const { removeAttachment } = this.props;
        const { selectedAttachment } = this.state;
        await removeAttachment(selectedAttachment.id);
        this.removeUnsavedAttachment(selectedAttachment.record_id);
        this.toggleDleteDocConfirmation();
    };

    removeAttachment = item => {
        this.setState({
            selectedAttachment: item
        });
        this.toggleDleteDocConfirmation();
    };

    toggleDleteDocConfirmation = () => {
        const { showDeleteDocConfirmModal } = this.state;
        this.setState({
            showDeleteDocConfirmModal: !showDeleteDocConfirmModal
        });
    };

    renderDeleteDocConfirmationModal = () => {
        const { showDeleteDocConfirmModal } = this.state;
        if (!showDeleteDocConfirmModal) return null;

        return (
            <Portal
                body={
                    <ConfirmationModal
                        onCancel={this.toggleDleteDocConfirmation}
                        onOk={this.removeAttachmentOnConfirm}
                        heading={"Do you want to Continue ?"}
                        paragraph={"This action can not be reverted, Do you want to continue?"}
                    />
                }
                onCancel={this.toggleDleteDocConfirmation}
            />
        );
    };

    getFormRecordId = form_record_id => {
        const { formDetails } = this.props;
        let formRecordId = null;
        let formRecordObj = null;
        if (formDetails.form_records && formDetails.form_records.length) {
            formRecordObj = formDetails.form_records.find(item => item.id === form_record_id);
            if (formRecordObj) {
                formRecordId = formRecordObj.id;
            }
        }
        return formRecordId;
    };

    isNotSved = form_record_id => {
        const { formDetails } = this.props;
        if (formDetails.records && formDetails.records.length) {
            if (formDetails.records.find(item => item.record_id === form_record_id)) return false;
        }
        return true;
    };

    removeUnsavedAttachment = id => {
        const { selectedFormRecords } = this.props;
        let tempSelectedRecords = selectedFormRecords;
        tempSelectedRecords = tempSelectedRecords.filter(item => item !== id);
        this.props.UpdateSelectedFormRecords(tempSelectedRecords);
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
                        onOk={this.cancelModal}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    cancelModal = () => {
        if (this.state.showConfirmModal) {
            this.setState({ showConfirmModal: false });
            this.props.onCancel();
        } else if (_.isEqual(this.state.initialData, this.state.formParams)) {
            this.props.onCancel();
        } else {
            this.setState({ showConfirmModal: true });
        }
    };

    render() {
        const {
            onCancel,
            toggleShowActivityEventDocumentsModal,
            formDetails,
            selectedFormRecords,
            formRecords,
            selectedForm = null,
            viewOnly = false
        } = this.props;
        const { formParams, showErrorBorder, errorParams } = this.state;
        return (
            <React.Fragment>
                <div className="modal activity-event-modal procedure-modal" role="dialog" style={{ display: "block" }} id="modalId">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader
                                title={`${viewOnly ? "" : selectedForm ? "Edit" : "Add"} Form`}
                                onCancel={this.cancelModal}
                                modalClass="procedure-modal"
                            />
                            <div className="modal-body">
                                <div className="frm-ara">
                                    <div className="row">
                                        <div className="col-md-12 pr-0">
                                            <div className="row m-0">
                                                <div className="col-md-6 pl-0 mb-3">
                                                    <div className="form-group">
                                                        <label className={showErrorBorder && errorParams.form_id ? "text-red" : ""}>Form Id *</label>
                                                        <input
                                                            type="text"
                                                            autocomplete="off"
                                                            readOnly={viewOnly}
                                                            className="form-control"
                                                            placeholder="Form Id"
                                                            value={formParams.form_id}
                                                            onChange={e => {
                                                                this.setState({
                                                                    formParams: {
                                                                        ...formParams,
                                                                        form_id: e.target.value
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6 pl-0 mb-3">
                                                    <div className="form-group">
                                                        <label className="form-control-placeholder">Description</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Description"
                                                            readOnly={viewOnly}
                                                            autocomplete="off"
                                                            value={formParams.description}
                                                            onChange={e => {
                                                                this.setState({
                                                                    formParams: {
                                                                        ...formParams,
                                                                        description: e.target.value
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
                                <div className="table-sec">
                                    <div className="table-hed">
                                        <h3>Records</h3>
                                        {!viewOnly ? (
                                            <div className="file-up" onClick={() => toggleShowActivityEventDocumentsModal()}>
                                                <span className="icon">
                                                    <span className="material-icons"> attach_file </span>
                                                </span>
                                                Attach Record
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="table-section">
                                        <div className="table-data">
                                            <table className="table table-bordered file-system-table">
                                                <thead>
                                                    <tr>
                                                        <th className="img-sq-box">
                                                            <img alt="" src="/images/table-blue-dots.svg" />
                                                        </th>
                                                        <th className="doc-name">File Name</th>
                                                        <th className="doc-type">Record Type</th>
                                                        <th className="up-date">Date Uploaded</th>
                                                        <th className="up-by">Uploaded By</th>
                                                        <th className="action">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {formDetails && formDetails.records && formDetails.records.length
                                                        ? formDetails.records.map((item, i) => (
                                                              <tr>
                                                                  <td className="img-sq-box">
                                                                      <img alt="" src="/images/table-dot-white.svg" />
                                                                  </td>
                                                                  <td>{item.name || "-"}</td>
                                                                  <td>{item.record_type || "-"}</td>
                                                                  <td>{item.date_uploaded || "-"}</td>
                                                                  <td>{item.uploaded_by || "-"}</td>
                                                                  <td>
                                                                      <div className="action-btn">
                                                                          <a href={item.url} target="_blank" className="btn btn-view">
                                                                              View Record
                                                                          </a>
                                                                          {!viewOnly ? (
                                                                              <button
                                                                                  className="btn btn-delete"
                                                                                  onClick={() => this.removeAttachment(item)}
                                                                              >
                                                                                  <span className="material-icons">delete</span>
                                                                              </button>
                                                                          ) : null}
                                                                      </div>
                                                                  </td>
                                                              </tr>
                                                          ))
                                                        : null}
                                                    {selectedFormRecords && selectedFormRecords.length && formRecords.length
                                                        ? formRecords.map((item, i) => (
                                                              <>
                                                                  {selectedFormRecords.includes(item.id) && this.isNotSved(item.id) ? (
                                                                      <tr>
                                                                          <td className="img-sq-box">
                                                                              <img alt="" src="/images/table-dot-white.svg" />
                                                                          </td>
                                                                          <td>{item.name || "-"}</td>
                                                                          <td>{item.record_type || "-"}</td>
                                                                          <td>{item.date_uploaded || "-"}</td>
                                                                          <td>{item.uploaded_by || "-"}</td>
                                                                          <td>
                                                                              <div className="action-btn">
                                                                                  <a href={item.url} target="_blank" className="btn btn-view">
                                                                                      View Record
                                                                                  </a>
                                                                                  {!viewOnly ? (
                                                                                      <button
                                                                                          className="btn btn-delete"
                                                                                          onClick={() => this.removeUnsavedAttachment(item.id)}
                                                                                      >
                                                                                          <span className="material-icons">close</span>
                                                                                      </button>
                                                                                  ) : null}
                                                                              </div>
                                                                          </td>
                                                                      </tr>
                                                                  ) : null}
                                                              </>
                                                          ))
                                                        : null}
                                                    {selectedFormRecords &&
                                                    !selectedFormRecords.length &&
                                                    formDetails &&
                                                    formDetails.records &&
                                                    !formDetails.records.length ? (
                                                        <tr>
                                                            <td className="text-center" colSpan="8">
                                                                No records found !!
                                                            </td>
                                                        </tr>
                                                    ) : null}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {!viewOnly ? (
                                    <div className="btn-sec btn-survey-sec">
                                        <div className="btn-out-1">
                                            {selectedForm ? (
                                                <button className="btn btn-create save mr-2" onClick={() => this.updateForm()}>
                                                    <i className="material-icons tic"> check</i> Update
                                                </button>
                                            ) : (
                                                <button className="btn btn-create save mr-2" onClick={() => this.saveActivityEvent()}>
                                                    <i className="material-icons tic"> check</i> Save
                                                </button>
                                            )}
                                            <button className="btn btn-cncl-back ml-2" onClick={() => this.cancelModal()}>
                                                <i className="material-icons tic"> close</i>Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
                {this.renderConfirmationModal()}
                {this.renderDeleteDocConfirmationModal()}
            </React.Fragment>
        );
    }
}

export default FormModal;
