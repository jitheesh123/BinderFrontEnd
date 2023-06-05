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

class UpdateDeemingAgencyFrequencyAssigmentModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 1,
            showCurrentAssignmentModal: false,
            frequency: null,
            assigned_deeming_agencies: [],
            inactive_deeming_agencies: [],
            initial_assigned_deeming_agencies: [],
            available_deeming_agencies: [],
            currentAssignments: [],
            deeming_agency_ids: [],
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
        const { frequency_id } = this.props;
        await this.props.getAssignDeemingAgencyForfrequencyPopupDetails(frequency_id);
        const {
            commonReducer: {
                getAssignDeemingAgencyForFrequencyPopupDetailsResponse: {
                    frequency,
                    inactive_deeming_agencies = [],
                    assigned_deeming_agencies = [],
                    available_deeming_agencies = [],
                    success
                }
            }
        } = this.props;
        if (success) {
            await this.setState({
                frequency,
                assigned_deeming_agencies,
                inactive_deeming_agencies,
                available_deeming_agencies,
                initial_assigned_deeming_agencies: assigned_deeming_agencies.map(item => item.id),
                deeming_agency_ids: assigned_deeming_agencies.map(item => item.id)
            });
        }
        return true;
    };

    searchInAvailable = async availableSearchKey => {
        const {
            commonReducer: {
                getAssignDeemingAgencyForFrequencyPopupDetailsResponse: { available_deeming_agencies = [] }
            }
        } = this.props;
        const { assigned_deeming_agencies } = this.state;
        let assignedDeemingAgencyIds = assigned_deeming_agencies.map(item => item.id);
        let result = available_deeming_agencies.filter(item => !assignedDeemingAgencyIds.includes(item.id));
        if (availableSearchKey.trim().length) {
            result = result.filter(({ name }) => name.toLowerCase().includes(availableSearchKey.toLowerCase()));
        }
        await this.setState({
            availableSearchKey,
            available_deeming_agencies: result
        });
    };

    searchInInactive = async inactiveSearchKey => {
        const {
            commonReducer: {
                getAssignDeemingAgencyForFrequencyPopupDetailsResponse: { inactive_deeming_agencies = [] }
            }
        } = this.props;

        const { assigned_deeming_agencies } = this.state;
        let assignedDeemingAgencyIds = assigned_deeming_agencies.map(item => item.id);
        let result = inactive_deeming_agencies.filter(item => !assignedDeemingAgencyIds.includes(item.id));

        if (inactiveSearchKey.trim().length) {
            result = result.filter(({ name }) => name.toLowerCase().includes(inactiveSearchKey.toLowerCase()));
        }
        await this.setState({
            inactiveSearchKey,
            inactive_deeming_agencies: result
        });
    };

    searchInAssigned = async assignedSearchKey => {
        const {
            commonReducer: {
                getAssignDeemingAgencyForFrequencyPopupDetailsResponse: { assigned_deeming_agencies = [] }
            }
        } = this.props;

        const { available_deeming_agencies } = this.state;
        let availableLogbookIds = available_deeming_agencies.map(item => item.id);
        let result = assigned_deeming_agencies.filter(item => !availableLogbookIds.includes(item.id));

        if (assignedSearchKey.trim().length) {
            result = result.filter(({ name }) => name.toLowerCase().includes(assignedSearchKey.toLowerCase()));
        }
        await this.setState({
            assignedSearchKey,
            assigned_deeming_agencies: result
        });
    };

    updateAsignedActivitiesForfrequency = async () => {
        const { initial_assigned_deeming_agencies, deeming_agency_ids } = this.state;
        const { onCancel } = this.props;
        if (_.isEqual(initial_assigned_deeming_agencies.sort(), deeming_agency_ids.sort())) {
            onCancel();
            ToastMsg("Deeming Agencies Assigned Successfully", "info");
        } else {
            this.togglShowConfirmation();
        }
    };

    onUpdateAssignedActivitiessConfrim = async () => {
        const { frequency_id, onCancel } = this.props;
        const { initial_assigned_deeming_agencies, deeming_agency_ids } = this.state;
        if (!_.isEqual(initial_assigned_deeming_agencies.sort(), deeming_agency_ids.sort())) {
            await this.props.assignDeemingAgencyToFrequency(frequency_id, deeming_agency_ids);
            const {
                commonReducer: {
                    assignDeemingAgencyToFrequencyResponse: { success, message }
                }
            } = this.props;
            if (success) {
                await this.getAssignActivityForfrequencyPopupDetails();
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
        const { assigned_deeming_agencies, available_deeming_agencies, inactive_deeming_agencies } = this.state;
        let itemObj = {};
        let tempAssignedDeemingAgencies = assigned_deeming_agencies;
        let tempAvailableDeemingAgencies = available_deeming_agencies;
        let tempInactiveDeemingAgencies = inactive_deeming_agencies;
        let tempDeeminAgencyIds = [];
        let tempAvailableActivityIds = available_deeming_agencies.map(item => item.id);

        if (id === "all") {
            if (type === "add") {
                tempAvailableDeemingAgencies.map(item => tempAssignedDeemingAgencies.push(item));
                tempAvailableDeemingAgencies = [];
                tempInactiveDeemingAgencies = tempInactiveDeemingAgencies.filter(item => !tempAvailableActivityIds.includes(item.id));
            } else {
                tempAssignedDeemingAgencies.map(item => tempAvailableDeemingAgencies.push(item));
                tempAssignedDeemingAgencies.map(item => tempInactiveDeemingAgencies.push(item));
                tempAssignedDeemingAgencies = [];
            }
        } else {
            if (type === "add") {
                itemObj = available_deeming_agencies.find(item => item.id === id);
                tempAssignedDeemingAgencies.push(itemObj);
                tempAvailableDeemingAgencies = tempAvailableDeemingAgencies.filter(item => item.id !== id);
                tempInactiveDeemingAgencies = tempInactiveDeemingAgencies.filter(item => item.id !== id);
            } else {
                itemObj = assigned_deeming_agencies.find(item => item.id === id);
                tempAvailableDeemingAgencies.push(itemObj);
                tempInactiveDeemingAgencies.push(itemObj);
                tempAssignedDeemingAgencies = tempAssignedDeemingAgencies.filter(item => item.id !== id);
            }
        }
        tempAssignedDeemingAgencies = _.uniqBy(tempAssignedDeemingAgencies, "id");
        tempAvailableDeemingAgencies = _.uniqBy(tempAvailableDeemingAgencies, "id");
        tempInactiveDeemingAgencies = _.uniqBy(tempInactiveDeemingAgencies, "id");
        tempDeeminAgencyIds = tempAssignedDeemingAgencies.map(item => item.id);

        await this.setState({
            assigned_deeming_agencies: tempAssignedDeemingAgencies,
            available_deeming_agencies: tempAvailableDeemingAgencies,
            inactive_deeming_agencies: tempInactiveDeemingAgencies,
            deeming_agency_ids: tempDeeminAgencyIds
        });
    };

    cancelModal = () => {
        const { initial_assigned_deeming_agencies, deeming_agency_ids, showCancelConfirmModal } = this.state;
        if (showCancelConfirmModal) {
            this.setState({ showCancelConfirmModal: false });
            this.props.onCancel();
        } else if (!_.isEqual(initial_assigned_deeming_agencies.sort(), deeming_agency_ids.sort())) {
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
            frequency,
            assigned_deeming_agencies,
            available_deeming_agencies,
            inactive_deeming_agencies,
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
                                title="Assign Deeming Agencies For Frequency"
                                onCancel={this.cancelModal}
                                modalClass="assigned-build-modal"
                            />
                            <h5 className="ml-4">{frequency && frequency.name}</h5>
                            <div className="modal-body">
                                <div className="outer-act-build list-sec">
                                    <div className="build-tem1">
                                        <h4>Available Deeming Agencies</h4>
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
                                                        {available_deeming_agencies && available_deeming_agencies.length ? (
                                                            available_deeming_agencies.map((item, i) => (
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
                                        <div className="popup-counter">
                                            Count : {available_deeming_agencies ? available_deeming_agencies.length : 0}
                                        </div>
                                    </div>
                                    <div className="build-tem2">
                                        <h4>Inactive Deeming Agencies</h4>
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
                                                            <th className="sel-all">Inactive Deeming Agencies</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {inactive_deeming_agencies && inactive_deeming_agencies.length ? (
                                                            inactive_deeming_agencies.map((item, i) => (
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
                                        <div className="popup-counter">
                                            Count : {inactive_deeming_agencies ? inactive_deeming_agencies.length : 0}
                                        </div>
                                    </div>
                                    <div className="build-tem3">
                                        <h4>Assigned Deeming Agencies</h4>
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
                                                        {assigned_deeming_agencies && assigned_deeming_agencies.length ? (
                                                            assigned_deeming_agencies.map((item, i) => (
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
                                        <div className="popup-counter">
                                            Count : {assigned_deeming_agencies ? assigned_deeming_agencies.length : 0}
                                        </div>
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

export default withRouter(connect(mapStateToProps, { ...commonActions })(UpdateDeemingAgencyFrequencyAssigmentModal));
