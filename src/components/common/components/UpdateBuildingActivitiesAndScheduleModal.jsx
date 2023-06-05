import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import Highlighter from "react-highlight-words";

import CurrentAssignmentsModal from "./CurrentAssignmentsModal";
import Portal from "./Portal";
import BuildModalHeader from "./BuildModalHeader";
import commonActions from "../actions";
import ConfirmationModal from "./ConfirmationModal";
import ToastMsg from "../ToastMessage";
import { defaultYearsList } from "../../../config/utils";

class UpdateBuildingActivitiesAndScheduleModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 1,
            showCurrentAssignmentModal: false,
            building: null,
            assigned_activities: [],
            inactive_activities: [],
            initial_assigned_activities: [],
            available_activities: [],
            currentAssignments: [],
            activity_ids: [],
            showConfirmation: false,
            surveyParams: {
                building_id: this.props.building_id || null,
                building_activity_ids: [],
                years: [],
                empty_survey: true,
                overwrite_existing_survey: false
            },
            errorParams: {
                years: false,
                activity_ids: false,
                survey_option: false
            },
            showErrorBorder: false,
            yearsListConst: defaultYearsList,
            yearsList: defaultYearsList,
            availableSearchKey: "",
            inactiveSearchKey: "",
            assignedSearchKey: "",
            showCancelConfirmModal: false,
            activity_store: [],
            filterTocheck: false
        };
    }

    componentDidMount = async () => {
        await this.getAssignBuildingActivitiesPopupDetails();
    };

    setActiveTab = async activeTab => {
        await this.setState({
            activeTab
        });
        if (activeTab === 1) {
            await this.getAssignBuildingActivitiesPopupDetails();
        } else {
            await this.updateAsignedActivitiesAndGetCreateSurveyPopupDetails();
        }
        let myDiv = document.getElementById(`customCheck${new Date().getFullYear()}`);
        if (myDiv) myDiv.scrollIntoView({ block: "center" });
    };

    getAssignBuildingActivitiesPopupDetails = async () => {
        const { building_id } = this.props;
        await this.props.getAssignBuildingActivitiesPopupDetails(building_id);
        const {
            commonReducer: {
                getAssignBuildingActivitiesPopupDetailsResponse: {
                    building,
                    inactive_activities = [],
                    assigned_activities = [],
                    available_activities = [],
                    success
                }
            }
        } = this.props;
        if (success) {
            await this.setState({
                building,
                assigned_activities,
                inactive_activities,
                available_activities,
                initial_assigned_activities: assigned_activities.map(item => item.id),
                activity_ids: assigned_activities.map(item => item.id),
                activity_store: assigned_activities.map(item => item.id)
            });
        }
        return true;
    };

    searchInAvailable = async availableSearchKey => {
        const {
            commonReducer: {
                getAssignBuildingActivitiesPopupDetailsResponse: { available_activities = [] }
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
                getAssignBuildingActivitiesPopupDetailsResponse: { inactive_activities = [] }
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

    searchInAssigned = async (assignedSearchKey, type) => {
        let assigned_activities = [];

        if (type === "create_survey") {
            assigned_activities = this.props.commonReducer.getCreateSurveyPopupDetailsForBuildingActivitiesResponse.assigned_activities || [];
        } else {
            assigned_activities = this.props.commonReducer.getAssignBuildingActivitiesPopupDetailsResponse.assigned_activities || [];
        }

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
            assigned_activities: result,
            filterTocheck: true
        });
    };

    searchInYear = async yearSearchKey => {
        const { yearsListConst } = this.state;
        let result = yearsListConst;
        if (yearSearchKey.trim().length) {
            result = yearsListConst.filter(item => item.includes(yearSearchKey));
        }
        await this.setState({
            yearSearchKey,
            yearsList: result
        });
    };

    searchInCurrentAssignments = async assignedSearchKey => {
        const {
            commonReducer: {
                getAssignBuildingActivitiesPopupDetailsResponse: { assigned_activities = [] }
            }
        } = this.props;

        const { available_activities } = this.state;
        let availableActivityIds = available_activities.map(item => item.id);
        let result = assigned_activities.filter(item => !availableActivityIds.includes(item.id));

        if (assignedSearchKey.trim().length) {
            result = result.filter(
                ({ activity_description, logbook, deeming_agency, years, deeming_agency_frequency }) =>
                    (logbook && logbook.toLowerCase().includes(assignedSearchKey.toLowerCase())) ||
                    (activity_description && activity_description.toLowerCase().includes(assignedSearchKey.toLowerCase())) ||
                    (deeming_agency && deeming_agency.toLowerCase().includes(assignedSearchKey.toLowerCase())) ||
                    (years && years.find(year => year.includes(assignedSearchKey))) ||
                    (deeming_agency_frequency && deeming_agency_frequency.toLowerCase().includes(assignedSearchKey.toLowerCase()))
            );
        }
        await this.setState({
            assignedSearchKey,
            assigned_activities: result
        });
    };

    updateAsignedActivitiesAndGetCreateSurveyPopupDetails = async () => {
        const { initial_assigned_activities, activity_ids } = this.state;
        if (_.isEqual(initial_assigned_activities.sort(), activity_ids.sort())) {
            this.onUpdateAssignedActivitiessConfrim();
        } else {
            this.togglShowConfirmation();
        }
    };

    onUpdateAssignedActivitiessConfrim = async () => {
        const { building_id } = this.props;
        const { initial_assigned_activities, activity_ids, activity_store, inactive_activities, filterTocheck } = this.state;
        const inactive_activity_ids = inactive_activities.map(item => item.id);
        const filtered_activity_ids = activity_store.filter(id => !inactive_activity_ids.includes(id));
        if (!_.isEqual(initial_assigned_activities.sort(), activity_ids.sort())) {
            if (filterTocheck) {
                await this.props.assignClientActivityToBuilding(building_id, filtered_activity_ids);
                this.setState({ filterTocheck: false, assignedSearchKey: "" });
            } else {
                await this.props.assignClientActivityToBuilding(building_id, activity_ids);
            }

            const {
                commonReducer: {
                    assignClientActivityToBuildingResponse: { message }
                }
            } = this.props;
            await this.getAssignBuildingActivitiesPopupDetails();
            await this.props.updateAssignPopUpApiTrigger({ isTrigger: true });
            ToastMsg(message, "info");
        }
        const { activeTab } = this.state;
        if (activeTab === 2) {
            await this.getCreateSurveyTabDetails();
        }
        await this.setState({
            showConfirmation: false
        });
        return true;
    };

    getCreateSurveyTabDetails = async () => {
        const { building_id } = this.props;
        await this.props.getCreateSurveyPopupDetailsForBuildingActivities(building_id);
        const {
            commonReducer: {
                getCreateSurveyPopupDetailsForBuildingActivitiesResponse: { assigned_activities, success }
            }
        } = this.props;
        if (success) {
            await this.setState({
                assigned_activities,
                showConfirmation: false
            });
        }
        return true;
    };

    togglShowConfirmation = () => {
        const { showConfirmation } = this.state;
        this.setState({
            showConfirmation: !showConfirmation
        });
    };

    onUpdateConfirmationCancel = async () => {
        await this.getAssignBuildingActivitiesPopupDetails();
        const { activeTab } = this.state;
        if (activeTab === 2) {
            await this.getCreateSurveyTabDetails();
        }
        this.togglShowConfirmation();
    };

    renderConfirmationModal = () => {
        const { showConfirmation } = this.state;
        if (!showConfirmation) return null;

        return (
            <Portal
                body={
                    <ConfirmationModal
                        onCancel={this.onUpdateConfirmationCancel}
                        onOk={this.onUpdateAssignedActivitiessConfrim}
                        heading={"Update Building Assignment?"}
                    />
                }
                onCancel={this.onUpdateConfirmationCancel}
            />
        );
    };

    togglShowCurrentAssignmentModal = () => {
        const { showCurrentAssignmentModal } = this.state;
        this.setState({
            showCurrentAssignmentModal: !showCurrentAssignmentModal
        });
    };

    renderCurrentAssignmentModal = () => {
        const { showCurrentAssignmentModal, assigned_activities, assignedSearchKey } = this.state;
        if (!showCurrentAssignmentModal) return null;

        return (
            <Portal
                body={
                    <CurrentAssignmentsModal
                        entity="Activity"
                        currentAssignments={assigned_activities}
                        searchInCurrentAssignments={this.searchInCurrentAssignments}
                        currentAssignmentsSearchKey={assignedSearchKey}
                        onCancel={this.togglShowCurrentAssignmentModal}
                    />
                }
                onCancel={this.togglShowCurrentAssignmentModal}
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
            // activity_store:tempActivityIds
        });
    };

    updateSurveyParams = async (buildingId, keyVal) => {
        const { surveyParams } = this.state;
        let tempArray = surveyParams[keyVal];
        if (tempArray && tempArray.length) {
            if (tempArray.includes(buildingId)) {
                tempArray = tempArray.filter(item => item !== buildingId);
            } else {
                tempArray.push(buildingId);
            }
        } else {
            tempArray.push(buildingId);
        }
        await this.setState({
            surveyParams: {
                ...surveyParams,
                [keyVal]: tempArray
            }
        });
    };

    selectAllSurveyParams = async (keyVal, isAllSelected) => {
        const { surveyParams, assigned_activities, yearsList } = this.state;
        let tempArray = [];
        if (!isAllSelected) {
            if (keyVal === "years") tempArray = yearsList.map(item => item);
            else tempArray = assigned_activities.map(item => item.id);
        }
        await this.setState({
            surveyParams: {
                ...surveyParams,
                [keyVal]: tempArray
            }
        });
    };

    validate = () => {
        const { surveyParams } = this.state;

        let errorParams = {
            years: false,
            building_activity_ids: false,
            survey_option: false
        };
        let showErrorBorder = false;
        if (!surveyParams.years || !surveyParams.years.length) {
            errorParams.years = true;
            showErrorBorder = true;
        }
        if (!surveyParams.building_activity_ids || !surveyParams.building_activity_ids.length) {
            errorParams.building_activity_ids = true;
            showErrorBorder = true;
        }

        if (!surveyParams.empty_survey && !surveyParams.overwrite_existing_survey) {
            errorParams.survey_option = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });

        if (showErrorBorder) return false;
        return true;
    };

    createSurvey = async () => {
        if (this.validate()) {
            const { surveyParams } = this.state;
            const { onCancel } = this.props;
            await this.props.createSurvey(surveyParams);
            const {
                commonReducer: {
                    createSurveyResponse: { success, message }
                }
            } = this.props;
            if (success) {
                onCancel();
            }
            ToastMsg(message, "info");
        }
    };

    renderYearStatus = currentYear => {
        const { assigned_activities } = this.state;
        let yearCount = 0;
        assigned_activities && assigned_activities.map(item => item.years && item.years.map(year => year === currentYear && yearCount++));
        return (
            <>
                <td className="text-center check-icon">
                    {assigned_activities.length && assigned_activities.length === yearCount ? (
                        <i className="material-icons tik bg-theme"> check</i>
                    ) : (
                        <i className="material-icons tik"> close</i>
                    )}
                </td>
                <td className="text-center check-icon">
                    {yearCount && assigned_activities.length !== yearCount ? (
                        <i className="material-icons tik bg-theme"> check</i>
                    ) : (
                        <i className="material-icons tik"> close</i>
                    )}
                </td>
                <td className="text-center check-icon">
                    {!yearCount ? <i className="material-icons tik bg-theme"> check</i> : <i className="material-icons tik"> close</i>}
                </td>
            </>
        );
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
            building,
            assigned_activities,
            available_activities,
            inactive_activities,
            yearsList,
            surveyParams,
            errorParams,
            showErrorBorder,
            availableSearchKey,
            inactiveSearchKey,
            assignedSearchKey,
            yearSearchKey
        } = this.state;
        const { onCancel } = this.props;
        return (
            <React.Fragment>
                <div className="modal assigned-build-modal three-col-modal" role="dialog" style={{ display: "block" }} id="modalId">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader
                                title="Update Building Activities and Schedule"
                                onCancel={this.cancelModal}
                                modalClass="assigned-build-modal"
                            />
                            <h5 className="ml-4">{building && building.name}</h5>
                            <div className="modal-body">
                                <div className="tab-section">
                                    <ul>
                                        <li className={`cursor-pointer ${activeTab === 1 ? "active" : null}`} onClick={() => this.setActiveTab(1)}>
                                            <span className="numb">01</span>
                                            <span className="nme">Update Activity Assignment</span>
                                        </li>
                                        <li className={`cursor-pointer ${activeTab === 2 ? "active" : null}`} onClick={() => this.setActiveTab(2)}>
                                            <span className="numb">02</span>
                                            <span className="nme">Create Survey</span>
                                        </li>
                                    </ul>
                                </div>
                                {activeTab === 1 ? (
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
                                                                                textToHighlight={item.activity_description || ""}
                                                                                className="highlighter"
                                                                            />
                                                                            {item.years && !item.years.length ? " *" : ""}
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
                                                                                textToHighlight={item.deeming_agency_frequency || ""}
                                                                                className="highlighter"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Highlighter
                                                                                searchWords={[`${availableSearchKey}`]}
                                                                                textToHighlight={item.logbook || ""}
                                                                                className="highlighter"
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
                                                                            />
                                                                            {item.years && !item.years.length ? " *" : ""}
                                                                        </td>
                                                                        <td>
                                                                            <Highlighter
                                                                                searchWords={[`${inactiveSearchKey}`]}
                                                                                textToHighlight={item.deeming_agency || ""}
                                                                                className="highlighter"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Highlighter
                                                                                searchWords={[`${inactiveSearchKey}`]}
                                                                                textToHighlight={item.deeming_agency_frequency || ""}
                                                                                className="highlighter"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Highlighter
                                                                                searchWords={[`${inactiveSearchKey}`]}
                                                                                textToHighlight={item.logbook || ""}
                                                                                className="highlighter"
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
                                                            onChange={e => this.searchInAssigned(e.target.value, "assign")}
                                                            className="form-control"
                                                            placeholder="Search"
                                                            value={assignedSearchKey}
                                                        />
                                                        <span
                                                            className="clear-btn"
                                                            onClick={() =>
                                                                assignedSearchKey.trim().length ? this.searchInAssigned("", "assign") : null
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
                                                                        <td>
                                                                            <Highlighter
                                                                                searchWords={[`${assignedSearchKey}`]}
                                                                                textToHighlight={item.activity_description || ""}
                                                                                className="highlighter"
                                                                            />
                                                                            {item.years && !item.years.length ? " *" : ""}
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
                                                                                textToHighlight={item.deeming_agency_frequency || ""}
                                                                                className="highlighter"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Highlighter
                                                                                searchWords={[`${assignedSearchKey}`]}
                                                                                textToHighlight={item.logbook || ""}
                                                                                className="highlighter"
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
                                ) : (
                                    <React.Fragment>
                                        <div className="survey-list">
                                            <ul>
                                                <li>
                                                    <label
                                                        className={`${
                                                            showErrorBorder && errorParams.survey_option ? "text-red" : ""
                                                        } container-check`}
                                                    >
                                                        Empty Survey
                                                        <input type="checkbox" checked={surveyParams.empty_survey} />
                                                        <span
                                                            className="checkmark"
                                                            onClick={() =>
                                                                this.setState({
                                                                    surveyParams: {
                                                                        ...surveyParams,
                                                                        empty_survey: !surveyParams.empty_survey
                                                                    }
                                                                })
                                                            }
                                                        ></span>
                                                    </label>
                                                </li>
                                                <li>
                                                    <label
                                                        className={`${
                                                            showErrorBorder && errorParams.survey_option ? "text-red" : ""
                                                        } container-check`}
                                                    >
                                                        Overwrite Existing Survey
                                                        <input type="checkbox" checked={surveyParams.overwrite_existing_survey} />
                                                        <span
                                                            className="checkmark"
                                                            onClick={() =>
                                                                this.setState({
                                                                    surveyParams: {
                                                                        ...surveyParams,
                                                                        overwrite_existing_survey: !surveyParams.overwrite_existing_survey
                                                                    }
                                                                })
                                                            }
                                                        ></span>
                                                    </label>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="outer-act-build list-sec survey-out">
                                            <div className="build-tem1 w-50">
                                                <h4 className={`${showErrorBorder && errorParams.building_activity_ids ? "mb-0" : ""}`}>
                                                    Assigned Activities
                                                </h4>
                                                {showErrorBorder && errorParams.building_activity_ids && (
                                                    <p
                                                        className={`${
                                                            showErrorBorder && errorParams.building_activity_ids ? "text-red text-error" : ""
                                                        }`}
                                                    >
                                                        *Choose at least one activity
                                                    </p>
                                                )}
                                                <div className="outer-avl-bind">
                                                    <div className="sr-sec search-section">
                                                        <div className="sr-out">
                                                            <input
                                                                type="text"
                                                                onChange={e => this.searchInAssigned(e.target.value, "create_survey")}
                                                                className="form-control"
                                                                placeholder="Search"
                                                                value={assignedSearchKey}
                                                            />
                                                            <span
                                                                className="clear-btn"
                                                                onClick={() =>
                                                                    assignedSearchKey.trim().length
                                                                        ? this.searchInAssigned("", "create_survey")
                                                                        : null
                                                                }
                                                            >
                                                                Clear
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="table-section">
                                                        <table className="table table-bordered survey-table ">
                                                            <thead>
                                                                <tr>
                                                                    <th className="img-sq-box">
                                                                        <label className="container-check">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={
                                                                                    assigned_activities.length &&
                                                                                    surveyParams.building_activity_ids.length ===
                                                                                        assigned_activities.length
                                                                                }
                                                                            />
                                                                            <span
                                                                                className="checkmark"
                                                                                onClick={() =>
                                                                                    this.selectAllSurveyParams(
                                                                                        "building_activity_ids",
                                                                                        surveyParams.building_activity_ids.length ===
                                                                                            assigned_activities.length
                                                                                    )
                                                                                }
                                                                            ></span>
                                                                        </label>
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
                                                                                <label className="container-check">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={surveyParams.building_activity_ids.includes(item.id)}
                                                                                    />
                                                                                    <span
                                                                                        className="checkmark"
                                                                                        onClick={() =>
                                                                                            this.updateSurveyParams(item.id, "building_activity_ids")
                                                                                        }
                                                                                    ></span>
                                                                                </label>
                                                                            </td>
                                                                            <td>
                                                                                <Highlighter
                                                                                    searchWords={[`${assignedSearchKey}`]}
                                                                                    textToHighlight={item.activity_description || ""}
                                                                                    className="highlighter"
                                                                                />
                                                                                {item.years && !item.years.length ? " *" : ""}
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
                                                                                    textToHighlight={item.deeming_agency_frequency || ""}
                                                                                    className="highlighter"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <Highlighter
                                                                                    searchWords={[`${assignedSearchKey}`]}
                                                                                    textToHighlight={item.logbook || ""}
                                                                                    className="highlighter"
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
                                            <div className="build-tem2 w-50">
                                                <h4 className={`${showErrorBorder && errorParams.years ? "mb-0" : ""}`}>Years</h4>
                                                {showErrorBorder && errorParams.years && (
                                                    <p className={`${showErrorBorder && errorParams.years ? "text-red text-error" : ""}`}>
                                                        *Choose at least one year
                                                    </p>
                                                )}
                                                <div className="outer-avl-bind">
                                                    <div className="sr-sec search-section">
                                                        <div className="sr-out">
                                                            <input
                                                                type="text"
                                                                onChange={e => this.searchInYear(e.target.value)}
                                                                className="form-control"
                                                                placeholder="Search"
                                                                value={yearSearchKey}
                                                            />
                                                            <span
                                                                className="clear-btn"
                                                                onClick={() => (yearSearchKey.trim().length ? this.searchInYear("") : null)}
                                                            >
                                                                Clear
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="table-section">
                                                        <table className="table table-bordered survey-table year-table">
                                                            <thead>
                                                                <tr>
                                                                    <th className="img-sq-box">
                                                                        <label className="container-check">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={
                                                                                    yearsList.length && surveyParams.years.length === yearsList.length
                                                                                }
                                                                            />
                                                                            <span
                                                                                className="checkmark"
                                                                                onClick={() =>
                                                                                    this.selectAllSurveyParams(
                                                                                        "years",
                                                                                        surveyParams.years.length === yearsList.length
                                                                                    )
                                                                                }
                                                                            ></span>
                                                                        </label>
                                                                    </th>
                                                                    <th className="sel-all">Select All</th>
                                                                    <th className="sel-all">All</th>
                                                                    <th className="sel-all">Partial</th>
                                                                    <th className="sel-all">None</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {yearsList && yearsList.length ? (
                                                                    yearsList.map((item, i) => (
                                                                        <tr key={i}>
                                                                            <td className="img-sq-box">
                                                                                <label className="container-check">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={surveyParams.years.includes(item)}
                                                                                        id={`customCheck${item}`}
                                                                                    />
                                                                                    <span
                                                                                        className="checkmark"
                                                                                        onClick={() => this.updateSurveyParams(item, "years")}
                                                                                    ></span>
                                                                                </label>
                                                                            </td>
                                                                            <td>
                                                                                <Highlighter
                                                                                    searchWords={[`${yearSearchKey}`]}
                                                                                    textToHighlight={item || ""}
                                                                                    className="highlighter"
                                                                                />
                                                                            </td>
                                                                            {this.renderYearStatus(item)}
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
                                                <div className="popup-counter">Count : {yearsList ? yearsList.length : 0}</div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                )}

                                <div className={`btn-sec ${activeTab === 2 ? "btn-survey-sec" : ""}`}>
                                    {activeTab === 2 ? (
                                        <div className="btn-out">
                                            <button
                                                id="assign-butn"
                                                className="btn btn-create btn-assign mr-2"
                                                onClick={() => this.togglShowCurrentAssignmentModal()}
                                            >
                                                <span className="material-icons icn-sec">format_align_left</span>
                                                <span>Current assignments</span>
                                            </button>
                                        </div>
                                    ) : null}
                                    <div className="btn-out-1">
                                        {activeTab === 1 ? (
                                            <button
                                                className="btn btn-create mr-2"
                                                onClick={() => this.updateAsignedActivitiesAndGetCreateSurveyPopupDetails()}
                                            >
                                                <i className="material-icons tic"> check</i> Update
                                            </button>
                                        ) : (
                                            <button className="btn btn-create mr-2" onClick={() => this.createSurvey()}>
                                                <i className="material-icons tic"> check</i> Create Surveys
                                            </button>
                                        )}

                                        <button className="btn btn-cncl-back" onClick={() => this.cancelModal()}>
                                            <i className="material-icons tic"> close</i>Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.renderCurrentAssignmentModal()}
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

export default withRouter(connect(mapStateToProps, { ...commonActions })(UpdateBuildingActivitiesAndScheduleModal));
