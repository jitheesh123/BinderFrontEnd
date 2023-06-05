import React, { Component } from "react";
import history from "../../../config/history";
import CommonView from "../../common/components/CommonView";
import { withRouter } from "react-router-dom";
import Portal from "../../common/components/Portal";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import CommonViewTabs from "../../common/components/CommonViewTabs";
import ComingSoon from "../../common/components/ComingSoon";

class viewLogbook extends Component {
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
                is_active: "",
                created_at: "",
                updated_at: ""
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
                    interval_type: frequencyData.frequency.interval_type,
                    performance_window: frequencyData.frequency.performance_window,
                    email_threshold: frequencyData.frequency.email_threshold,
                    recurrence: frequencyData.frequency.recurrence,
                    completion_threshold: frequencyData.frequency.completion_threshold,
                    test_frequency: frequencyData.frequency.test_frequency,
                    window: frequencyData.frequency.window,
                    is_active: frequencyData.frequency.is_active
                }
            });
        }
        return true;
    };

    goBack = () => {
        let previousPath = this.props.location && this.props.location.state && this.props.location.state.prevPath;
        // history.push("/activities");
        history.push(previousPath || "/deeming_agencies");
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
            showTopButtons,
            hasDelete = true
        } = this.props;

        const { basicDetails, prevPath } = this.state;
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
                                showTopButtons={showTopButtons}
                                hasLogView={false}
                                beforePrevPath={prevPath}
                                // hasEdit={false}
                                hasDelete={hasDelete}
                            />
                        ) : (
                            <div className="infoPageContent">
                                <ComingSoon />
                            </div>
                        )}
                    </div>
                </section>
                {this.renderConfirmationModalLog()}
            </React.Fragment>
        );
    }
}

export default withRouter(viewLogbook);
