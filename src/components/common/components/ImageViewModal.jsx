import React, { Component } from "react";
import BuildModalHeader from "./BuildModalHeader";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
class ImageViewModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount = async () => {};

    render() {
        const { imgData, onCancel } = this.props;
        return (
            <React.Fragment>
                <div className="modal viem-image-modal" role="dialog" style={{ display: "block" }} id="modalId">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader title="" onCancel={onCancel} modalClass="viem-image-modal" />
                            <div className="modal-body">
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
                                                <img src={imgData.url} alt="" />
                                            </TransformComponent>
                                        </React.Fragment>
                                    )}
                                </TransformWrapper>
                                <h4 className="img-modal-desc">
                                    {imgData.description && imgData.description !== "undefined" ? imgData.description : imgData.name}
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ImageViewModal;
