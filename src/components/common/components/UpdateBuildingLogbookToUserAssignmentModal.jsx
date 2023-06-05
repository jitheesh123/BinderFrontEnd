import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import Highlighter from "react-highlight-words";

import Portal from "./Portal";
import BuildModalHeader from "./BuildModalHeader";
import commonActions from "../actions";
import ConfirmationModal from "./ConfirmationModal";
import ToastMsg from "../ToastMessage";

class UpdateUseruserAssigmentModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 1,
            showCurrentAssignmentModal: false,
            user: null,
            assigned_building_logbooks: [],
            available_building_logbooks: [],
            initial_assigned_building_logbooks: [],
            consultancy_users: [],
            currentAssignments: [],
            user_ids: [],
            showConfirmation: false,
            availableSearchKey: "",
            assignedSearchKey: "",
            showCancelConfirmModal: false
        };
    }

    componentDidMount = async () => {
        await this.getAssignBuildingLogbookForUserPopupDetails();
    };

    getAssignBuildingLogbookForUserPopupDetails = async () => {
        const { user_id } = this.props;
        await this.props.getAssignBuildingLogbookToUserPopupDetails(user_id);
        const {
            commonReducer: {
                getAssignBuildingLogbookToUserPopupDetailsResponse: {
                    user,
                    available_building_logbooks = [],
                    assigned_building_logbooks = [],
                    success
                }
            }
        } = this.props;
        if (success) {
            await this.setState({
                user,
                assigned_building_logbooks,
                available_building_logbooks,
                initial_assigned_building_logbooks: assigned_building_logbooks.map(item => item.id),
                user_ids: assigned_building_logbooks.map(item => item.id)
            });
        }
        return true;
    };

    searchInAvailable = async availableSearchKey => {
        const {
            commonReducer: {
                getAssignBuildingLogbookToUserPopupDetailsResponse: { available_building_logbooks = [] }
            }
        } = this.props;
        const { assigned_building_logbooks } = this.state;
        let assignedBuildingLogbookIds = assigned_building_logbooks.map(item => item.id);
        let result = available_building_logbooks.filter(item => !assignedBuildingLogbookIds.includes(item.id));
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
            available_building_logbooks: result
        });
    };

    searchInAssigned = async assignedSearchKey => {
        const {
            commonReducer: {
                getAssignBuildingLogbookToUserPopupDetailsResponse: { assigned_building_logbooks = [] }
            }
        } = this.props;

        const { available_building_logbooks } = this.state;
        let availableBuildingIds = available_building_logbooks.map(item => item.id);
        let result = assigned_building_logbooks.filter(item => !availableBuildingIds.includes(item.id));

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
            assigned_building_logbooks: result
        });
    };

    updateAsignedLogbooksForuser = async () => {
        const { initial_assigned_building_logbooks, user_ids } = this.state;
        const { onCancel } = this.props;
        if (_.isEqual(initial_assigned_building_logbooks.sort(), user_ids.sort())) {
            onCancel();
            ToastMsg("Building Logbooks Assigned Successfully", "info");
        } else {
            this.togglShowConfirmation();
        }
    };

    onUpdateUsersConfirm = async () => {
        const { user_id, onCancel } = this.props;
        const { initial_assigned_building_logbooks, user_ids } = this.state;
        if (!_.isEqual(initial_assigned_building_logbooks.sort(), user_ids.sort())) {
            await this.props.assignBuildingLogbookToUser(user_id, user_ids);
            const {
                commonReducer: {
                    assignBuildingLogbookToUserResponse: { success, message }
                }
            } = this.props;
            if (success) {
                await this.getAssignBuildingLogbookForUserPopupDetails();
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
        const { assigned_building_logbooks, available_building_logbooks } = this.state;
        let itemObj = {};
        let tempAssignedBuildingLogbooks = assigned_building_logbooks;
        let tempAvailableBuildingLogbooks = available_building_logbooks;
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
                itemObj = available_building_logbooks.find(item => item.id === id);
                tempAssignedBuildingLogbooks.push(itemObj);
                tempAvailableBuildingLogbooks = tempAvailableBuildingLogbooks.filter(item => item.id !== id);
            } else {
                itemObj = assigned_building_logbooks.find(item => item.id === id);
                tempAvailableBuildingLogbooks.push(itemObj);
                tempAssignedBuildingLogbooks = tempAssignedBuildingLogbooks.filter(item => item.id !== id);
            }
        }
        tempAssignedBuildingLogbooks = _.uniqBy(tempAssignedBuildingLogbooks, "id");
        tempAvailableBuildingLogbooks = _.uniqBy(tempAvailableBuildingLogbooks, "id");
        tempLogbookIds = tempAssignedBuildingLogbooks.map(item => item.id);

        await this.setState({
            assigned_building_logbooks: tempAssignedBuildingLogbooks,
            available_building_logbooks: tempAvailableBuildingLogbooks,
            user_ids: tempLogbookIds
        });
    };

    cancelModal = () => {
        const { initial_assigned_building_logbooks, user_ids, showCancelConfirmModal } = this.state;
        if (showCancelConfirmModal) {
            this.setState({ showCancelConfirmModal: false });
            this.props.onCancel();
        } else if (!_.isEqual(initial_assigned_building_logbooks.sort(), user_ids.sort())) {
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
        const { activeTab, user, assigned_building_logbooks, available_building_logbooks, availableSearchKey, assignedSearchKey } = this.state;
        const { onCancel } = this.props;
        return (
            <React.Fragment>
                <div className="modal assigned-build-modal three-col-modal" role="dialog" style={{ display: "block" }} id="modalId">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader
                                title="Assign Building Logbooks For User"
                                onCancel={this.cancelModal}
                                modalClass="assigned-build-modal"
                            />
                            <h5 className="ml-4">{user && user.name}</h5>
                            <div className="modal-body">
                                <div className="outer-act-build list-sec">
                                    <div className="build-tem2 addWidthHalf">
                                        <h4>Available Building Logbooks</h4>
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
                                                            <th>Building Logbook</th>
                                                            <th>Client</th>
                                                            <th>Deeming Agency</th>
                                                            <th>Sector</th>
                                                            <th>Campus</th>
                                                            <th>Building</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {available_building_logbooks && available_building_logbooks.length ? (
                                                            available_building_logbooks.map((item, i) => (
                                                                <tr key={i}>
                                                                    <td className="img-sq-box">
                                                                        <span
                                                                            className="material-icons icon-arw"
                                                                            onClick={() =>
                                                                                this.updateAssignedList("add", item.id, "available_building_logbooks")
                                                                            }
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
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${availableSearchKey}`]}
                                                                            textToHighlight={item.client || ""}
                                                                            className="highlighter"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${availableSearchKey}`]}
                                                                            textToHighlight={item.deeming_agency || ""}
                                                                            className="highlighter"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${availableSearchKey}`]}
                                                                            textToHighlight={item.sector || ""}
                                                                            className="highlighter"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${availableSearchKey}`]}
                                                                            textToHighlight={item.campus || ""}
                                                                            className="highlighter"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${availableSearchKey}`]}
                                                                            textToHighlight={item.building || ""}
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
                                        <div className="popup-counter">
                                            Count : {available_building_logbooks ? available_building_logbooks.length : 0}
                                        </div>
                                    </div>
                                    <div className="build-tem3 addWidthHalf">
                                        <h4>Assigned Building Logbooks</h4>
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
                                                            <th>Building Logbook</th>
                                                            <th className="sel-all">Client</th>
                                                            <th>Deeming Agency</th>
                                                            <th>Sector</th>
                                                            <th>Campus</th>
                                                            <th>Building</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {assigned_building_logbooks && assigned_building_logbooks.length ? (
                                                            assigned_building_logbooks.map((item, i) => (
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
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${assignedSearchKey}`]}
                                                                            textToHighlight={item.client || ""}
                                                                            className="highlighter"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${assignedSearchKey}`]}
                                                                            textToHighlight={item.deeming_agency || ""}
                                                                            className="highlighter"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${assignedSearchKey}`]}
                                                                            textToHighlight={item.sector || ""}
                                                                            className="highlighter"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${assignedSearchKey}`]}
                                                                            textToHighlight={item.campus || ""}
                                                                            className="highlighter"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${assignedSearchKey}`]}
                                                                            textToHighlight={item.building || ""}
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
                                        <div className="popup-counter">
                                            Count : {assigned_building_logbooks ? assigned_building_logbooks.length : 0}
                                        </div>
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
    const { commonReducer } = state;
    return { commonReducer };
};

export default withRouter(connect(mapStateToProps, { ...commonActions })(UpdateUseruserAssigmentModal));
