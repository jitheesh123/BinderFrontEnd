import React, { Component } from "react";
import BuildModalHeader from "./BuildModalHeader";
import { thousands_separators } from "../../../config/utils";

class ConfirmationModal extends Component {
    render() {
        const { heading, paragraph, onOk, onCancel, isLogRestore = false, okText = null, cancelText = null } = this.props;
        return (
            <React.Fragment>
                <div id="confirmModal" className="modal confirmModal" style={{ display: "block" }} role="dialog">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader title=" " onCancel={onCancel} modalClass="confirmModal" />
                            <div className="modal-body confirm-otr text-center">
                                <div className="qun-img">
                                    <img src="/images/qun.svg" alt="" />
                                </div>
                                <h3>{heading}</h3>
                                <h4>
                                    {isLogRestore ? (
                                        Object.entries(paragraph).map((data, index) => {
                                            return (
                                                <p>
                                                    The Value of Field <b>{data[0].replace("_id", "").replace(/_/g, " ")}</b> will restore to{" "}
                                                    <b>
                                                        {typeof data[1][0] === "number"
                                                            ? thousands_separators(data[1][0] && data[1][0].toString()) || "null"
                                                            : (data[1][0] && data[1][0].toString()) || "null"}
                                                    </b>
                                                </p>
                                            );
                                        })
                                    ) : (
                                        <>{paragraph}</>
                                    )}
                                </h4>
                                <div className="btn-sec">
                                    <button className="btn btn-cncl-back mr-2" onClick={() => onCancel()}>
                                        <i className="material-icons tic"> close</i>
                                        {cancelText ? cancelText : "No"}
                                    </button>
                                    <button className="btn btn-create" onClick={() => onOk()}>
                                        <i className="material-icons tic"> check</i>
                                        {okText ? okText : "Yes"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ConfirmationModal;
