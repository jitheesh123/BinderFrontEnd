import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Highlighter from "react-highlight-words";
import _ from "lodash";

import Portal from "./Portal";
import BuildModalHeader from "./BuildModalHeader";
import commonActions from "../actions";
import ConfirmationModal from "./ConfirmationModal";
import ToastMsg from "../ToastMessage";

class UpdateActivityConsultancyAssigmentModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 1,
            showCurrentAssignmentModal: false,
            consultancy: null,
            assigned_activities: [],
            inactive_activities: [],
            initial_assigned_activities: [],
            available_activities: [],
            currentAssignments: [],
            activity_ids: [],
            showConfirmation: false,
            availableSearchKey: "",
            inactiveSearchKey: "",
            assignedSearchKey: "",
            showCancelConfirmModal: false
        };
    }

    componentDidMount = async () => {
        await this.getAssignActivityForConsultancyPopupDetails();
    };

    getAssignActivityForConsultancyPopupDetails = async () => {
        const { consultancy_id } = this.props;
        await this.props.getAssignActivityForConsultancyPopupDetails(consultancy_id);
        const {
            commonReducer: {
                getAssignActivityForConsultancyPopupDetailsResponse: {
                    consultancy,
                    inactive_activities = [],
                    assigned_activities = [],
                    available_activities = [],
                    success
                }
            }
        } = this.props;
        if (success) {
            await this.setState({
                consultancy,
                assigned_activities,
                inactive_activities,
                available_activities,
                initial_assigned_activities: assigned_activities.map(item => item.id),
                activity_ids: assigned_activities.map(item => item.id)
            });
        }
        return true;
    };

    searchInAvailable = async availableSearchKey => {
        const {
            commonReducer: {
                getAssignActivityForConsultancyPopupDetailsResponse: { available_activities = [] }
            }
        } = this.props;

        const { assigned_activities } = this.state;
        let assignedActivityIds = assigned_activities.map(item => item.id);
        let result = available_activities.filter(item => !assignedActivityIds.includes(item.id));

        if (availableSearchKey.trim().length) {
            result = result.filter(
                ({ activity_description, logbook, deeming_agency, deeming_agency_frequency }) =>
                    (logbook && logbook.toLowerCase().includes(availableSearchKey.toLowerCase())) ||
                    (activity_description && activity_description.toLowerCase().includes(availableSearchKey.toLowerCase())) ||
                    (deeming_agency && deeming_agency.toLowerCase().includes(availableSearchKey.toLowerCase())) ||
                    (deeming_agency_frequency && deeming_agency_frequency.toLowerCase().includes(availableSearchKey.toLowerCase()))
            );
        }
        await this.setState({
            availableSearchKey,
            available_activities: result
        });
    };

    searchInInactive = async inactiveSearchKey => {
        const {
            commonReducer: {
                getAssignActivityForConsultancyPopupDetailsResponse: { inactive_activities = [] }
            }
        } = this.props;

        const { assigned_activities } = this.state;
        let assignedActivityIds = assigned_activities.map(item => item.id);
        let result = inactive_activities.filter(item => !assignedActivityIds.includes(item.id));

        if (inactiveSearchKey.trim().length) {
            result = result.filter(
                ({ activity_description, logbook, deeming_agency, deeming_agency_frequency }) =>
                    (logbook && logbook.toLowerCase().includes(inactiveSearchKey.toLowerCase())) ||
                    (activity_description && activity_description.toLowerCase().includes(inactiveSearchKey.toLowerCase())) ||
                    (deeming_agency && deeming_agency.toLowerCase().includes(inactiveSearchKey.toLowerCase())) ||
                    (deeming_agency_frequency && deeming_agency_frequency.toLowerCase().includes(inactiveSearchKey.toLowerCase()))
            );
        }
        await this.setState({
            inactiveSearchKey,
            inactive_activities: result
        });
    };

    searchInAssigned = async assignedSearchKey => {
        const {
            commonReducer: {
                getAssignActivityForConsultancyPopupDetailsResponse: { assigned_activities = [] }
            }
        } = this.props;

        const { available_activities } = this.state;
        let availableActivityIds = available_activities.map(item => item.id);
        let result = assigned_activities.filter(item => !availableActivityIds.includes(item.id));

        if (assignedSearchKey.trim().length) {
            result = result.filter(
                ({ activity_description, logbook, deeming_agency, deeming_agency_frequency }) =>
                    (logbook && logbook.toLowerCase().includes(assignedSearchKey.toLowerCase())) ||
                    (activity_description && activity_description.toLowerCase().includes(assignedSearchKey.toLowerCase())) ||
                    (deeming_agency && deeming_agency.toLowerCase().includes(assignedSearchKey.toLowerCase())) ||
                    (deeming_agency_frequency && deeming_agency_frequency.toLowerCase().includes(assignedSearchKey.toLowerCase()))
            );
        }
        await this.setState({
            assignedSearchKey,
            assigned_activities: result
        });
    };

    updateAsignedActivitiesForConsultancy = async () => {
        const { initial_assigned_activities, activity_ids } = this.state;
        const { onCancel } = this.props;
        if (_.isEqual(initial_assigned_activities.sort(), activity_ids.sort())) {
            onCancel();
            ToastMsg("Activities Assigned Successfully", "info");
        } else {
            this.togglShowConfirmation();
        }
    };

    onUpdateAssignedActivitiessConfrim = async () => {
        const { consultancy_id, onCancel } = this.props;
        const { initial_assigned_activities, activity_ids } = this.state;
        if (!_.isEqual(initial_assigned_activities.sort(), activity_ids.sort())) {
            await this.props.assignActivityToConsultancy(consultancy_id, activity_ids);
            const {
                commonReducer: {
                    assignActivityToConsultancyResponse: { success, message }
                }
            } = this.props;
            if (success) {
                await this.getAssignActivityForConsultancyPopupDetails();
                await this.props.updateAssignPopUpApiTrigger({ isTrigger: true });
                this.togglShowConfirmation();
                onCancel();
            }
            ToastMsg(message, "info");
        }
        return true;
    };

    togglShowConfirmation = () => {
        const { showConfirmation } = this.state;
        this.setState({
            showConfirmation: !showConfirmation
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmation } = this.state;
        if (!showConfirmation) return null;

        return (
            <Portal
                body={
                    <ConfirmationModal
                        onCancel={this.togglShowConfirmation}
                        onOk={this.onUpdateAssignedActivitiessConfrim}
                        heading={"Update Assignment?"}
                    />
                }
                onCancel={this.togglShowConfirmation}
            />
        );
    };

    updateAssignedList = async (type, id) => {
        const { assigned_activities, available_activities, inactive_activities } = this.state;
        let itemObj = {};
        let tempAssignedActivities = assigned_activities;
        let tempAvailableActivities = available_activities;
        let tempInactiveActivities = inactive_activities;
        let tempActivityIds = [];
        let tempAvailableActivityIds = available_activities.map(item => item.id);

        if (id === "all") {
            if (type === "add") {
                tempAvailableActivities.map(item => tempAssignedActivities.push(item));
                tempAvailableActivities = [];
                tempInactiveActivities = tempInactiveActivities.filter(item => !tempAvailableActivityIds.includes(item.id));
            } else {
                tempAssignedActivities.map(item => tempAvailableActivities.push(item));
                tempAssignedActivities.map(item => tempInactiveActivities.push(item));
                tempAssignedActivities = [];
            }
        } else {
            if (type === "add") {
                itemObj = available_activities.find(item => item.id === id);
                tempAssignedActivities.push(itemObj);
                tempAvailableActivities = tempAvailableActivities.filter(item => item.id !== id);
                tempInactiveActivities = tempInactiveActivities.filter(item => item.id !== id);
            } else {
                itemObj = assigned_activities.find(item => item.id === id);
                tempAvailableActivities.push(itemObj);
                tempInactiveActivities.push(itemObj);
                tempAssignedActivities = tempAssignedActivities.filter(item => item.id !== id);
            }
        }
        tempAssignedActivities = _.uniqBy(tempAssignedActivities, "id");
        tempAvailableActivities = _.uniqBy(tempAvailableActivities, "id");
        tempInactiveActivities = _.uniqBy(tempInactiveActivities, "id");
        tempActivityIds = tempAssignedActivities.map(item => item.id);

        await this.setState({
            assigned_activities: tempAssignedActivities,
            available_activities: tempAvailableActivities,
            inactive_activities: tempInactiveActivities,
            activity_ids: tempActivityIds
        });
    };

    cancelModal = () => {
        const { initial_assigned_activities, activity_ids, showCancelConfirmModal } = this.state;
        if (showCancelConfirmModal) {
            this.setState({ showCancelConfirmModal: false });
            this.props.onCancel();
        } else if (!_.isEqual(initial_assigned_activities.sort(), activity_ids.sort())) {
            this.setState({ showCancelConfirmModal: true });
        } else {
            this.props.onCancel();
        }
    };

    renderCancelConfirmationModal = () => {
        const { showCancelConfirmModal } = this.state;
        if (!showCancelConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to clear and lose all changes?"}
                        paragraph={"This action cannot be reverted, are you sure that you need to cancel?"}
                        onCancel={() => this.setState({ showCancelConfirmModal: false })}
                        onOk={this.cancelModal}
                    />
                }
                onCancel={() => this.setState({ showCancelConfirmModal: false })}
            />
        );
    };

    render() {
        const {
            activeTab,
            consultancy,
            assigned_activities,
            available_activities,
            inactive_activities,
            availableSearchKey,
            inactiveSearchKey,
            assignedSearchKey
        } = this.state;
        const { onCancel } = this.props;
        return (
            <React.Fragment>
                <div className="modal assigned-build-modal three-col-modal" role="dialog" style={{ display: "block" }} id="modalId">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader
                                title="Assign Activities For Consultancy"
                                onCancel={this.cancelModal}
                                modalClass="assigned-build-modal"
                            />
                            <h5 className="ml-4">{consultancy && consultancy.name}</h5>
                            <div className="modal-body">
                                <div className="outer-act-build list-sec">
                                    <div className="build-tem1">
                                        <h4>Available Activities</h4>
                                        <div className="outer-avl-bind">
                                            <div className="sr-sec search-section">
                                                <div className="sr-out">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        onChange={e => this.searchInAvailable(e.target.value)}
                                                        placeholder="Search"
                                                        value={availableSearchKey}
                                                    />
                                                    <span
                                                        className="clear-btn"
                                                        onClick={() => (availableSearchKey.trim().length ? this.searchInAvailable("") : null)}
                                                    >
                                                        Clear
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="table-section">
                                                <table className="table table-bordered file-system-table">
                                                    <thead>
                                                        <tr>
                                                            <th className="img-sq-box">
                                                                <span
                                                                    className="material-icons icon-arw"
                                                                    onClick={() => this.updateAssignedList("add", "all")}
                                                                >
                                                                    height
                                                                </span>
                                                            </th>
                                                            <th className="sel-all">Activity</th>
                                                            <th className="sel-all">DA</th>
                                                            <th className="sel-all">DA Frequency</th>
                                                            <th className="sel-all">Logbook</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {available_activities && available_activities.length ? (
                                                            available_activities.map((item, i) => (
                                                                <tr key={i}>
                                                                    <td className="img-sq-box">
                                                                        <span
                                                                            className="material-icons icon-arw"
                                                                            onClick={() => this.updateAssignedList("add", item.id)}
                                                                        >
                                                                            height
                                                                        </span>
                                                                    </td>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${availableSearchKey}`]}
                                                                            textToHighlight={item.activity_description|| ""}
                                                                            className="highlighter"
                                                                            autoEscape={true}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${availableSearchKey}`]}
                                                                            textToHighlight={item.deeming_agency||""}
                                                                            className="highlighter"
                                                                            autoEscape={true}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${availableSearchKey}`]}
                                                                            textToHighlight={item.deeming_agency_frequency || ""}
                                                                            className="highlighter"
                                                                            autoEscape={true}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${availableSearchKey}`]}
                                                                            textToHighlight={item.logbook || ""}
                                                                            className="highlighter"
                                                                            autoEscape={true}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="5" className="text-center">
                                                                    No Records Found !!
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="popup-counter">Count : {available_activities ? available_activities.length : 0}</div>
                                    </div>
                                    <div className="build-tem2">
                                        <h4>Inactive Activities</h4>
                                        <div className="outer-avl-bind">
                                            <div className="sr-sec search-section">
                                                <div className="sr-out">
                                                    <input
                                                        type="text"
                                                        onChange={e => this.searchInInactive(e.target.value)}
                                                        className="form-control"
                                                        placeholder="Search"
                                                        value={inactiveSearchKey}
                                                    />
                                                    <span
                                                        className="clear-btn"
                                                        onClick={() => (inactiveSearchKey.trim().length ? this.searchInInactive("") : null)}
                                                    >
                                                        Clear
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="table-section">
                                                <table className="table table-bordered file-system-table">
                                                    <thead>
                                                        <tr>
                                                            <th className="sel-all">Activity</th>
                                                            <th className="sel-all">DA</th>
                                                            <th className="sel-all">DA Frequency</th>
                                                            <th className="sel-all">Logbook</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {inactive_activities && inactive_activities.length ? (
                                                            inactive_activities.map((item, i) => (
                                                                <tr key={i}>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${inactiveSearchKey}`]}
                                                                            textToHighlight={item.activity_description || ""}
                                                                            className="highlighter"
                                                                            autoEscape={true}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${inactiveSearchKey}`]}
                                                                            textToHighlight={item.deeming_agency || ""}
                                                                            className="highlighter"
                                                                            autoEscape={true}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${inactiveSearchKey}`]}
                                                                            textToHighlight={item.deeming_agency_frequency || ""}
                                                                            className="highlighter"
                                                                            autoEscape={true}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${inactiveSearchKey}`]}
                                                                            textToHighlight={item.logbook || ""}
                                                                            className="highlighter"
                                                                            autoEscape={true}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="4" className="text-center">
                                                                    No Records Found !!
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="popup-counter">Count : {inactive_activities ? inactive_activities.length : 0}</div>
                                    </div>
                                    <div className="build-tem3">
                                        <h4>Assigned Activities</h4>
                                        <div className="outer-avl-bind">
                                            <div className="sr-sec search-section">
                                                <div className="sr-out">
                                                    <input
                                                        type="text"
                                                        onChange={e => this.searchInAssigned(e.target.value)}
                                                        className="form-control"
                                                        placeholder="Search"
                                                        value={assignedSearchKey}
                                                    />
                                                    <span
                                                        className="clear-btn"
                                                        onClick={() => (assignedSearchKey.trim().length ? this.searchInAssigned("") : null)}
                                                    >
                                                        Clear
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="table-section">
                                                <table className="table table-bordered file-system-table">
                                                    <thead>
                                                        <tr>
                                                            <th className="img-sq-box">
                                                                <span
                                                                    className="material-icons icon-arw"
                                                                    onClick={() => this.updateAssignedList("remove", "all")}
                                                                >
                                                                    height
                                                                </span>
                                                            </th>
                                                            <th className="sel-all">Activity</th>
                                                            <th className="sel-all">DA</th>
                                                            <th className="sel-all">DA Frequency</th>
                                                            <th className="sel-all">Logbook</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {assigned_activities && assigned_activities.length ? (
                                                            assigned_activities.map((item, i) => (
                                                                <tr key={i}>
                                                                    <td className="img-sq-box">
                                                                        <span
                                                                            className="material-icons icon-arw"
                                                                            onClick={() => this.updateAssignedList("remove", item.id)}
                                                                        >
                                                                            height
                                                                        </span>
                                                                    </td>
                                                                    <td
                                                                        className="title-tip title-tip-up"
                                                                        tooltip-content={item.activity_description}
                                                                    >
                                                                        <Highlighter
                                                                            searchWords={[`${assignedSearchKey}`]}
                                                                            textToHighlight={item.activity_description || ""}
                                                                            className="highlighter"
                                                                            autoEscape={true}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${assignedSearchKey}`]}
                                                                            textToHighlight={item.deeming_agency || ""}
                                                                            className="highlighter"
                                                                            autoEscap={true}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${assignedSearchKey}`]}
                                                                            textToHighlight={item.deeming_agency_frequency || ""}
                                                                            className="highlighter"
                                                                            autoEscape={true}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${assignedSearchKey}`]}
                                                                            textToHighlight={item.logbook || ""}
                                                                            className="highlighter"
                                                                            autoEscape={true}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="5" className="text-center">
                                                                    No Records Found !!
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="popup-counter">Count : {assigned_activities ? assigned_activities.length : 0}</div>
                                    </div>
                                </div>

                                <div className={`btn-sec ${activeTab === 2 ? "btn-survey-sec" : ""}`}>
                                    <div className="btn-out-1">
                                        <button className="btn btn-create mr-2" onClick={() => this.updateAsignedActivitiesForConsultancy()}>
                                            <i className="material-icons tic"> check</i> Update
                                        </button>
                                        <button className="btn btn-cncl-back" onClick={() => this.cancelModal()}>
                                            <i className="material-icons tic"> close</i>Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.renderConfirmationModal()}
                    {this.renderCancelConfirmationModal()}
                </div>
            </React.Fragment>
        );
    }
}
const mapStateToProps = state => {
    const { commonReducer } = state;
    return { commonReducer };
};

export default withRouter(connect(mapStateToProps, { ...commonActions })(UpdateActivityConsultancyAssigmentModal));
