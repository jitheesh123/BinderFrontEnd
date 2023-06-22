import React, { useEffect, useState } from "react";
import history from "../../../config/history";
import CommonView from "../../common/components/CommonView";
import CommonViewTabs from "../../common/components/CommonViewTabs";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import ComingSoon from "../../common/components/ComingSoon";
import Logbooks from "../buildingLogbook";
import Activities from "../buildingActivity";
import Users from "../../settings/buildingUsers/index";
import Floor from "../floor/index";
import Assets from "../asset/index";
import FormType from "../formType";
import { useSelector } from "react-redux";

const ViewBuilding = ({
    keys,
    config,
    infoTabsData,
    deleteItem,
    showEditPage,
    getDataById,
    showInfoPage,
    hasLogbookAssign,
    hasActivityAssign,
    updateScheduling,
    updateAssignActivity,
    hasUserAssign,
    updateUserAssignment,
    setIsLoading,
    toggleViewPage,
    isLogView,
    getLogData,
    logData,
    handleDeleteLog,
    handleRestoreLog,
    handlePageClickHistory,
    handleGlobalSearchHistory,
    globalSearchKeyHistory,
    historyPaginationParams,
    updateLogSortFilters,
    historyParams,
    hasLogDelete,
    hasLogRestore,
    goBack
}) => {
    const [state, setState] = useState({ basicDetails: {} });

    let { id, tab } = useParams();

    const { CommonResposeReduer } = useSelector(s => s.BuildingDemoReducer);

    const refreshinfoDetails = async () => {
        let { success, building } = await getDataById(id);
        if (building && success) setState({ ...state, basicDetails: building });
    };

    useEffect(() => {
        if (CommonResposeReduer.message === "Data restored successfully") {
            refreshinfoDetails();
        }
    }, [CommonResposeReduer.success]);

    useEffect(() => {
        showInfoPage(id);
        refreshinfoDetails();
    }, []);

    return (
        <div className="fst">
            <CommonViewTabs tabData={infoTabsData} goBack={goBack} item={state.basicDetails} keys={keys} config={config} currentTab={tab} />
            {tab === "basicdetails" ? (
                <CommonView
                    item={state.basicDetails}
                    keys={keys}
                    config={config}
                    goBack={goBack}
                    tabData={infoTabsData}
                    editItem={showEditPage}
                    deleteItem={deleteItem}
                    toggleViewPage={toggleViewPage}
                    isLogView={isLogView}
                    getLogData={getLogData}
                    logData={logData}
                    handleDeleteLog={handleDeleteLog}
                    handleRestoreLog={handleRestoreLog}
                    handlePageClickHistory={handlePageClickHistory}
                    handleGlobalSearchHistory={handleGlobalSearchHistory}
                    globalSearchKeyHistory={globalSearchKeyHistory}
                    historyPaginationParams={historyPaginationParams}
                    updateLogSortFilters={updateLogSortFilters}
                    historyParams={historyParams}
                    hasLogDelete={hasLogDelete}
                    hasLogRestore={hasLogRestore}
                    hasLogbookAssign={hasLogbookAssign}
                    hasActivityAssign={hasActivityAssign}
                    hasUserAssign={hasUserAssign}
                    updateScheduling={updateScheduling}
                    updateActivityScheduling={updateAssignActivity}
                    updateUserAssignment={updateUserAssignment}
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
            ) : tab === "assignedconsultancy" ? (
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
    );
};

export default ViewBuilding;
