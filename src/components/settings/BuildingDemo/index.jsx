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
import { clearCommonResposeReduer, getBuildingData, deleteBuilding, getBuildingById } from "./actions";
import ToastMsg from "../../common/ToastMessage";
import AddBuildingForm from "./AddBuildingDemo";
import Portal from "../../common/components/Portal";
import ConfirmationModal from "../../common/components/ConfirmationModal";

const InitialValues = {
    paginationParams: { perPage: "20" },
    params: { page: 1, limit: 20 },
    GetData: false,
    showWildCardFilter: false,
    showConfirmaionModal: false
};

const Index = props => {
    const dispatch = useDispatch();

    const { section, id } = useParams();

    const { isLoading, setIsLoading, location } = props;

    const [state, setState] = useState(InitialValues);

    const { paginationParams, params, GetData, showWildCardFilter, tableData, infoTabsData, showConfirmaionModal, selectedBuilding } = state;

    const { buildingData, CommonResposeReduer } = useSelector(s => s.BuildingDemoReducer);

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
            setState({
                ...state,
                paginationParams: {
                    ...paginationParams,
                    totalPages: Math.ceil(buildingData.count / params?.limit),
                    totalCount: buildingData.count
                }
            });
        }
    }, [buildingData.count, params?.limit]);

    useEffect(() => {
        dispatch(getBuildingData(setIsLoading, params));
    }, [GetData]);

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

    const deleteItem = id => {
        setState({ ...state, selectedBuilding: id, showConfirmaionModal: true });
    };

    const confirmDelete = () => {
        dispatch(deleteBuilding(selectedBuilding, setIsLoading, params));
        setState({ ...state, showConfirmaionModal: false });
        history.push("/buildingDemo");
    };

    const OnCancel = () => {
        setState({ ...state, showConfirmaionModal: false });
    };

    const showInfoPage = id => {
        setState({
            ...state,
            selectedBuilding: id,
            infoTabsData: [{ label: "Basic Details", path: `/buildingDemo/ViewDetails/${id}/basicdetails`, key: "basicdetails" }]
        });

        history.push(`/buildingDemo/ViewDetails/${id}/basicdetails`);
    };

    const getDataById = async id => {
        const { building } = await dispatch(getBuildingById(id));
        return { success: true, building };
    };

    const showEditPage = id => {
        setState({ ...state, selectedBuilding: id });
        history.push(`/buildingDemo/edit/${id}`);
    };

    const handleGlobalSearch = search => setState({ ...state, params: { ...params, page: 1, search }, GetData: !GetData });

    const updateTableSortFilters = searchKey => {
        if (params.order) {
            setState({
                ...state,
                params: { ...params, order: { ...params.order, [searchKey]: params.order[searchKey] === "desc" ? "asc" : "desc" } },
                GetData: !GetData
            });
        } else {
            setState({ ...state, params: { ...params, order: { [searchKey]: "asc" } }, GetData: !GetData });
        }
    };

    const resetSort = () => setState({ ...state, params: { ...params, order: null }, GetData: !GetData });

    const resetAllFilters = () => {
        setState({
            ...state,
            paginationParams: { ...paginationParams, totalPages: 0, perPage: 40, currentPage: 0, totalCount: 0 },
            params: { ...params, limit: 40, page: 1, search: "", filters: null, list: null, order: null },
            tableData: { ...tableData, config: BuildingTableConfig.config },
            showWildCardFilter: false,
            GetData: !GetData
        });
    };

    const toggleFilter = () => setState({ ...state, showWildCardFilter: !showWildCardFilter });

    const updateWildCardFilter = newFilter => {
        setState({ ...state, params: { ...params, offset: 0, filters: newFilter, list: null, search: "" }, GetData: !GetData });
    };

    const resetWildCardFilter = () => {
        setState({
            ...state,
            params: { ...params, filters: null, list: null, search: "" },
            showWildCardFilter: false,
            GetData: !GetData
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
                    />
                ) : (
                    <div className="list-area">
                        <TopSlider />
                        <div className="lst-bt-nav">
                            <div className="table table-ara">
                                <TableTopheader
                                    resetAllFilters={resetAllFilters}
                                    hasExport={false}
                                    tableParams={params}
                                    handleGlobalSearch={handleGlobalSearch}
                                    entity={"Building-Demo"}
                                    addItem={showAddForm}
                                    resetSort={resetSort}
                                    toggleFilter={toggleFilter}
                                    showWildCardFilter={showWildCardFilter}
                                    resetWildCardFilter={resetWildCardFilter}
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
            </LoadingOverlay>
        </section>
    );
};

export default Index;
