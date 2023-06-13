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

const InitialValues = {
    paginationParams: { perPage: "20" },
    params: { page: 1, limit: 20 },
    GetData: false,
    showWildCardFilter: false
};

const Index = props => {
    const dispatch = useDispatch();

    const { section, id } = useParams();

    const { isLoading, setIsLoading } = props;

    const [state, setState] = useState(InitialValues);

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
        const { paginationParams, params } = state;
        if (buildingData.count && params?.limit) {
            setState({
                ...state,
                paginationParams: { ...paginationParams, totalPages: Math.ceil(buildingData.count / params?.limit), totalCount: buildingData.count }
            });
        }
    }, [buildingData.count, state.params?.limit]);

    useEffect(() => {
        dispatch(getBuildingData(setIsLoading, state.params));
    }, [state.GetData]);

    const showAddForm = () => {
        history.push("/buildingDemo/add", { buildingId: id, prevPath: props.location.pathname || "/DemoBuildingAdd" });
    };

    const handlePageClick = page => {
        const { paginationParams, params, GetData } = state;
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
            paginationParams: { ...state.paginationParams, perPage: e.target.value },
            params: { ...state.params, page: 1, limit: e.target.value },
            GetData: !state.GetData
        });
    };

    const deleteItem = id => {
        dispatch(deleteBuilding(id, setIsLoading, state.params));
        history.push(`/buildingDemo`);
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

    const handleGlobalSearch = search => {
        const { params, GetData } = state;
        setState({ ...state, params: { ...params, page: 1, search, GetData: !GetData } });
    };

    const updateTableSortFilters = searchKey => {
        if (state.params.order) {
            setState({
                ...state,
                params: { ...state.params, order: { ...state.params.order, [searchKey]: state.params.order[searchKey] === "desc" ? "asc" : "desc" } },
                GetData: !state.GetData
            });
        } else {
            setState({ ...state, params: { ...state.params, order: { [searchKey]: "asc" } }, GetData: !state.GetData });
        }
    };

    const resetSort = () => {
        setState({ ...state, params: { ...state.params, order: null }, GetData: !state.GetData });
    };

    const resetAllFilters = () => {
        setState({
            ...state,
            paginationParams: { ...state.paginationParams, totalPages: 0, perPage: 40, currentPage: 0, totalCount: 0 },
            params: { ...state.params, limit: 40, page: 1, search: "", filters: null, list: null, order: null },
            tableData: { ...state.tableData, config: BuildingTableConfig.config },
            showWildCardFilter: !state.showWildCardFilter,
            GetData: !state.GetData
        });
    };

    const toggleFilter = () => {
        setState({ ...state, showWildCardFilter: !state.showWildCardFilter });
    };

    const updateWildCardFilter = newFilter => {
        setState({ ...state, params: { ...state.params, offset: 0, filters: newFilter, list: null, search: "" }, GetData: !state.GetData });
    };

    const resetWildCardFilter = () => {
        setState({
            ...state,
            params: { ...state.params, filters: null, list: null, search: "" },
            showWildCardFilter: !state.showWildCardFilter,
            GetData: !state.GetData
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
                        infoTabsData={state.infoTabsData}
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
                                    tableParams={state.params}
                                    handleGlobalSearch={handleGlobalSearch}
                                    entity={"Building-Demo"}
                                    addItem={showAddForm}
                                    resetSort={resetSort}
                                    toggleFilter={toggleFilter}
                                    showWildCardFilter={state.showWildCardFilter}
                                    resetWildCardFilter={resetWildCardFilter}
                                />
                                <div className="list-sec">
                                    <div className="table-section">
                                        <CommonTable
                                            updateWildCardFilter={updateWildCardFilter}
                                            showWildCardFilter={state.showWildCardFilter}
                                            updateTableSortFilters={updateTableSortFilters}
                                            deleteItem={deleteItem}
                                            showInfoPage={showInfoPage}
                                            tableData={BuildingTableConfig}
                                            hasSort={true}
                                            hasActionColumn={true}
                                            editItem={showEditPage}
                                            tableParams={state.params}
                                        />
                                    </div>
                                </div>
                                <Pagination
                                    paginationParams={state.paginationParams}
                                    handlePageClick={handlePageClick}
                                    handlePerPageChange={handlePerPageChange}
                                    isRecordPerPage={true}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </LoadingOverlay>
        </section>
    );
};

export default Index;
