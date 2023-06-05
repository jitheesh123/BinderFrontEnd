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

class UpdateLogbookConsultancyAssigmentModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 1,
            showCurrentAssignmentModal: false,
            consultancy: null,
            assigned_logbooks: [],
            inactive_logbooks: [],
            initial_assigned_logbooks: [],
            available_logbooks: [],
            currentAssignments: [],
            logbook_ids: [],
            showConfirmation: false,
            availableSearchKey: "",
            inactiveSearchKey: "",
            assignedSearchKey: "",
            showCancelConfirmModal: false
        };
    }

    componentDidMount = async () => {
        await this.getAssignLogbookForConsultancyPopupDetails();
    };

    getAssignLogbookForConsultancyPopupDetails = async () => {
        const { consultancy_id } = this.props;
        await this.props.getAssignLogbookForConsultancyPopupDetails(consultancy_id);
        const {
            commonReducer: {
                getAssignLogbookForConsultancyPopupDetailsResponse: {
                    consultancy,
                    inactive_logbooks = [],
                    assigned_logbooks = [],
                    available_logbooks = [],
                    success
                }
            }
        } = this.props;
        if (success) {
            await this.setState({
                consultancy,
                assigned_logbooks,
                inactive_logbooks,
                available_logbooks,
                initial_assigned_logbooks: assigned_logbooks.map(item => item.id),
                logbook_ids: assigned_logbooks.map(item => item.id)
            });
        }
        return true;
    };

    searchInAvailable = async availableSearchKey => {
        const {
            commonReducer: {
                getAssignLogbookForConsultancyPopupDetailsResponse: { available_logbooks = [] }
            }
        } = this.props;

        const { assigned_logbooks } = this.state;
        let assignedLogbookIds = assigned_logbooks.map(item => item.id);
        let result = available_logbooks.filter(item => !assignedLogbookIds.includes(item.id));

        if (availableSearchKey.trim().length) {
            result = result.filter(({ name }) => name.toLowerCase().includes(availableSearchKey.toLowerCase()));
        }
        await this.setState({
            availableSearchKey,
            available_logbooks: result
        });
    };

    searchInInactive = async inactiveSearchKey => {
        const {
            commonReducer: {
                getAssignLogbookForConsultancyPopupDetailsResponse: { inactive_logbooks = [] }
            }
        } = this.props;

        const { assigned_logbooks } = this.state;
        let assignedLogbookIds = assigned_logbooks.map(item => item.id);
        let result = inactive_logbooks.filter(item => !assignedLogbookIds.includes(item.id));

        if (inactiveSearchKey.trim().length) {
            result = result.filter(({ name }) => name.toLowerCase().includes(inactiveSearchKey.toLowerCase()));
        }
        await this.setState({
            inactiveSearchKey,
            inactive_logbooks: result
        });
    };

    searchInAssigned = async assignedSearchKey => {
        const {
            commonReducer: {
                getAssignLogbookForConsultancyPopupDetailsResponse: { assigned_logbooks = [] }
            }
        } = this.props;

        const { available_logbooks } = this.state;
        let availableLogbookIds = available_logbooks.map(item => item.id);
        let result = assigned_logbooks.filter(item => !availableLogbookIds.includes(item.id));

        if (assignedSearchKey.trim().length) {
            result = result.filter(({ name }) => name.toLowerCase().includes(assignedSearchKey.toLowerCase()));
        }
        await this.setState({
            assignedSearchKey,
            assigned_logbooks: result
        });
    };

    updateAsignedLogbooksForConsultancy = async () => {
        const { initial_assigned_logbooks, logbook_ids } = this.state;
        const { onCancel } = this.props;
        if (_.isEqual(initial_assigned_logbooks.sort(), logbook_ids.sort())) {
            onCancel();
            ToastMsg("Logbooks Assigned Successfully", "info");
        } else {
            this.togglShowConfirmation();
        }
    };

    onUpdateAssignedLogbookssConfrim = async () => {
        const { consultancy_id, onCancel } = this.props;
        const { initial_assigned_logbooks, logbook_ids } = this.state;
        if (!_.isEqual(initial_assigned_logbooks.sort(), logbook_ids.sort())) {
            await this.props.assignLogbookToConsultancy(consultancy_id, logbook_ids);
            const {
                commonReducer: {
                    assignLogbookToConsultancyResponse: { success, message }
                }
            } = this.props;
            if (success) {
                await this.getAssignLogbookForConsultancyPopupDetails();
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
        const { assigned_logbooks, available_logbooks, inactive_logbooks } = this.state;
        let itemObj = {};
        let tempAssignedLogbooks = assigned_logbooks;
        let tempAvailableLogbooks = available_logbooks;
        let tempInactiveLogbooks = inactive_logbooks;
        let tempLogbookIds = [];
        let tempAvailableLogbookIds = available_logbooks.map(item => item.id);

        if (id === "all") {
            if (type === "add") {
                tempAvailableLogbooks.map(item => tempAssignedLogbooks.push(item));
                tempAvailableLogbooks = [];
                tempInactiveLogbooks = tempInactiveLogbooks.filter(item => !tempAvailableLogbookIds.includes(item.id));
            } else {
                tempAssignedLogbooks.map(item => tempAvailableLogbooks.push(item));
                tempAssignedLogbooks.map(item => tempInactiveLogbooks.push(item));
                tempAssignedLogbooks = [];
            }
        } else {
            if (type === "add") {
                itemObj = available_logbooks.find(item => item.id === id);
                tempAssignedLogbooks.push(itemObj);
                tempAvailableLogbooks = tempAvailableLogbooks.filter(item => item.id !== id);
                tempInactiveLogbooks = tempInactiveLogbooks.filter(item => item.id !== id);
            } else {
                itemObj = assigned_logbooks.find(item => item.id === id);
                tempAvailableLogbooks.push(itemObj);
                tempInactiveLogbooks.push(itemObj);
                tempAssignedLogbooks = tempAssignedLogbooks.filter(item => item.id !== id);
            }
        }
        tempAssignedLogbooks = _.uniqBy(tempAssignedLogbooks, "id");
        tempAvailableLogbooks = _.uniqBy(tempAvailableLogbooks, "id");
        tempInactiveLogbooks = _.uniqBy(tempInactiveLogbooks, "id");
        tempLogbookIds = tempAssignedLogbooks.map(item => item.id);

        await this.setState({
            assigned_logbooks: tempAssignedLogbooks,
            available_logbooks: tempAvailableLogbooks,
            inactive_logbooks: tempInactiveLogbooks,
            logbook_ids: tempLogbookIds
        });
    };

    cancelModal = () => {
        const { initial_assigned_logbooks, logbook_ids, showCancelConfirmModal } = this.state;
        if (showCancelConfirmModal) {
            this.setState({ showCancelConfirmModal: false });
            this.props.onCancel();
        } else if (!_.isEqual(initial_assigned_logbooks.sort(), logbook_ids.sort())) {
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
            assigned_logbooks,
            available_logbooks,
            inactive_logbooks,
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
                            <BuildModalHeader title="Assign Logbooks For Consultancy" onCancel={this.cancelModal} modalClass="assigned-build-modal" />
                            <h5 className="ml-4">{consultancy && consultancy.name}</h5>
                            <div className="modal-body">
                                <div className="outer-act-build list-sec">
                                    <div className="build-tem1">
                                        <h4>Available Logbooks</h4>
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
                                                        {available_logbooks && available_logbooks.length ? (
                                                            available_logbooks.map((item, i) => (
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
                                        <div className="popup-counter">Count : {available_logbooks ? available_logbooks.length : 0}</div>
                                    </div>
                                    <div className="build-tem2">
                                        <h4>Inactive Logbooks</h4>
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
                                                            <th className="sel-all">Inactive Logbooks</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {inactive_logbooks && inactive_logbooks.length ? (
                                                            inactive_logbooks.map((item, i) => (
                                                                <tr key={i}>
                                                                    <td>
                                                                        <Highlighter
                                                                            searchWords={[`${inactiveSearchKey}`]}
                                                                            textToHighlight={item.name}
                                                                            className="highlighter"
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
                                        <div className="popup-counter">Count : {inactive_logbooks ? inactive_logbooks.length : 0}</div>
                                    </div>
                                    <div className="build-tem3">
                                        <h4>Assigned Logbooks</h4>
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
                                                        {assigned_logbooks && assigned_logbooks.length ? (
                                                            assigned_logbooks.map((item, i) => (
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
                                        <div className="popup-counter">Count : {assigned_logbooks ? assigned_logbooks.length : 0}</div>
                                    </div>
                                </div>

                                <div className={`btn-sec ${activeTab === 2 ? "btn-survey-sec" : ""}`}>
                                    <div className="btn-out-1">
                                        <button className="btn btn-create mr-2" onClick={() => this.updateAsignedLogbooksForConsultancy()}>
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

export default withRouter(connect(mapStateToProps, { ...commonActions })(UpdateLogbookConsultancyAssigmentModal));
