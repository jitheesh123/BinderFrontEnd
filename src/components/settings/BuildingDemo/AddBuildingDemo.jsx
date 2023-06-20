import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopSlider from "../../common/components/TopSlider";
import { addBuilding, editBuilding, getBuildingById, clearDropdown } from "./actions";
import commonActions from "../actions";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { Input, InputSelect } from "./CommonInput";

let InitialValues = {
    consultancy_id: "",
    client_id: "",
    sector_id: "",
    campus_id: "",

    campusErrorMsg: false,
    consultancyErrorMsg: false,
    clientErrorMsg: false,
    sectorErrorMsg: false,
    nameErrorMsg: false,

    name: "",
    display_name: "",
    zip_code: "",
    city: "",
    state: "",
    year: "",
    country: "",
    ownership: "",
    ownership_section: "",
    use: "",
    area: 0,
    number: "",
    enterprise_indexcost: 0,
    enterprise_index: "",
    manager: "",
    street: "",
    ministry: "",
    description: "",
    comments: ""
};

const AddBuildingForm = props => {
    const dispatch = useDispatch();

    const { id, section } = useParams();

    const { goBack } = useHistory();

    const { getConsultancyDropdown, getClientDropdown, getSectorDropdown, getCampusesDropdown } = commonActions;

    const { consultancyDropdownData, clientDropdownData, sectorDropdownData, campusDropdownData } = useSelector(s => s.settingsCommonReducer);

    const { CommonResposeReduer, getBuildingByIdResponse } = useSelector(s => s.BuildingDemoReducer);

    let { building } = getBuildingByIdResponse;

    const [state, setState] = useState(InitialValues);

    useEffect(() => {
        dispatch(getConsultancyDropdown());
        if (id) dispatch(getBuildingById(id));
        if (section === "add") dispatch(clearDropdown());
        if (section === "add") setState(InitialValues);
    }, []);

    useEffect(() => {
        if (section === "edit") {
            setState({
                ...building,
                consultancy_id: building?.consultancy?.id || "",
                client_id: building?.client?.id || "",
                sector_id: building?.sector?.id || "",
                campus_id: building?.campus?.id || ""
            });
            dispatch(getClientDropdown({ consultancy_id: building?.consultancy?.id }));
            dispatch(getSectorDropdown({ client_id: building?.client?.id }));
            dispatch(getCampusesDropdown({ sector_id: building?.sector?.id }));
        }
    }, [getBuildingByIdResponse]);

    const selectConsultancyId = e => {
        setState({ ...state, consultancy_id: e?.target?.value, consultancyErrorMsg: false });
        dispatch(getClientDropdown({ consultancy_id: e?.target?.value }));
    };

    const selectClientId = e => {
        setState({ ...state, client_id: e?.target?.value, clientErrorMsg: false });
        dispatch(getSectorDropdown({ client_id: e?.target?.value }));
    };

    const selectSectorId = e => {
        setState({ ...state, sector_id: e?.target?.value, sectorErrorMsg: false });
        dispatch(getCampusesDropdown({ sector_id: e?.target?.value }));
    };

    const AddBuilding = () => {
        const nameRegex = /^[A-Za-z]{3,}$/;
        if (!nameRegex.test(state.name)) setState(prevState => ({ ...prevState, nameErrorMsg: true }));
        if (state.consultancy_id === "") setState(prevState => ({ ...prevState, consultancyErrorMsg: true }));
        if (state.client_id === "") setState(prevState => ({ ...prevState, clientErrorMsg: true }));
        if (state.sector_id === "") setState(prevState => ({ ...prevState, sectorErrorMsg: true }));
        if (state.campus_id === "") setState(prevState => ({ ...prevState, campusErrorMsg: true }));
        if (state.name !== "" && state.consultancy_id !== "" && state.client_id !== "" && state.sector_id !== "" && state.campus_id !== "") {
            if (section === "add") dispatch(addBuilding(state));
            if (section === "edit") dispatch(editBuilding(state, id));
        }
    };

    if (CommonResposeReduer.success) {
        props.setState({ ...props.state, GetData: !props.state.GetData });
        goBack();
    }

    return (
        <div className="list-area ">
            <TopSlider />
            <div className="lst-bt-nav create ">
                <div className="table table-ara  p-5">
                    <div className="list-sec">
                        <div className="nav-ara ">
                            <div className="head">
                                <h4>{section === "add" ? "Add" : "Edit"} Building</h4>
                            </div>
                        </div>
                    </div>
                    <div className="frm ">
                        <Input
                            count="01"
                            label="Building Name"
                            value={state.name}
                            onChange={e => setState({ ...state, name: e?.target?.value, nameErrorMsg: false })}
                            placeHolder="Enter Building Name"
                            section="text"
                            error={state.nameErrorMsg}
                        />
                        <InputSelect
                            count="02"
                            label="Consultancy"
                            value={state.consultancy_id}
                            onChange={e => selectConsultancyId(e)}
                            error={state.consultancyErrorMsg}
                            options={consultancyDropdownData?.data}
                        />
                        <InputSelect
                            count="03"
                            label="Client"
                            value={state.client_id}
                            onChange={e => selectClientId(e)}
                            error={state.clientErrorMsg}
                            options={clientDropdownData?.data}
                        />
                        <InputSelect
                            count="04"
                            label="Sector"
                            value={state.sector_id}
                            onChange={e => selectSectorId(e)}
                            error={state.sectorErrorMsg}
                            options={sectorDropdownData?.data}
                        />
                        <InputSelect
                            count="05"
                            label="Campus"
                            value={state.campus_id}
                            onChange={e => setState({ ...state, campus_id: e?.target?.value, campusErrorMsg: false })}
                            error={state.campusErrorMsg}
                            options={campusDropdownData?.data}
                        />
                        <Input
                            count="06"
                            label="Display Name"
                            value={state.display_name}
                            onChange={e => setState({ ...state, display_name: e?.target?.value })}
                            placeHolder="Enter Display Name"
                            section="text"
                        />
                        <Input
                            count="07"
                            label="Description"
                            value={state.description}
                            onChange={e => setState({ ...state, description: e?.target?.value })}
                            placeHolder="Enter description"
                            section="text"
                        />
                        <Input
                            count="08"
                            label="Building Number"
                            value={state.number}
                            onChange={e => setState({ ...state, number: e?.target?.value })}
                            placeHolder="Enter Building Number"
                            section="text"
                            list="buildigNumber"
                            name="buildigNumber"
                            option={["Buildig Number", "Buildig Number"]}
                        />
                        <Input
                            label="Consultancy Users"
                            placeHolder="Enter Consultancy Users "
                            section="text"
                            list="cosultancy"
                            name="cosultancy"
                            option={["Buildig Number", "Buildig Number"]}
                        />
                        <Input
                            count="10"
                            label=" Client Users"
                            placeHolder="Enter Client Users"
                            section="text"
                            list="client-u"
                            name="client-u"
                            option={["Buildig Number", "Buildig Number"]}
                        />
                    </div>
                    <div className="head mt-4">
                        <h3>More Info</h3>
                    </div>
                    <div className="frm">
                        <Input
                            label="Area (Sq)"
                            placeHolder="Enter Area (Sq) "
                            value={state.area}
                            onChange={e => setState({ ...state, area: e?.target?.value })}
                            section="text"
                        />
                        <Input
                            label="Cost"
                            placeHolder="Enter Cost"
                            value={state.cost}
                            onChange={e => setState({ ...state, cost: e?.target?.value })}
                            section="text"
                        />
                        <Input
                            label="Enterprise Index"
                            placeHolder="Enter Enterprise Index"
                            value={state.enterprise_index}
                            onChange={e => setState({ ...state, enterprise_index: e?.target?.value })}
                            section="text"
                        />
                        <Input
                            label="Ownership"
                            placeHolder="Enter Ownership"
                            value={state.ownership}
                            onChange={e => setState({ ...state, ownership: e?.target?.value })}
                            section="text"
                        />
                        <Input
                            label=" Ownership Type"
                            placeHolder="Enter  Ownership Type"
                            value={state.ownership_section}
                            onChange={e => setState({ ...state, ownership_section: e?.target?.value })}
                            section="text"
                        />
                        <Input
                            label="Use"
                            placeHolder="Enter Use"
                            value={state.use}
                            onChange={e => setState({ ...state, use: e?.target?.value })}
                            section="text"
                        />
                        <Input
                            label="Manager"
                            placeHolder="Enter Manager"
                            value={state.manager}
                            onChange={e => setState({ ...state, manager: e?.target?.value })}
                            section="text"
                        />
                        <Input
                            label="Year Built"
                            placeHolder="Enter Year"
                            value={state.year}
                            onChange={e => setState({ ...state, year: e?.target?.value })}
                            section="text"
                        />
                        <Input
                            label="Ministry"
                            placeHolder="Enter Ministry"
                            value={state.ministry}
                            onChange={e => setState({ ...state, ministry: e?.target?.value })}
                            section="text"
                        />
                    </div>
                    <div className="head mt-4">
                        <h3>Address</h3>
                    </div>
                    <div className="frm">
                        <Input
                            label="Street"
                            placeHolder="Enter Street"
                            value={state.street}
                            onChange={e => setState({ ...state, street: e?.target?.value })}
                            section="text"
                        />
                        <Input
                            label="City"
                            placeHolder="Enter City"
                            value={state.city}
                            onChange={e => setState({ ...state, city: e?.target?.value })}
                            section="text"
                        />
                        <Input
                            label="State"
                            placeHolder="Enter State"
                            value={state.state}
                            onChange={e => setState({ ...state, state: e?.target?.value })}
                            section="text"
                        />
                        <Input
                            label="Country"
                            placeHolder="Enter Country"
                            value={state.country}
                            onChange={e => setState({ ...state, country: e?.target?.value })}
                            section="text"
                        />
                        <Input
                            label="Zip Code"
                            placeHolder="Enter Zip Code"
                            value={state.zip_code}
                            onChange={e => setState({ ...state, zip_code: e?.target?.value })}
                            section="text"
                        />
                        <Input
                            label="Comments"
                            placeHolder="Enter Comments"
                            value={state.comments}
                            onChange={e => setState({ ...state, comments: e?.target?.value })}
                            section="text"
                        />
                    </div>
                    <div className="btn-sec">
                        <button className="btn btn-cncl-back mr-2" onClick={goBack}>
                            <i className="material-icons tic"> close</i>Cancel
                        </button>
                        <button className="btn btn-create" onClick={() => AddBuilding()}>
                            <i className="material-icons tic"> check</i>Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddBuildingForm;
