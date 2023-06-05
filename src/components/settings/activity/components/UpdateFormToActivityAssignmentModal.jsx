import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import Highlighter from "react-highlight-words";

import Portal from "../../../common/components/Portal";
import BuildModalHeader from "../../../common/components/BuildModalHeader";
import actions from "../actions";
import ConfirmationModal from "../../../common/components/ConfirmationModal";
import ToastMsg from "../../../common/ToastMessage";
import commonActions from "../../../common/actions";

class UpdateFormToActivityModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 1,
            showCurrentAssignmentModal: false,
            activity: null,
            assigned_forms: [],
            available_forms: [],
            initial_assigned_forms: [],
            consultancy_users: [],
            currentAssignments: [],
            activity_ids: [],
            showConfirmation: false,
            availableSearchKey: "",
            assignedSearchKey: "",
            showCancelConfirmModal: false
        };
    }

    componentDidMount = async () => {
        await this.getAssignFormToActivityPopupDetails();
    };

    getAssignFormToActivityPopupDetails = async () => {
        const { activity_id } = this.props;
        await this.props.getAssignFormToActivityPopupDetails(activity_id);
        const {
            activityReducer: {
                getAssignFormToActivityPopupDetailsResponse: { activity, available_forms = [], assigned_forms = [], success }
            }
        } = this.props;
        if (success) {
            await this.setState({
                activity,
                assigned_forms,
                available_forms,
                initial_assigned_forms: assigned_forms.map(item => item.id),
                activity_ids: assigned_forms.map(item => item.id)
            });
        }
        return true;
    };

    searchInAvailable = async availableSearchKey => {
        const {
            activityReducer: {
                getAssignFormToActivityPopupDetailsResponse: { available_forms = [] }
            }
        } = this.props;
        const { assigned_forms } = this.state;
        let assignedBuildingLogbookIds = assigned_forms.map(item => item.id);
        let result = available_forms.filter(item => !assignedBuildingLogbookIds.includes(item.id));
        if (availableSearchKey.trim().length) {
            result = result.filter(
                ({ building, campus, client, deeming_agency, name, sector }) =>
                    (building && building.toLowerCase().includes(availableSearchKey.toLowerCase())) ||
                    (client && client.toLowerCase().includes(availableSearchKey.toLowerCase())) ||
                    (deeming_agency && deeming_agency.toLowerCase().includes(availableSearchKey.toLowerCase())) ||
                    (sector && sector.toLowerCase().includes(availableSearchKey.toLowerCase())) ||
                    (campus && campus.toLowerCase().includes(availableSearchKey.toLowerCase())) ||
                    (name && name.toLowerCase().includes(availableSearchKey.toLowerCase()))
            );
        }
        await this.setState({
            availableSearchKey,
            available_forms: result
        });
    };

    searchInAssigned = async assignedSearchKey => {
        const {
            activityReducer: {
                getAssignFormToActivityPopupDetailsResponse: { assigned_forms = [] }
            }
        } = this.props;

        const { available_forms } = this.state;
        let availableBuildingIds = available_forms.map(item => item.id);
        let result = assigned_forms.filter(item => !availableBuildingIds.includes(item.id));

        if (assignedSearchKey.trim().length) {
            result = result.filter(
                ({ building, client, deeming_agency, sector, campus, name }) =>
                    (building && building.toLowerCase().includes(assignedSearchKey.toLowerCase())) ||
                    (client && client.toLowerCase().includes(assignedSearchKey.toLowerCase())) ||
                    (deeming_agency && deeming_agency.toLowerCase().includes(assignedSearchKey.toLowerCase())) ||
                    (sector && sector.toLowerCase().includes(assignedSearchKey.toLowerCase())) ||
                    (campus && campus.toLowerCase().includes(assignedSearchKey.toLowerCase())) ||
                    (name && name.toLowerCase().includes(assignedSearchKey.toLowerCase()))
            );
        }
        await this.setState({
            assignedSearchKey,
            assigned_forms: result
        });
    };

    updateAsignedLogbooksForuser = async () => {
        const { initial_assigned_forms, activity_ids } = this.state;
        const { onCancel } = this.props;
        if (_.isEqual(initial_assigned_forms.sort(), activity_ids.sort())) {
            onCancel();
            ToastMsg("Forms Assigned Successfully", "info");
        } else {
            this.togglShowConfirmation();
        }
    };

    onUpdateUsersConfirm = async () => {
        const { activity_id, onCancel } = this.props;
        const { initial_assigned_forms, activity_ids } = this.state;
        if (!_.isEqual(initial_assigned_forms.sort(), activity_ids.sort())) {
            await this.props.assignFormToActivity(activity_id, activity_ids);
            const {
                activityReducer: {
                    assignFormToActivityResponse: { success, message }
                }
            } = this.props;
            if (success) {
                await this.getAssignFormToActivityPopupDetails();
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
                body={<ConfirmationModal onCancel={this.togglShowConfirmation} onOk={this.onUpdateUsersConfirm} heading={"Update Assignment?"} />}
                onCancel={this.togglShowConfirmation}
            />
        );
    };

    updateAssignedList = async (type, id) => {
        const { assigned_forms, available_forms } = this.state;
        let itemObj = {};
        let tempAssignedBuildingLogbooks = assigned_forms;
        let tempAvailableBuildingLogbooks = available_forms;
        let tempLogbookIds = [];

        if (id === "all") {
            if (type === "add") {
                tempAvailableBuildingLogbooks.map(item => tempAssignedBuildingLogbooks.push(item));
                tempAvailableBuildingLogbooks = [];
            } else {
                tempAssignedBuildingLogbooks.map(item => tempAvailableBuildingLogbooks.push(item));
                tempAssignedBuildingLogbooks = [];
            }
        } else {
            if (type === "add") {
                itemObj = available_forms.find(item => item.id === id);
                tempAssignedBuildingLogbooks.push(itemObj);
                tempAvailableBuildingLogbooks = tempAvailableBuildingLogbooks.filter(item => item.id !== id);
            } else {
                itemObj = assigned_forms.find(item => item.id === id);
                tempAvailableBuildingLogbooks.push(itemObj);
                tempAssignedBuildingLogbooks = tempAssignedBuildingLogbooks.filter(item => item.id !== id);
            }
        }
        tempAssignedBuildingLogbooks = _.uniqBy(tempAssignedBuildingLogbooks, "id");
        tempAvailableBuildingLogbooks = _.uniqBy(tempAvailableBuildingLogbooks, "id");
        tempLogbookIds = tempAssignedBuildingLogbooks.map(item => item.id);

        await this.setState({
            assigned_forms: tempAssignedBuildingLogbooks,
            available_forms: tempAvailableBuildingLogbooks,
            activity_ids: tempLogbookIds
        });
    };

    cancelModal = () => {
        const { initial_assigned_forms, activity_ids, showCancelConfirmModal } = this.state;
        if (showCancelConfirmModal) {
            this.setState({ showCancelConfirmModal: false });
            this.props.onCancel();
        } else if (!_.isEqual(initial_assigned_forms.sort(), activity_ids.sort())) {
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
        const { activeTab, activity, assigned_forms, available_forms, availableSearchKey, assignedSearchKey } = this.state;
        const { onCancel } = this.props;
        return (
            <React.Fragment>
                <div className="modal assigned-build-modal three-col-modal" role="dialog" style={{ display: "block" }} id="modalId">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader title="Assign Forms For Activity" onCancel={this.cancelModal} modalClass="assigned-build-modal" />
                            <h5 className="ml-4">{activity && activity.name}</h5>
                            <div className="modal-body">
                                <div className="outer-act-build list-sec">
                                    <div className="build-tem2 addWidthHalf">
                                        <h4>Available Forms</h4>
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
                                                            <th>Form</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {available_forms && available_forms.length ? (
                                                            available_forms.map((item, i) => (
                                                                <tr key={i}>
                                                                    <td className="img-sq-box">
                                                                        <span
                                                                            className="material-icons icon-arw"
                                                                            onClick={() => this.updateAssignedList("add", item.id, "available_forms")}
                                                                        >
                                                                            height
                                                                        </span>
                                                                    </td>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${availableSearchKey}`]}
                                                                            textToHighlight={item.name || ""}
                                                                            className="highlighter"
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="7" className="text-center">
                                                                    No Records Found !!
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="popup-counter">Count : {available_forms ? available_forms.length : 0}</div>
                                    </div>
                                    <div className="build-tem3 addWidthHalf">
                                        <h4>Assigned Forms</h4>
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
                                                            <th>Form</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {assigned_forms && assigned_forms.length ? (
                                                            assigned_forms.map((item, i) => (
                                                                <tr key={i}>
                                                                    <td className="img-sq-box">
                                                                        <span
                                                                            className="material-icons icon-arw"
                                                                            onClick={() => this.updateAssignedList("remove", item.id)}
                                                                        >
                                                                            height
                                                                        </span>
                                                                    </td>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${assignedSearchKey}`]}
                                                                            textToHighlight={item.name || ""}
                                                                            className="highlighter"
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="7" className="text-center">
                                                                    No Records Found !!
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="popup-counter">Count : {assigned_forms ? assigned_forms.length : 0}</div>
                                    </div>
                                </div>

                                <div className={`btn-sec ${activeTab === 2 ? "btn-survey-sec" : ""}`}>
                                    <div className="btn-out-1">
                                        <button className="btn btn-create mr-2" onClick={() => this.updateAsignedLogbooksForuser()}>
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
    const { activityReducer } = state;
    return { activityReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions, ...commonActions })(UpdateFormToActivityModal));
