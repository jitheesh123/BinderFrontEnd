import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import qs from "query-string";

import history from "../../../config/history";
import CommonView from "../../common/components/CommonView";
import Portal from "../../common/components/Portal";
import ConfirmationModal from "../../../components/common/components/ConfirmationModal";
import CommonViewTabs from "../../common/components/CommonViewTabs";
import Logbooks from "../clientLogbook";
import Activities from "../clientActivity";

class viewClient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            basicDetails: {
                code: "",
                name: "",
                consultancy: "",
                comments: "",
                display_blinking_red_plus: "",
                ep_name: "",
                lock_total_devices: "",
                modify_next_due_date: "",
                request_email_recipt: "",
                schedule_threshold: "",
                trailing_view_current_month: "",
                use_threshold_for_quarterly: "",
                cmms_url: "",
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
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const clientId = query.clientId || "";
        this.props.showInfoPage(this.props.match.params.id, clientId);
        await this.refreshinfoDetails();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            // this.props.showInfoPage(this.props.match.params.id);
            await this.refreshinfoDetails();
        }
    };

    refreshinfoDetails = async () => {
        let clientData = await this.props.getDataById(this.props.match.params.id);
        console.log("clientDta",clientData)
        if (clientData && clientData.success) {
            this.setState({
                basicDetails: {
                    code: clientData.client.code,
                    name: clientData.client.name,
                    display_blinking_red_plus: clientData.client.display_blinking_red_plus,
                    created_at: clientData.client.created_at,
                    updated_at: clientData.client.updated_at,
                    ep_name: clientData.client.ep_name,
                    lock_total_devices: clientData.client.lock_total_devices,
                    modify_next_due_date: clientData.client.modify_next_due_date,
                    request_email_recipt: clientData.client.request_email_recipt,
                    schedule_threshold: clientData.client.schedule_threshold,
                    consultancy: clientData.client.consultancy,
                    trailing_view_current_month: clientData.client.trailing_view_current_month,
                    use_threshold_for_quarterly: clientData.client.use_threshold_for_quarterly,
                    cmms_url: clientData.client.cmms_url,
                    comments: clientData.client.comments
                }
            });
        }
        return true;
    };

    goBack = () => {
        history.go(-2);
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
            updateAssignment,
            match: {
                params: { tab, id }
            },
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
                                                <img src="/images/binder-icon.svg" alt="" />
                                                Assign Logbooks
                                            </button>
                                        </div>
                                    </div>
                                    <Logbooks clientId={this.props.match.params.id} />
                                </div>
                            </div>
                        ) : tab === "assignedactivities" ? (
                            <div className="infoPageContent">
                                <div className="frm-ara cmon-ara">
                                    <div className="head">
                                        <h3>&nbsp;</h3>
                                        <div className="btn-sec">
                                            <button className="btn">
                                                <img src="/images/binder-icon.svg" alt="" />
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

export default withRouter(viewClient);
