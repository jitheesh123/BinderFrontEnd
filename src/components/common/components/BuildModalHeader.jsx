import React from "react";
import DragM from "dragm";

class BuildModalHeader extends React.Component {
    updateTransform = transformStr => {
        this.modalDom.style.transform = transformStr;
    };
    componentDidMount() {
        const { modalClass } = this.props;
        this.modalDom = document.getElementsByClassName(modalClass)[0];
    }
    render() {
        const { title, onCancel } = this.props;
        return (
            <DragM updateTransform={this.updateTransform}>
                <div className="modal-header">
                    <h4 className="modal-title title-cap">{title}</h4>
                    <button type="button" className="close" data-dismiss="modal" onClick={() => onCancel()}>
                        <i className="material-icons">close </i>
                    </button>
                </div>
            </DragM>
        );
    }
}

export default BuildModalHeader;
