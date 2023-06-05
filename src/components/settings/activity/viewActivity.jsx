import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import history from "../../../config/history";
import CommonView from "../../common/components/CommonView";
import Portal from "../../common/components/Portal";
import ConfirmationModal from "../../../components/common/components/ConfirmationModal";
import CommonViewTabs from "../../common/components/CommonViewTabs";
import ComingSoon from "../../common/components/ComingSoon";
import Consultancy from "../../settings/activityConsultancy/index";
import Client from "../../settings/activityClient/index";
import Building from "../../settings/activityBuilding/index";
import Procedure from "../../settings/activityProcedure/index";
import Forms from "../../settings/activityForm/index";

class viewActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            basicDetails: {
                code: "",
                activity_type: "",
                activity: "",
                client: "",
                consultancy: "",
                display_order: "",
                standard: "",
                activity_description: "",
                schedule_threshold: "",
                activity_text: "",
                activity_tooltip: "",
                interval_type: "",
                frequency: "",
                test_frequency: "",
                completion_threshold: "",
                email_threshold: "",
                code_reference: "",
                code_reference_tooltip: "",
                quarterly_view: "",
                edit_form: "",
                default_total_devices: "",
                start_date: "",
                end_date: "",
                is_active: "",
                created_at: "",
                updated_at: "",
                logbook: "",
                parent: "",
                deeming_agency: "",
                flexible_date_calculation: "",
                standard_tooltip: "",
                shift_start:"",
                shift_end: ""
            },
            showConfirmModalLog: false,
            selectedLog: "",
            logChanges: "",
            isLogView: false,
            prevPath: ""
        };
    }

    componentDidMount = async () => {
        let previousPath = this.props.location && this.props.location.state && this.props.location.state.prevPath;
        await this.setState({
            prevPath: previousPath
        });
        this.props.showInfoPage(this.props.match.params.id, previousPath);
        await this.refreshinfoDetails();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            // this.props.showInfoPage(this.props.match.params.id);
            await this.refreshinfoDetails();
        }
    };

    refreshinfoDetails = async () => {
        let activityData = await this.props.getDataById(this.props.match.params.id);
        console.log("activity data",activityData)
        if (activityData && activityData.success) {
            this.setState({
                basicDetails: {
                    code: activityData.activity.code,
                    default_total_devices: activityData.activity.default_total_devices,
                    created_at: activityData.activity.created_at,
                    updated_at: activityData.activity.updated_at,
                    activity: activityData.activity.activity,
                    display_order: activityData.activity.display_order,
                    schedule_threshold: activityData.activity.schedule_threshold,
                    standard: activityData.activity.standard,
                    activity_type: activityData.activity.type,
                    activity_description: activityData.activity.activity_description,
                    deeming_agency_frequency: activityData.activity.deeming_agency_frequency,
                    client: activityData.activity.client,
                    consultancy: activityData.activity.consultancy,
                    activity_text: activityData.activity.activity_text,
                    activity_tooltip: activityData.activity.activity_tooltip,
                    interval_type: activityData.activity.interval_type,
                    frequency: activityData.activity.frequency,
                    test_frequency: activityData.activity.test_frequency,
                    completion_threshold: activityData.activity.completion_threshold,
                    email_threshold: activityData.activity.email_threshold,
                    code_reference: activityData.activity.code_reference,
                    code_reference_tooltip: activityData.activity.code_reference_tooltip,
                    quarterly_view: activityData.activity.quarterly_view,
                    edit_form: activityData.activity.edit_form,
                    start_date: activityData.activity.start_date,
                    end_date: activityData.activity.end_date,
                    is_active: activityData.activity.is_active,
                    logbook: activityData.activity.logbook,
                    parent: activityData.activity.parent,
                    deeming_agency: activityData.activity.deeming_agency,
                    flexible_date_calculation: activityData.activity.flexible_date_calculation,
                    standard_tooltip: activityData.activity.standard_tooltip,
                    can_be_linked: activityData.activity.can_be_linked,
                    linked_activity: activityData.activity.linked_activity,
                    shift_start:activityData.activity.shift_start,
                    shift_end:activityData.activity.shift_end
                }
            });
        }
        return true;
    };

    goBack = () => {
        let previousPath = this.props.location && this.props.location.state && this.props.location.state.prevPath;
        // history.push("/activities");
        history.push(previousPath || "/activities");
    };

    handleRestoreLog = async (id, changes) => {
        await this.setState({
            showConfirmModalLog: true,
            selectedLog: id,
            logChanges: changes
        });
    };

    renderConfirmationModalLog = () => {
        const { showConfirmModalLog, logChanges } = this.state;
        if (!showConfirmModalLog) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        paragraph={logChanges}
                        onCancel={() => this.setState({ showConfirmModalLog: false })}
                        onOk={this.restoreLogOnConfirm}
                        isRestore={true}
                        type={"restore"}
                        isLogRestore={true}
                    />
                }
                onCancel={() => this.setState({ showConfirmModalLog: false })}
            />
        );
    };

    restoreLogOnConfirm = async () => {
        const { selectedLog } = this.state;
        await this.props.HandleRestoreLog(selectedLog);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null,
            isLogView: false
        });
        await this.refreshinfoDetails();
    };

    toggleViewPage = async () => {
        await this.setState({ isLogView: !this.state.isLogView });
    };

    render() {
        const {
            keys,
            config,
            infoTabsData,
            deleteItem,
            showEditPage,
            getLogData,
            logData,
            handleDeleteLog,
            handlePageClickHistory,
            handleGlobalSearchHistory,
            globalSearchKeyHistory,
            historyPaginationParams,
            updateLogSortFilters,
            historyParams,
            updateScheduling,
            match: {
                params: { tab, id }
            },
            updateConsultancyAssignment,
            updateClientAssignment,
            updateBuildingAssignment,
            hasLogView,
            hasLogDelete,
            hasLogRestore,
            hasEdit,
            hasDelete,
            hasConsultancyAssign,
            hasClientAssign,
            hasBuildingAssign,
            hasProcedureAssign,
            updateProcedureAssignment,
            hasFormAssign,
            updateFormAssignment
        } = this.props;

        const { basicDetails, prevPath } = this.state;
        return (
            <React.Fragment>
                <div className="fst">
                    <CommonViewTabs
                        tabData={infoTabsData}
                        goBack={this.goBack}
                        item={basicDetails}
                        keys={keys}
                        config={config}
                        currentTab={tab}
                        prevPath={prevPath}
                    />
                    {tab === "basicdetails" ? (
                        <CommonView
                            item={basicDetails}
                            keys={keys}
                            config={config}
                            goBack={this.goBack}
                            tabData={infoTabsData}
                            editItem={showEditPage}
                            deleteItem={deleteItem}
                            getLogData={getLogData}
                            logData={logData}
                            handleDeleteLog={handleDeleteLog}
                            isLogView={this.state.isLogView}
                            toggleViewPage={this.toggleViewPage}
                            handleRestoreLog={this.handleRestoreLog}
                            handlePageClickHistory={handlePageClickHistory}
                            handleGlobalSearchHistory={handleGlobalSearchHistory}
                            globalSearchKeyHistory={globalSearchKeyHistory}
                            historyPaginationParams={historyPaginationParams}
                            updateLogSortFilters={updateLogSortFilters}
                            historyParams={historyParams}
                            updateScheduling={updateScheduling}
                            beforePrevPath={prevPath}
                            updateConsultancyAssignment={updateConsultancyAssignment}
                            updateClientAssignment={updateClientAssignment}
                            updateBuildingAssignment={updateBuildingAssignment}
                            updateProcedureAssignment={updateProcedureAssignment}
                            hasLogView={hasLogView}
                            hasLogDelete={hasLogDelete}
                            hasLogRestore={hasLogRestore}
                            hasEdit={hasEdit}
                            hasDelete={hasDelete}
                            hasConsultancyAssign={hasConsultancyAssign}
                            hasClientAssign={hasClientAssign}
                            hasBuildingAssign={hasBuildingAssign}
                            hasProcedureAssign={hasProcedureAssign}
                            updateFormAssignment={updateFormAssignment}
                        />
                    ) : tab === "assignedconsultancies" ? (
                        <div className="infoPageContent">
                            <div className="frm-ara cmon-ara">
                                <div className="head">
                                    <h3>&nbsp;</h3>
                                    {hasConsultancyAssign ? (
                                        <div className="btn-sec">
                                            <button className="btn" onClick={() => updateConsultancyAssignment(id)}>
                                                <img src="/images/assign-cunsaltancy-01.svg" alt="" />
                                                Assign Consultancies
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                                <Consultancy clientId={this.props.match.params.id} />
                            </div>
                        </div>
                    ) : tab === "assignedclients" ? (
                        <div className="infoPageContent">
                            <div className="frm-ara cmon-ara">
                                <div className="head">
                                    <h3>&nbsp;</h3>
                                    {hasClientAssign ? (
                                        <div className="btn-sec">
                                            <button className="btn" onClick={() => updateClientAssignment(id)}>
                                                <img src="/images/assign-client-01.svg" alt="" />
                                                Assign Clients
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                                <Client />
                            </div>
                        </div>
                    ) : tab === "assignedbuildings" ? (
                        <div className="infoPageContent">
                            <div className="frm-ara cmon-ara">
                                <div className="head">
                                    <h3>&nbsp;</h3>
                                    {hasBuildingAssign ? (
                                        <div className="btn-sec">
                                            <button className="btn" onClick={() => updateBuildingAssignment(id)}>
                                                <img src="/images/add-icon.svg" alt="" />
                                                Assign Buildings
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                                <Building />
                            </div>
                        </div>
                    ) : tab === "assignedprocedures" ? (
                        <div className="infoPageContent">
                            <div className="frm-ara cmon-ara">
                                <div className="head">
                                    <h3>&nbsp;</h3>
                                    {hasProcedureAssign ? (
                                        <div className="btn-sec">
                                            <button className="btn" onClick={() => updateProcedureAssignment(id)}>
                                                <img src="/images/assign.svg" alt="" />
                                                Assign Procedures
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                                <Procedure />
                            </div>
                        </div>
                    ) : tab === "assignedforms" ? (
                        <div className="infoPageContent">
                            <div className="frm-ara cmon-ara">
                                <div className="head">
                                    <h3>&nbsp;</h3>
                                    {hasFormAssign ? (
                                        <div className="btn-sec">
                                            <button className="btn" onClick={() => updateFormAssignment(id)}>
                                                <img src="/images/assign-activity.svg" alt="" />
                                                Assign Forms
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                                <Forms />
                            </div>
                        </div>
                    ) : (
                        <div className="infoPageContent">
                            <ComingSoon />
                        </div>
                    )}
                </div>
                {this.renderConfirmationModalLog()}
            </React.Fragment>
        );
    }
}

export default withRouter(viewActivity);
