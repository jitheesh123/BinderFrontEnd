import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonTable from "../../common/components/CommonTable";
import { getBuildingData } from "./actions";
import { BuildingTableConfig } from "../../../config/tableConfig";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../../common/components/Loader";
import TableTopheader from "../../common/components/TableTopHeader";
import TopSlider from "../../common/components/TopSlider";
import Pagination from "../../common/components/Pagination";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import history from "../../../config/history";
import ViewBuilding from "./ViewBuildingDemo";
import actions from "./actions";
const Index = props => {
    const dispatch = useDispatch();

    const { section } = useParams();
    const { isLoading, setIsLoading } = props;

    const [state, setState] = useState({
        paginationParams: { perPage: 20 },
        params: { page: 1, limit: 20 }
    });

    const { buildingData } = useSelector(state => state.buildingReducer);

    BuildingTableConfig.data = buildingData.buildings;

    useEffect(() => {
        dispatch(getBuildingData(setIsLoading, state.params));
    }, []);

    useEffect(() => {
        const { paginationParams, params } = state;
        if (buildingData.count && params?.limit) {
            setState({
                ...state,
                paginationParams: {
                    ...paginationParams,
                    totalPages: Math.ceil(buildingData.count / params?.limit)
                }
            });
        }
    }, [buildingData.count, state.params?.limit]);

    useEffect(() => {
        dispatch(getBuildingData(setIsLoading, state.params));
    }, [state.params, state.paginationParams]);

    const showAddForm = () => {
        const {
            match: {
                params: { id }
            },
            history
        } = props;
        history.push("/DemoBuildingAdd/add", { buildingId: id, prevPath: props.location.pathname || "/DemoBuildingAdd" });
    };

    const handlePageClick = page => {
        const { paginationParams, params } = state;
        setState({
            ...state,
            paginationParams: {
                ...paginationParams,
                currentPage: page.selected
            },
            params: {
                ...params,
                page: page.selected + 1
            }
        });
    };

    const handlePerPageChange = e => {
        setState({
            ...state,
            params: {
                ...state.params,
                page: 1,
                limit: e.target.value
            }
        });
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
        const { building } = await dispatch(actions.getBuildingById(id));
        return { success: true, building };
    };

    return (
        <section className="cont-ara">
            <LoadingOverlay active={isLoading} spinner={<Loader />}>
                {section === "ViewDetails" ? (
                    <ViewBuilding
                        keys={BuildingTableConfig.keys}
                        config={BuildingTableConfig.config}
                        infoTabsData={state.infoTabsData}
                        showInfoPage={showInfoPage}
                        getDataById={getDataById}
                        // deleteItem={deleteItemConfirm}
                        // showEditPage={this.showEditPage}
                    />
                ) : (
                    <div className="list-area">
                        <TopSlider />
                        <div className="lst-bt-nav">
                            <div className="table table-ara">
                                <TableTopheader entity={"DemoBuilding"} addItem={showAddForm} />
                                <div className="list-sec">
                                    <div className="table-section">
                                        <CommonTable
                                            showInfoPage={showInfoPage}
                                            tableData={BuildingTableConfig}
                                            hasSort={true}
                                            hasActionColumn={true}
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
