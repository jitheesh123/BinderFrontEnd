import React, { Component } from "react";
import Highlighter from "react-highlight-words";

import BuildModalHeader from "./BuildModalHeader";

class ActivityEventDocumentsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doc_type: "event",
            selectedDocuments: [],
            selectedEventDocuments: [],
            selectedCorrectedDocuments: [],
            showErrorMessage: false,
            logbookDocuments: props.logbookDocuments,
            docSearchKey: ""
        };
    }

    componentDidMount = async () => {};

    componentDidUpdate = async prevProps => {
        if (prevProps.logbookDocuments !== this.props.logbookDocuments) {
            await this.setState({
                logbookDocuments: this.props.logbookDocuments
            });
            this.searchInDocuments(this.state.docSearchKey);
        }
    };

    selectAllDocs = async () => {
        const { doc_type } = this.state;
        const { logbookDocuments } = this.state;

        if (this.isAllSelected()) {
            if (doc_type === "event") {
                await this.setState({
                    selectedEventDocuments: []
                });
            } else {
                await this.setState({
                    selectedCorrectedDocuments: []
                });
            }
            logbookDocuments.map(item => {
                if (item.doc_type === doc_type) {
                    this.updateSelectedSurveyDocuments(item.id);
                }
            });
        } else {
            logbookDocuments.map(item => {
                if (item.doc_type === doc_type) {
                    this.updateSelectedSurveyDocuments(item.id);
                }
            });
        }
    };

    updateSelectedSurveyDocuments = async docId => {
        const { selectedDocuments, selectedEventDocuments, selectedCorrectedDocuments, doc_type } = this.state;
        let tempDocuments = selectedDocuments;
        let tempEventDocuments = selectedEventDocuments;
        let tempCorrectedDocuments = selectedCorrectedDocuments;
        if (tempDocuments.length) {
            if (tempDocuments.includes(docId)) {
                tempDocuments = tempDocuments.filter(item => item !== docId);
            } else {
                tempDocuments.push(docId);
            }
        } else {
            tempDocuments.push(docId);
        }

        if (doc_type === "event") {
            if (tempEventDocuments.length) {
                if (tempEventDocuments.includes(docId)) {
                    tempEventDocuments = tempEventDocuments.filter(item => item !== docId);
                } else {
                    tempEventDocuments.push(docId);
                }
            } else {
                tempEventDocuments.push(docId);
            }
        } else {
            if (tempCorrectedDocuments.length) {
                if (tempCorrectedDocuments.includes(docId)) {
                    tempCorrectedDocuments = tempCorrectedDocuments.filter(item => item !== docId);
                } else {
                    tempCorrectedDocuments.push(docId);
                }
            } else {
                tempCorrectedDocuments.push(docId);
            }
        }

        await this.setState({
            selectedDocuments: tempDocuments,
            selectedEventDocuments: tempEventDocuments,
            selectedCorrectedDocuments: tempCorrectedDocuments
        });
    };

    searchInDocuments = async docSearchKey => {
        const { logbookDocuments } = this.props;
        let result = logbookDocuments;

        if (docSearchKey.trim().length) {
            result = result.filter(
                ({ date_signed, date_uploaded, name, signed_by, uploaded_by }) =>
                    (date_signed && date_signed.toLowerCase().includes(docSearchKey.toLowerCase())) ||
                    (date_uploaded && date_uploaded.toLowerCase().includes(docSearchKey.toLowerCase())) ||
                    (name && name.toLowerCase().includes(docSearchKey.toLowerCase())) ||
                    (signed_by && signed_by.toLowerCase().includes(docSearchKey.toLowerCase())) ||
                    (uploaded_by && uploaded_by.toLowerCase().includes(docSearchKey.toLowerCase()))
            );
        }
        await this.setState({
            docSearchKey,
            logbookDocuments: result
        });
    };

    setDoctype = doc_type => {
        this.setState({ doc_type });
    };

    isAllSelected = () => {
        const { logbookDocuments } = this.state;
        const { doc_type, selectedEventDocuments, selectedCorrectedDocuments } = this.state;
        let eventDocumentsCount = logbookDocuments.filter(item => item.doc_type === "event").length;
        let correctedDocumentsCount = logbookDocuments.filter(item => item.doc_type === "corrected").length;
        if (doc_type === "event") {
            if (selectedEventDocuments.length && eventDocumentsCount === selectedEventDocuments.length) {
                return true;
            }
        } else {
            if (selectedCorrectedDocuments.length && correctedDocumentsCount === selectedCorrectedDocuments.length) {
                return true;
            }
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

    render() {
        const { onCancel, toggleShowUploadDocumentModal, selectedSurveyDocuments } = this.props;
        const { doc_type, selectedDocuments, showErrorMessage, docSearchKey, logbookDocuments } = this.state;
        let docCount = 0;
        if (logbookDocuments && logbookDocuments.length) {
            logbookDocuments.map(item => item.doc_type === doc_type && !selectedSurveyDocuments.includes(item.id) && docCount++);
        }

        return (
            <React.Fragment>
                <div className="modal acti-evt-doc" role="dialog" style={{ display: "block" }} id="modalId">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader title="Activity Event Documents" onCancel={onCancel} modalClass="acti-evt-doc" />

                            <div className="modal-body">
                                <div className="tag-radio">
                                    <div className="custom-control custom-radio cursor-pointer">
                                        <input
                                            type="radio"
                                            className="custom-control-input"
                                            id="event"
                                            name="doc_type"
                                            checked={doc_type === "event"}
                                            onClick={() => this.setDoctype("event")}
                                        />
                                        <label className="custom-control-label cursor-pointer" for="event">
                                            Event Documents
                                        </label>
                                    </div>
                                    <div className="custom-control custom-radio cursor-pointer">
                                        <input
                                            type="radio"
                                            className="custom-control-input"
                                            id="corrected"
                                            name="doc_type"
                                            checked={doc_type === "corrected"}
                                            onClick={() => this.setDoctype("corrected")}
                                        />
                                        <label className="custom-control-label cursor-pointer" for="corrected">
                                            Corrected Documents
                                        </label>
                                    </div>
                                </div>
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
                                                        <th className="sign-by">Date Signed</th>
                                                        <th className="up-date">Signed By</th>
                                                        <th className="action"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {logbookDocuments.length
                                                        ? logbookDocuments.map((item, i) => (
                                                              <>
                                                                  {item.doc_type === doc_type && !selectedSurveyDocuments.includes(item.id) ? (
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
                                                                              <Highlighter
                                                                                  textToHighlight={item.date_signed || "-"}
                                                                                  searchWords={[`${docSearchKey}`]}
                                                                                  className="highlighter"
                                                                              />
                                                                          </td>
                                                                          <td>
                                                                              <Highlighter
                                                                                  textToHighlight={item.signed_by || "-"}
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

export default ActivityEventDocumentsModal;
