/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Multiselect } from "multiselect-react-dropdown";
import LoadingOverlay from "react-loading-overlay";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import BuildModalHeader from "../../common/components/BuildModalHeader";
import actions from "../actions";
import ToastMsg from "../../common/ToastMessage";
import { getEntityForUrl } from "../../../config/utils";
import Loader from "../../common/components/Loader";

class SendEmailModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formParams: {
                subject: "",
                body: "",
                email_ids: [],
                attach_report: false,
                attachments: []
            },
            errorParams: {
                subject: false,
                email_ids: false
            },
            showErrorBorder: false,
            userList: [],
            selectedUsers: [],
            entity: getEntityForUrl(props.entity),
            isLoadingMultiSelect: false,
            isLoadingAttachment: false
        };
    }

    componentDidMount = async () => {
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        await this.props.getUserEmailLists({ ...master_filters });
        await this.setState({
            userList: this.props.emailReducer.userEmailList
        });
    };

    attachScreenshotFormEvent = async () => {
        const { formParams } = this.state;
        if (!formParams.attach_report) {
            await this.setState({
                isLoadingAttachment: true
            });
            await this.props.generateImageForEmail();
            const { isEventEmail = false, attachmentForEmail } = this.props;
            if (isEventEmail && attachmentForEmail) {
                await this.setState({
                    formParams: {
                        ...formParams,
                        attachments: [attachmentForEmail],
                        attach_report: true
                    },
                    isLoadingAttachment: false
                });
                let blobUrl = URL.createObjectURL(attachmentForEmail);
                let testImg = document.getElementById("testImg");
                testImg.src = blobUrl;
            }
        } else {
            await this.setState({
                formParams: {
                    ...formParams,
                    attachments: [],
                    attach_report: false
                },
                isLoadingAttachment: false
            });
        }
    };

    validate = () => {
        const { formParams } = this.state;
        let errorParams = {
            subject: false,
            email_ids: false
        };
        let showErrorBorder = false;
        if (!formParams.subject || !formParams.subject.trim().length) {
            errorParams.subject = true;
            showErrorBorder = true;
        }
        if (!formParams.email_ids.length) {
            errorParams.email_ids = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });

        if (showErrorBorder) return false;
        return true;
    };

    sendMailWithAttachment = async () => {
        const { formParams } = this.state;
        const { path } = this.props;
        if (this.validate()) {
            let params = new FormData();
            params.append("email[subject]", formParams.subject);
            params.append("email[body]", formParams.body);
            if (formParams.email_ids && formParams.email_ids.length) {
                formParams.email_ids.map((item, i) => params.append(`email[email_ids][]`, item));
            }
            if (formParams.attachments && formParams.attachments.length) {
                formParams.attachments.map((item, i) => params.append(`email[attachments][${i}]`, item));
            }
            await this.props.sendMailWithAttachment(params, path);
            ToastMsg(
                this.props.emailReducer.sendMailWithAttachmentResponse.message && this.props.emailReducer.sendMailWithAttachmentResponse.message,
                "info"
            );
            this.props.onCancel();
        }
    };

    sendMail = async () => {
        const { formParams, entity } = this.state;
        const { tableParams, reportParams, path, logbook_id = null } = this.props;
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));

        if (this.validate()) {
            let mailParams = {
                search: tableParams.search,
                filters: tableParams.filters,
                list: tableParams.list,
                order: tableParams.order,
                email: {
                    subject: formParams.subject,
                    body: formParams.body,
                    attach_report: formParams.attach_report,
                    email_ids: formParams.email_ids
                },
                ...master_filters
            };
            if (reportParams) {
                mailParams = { ...mailParams, ...reportParams };
            }
            if (logbook_id) {
                mailParams = { ...mailParams, logbook_id };
            }
            if (tableParams.report_type) {
                mailParams = { ...mailParams, report_type: tableParams.report_type };
            }
            await this.props.sendEmail(mailParams, entity, path);
            ToastMsg(this.props.emailReducer.sendEmailResponse.message && this.props.emailReducer.sendEmailResponse.message, "info");
            this.props.onCancel();
        }
    };

    onUserSelect = async selectedList => {
        const { formParams } = this.state;
        let tempUserList = [];
        selectedList.map(item => tempUserList.push(item.email));
        await this.setState({
            formParams: {
                ...formParams,
                email_ids: tempUserList
            },
            selectedUsers: selectedList
        });
    };

    selectAllUsers = async () => {
        await this.setState({
            isLoadingMultiSelect: true
        });
        const { userList, selectedUsers } = this.state;
        if (!(selectedUsers && userList && selectedUsers.length === userList.length)) {
            this.onUserSelect(userList);
        } else {
            this.onUserSelect([]);
        }
        await this.setState({
            isLoadingMultiSelect: false
        });
    };

    handleAddAttachment = async e => {
        await this.setState({
            formParams: {
                ...this.state.formParams,
                attachments: [...this.state.formParams.attachments, ...e.target.files]
            }
        });
    };

    deleteAttachment = async index => {
        let fileArray = Object.values(this.state.formParams.attachments);
        fileArray.splice(index, 1);
        if (!fileArray.length) {
            await this.setState({
                formParams: {
                    ...this.state.formParams,
                    attachments: []
                }
            });
        }
        await this.setState({
            formParams: {
                ...this.state.formParams,
                attachments: fileArray
            }
        });
    };

    render() {
        const { onCancel, hasAttachment = false, isEventEmail = false, attachmentForEmail = null } = this.props;
        const { formParams, userList, selectedUsers, errorParams, showErrorBorder, isLoadingMultiSelect, isLoadingAttachment } = this.state;

        return (
            <React.Fragment>
                <div className="modal activity-event-modal email-modal upload-documents" role="dialog" style={{ display: "block" }} id="modalId">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <LoadingOverlay fadeSpeed={0} active={isLoadingAttachment} spinner={<Loader />}>
                                <BuildModalHeader title={"Send Mail"} onCancel={onCancel} modalClass="email-modal" />
                                <div className="modal-body">
                                    <div className="frm-ara">
                                        <div className="row">
                                            <div className="col-md-12 pl-0">
                                                <div className="row m-0 send-email-contents">
                                                    <div className="col-md-12 pl-0 mb-3">
                                                        <div className="form-group">
                                                            <label className={showErrorBorder && errorParams.email_ids ? "text-red" : ""}>To*</label>
                                                            {userList && userList.length ? (
                                                                <div className="custom-control custom-checkbox to-all-checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="custom-control-input"
                                                                        id="customCheck"
                                                                        name="example1"
                                                                        checked={
                                                                            selectedUsers.length &&
                                                                            userList.length &&
                                                                            selectedUsers.length === userList.length
                                                                        }
                                                                        onChange={() => this.selectAllUsers()}
                                                                    />
                                                                    <label className="custom-control-label" for="customCheck">
                                                                        Select All Available Users
                                                                    </label>
                                                                </div>
                                                            ) : null}
                                                            <div className="custom-selecbox">
                                                                {!isLoadingMultiSelect ? (
                                                                    <Multiselect
                                                                        options={userList ? userList : []}
                                                                        selectedValues={selectedUsers}
                                                                        onSelect={this.onUserSelect}
                                                                        onRemove={this.onUserSelect}
                                                                        displayValue="email"
                                                                        showCheckbox={true}
                                                                        showArrow={true}
                                                                        closeOnSelect={false}
                                                                    />
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12 pl-0 mb-3">
                                                        <div className="form-group">
                                                            <label className={showErrorBorder && errorParams.subject ? "text-red" : ""}>
                                                                Subject*
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Subject"
                                                                value={formParams.subject}
                                                                onChange={e => {
                                                                    this.setState({
                                                                        formParams: {
                                                                            ...formParams,
                                                                            subject: e.target.value
                                                                        }
                                                                    });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12 pl-0 mb-3">
                                                        <div className="form-group">
                                                            <label>Description</label>
                                                            <textarea
                                                                type="text-area"
                                                                className="form-control"
                                                                placeholder="Description"
                                                                value={formParams.body}
                                                                onChange={e => {
                                                                    this.setState({
                                                                        formParams: {
                                                                            ...formParams,
                                                                            body: e.target.value
                                                                        }
                                                                    });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    {hasAttachment ? (
                                                        <div className="col-md-6 pl-0 mb-3">
                                                            <div class="custom-file">
                                                                <input
                                                                    type="file"
                                                                    multiple={true}
                                                                    className="custom-file-input"
                                                                    id="customFile"
                                                                    onChange={this.handleAddAttachment}
                                                                />
                                                                <label class="custom-file-label" for="customFile">
                                                                    Select files to attach ..
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="col-md-6 pl-0 mb-3">
                                                            <div className="form-group attach-report-container">
                                                                {isLoadingAttachment ? (
                                                                    <>
                                                                        <span className="spinner-border cus-spin text-primary" role="status"></span>
                                                                        &nbsp; Attaching...
                                                                    </>
                                                                ) : (
                                                                    <label className="container-check">
                                                                        Attach Report
                                                                        <input
                                                                            type="checkbox"
                                                                            className="cursor-pointer"
                                                                            checked={formParams.attach_report}
                                                                            onClick={e =>
                                                                                isEventEmail
                                                                                    ? this.attachScreenshotFormEvent()
                                                                                    : this.setState({
                                                                                          formParams: {
                                                                                              ...formParams,
                                                                                              attach_report: !formParams.attach_report
                                                                                          }
                                                                                      })
                                                                            }
                                                                        />
                                                                        <span className="checkmark cursor-pointer"></span>
                                                                    </label>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {isEventEmail && attachmentForEmail ? (
                                                        <div className="col-md-12 pl-0 mb-3">
                                                            <TransformWrapper defaultScale={1}>
                                                                {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                                                                    <React.Fragment>
                                                                        <div className="md-grp-btn">
                                                                            <button className="btn btn-top" onClick={() => zoomIn()}>
                                                                                <img src="/images/zoom-in.svg" alt="" />
                                                                            </button>
                                                                            <button className="btn btn-top" onClick={() => zoomOut()}>
                                                                                <img src="/images/zoom-out.svg" alt="" />
                                                                            </button>
                                                                        </div>
                                                                        <TransformComponent>
                                                                            <img src="" id="testImg" alt="" />
                                                                        </TransformComponent>
                                                                    </React.Fragment>
                                                                )}
                                                            </TransformWrapper>
                                                        </div>
                                                    ) : null}
                                                    {formParams.attachments.length ? (
                                                        <div className="col-md-12 pl-0 mb-3">
                                                            <div className="upload-sec">
                                                                <div className="table-hed">
                                                                    <h3>Attachments</h3>
                                                                </div>
                                                                <div className="form-group uplod-sec-fld p-2">
                                                                    <div className="upload-files-nme mt-0">
                                                                        {formParams.attachments.map((item, i) => (
                                                                            <span className="badge-nme" key={i}>
                                                                                <label>{item.name || "Event Screenshot "} </label>
                                                                                <i
                                                                                    className="material-icons close-icon"
                                                                                    onClick={() => this.deleteAttachment(i)}
                                                                                >
                                                                                    close
                                                                                </i>
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>

                                            <div class="btn-sec">
                                                <div class="btn-out-1">
                                                    <button
                                                        class="btn btn-create save mr-2"
                                                        onClick={() =>
                                                            isEventEmail || hasAttachment ? this.sendMailWithAttachment() : this.sendMail()
                                                        }
                                                    >
                                                        <i class="material-icons tic"> check</i> Send
                                                    </button>
                                                    <button class="btn btn-cncl-back ml-2" onClick={() => onCancel()}>
                                                        <i class="material-icons tic"> close</i>Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </LoadingOverlay>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { emailReducer } = state;
    return { emailReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(SendEmailModal));
