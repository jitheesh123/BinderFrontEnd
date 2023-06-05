import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import Highlighter from "react-highlight-words";

import CurrentAssignmentsModal from "../../../common/components/CurrentAssignmentsModal";
import Portal from "../../../common/components/Portal";
import BuildModalHeader from "../../../common/components/BuildModalHeader";
import assetActions from "../actions";
import ConfirmationModal from "../../../common/components/ConfirmationModal";
import ToastMsg from "../../../common/ToastMessage";
import { defaultYearsList } from "../../../../config/utils";

class UpdateAssetActivitySchedulingMoadl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 1,
            showCurrentAssignmentModal: false,
            building: null,
            assigned_activities: [],
            initial_assigned_activities: [],
            currentAssignments: [],
            activity_ids: [],
            showConfirmation: false,
            surveyParams: {
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
            assignedSearchKey: "",
            showCancelConfirmModal: false
        };
    }

    componentDidMount = async () => {
        await this.getCreateSurveyTabDetails();
    };

    getCreateSurveyTabDetails = async () => {
        const { id, building_id } = this.props;
        await this.props.getCreateSurveyPopupDetailsForAssetActivitiesScheduling(id, building_id);
        const {
            assetReducer: {
                getCreateSurveyPopupDetailsForAssetActivitiesSchedulingResponse: { assigned_activities, success }
            }
        } = this.props;
        if (success) {
            await this.setState({
                assigned_activities
            });
        }
        let myDiv = document.getElementById(`customCheck${new Date().getFullYear()}`);
        if (myDiv) myDiv.scrollIntoView({ block: "center" });
        return true;
    };

    searchInAssigned = async (assignedSearchKey, type) => {
        const {
            assetReducer: {
                getCreateSurveyPopupDetailsForAssetActivitiesSchedulingResponse: { assigned_activities = [] }
            }
        } = this.props;

        let result = assigned_activities;
        if (assignedSearchKey.trim().length) {
            result = assigned_activities.filter(
                ({ activity_description, logbook, deeming_agency, deeming_agency_frequency }) =>
                    (logbook && logbook.toLowerCase().includes(assignedSearchKey.toLowerCase())) ||
                    (activity_description && activity_description.toLowerCase().includes(assignedSearchKey.toLowerCase())) ||
                    (deeming_agency && deeming_agency.toLowerCase().includes(assignedSearchKey.toLowerCase())) ||
                    (deeming_agency_frequency && deeming_agency_frequency.toLowerCase().includes(assignedSearchKey.toLowerCase()))
            );
        }
        await this.setState({
            assignedSearchKey,
            assigned_activities: result
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
            assetReducer: {
                getCreateSurveyPopupDetailsForAssetActivitiesSchedulingResponse: { assigned_activities = [] }
            }
        } = this.props;
        let result = assigned_activities;
        if (assignedSearchKey.trim().length) {
            result = assigned_activities.filter(
                ({ activity_description, logbook, deeming_agency, deeming_agency_frequency }) =>
                    (logbook && logbook.toLowerCase().includes(assignedSearchKey.toLowerCase())) ||
                    (activity_description && activity_description.toLowerCase().includes(assignedSearchKey.toLowerCase())) ||
                    (deeming_agency && deeming_agency.toLowerCase().includes(assignedSearchKey.toLowerCase())) ||
                    (deeming_agency_frequency && deeming_agency_frequency.toLowerCase().includes(assignedSearchKey.toLowerCase()))
            );
        }
        await this.setState({
            assignedSearchKey,
            assigned_activities: result
        });
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

    updateSurveyParams = async (logbookId, keyVal) => {
        const { surveyParams } = this.state;
        let tempArray = surveyParams[keyVal];
        if (tempArray && tempArray.length) {
            if (tempArray.includes(logbookId)) {
                tempArray = tempArray.filter(item => item !== logbookId);
            } else {
                tempArray.push(logbookId);
            }
        } else {
            tempArray.push(logbookId);
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
            const { id } = this.props;
            const { surveyParams } = this.state;
            const { onCancel } = this.props;
            await this.props.createSurvey(id, surveyParams);
            const {
                assetReducer: {
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
        const { activeTab, building, assigned_activities, yearsList, surveyParams, errorParams, showErrorBorder, assignedSearchKey, yearSearchKey } =
            this.state;
        return (
            <React.Fragment>
                <div className="modal assigned-build-modal three-col-modal" role="dialog" style={{ display: "block" }} id="modalId">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader title="Schedule Asset Activities" onCancel={this.cancelModal} modalClass="assigned-build-modal" />
                            <h5 className="ml-4">{building && building.name}</h5>
                            <div className="modal-body">
                                <div className="tab-section">
                                    <ul>
                                        <li className="cursor-pointer active">
                                            <span className="numb">01</span>
                                            <span className="nme">Create Survey</span>
                                        </li>
                                    </ul>
                                </div>

                                <React.Fragment>
                                    <div className="survey-list">
                                        <ul>
                                            <li>
                                                <label
                                                    className={`${showErrorBorder && errorParams.survey_option ? "text-red" : ""} container-check`}
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
                                                    className={`${showErrorBorder && errorParams.survey_option ? "text-red" : ""} container-check`}
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
                                                <p className={`${showErrorBorder && errorParams.building_activity_ids ? "text-red text-error" : ""}`}>
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
                                                                assignedSearchKey.trim().length ? this.searchInAssigned("", "create_survey") : null
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
                                                                                textToHighlight={item.activity_description}
                                                                                className="highlighter"
                                                                            />
                                                                            {item.years && !item.years.length ? " *" : ""}
                                                                        </td>
                                                                        <td>
                                                                            <Highlighter
                                                                                searchWords={[`${assignedSearchKey}`]}
                                                                                textToHighlight={item.deeming_agency}
                                                                                className="highlighter"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Highlighter
                                                                                searchWords={[`${assignedSearchKey}`]}
                                                                                textToHighlight={item.deeming_agency_frequency}
                                                                                className="highlighter"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Highlighter
                                                                                searchWords={[`${assignedSearchKey}`]}
                                                                                textToHighlight={item.logbook}
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
                                            </div>
                                            <div className="popup-counter">Count : {yearsList ? yearsList.length : 0}</div>
                                        </div>
                                    </div>
                                </React.Fragment>

                                <div className={`btn-sec ${activeTab === 2 ? "btn-survey-sec" : ""}`}>
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
                                    <div className="btn-out-1">
                                        <button className="btn btn-create mr-2" onClick={() => this.createSurvey()}>
                                            <i className="material-icons tic"> check</i> Create Surveys
                                        </button>
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
    const { assetReducer } = state;
    return { assetReducer };
};

export default withRouter(connect(mapStateToProps, { ...assetActions })(UpdateAssetActivitySchedulingMoadl));
