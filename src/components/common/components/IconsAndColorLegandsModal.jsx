import React, { Component } from "react";
import BuildModalHeader from "./BuildModalHeader";

import { fastTooltips, generatorTooltips, firedrillsTooltips } from "../../../config/utils";
class IconsAndColorLegandsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            optionForDuplicateFiles: [
                { name: "Skip duplicates", value: "Skip duplicates" },
                { name: "Overwrite existing files", value: "Overwrite existing files" },
                { name: "Add as a copy", value: "Add as a copy" }
            ],
            documents: [],
            tempDocuments: [],
            diplecateFiles: "Add as a copy"
        };
    }

    componentDidMount = async () => {};

    handleAddAttachment = async e => {
        await this.setState({
            tempDocuments: [...this.state.tempDocuments, ...e.target.files]
        });
    };

    deleteAttachment = async index => {
        let fileArray = Object.values(this.state.tempDocuments);
        fileArray.splice(index, 1);
        if (!fileArray.length) {
            await this.setState({
                tempDocuments: []
            });
        }
        await this.setState({
            tempDocuments: fileArray
        });
    };

    handleUploadFile = () => {
        const { tempDocuments, diplecateFiles } = this.state;
        const { activeDocType } = this.props;
        this.props.handleUploadFile(tempDocuments, diplecateFiles, activeDocType);
    };

    render() {
        const { onCancel, selectedLogbook } = this.props;
        let textContents = null;

        if (selectedLogbook.logbook_type && selectedLogbook.logbook_type === "FAST") {
            textContents = fastTooltips;
        } else if (selectedLogbook.logbook_type && selectedLogbook.logbook_type === "Fire-Drills") {
            textContents = firedrillsTooltips;
        } else if (selectedLogbook.logbook_type && selectedLogbook.logbook_type === "Generator") {
            textContents = generatorTooltips;
        }

        return (
            <React.Fragment>
                <div className="modal color-legand-modal" role="dialog" style={{ display: "block" }} id="modalId">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader title="Icons and color legend" onCancel={onCancel} modalClass="color-legand-modal" />
                            <div className="modal-body">
                                <div className="btn-three-otr">
                                    <div className="box-layer-otr">
                                        <div className="icon-layer border-highlight" style={{ backgroundColor: "#BFFFBF" }}>
                                            <div className="badge-white badge-plus">
                                                <img alt="" src="/images/plus-icn.svg" />
                                            </div>
                                        </div>
                                        <div className="right-content">Add Survey in Threshold</div>
                                    </div>
                                    <div className="box-layer-otr">
                                        <div className="icon-layer" style={{ backgroundColor: "#DBFCC7" }}>
                                            <div className="badge-white badge-plus">
                                                <img alt="" src="/images/plus-icn.svg" />
                                            </div>
                                        </div>
                                        <div className="right-content">Add Survey</div>
                                    </div>
                                    <div className="box-layer-otr">
                                        <div className="icon-layer" style={{ backgroundColor: "#F59089" }}>
                                            <div className="badge-white badge-plus">
                                                <img alt="" src="/images/plus-icn-red.svg" />
                                            </div>
                                        </div>
                                        <div className="right-content">Add Overdue Survey</div>
                                    </div>
                                    <div className="box-layer-otr">
                                        <div className="icon-layer"></div>
                                        <div className="right-content">Active / Selected item</div>
                                    </div>
                                </div>
                                <div className="btn-three-otr btn-three-layer">
                                    <div className="box-layer-otr">
                                        <div className="icon-layer green"></div>
                                        <div className="right-content">{textContents.completed || "-"}</div>
                                    </div>
                                    <div className="box-layer-otr">
                                        <div className="icon-layer green-warn-hash">
                                            <div className="badge-white badge-warning">
                                                <img alt="" src="/images/warning-green.svg" />
                                            </div>
                                        </div>
                                        <div className="right-content">{textContents["warning-green.svg"] || "-"}</div>
                                    </div>
                                    {selectedLogbook.logbook_type !== "Fire-Drills" ? (
                                        <div className="box-layer-otr">
                                            <div className="icon-layer green-warn-hash">
                                                <div className="badge-white badge-hash">
                                                    <img alt="" src="/images/hashtag-green.svg" />
                                                </div>
                                            </div>
                                            <div className="right-content">{textContents["hashtag-green.svg"] || "-"}</div>
                                        </div>
                                    ) : null}
                                </div>
                                <div className="btn-three-otr btn-three-layer-1 flex-wrap">
                                    <div className="box-layer-otr">
                                        <div className="icon-layer red-warn">
                                            <div className="badge-white badge-warning">
                                                <img alt="" src="/images/warning-red.svg" />
                                            </div>
                                        </div>
                                        <div className="right-content">{textContents["warning-red.svg"] || "-"}</div>
                                    </div>
                                    <div className="box-layer-otr">
                                        <div className="icon-layer red">
                                            <div className="badge-white badge-calendar">
                                                <img alt="" src="/images/calendar-red.svg" />
                                            </div>
                                        </div>
                                        <div className="right-content">{textContents["calendar-red.svg"] || "-"}</div>
                                    </div>
                                    <div className="box-layer-otr">
                                        <div className="icon-layer red-doc">
                                            <div className="badge-white badge-attach">
                                                <img alt="" src="/images/attach-red.svg" />
                                            </div>
                                        </div>
                                        <div className="right-content">{textContents["attach-red.svg"] || "-"}</div>
                                    </div>
                                    {selectedLogbook.logbook_type === "Fire-Drills" ? (
                                    <div className="box-layer-otr">
                                    <div className="icon-layer red">
                                        <div className="badge-white badge-calendar">
                                            <img alt="" src="/images/clock-icon.svg" />
                                        </div>
                                    </div>
                                    <div className="right-content">{textContents["clock-icon.svg"] || "-"}</div>
                                </div>
                                    ) : null}
                                    {selectedLogbook.logbook_type !== "Fire-Drills" ? (
                                        <div className="box-layer-otr">
                                            <div className="icon-layer red-hash">
                                                <div className="badge-white badge-hash">
                                                    <img alt="" src="/images/hashtag-red.svg" />
                                                </div>
                                            </div>
                                            <div className="right-content">{textContents["hashtag-red.svg"] || "-"}</div>
                                        </div>
                                    ) : null}
                                    {selectedLogbook.has_asset === "yes" ? (
                                        <React.Fragment>
                                            <div className="box-layer-otr">
                                                <div className="icon-layer red-hash">
                                                    <div className="badge-white badge-hash">
                                                        <img alt="" src="/images/failed-run.svg" />
                                                    </div>
                                                </div>
                                                <div className="right-content">{textContents["failed-run.svg"] || "-"}</div>
                                            </div>
                                            <div className="box-layer-otr">
                                                <div className="icon-layer green-warn-hash">
                                                    <div className="badge-white badge-hash">
                                                        <img alt="" src="/images/corrected-failed-run.svg" />
                                                    </div>
                                                </div>
                                                <div className="right-content">{textContents["corrected-failed-run.svg"] || "-"}</div>
                                            </div>

                                            <div className="box-layer-otr">
                                                <div className="icon-layer red-hash">
                                                    <div className="badge-white badge-hash">
                                                        <img alt="" src="/images/failed-transfer.svg" />
                                                    </div>
                                                </div>
                                                <div className="right-content">{textContents["failed-transfer.svg"] || "-"}</div>
                                            </div>
                                            <div className="box-layer-otr">
                                                <div className="icon-layer green-warn-hash">
                                                    <div className="badge-white badge-hash">
                                                        <img alt="" src="/images/corrected-failed-transfer.svg" />
                                                    </div>
                                                </div>
                                                <div className="right-content">{textContents["corrected-failed-transfer.svg"] || "-"}</div>
                                            </div>

                                            <div className="box-layer-otr">
                                                <div className="icon-layer red-hash">
                                                    <div className="badge-white badge-hash">
                                                        <img alt="" src="/images/failed-load.svg" />
                                                    </div>
                                                </div>
                                                <div className="right-content">{textContents["failed-load.svg"] || "-"}</div>
                                            </div>
                                            <div className="box-layer-otr">
                                                <div className="icon-layer green-warn-hash">
                                                    <div className="badge-white badge-hash">
                                                        <img alt="" src="/images/corrected-failed-load.svg" />
                                                    </div>
                                                </div>
                                                <div className="right-content">{textContents["corrected-failed-load.svg"] || "-"}</div>
                                            </div>

                                            <div className="box-layer-otr">
                                                <div className="icon-layer red-hash">
                                                    <div className="badge-white badge-hash">
                                                        <img alt="" src="/images/other-failure.svg" />
                                                    </div>
                                                </div>
                                                <div className="right-content">{textContents["other-failure.svg"] || "-"}</div>
                                            </div>
                                            <div className="box-layer-otr">
                                                <div className="icon-layer green-warn-hash">
                                                    <div className="badge-white badge-hash">
                                                        <img alt="" src="/images/corrected-other-failure.svg" />
                                                    </div>
                                                </div>
                                                <div className="right-content">{textContents["corrected-other-failure.svg"] || "-"}</div>
                                            </div>
                                        </React.Fragment>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default IconsAndColorLegandsModal;
