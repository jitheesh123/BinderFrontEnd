import React, { useEffect, useState } from "react";
import history from "../../../config/history";
import CommonView from "../../common/components/CommonView";
import CommonViewTabs from "../../common/components/CommonViewTabs";
import { useParams } from "react-router-dom/cjs/react-router-dom";

const ViewBuilding = props => {
    const [state, setState] = useState({ basicDetails: {} });

    let { id, section } = useParams();

    const { keys, config, infoTabsData, deleteItem, showEditPage, getDataById, showInfoPage } = props;

    const refreshinfoDetails = async () => {
        let buildingData = await getDataById(id);
        if (buildingData && buildingData.success) setState({ ...state, basicDetails: buildingData?.building });
    };

    useEffect(() => {
        showInfoPage(id);
        refreshinfoDetails();
    }, []);

    const goBack = () => history.push("/buildingDemo");

    return (
        <div className="fst">
            <CommonViewTabs tabData={infoTabsData} goBack={goBack} item={state.basicDetails} keys={keys} config={config} currentTab={section} />
            <CommonView
                item={state.basicDetails}
                keys={keys}
                config={config}
                goBack={goBack}
                tabData={infoTabsData}
                editItem={showEditPage}
                deleteItem={deleteItem}
            />
        </div>
    );
};

export default ViewBuilding;
