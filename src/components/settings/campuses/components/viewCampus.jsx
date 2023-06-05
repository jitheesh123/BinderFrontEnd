import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import history from "../../../../config/history";
import CommonView from "../../../common/components/CommonView";
import Portal from "../../../common/components/Portal";
import ConfirmationModal from "../../../common/components/ConfirmationModal";
import CommonViewTabs from "../../../common/components/CommonViewTabs";
import ComingSoon from "../../../common/components/ComingSoon";
import Users from "../../campusUsers/index";

class viewCampus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            basicDetails: {
                code: "",
                name: "",
                display_name: "",
                consultancy: "",
                client: "",
                sector: "",
                users: "",
                client_users: "",
                comments: "",
                created_at: "",
                updated_at: ""
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
        let campusData = await this.props.getDataById(this.props.match.params.id);
        if (campusData && campusData.success) {
            this.setState({
                basicDetails: {
                    code: campusData.campus.code,
                    name: campusData.campus.name,
                    display_name: campusData.campus.display_name,
                    created_at: campusData.campus.created_at,
                    updated_at: campusData.campus.updated_at,
                    comments: campusData.campus.comments,
                    sector: campusData.campus.sector,
                    users: campusData.campus.users,
                    client_users: campusData.campus.client_users,
                    client: campusData.campus.client,
                    consultancy: campusData.campus.consultancy
                }
            });
        }
        return true;
    };

    goBack = () => {
        history.push("/campuses");
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
            hasLogView,
            hasLogDelete,
            hasLogRestore,
            hasEdit,
            hasDelete,
            hasUserAssign,
            match: {
                params: { tab, id }
            },
            updateUserAssignment
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
                            updateUserAssignment={updateUserAssignment}
                            hasLogView={hasLogView}
                            hasLogDelete={hasLogDelete}
                            hasLogRestore={hasLogRestore}
                            hasEdit={hasEdit}
                            hasDelete={hasDelete}
                            hasUserAssign={hasUserAssign}
                        />
                    ) : tab === "assignedconsultancy_users" ? (
                        <div className="infoPageContent">
                            <div className="frm-ara cmon-ara">
                                <div className="head">
                                    <h3>&nbsp;</h3>
                                    {hasUserAssign ? (
                                        <div className="btn-sec">
                                            <button className="btn" onClick={() => updateUserAssignment(id)}>
                                                <img src="/images/binder-icon.svg" alt="" />
                                                Assign Users
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                                <Users role="consultancy_user" />
                            </div>
                        </div>
                    ) : tab === "assignedclient_users" ? (
                        <div className="infoPageContent">
                            <div className="frm-ara cmon-ara">
                                <div className="head">
                                    <h3>&nbsp;</h3>
                                    {hasUserAssign ? (
                                        <div className="btn-sec">
                                            <button className="btn" onClick={() => updateUserAssignment(id)}>
                                                <img src="/images/binder-icon.svg" alt="" />
                                                Assign Users
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                                <Users role="client_user" />
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

export default withRouter(viewCampus);
