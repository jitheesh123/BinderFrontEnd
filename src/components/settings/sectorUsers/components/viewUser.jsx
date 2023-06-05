import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import history from "../../../../config/history";
import CommonView from "../../../common/components/CommonView";
import Portal from "../../../common/components/Portal";
import ConfirmationModal from "../../../common/components/ConfirmationModal";
import CommonViewTabs from "../../../common/components/CommonViewTabs";
import Logbooks from "../../consultancyLogbook";
import Activities from "../../consultancyActivity";

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
                client: ""
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
        this.props.showInfoPage(this.props.match.params.id, "", previousPath);
        await this.refreshinfoDetails();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            // this.props.showInfoPage(this.props.match.params.id);
            await this.refreshinfoDetails();
        }
    };

    refreshinfoDetails = async () => {
        let userData = await this.props.getDataById(this.props.match.params.id);
        if (userData && userData.success) {
            this.setState({
                basicDetails: {
                    code: userData.sector_user.code,
                    name: userData.sector_user.name,
                    image: userData.sector_user.image,
                    created_at: userData.sector_user.created_at,
                    updated_at: userData.sector_user.updated_at,
                    email: userData.sector_user.email,
                    password: userData.sector_user.password,
                    first_name: userData.sector_user.first_name,
                    last_name: userData.sector_user.last_name,
                    printed_name: userData.sector_user.printed_name,
                    title: userData.sector_user.title,
                    work_phone: userData.sector_user.work_phone,
                    cell_phone: userData.sector_user.cell_phone,
                    room_number: userData.sector_user.room_number,
                    room_name: userData.sector_user.room_name,
                    emergency_contact_no: userData.sector_user.emergency_contact_no,
                    emergency_contact_name: userData.sector_user.emergency_contact_name,
                    notes: userData.sector_user.notes,
                    address: userData.sector_user.address,
                    state: userData.sector_user.state,
                    city: userData.sector_user.city,
                    zip_code: userData.sector_user.zip_code,
                    department: userData.sector_user.department,
                    credentials: userData.sector_user.credentials,
                    location: userData.sector_user.location,
                    role: userData.sector_user.role,
                    building_name: userData.sector_user.building_name,
                    is_active: userData.sector_user.is_active,
                    is_blocked: userData.sector_user.is_blocked,
                    cmms_username: userData.sector_user.cmms_username,
                    consultancy: userData.sector_user.consultancy,
                    client: userData.sector_user.client
                }
            });
        }
        return true;
    };

    goBack = () => {
        let previousPath = this.props.location && this.props.location.state && this.props.location.state.prevPath;
        // history.push("/activities");
        history.push(previousPath || "/users");
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
            hasDelete = true
        } = this.props;

        const { basicDetails } = this.state;
        return (
            <React.Fragment>
                <section className="cont-ara">
                    <div className="fst">
                        <CommonViewTabs
                            tabData={infoTabsData}
                            goBack={this.goBack}
                            item={basicDetails}
                            keys={keys}
                            config={config}
                            currentTab={tab}
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
                                updateScheduling={updateAssignment}
                                updateActivityScheduling={updateAssignActivity}
                                hasLogView={false}
                                hasEdit={false}
                                hasDelete={hasDelete}
                            />
                        ) : tab === "assignedlogbooks" ? (
                            <div className="infoPageContent">
                                <div className="frm-ara cmon-ara">
                                    <div className="head">
                                        <h3>&nbsp;</h3>
                                        <div className="btn-sec">
                                            <button className="btn" onClick={() => updateAssignment(id)}>
                                                <img src="/images/logbook-icon.svg" alt="" />
                                                Assign Logbooks
                                            </button>
                                        </div>
                                    </div>
                                    <Logbooks />
                                </div>
                            </div>
                        ) : tab === "assignedactivities" ? (
                            <div className="infoPageContent">
                                <div className="frm-ara cmon-ara">
                                    <div className="head">
                                        <h3>&nbsp;</h3>
                                        <div className="btn-sec">
                                            <button className="btn" onClick={() => updateAssignActivity(id)}>
                                                <img src="/images/logbook-icon.svg" alt="" />
                                                Assign Activities
                                            </button>
                                        </div>
                                    </div>
                                    <Activities />
                                </div>
                            </div>
                        ) : null}
                    </div>
                </section>
                {this.renderConfirmationModalLog()}
            </React.Fragment>
        );
    }
}

export default withRouter(viewConsultancy);
