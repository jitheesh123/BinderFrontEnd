import React, { Component } from "react";
import BuildModalHeader from "../../../common/components/BuildModalHeader";

class UploadRecordModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            optionForDuplicateRecords: [
                { name: "Skip duplicates", value: "Skip duplicates" },
                { name: "Overwrite existing files", value: "Overwrite existing files" },
                { name: "Add as a copy", value: "Add as a copy" }
            ],
            documents: [],
            tempRecords: [],
            duplicateRecords: "Add as a copy"
        };
    }

    componentDidMount = async () => { };

    handleAddAttachment = async e => {
        await this.setState({
            tempRecords: [...this.state.tempRecords, ...e.target.files]
        });
    };

    deleteAttachment = async index => {
        let fileArray = Object.values(this.state.tempRecords);
        fileArray.splice(index, 1);
        if (!fileArray.length) {
            await this.setState({
                tempRecords: []
            });
        }
        await this.setState({
            tempRecords: fileArray
        });
    };

    handleUploadFile = () => {
        const { tempRecords, duplicateRecords } = this.state;
        this.props.handleUploadFile(tempRecords, duplicateRecords);
    };

    render() {
        const { onCancel } = this.props;
        const { optionForDuplicateRecords, duplicateRecords, tempRecords } = this.state;
        return (
            <React.Fragment>
                <div className="modal upload-documents" role="dialog" style={{ display: "block" }} id="modalId">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader title="Upload Documents" onCancel={onCancel} modalClass="upload-documents" />
                            <div className="modal-body">
                                <div className="box-section">
                                    <div className="col-md-7 form-itm">
                                        <div className="itm">
                                            <div className="form-group">
                                                <label>Options for Duplicate Records</label>
                                                <div className="custom-selecbox">
                                                    <select
                                                        className="custom-selecbox form-control"
                                                        onChange={e => this.setState({ duplicateRecords: e.target.value })}
                                                        value={duplicateRecords}
                                                    >
                                                        {optionForDuplicateRecords.map((item, i) => (
                                                            <option value={item.value}>{item.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="upload-sec">
                                    <div className="table-hed">
                                        <h3>Records</h3>
                                    </div>
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
                                                Select Records to Upload ..
                                            </label>
                                        </div>
                                        {tempRecords.length ? (
                                            <div className="upload-files-nme">
                                                {tempRecords.map((item, i) => (
                                                    <span className="badge-nme" key={i}>
                                                        <label>{item.name} </label>
                                                        <i className="material-icons close-icon" onClick={() => this.deleteAttachment(i)}>
                                                            close
                                                        </i>
                                                    </span>
                                                ))}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="btn-sec btn-survey-sec">
                                    <div className="btn-out-1">
                                        <button className="btn btn-create save" onClick={() => this.handleUploadFile()}>
                                            <i className="material-icons tic"> cloud_upload </i> Upload Records
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

export default UploadRecordModal;
