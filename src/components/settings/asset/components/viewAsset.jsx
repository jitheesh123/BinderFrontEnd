import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import history from "../../../../config/history";
import CommonView from "../../../common/components/CommonView";
import Portal from "../../../common/components/Portal";
import ConfirmationModal from "../../../common/components/ConfirmationModal";
import CommonViewTabs from "../../../common/components/CommonViewTabs";
import ComingSoon from "../../../common/components/ComingSoon";
import InfoImage from "../../../common/components/InfoImages";

class ViewFloor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            basicDetails: {
                asset_id: "",
                name: "",
                asset_type: "",
                consultancy: "",
                client: "",
                sector: "",
                campus: "",
                building: "",
                floor: "",
                room: "",
                area_served: "",
                make: "",
                model_number: "",
                serial_number: "",
                size: "",
                volts: "",
                amps: "",
                year_of_unit: "",
                installed_year: "",
                service_life: "",
                useful_life_remaining: "",
                crv: "",
                asset_condition: "",
                notes: "",
                device_count: "",
                is_active: "",
                created_at: "",
                updated_at: "",
                image: ""
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
        const { infoTabsData } = this.props;
        if (!infoTabsData) {
            this.props.showInfoPage(this.props.match.params.id, previousPath);
        }
        await this.refreshinfoDetails();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.match.params.id !== this.props.match.params.id || prevProps.match.params.tab !== this.props.match.params.tab) {
            await this.refreshinfoDetails();
        }
    };

    refreshinfoDetails = async () => {
        let assetData = await this.props.getDataById(this.props.match.params.id);
        if (assetData && assetData.success) {
            this.setState({
                basicDetails: {
                    asset_id: assetData.asset.asset_id,
                    name: assetData.asset.name,
                    asset_type: assetData.asset.asset_type,
                    consultancy: assetData.asset.consultancy,
                    client: assetData.asset.client,
                    building: assetData.asset.building,
                    floor: assetData.asset.floor,
                    area_served: assetData.asset.area_served,
                    make: assetData.asset.make,
                    model_number: assetData.asset.model_number,
                    serial_number: assetData.asset.serial_number,
                    size: assetData.asset.size,
                    volts: assetData.asset.volts,
                    amps: assetData.asset.amps,
                    year_of_unit: assetData.asset.year_of_unit,
                    installed_year: assetData.asset.installed_year,
                    service_life: assetData.asset.service_life,
                    useful_life_remaining: assetData.asset.useful_life_remaining,
                    crv: assetData.asset.crv,
                    asset_condition: assetData.asset.asset_condition,
                    notes: assetData.asset.notes,
                    device_count: assetData.asset.device_count,
                    is_active: assetData.asset.is_active,
                    created_at: assetData.asset.created_at,
                    updated_at: assetData.asset.updated_at,
                    image: assetData.asset.image,
                    room: assetData.asset.room,
                    sector: assetData.asset.sector,
                    campus: assetData.asset.campus
                }
            });
        }
        return true;
    };

    goBack = () => {
        let previousPath = this.props.location && this.props.location.state && this.props.location.state.prevPath;
        history.push(previousPath || "/assets");
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
            updateFrequencyAssignment,
            hasLogView,
            hasLogDelete,
            hasLogRestore,
            hasEdit,
            hasDelete,
            getAllImageList,
            imageResponse,
            uploadImages,
            updateImageComment,
            deleteImages,
            hasLogbookAssign,
            updateScheduling,
            hasActivityAssign,
            updateAssignActivity
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
                            updateFrequencyAssignment={updateFrequencyAssignment}
                            hasLogView={hasLogView}
                            hasLogDelete={hasLogDelete}
                            hasLogRestore={hasLogRestore}
                            hasEdit={hasEdit}
                            hasDelete={hasDelete}
                            updateScheduling={updateScheduling}
                            updateActivityScheduling={updateAssignActivity}
                            hasLogbookAssign={hasLogbookAssign}
                            hasActivityAssign={hasActivityAssign}
                        />
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

export default withRouter(ViewFloor);
