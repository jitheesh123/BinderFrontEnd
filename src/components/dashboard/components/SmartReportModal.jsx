import React, { Component } from "react";

import BuildModalHeader from "../../common/components/BuildModalHeader";
import Reports from "../../smartReports/index";

class SmartReportModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount = async () => {};

    render() {
        const { onCancel, chart = "", item, view, refreshDashboardData } = this.props;
        return (
            <React.Fragment>
                <div className="modal activity-event-modal smart-report-modal" role="dialog" style={{ display: "block" }} id="modalId">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader
                                title={`${chart.replace(/_/g, " ")}(${item.replace(/_/g, " ")})`}
                                onCancel={onCancel}
                                modalClass="smart-report-modal"
                            />
                            <div className="modal-body">
                                <div className="infoPageContent">
                                    <div className="cmon-ara">
                                        <Reports chart={chart} item={item} view={view} refreshDashboardData={refreshDashboardData} />
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

export default SmartReportModal;
