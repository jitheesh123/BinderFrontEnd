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
                image: ""
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
        let consultancyData = await this.props.getDataById(this.props.match.params.id);
        if (consultancyData && consultancyData.success) {
            this.setState({
                basicDetails: {
                    code: consultancyData.consultancy.code,
                    name: consultancyData.consultancy.name,
                    image: consultancyData.consultancy.image,
                    created_at: consultancyData.consultancy.created_at,
                    updated_at: consultancyData.consultancy.updated_at,
                    comments: consultancyData.consultancy.comments
                }
            });
        }
        return true;
    };

    goBack = () => {
        history.push("/consultancies");
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
            hasEdit,
            hasDelete,
            hasLogView,
            hasLogbookAssign,
            hasActivityAssign,
            hasLogDelete,
            hasLogRestore
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
                            hasEdit={hasEdit}
                            hasDelete={hasDelete}
                            hasLogbookAssign={hasLogbookAssign}
                            hasActivityAssign={hasActivityAssign}
                            hasLogView={hasLogView}
                            hasLogDelete={hasLogDelete}
                            hasLogRestore={hasLogRestore}
                        />
                    ) : tab === "assignedlogbooks" ? (
                        <div className="infoPageContent">
                            <div className="frm-ara cmon-ara">
                                <div className="head">
                                    <h3>&nbsp;</h3>
                                    {hasLogbookAssign ? (
                                        <div className="btn-sec">
                                            <button className="btn" onClick={() => updateAssignment(id)}>
                                                <img src="/images/logbook-icon.svg" alt="" />
                                                Assign Logbooks
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                                <Logbooks />
                            </div>
                        </div>
                    ) : tab === "assignedactivities" ? (
                        <div className="infoPageContent">
                            <div className="frm-ara cmon-ara">
                                <div className="head">
                                    <h3>&nbsp;</h3>
                                    {hasActivityAssign ? (
                                        <div className="btn-sec">
                                            <button className="btn" onClick={() => updateAssignActivity(id)}>
                                                <img src="/images/logbook-icon.svg" alt="" />
                                                Assign Activities
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                                <Activities />
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
