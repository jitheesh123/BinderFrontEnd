import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";

import CurrentAssignmentsModal from "./CurrentAssignmentsModal";
import Portal from "./Portal";
import BuildModalHeader from "./BuildModalHeader";
import commonActions from "../actions";
import ConfirmationModal from "./ConfirmationModal";
import ToastMsg from "../ToastMessage";
import { defaultYearsList } from "../../../config/utils";

class UpdateActivityBuildingAndScheduleModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 1,
            showCurrentAssignmentModal: false,
            activity: null,
            assigned_buildings: [],
            inactive_buildings: [],
            initial_assigned_buildings: [],
            available_buildings: [],
            currentAssignments: [],
            building_ids: [],
            showConfirmation: false,
            surveyParams: {
                activity_id: this.props.activity_id || null,
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
            showCancelConfirmModal: false
        };
    }

    componentDidMount = async () => {
        await this.getAssignActivityPopupDetails();
    };

    setActiveTab = async activeTab => {
        await this.setState({
            activeTab
        });
        if (activeTab === 1) {
            await this.getAssignActivityPopupDetails();
        } else {
            await this.updateAsignedBuildingsAndGetCreateSurveyPopupDetails();
        }
        let myDiv = document.getElementById(`customCheck${new Date().getFullYear()}`);
        if (myDiv) myDiv.scrollIntoView({ block: "center" });
    };

    getAssignActivityPopupDetails = async () => {
        const { activity_id } = this.props;
        await this.props.getAssignActivityPopupDetails(activity_id);
        const {
            commonReducer: {
                getAssignActivityPopupDetailsResponse: {
                    activity,
                    inactive_buildings = [],
                    assigned_buildings = [],
                    available_buildings = [],
                    success
                }
            }
        } = this.props;
        if (success) {
            await this.setState({
                activity,
                assigned_buildings,
                inactive_buildings,
                available_buildings,
                initial_assigned_buildings: assigned_buildings.map(item => item.id),
                building_ids: assigned_buildings.map(item => item.id)
            });
        }
        return true;
    };

    updateAsignedBuildingsAndGetCreateSurveyPopupDetails = async () => {
        const { initial_assigned_buildings, building_ids } = this.state;
        if (_.isEqual(initial_assigned_buildings.sort(), building_ids.sort())) {
            this.onUpdateAssignedBuildingsConfrim();
        } else {
            this.togglShowConfirmation();
        }
    };

    onUpdateAssignedBuildingsConfrim = async () => {
        const { activity_id } = this.props;
        const { initial_assigned_buildings, building_ids } = this.state;
        if (!_.isEqual(initial_assigned_buildings.sort(), building_ids.sort())) {
            await this.props.assignActivityToBuilding(activity_id, building_ids);
            const {
                commonReducer: {
                    assignActivityToBuildingResponse: { success, message }
                }
            } = this.props;
            // if (!success) {
            //     return false;
            // }
            await this.getAssignActivityPopupDetails();
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
        const { activity_id } = this.props;
        await this.props.getCreateSurveyPopupDetails(activity_id);
        const {
            commonReducer: {
                getCreateSurveyPopupDetailsResponse: { assigned_buildings, success }
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

    renderConfirmationModal = () => {
        const { showConfirmation } = this.state;
        if (!showConfirmation) return null;

        return (
            <Portal
                body={
                    <ConfirmationModal
                        onCancel={this.togglShowConfirmation}
                        onOk={this.onUpdateAssignedBuildingsConfrim}
                        heading={"Update Building Assignment?"}
                    />
                }
                onCancel={this.togglShowConfirmation}
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
        const { showCurrentAssignmentModal, assigned_buildings } = this.state;
        if (!showCurrentAssignmentModal) return null;

        return (
            <Portal
                body={
                    <CurrentAssignmentsModal
                        entity="Building"
                        currentAssignments={assigned_buildings}
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
        let tempAvailableBuildingIds = available_buildings.map(item => item.id);

        if (id === "all") {
            if (type === "add") {
                tempAvailableBuildings.map(item => tempAssignedBuildings.push(item));
                tempAvailableBuildings = [];
                tempInactiveBuildings = tempInactiveBuildings.filter(item => !tempAvailableBuildingIds.includes(item.id));
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
            activity,
            assigned_buildings,
            inactive_buildings,
            available_buildings,
            yearsList,
            surveyParams,
            errorParams,
            showErrorBorder
        } = this.state;
        const { onCancel } = this.props;
        return (
            <React.Fragment>
                <div className="modal assigned-build-modal three-col-modal" role="dialog" style={{ display: "block" }} id="modalId">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader
                                title="Update Activity Buildings and Schedule"
                                onCancel={this.cancelModal}
                                modalClass="assigned-build-modal"
                            />
                            <h5 className="ml-4">{activity && activity.description}</h5>
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
                                                                        <td>{item.name}</td>
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
                                        </div>
                                        <div className="build-tem2">
                                            <h4>Assigned Buildings</h4>
                                            <div className="outer-avl-bind">
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
                                                                        <td>{item.name}</td>
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
                                                            <input type="text" className="form-control" placeholder="Search" />
                                                            <button type="submit" className="btn btn-search">
                                                                <img alt="" src="/images/serach.svg" />
                                                            </button>
                                                            <a className="clear-btn">Clear</a>
                                                        </div>
                                                        {/* <div className="filtr-sec">
                                                            <img alt="" src="/images/filter-on.svg" className="fl-on" />
                                                            <img alt="" src="/images/filter-off.svg" className="fl-off ml-1" />
                                                        </div> */}
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
                                                                                    assigned_buildings.lengt &&
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
                                                                            <td>{item.name}</td>
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
                                            </div>
                                            <div className="build-tem2 w-50">
                                                <h4>Inactive Buildings</h4>
                                                <div className="outer-avl-bind">
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
                                                                            <td>{item.name}</td>
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
                                            </div>
                                            <div className="build-tem3">
                                                <h4 className={`${showErrorBorder && errorParams.years ? "mb-0" : ""}`}>Years</h4>
                                                {showErrorBorder && errorParams.years && (
                                                    <p className={`${showErrorBorder && errorParams.years ? "text-red text-error" : ""}`}>
                                                        *Choose at least one year
                                                    </p>
                                                )}
                                                <div className="outer-avl-bind">
                                                    <div className="sr-sec search-section">
                                                        <div className="sr-out">
                                                            <input type="text" className="form-control" placeholder="Search" />
                                                            <button type="submit" className="btn btn-search">
                                                                <img alt="" src="/images/serach.svg" />
                                                            </button>
                                                            <a className="clear-btn">Clear</a>
                                                        </div>
                                                        {/* <div className="filtr-sec">
                                                            <img alt="" src="/images/filter-on.svg" className="" />
                                                            <img alt="" src="/images/filter-off.svg" className="fl-off ml-1" />
                                                        </div> */}
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
                                                                        <tr key={i} id={`customCheck${item}`}>
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
                                                                            <td>{item}</td>
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
                                                onClick={() => this.updateAsignedBuildingsAndGetCreateSurveyPopupDetails()}
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

export default withRouter(connect(mapStateToProps, { ...commonActions })(UpdateActivityBuildingAndScheduleModal));
