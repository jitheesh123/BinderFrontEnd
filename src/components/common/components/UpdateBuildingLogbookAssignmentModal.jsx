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

class UpdateLogbookBuildingsAndScheduleModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 1,
            showCurrentAssignmentModal: false,
            logbook: null,
            assigned_buildings: [],
            inactive_buildings: [],
            initial_assigned_buildings: [],
            available_buildings: [],
            currentAssignments: [],
            building_ids: [],
            showConfirmation: false,
            surveyParams: {
                logbook_id: this.props.logbook_id || null,
                building_ids: [],
                years: [],
                empty_survey: true,
                overwrite_existing_survey: false
            },
            errorParams: {
                years: false,
                building_ids: false,
                survey_option: false
            },
            showErrorBorder: false,
            yearsList: defaultYearsList,
            yearsListConst: defaultYearsList,
            availableSearchKey: "",
            inactiveSearchKey: "",
            assignedSearchKey: "",
            showCancelConfirmModal: false
        };
    }

    componentDidMount = async () => {
        await this.getAssignBuildingToLogbookPopupDetails();
    };

    setActiveTab = async activeTab => {
        await this.setState({
            activeTab
        });
        if (activeTab === 1) {
            await this.getAssignBuildingToLogbookPopupDetails();
        } else {
            await this.updateAsignedLogbooksAndGetCreateSurveyPopupDetails();
        }
        let myDiv = document.getElementById(`customCheck${new Date().getFullYear()}`);
        if (myDiv) myDiv.scrollIntoView({ block: "center" });
    };

    getAssignBuildingToLogbookPopupDetails = async () => {
        const { logbook_id } = this.props;
        await this.props.getAssignBuildingToLogbookPopupDetails(logbook_id);
        const {
            commonReducer: {
                getAssignBuildingToLogbookPopupDetailsResponse: {
                    logbook,
                    inactive_buildings = [],
                    assigned_buildings = [],
                    available_buildings = [],
                    success
                }
            }
        } = this.props;
        if (success) {
            await this.setState({
                logbook,
                assigned_buildings,
                inactive_buildings,
                available_buildings,
                initial_assigned_buildings: assigned_buildings.map(item => item.id),
                building_ids: assigned_buildings.map(item => item.id)
            });
        }
        return true;
    };

    searchInAvailable = async availableSearchKey => {
        const {
            commonReducer: {
                getAssignBuildingToLogbookPopupDetailsResponse: { available_buildings = [] }
            }
        } = this.props;

        const { assigned_buildings } = this.state;
        let assignedBuildingIds = assigned_buildings.map(item => item.id);
        let result = available_buildings.filter(item => !assignedBuildingIds.includes(item.id));

        if (availableSearchKey.trim().length) {
            result = result.filter(({ name }) => name.toLowerCase().includes(availableSearchKey.toLowerCase()));
        }
        await this.setState({
            availableSearchKey,
            available_buildings: result
        });
    };

    searchInInactive = async inactiveSearchKey => {
        const {
            commonReducer: {
                getAssignBuildingToLogbookPopupDetailsResponse: { inactive_buildings = [] }
            }
        } = this.props;

        const { assigned_buildings } = this.state;
        let assignedBuildingIds = assigned_buildings.map(item => item.id);
        let result = inactive_buildings.filter(item => !assignedBuildingIds.includes(item.id));

        if (inactiveSearchKey.trim().length) {
            result = result.filter(({ name }) => name.toLowerCase().includes(inactiveSearchKey.toLowerCase()));
        }
        await this.setState({
            inactiveSearchKey,
            inactive_buildings: result
        });
    };

    searchInAssigned = async (assignedSearchKey, type = "assign") => {
        let assigned_buildings = [];

        if (type === "create_survey") {
            assigned_buildings = this.props.commonReducer.getLogbookCreateSurveyPopupDetailsResponse.assigned_buildings || [];
        } else {
            assigned_buildings = this.props.commonReducer.getAssignBuildingToLogbookPopupDetailsResponse.assigned_buildings || [];
        }

        const { available_buildings } = this.state;
        let availableBuildingIds = available_buildings.map(item => item.id);
        let result = assigned_buildings.filter(item => !availableBuildingIds.includes(item.id));

        if (assignedSearchKey.trim().length) {
            result = result.filter(({ name }) => name.toLowerCase().includes(assignedSearchKey.toLowerCase()));
        }
        await this.setState({
            assignedSearchKey,
            assigned_buildings: result
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
                getAssignBuildingToLogbookPopupDetailsResponse: { assigned_buildings = [] }
            }
        } = this.props;

        const { available_buildings } = this.state;
        let availableBuildingIds = available_buildings.map(item => item.id);
        let result = assigned_buildings.filter(item => !availableBuildingIds.includes(item.id));
        if (assignedSearchKey.trim().length) {
            result = result.filter(
                ({ name, years }) =>
                    name.toLowerCase().includes(assignedSearchKey.toLowerCase()) || years.find(year => year.includes(assignedSearchKey))
            );
        }
        await this.setState({
            assignedSearchKey,
            assigned_buildings: result
        });
    };

    updateAsignedLogbooksAndGetCreateSurveyPopupDetails = async () => {
        const { initial_assigned_buildings, building_ids } = this.state;
        if (_.isEqual(initial_assigned_buildings.sort(), building_ids.sort())) {
            this.onUpdateAssignedLogbookssConfrim();
        } else {
            this.togglShowConfirmation();
        }
    };

    onUpdateAssignedLogbookssConfrim = async () => {
        const { logbook_id } = this.props;
        const { initial_assigned_buildings, building_ids } = this.state;
        if (!_.isEqual(initial_assigned_buildings.sort(), building_ids.sort())) {
            await this.props.assignBuildingToLogbook(logbook_id, building_ids);
            const {
                commonReducer: {
                    assignBuildingToLogbookResponse: { success, message }
                }
            } = this.props;
            // if (!success) {
            //     return false;
            // }
            await this.getAssignBuildingToLogbookPopupDetails();
            await this.props.updateAssignPopUpApiTrigger({ isTrigger: true });
            this.togglShowConfirmation();
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
        const { logbook_id } = this.props;
        await this.props.getLogbookCreateSurveyPopupDetails(logbook_id);
        const {
            commonReducer: {
                getLogbookCreateSurveyPopupDetailsResponse: { assigned_buildings, success }
            }
        } = this.props;
        if (success) {
            await this.setState({
                assigned_buildings,
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
        await this.getAssignBuildingToLogbookPopupDetails();
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
                        onOk={this.onUpdateAssignedLogbookssConfrim}
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
        const { showCurrentAssignmentModal, assigned_buildings, assignedSearchKey } = this.state;
        if (!showCurrentAssignmentModal) return null;

        return (
            <Portal
                body={
                    <CurrentAssignmentsModal
                        entity="Building"
                        currentAssignments={assigned_buildings}
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
        const { assigned_buildings, available_buildings, inactive_buildings } = this.state;
        let itemObj = {};
        let tempAssignedBuildings = assigned_buildings;
        let tempAvailableBuildings = available_buildings;
        let tempInactiveBuildings = inactive_buildings;
        let tempBuildingIds = [];
        let tempAvailableLogbookIds = available_buildings.map(item => item.id);

        if (id === "all") {
            if (type === "add") {
                tempAvailableBuildings.map(item => tempAssignedBuildings.push(item));
                tempAvailableBuildings = [];
                tempInactiveBuildings = tempInactiveBuildings.filter(item => !tempAvailableLogbookIds.includes(item.id));
            } else {
                tempAssignedBuildings.map(item => tempAvailableBuildings.push(item));
                tempAssignedBuildings.map(item => tempInactiveBuildings.push(item));
                tempAssignedBuildings = [];
            }
        } else {
            if (type === "add") {
                itemObj = available_buildings.find(item => item.id === id);
                tempAssignedBuildings.push(itemObj);
                tempAvailableBuildings = tempAvailableBuildings.filter(item => item.id !== id);
                tempInactiveBuildings = tempInactiveBuildings.filter(item => item.id !== id);
            } else {
                itemObj = assigned_buildings.find(item => item.id === id);
                tempAvailableBuildings.push(itemObj);
                tempInactiveBuildings.push(itemObj);
                tempAssignedBuildings = tempAssignedBuildings.filter(item => item.id !== id);
            }
        }
        tempAssignedBuildings = _.uniqBy(tempAssignedBuildings, "id");
        tempAvailableBuildings = _.uniqBy(tempAvailableBuildings, "id");
        tempInactiveBuildings = _.uniqBy(tempInactiveBuildings, "id");
        tempBuildingIds = tempAssignedBuildings.map(item => item.id);

        await this.setState({
            assigned_buildings: tempAssignedBuildings,
            available_buildings: tempAvailableBuildings,
            inactive_buildings: tempInactiveBuildings,
            building_ids: tempBuildingIds
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
        const { surveyParams, assigned_buildings, yearsList } = this.state;
        let tempArray = [];
        if (!isAllSelected) {
            if (keyVal === "years") tempArray = yearsList.map(item => item);
            else tempArray = assigned_buildings.map(item => item.id);
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
            building_ids: false,
            survey_option: false
        };
        let showErrorBorder = false;
        if (!surveyParams.years || !surveyParams.years.length) {
            errorParams.years = true;
            showErrorBorder = true;
        }
        if (!surveyParams.building_ids || !surveyParams.building_ids.length) {
            errorParams.building_ids = true;
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
            const { onCancel, logbook_id } = this.props;
            await this.props.createSurveyBuildingLogbook(surveyParams, logbook_id);
            const {
                commonReducer: {
                    createSurveyBuildingLogbookResponse: { success, message }
                }
            } = this.props;
            if (success) {
                onCancel();
            }
            ToastMsg(message, "info");
        }
    };

    renderYearStatus = currentYear => {
        const { assigned_buildings } = this.state;
        let yearCount = 0;
        assigned_buildings && assigned_buildings.map(item => item.years && item.years.map(year => year === currentYear && yearCount++));
        return (
            <>
                <td className="text-center check-icon">
                    {assigned_buildings.length && assigned_buildings.length === yearCount ? (
                        <i className="material-icons tik bg-theme"> check</i>
                    ) : (
                        <i className="material-icons tik"> close</i>
                    )}
                </td>
                <td className="text-center check-icon">
                    {yearCount && assigned_buildings.length !== yearCount ? (
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
        const { initial_assigned_buildings, building_ids, showCancelConfirmModal } = this.state;
        if (showCancelConfirmModal) {
            this.setState({ showCancelConfirmModal: false });
            this.props.onCancel();
        } else if (!_.isEqual(initial_assigned_buildings.sort(), building_ids.sort())) {
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
            assigned_buildings,
            available_buildings,
            inactive_buildings,
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
                                title="Update Logbook Buildings and Schedule"
                                onCancel={this.cancelModal}
                                modalClass="assigned-build-modal"
                            />
                            <h5 className="ml-4">{logbook && logbook.name}</h5>
                            <div className="modal-body">
                                <div className="tab-section">
                                    <ul>
                                        <li className={`cursor-pointer ${activeTab === 1 ? "active" : null}`} onClick={() => this.setActiveTab(1)}>
                                            <span className="numb">01</span>
                                            <span className="nme">Update Building Assignment</span>
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
                                                                <th className="sel-all">Assign All</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {available_buildings && available_buildings.length ? (
                                                                available_buildings.map((item, i) => (
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
                                                                            {item.years && !item.years.length ? " *" : ""}
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
                                            <div className="popup-counter">Count : {available_buildings ? available_buildings.length : 0}</div>
                                        </div>
                                        <div className="build-tem2">
                                            <h4>Inactive Buildings</h4>
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
                                                                <th className="sel-all">Inactive Buildings</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {inactive_buildings && inactive_buildings.length ? (
                                                                inactive_buildings.map((item, i) => (
                                                                    <tr key={i}>
                                                                        <td>
                                                                            <Highlighter
                                                                                searchWords={[`${inactiveSearchKey}`]}
                                                                                textToHighlight={item.name}
                                                                                className="highlighter"
                                                                            />
                                                                            {item.years && !item.years.length ? " *" : ""}
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
                                            <div className="popup-counter">Count : {inactive_buildings ? inactive_buildings.length : 0}</div>
                                        </div>
                                        <div className="build-tem3">
                                            <h4>Assigned Buildings</h4>
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
                                                                <th className="sel-all">Unassign All</th>
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
                                                                                textToHighlight={item.name}
                                                                                className="highlighter"
                                                                            />
                                                                            {item.years && !item.years.length ? " *" : ""}
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
                                            <div className="popup-counter">Count : {assigned_buildings ? assigned_buildings.length : 0}</div>
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
                                                <h4 className={`${showErrorBorder && errorParams.building_ids ? "mb-0" : ""}`}>Assigned Buildings</h4>
                                                {showErrorBorder && errorParams.building_ids && (
                                                    <p className={`${showErrorBorder && errorParams.building_ids ? "text-red text-error" : ""}`}>
                                                        *Choose at least one building
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
                                                                                    assigned_buildings.length &&
                                                                                    surveyParams.building_ids.length === assigned_buildings.length
                                                                                }
                                                                            />
                                                                            <span
                                                                                className="checkmark"
                                                                                onClick={() =>
                                                                                    this.selectAllSurveyParams(
                                                                                        "building_ids",
                                                                                        surveyParams.building_ids.length === assigned_buildings.length
                                                                                    )
                                                                                }
                                                                            ></span>
                                                                        </label>
                                                                    </th>
                                                                    <th className="sel-all">Select All</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {assigned_buildings && assigned_buildings.length ? (
                                                                    assigned_buildings.map((item, i) => (
                                                                        <tr key={i}>
                                                                            <td className="img-sq-box">
                                                                                <label className="container-check">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={surveyParams.building_ids.includes(item.id)}
                                                                                    />
                                                                                    <span
                                                                                        className="checkmark"
                                                                                        onClick={() =>
                                                                                            this.updateSurveyParams(item.id, "building_ids")
                                                                                        }
                                                                                    ></span>
                                                                                </label>
                                                                            </td>
                                                                            <td>
                                                                                <Highlighter
                                                                                    searchWords={[`${assignedSearchKey}`]}
                                                                                    textToHighlight={item.name}
                                                                                    className="highlighter"
                                                                                />
                                                                                {item.years && !item.years.length ? " *" : ""}
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
                                                <div className="popup-counter">Count : {assigned_buildings ? assigned_buildings.length : 0}</div>
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
                                                                                    textToHighlight={item}
                                                                                    className="highlighter"
                                                                                />
                                                                            </td>
                                                                            {this.renderYearStatus(item)}
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
                                                    <div className="popup-counter">Count : {yearsList ? yearsList.length : 0}</div>
                                                </div>
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
                                                onClick={() => this.updateAsignedLogbooksAndGetCreateSurveyPopupDetails()}
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

export default withRouter(connect(mapStateToProps, { ...commonActions })(UpdateLogbookBuildingsAndScheduleModal));
