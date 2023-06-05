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
            isLogView: false,
            prevPath: ""
        };
    }

    componentDidMount = async () => {
        let previousPath = this.props.location && this.props.location.state && this.props.location.state.prevPath;
        await this.setState({
            prevPath: previousPath
        });
        this.props.showInfoPage(this.props.match.params.id, "", previousPath);
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
        if (buildingData && buildingData.success) {
            this.setState({
                basicDetails: {
                    code: buildingData.building_user.code,
                    name: buildingData.building_user.name,
                    display_name: buildingData.building_user.display_name,
                    created_at: buildingData.building_user.created_at,
                    updated_at: buildingData.building_user.updated_at,
                    ownership: buildingData.building_user.ownership,
                    ownership_type: buildingData.building_user.ownership_type,
                    country: buildingData.building_user.country,
                    zip_code: buildingData.building_user.zip_code,
                    client: buildingData.building_user.client,
                    consultancy: buildingData.building_user.consultancy,
                    campus: buildingData.building_user.campus,
                    sector: buildingData.building_user.sector,
                    building_id: buildingData.building_user.building_id,
                    comments: buildingData.building_user.comments,
                    description: buildingData.building_user.description,
                    ministry: buildingData.building_user.ministry,
                    street: buildingData.building_user.street,
                    manager: buildingData.building_user.manager,
                    enterprise_index: buildingData.building_user.enterprise_index,
                    cost: buildingData.building_user.cost,
                    number: buildingData.building_user.number,
                    area: buildingData.building_user.area,
                    use: buildingData.building_user.use,
                    city: buildingData.building_user.city,
                    state: buildingData.building_user.state,
                    year: buildingData.building_user.year,
                    deeming_agency: buildingData.building_user.deeming_agency,
                    building_type: buildingData.building_user.building_type
                }
            });
        }
        return true;
    };

    goBack = () => {
        let previousPath = this.props.location && this.props.location.state && this.props.location.state.prevPath;
        // history.push("/activities");
        history.push(previousPath || "/users");
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
