import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import history from "../../../config/history";
import CommonView from "../../common/components/CommonView";
import Portal from "../../common/components/Portal";
import ConfirmationModal from "../../../components/common/components/ConfirmationModal";
import CommonViewTabs from "../../common/components/CommonViewTabs";
import Buildings from "../userBuilding/index";
import BuildingLogbook from "../userBuildingLogbook/index";

class viewConsultancy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            basicDetails: {
                code: "",
                name: "",
                comments: "",
                created_at: "",
                updated_at: "",
                image: "",
                email: "",
                password: "",
                first_name: "",
                last_name: "",
                printed_name: "",
                title: "",
                work_phone: "",
                cell_phone: "",
                room_number: "",
                room_name: "",
                emergency_contact_no: "",
                emergency_contact_name: "",
                notes: "",
                address: "",
                state: "",
                city: "",
                zip_code: "",
                department: "",
                credentials: "",
                location: "",
                role: "",
                building_name: "",
                is_active: "",
                is_blocked: "",
                cmms_username: "",
                consultancy: "",
                client: "",
                permission: "",
                reports: [],
                escalation: [],
                last_seen_at:""
            },
            showConfirmModalLog: false,
            selectedLog: "",
            logChanges: "",
            isLogView: false
        };
    }

    componentDidMount = async () => {
        this.props.showInfoPage(this.props.match.params.id);
        await this.refreshinfoDetails();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.props.showInfoPage(this.props.match.params.id);
            await this.refreshinfoDetails();
        }
    };

    refreshinfoDetails = async () => {
        let userData = await this.props.getDataById(this.props.match.params.id);
        if (userData && userData.success) {
            this.setState({
                basicDetails: {
                    code: userData.user.code,
                    name: userData.user.name,
                    image: userData.user.image,
                    created_at: userData.user.created_at,
                    updated_at: userData.user.updated_at,
                    email: userData.user.email,
                    password: userData.user.password,
                    first_name: userData.user.first_name,
                    last_name: userData.user.last_name,
                    printed_name: userData.user.printed_name,
                    title: userData.user.title,
                    work_phone: userData.user.work_phone,
                    cell_phone: userData.user.cell_phone,
                    room_number: userData.user.room_number,
                    room_name: userData.user.room_name,
                    emergency_contact_no: userData.user.emergency_contact_no,
                    emergency_contact_name: userData.user.emergency_contact_name,
                    notes: userData.user.notes,
                    address: userData.user.address,
                    state: userData.user.state,
                    city: userData.user.city,
                    zip_code: userData.user.zip_code,
                    department: userData.user.department,
                    credentials: userData.user.credentials,
                    location: userData.user.location,
                    role: userData.user.role,
                    building_name: userData.user.building_name,
                    is_active: userData.user.is_active,
                    is_blocked: userData.user.is_blocked,
                    cmms_username: userData.user.cmms_username,
                    consultancy: userData.user.consultancy,
                    client: userData.user.client,
                    permission: userData.user.permission,
                    reports: userData.user.reports,
                    escalation: userData.user.escalation,
                    last_seen_at:userData.user.last_seen_at
                }
            });
        }
        return true;
    };

    goBack = () => {
        history.push("/users");
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
            match: {
                params: { tab, id }
            },
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
            updateAssignment,
            updateAssignActivity,
            updateBuildingLogbookAssignment,
            updateBuildingAssignment,
            hasLogView,
            hasLogDelete,
            hasLogRestore,
            hasEdit,
            hasDelete,
            hasLogbookAssign,
            hasBuildingAssign
        } = this.props;

        const { basicDetails } = this.state;
        return (
            <React.Fragment>
                <div className="fst">
                    <CommonViewTabs tabData={infoTabsData} goBack={this.goBack} item={basicDetails} keys={keys} config={config} currentTab={tab} />
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
                            updateScheduling={updateAssignment}
                            updateActivityScheduling={updateAssignActivity}
                            updateBuildingLogbookAssignment={updateBuildingLogbookAssignment}
                            updateBuildingAssignment={updateBuildingAssignment}
                            hasLogView={hasLogView}
                            hasLogDelete={hasLogDelete}
                            hasLogRestore={hasLogRestore}
                            hasEdit={hasEdit}
                            hasDelete={hasDelete}
                            hasLogbookAssign={hasLogbookAssign}
                            hasBuildingAssign={hasBuildingAssign}
                        />
                    ) : tab === "assignedbuilding" ? (
                        <div className="infoPageContent">
                            <div className="frm-ara cmon-ara">
                                <div className="head">
                                    <h3>&nbsp;</h3>
                                    {hasBuildingAssign ? (
                                        <div className="btn-sec">
                                            <button className="btn" onClick={() => updateBuildingAssignment(id)}>
                                                <img src="/images/assign.svg" alt="" />
                                                Assign Buildings
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                                <Buildings />
                            </div>
                        </div>
                    ) : tab === "assignedbuildinglogbook" ? (
                        <div className="infoPageContent">
                            <div className="frm-ara cmon-ara">
                                <div className="head">
                                    <h3>&nbsp;</h3>
                                    {hasLogbookAssign ? (
                                        <div className="btn-sec">
                                            <button className="btn" onClick={() => updateBuildingLogbookAssignment(id)}>
                                                <img src="/images/assign.svg" alt="" />
                                                Assign Building Logbooks
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                                <BuildingLogbook />
                            </div>
                        </div>
                    ) : null}
                </div>
                {this.renderConfirmationModalLog()}
            </React.Fragment>
        );
    }
}

export default withRouter(viewConsultancy);
