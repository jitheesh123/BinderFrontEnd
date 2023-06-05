/* eslint-disable array-callback-return */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import ImagesModal from "./ImagesModal";
import Portal from "./Portal";
import ImageViewModal from "./ImageViewModal";

class InfoImages extends Component {
    state = {
        uploadAttachmentsHeader: "Add",
        uploadAttachment: [],
        uploadError: "",
        fileChanged: false,
        showImagesModal: false,
        isLoading: true,
        showImageModal: false,
        imageList: [],
        selectedImage: ""
    };

    componentDidMount = async () => {
        document.addEventListener("keydown", this.handleKeyPress);
        await this.refreshImageList();
    };

    componentWillUnmount = () => {
        document.removeEventListener("keydown", this.handleKeyPress);
    };

    refreshImageList = async () => {
        await this.props.getAllImageList(this.props.match.params.id);
        const { imageResponse } = this.props;
        let imageResult = imageResponse
            ? imageResponse.filter((img, i) => {
                  if (img.default_image) {
                      img.index = i;
                      return img;
                  }
              })
            : [];
        if (imageResponse && imageResponse.length === 1 && !imageResponse[0].default_image) {
            this.defaultImageHandler(imageResponse[0], true);
        }
        await this.setState({
            imageList: imageResponse,
            selectedImage: {
                image: (imageResult && imageResult[0]) || (imageResponse && imageResponse[0]),
                index: imageResult && imageResult.length ? imageResult[0].index : 0
            },
            isLoading: false
        });
    };

    handleKeyPress = e => {
        const { selectedImage, imageList } = this.state;
        if (e.keyCode === 39 || e.keyCode === 40) {
            e.preventDefault();
            this.setSelectedImage(selectedImage.index === imageList.length - 1 ? 0 : selectedImage.index + 1);
            this.scrollImageList(selectedImage.index === imageList.length - 1 ? 0 : selectedImage.index + 1);
        } else if (e.keyCode === 37 || e.keyCode === 38) {
            e.preventDefault();
            this.setSelectedImage(selectedImage.index === 0 ? imageList.length - 1 : selectedImage.index - 1);
            this.scrollImageList(selectedImage.index === 0 ? imageList.length - 1 : selectedImage.index - 1);
        }
    };

    toggleImagesModal = () => {
        this.setState({
            showImagesModal: !this.state.showImagesModal
        });
    };

    scrollElement = area => {
        area === 1 ? document.getElementById("sliderSection").scrollBy(0, -50) : document.getElementById("sliderSection").scrollBy(0, 50);
    };

    scrollImageList = id => {
        let elmnt = document.getElementById(`img_id_${id}`);

        elmnt && elmnt.scrollIntoView();
    };
    defaultImageHandler = async (item, state) => {
        this.setState({
            isLoading: true
        });
        const param = {
            id: item.id,
            description: item.description,
            default: state
        };
        await this.updateImage(param);
    };

    openImageModal = () => {
        this.setState({
            showImageModal: true
        });
    };

    closeImageModal = () => {
        this.setState({
            showImageModal: false
        });
    };
    uploadImages = async imageData => {
        this.setState({
            isloading: true
        });
        await this.props.uploadImages(imageData);
        await this.refreshImageList();
    };

    deleteImage = async imageId => {
        this.setState({
            isloading: true
        });
        await this.props.deleteImages(imageId);
        await this.refreshImageList();
    };

    updateImage = async imageData => {
        this.setState({
            isloading: true
        });
        await this.props.updateImageComment(imageData);
        await this.refreshImageList();
    };
    setSelectedImage = async i => {
        const { imageList } = this.state;
        await this.setState({
            selectedImage: { image: imageList[i], index: i }
        });
    };

    render() {
        const { imagesDetails, showImagesModal, selectedImage, imageList, showImageModal } = this.state;

        return (
            <React.Fragment>
                {showImageModal ? (
                    <Portal body={<ImageViewModal imgData={selectedImage.image} onCancel={this.closeImageModal} />} onCancel={this.closeImageModal} />
                ) : null}

                <div className="frm-ara">
                    <div className="tab-active location-sec img-dt">
                        {imageList && imageList.length ? (
                            <div className="head-edit">
                                <button className="btn btn-edit " onClick={() => this.toggleImagesModal()}>
                                    <img src="/images/edit-gry.svg" alt="" />
                                    Edit
                                </button>
                            </div>
                        ) : null}
                        <div className="image-sec pt-3">
                            <div className="col-md-2 sld-left">
                                <ul id="sliderSection" className={`${imageList && imageList.length > 4 ? "slide-sec-scroll " : ""}slide-sec`}>
                                    {imageList && imageList.length ? (
                                        <div>
                                            {imageList.map((item, i) => (
                                                <li
                                                    id={`img_id_${i}`}
                                                    key={i}
                                                    onClick={() => this.setSelectedImage(i)}
                                                    className={`${
                                                        selectedImage.image && item.id === selectedImage.image.id ? "active-img " : ""
                                                    } cursor-pointer `}
                                                >
                                                    <img src={`${item.url}`} alt="" />
                                                    <div className="img-default-outer">
                                                        <label className="container-check">
                                                            <input
                                                                type="checkbox"
                                                                checked={item.default_image ? "check" : ""}
                                                                onChange={() => this.defaultImageHandler(item, item.default_image ? false : true)}
                                                            />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                    </div>
                                                </li>
                                            ))}
                                        </div>
                                    ) : (
                                        <>
                                            <li className="no-img">
                                                <img src="/images/no-img.png" alt="" />
                                            </li>
                                            <li className="no-img">
                                                <img src="/images/no-img.png" alt="" />
                                            </li>
                                            <li className="no-img">
                                                <img src="/images/no-img.png" alt="" />
                                            </li>
                                            <li className="no-img">
                                                <img src="/images/no-img.png" alt="" />
                                            </li>
                                        </>
                                    )}
                                </ul>
                                <div className="carousel-controls">
                                    <label className="prev-slide cursor-pointer">
                                        <span>
                                            <img src="/images/up-chevron.svg" onClick={() => this.scrollElement(1)} alt="" />
                                        </span>
                                    </label>
                                    <label className="next-slide cursor-pointer">
                                        <span>
                                            <img src="/images/down-chevron.svg" onClick={() => this.scrollElement(2)} alt="" />
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <div className="col pr-0">
                                <div className="outer-sldr">
                                    <div className="sld-rgt">
                                        {imageList && imageList.length ? (
                                            <div className="carousel imgCrsr">
                                                <ul className="slides">
                                                    <li className="slide-container">
                                                        <div className="slide-image">
                                                            <div
                                                                className="bg-slide-img"
                                                                style={{ backgroundImage: `url(${selectedImage.image.url}` }}
                                                            ></div>
                                                            <div className="img-slde">
                                                                <img
                                                                    src={`${selectedImage.image.url}`}
                                                                    onClick={() => this.openImageModal()}
                                                                    alt=""
                                                                />
                                                            </div>
                                                            {selectedImage && selectedImage.image.description ? (
                                                                <div className="sub-cont">
                                                                    <h4>{selectedImage.image.description}</h4>
                                                                </div>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </div>
                                                    </li>
                                                    <label
                                                        className="prev-slide cursor-pointer"
                                                        onClick={() => {
                                                            this.setSelectedImage(
                                                                selectedImage.index === 0 ? imageList.length - 1 : selectedImage.index - 1
                                                            );
                                                            this.scrollImageList(
                                                                selectedImage.index === 0 ? imageList.length - 1 : selectedImage.index - 1
                                                            );
                                                        }}
                                                    >
                                                        <span>
                                                            <i className="material-icons">keyboard_arrow_left</i>
                                                        </span>
                                                    </label>
                                                    <label
                                                        className="next-slide cursor-pointer"
                                                        onClick={() => {
                                                            this.setSelectedImage(
                                                                selectedImage.index === imageList.length - 1 ? 0 : selectedImage.index + 1
                                                            );
                                                            this.scrollImageList(
                                                                selectedImage.index === imageList.length - 1 ? 0 : selectedImage.index + 1
                                                            );
                                                        }}
                                                    >
                                                        <span>
                                                            <i className="material-icons">keyboard_arrow_right</i>
                                                        </span>
                                                    </label>
                                                </ul>
                                            </div>
                                        ) : (
                                            <div className="no-data">
                                                <h3>Images not avialable please upload now</h3>
                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                                <button className="addLoc" onClick={() => this.toggleImagesModal()}>
                                                    Upload Image
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {showImagesModal ? (
                    <Portal
                        body={
                            <ImagesModal
                                uploadImages={this.uploadImages}
                                deleteImage={this.deleteImage}
                                updateImage={this.updateImage}
                                imageList={imageList}
                                locationDetails={imagesDetails}
                                onCancel={() => this.toggleImagesModal()}
                            />
                        }
                        onCancel={() => this.toggleImagesModal()}
                    />
                ) : null}
            </React.Fragment>
        );
    }
}

export default withRouter(InfoImages);
