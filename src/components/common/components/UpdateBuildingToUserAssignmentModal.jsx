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
            assigned_buildings: [],
            available_buildings: [],
            initial_assigned_buildings: [],
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
        await this.props.getAssignBuildingToUserPopupDetails(user_id);
        const {
            commonReducer: {
                getAssignBuildingToUserPopupDetailsResponse: { user, available_buildings = [], assigned_buildings = [], success }
            }
        } = this.props;
        if (success) {
            await this.setState({
                user,
                assigned_buildings,
                available_buildings,
                initial_assigned_buildings: assigned_buildings.map(item => item.id),
                user_ids: assigned_buildings.map(item => item.id)
            });
        }
        return true;
    };

    searchInAvailable = async availableSearchKey => {
        const {
            commonReducer: {
                getAssignBuildingToUserPopupDetailsResponse: { available_buildings = [] }
            }
        } = this.props;
        const { assigned_buildings } = this.state;
        let assignedBuildingIds = assigned_buildings.map(item => item.id);
        let result = available_buildings.filter(item => !assignedBuildingIds.includes(item.id));
        if (availableSearchKey.trim().length) {
            result = result.filter(
                ({ consultancy, client, deeming_agency, sector, campus, name }) =>
                    (consultancy && consultancy.toLowerCase().includes(availableSearchKey.toLowerCase())) ||
                    (client && client.toLowerCase().includes(availableSearchKey.toLowerCase())) ||
                    (deeming_agency && deeming_agency.toLowerCase().includes(availableSearchKey.toLowerCase())) ||
                    (sector && sector.toLowerCase().includes(availableSearchKey.toLowerCase())) ||
                    (campus && campus.toLowerCase().includes(availableSearchKey.toLowerCase())) ||
                    (name && name.toLowerCase().includes(availableSearchKey.toLowerCase()))
            );
        }
        await this.setState({
            availableSearchKey,
            available_buildings: result
        });
    };

    searchInAssigned = async assignedSearchKey => {
        const {
            commonReducer: {
                getAssignBuildingToUserPopupDetailsResponse: { assigned_buildings = [] }
            }
        } = this.props;

        const { available_buildings } = this.state;
        let availableBuildingIds = available_buildings.map(item => item.id);
        let result = assigned_buildings.filter(item => !availableBuildingIds.includes(item.id));

        if (assignedSearchKey.trim().length) {
            result = result.filter(
                ({ consultancy, client, deeming_agency, sector, campus, name }) =>
                    (consultancy && consultancy.toLowerCase().includes(assignedSearchKey.toLowerCase())) ||
                    (client && client.toLowerCase().includes(assignedSearchKey.toLowerCase())) ||
                    (deeming_agency && deeming_agency.toLowerCase().includes(assignedSearchKey.toLowerCase())) ||
                    (sector && sector.toLowerCase().includes(assignedSearchKey.toLowerCase())) ||
                    (campus && campus.toLowerCase().includes(assignedSearchKey.toLowerCase())) ||
                    (name && name.toLowerCase().includes(assignedSearchKey.toLowerCase()))
            );
        }
        await this.setState({
            assignedSearchKey,
            assigned_buildings: result
        });
    };

    updateAsignedLogbooksForuser = async () => {
        const { initial_assigned_buildings, user_ids } = this.state;
        const { onCancel } = this.props;
        if (_.isEqual(initial_assigned_buildings.sort(), user_ids.sort())) {
            onCancel();
            ToastMsg("Building Logbooks Assigned Successfully", "info");
        } else {
            this.togglShowConfirmation();
        }
    };

    onUpdateUsersConfirm = async () => {
        const { user_id, onCancel } = this.props;
        const { initial_assigned_buildings, user_ids } = this.state;
        if (!_.isEqual(initial_assigned_buildings.sort(), user_ids.sort())) {
            await this.props.assignBuildingToUser(user_id, user_ids);
            const {
                commonReducer: {
                    assignBuildingToUserResponse: { success, message }
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
        const { assigned_buildings, available_buildings } = this.state;
        let itemObj = {};
        let tempAssignedBuildings = assigned_buildings;
        let tempAvailableBuildings = available_buildings;
        let tempBuildingIds = [];

        if (id === "all") {
            if (type === "add") {
                tempAvailableBuildings.map(item => tempAssignedBuildings.push(item));
                tempAvailableBuildings = [];
            } else {
                tempAssignedBuildings.map(item => tempAvailableBuildings.push(item));
                tempAssignedBuildings = [];
            }
        } else {
            if (type === "add") {
                itemObj = available_buildings.find(item => item.id === id);
                tempAssignedBuildings.push(itemObj);
                tempAvailableBuildings = tempAvailableBuildings.filter(item => item.id !== id);
            } else {
                itemObj = assigned_buildings.find(item => item.id === id);
                tempAvailableBuildings.push(itemObj);
                tempAssignedBuildings = tempAssignedBuildings.filter(item => item.id !== id);
            }
        }
        tempAssignedBuildings = _.uniqBy(tempAssignedBuildings, "id");
        tempAvailableBuildings = _.uniqBy(tempAvailableBuildings, "id");
        tempBuildingIds = tempAssignedBuildings.map(item => item.id);

        await this.setState({
            assigned_buildings: tempAssignedBuildings,
            available_buildings: tempAvailableBuildings,
            user_ids: tempBuildingIds
        });
    };

    cancelModal = () => {
        const { initial_assigned_buildings, user_ids, showCancelConfirmModal } = this.state;
        if (showCancelConfirmModal) {
            this.setState({ showCancelConfirmModal: false });
            this.props.onCancel();
        } else if (!_.isEqual(initial_assigned_buildings.sort(), user_ids.sort())) {
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
        const { activeTab, user, assigned_buildings, available_buildings, availableSearchKey, assignedSearchKey } = this.state;
        const { onCancel } = this.props;
        return (
            <React.Fragment>
                <div className="modal assigned-build-modal three-col-modal" role="dialog" style={{ display: "block" }} id="modalId">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader title="Assign Buildings For User" onCancel={this.cancelModal} modalClass="assigned-build-modal" />
                            <h5 className="ml-4">{user && user.name}</h5>
                            <div className="modal-body">
                                <div className="outer-act-build list-sec">
                                    <div className="build-tem2 addWidthHalf">
                                        <h4>Available Buildings</h4>
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
                                                            <th>Consultancy</th>
                                                            <th>Client</th>
                                                            <th>DA</th>
                                                            <th>Sector</th>
                                                            <th>Campus</th>
                                                            <th>Building</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {available_buildings && available_buildings.length ? (
                                                            available_buildings.map((item, i) => (
                                                                <tr key={i}>
                                                                    <td className="img-sq-box">
                                                                        <span
                                                                            className="material-icons icon-arw"
                                                                            onClick={() =>
                                                                                this.updateAssignedList("add", item.id, "available_buildings")
                                                                            }
                                                                        >
                                                                            height
                                                                        </span>
                                                                    </td>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${availableSearchKey}`]}
                                                                            textToHighlight={item.consultancy || ""}
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
                                        <div className="popup-counter">Count : {available_buildings ? available_buildings.length : 0}</div>
                                    </div>
                                    <div className="build-tem3 addWidthHalf">
                                        <h4>Assigned Buildings</h4>
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
                                                            <th>Consultancy</th>
                                                            <th>Client</th>
                                                            <th>DA</th>
                                                            <th>Sector</th>
                                                            <th>Campus</th>
                                                            <th>Building</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {assigned_buildings && assigned_buildings.length ? (
                                                            assigned_buildings.map((item, i) => (
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
                                                                            textToHighlight={item.consultancy || ""}
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
                                        <div className="popup-counter">Count : {assigned_buildings ? assigned_buildings.length : 0}</div>
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
