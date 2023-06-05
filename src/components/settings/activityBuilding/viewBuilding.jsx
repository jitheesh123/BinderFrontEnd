import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import history from "../../../config/history";
import CommonView from "../../common/components/CommonView";
import Portal from "../../common/components/Portal";
import ConfirmationModal from "../../../components/common/components/ConfirmationModal";
import CommonViewTabs from "../../common/components/CommonViewTabs";
import ComingSoon from "../../common/components/ComingSoon";
import Logbooks from "../buildingLogbook";
import Activities from "../buildingActivity";

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
                deeming_agency: ""
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
        const buildingId = query.buildingId || "";
        this.props.showInfoPage(this.props.match.params.id, buildingId);
        await this.refreshinfoDetails();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            // this.props.showInfoPage(this.props.match.params.id);
            await this.refreshinfoDetails();
        }
    };

    refreshinfoDetails = async () => {
        let buildingData = await this.props.getDataById(this.props.match.params.id);
        console.log("viewBuilding",buildingData)
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
                    deeming_agency_frequency: buildingData.building.deeming_agency_frequency,
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
            updateScheduling,
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
                                updateScheduling={updateScheduling}
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
                                            <button className="btn" onClick={() => updateScheduling(id)}>
                                                <img src="/images/binder-icon.svg" alt="" />
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
                                                <img src="/images/binder-icon.svg" alt="" />
                                                Assign Activities
                                            </button>
                                        </div>
                                    </div>
                                    <Activities />
                                </div>
                            </div>
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

export default withRouter(viewBuilding);
