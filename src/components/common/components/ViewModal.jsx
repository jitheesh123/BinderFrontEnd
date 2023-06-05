import React, { Component } from "react";
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
        const { title, onCancel, handleDropdownChange, viewFilter } = this.props;
        return (
            <DragM updateTransform={this.updateTransform}>
                <div className="modal-header">
                    <div className="d-flex head-sec-view">
                        <h4 className="modal-title">{title}</h4>
                        <div className="inp-group">
                            <select className="form-control" onChange={e => handleDropdownChange(e)} value={viewFilter}>
                                <option value="all">All</option>
                                <option value="visible">Visible</option>
                                <option value="inVisible">Not Visible</option>
                            </select>
                        </div>
                    </div>
                    <button type="button" className="close" data-dismiss="modal" onClick={onCancel}>
                        <i className="material-icons">close </i>
                    </button>
                </div>
            </DragM>
        );
    }
}
class ViewModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewFilter: "all",
            keyList: this.props.keys,
            searchKey: ""
        };
    }

    handleDropdownChange = (event = null) => {
        const { config } = this.props;
        let tempKeys = this.props.keys;
        let dropDownValue = (event && event.target && event.target.value) || this.state.viewFilter;
        if (dropDownValue === "visible") {
            tempKeys = tempKeys.filter(keyItem => config[keyItem].isVisible === true);
        } else if (dropDownValue === "inVisible") {
            tempKeys = tempKeys.filter(keyItem => config[keyItem].isVisible === false);
        }
        if (this.state.searchKey && this.state.searchKey.trim().length) {
            tempKeys = tempKeys.filter(
                keyItem =>
                    config[keyItem] &&
                    config[keyItem].label &&
                    config[keyItem].label.toString().toLowerCase().includes(this.state.searchKey.toLowerCase())
            );
        }
        this.setState({
            keyList: tempKeys,
            viewFilter: dropDownValue
        });
    };

    isAllSelected = () => {
        const { config, keys } = this.props;
        let count = 0;
        keys.map(keyItem => {
            if (config[keyItem].isVisible) {
                count++;
            }
        });
        if (keys.length === count) {
            return true;
        }
        return false;
    };

    handleHideColumn = async keyItem => {
        await this.props.handleHideColumn(keyItem);
        this.handleDropdownChange();
    };

    handleSearch = event => {
        const { config } = this.props;
        let tempKeys = this.props.keys;
        let searchValue = (event && event.target && event.target.value) || this.state.searchKey;
        if (searchValue && searchValue.trim().length) {
            tempKeys = tempKeys.filter(keyItem => {
                return config[keyItem] && config[keyItem].label && config[keyItem].label.toString().toLowerCase().includes(searchValue.toLowerCase());
            });
        }
        if (this.state.viewFilter === "visible") {
            tempKeys = tempKeys.filter(keyItem => config[keyItem].isVisible === true);
        } else if (this.state.viewFilter === "inVisible") {
            tempKeys = tempKeys.filter(keyItem => config[keyItem].isVisible === false);
        }
        this.setState({
            keyList: tempKeys
        });
    };

    render() {
        const { keyList, viewFilter } = this.state;
        const { onCancel, config } = this.props;
        return (
            <React.Fragment>
                <div id="view-modal" className="modal view-detail-mod" style={{ display: "block" }} role="dialog">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader
                                modalClass="view-detail-mod"
                                title="View Details"
                                onCancel={onCancel}
                                viewFilter={this.state.viewFilter}
                                handleDropdownChange={this.handleDropdownChange}
                            />

                            <div className="modal-body">
                                <div className="content-outer">
                                    <div className="sr-sec search-section">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search"
                                            onChange={async e => {
                                                await this.setState({
                                                    searchKey: e.target.value
                                                });
                                                this.handleSearch(e);
                                            }}
                                            value={this.state.searchKey}
                                        />
                                        <button type="submit" className="btn btn-search">
                                            <img src="/images/serach.svg" />
                                        </button>
                                    </div>
                                    <div className="containter-check d-flex flex-wrap">
                                        {keyList.length ? (
                                            <>
                                                {viewFilter === "all" ? (
                                                    <>
                                                        <div className="outer-check col-md-6">
                                                            <div className="custom-control custom-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="custom-control-input"
                                                                    checked={this.isAllSelected()}
                                                                    onChange={() =>
                                                                        this.handleHideColumn(this.isAllSelected() ? "deselectAll" : "selectAll")
                                                                    }
                                                                    id="customCheck"
                                                                />
                                                                <label className="custom-control-label" for="customCheck">
                                                                    Select All
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6"></div>
                                                    </>
                                                ) : null}
                                                {keyList.map((keyItem, i) => (
                                                    <div key={i} className="outer-check col-md-6">
                                                        <div className="custom-control custom-checkbox">
                                                            <input
                                                                type="checkbox"
                                                                className="custom-control-input"
                                                                checked={config[keyItem].isVisible}
                                                                onChange={() => this.handleHideColumn(keyItem)}
                                                                id={`column${i}`}
                                                            />
                                                            <label className="custom-control-label" for={`column${i}`}>
                                                                {config[keyItem].label}
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        ) : (
                                            <div className="col-md-12 text-center mt-5">No records found!</div>
                                        )}
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

export default ViewModal;
