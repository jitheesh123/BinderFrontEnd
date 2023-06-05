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

class UpdateClientLogbookAssigmentModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 1,
            showCurrentAssignmentModal: false,
            logbook: null,
            assigned_clients: [],
            inactive_clients: [],
            initial_assigned_clients: [],
            available_clients: [],
            currentAssignments: [],
            client_ids: [],
            showConfirmation: false,
            availableSearchKey: "",
            inactiveSearchKey: "",
            assignedSearchKey: "",
            showCancelConfirmModal: false
        };
    }

    componentDidMount = async () => {
        await this.getAssignClientToLogbookPopupDetails();
    };

    getAssignClientToLogbookPopupDetails = async () => {
        const { logbook_id } = this.props;
        await this.props.getAssignClientToLogbookPopupDetails(logbook_id);
        const {
            commonReducer: {
                getAssignClientToLogbookPopupDetailsResponse: {
                    logbook,
                    inactive_clients = [],
                    assigned_clients = [],
                    available_clients = [],
                    success
                }
            }
        } = this.props;
        if (success) {
            await this.setState({
                logbook,
                assigned_clients,
                inactive_clients,
                available_clients,
                initial_assigned_clients: assigned_clients.map(item => item.id),
                client_ids: assigned_clients.map(item => item.id)
            });
        }
        return true;
    };

    searchInAvailable = async availableSearchKey => {
        const {
            commonReducer: {
                getAssignClientToLogbookPopupDetailsResponse: { available_clients = [] }
            }
        } = this.props;

        const { assigned_clients } = this.state;
        let assignedClientIds = assigned_clients.map(item => item.id);
        let result = available_clients.filter(item => !assignedClientIds.includes(item.id));

        if (availableSearchKey.trim().length) {
            result = result.filter(({ name }) => name.toLowerCase().includes(availableSearchKey.toLowerCase()));
        }
        await this.setState({
            availableSearchKey,
            available_clients: result
        });
    };

    searchInInactive = async inactiveSearchKey => {
        const {
            commonReducer: {
                getAssignClientToLogbookPopupDetailsResponse: { inactive_clients = [] }
            }
        } = this.props;

        const { assigned_clients } = this.state;
        let assignedClientIds = assigned_clients.map(item => item.id);
        let result = inactive_clients.filter(item => !assignedClientIds.includes(item.id));

        if (inactiveSearchKey.trim().length) {
            result = result.filter(({ name }) => name.toLowerCase().includes(inactiveSearchKey.toLowerCase()));
        }
        await this.setState({
            inactiveSearchKey,
            inactive_clients: result
        });
    };

    searchInAssigned = async assignedSearchKey => {
        const {
            commonReducer: {
                getAssignClientToLogbookPopupDetailsResponse: { assigned_clients = [] }
            }
        } = this.props;

        const { available_clients } = this.state;
        let availableClientIds = available_clients.map(item => item.id);
        let result = assigned_clients.filter(item => !availableClientIds.includes(item.id));

        if (assignedSearchKey.trim().length) {
            result = result.filter(({ name }) => name.toLowerCase().includes(assignedSearchKey.toLowerCase()));
        }
        await this.setState({
            assignedSearchKey,
            assigned_clients: result
        });
    };

    updateAssignClientForLogbook = async () => {
        const { initial_assigned_clients, client_ids } = this.state;
        const { onCancel } = this.props;
        if (_.isEqual(initial_assigned_clients.sort(), client_ids.sort())) {
            onCancel();
            ToastMsg("Clients Assigned Successfully", "info");
        } else {
            this.togglShowConfirmation();
        }
    };

    onUpdateAssignedLogbookssConfrim = async () => {
        const { logbook_id, onCancel } = this.props;
        const { initial_assigned_clients, client_ids } = this.state;
        if (!_.isEqual(initial_assigned_clients.sort(), client_ids.sort())) {
            await this.props.assignClientToLogbook(logbook_id, client_ids);
            const {
                commonReducer: {
                    assignClientToLogbookResponse: { success, message }
                }
            } = this.props;
            if (success) {
                await this.getAssignClientToLogbookPopupDetails();
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
                        onOk={this.onUpdateAssignedLogbookssConfrim}
                        heading={"Update Assignment?"}
                    />
                }
                onCancel={this.togglShowConfirmation}
            />
        );
    };

    updateAssignedList = async (type, id) => {
        const { assigned_clients, available_clients, inactive_clients } = this.state;
        let itemObj = {};
        let tempAssignedClients = assigned_clients;
        let tempAvailableClients = available_clients;
        let tempInactiveClients = inactive_clients;
        let tempClientIds = [];
        let tempAvailableClientIds = available_clients.map(item => item.id);

        if (id === "all") {
            if (type === "add") {
                tempAvailableClients.map(item => tempAssignedClients.push(item));
                tempAvailableClients = [];
                tempInactiveClients = tempInactiveClients.filter(item => !tempAvailableClientIds.includes(item.id));
            } else {
                tempAssignedClients.map(item => tempAvailableClients.push(item));
                tempAssignedClients.map(item => tempInactiveClients.push(item));
                tempAssignedClients = [];
            }
        } else {
            if (type === "add") {
                itemObj = available_clients.find(item => item.id === id);
                tempAssignedClients.push(itemObj);
                tempAvailableClients = tempAvailableClients.filter(item => item.id !== id);
                tempInactiveClients = tempInactiveClients.filter(item => item.id !== id);
            } else {
                itemObj = assigned_clients.find(item => item.id === id);
                tempAvailableClients.push(itemObj);
                tempInactiveClients.push(itemObj);
                tempAssignedClients = tempAssignedClients.filter(item => item.id !== id);
            }
        }

        tempAvailableClients = _.uniqBy(tempAvailableClients, "id");
        tempInactiveClients = _.uniqBy(tempInactiveClients, "id");
        tempAssignedClients = _.uniqBy(tempAssignedClients, "id");
        tempClientIds = tempAssignedClients.map(item => item.id);

        await this.setState({
            assigned_clients: tempAssignedClients,
            available_clients: tempAvailableClients,
            inactive_clients: tempInactiveClients,
            client_ids: tempClientIds
        });
    };

    cancelModal = () => {
        const { initial_assigned_clients, client_ids, showCancelConfirmModal } = this.state;
        if (showCancelConfirmModal) {
            this.setState({ showCancelConfirmModal: false });
            this.props.onCancel();
        } else if (!_.isEqual(initial_assigned_clients.sort(), client_ids.sort())) {
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
            logbook,
            assigned_clients,
            available_clients,
            inactive_clients,
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
                            <BuildModalHeader title="Assign Clients For Logbook" onCancel={this.cancelModal} modalClass="assigned-build-modal" />
                            <h5 className="ml-4">{logbook && logbook.name}</h5>
                            <div className="modal-body">
                                <div className="outer-act-build list-sec">
                                    <div className="build-tem1">
                                        <h4>Available Clients</h4>
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
                                                            <th className="sel-all">Assign All</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {available_clients && available_clients.length ? (
                                                            available_clients.map((item, i) => (
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
                                                                            textToHighlight={item.name || ""}
                                                                            className="highlighter"
                                                                            autoEscape={true}
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
                                        <div className="popup-counter">Count : {available_clients ? available_clients.length : 0}</div>
                                    </div>
                                    <div className="build-tem2">
                                        <h4>Inactive Clients</h4>
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
                                                            <th className="sel-all">Inactive Clients</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {inactive_clients && inactive_clients.length ? (
                                                            inactive_clients.map((item, i) => (
                                                                <tr key={i}>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${inactiveSearchKey}`]}
                                                                            textToHighlight={item.name || ""}
                                                                            className="highlighter"
                                                                            autoEscape={true}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td className="text-center">No Records Found !!</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="popup-counter">Count : {inactive_clients ? inactive_clients.length : 0}</div>
                                    </div>
                                    <div className="build-tem3">
                                        <h4>Assigned Clients</h4>
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
                                                            <th className="sel-all">Unassign All</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {assigned_clients && assigned_clients.length ? (
                                                            assigned_clients.map((item, i) => (
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
                                                                            textToHighlight={item?.name || ""}
                                                                            className="highlighter"
                                                                            autoEscape={true}
                                                                            
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
                                        <div className="popup-counter">Count : {assigned_clients ? assigned_clients.length : 0}</div>
                                    </div>
                                </div>

                                <div className={`btn-sec ${activeTab === 2 ? "btn-survey-sec" : ""}`}>
                                    <div className="btn-out-1">
                                        <button className="btn btn-create mr-2" onClick={() => this.updateAssignClientForLogbook()}>
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

export default withRouter(connect(mapStateToProps, { ...commonActions })(UpdateClientLogbookAssigmentModal));
