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

class UpdateUserCampusAssigmentModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 1,
            showCurrentAssignmentModal: false,
            campus: null,
            assigned_users: [],
            client_users: [],
            initial_assigned_users: [],
            consultancy_users: [],
            currentAssignments: [],
            user_ids: [],
            showConfirmation: false,
            consultancyUsersSearchKey: "",
            clienyUsersSearchKey: "",
            assignedSearchKey: "",
            showCancelConfirmModal: false
        };
    }

    componentDidMount = async () => {
        await this.getAssignUserForCampusPopupDetails();
    };

    getAssignUserForCampusPopupDetails = async () => {
        const { campus_id } = this.props;
        await this.props.getAssignUserForCampusPopupDetails(campus_id);
        const {
            commonReducer: {
                getAssignUserForCampusPopupDetailsResponse: { campus, client_users = [], assigned_users = [], consultancy_users = [], success }
            }
        } = this.props;
        if (success) {
            await this.setState({
                campus,
                assigned_users,
                client_users,
                consultancy_users,
                initial_assigned_users: assigned_users.map(item => item.id),
                user_ids: assigned_users.map(item => item.id)
            });
        }
        return true;
    };

    searchInConsultancyUsers = async consultancyUsersSearchKey => {
        const {
            commonReducer: {
                getAssignUserForCampusPopupDetailsResponse: { consultancy_users = [] }
            }
        } = this.props;

        const { assigned_users } = this.state;
        let assignedUserIds = assigned_users.map(item => item.id);
        let result = consultancy_users.filter(item => !assignedUserIds.includes(item.id));

        if (consultancyUsersSearchKey.trim().length) {
            result = result.filter(({ name }) => name.toLowerCase().includes(consultancyUsersSearchKey.toLowerCase()));
        }
        await this.setState({
            consultancyUsersSearchKey,
            consultancy_users: result
        });
    };

    searchInInClientUsers = async clienyUsersSearchKey => {
        const {
            commonReducer: {
                getAssignUserForCampusPopupDetailsResponse: { client_users = [] }
            }
        } = this.props;

        const { assigned_users } = this.state;
        let assignedUserIds = assigned_users.map(item => item.id);
        let result = client_users.filter(item => !assignedUserIds.includes(item.id));

        if (clienyUsersSearchKey.trim().length) {
            result = result.filter(({ name }) => name.toLowerCase().includes(clienyUsersSearchKey.toLowerCase()));
        }
        await this.setState({
            clienyUsersSearchKey,
            client_users: result
        });
    };

    searchInAssigned = async assignedSearchKey => {
        const {
            commonReducer: {
                getAssignUserForCampusPopupDetailsResponse: { assigned_users = [] }
            }
        } = this.props;

        const { client_users, consultancy_users } = this.state;
        let clientUserIds = client_users.map(item => item.id);
        let consultancyUserIds = consultancy_users.map(item => item.id);
        let result = assigned_users.filter(item => !clientUserIds.includes(item.id) && !consultancyUserIds.includes(item.id));

        if (assignedSearchKey.trim().length) {
            result = result.filter(
                ({ name, role }) =>
                    name.toLowerCase().includes(assignedSearchKey.toLowerCase()) || role.toLowerCase().includes(assignedSearchKey.toLowerCase())
            );
        }
        await this.setState({
            assignedSearchKey,
            assigned_users: result
        });
    };

    updateAsignedLogbooksForCampus = async () => {
        const { initial_assigned_users, user_ids } = this.state;
        const { onCancel } = this.props;
        if (_.isEqual(initial_assigned_users.sort(), user_ids.sort())) {
            onCancel();
            ToastMsg("Users Assigned Successfully", "info");
        } else {
            this.togglShowConfirmation();
        }
    };

    onUpdateUsersConfirm = async () => {
        const { campus_id, onCancel } = this.props;
        const { initial_assigned_users, user_ids } = this.state;
        if (!_.isEqual(initial_assigned_users.sort(), user_ids.sort())) {
            await this.props.assignUsersToCampus(campus_id, user_ids);
            const {
                commonReducer: {
                    assignUsersToCampusResponse: { success, message }
                }
            } = this.props;
            if (success) {
                await this.getAssignUserForCampusPopupDetails();
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

    updateAssignedList = async (type, id, user_type) => {
        const { assigned_users, consultancy_users, client_users } = this.state;
        let itemObj = {};
        let tempAssignedUsers = assigned_users;
        let tempAvailableConsultancyUsers = consultancy_users;
        let tempAvailableClientUsers = client_users;
        let tempUserIds = [];

        if (id === "all") {
            if (type === "add") {
                if (user_type === "consultancy_users") {
                    tempAvailableConsultancyUsers.map(item => {
                        tempAssignedUsers.push({ ...item, type: "consultancy" });
                    });
                    tempAvailableConsultancyUsers = [];
                } else {
                    tempAvailableClientUsers.map(item => {
                        tempAssignedUsers.push({ ...item, type: "client" });
                    });
                    tempAvailableClientUsers = [];
                }
            } else {
                tempAssignedUsers.map(item => {
                    if (item && item.role === "consultancy_user") {
                        tempAvailableConsultancyUsers.push(item);
                    } else {
                        tempAvailableClientUsers.push(item);
                    }
                });
                tempAssignedUsers = [];
            }
        } else {
            if (type === "add") {
                if (user_type === "consultancy_users") {
                    itemObj = consultancy_users.find(item => item.id === id);
                    tempAssignedUsers.push({ ...itemObj, type: "consultancy" });
                    tempAvailableConsultancyUsers = tempAvailableConsultancyUsers.filter(item => item.id !== id);
                } else {
                    itemObj = client_users.find(item => item.id === id);
                    tempAssignedUsers.push({ ...itemObj, type: "client" });
                    tempAvailableClientUsers = tempAvailableClientUsers.filter(item => item.id !== id);
                }
            } else {
                itemObj = assigned_users.find(item => item.id === id);
                if ((itemObj && itemObj.type === "consultancy") || (itemObj && itemObj.role === "consultancy_user")) {
                    tempAvailableConsultancyUsers.push(itemObj);
                } else {
                    tempAvailableClientUsers.push(itemObj);
                }
                tempAssignedUsers = tempAssignedUsers.filter(item => item.id !== id);
            }
        }
        tempAvailableConsultancyUsers = _.uniqBy(tempAvailableConsultancyUsers, "id");
        tempAvailableClientUsers = _.uniqBy(tempAvailableClientUsers, "id");
        tempAssignedUsers = _.uniqBy(tempAssignedUsers, "id");
        tempUserIds = tempAssignedUsers.map(item => item.id);

        await this.setState({
            assigned_users: tempAssignedUsers,
            consultancy_users: tempAvailableConsultancyUsers,
            client_users: tempAvailableClientUsers,
            user_ids: tempUserIds
        });
    };

    cancelModal = () => {
        const { initial_assigned_users, user_ids, showCancelConfirmModal } = this.state;
        if (showCancelConfirmModal) {
            this.setState({ showCancelConfirmModal: false });
            this.props.onCancel();
        } else if (!_.isEqual(initial_assigned_users.sort(), user_ids.sort())) {
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
            campus,
            assigned_users,
            consultancy_users,
            client_users,
            consultancyUsersSearchKey,
            clienyUsersSearchKey,
            assignedSearchKey
        } = this.state;
        const { onCancel } = this.props;
        return (
            <React.Fragment>
                <div className="modal assigned-build-modal three-col-modal" role="dialog" style={{ display: "block" }} id="modalId">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader title="Assign Users For Campus" onCancel={this.cancelModal} modalClass="assigned-build-modal" />
                            <h5 className="ml-4">{campus && campus.name}</h5>
                            <div className="modal-body">
                                <div className="outer-act-build list-sec">
                                    <div className="build-tem1">
                                        <h4>Consultancy Users</h4>
                                        <div className="outer-avl-bind">
                                            <div className="sr-sec search-section">
                                                <div className="sr-out">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        onChange={e => this.searchInConsultancyUsers(e.target.value)}
                                                        placeholder="Search"
                                                        value={consultancyUsersSearchKey}
                                                    />
                                                    <span
                                                        className="clear-btn"
                                                        onClick={() =>
                                                            consultancyUsersSearchKey.trim().length ? this.searchInConsultancyUsers("") : null
                                                        }
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
                                                                    onClick={() => this.updateAssignedList("add", "all", "consultancy_users")}
                                                                >
                                                                    height
                                                                </span>
                                                            </th>
                                                            <th className="sel-all">Assign All</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {consultancy_users && consultancy_users.length ? (
                                                            consultancy_users.map((item, i) => (
                                                                <tr key={i}>
                                                                    <td className="img-sq-box">
                                                                        <span
                                                                            className="material-icons icon-arw"
                                                                            onClick={() =>
                                                                                this.updateAssignedList("add", item.id, "consultancy_users")
                                                                            }
                                                                        >
                                                                            height
                                                                        </span>
                                                                    </td>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${consultancyUsersSearchKey}`]}
                                                                            textToHighlight={item.name}
                                                                            className="highlighter"
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="2" className="text-center">
                                                                    No Records Found !!
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="popup-counter">Count : {consultancy_users ? consultancy_users.length : 0}</div>
                                    </div>
                                    <div className="build-tem2">
                                        <h4>Client Users</h4>
                                        <div className="outer-avl-bind">
                                            <div className="sr-sec search-section">
                                                <div className="sr-out">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        onChange={e => this.searchInInClientUsers(e.target.value)}
                                                        placeholder="Search"
                                                        value={clienyUsersSearchKey}
                                                    />
                                                    <span
                                                        className="clear-btn"
                                                        onClick={() => (clienyUsersSearchKey.trim().length ? this.searchInInClientUsers("") : null)}
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
                                                            <th className="sel-all">Assign All</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {client_users && client_users.length ? (
                                                            client_users.map((item, i) => (
                                                                <tr key={i}>
                                                                    <td className="img-sq-box">
                                                                        <span
                                                                            className="material-icons icon-arw"
                                                                            onClick={() => this.updateAssignedList("add", item.id, "client_users")}
                                                                        >
                                                                            height
                                                                        </span>
                                                                    </td>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${clienyUsersSearchKey}`]}
                                                                            textToHighlight={item.name}
                                                                            className="highlighter"
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="2" className="text-center">
                                                                    No Records Found !!
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="popup-counter">Count : {client_users ? client_users.length : 0}</div>
                                    </div>
                                    <div className="build-tem3">
                                        <h4>Assigned Users</h4>
                                        <div className="outer-avl-bind">
                                            <div className="sr-sec search-section">
                                                <div className="sr-out">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        onChange={e => this.searchInAssigned(e.target.value)}
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
                                                            <th className="sel-all">User Name</th>
                                                            <th>Role</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {assigned_users && assigned_users.length ? (
                                                            assigned_users.map((item, i) => (
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
                                                                            textToHighlight={item.name}
                                                                            className="highlighter"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${assignedSearchKey}`]}
                                                                            textToHighlight={item.role || `${item.type}_user`}
                                                                            className="highlighter"
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="3" className="text-center">
                                                                    No Records Found !!
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="popup-counter">Count : {assigned_users ? assigned_users.length : 0}</div>
                                    </div>
                                </div>

                                <div className={`btn-sec ${activeTab === 2 ? "btn-survey-sec" : ""}`}>
                                    <div className="btn-out-1">
                                        <button className="btn btn-create mr-2" onClick={() => this.updateAsignedLogbooksForCampus()}>
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

export default withRouter(connect(mapStateToProps, { ...commonActions })(UpdateUserCampusAssigmentModal));
