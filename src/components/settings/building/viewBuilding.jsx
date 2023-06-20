import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import history from "../../../config/history";
import CommonView from "../../common/components/CommonView";
import Portal from "../../common/components/Portal";
import ConfirmationModal from "../../../components/common/components/ConfirmationModal";
import CommonViewTabs from "../../common/components/CommonViewTabs";
import ComingSoon from "../../common/components/ComingSoon";
import Logbooks from "../buildingLogbook";
import Activities from "../buildingActivity";
import Users from "../../settings/buildingUsers/index";
import buildingActivity from "../buildingActivity";
import Floor from "../floor/index";
import Assets from "../asset/index";
import FormType from "../formType";

class viewBuilding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            basicDetails: {
                name: "",
                display_name: "",
                zip_code: "",
                city: "",
                state: "",
                year: "",
                country: "",
                ownership: "",
                ownership_type: "",
                use: "",
                area: "",
                number: "",
                cost: "",
                enterprise_index: "",
                manager: "",
                street: "",
                ministry: "",
                description: "",
                comments: "",
                building_id: "",
                client: "",
                sector: "",
                campus: "",
                consultancy: "",
                created_at: "",
                updated_at: "",
                code: "",
                deeming_agency: "",
                building_type: ""
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
        let buildingData = await this.props.getDataById(this.props.match.params.id);
        if (buildingData && buildingData.success) {
            this.setState({
                basicDetails: {
                    code: buildingData.building.code,
                    name: buildingData.building.name,
                    display_name: buildingData.building.display_name,
                    created_at: buildingData.building.created_at,
                    updated_at: buildingData.building.updated_at,
                    ownership: buildingData.building.ownership,
                    ownership_type: buildingData.building.ownership_type,
                    country: buildingData.building.country,
                    zip_code: buildingData.building.zip_code,
                    client: buildingData.building.client,
                    consultancy: buildingData.building.consultancy,
                    campus: buildingData.building.campus,
                    sector: buildingData.building.sector,
                    building_id: buildingData.building.building_id,
                    comments: buildingData.building.comments,
                    description: buildingData.building.description,
                    ministry: buildingData.building.ministry,
                    street: buildingData.building.street,
                    manager: buildingData.building.manager,
                    enterprise_index: buildingData.building.enterprise_index,
                    cost: buildingData.building.cost,
                    number: buildingData.building.number,
                    area: buildingData.building.area,
                    use: buildingData.building.use,
                    city: buildingData.building.city,
                    state: buildingData.building.state,
                    year: buildingData.building.year,
                    deeming_agency: buildingData.building.deeming_agency,
                    building_type: buildingData.building.building_type
                }
            });
        }
        return true;
    };

    goBack = () => {
        history.push("/buildings");
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
            updateScheduling,
            hasLogView,
            hasLogDelete,
            hasLogRestore,
            hasEdit,
            hasDelete,
            hasLogbookAssign,
            hasActivityAssign,
            hasUserAssign,
            match: {
                params: { tab, id }
            },
            updateAssignActivity,
            updateUserAssignment,
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
                            updateScheduling={updateScheduling}
                            updateActivityScheduling={updateAssignActivity}
                            updateUserAssignment={updateUserAssignment}
                            hasLogView={hasLogView}
                            hasLogDelete={hasLogDelete}
                            hasLogRestore={hasLogRestore}
                            hasEdit={hasEdit}
                            hasDelete={hasDelete}
                            hasLogbookAssign={hasLogbookAssign}
                            hasActivityAssign={hasActivityAssign}
                            hasUserAssign={hasUserAssign}
                        />
                    ) : tab === "assignedlogbooks" ? (
                        <div className="infoPageContent">
                            <div className="frm-ara cmon-ara">
                                <div className="head">
                                    <h3>&nbsp;</h3>
                                    {hasLogbookAssign ? (
                                        <div className="btn-sec">
                                            <button className="btn" onClick={() => updateScheduling(id)}>
                                                <img src="/images/binder-icon.svg" alt="" />
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
                                                <img src="/images/binder-icon.svg" alt="" />
                                                Assign Activities
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                                <Activities />
                            </div>
                        </div>
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
                    ) : tab === "floors" ? (
                        <div className="infoPageContent showAddButton">
                            <div className="frm-ara cmon-ara">
                                <div className="head">
                                    <h3>&nbsp;</h3>
                                </div>
                                <Floor buildingId={id} setIsLoading={setIsLoading} />
                            </div>
                        </div>
                    ) : tab === "assets" ? (
                        <div className="infoPageContent showAddButton">
                            <div className="frm-ara cmon-ara">
                                <div className="head">
                                    <h3>&nbsp;</h3>
                                </div>
                                <Assets buildingId={id} setIsLoading={setIsLoading} />
                            </div>
                        </div>
                    ) : tab === "formsettings" ? (
                        <div className="infoPageContent">
                            <div className="frm-ara cmon-ara">
                                <FormType path="building_event_forms" building_id={id} setIsLoading={setIsLoading} />
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

export default withRouter(viewBuilding);
