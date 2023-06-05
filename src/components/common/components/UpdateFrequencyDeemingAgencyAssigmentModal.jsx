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

class UpdateFrequencyDeemingAgencyAssigmentModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 1,
            showCurrentAssignmentModal: false,
            deeming_agency: null,
            assigned_frequencies: [],
            inactive_frequencies: [],
            initial_assigned_frequencies: [],
            available_frequencies: [],
            currentAssignments: [],
            frequency_ids: [],
            showConfirmation: false,
            availableSearchKey: "",
            inactiveSearchKey: "",
            assignedSearchKey: "",
            showCancelConfirmModal: false
        };
    }

    componentDidMount = async () => {
        await this.getAssignActivityForfrequencyPopupDetails();
    };

    getAssignActivityForfrequencyPopupDetails = async () => {
        const { deeming_agency_id } = this.props;
        await this.props.getAssignFrequencyForDeemingAgencyPopupDetails(deeming_agency_id);
        const {
            commonReducer: {
                getAssignFrequencyForDeemingAgencyPopupDetailsResponse: {
                    deeming_agency,
                    inactive_frequencies = [],
                    assigned_frequencies = [],
                    available_frequencies = [],
                    success
                }
            }
        } = this.props;

        if (success) {
            await this.setState({
                deeming_agency,
                assigned_frequencies,
                inactive_frequencies,
                available_frequencies,
                initial_assigned_frequencies: assigned_frequencies.map(item => item.id),
                frequency_ids: assigned_frequencies.map(item => item.id)
            });
        }
        return true;
    };

    searchInAvailable = async availableSearchKey => {
        const {
            commonReducer: {
                getAssignFrequencyForDeemingAgencyPopupDetailsResponse: { available_frequencies = [] }
            }
        } = this.props;
        const { assigned_frequencies } = this.state;
        let assignedLogbookIds = assigned_frequencies.map(item => item.id);
        let result = available_frequencies.filter(item => !assignedLogbookIds.includes(item.id));
        if (availableSearchKey.trim().length) {
            result = result.filter(({ name }) => name.toLowerCase().includes(availableSearchKey.toLowerCase()));
        }
        await this.setState({
            availableSearchKey,
            available_frequencies: result
        });
    };

    searchInInactive = async inactiveSearchKey => {
        const {
            commonReducer: {
                getAssignFrequencyForDeemingAgencyPopupDetailsResponse: { inactive_frequencies = [] }
            }
        } = this.props;

        const { assigned_frequencies } = this.state;
        let assignedLogbookIds = assigned_frequencies.map(item => item.id);
        let result = inactive_frequencies.filter(item => !assignedLogbookIds.includes(item.id));

        if (inactiveSearchKey.trim().length) {
            result = result.filter(({ name }) => name.toLowerCase().includes(inactiveSearchKey.toLowerCase()));
        }
        await this.setState({
            inactiveSearchKey,
            inactive_frequencies: result
        });
    };

    searchInAssigned = async assignedSearchKey => {
        const {
            commonReducer: {
                getAssignFrequencyForDeemingAgencyPopupDetailsResponse: { assigned_frequencies = [] }
            }
        } = this.props;

        const { available_frequencies } = this.state;
        let availableLogbookIds = available_frequencies.map(item => item.id);
        let result = assigned_frequencies.filter(item => !availableLogbookIds.includes(item.id));

        if (assignedSearchKey.trim().length) {
            result = result.filter(({ name }) => name.toLowerCase().includes(assignedSearchKey.toLowerCase()));
        }
        await this.setState({
            assignedSearchKey,
            assigned_frequencies: result
        });
    };

    updateAsignedActivitiesForfrequency = async () => {
        const { initial_assigned_frequencies, frequency_ids } = this.state;
        const { onCancel } = this.props;
        if (_.isEqual(initial_assigned_frequencies.sort(), frequency_ids.sort())) {
            onCancel();
            ToastMsg("Frequencies Assigned Successfully", "info");
        } else {
            this.togglShowConfirmation();
        }
    };

    onUpdateAssignedActivitiessConfrim = async () => {
        const { deeming_agency_id, onCancel } = this.props;
        const { initial_assigned_frequencies, frequency_ids } = this.state;
        if (!_.isEqual(initial_assigned_frequencies.sort(), frequency_ids.sort())) {
            await this.props.assignFrequencyToDeemingAgency(deeming_agency_id, frequency_ids);
            const {
                commonReducer: {
                    assignFrequencyToDeemingAgencyResponse: { success, message }
                }
            } = this.props;
            if (success) {
                await this.getAssignActivityForfrequencyPopupDetails();
                await this.props.updateFrequencyDeemingAgencyApiTrigger({ isTrigger: true });
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
        const { assigned_frequencies, available_frequencies, inactive_frequencies } = this.state;
        let itemObj = {};
        let tempAssignedFrequencies = assigned_frequencies;
        let tempAvailableFrequencies = available_frequencies;
        let tempInactiveFrequencies = inactive_frequencies;
        let tempFrequencyIds = [];
        let tempAvailableActivityIds = available_frequencies.map(item => item.id);

        if (id === "all") {
            if (type === "add") {
                tempAvailableFrequencies.map(item => tempAssignedFrequencies.push(item));
                tempAvailableFrequencies = [];
                tempInactiveFrequencies = tempInactiveFrequencies.filter(item => !tempAvailableActivityIds.includes(item.id));
            } else {
                tempAssignedFrequencies.map(item => tempAvailableFrequencies.push(item));
                tempAssignedFrequencies.map(item => tempInactiveFrequencies.push(item));
                tempAssignedFrequencies = [];
            }
        } else {
            if (type === "add") {
                itemObj = available_frequencies.find(item => item.id === id);
                tempAssignedFrequencies.push(itemObj);
                tempAvailableFrequencies = tempAvailableFrequencies.filter(item => item.id !== id);
                tempInactiveFrequencies = tempInactiveFrequencies.filter(item => item.id !== id);
            } else {
                itemObj = assigned_frequencies.find(item => item.id === id);
                tempAvailableFrequencies.push(itemObj);
                tempInactiveFrequencies.push(itemObj);
                tempAssignedFrequencies = tempAssignedFrequencies.filter(item => item.id !== id);
            }
        }

        tempAssignedFrequencies = _.uniqBy(tempAssignedFrequencies, "id");
        tempAvailableFrequencies = _.uniqBy(tempAvailableFrequencies, "id");
        tempInactiveFrequencies = _.uniqBy(tempInactiveFrequencies, "id");
        tempFrequencyIds = tempAssignedFrequencies.map(item => item.id);

        await this.setState({
            assigned_frequencies: tempAssignedFrequencies,
            available_frequencies: tempAvailableFrequencies,
            inactive_frequencies: tempInactiveFrequencies,
            frequency_ids: tempFrequencyIds
        });
    };

    cancelModal = () => {
        const { initial_assigned_frequencies, frequency_ids, showCancelConfirmModal } = this.state;
        if (showCancelConfirmModal) {
            this.setState({ showCancelConfirmModal: false });
            this.props.onCancel();
        } else if (!_.isEqual(initial_assigned_frequencies.sort(), frequency_ids.sort())) {
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
            deeming_agency,
            assigned_frequencies,
            available_frequencies,
            inactive_frequencies,
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
                                title="Assign Frequencies For Deeming Agency"
                                onCancel={this.cancelModal}
                                modalClass="assigned-build-modal"
                            />
                            <h5 className="ml-4">{deeming_agency && deeming_agency.name}</h5>
                            <div className="modal-body">
                                <div className="outer-act-build list-sec">
                                    <div className="build-tem1">
                                        <h4>Available Frequencies</h4>
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
                                                        {available_frequencies && available_frequencies.length ? (
                                                            available_frequencies.map((item, i) => (
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
                                        <div className="popup-counter">Count : {available_frequencies ? available_frequencies.length : 0}</div>
                                    </div>
                                    <div className="build-tem2">
                                        <h4>Inactive Frequencies</h4>
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
                                                            <th className="sel-all">Inactive Frequencies</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {inactive_frequencies && inactive_frequencies.length ? (
                                                            inactive_frequencies.map((item, i) => (
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
                                        <div className="popup-counter">Count : {inactive_frequencies ? inactive_frequencies.length : 0}</div>
                                    </div>
                                    <div className="build-tem3">
                                        <h4>Assigned Frequencies</h4>
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
                                                        {assigned_frequencies && assigned_frequencies.length ? (
                                                            assigned_frequencies.map((item, i) => (
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
                                        <div className="popup-counter">Count : {assigned_frequencies ? assigned_frequencies.length : 0}</div>
                                    </div>
                                </div>

                                <div className={`btn-sec ${activeTab === 2 ? "btn-survey-sec" : ""}`}>
                                    <div className="btn-out-1">
                                        <button className="btn btn-create mr-2" onClick={() => this.updateAsignedActivitiesForfrequency()}>
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

export default withRouter(connect(mapStateToProps, { ...commonActions })(UpdateFrequencyDeemingAgencyAssigmentModal));
