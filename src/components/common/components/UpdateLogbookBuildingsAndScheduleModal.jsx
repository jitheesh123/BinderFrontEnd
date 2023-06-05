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
            building: null,
            assigned_logbooks: [],
            inactive_logbooks: [],
            initial_assigned_logbooks: [],
            available_logbooks: [],
            currentAssignments: [],
            logbook_ids: [],
            showConfirmation: false,
            surveyParams: {
                building_id: this.props.building_id || null,
                logbook_ids: [],
                years: [],
                empty_survey: true,
                overwrite_existing_survey: false
            },
            errorParams: {
                years: false,
                logbook_ids: false,
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
        await this.getAssignLogbookPopupDetails();
    };

    setActiveTab = async activeTab => {
        await this.setState({
            activeTab
        });
        if (activeTab === 1) {
            await this.getAssignLogbookPopupDetails();
        } else {
            await this.updateAsignedLogbooksAndGetCreateSurveyPopupDetails();
        }
        let myDiv = document.getElementById(`customCheck${new Date().getFullYear()}`);
        if (myDiv) myDiv.scrollIntoView({ block: "center" });
    };

    getAssignLogbookPopupDetails = async () => {
        const { building_id } = this.props;
        await this.props.getAssignLogbookPopupDetails(building_id);
        const {
            commonReducer: {
                getAssignLogbookPopupDetailsResponse: { building, inactive_logbooks = [], assigned_logbooks = [], available_logbooks = [], success }
            }
        } = this.props;
        if (success) {
            await this.setState({
                building,
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
                getAssignLogbookPopupDetailsResponse: { available_logbooks = [] }
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
                getAssignLogbookPopupDetailsResponse: { inactive_logbooks = [] }
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

    searchInAssigned = async (assignedSearchKey, type = "assign") => {
        let assigned_logbooks = [];

        if (type === "create_survey") {
            assigned_logbooks = this.props.commonReducer.getCreateSurveyPopupDetailsForBuildingResponse.assigned_logbooks || [];
        } else {
            assigned_logbooks = this.props.commonReducer.getAssignLogbookPopupDetailsResponse.assigned_logbooks || [];
        }

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
                getAssignLogbookPopupDetailsResponse: { assigned_logbooks = [] }
            }
        } = this.props;

        const { available_logbooks } = this.state;
        let availableLogbookIds = available_logbooks.map(item => item.id);
        let result = assigned_logbooks.filter(item => !availableLogbookIds.includes(item.id));
        if (assignedSearchKey.trim().length) {
            result = result.filter(
                ({ name, years }) =>
                    name.toLowerCase().includes(assignedSearchKey.toLowerCase()) || years.find(year => year.includes(assignedSearchKey))
            );
        }
        await this.setState({
            assignedSearchKey,
            assigned_logbooks: result
        });
    };

    updateAsignedLogbooksAndGetCreateSurveyPopupDetails = async () => {
        const { initial_assigned_logbooks, logbook_ids } = this.state;
        if (_.isEqual(initial_assigned_logbooks.sort(), logbook_ids.sort())) {
            this.onUpdateAssignedLogbookssConfrim();
        } else {
            this.togglShowConfirmation();
        }
    };

    onUpdateAssignedLogbookssConfrim = async () => {
        const { building_id } = this.props;
        const { initial_assigned_logbooks, logbook_ids } = this.state;
        if (!_.isEqual(initial_assigned_logbooks.sort(), logbook_ids.sort())) {
            await this.props.assignLogbookToBuilding(building_id, logbook_ids);
            const {
                commonReducer: {
                    assignLogbookToBuildingResponse: { message }
                }
            } = this.props;
            await this.getAssignLogbookPopupDetails();
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
        await this.props.getCreateSurveyPopupDetailsForBuilding(building_id);
        const {
            commonReducer: {
                getCreateSurveyPopupDetailsForBuildingResponse: { assigned_logbooks, success }
            }
        } = this.props;
        if (success) {
            await this.setState({
                assigned_logbooks,
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
        await this.getAssignLogbookPopupDetails();
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
        const { showCurrentAssignmentModal, assigned_logbooks, assignedSearchKey } = this.state;
        if (!showCurrentAssignmentModal) return null;

        return (
            <Portal
                body={
                    <CurrentAssignmentsModal
                        entity="Logbook"
                        currentAssignments={assigned_logbooks}
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
        const { surveyParams, assigned_logbooks, yearsList } = this.state;
        let tempArray = [];
        if (!isAllSelected) {
            if (keyVal === "years") tempArray = yearsList.map(item => item);
            else tempArray = assigned_logbooks.map(item => item.id);
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
            logbook_ids: false,
            survey_option: false
        };
        let showErrorBorder = false;
        if (!surveyParams.years || !surveyParams.years.length) {
            errorParams.years = true;
            showErrorBorder = true;
        }
        if (!surveyParams.logbook_ids || !surveyParams.logbook_ids.length) {
            errorParams.logbook_ids = true;
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
        const { assigned_logbooks } = this.state;
        let yearCount = 0;
        assigned_logbooks && assigned_logbooks.map(item => item.years && item.years.map(year => year === currentYear && yearCount++));
        return (
            <>
                <td className="text-center check-icon">
                    {assigned_logbooks.length && assigned_logbooks.length === yearCount ? (
                        <i className="material-icons tik bg-theme"> check</i>
                    ) : (
                        <i className="material-icons tik"> close</i>
                    )}
                </td>
                <td className="text-center check-icon">
                    {yearCount && assigned_logbooks.length !== yearCount ? (
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
            building,
            assigned_logbooks,
            available_logbooks,
            inactive_logbooks,
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
                                title="Update Building Logbooks and Schedule"
                                onCancel={this.cancelModal}
                                modalClass="assigned-build-modal"
                            />
                            <h5 className="ml-4">{building && building.name}</h5>
                            <div className="modal-body">
                                <div className="tab-section">
                                    <ul>
                                        <li className={`cursor-pointer ${activeTab === 1 ? "active" : null}`} onClick={() => this.setActiveTab(1)}>
                                            <span className="numb">01</span>
                                            <span className="nme">Update Logbook Assignment</span>
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
                                            <div className="popup-counter">Count : {inactive_logbooks ? inactive_logbooks.length : 0}</div>
                                        </div>
                                        <div className="build-tem3">
                                            <h4>Assigned Logbooks</h4>
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
                                            <div className="popup-counter">Count : {assigned_logbooks ? assigned_logbooks.length : 0}</div>
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
                                                <h4 className={`${showErrorBorder && errorParams.logbook_ids ? "mb-0" : ""}`}>Assigned Logbooks</h4>
                                                {showErrorBorder && errorParams.logbook_ids && (
                                                    <p className={`${showErrorBorder && errorParams.logbook_ids ? "text-red text-error" : ""}`}>
                                                        *Choose at least one logbook
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
                                                                                    assigned_logbooks.length &&
                                                                                    surveyParams.logbook_ids.length === assigned_logbooks.length
                                                                                }
                                                                            />
                                                                            <span
                                                                                className="checkmark"
                                                                                onClick={() =>
                                                                                    this.selectAllSurveyParams(
                                                                                        "logbook_ids",
                                                                                        surveyParams.logbook_ids.length === assigned_logbooks.length
                                                                                    )
                                                                                }
                                                                            ></span>
                                                                        </label>
                                                                    </th>
                                                                    <th className="sel-all">Select All</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {assigned_logbooks && assigned_logbooks.length ? (
                                                                    assigned_logbooks.map((item, i) => (
                                                                        <tr key={i}>
                                                                            <td className="img-sq-box">
                                                                                <label className="container-check">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={surveyParams.logbook_ids.includes(item.id)}
                                                                                    />
                                                                                    <span
                                                                                        className="checkmark"
                                                                                        onClick={() =>
                                                                                            this.updateSurveyParams(item.id, "logbook_ids")
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
                                                <div className="popup-counter">Count : {assigned_logbooks ? assigned_logbooks.length : 0}</div>
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
