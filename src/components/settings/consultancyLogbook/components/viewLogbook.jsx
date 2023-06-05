import React, { Component } from "react";
import history from "../../../../config/history";
import CommonView from "../../../common/components/CommonView";
import { withRouter } from "react-router-dom";
import Portal from "../../../common/components/Portal";
import ConfirmationModal from "../../../common/components/ConfirmationModal";
import CommonViewTabs from "../../../common/components/CommonViewTabs";
import ComingSoon from "../../../common/components/ComingSoon";

class viewLogbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            basicDetails: {
                code: "",
                name: "",
                display_name: "",
                consultancy: "",
                client: "",
                color: "",
                text_color: "",
                line: "",
                order: "",
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
        let logbookData = await this.props.getDataById(this.props.match.params.id);
        if (logbookData && logbookData.success) {
            this.setState({
                basicDetails: {
                    code: logbookData.consultancy_logbook.code,
                    name: logbookData.consultancy_logbook.name,
                    display_name: logbookData.consultancy_logbook.display_name,
                    created_at: logbookData.consultancy_logbook.created_at,
                    updated_at: logbookData.consultancy_logbook.updated_at,
                    order: logbookData.consultancy_logbook.order,
                    line: logbookData.consultancy_logbook.line,
                    color: logbookData.consultancy_logbook.color,
                    text_color: logbookData.consultancy_logbook.text_color,
                    client: logbookData.consultancy_logbook.client,
                    consultancy: logbookData.consultancy_logbook.consultancy
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
            hasDelete = true,
            match: {
                params: { tab }
            },
            showTopButtons
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
                                showTopButtons={showTopButtons}
                                hasLogView={false}
                                hasEdit={false}
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
