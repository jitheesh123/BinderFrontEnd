import React, { useEffect, useState } from "react";
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

const ViewBuilding = props => {
    const [state, setState] = useState({
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
    });

    useEffect(() => {
        props.showInfoPage(props.match.params.id);
        refreshinfoDetails();
    }, []);

    useEffect((prevProps, prevState) => {
        if (prevProps.match.params.id !== props.match.params.id) {
            props.showInfoPage(props.match.params.id);
            refreshinfoDetails();
        }
    }, []);
    const refreshinfoDetails = async () => {
        let buildingData = await props.getDataById(props.match.params.id);
        if (buildingData && buildingData.success) {
            setState({
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

    const goBack = () => {
        history.push("/buildings");
    };

    const handleRestoreLog = async (id, changes) => {
        await setState({
            showConfirmModalLog: true,
            selectedLog: id,
            logChanges: changes
        });
    };

    const renderConfirmationModalLog = () => {
        const { showConfirmModalLog, logChanges } = state;
        if (!showConfirmModalLog) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        paragraph={logChanges}
                        onCancel={() => setState({ showConfirmModalLog: false })}
                        onOk={restoreLogOnConfirm}
                        isRestore={true}
                        type={"restore"}
                        isLogRestore={true}
                    />
                }
                onCancel={() => setState({ showConfirmModalLog: false })}
            />
        );
    };

    const restoreLogOnConfirm = async () => {
        const { selectedLog } = state;
        await props.HandleRestoreLog(selectedLog);
        setState({
            showConfirmModalLog: false,
            selectedLog: null,
            isLogView: false
        });
        await refreshinfoDetails();
    };

    const toggleViewPage = async () => {
        await setState({ isLogView: !state.isLogView });
    };

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
    } = props;

    const { basicDetails } = state;
    return (
        <>
            <div className="fst">
                <CommonViewTabs tabData={infoTabsData} goBack={goBack} item={basicDetails} keys={keys} config={config} currentTab={tab} />
                {tab === "basicdetails" ? (
                    <CommonView
                        item={basicDetails}
                        keys={keys}
                        config={config}
                        goBack={goBack}
                        tabData={infoTabsData}
                        editItem={showEditPage}
                        deleteItem={deleteItem}
                        getLogData={getLogData}
                        logData={logData}
                        handleDeleteLog={handleDeleteLog}
                        isLogView={state.isLogView}
                        toggleViewPage={toggleViewPage}
                        handleRestoreLog={handleRestoreLog}
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
            {renderConfirmationModalLog()}
        </>
    );
};

export default withRouter(ViewBuilding);
