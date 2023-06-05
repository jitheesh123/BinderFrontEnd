import React, { Component } from "react";
import Highlighter from "react-highlight-words";

import BuildModalHeader from "../../../common/components/BuildModalHeader";

class FormRecordsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRecords: [],
            showErrorMessage: false,
            formRecords: props.formRecords,
            docSearchKey: ""
        };
    }

    componentDidMount = async () => {};

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.formRecords !== this.props.formRecords) {
            await this.setState({
                formRecords: this.props.formRecords
            });
            this.searchInDocuments(this.state.docSearchKey);
        }
    };

    selectAllDocs = async () => {
        const { formRecords } = this.state;
        let tempRecords = [];
        if (!this.isAllSelected()) {
            tempRecords = formRecords.map(item => item.id);
        }
        await this.setState({
            selectedRecords: tempRecords
        });
    };

    updateSelectedFormRecords = async docId => {
        const { selectedRecords } = this.state;
        let tempRecords = selectedRecords;
        if (tempRecords.length) {
            if (tempRecords.includes(docId)) {
                tempRecords = tempRecords.filter(item => item !== docId);
            } else {
                tempRecords.push(docId);
            }
        } else {
            tempRecords.push(docId);
        }
        await this.setState({
            selectedRecords: tempRecords
        });
    };

    isAllSelected = () => {
        const { formRecords } = this.state;
        const { selectedRecords } = this.state;
        if (selectedRecords.length && selectedRecords.length === formRecords.length) {
            return true;
        }
        return false;
    };

    attachSelectedFormRecords = async () => {
        const { selectedRecords } = this.state;
        const { attachSelectedFormRecords } = this.props;
        if (selectedRecords.length) {
            attachSelectedFormRecords(selectedRecords);
        } else {
            await this.setState({
                showErrorMessage: "Please select attachment!"
            });
        }
    };

    searchInDocuments = async docSearchKey => {
        const { formRecords } = this.props;
        let result = formRecords;

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
            formRecords: result
        });
    };

    render() {
        const { onCancel, toggleShowUploadRecordModal, selectedFormRecords } = this.props;
        const { doc_type, selectedRecords, showErrorMessage, formRecords, docSearchKey } = this.state;
        let docCount = 0;
        if (formRecords && formRecords.length) {
            formRecords.map(item => !selectedFormRecords.includes(item.id) && docCount++);
        }
        return (
            <React.Fragment>
                <div className="modal acti-evt-doc" role="dialog" style={{ display: "block" }} id="modalId">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader title="Form Records" onCancel={onCancel} modalClass="acti-evt-doc" />

                            <div className="modal-body">
                                <div className="table-sec">
                                    <div className="table-hed">
                                        <h3>Records</h3>
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
                                                    {formRecords && formRecords.length
                                                        ? formRecords.map((item, i) => (
                                                              <>
                                                                  {!selectedFormRecords.includes(item.id) ? (
                                                                      <tr key={i}>
                                                                          <td className="img-sq-box">
                                                                              <div className="custom-control custom-checkbox">
                                                                                  <input
                                                                                      type="checkbox"
                                                                                      className="custom-control-input"
                                                                                      id={`customCheck${i}`}
                                                                                      checked={selectedRecords.includes(item.id)}
                                                                                  />
                                                                                  <label
                                                                                      onClick={() => this.updateSelectedFormRecords(item.id)}
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
                                                                                      View Record
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
                                        <button className="btn btn-create save mr-2" onClick={() => this.attachSelectedFormRecords()}>
                                            <i className="material-icons tic"> check</i> Attach Selected Records
                                        </button>
                                        {showErrorMessage && !selectedRecords.length ? <div className="text-red">{showErrorMessage}</div> : null}
                                        <button className="btn btn-create email mr-2" onClick={() => toggleShowUploadRecordModal(doc_type)}>
                                            <i className="material-icons tic"> check</i> Upload New Records
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

export default FormRecordsModal;
