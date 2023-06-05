import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import qs from "query-string";

import history from "../../../config/history";
import CommonView from "../../common/components/CommonView";
import Portal from "../../common/components/Portal";
import ConfirmationModal from "../../../components/common/components/ConfirmationModal";
import CommonViewTabs from "../../common/components/CommonViewTabs";
import Logbooks from "../consultancyLogbook";
import Activities from "../consultancyActivity";

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
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const consultancyId = query.consultancyId || "";
        this.props.showInfoPage(this.props.match.params.id, consultancyId);
        await this.refreshinfoDetails();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            // this.props.showInfoPage(this.props.match.params.id);
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
        history.go(-2);
        // history.push(`/activity/activityinfo/${this.state.basicDetails.client ? this.state.basicDetails.client.id : ""}/assignedconsultancies`);
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
                                            <button className="btn">
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
