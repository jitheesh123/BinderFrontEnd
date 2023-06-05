/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from "react";
import _ from "lodash";

import BuildModalHeader from "./BuildModalHeader";
import ConfirmationModal from "./ConfirmationModal";
import Portal from "./Portal";

class ProcedureModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            surveyDetails: {},
            formParams: {
                procedure_id: "",
                description: "",
                document_ids: []
            },
            errorParams: {
                procedure_id: false
            },
            showErrorBorder: false,
            initialData: {
                procedure_id: "",
                description: "",
                document_ids: []
            },
            showConfirmModal: false,
            showDeleteDocConfirmModal: false,
            selectedAttachment: null
        };
    }

    componentDidMount = async () => {
        const { formParams, initialData } = this.state;
        const { surveyDetails, selectedSurveyDocuments, selectedProcedure } = this.props;
        if (selectedProcedure) {
            await this.setState({
                formParams: {
                    ...formParams,
                    procedure_id: surveyDetails.procedure_id || "",
                    description: surveyDetails.description || "",
                    document_ids: selectedSurveyDocuments || []
                },
                initialData: {
                    ...initialData,
                    procedure_id: surveyDetails.procedure_id || "",
                    description: surveyDetails.description || "",
                    document_ids: [...selectedSurveyDocuments] || []
                }
            });
        }
    };

    componentDidUpdate = async (prevProps, prevState) => {
        const { selectedSurveyDocuments } = this.props;
        if (prevProps.selectedSurveyDocuments !== selectedSurveyDocuments) {
            const { formParams } = this.state;
            await this.setState({
                formParams: {
                    ...formParams,
                    document_ids: selectedSurveyDocuments || []
                }
            });
        }
    };

    validate = () => {
        const { formParams } = this.state;
        let errorParams = {
            procedure_id: false
        };
        let showErrorBorder = false;
        if (!formParams.procedure_id || !formParams.procedure_id.trim().length) {
            errorParams.procedure_id = true;
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
        const { saveProcedure } = this.props;
        if (this.validate()) {
            saveProcedure({ procedure: formParams });
        }
    };

    updateProcedure = () => {
        const { formParams } = this.state;
        const { updateProcedure } = this.props;
        if (this.validate()) {
            updateProcedure({ procedure: formParams });
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

    getSurveyDocId = procedure_document_id => {
        const { surveyDetails } = this.props;
        let surveyDocId = null;
        let surDocObj = null;
        if (surveyDetails.survey_documents && surveyDetails.survey_documents.length) {
            surDocObj = surveyDetails.survey_documents.find(item => item.id === procedure_document_id);
            if (surDocObj) {
                surveyDocId = surDocObj.id;
            }
        }
        return surveyDocId;
    };

    isNotSved = procedure_document_id => {
        const { surveyDetails } = this.props;
        if (surveyDetails.documents && surveyDetails.documents.length) {
            if (surveyDetails.documents.find(item => item.document_id === procedure_document_id)) return false;
        }
        return true;
    };

    removeUnsavedAttachment = id => {
        const { selectedSurveyDocuments } = this.props;
        let tempSelectedDocs = selectedSurveyDocuments;
        tempSelectedDocs = tempSelectedDocs.filter(item => item !== id);
        this.props.UpdateSelectedSurveyDocuments(tempSelectedDocs);
    };

    isDatePassed = threshold_end => {
        let today = new Date();
        if (new Date(threshold_end).setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)) {
            return true;
        }
        return false;
    };

    hasBorder = (threshold_start, threshold_end) => {
        return (
            new Date(threshold_start).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0) &&
            new Date(threshold_end).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)
        );
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
            toggleShowActivityEventDocumentsModal,
            surveyDetails,
            selectedSurveyDocuments,
            procedureDocuments,
            selectedProcedure = null,
            viewOnly = false
        } = this.props;

        const { formParams, showErrorBorder, errorParams } = this.state;
        return (
            <React.Fragment>
                <div className="modal activity-event-modal procedure-modal" role="dialog" style={{ display: "block" }} id="modalId">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader
                                title={`${viewOnly ? "" : selectedProcedure ? "Edit" : "Add"} Procedure`}
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
                                                        <label className={showErrorBorder && errorParams.procedure_id ? "text-red" : ""}>
                                                            Procedure Id *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            autocomplete="off"
                                                            readOnly={viewOnly}
                                                            className="form-control"
                                                            placeholder="Procedure Id"
                                                            value={formParams.procedure_id}
                                                            onChange={e => {
                                                                this.setState({
                                                                    formParams: {
                                                                        ...formParams,
                                                                        procedure_id: e.target.value
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
                                        <h3>Documents</h3>
                                        {!viewOnly ? (
                                            <div className="file-up" onClick={() => toggleShowActivityEventDocumentsModal()}>
                                                <span className="icon">
                                                    <span className="material-icons"> attach_file </span>
                                                </span>
                                                Attach File
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
                                                        <th className="doc-type">Document Type</th>
                                                        <th className="up-date">Date Uploaded</th>
                                                        <th className="up-by">Uploaded By</th>
                                                        <th className="action">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {surveyDetails && surveyDetails.documents && surveyDetails.documents.length
                                                        ? surveyDetails.documents.map((item, i) => (
                                                              <tr>
                                                                  <td className="img-sq-box">
                                                                      <img alt="" src="/images/table-dot-white.svg" />
                                                                  </td>
                                                                  <td>{item.name || "-"}</td>
                                                                  <td>{item.doc_type || "-"}</td>
                                                                  <td>{item.date_uploaded || "-"}</td>
                                                                  <td>{item.uploaded_by || "-"}</td>
                                                                  <td>
                                                                      <div className="action-btn">
                                                                          <a href={item.url} target="_blank" className="btn btn-view">
                                                                              View Document
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
                                                    {selectedSurveyDocuments &&
                                                    selectedSurveyDocuments.length &&
                                                    procedureDocuments &&
                                                    procedureDocuments.length
                                                        ? procedureDocuments.map((item, i) => (
                                                              <>
                                                                  {selectedSurveyDocuments.includes(item.id) && this.isNotSved(item.id) ? (
                                                                      <tr>
                                                                          <td className="img-sq-box">
                                                                              <img alt="" src="/images/table-dot-white.svg" />
                                                                          </td>
                                                                          <td>{item.name || "-"}</td>
                                                                          <td>{item.doc_type || "-"}</td>
                                                                          <td>{item.date_signed || "-"}</td>
                                                                          <td>{item.signed_by || "-"}</td>
                                                                          <td>{item.date_uploaded || "-"}</td>
                                                                          <td>{item.uploaded_by || "-"}</td>
                                                                          <td>
                                                                              <div className="action-btn">
                                                                                  <a href={item.url} target="_blank" className="btn btn-view">
                                                                                      View Document
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
                                                    {selectedSurveyDocuments && !selectedSurveyDocuments.length ? (
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
                                            {selectedProcedure ? (
                                                <button className="btn btn-create save mr-2" onClick={() => this.updateProcedure()}>
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
                    {this.renderConfirmationModal()}
                    {this.renderDeleteDocConfirmationModal()}
                </div>
            </React.Fragment>
        );
    }
}

export default ProcedureModal;
