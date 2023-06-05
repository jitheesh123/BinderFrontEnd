import React, { Component } from "react";
// import DatePicker from "react-date-picker";
import DatePicker from "react-datepicker";
import moment from "moment";

import BuildModalHeader from "../BuildModalHeader";
import EventTabActions from "./EventTabActions";
import ComingSoon from "../ComingSoon";
import "react-datepicker/dist/react-datepicker.css";

class EmptyEventFormModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 1
        };
    }

    setActiveTab = async activeTab => {
        await this.setState({
            activeTab
        });
    };

    render() {
        const {
            onCancel,
            selectedEventDetails: { frequency },
            selectedEventDetails,
            showCreateActivityEventSchedule,
            handleActivityEventClick
        } = this.props;
        const { activeTab } = this.state;

        return (
            <React.Fragment>
                <div
                    className="modal basic-form activity-event-modal event-detail-modal empty-event-modal"
                    role="dialog"
                    style={{ display: "block" }}
                    id="modalId"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" id="aep-tab-contents">
                            <BuildModalHeader title={"Activity Event"} onCancel={() => onCancel()} modalClass="empty-event-modal" />
                            <div className="modal-body">
                                <div className="tab-section">
                                    <ul>
                                        <li className={`cursor-pointer ${activeTab === 1 ? "active" : null}`} onClick={() => this.setActiveTab(1)}>
                                            <span className="numb">01</span>
                                            <span className="nme">Basic Info</span>
                                        </li>
                                        <li className={`cursor-pointer ${activeTab === 2 ? "active" : null}`} onClick={() => this.setActiveTab(2)}>
                                            <span className="numb">02</span>
                                            <span className="nme">Assigned Procedures</span>
                                        </li>
                                        <li className={`cursor-pointer ${activeTab === 3 ? "active" : null}`} onClick={() => this.setActiveTab(3)}>
                                            <span className="numb">03</span>
                                            <span className="nme">Assigned Forms</span>
                                        </li>
                                    </ul>
                                    <EventTabActions
                                        onCancel={onCancel}
                                        handleActivityEventClick={handleActivityEventClick}
                                        showCreateActivityEventSchedule={showCreateActivityEventSchedule}
                                        selectedEventDetails={selectedEventDetails}
                                        startDate={null}
                                    />
                                </div>
                                <div className="aep-tab-contents empty-event-container">
                                    <div className="content-area">
                                        <div className="lst-bt-nav fire-sytem-otr">
                                            <div className="col-md-12 coming-soon-outer">
                                                <div className="coming-soon-img">
                                                    <img src="/images/coming-soon.svg" alt="" />
                                                </div>
                                                <h3>EMPTY EVENT</h3>
                                                <h4>No Events Scheduled For {frequency === "weekly" ? "This Week" : "Today"}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="btn-sec btn-survey-sec">
                                        <div className="btn-out-1">
                                            <button className="btn btn-cncl-back ml-2" onClick={() => onCancel()()}>
                                                <i className="material-icons tic"> close</i>Cancel
                                            </button>
                                        </div>
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

export default EmptyEventFormModal;
