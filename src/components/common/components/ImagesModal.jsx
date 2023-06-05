import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import _ from "lodash";

import ConfirmationModal from "./ConfirmationModal";
import Portal from "./Portal";
// import Loader from "./Loader";
// import { API_ROUTE } from "../../../../src/config/constants";

class InfoImages extends Component {
    state = {
        uploadAttachmentsHeader: "Add",
        uploadAttachment: [],
        tempAttachment: {},
        uploadError: "",
        fileChanged: false,
        isUploading: false,
        missingRequiredFields: false,
        isInvalidFile: false,
        showConfirmModal: false,
        selectedImage: null,
        isUpdate: null
    };

    isIterable = obj => {
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === "function";
    };

    handleAddAttachment = e => {
        this.setState({
            uploadError: ""
        });
        if (this.isIterable(e.target.files)) {
            if (e.target.files.length) {
                this.setState({
                    uploadAttachmentsHeader: "Add"
                });
            }
            Object.values(e.target.files).map((attachment, i) => {
                let ext = attachment.name.split(".").pop();
                const acceptableExt = ["png", "jpg", "ttf", "jpeg", "svg"];
                if (acceptableExt.includes(ext.toLowerCase())) {
                    if (attachment.size < 5000000) {
                        this.setState({
                            attachmentChanged: true,
                            tempAttachment: { file: e.target.files[0], comments: "" }
                        });
                    } else {
                        this.setState({
                            uploadError: "File is too big. Files with size greater than 5MB is not allowed."
                        });
                    }
                } else {
                    this.setState({
                        attachmentChanged: false,
                        uploadError: "* Accepts images only !!!"
                    });
                }
            });
        }
    };

    deleteAttachment = async () => {
        await this.props.deleteImage(this.state.selectedImage);
        this.setState({ showConfirmModal: false });
        this.setState({
            tempAttachment: {},
            isUploading: false,
            missingRequiredFields: false,
            isUpdate: null
        });
    };

    handleDeleteAttachment = async id => {
        this.setState({
            showConfirmModal: true,
            selectedImage: id
        });
    };

    handleUpdateComment = async () => {
        this.setState({
            isUploading: true
        });
        const { tempAttachment } = this.state;
        if (!tempAttachment.comments) {
            this.setState({
                isUploading: false,
                missingRequiredFields: true
            });
            return false;
        }

        await this.props.updateImage({
            id: tempAttachment.id,
            description: tempAttachment.comments
        });

        await this.setState({
            tempAttachment: {},
            isUploading: false,
            missingRequiredFields: false
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this Image?"}
                        paragraph={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onCancel={() => this.setState({ showConfirmModal: false })}
                        onOk={this.deleteAttachment}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    addImage = async () => {
        const { handleAddImage } = this.props;
        this.setState({
            isUploading: true
        });
        const { tempAttachment, uploadAttachment } = this.state;
        if (!(tempAttachment.file && tempAttachment.comments)) {
            this.setState({
                isUploading: false,
                missingRequiredFields: true
            });
            return false;
        }
        await this.props.uploadImages(tempAttachment);
        await this.setState({
            uploadAttachment: [...uploadAttachment, tempAttachment],
            tempAttachment: {},
            isUploading: false,
            missingRequiredFields: false
        });
    };

    handleDescription = e => {
        const { tempAttachment } = this.state;
        this.setState({
            tempAttachment: {
                ...tempAttachment,
                comments: e.target.value
            }
        });
    };

    render() {
        const { tempAttachment, isUploading, missingRequiredFields, uploadError, isUpdate } = this.state;
        const { onCancel, imageList, img_desc } = this.props;

        return (
            <React.Fragment>
                <div className="modal upload-fle" role="dialog" style={{ display: "block" }} id="myModal">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" onClick={onCancel}>
                                    <i className="material-icons">close </i>
                                </button>
                            </div>
                            <div className="modal-body region-otr">
                                <div className="otr-add-img">
                                    <div className="add-imges col-md-6 p-0">
                                        <h3>Add Images</h3>
                                        <div className="innr-img">
                                            <label className=" drag-otr cursor-pointer" for="attachmentFiles">
                                                {!_.isEmpty(tempAttachment) && tempAttachment.file ? (
                                                    <>
                                                        <img
                                                            src={
                                                                tempAttachment.file.url
                                                                    ? tempAttachment.file.url
                                                                    : URL.createObjectURL(tempAttachment.file)
                                                            }
                                                            alt=""
                                                        />
                                                        <p>{tempAttachment.file && tempAttachment.file.name}</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className={`${missingRequiredFields && !tempAttachment.file ? "text-red" : ""}`}>
                                                            Click to upload
                                                        </p>
                                                    </>
                                                )}
                                            </label>
                                            <div className="text-center">
                                                <small className="text-danger">{uploadError}</small>
                                            </div>
                                            <div className="col-md-12 upldFile btnAddCam p-0">
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    id="attachmentFiles"
                                                    name="profilePic"
                                                    onChange={this.handleAddAttachment}
                                                />
                                            </div>
                                            <div className="comments form-group">
                                                <div className="col-md-12 formInp p-0 cmntImg">
                                                    <label className={`${missingRequiredFields && !tempAttachment.comments ? "text-red" : ""}`}>
                                                        Caption
                                                    </label>
                                                    <textarea
                                                        className={`form-control`}
                                                        placeholder="Enter Caption"
                                                        value={tempAttachment.comments || ""}
                                                        onChange={e => this.handleDescription(e)}
                                                    ></textarea>
                                                </div>
                                            </div>
                                            <div className="upld-otr d-flex">
                                                {!isUploading ? (
                                                    !isUpdate ? (
                                                        <button className="custom-file-uploadd cursor-pointer" onClick={() => this.addImage()}>
                                                            Add Image
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <label
                                                                className="btn btn-light mr-2"
                                                                onClick={() =>
                                                                    this.setState({
                                                                        tempAttachment: {},
                                                                        isUpdate: null
                                                                    })
                                                                }
                                                            >
                                                                Cancel
                                                            </label>
                                                            <label
                                                                className="custom-file-uploadd cursor-pointer"
                                                                onClick={() => this.handleUpdateComment()}
                                                            >
                                                                Update Comment
                                                            </label>
                                                        </>
                                                    )
                                                ) : (
                                                    <button className="custom-file-uploadd cursor-pointer">
                                                        <div className="spinner-border cus-spin text-primary" role="status"></div>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="upload-fle col-md-6 p-0">
                                        <h3>Uploaded Files</h3>
                                        <div className="files">
                                            {(imageList && imageList.length) ||
                                            (imageList && imageList.length && imageList[0].id && !this.state.attachmentChanged)
                                                ? imageList.map((item, i) => (
                                                      <div
                                                          key={i}
                                                          className={`${tempAttachment.id === item.id ? "active " : ""}fl-dtl cursor-pointer`}
                                                          onClick={() =>
                                                              this.setState({
                                                                  tempAttachment: {
                                                                      comments: item.description,
                                                                      id: item.id,
                                                                      file: { name: item.name, url: `${item.url}` }
                                                                  },
                                                                  isUpdate: item.id
                                                              })
                                                          }
                                                      >
                                                          <span className="material-icons"> done </span>
                                                          <div className="img-otr">
                                                              <p className="img-nme">{item.name}</p>
                                                          </div>
                                                          <i
                                                              className="fas fa-trash cursor-pointer"
                                                              onClick={() => this.handleDeleteAttachment(item.id)}
                                                          >
                                                              <span className="material-icons trash">delete </span>
                                                          </i>
                                                      </div>
                                                  ))
                                                : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.renderConfirmationModal()}
            </React.Fragment>
        );
    }
}

export default withRouter(InfoImages);
