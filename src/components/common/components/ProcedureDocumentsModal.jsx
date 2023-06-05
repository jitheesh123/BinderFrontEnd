import React, { Component } from "react";
import Highlighter from "react-highlight-words";

import BuildModalHeader from "./BuildModalHeader";
class ProcedureDocumentsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDocuments: [],
            showErrorMessage: false,
            procedureDocuments: props.procedureDocuments,
            docSearchKey: ""
        };
    }

    componentDidMount = async () => {};

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.procedureDocuments !== this.props.procedureDocuments) {
            await this.setState({
                procedureDocuments: this.props.procedureDocuments
            });
            this.searchInDocuments(this.state.docSearchKey);
        }
    };

    selectAllDocs = async () => {
        const { procedureDocuments } = this.state;
        let tempDocuments = [];
        if (!this.isAllSelected()) {
            tempDocuments = procedureDocuments.map(item => item.id);
        }
        await this.setState({
            selectedDocuments: tempDocuments
        });
    };

    updateSelectedSurveyDocuments = async docId => {
        const { selectedDocuments } = this.state;
        let tempDocuments = selectedDocuments;
        if (tempDocuments.length) {
            if (tempDocuments.includes(docId)) {
                tempDocuments = tempDocuments.filter(item => item !== docId);
            } else {
                tempDocuments.push(docId);
            }
        } else {
            tempDocuments.push(docId);
        }
        await this.setState({
            selectedDocuments: tempDocuments
        });
    };

    setDoctype = doc_type => {
        this.setState({ doc_type });
    };

    isAllSelected = () => {
        const { procedureDocuments } = this.state;
        const { selectedDocuments } = this.state;
        if (selectedDocuments.length && selectedDocuments.length === procedureDocuments.length) {
            return true;
        }
        return false;
    };

    attachSelectedDocuments = async () => {
        const { selectedDocuments } = this.state;
        const { attachSelectedDocuments } = this.props;
        if (selectedDocuments.length) {
            attachSelectedDocuments(selectedDocuments);
        } else {
            await this.setState({
                showErrorMessage: "Please select attachment!"
            });
        }
    };

    searchInDocuments = async docSearchKey => {
        const { procedureDocuments } = this.props;
        let result = procedureDocuments;

        if (docSearchKey.trim().length) {
            result = result.filter(
                ({ date_uploaded, name, uploaded_by }) =>
                    (date_uploaded && date_uploaded.toLowerCase().includes(docSearchKey.toLowerCase())) ||
                    (name && name.toLowerCase().includes(docSearchKey.toLowerCase())) ||
                    (uploaded_by && uploaded_by.toLowerCase().includes(docSearchKey.toLowerCase()))
            );
        }
        await this.setState({
            docSearchKey,
            procedureDocuments: result
        });
    };

    render() {
        const { onCancel, toggleShowUploadDocumentModal, selectedSurveyDocuments } = this.props;
        const { doc_type, selectedDocuments, showErrorMessage, docSearchKey, procedureDocuments } = this.state;
        let docCount = 0;
        if (procedureDocuments && procedureDocuments.length) {
            procedureDocuments.map(item => !selectedSurveyDocuments.includes(item.id) && docCount++);
        }
        return (
            <React.Fragment>
                <div className="modal acti-evt-doc" role="dialog" style={{ display: "block" }} id="modalId">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader title="Procedure Documents" onCancel={onCancel} modalClass="acti-evt-doc" />

                            <div className="modal-body">
                                <div className="table-sec">
                                    <div className="table-hed">
                                        <h3>Documents</h3>
                                        <span className="icon">
                                            <img src="assets/images/filter-off.svg" className="fl-on" alt="" />
                                        </span>
                                        <div className="sr-sec search-section">
                                            <div className="sr-out">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    onChange={e => this.searchInDocuments(e.target.value)}
                                                    placeholder="Search"
                                                    value={docSearchKey}
                                                />
                                                <span
                                                    className="clear-btn"
                                                    onClick={() => (docSearchKey.trim().length ? this.searchInDocuments("") : null)}
                                                >
                                                    Clear
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table-section">
                                        <div className="table-data">
                                            <table className="table table-bordered file-system-table">
                                                <thead>
                                                    <tr>
                                                        <th className="img-sq-box">
                                                            <div className="custom-control custom-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="custom-control-input"
                                                                    id="customCheckAll"
                                                                    checked={this.isAllSelected()}
                                                                />
                                                                <label
                                                                    className="custom-control-label"
                                                                    for="customCheckAll"
                                                                    onClick={() => this.selectAllDocs()}
                                                                ></label>
                                                            </div>
                                                        </th>
                                                        <th className="doc-name">File Name</th>
                                                        <th className="date-sign">Date Uploaded</th>
                                                        <th className="date-sign">Uploaded By</th>
                                                        <th className="action"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {procedureDocuments && procedureDocuments.length
                                                        ? procedureDocuments.map((item, i) => (
                                                              <>
                                                                  {!selectedSurveyDocuments.includes(item.id) ? (
                                                                      <tr key={i}>
                                                                          <td className="img-sq-box">
                                                                              <div className="custom-control custom-checkbox">
                                                                                  <input
                                                                                      type="checkbox"
                                                                                      className="custom-control-input"
                                                                                      id={`customCheck${i}`}
                                                                                      checked={selectedDocuments.includes(item.id)}
                                                                                  />
                                                                                  <label
                                                                                      onClick={() => this.updateSelectedSurveyDocuments(item.id)}
                                                                                      className="custom-control-label"
                                                                                      for={`customCheck${i}`}
                                                                                  ></label>
                                                                              </div>
                                                                          </td>
                                                                          <td>
                                                                              <Highlighter
                                                                                  textToHighlight={item.name || "-"}
                                                                                  searchWords={[`${docSearchKey}`]}
                                                                                  className="highlighter"
                                                                              />
                                                                          </td>
                                                                          <td>
                                                                              <Highlighter
                                                                                  textToHighlight={item.date_uploaded || "-"}
                                                                                  searchWords={[`${docSearchKey}`]}
                                                                                  className="highlighter"
                                                                              />
                                                                          </td>
                                                                          <td>
                                                                              <Highlighter
                                                                                  textToHighlight={item.uploaded_by || "-"}
                                                                                  searchWords={[`${docSearchKey}`]}
                                                                                  className="highlighter"
                                                                              />
                                                                          </td>
                                                                          <td>
                                                                              <div className="action-btn">
                                                                                  <a href={item.url} target="_blank" className="btn btn-view">
                                                                                      View Document
                                                                                  </a>
                                                                              </div>
                                                                          </td>
                                                                      </tr>
                                                                  ) : null}
                                                              </>
                                                          ))
                                                        : null}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="popup-counter">Count : {docCount || 0}</div>
                                    </div>
                                </div>

                                <div className="btn-sec btn-survey-sec">
                                    <div className="btn-out-1 justify-content-between">
                                        <button className="btn btn-create save mr-2" onClick={() => this.attachSelectedDocuments()}>
                                            <i className="material-icons tic"> check</i> Attach Selected Documents
                                        </button>
                                        {showErrorMessage && !selectedDocuments.length ? <div className="text-red">{showErrorMessage}</div> : null}
                                        <button className="btn btn-create email mr-2" onClick={() => toggleShowUploadDocumentModal(doc_type)}>
                                            <i className="material-icons tic"> check</i> Upload New Documents
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ProcedureDocumentsModal;
