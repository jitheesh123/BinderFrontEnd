import React, { Component } from "react";
import history from "../../../../config/history";
import CommonView from "../../../common/components/CommonView";
import { withRouter } from "react-router-dom";
import Portal from "../../../common/components/Portal";
import ConfirmationModal from "../../../common/components/ConfirmationModal";
import CommonViewTabs from "../../../common/components/CommonViewTabs";
import ComingSoon from "../../../common/components/ComingSoon";
import Consultancy from "../../logbookConsultancy/index";
import Client from "../../logbookClient/index";
import Building from "../../logbookBuilding/index";
import Activity from "../../activity/index";
import InfoImage from "../../../common/components/InfoImages";

class viewLogbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            basicDetails: {
                code: "",
                name: "",
                logbook_type: "",
                display_name: "",
                consultancy: "",
                client: "",
                color: "",
                text_color: "",
                line: "",
                order: "",
                created_at: "",
                updated_at: "",
                has_asset: "",
                is_active: ""
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
                    code: logbookData.logbook.code,
                    name: logbookData.logbook.name,
                    logbook_type: logbookData.logbook.logbook_type,
                    display_name: logbookData.logbook.display_name,
                    created_at: logbookData.logbook.created_at,
                    updated_at: logbookData.logbook.updated_at,
                    order: logbookData.logbook.order,
                    line: logbookData.logbook.line,
                    color: logbookData.logbook.color,
                    text_color: logbookData.logbook.text_color,
                    client: logbookData.logbook.client,
                    consultancy: logbookData.logbook.consultancy,
                    has_asset: logbookData.logbook.has_asset,
                    is_active: logbookData.logbook.is_active
                }
            });
        }
        return true;
    };

    goBack = () => {
        history.push("/logbooks");
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
                params: { tab, id }
            },
            getAllImageList,
            imageResponse,
            uploadImages,
            updateImageComment,
            deleteImages,
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
            setIsLoading
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
                            updateConsultancyAssignment={updateConsultancyAssignment}
                            updateClientAssignment={updateClientAssignment}
                            updateBuildingAssignment={updateBuildingAssignment}
                            hasLogView={hasLogView}
                            hasLogDelete={hasLogDelete}
                            hasLogRestore={hasLogRestore}
                            hasEdit={hasEdit}
                            hasDelete={hasDelete}
                            hasConsultancyAssign={hasConsultancyAssign}
                            hasClientAssign={hasClientAssign}
                            hasBuildingAssign={hasBuildingAssign}
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
                                <Client clientId={this.props.match.params.id} />
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
                                <Building clientId={this.props.match.params.id} />
                            </div>
                        </div>
                    ) : tab === "activities" ? (
                        <div className="infoPageContent showAddButton">
                            <div className="frm-ara cmon-ara">
                                <div className="head">
                                    <h3>&nbsp;</h3>
                                </div>
                                <Activity setIsLoading={setIsLoading} />
                            </div>
                        </div>
                    ) : tab === "images" ? (
                        <InfoImage
                            getAllImageList={getAllImageList}
                            imageResponse={imageResponse}
                            uploadImages={uploadImages}
                            updateImageComment={updateImageComment}
                            deleteImages={deleteImages}
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

export default withRouter(viewLogbook);
