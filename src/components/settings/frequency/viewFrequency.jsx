import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import history from "../../../config/history";
import CommonView from "../../common/components/CommonView";
import Portal from "../../common/components/Portal";
import ConfirmationModal from "../../../components/common/components/ConfirmationModal";
import CommonViewTabs from "../../common/components/CommonViewTabs";
import ComingSoon from "../../common/components/ComingSoon";

class ViewFrequency extends Component {
    constructor(props) {
        super(props);
        this.state = {
            basicDetails: {
                name: "",
                interval: "",
                performance_window: "",
                email_threshold: "",
                recurrence: "",
                completion_threshold: "",
                test_frequency: "",
                window: "",
                interval_type: "",
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
        let frequencyData = await this.props.getDataById(this.props.match.params.id);
        if (frequencyData && frequencyData.success) {
            this.setState({
                basicDetails: {
                    name: frequencyData.frequency.name,
                    created_at: frequencyData.frequency.created_at,
                    updated_at: frequencyData.frequency.updated_at,
                    interval: frequencyData.frequency.interval,
                    performance_window: frequencyData.frequency.performance_window,
                    email_threshold: frequencyData.frequency.email_threshold,
                    recurrence: frequencyData.frequency.recurrence,
                    completion_threshold: frequencyData.frequency.completion_threshold,
                    test_frequency: frequencyData.frequency.test_frequency,
                    window: frequencyData.frequency.window,
                    interval_type: frequencyData.frequency.interval_type
                }
            });
        }
        return true;
    };

    goBack = () => {
        history.push("/frequencies");
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
            match: {
                params: { tab }
            },
            updateDeemingAgencyAssignment,
            hasLogView,
            hasLogDelete,
            hasLogRestore,
            hasEdit,
            hasDelete,
            hasDeemingAgencyAssign
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
                            updateDeemingAgencyAssignment={updateDeemingAgencyAssignment}
                            hasLogView={hasLogView}
                            hasLogDelete={hasLogDelete}
                            hasLogRestore={hasLogRestore}
                            hasEdit={hasEdit}
                            hasDelete={hasDelete}
                            hasDeemingAgencyAssign={hasDeemingAgencyAssign}
                        />
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

export default withRouter(ViewFrequency);
