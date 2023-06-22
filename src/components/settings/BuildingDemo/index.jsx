import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonTable from "../../common/components/CommonTable";
import { BuildingTableConfig } from "../../../config/tableConfig";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../../common/components/Loader";
import TableTopheader from "../../common/components/TableTopHeader";
import TopSlider from "../../common/components/TopSlider";
import Pagination from "../../common/components/Pagination";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import history from "../../../config/history";
import ViewBuilding from "./ViewBuildingDemo";
import {
    clearCommonResposeReduer,
    getBuildingData,
    deleteBuilding,
    getBuildingById,
    exportBuilding,
    getAllBuildingLogs,
    deleteBuildingLog,
    restoreBuildingLog
} from "./actions";
import ToastMsg from "../../common/ToastMessage";
import AddBuildingForm from "./AddBuildingDemo";
import Portal from "../../common/components/Portal";
import ViewModal from "../../common/components/ViewModal";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import AssignLogBooksDemo from "./AssignLogBooksDemo";
import AssignUsersDemo from "./AssignUsersDemo";
import AssignActivitiesDemo from "./AssignActivitiesDemo";

const InitialValues = {
    paginationParams: { perPage: "20" },
    params: { page: 1, limit: 20 },
    historyPaginationParams: { perPage: "20" },
    historyParams: { page: 1, limit: 20, search: "" },
    GetData: false,
    showWildCardFilter: false,
    showConfirmaionModal: false,
    showViewModal: false,
    showConfirmModalLog: false,
    isLogView: false,
    GetLogData: false,
    ShowUpdateLogbookBuildingsAndScheduleModal: false,
    ShowUpdateUserAssignmentModal: false,
    ShowUpdateBuildingActivitiesAndScheduleModal: false
};

const Index = ({ isLoading, setIsLoading, location }) => {
    const dispatch = useDispatch();

    const { section, id } = useParams();

    const [state, setState] = useState(InitialValues);

    const {
        paginationParams,
        params,
        GetData,
        showWildCardFilter,
        tableData,
        infoTabsData,
        showConfirmaionModal,
        selectedBuilding,
        showViewModal,
        isLogView,
        historyParams,
        historyPaginationParams,
        showConfirmModalLog,
        selectedLog,
        GetLogData,
        ShowUpdateLogbookBuildingsAndScheduleModal,
        ShowUpdateUserAssignmentModal,
        ShowUpdateBuildingActivitiesAndScheduleModal
    } = state;

    const { buildingData, CommonResposeReduer, getAllBuildingLogResponse } = useSelector(s => s.BuildingDemoReducer);

    BuildingTableConfig.data = buildingData.buildings;

    useEffect(() => {
        if (CommonResposeReduer.success) {
            ToastMsg(CommonResposeReduer.message, "info");
            dispatch(clearCommonResposeReduer());
        }
        if (CommonResposeReduer.success === false) {
            ToastMsg(CommonResposeReduer.message, "danger");
            dispatch(clearCommonResposeReduer());
        }
    }, [CommonResposeReduer]);

    useEffect(() => {
        dispatch(clearCommonResposeReduer());
    }, []);

    useEffect(() => {
        if (buildingData.count && params?.limit) {
            let totalPages = Math.ceil(buildingData.count / params?.limit);
            setState({ ...state, paginationParams: { ...paginationParams, totalPages, totalCount: buildingData?.count } });
        }
    }, [buildingData?.count, params?.limit]);

    useEffect(() => {
        if (getAllBuildingLogResponse?.count) {
            setState({
                ...state,
                historyPaginationParams: {
                    ...historyPaginationParams,
                    totalCount: getAllBuildingLogResponse?.count,
                    totalPages: Math.ceil(getAllBuildingLogResponse?.count / historyParams?.limit)
                }
            });
        }
    }, [getAllBuildingLogResponse?.count]);

    useEffect(() => {
        dispatch(getBuildingData(setIsLoading, params));
    }, [GetData]);

    useEffect(() => {
        if (id) dispatch(getAllBuildingLogs(historyParams, id));
    }, [GetLogData]);

    const showAddForm = () => history.push("/buildingDemo/add", { buildingId: id, prevPath: location.pathname || "/DemoBuildingAdd" });

    const handlePageClick = page => {
        setState({
            ...state,
            paginationParams: { ...paginationParams, currentPage: page.selected },
            params: { ...params, page: page.selected + 1 },
            GetData: !GetData
        });
    };

    const handlePerPageChange = e => {
        setState({
            ...state,
            paginationParams: { ...paginationParams, perPage: e.target.value },
            params: { ...params, page: 1, limit: e.target.value },
            GetData: !GetData
        });
    };

    const deleteItem = id => setState({ ...state, selectedBuilding: id, showConfirmaionModal: true });

    const confirmDelete = () => {
        dispatch(deleteBuilding(selectedBuilding, setIsLoading, params));
        setState({ ...state, showConfirmaionModal: false });
        history.push("/buildingDemo");
    };

    const OnCancel = () => setState({ ...state, showConfirmaionModal: false });

    const showInfoPage = id => {
        setState({
            ...state,
            selectedBuilding: id,
            infoTabsData: [
                { label: "Basic Details", path: `/buildingDemo/ViewDetails/${id}/basicdetails`, key: "basicdetails" },
                { label: "Assigned Logbooks", path: `/buildingDemo/ViewDetails/${id}/assignedlogbooks`, key: "assignedlogbooks" },
                { label: "Assigned Activities", path: `/buildingDemo/ViewDetails/${id}/assignedactivities`, key: "assignedactivities" },
                { label: "Assigned Consultancy Users", path: `/buildingDemo/ViewDetails/${id}/assignedconsultancy`, key: "assignedconsultancy" },
                { label: "Assigned Client Users", path: `/buildingDemo/ViewDetails/${id}/assignedclient_users`, key: "assignedclient_users" },
                { label: "Floors", path: `/buildingDemo/ViewDetails/${id}/floors`, key: "floors" },
                { label: "Assets", path: `/buildingDemo/ViewDetails/${id}/assets`, key: "assets" },
                { label: "Images", path: `/buildingDemo/ViewDetails/${id}/images`, key: "images" },
                { label: "Form Settings", path: `/buildingDemo/ViewDetails/${id}/formsettings`, key: "formsettings" }
            ]
        });
        history.push(`/buildingDemo/ViewDetails/${id}/basicdetails`);
    };

    const getDataById = async id => {
        return { success: true, ...(await dispatch(getBuildingById(id))) };
    };

    const showEditPage = id => {
        setState({ ...state, selectedBuilding: id });
        history.push(`/buildingDemo/edit/${id}`);
    };

    const handleGlobalSearch = search => setState({ ...state, params: { ...params, page: 1, search }, GetData: !GetData });

    const updateTableSortFilters = searchKey => {
        if (params.order)
            setState({
                ...state,
                params: { ...params, order: { ...params.order, [searchKey]: params.order[searchKey] === "desc" ? "asc" : "desc" } },
                GetData: !GetData
            });
        else setState({ ...state, params: { ...params, order: { [searchKey]: "asc" } }, GetData: !GetData });
    };

    const resetSort = () => setState({ ...state, params: { ...params, order: null }, GetData: !GetData });

    const resetAllFilters = () => {
        setState({
            ...state,
            paginationParams: { ...paginationParams, perPage: 20 },
            params: { ...params, limit: 20, page: 1, search: "", filters: null, list: null, order: null },
            tableData: { ...tableData, config: BuildingTableConfig.config },
            showWildCardFilter: false,
            GetData: !GetData
        });
    };

    const goBack = () => {
        setState({ ...state, isLogView: false });
        history.push("/buildingDemo");
    };

    const toggleFilter = () => setState({ ...state, showWildCardFilter: !showWildCardFilter });

    const updateWildCardFilter = newFilter => {
        setState({ ...state, params: { ...params, offset: 0, filters: newFilter, list: null, search: "" }, GetData: !GetData });
    };

    const resetWildCardFilter = () => {
        setState({ ...state, params: { ...params, filters: null, list: null, search: "" }, showWildCardFilter: false, GetData: !GetData });
    };

    const handleHideColumn = keyItem => {
        if (keyItem !== "selectAll" && keyItem !== "deselectAll")
            BuildingTableConfig.config[keyItem] = {
                ...BuildingTableConfig.config[keyItem],
                isVisible: !BuildingTableConfig.config[keyItem].isVisible
            };
        else
            BuildingTableConfig.keys.map(item => {
                if (keyItem === "selectAll") BuildingTableConfig.config[item].isVisible = true;
                else BuildingTableConfig.config[item].isVisible = false;
            });
        return true;
    };

    const showviewModal = () => setState({ ...state, showViewModal: true });

    const exportTable = async () => {
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        dispatch(exportBuilding({ ...params, ...master_filters }));
    };

    const getLogData = id => dispatch(getAllBuildingLogs(historyParams, id));

    const handleDeleteLog = (id, choice) => setState({ ...state, showConfirmModalLog: true, selectedLog: id, isRestoreOrDelete: choice });

    const deleteLogOnConfirm = async () => {
        dispatch(deleteBuildingLog(selectedLog, { historyParams, id }));
        setState({ ...state, showConfirmModalLog: false, selectedLog: null });
    };

    const handleRestoreLog = async Logid => {
        dispatch(restoreBuildingLog(Logid));
        setState({ ...state, isLogView: !isLogView, GetData: !GetData });
    };

    const handleGlobalSearchHistory = search => {
        setState({
            ...state,
            historyParams: { ...historyParams, page: 1, search },
            historyPaginationParams: { ...historyPaginationParams, currentPage: 0 },
            GetLogData: !GetLogData
        });
    };

    const updateLogSortFilters = searchKey => {
        let { order } = historyParams;
        if (historyParams.order)
            setState({
                ...state,
                historyParams: { ...historyParams, order: { ...order, [searchKey]: order[searchKey] === "desc" ? "asc" : "desc" } },
                GetLogData: !GetLogData
            });
        else setState({ ...state, historyParams: { ...historyParams, order: { [searchKey]: "asc" } }, GetLogData: !GetLogData });
    };

    const updateBuildingLogbookScheduling = selectedItem => {
        setState({ ...state, selectedItem, ShowUpdateLogbookBuildingsAndScheduleModal: !ShowUpdateLogbookBuildingsAndScheduleModal });
    };

    const updateUserAssignment = selectedItem => {
        setState({ ...state, selectedItem, ShowUpdateUserAssignmentModal: !ShowUpdateUserAssignmentModal });
    };

    const updateBuildingActivityScheduling = selectedItem => {
        setState({
            ...state,
            selectedItem,
            ShowUpdateBuildingActivitiesAndScheduleModal: !ShowUpdateBuildingActivitiesAndScheduleModal
        });
    };

    return (
        <section className="cont-ara">
            <LoadingOverlay active={isLoading} spinner={<Loader />}>
                {section === "add" || section === "edit" ? (
                    <AddBuildingForm setState={setState} state={state} />
                ) : section === "ViewDetails" ? (
                    <ViewBuilding
                        keys={BuildingTableConfig.keys}
                        config={BuildingTableConfig.config}
                        infoTabsData={infoTabsData}
                        showInfoPage={showInfoPage}
                        getDataById={getDataById}
                        showEditPage={showEditPage}
                        deleteItem={deleteItem}
                        hasLogbookAssign={true}
                        hasActivityAssign={true}
                        hasUserAssign={true}
                        setIsLoading={setIsLoading}
                        toggleViewPage={() => setState({ ...state, isLogView: !isLogView })}
                        isLogView={isLogView}
                        getLogData={getLogData}
                        logData={{ data: getAllBuildingLogResponse?.logs }}
                        handleDeleteLog={handleDeleteLog}
                        handleRestoreLog={handleRestoreLog}
                        goBack={goBack}
                        handleGlobalSearchHistory={handleGlobalSearchHistory}
                        updateLogSortFilters={updateLogSortFilters}
                        historyPaginationParams={historyPaginationParams}
                        historyParams={historyParams}
                        updateScheduling={updateBuildingLogbookScheduling}
                        updateAssignActivity={updateBuildingActivityScheduling}
                        updateUserAssignment={updateUserAssignment}
                    />
                ) : (
                    <div className="list-area">
                        <TopSlider />
                        <div className="lst-bt-nav">
                            <div className="table table-ara">
                                <TableTopheader
                                    resetAllFilters={resetAllFilters}
                                    hasExport={true}
                                    tableParams={params}
                                    handleGlobalSearch={handleGlobalSearch}
                                    entity={"Building-Demo"}
                                    addItem={showAddForm}
                                    resetSort={resetSort}
                                    toggleFilter={toggleFilter}
                                    showWildCardFilter={showWildCardFilter}
                                    resetWildCardFilter={resetWildCardFilter}
                                    showViewModal={showviewModal}
                                    exportTable={exportTable}
                                />
                                <div className="list-sec">
                                    <div className="table-section">
                                        <CommonTable
                                            updateWildCardFilter={updateWildCardFilter}
                                            showWildCardFilter={showWildCardFilter}
                                            updateTableSortFilters={updateTableSortFilters}
                                            deleteItem={deleteItem}
                                            showInfoPage={showInfoPage}
                                            tableData={BuildingTableConfig}
                                            hasSort={true}
                                            hasActionColumn={true}
                                            editItem={showEditPage}
                                            tableParams={params}
                                        />
                                    </div>
                                </div>
                                <Pagination
                                    paginationParams={paginationParams}
                                    handlePageClick={handlePageClick}
                                    handlePerPageChange={handlePerPageChange}
                                    isRecordPerPage={true}
                                />
                            </div>
                        </div>
                        {showViewModal ? (
                            <Portal
                                body={
                                    <ViewModal
                                        keys={BuildingTableConfig.keys}
                                        config={BuildingTableConfig.config}
                                        handleHideColumn={handleHideColumn}
                                        onCancel={() => setState({ ...state, showViewModal: false })}
                                    />
                                }
                                onCancel={() => setState({ ...state, showViewModal: false })}
                            />
                        ) : null}
                    </div>
                )}
                {showConfirmaionModal ? (
                    <Portal
                        body={
                            <ConfirmationModal
                                onCancel={OnCancel}
                                onOk={confirmDelete}
                                heading={"Do you want to delete ?"}
                                paragraph={"This action cannot be reverted, are you sure that you need to delete this item ?"}
                            />
                        }
                    />
                ) : null}
                {showConfirmModalLog ? (
                    <Portal
                        body={
                            <ConfirmationModal
                                heading={"Do you want to delete this log?"}
                                paragraph={"This action cannot be reverted, are you sure that you need to delete this item?"}
                                onCancel={() => setState({ ...state, showConfirmModalLog: false })}
                                onOk={deleteLogOnConfirm}
                            />
                        }
                        onCancel={() => setState({ ...state, showConfirmModalLog: false })}
                    />
                ) : null}
                {ShowUpdateLogbookBuildingsAndScheduleModal ? (
                    <Portal
                        body={<AssignLogBooksDemo cancel={() => setState({ ...state, ShowUpdateLogbookBuildingsAndScheduleModal: false })} />}
                        onCancel={() => setState({ ...state, ShowUpdateLogbookBuildingsAndScheduleModal: false })}
                    />
                ) : null}
                {ShowUpdateUserAssignmentModal ? (
                    <Portal
                        body={<AssignUsersDemo cancel={() => setState({ ...state, ShowUpdateUserAssignmentModal: false })} />}
                        onCancel={() => setState({ ...state, ShowUpdateUserAssignmentModal: false })}
                    />
                ) : null}
                {ShowUpdateBuildingActivitiesAndScheduleModal ? (
                    <Portal
                        body={<AssignActivitiesDemo cancel={() => setState({ ...state, ShowUpdateBuildingActivitiesAndScheduleModal: false })} />}
                        onCancel={() => setState({ ...state, ShowUpdateBuildingActivitiesAndScheduleModal: false })}
                    />
                ) : null}
            </LoadingOverlay>
        </section>
    );
};

export default Index;
