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

const Index = props => {
    const dispatch = useDispatch();

    const { isLoading, setIsLoading } = props;

    const [state, setState] = useState({
        paginationParams: {},
        params: { page: 1, limit: 20 }
    });

    const { buildingData } = useSelector(state => state.buildingReducer);

    useEffect(() => {
        dispatch(getBuildingData(setIsLoading, state.params));
    }, []);

    useEffect(() => {
        const { paginationParams, params } = state;
        setState({
            paginationParams: {
                ...paginationParams
                // totalPages: Math.ceil(buildingData.count / params.limit)
            }
        });
    }, [buildingData.count]);

    useEffect(() => {
        dispatch(getBuildingData(setIsLoading, state.params));
    }, [state.params]);

    BuildingTableConfig.data = buildingData.buildings;

    console.log(state.paginationParams);

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
            paginationParams: {
                ...paginationParams,
                currentPage: page.selected
            },
            params: {
                ...params,
                page: page.selected + 1
            }
        });
        dispatch(getBuildingData(setIsLoading, state.params));
    };

    const handlePerPageChange = e => {
        setState({
            params: {
                ...state.params,
                page: 1,
                limit: e.target.value
            }
        });
    };

    return (
        <section className="cont-ara">
            <LoadingOverlay active={isLoading} spinner={<Loader />}>
                <div className="list-area">
                    <TopSlider />
                    <div className="lst-bt-nav">
                        <div className="table table-ara">
                            <TableTopheader entity={"DemoBuilding"} addItem={showAddForm} />
                            <div className="list-sec">
                                <div className="table-section">
                                    <CommonTable tableData={BuildingTableConfig} hasSort={true} hasActionColumn={false} />
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
            </LoadingOverlay>
        </section>
    );
};

export default Index;
