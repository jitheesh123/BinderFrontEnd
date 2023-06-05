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

class UpdateConsultancyActivityAssigmentModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 1,
            showCurrentAssignmentModal: false,
            activity: null,
            assigned_consultancies: [],
            inactive_consultancies: [],
            initial_assigned_consultancies: [],
            available_consultancies: [],
            currentAssignments: [],
            consultancy_ids: [],
            showConfirmation: false,
            availableSearchKey: "",
            inactiveSearchKey: "",
            assignedSearchKey: "",
            showCancelConfirmModal: false
        };
    }

    componentDidMount = async () => {
        await this.getAssignConsultancyToActivityPopupDetails();
    };

    getAssignConsultancyToActivityPopupDetails = async () => {
        const { activity_id } = this.props;
        await this.props.getAssignConsultancyToActivityPopupDetails(activity_id);
        const {
            commonReducer: {
                getAssignConsultancyToActivityPopupDetailsResponse: {
                    activity,
                    inactive_consultancies = [],
                    assigned_consultancies = [],
                    available_consultancies = [],
                    success
                }
            }
        } = this.props;
        if (success) {
            await this.setState({
                activity,
                assigned_consultancies,
                inactive_consultancies,
                available_consultancies,
                initial_assigned_consultancies: assigned_consultancies.map(item => item.id),
                consultancy_ids: assigned_consultancies.map(item => item.id)
            });
        }
        return true;
    };

    searchInAvailable = async availableSearchKey => {
        const {
            commonReducer: {
                getAssignConsultancyToActivityPopupDetailsResponse: { available_consultancies = [] }
            }
        } = this.props;

        const { assigned_consultancies } = this.state;
        let assignedConsultancyIds = assigned_consultancies.map(item => item.id);
        let result = available_consultancies.filter(item => !assignedConsultancyIds.includes(item.id));

        if (availableSearchKey.trim().length) {
            result = result.filter(({ name }) => name.toLowerCase().includes(availableSearchKey.toLowerCase()));
        }
        await this.setState({
            availableSearchKey,
            available_consultancies: result
        });
    };

    searchInInactive = async inactiveSearchKey => {
        const {
            commonReducer: {
                getAssignConsultancyToActivityPopupDetailsResponse: { inactive_consultancies = [] }
            }
        } = this.props;

        const { assigned_consultancies } = this.state;
        let assignedConsultancyIds = assigned_consultancies.map(item => item.id);
        let result = inactive_consultancies.filter(item => !assignedConsultancyIds.includes(item.id));

        if (inactiveSearchKey.trim().length) {
            result = result.filter(({ name }) => name.toLowerCase().includes(inactiveSearchKey.toLowerCase()));
        }
        await this.setState({
            inactiveSearchKey,
            inactive_consultancies: result
        });
    };

    searchInAssigned = async assignedSearchKey => {
        const {
            commonReducer: {
                getAssignConsultancyToActivityPopupDetailsResponse: { assigned_consultancies = [] }
            }
        } = this.props;

        const { available_consultancies } = this.state;
        let availableConsultancyIds = available_consultancies.map(item => item.id);
        let result = assigned_consultancies.filter(item => !availableConsultancyIds.includes(item.id));

        if (assignedSearchKey.trim().length) {
            result = result.filter(({ name }) => name.toLowerCase().includes(assignedSearchKey.toLowerCase()));
        }
        await this.setState({
            assignedSearchKey,
            assigned_consultancies: result
        });
    };

    updateAssignConsultancyForActivity = async () => {
        const { initial_assigned_consultancies, consultancy_ids } = this.state;
        const { onCancel } = this.props;
        if (_.isEqual(initial_assigned_consultancies.sort(), consultancy_ids.sort())) {
            onCancel();
            ToastMsg("Consultancies Assigned Successfully", "info");
        } else {
            this.togglShowConfirmation();
        }
    };

    onUpdateAssignedActivityssConfrim = async () => {
        const { activity_id, onCancel } = this.props;
        const { initial_assigned_consultancies, consultancy_ids } = this.state;
        if (!_.isEqual(initial_assigned_consultancies.sort(), consultancy_ids.sort())) {
            await this.props.assignConsultancyToActivity(activity_id, consultancy_ids);
            const {
                commonReducer: {
                    assignConsultancyToActivityResponse: { success, message }
                }
            } = this.props;
            if (success) {
                await this.getAssignConsultancyToActivityPopupDetails();
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
                        onOk={this.onUpdateAssignedActivityssConfrim}
                        heading={"Update Assignment?"}
                    />
                }
                onCancel={this.togglShowConfirmation}
            />
        );
    };

    updateAssignedList = async (type, id) => {
        const { assigned_consultancies, available_consultancies, inactive_consultancies } = this.state;
        let itemObj = {};
        let tempAssignedConsultancies = assigned_consultancies;
        let tempAvailableConsultancies = available_consultancies;
        let tempInactiveConsultancies = inactive_consultancies;
        let tempConsultancyIds = [];
        let tempAvailableConsultancyIds = available_consultancies.map(item => item.id);

        if (id === "all") {
            if (type === "add") {
                tempAvailableConsultancies.map(item => tempAssignedConsultancies.push(item));
                tempAvailableConsultancies = [];
                tempInactiveConsultancies = tempInactiveConsultancies.filter(item => !tempAvailableConsultancyIds.includes(item.id));
            } else {
                tempAssignedConsultancies.map(item => tempAvailableConsultancies.push(item));
                tempAssignedConsultancies.map(item => tempInactiveConsultancies.push(item));
                tempAssignedConsultancies = [];
            }
        } else {
            if (type === "add") {
                itemObj = available_consultancies.find(item => item.id === id);
                tempAssignedConsultancies.push(itemObj);
                tempAvailableConsultancies = tempAvailableConsultancies.filter(item => item.id !== id);
                tempInactiveConsultancies = tempInactiveConsultancies.filter(item => item.id !== id);
            } else {
                itemObj = assigned_consultancies.find(item => item.id === id);
                tempAvailableConsultancies.push(itemObj);
                tempInactiveConsultancies.push(itemObj);
                tempAssignedConsultancies = tempAssignedConsultancies.filter(item => item.id !== id);
            }
        }
        tempAvailableConsultancies = _.uniqBy(tempAvailableConsultancies, "id");
        tempInactiveConsultancies = _.uniqBy(tempInactiveConsultancies, "id");
        tempAssignedConsultancies = _.uniqBy(tempAssignedConsultancies, "id");
        tempConsultancyIds = tempAssignedConsultancies.map(item => item.id);

        await this.setState({
            assigned_consultancies: tempAssignedConsultancies,
            available_consultancies: tempAvailableConsultancies,
            inactive_consultancies: tempInactiveConsultancies,
            consultancy_ids: tempConsultancyIds
        });
    };

    cancelModal = () => {
        const { initial_assigned_consultancies, consultancy_ids, showCancelConfirmModal } = this.state;
        if (showCancelConfirmModal) {
            this.setState({ showCancelConfirmModal: false });
            this.props.onCancel();
        } else if (!_.isEqual(initial_assigned_consultancies.sort(), consultancy_ids.sort())) {
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
            activity,
            assigned_consultancies,
            available_consultancies,
            inactive_consultancies,
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
                                title="Assign Consultancies For Activity"
                                onCancel={this.cancelModal}
                                modalClass="assigned-build-modal"
                            />
                            <h5 className="ml-4">{activity && activity.name}</h5>
                            <div className="modal-body">
                                <div className="outer-act-build list-sec">
                                    <div className="build-tem1">
                                        <h4>Available Consultancies</h4>
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
                                                        {available_consultancies && available_consultancies.length ? (
                                                            available_consultancies.map((item, i) => (
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
                                        <div className="popup-counter">Count : {available_consultancies ? available_consultancies.length : 0}</div>
                                    </div>
                                    <div className="build-tem2">
                                        <h4>Inactive Consultancies</h4>
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
                                                            <th className="sel-all">Inactive Consultancies</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {inactive_consultancies && inactive_consultancies.length ? (
                                                            inactive_consultancies.map((item, i) => (
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
                                        <div className="popup-counter">Count : {inactive_consultancies ? inactive_consultancies.length : 0}</div>
                                    </div>
                                    <div className="build-tem3">
                                        <h4>Assigned Consultancies</h4>
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
                                                        {assigned_consultancies && assigned_consultancies.length ? (
                                                            assigned_consultancies.map((item, i) => (
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
                                        <div className="popup-counter">Count : {assigned_consultancies ? assigned_consultancies.length : 0}</div>
                                    </div>
                                </div>

                                <div className={`btn-sec ${activeTab === 2 ? "btn-survey-sec" : ""}`}>
                                    <div className="btn-out-1">
                                        <button className="btn btn-create mr-2" onClick={() => this.updateAssignConsultancyForActivity()}>
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

export default withRouter(connect(mapStateToProps, { ...commonActions })(UpdateConsultancyActivityAssigmentModal));
