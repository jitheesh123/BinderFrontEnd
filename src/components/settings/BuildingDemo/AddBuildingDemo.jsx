import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopSlider from "../../common/components/TopSlider";
import actions from "./actions";
import commonActions from "../actions";
import ToastMsg from "../../common/ToastMessage";
import history from "../../../config/history";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

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
    ownership_type: "",
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

const AddBuildingForm = () => {
    const dispatch = useDispatch();

    const { id, type } = useParams();

    const { getConsultancyDropdown, getClientDropdown, getSectorDropdown, getCampusesDropdown } = commonActions;

    const { consultancyDropdownData, clientDropdownData, sectorDropdownData, campusDropdownData } = useSelector(s => s.settingsCommonReducer);

    const { addBuildingData, getBuildingByIdResponse } = useSelector(s => s.buildingReducer);

    let { building } = getBuildingByIdResponse;

    const [state, setState] = useState(InitialValues);

    useEffect(() => {
        dispatch(getConsultancyDropdown());
        if (id) dispatch(actions.getBuildingById(id));
        if (type === "add") setState(InitialValues);
    }, []);

    useEffect(() => {
        if (type === "edit") {
            if (state.consultancy_id) dispatch(getClientDropdown({ consultancy_id: building?.consultancy?.id }));
            if (state.client_id) dispatch(getSectorDropdown({ client_id: building?.client?.id }));
            if (state.campus_id) dispatch(getCampusesDropdown({ sector_id: building?.sector?.id }));
        }
    }, [state.client_id, state.sector_id, state.consultancy_id]);

    useEffect(() => {
        if (id !== undefined) {
            setState({
                consultancy_id: building?.consultancy?.id || "",
                client_id: building?.client?.id || "",
                sector_id: building?.sector?.id || "",
                campus_id: building?.campus?.id || "",
                name: building?.name || "",
                display_name: building?.display_name || "",
                zip_code: building?.zip_code || "",
                city: building?.city || "",
                state: building?.state || "",
                year: building?.year || "",
                country: building?.country || "",
                ownership: building?.ownership || "",
                ownership_type: building?.ownership_type || "",
                use: building?.use || "",
                area: building?.area || "",
                number: building?.number || "",
                cost: building?.cost || "",
                enterprise_index: building?.enterprise_index || "",
                manager: building?.manager || "",
                street: building?.street || "",
                ministry: building?.ministry || "",
                description: building?.description || "",
                comments: building?.comments || ""
            });
        }
    }, [getBuildingByIdResponse]);

    const selectConsultancyId = e => {
        setState({ ...state, consultancy_id: e?.target?.value, consultancyErrorMsg: false });
        dispatch(getClientDropdown({ consultancy_id: e?.target?.value }));
    };

    const selectClientId = e => {
        setState(prevState => ({ ...prevState, client_id: e?.target?.value, clientErrorMsg: false }));
        dispatch(getSectorDropdown({ client_id: e?.target?.value }));
    };

    const selectSectorId = e => {
        setState(prevState => ({ ...prevState, sector_id: e?.target?.value, sectorErrorMsg: false }));
        dispatch(getCampusesDropdown({ sector_id: e?.target?.value }));
    };

    const addBuilding = () => {
        if (state.name === "") setState(prevState => ({ ...prevState, nameErrorMsg: true }));
        if (state.consultancy_id === "") setState(prevState => ({ ...prevState, consultancyErrorMsg: true }));
        if (state.client_id === "") setState(prevState => ({ ...prevState, clientErrorMsg: true }));
        if (state.sector_id === "") setState(prevState => ({ ...prevState, sectorErrorMsg: true }));
        if (state.campus_id === "") setState(prevState => ({ ...prevState, campusErrorMsg: true }));
        if (state.name !== "" && state.consultancy_id !== "" && state.client_id !== "" && state.sector_id !== "" && state.campus_id !== "") {
            if (type === "add") dispatch(actions.addBuilding(state));
            if (type === "edit") dispatch(actions.editBuilding(state, id));
        }
    };

    if (addBuildingData.success) {
        ToastMsg(addBuildingData.message, "info");
        history.push("/buildingDemo");
    }

    return (
        <section className="cont-ara">
            <div className="fst">
                <TopSlider />
                <div className="dash-cont">
                    <div className="pub-ara six">
                        <div className="frm-ara">
                            <div className="top-ara">
                                <h4>{type === "add" ? "Add" : "Edit"} Building</h4>
                            </div>
                            <div className="head">
                                <h3>Basic Info</h3>
                            </div>
                            <div className="frm">
                                <div className="itm">
                                    <div className="cunt">
                                        <div className="numb">01</div>
                                    </div>
                                    <div className="itm-cnt">
                                        <div className="form-group">
                                            <label
                                                className="form-control-placeholder"
                                                style={{ color: state.nameErrorMsg ? "red" : null }}
                                                for="f-name"
                                            >
                                                Building Name
                                            </label>
                                            <input
                                                type="text"
                                                id="text"
                                                value={state.name}
                                                onChange={e => {
                                                    setState({
                                                        ...state,
                                                        name: e?.target?.value,
                                                        nameErrorMsg: false
                                                    });
                                                }}
                                                className="form-control"
                                                placeholder="Enter Building Name "
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="cunt">
                                        <div className="numb">02</div>
                                    </div>
                                    <div className="itm-cnt">
                                        <div className="form-group select-group">
                                            <label
                                                className="form-control-placeholder"
                                                style={{ color: state.consultancyErrorMsg && "red" }}
                                                for="f-name"
                                            >
                                                Consultancy *
                                            </label>
                                            <select
                                                className="form-control select"
                                                value={state.consultancy_id}
                                                onChange={e => {
                                                    selectConsultancyId(e);
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {consultancyDropdownData?.data?.length &&
                                                    consultancyDropdownData.data.map((item, idex) => {
                                                        return (
                                                            <option key={idex} value={item.id}>
                                                                {item.name}
                                                            </option>
                                                        );
                                                    })}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="cunt">
                                        <div className="numb">03</div>
                                    </div>
                                    <div className="itm-cnt">
                                        <div className="form-group select-group">
                                            <label className="form-control-placeholder" style={{ color: state.clientErrorMsg && "red" }} for="f-name">
                                                Client *
                                            </label>
                                            <select
                                                className="form-control select"
                                                value={state.client_id}
                                                onChange={e => {
                                                    selectClientId(e);
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {clientDropdownData?.data &&
                                                    clientDropdownData?.data?.map((item, idex) => {
                                                        return <option value={item.id}> {item.name} </option>;
                                                    })}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="itm">
                                    <div className="cunt">
                                        <div className="numb">04</div>
                                    </div>
                                    <div className="itm-cnt">
                                        <div className="form-group select-group">
                                            <label className="form-control-placeholder" style={{ color: state.sectorErrorMsg && "red" }} for="f-name">
                                                Sector *
                                            </label>
                                            <select
                                                className="form-control select"
                                                value={state.sector_id}
                                                onChange={e => {
                                                    selectSectorId(e);
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {sectorDropdownData?.data?.length &&
                                                    sectorDropdownData?.data?.map((item, idex) => {
                                                        return <option value={item.id}> {item.name} </option>;
                                                    })}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="itm">
                                    <div className="cunt">
                                        <div className="numb">05</div>
                                    </div>
                                    <div className="itm-cnt">
                                        <div className="form-group select-group">
                                            <label className="form-control-placeholder" style={{ color: state.campusErrorMsg && "red" }} for="f-name">
                                                Campus *
                                            </label>
                                            <select
                                                className="form-control select"
                                                value={state.campus_id}
                                                onChange={e => {
                                                    setState(prevState => ({ ...prevState, campus_id: e?.target?.value, campusErrorMsg: false }));
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {campusDropdownData?.data?.length &&
                                                    campusDropdownData?.data?.map((item, idex) => {
                                                        return <option value={item.id}> {item.name} </option>;
                                                    })}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="itm">
                                    <div className="cunt">
                                        <div className="numb">06</div>
                                    </div>
                                    <div className="itm-cnt">
                                        <div className="form-group">
                                            <label className="form-control-placeholder" for="f-name">
                                                Display Name
                                            </label>
                                            <input
                                                value={state.display_name}
                                                type="text"
                                                id="text"
                                                onChange={e => {
                                                    setState({ display_name: e.target.value });
                                                }}
                                                className="form-control"
                                                placeholder="Enter Display Name "
                                                list="builiding"
                                                name="builiding"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="itm">
                                    <div className="cunt">
                                        <div className="numb">07</div>
                                    </div>
                                    <div className="itm-cnt">
                                        <div className="form-group">
                                            <label className="form-control-placeholder" for="f-name">
                                                Description
                                            </label>
                                            <input
                                                type="text"
                                                value={state.description}
                                                id="text"
                                                onChange={e => {
                                                    setState({ description: e.target.value });
                                                }}
                                                className="form-control"
                                                placeholder="Enter Description "
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="cunt">
                                        <div className="numb">08</div>
                                    </div>
                                    <div className="itm-cnt">
                                        <div className="form-group">
                                            <label className="form-control-placeholder" for="f-name">
                                                Building Number
                                            </label>
                                            <input
                                                type="number"
                                                value={state.number}
                                                id="text"
                                                onChange={e => {
                                                    setState({ number: e.target.value });
                                                }}
                                                className="form-control"
                                                placeholder="Enter Building Number"
                                                list="buildigNumber"
                                                name="buildigNumber"
                                            />
                                            <datalist id="buildigNumber">
                                                <option value="Buildig Number" />
                                            </datalist>
                                        </div>
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="cunt">
                                        <div className="numb">09</div>
                                    </div>
                                    <div className="itm-cnt">
                                        <div className="form-group">
                                            <label className="form-control-placeholder" for="f-name">
                                                Consultancy Users
                                            </label>
                                            <input
                                                type="text"
                                                id="text"
                                                className="form-control"
                                                placeholder="Enter Consultancy Users "
                                                list="cosultancy"
                                                name="cosultancy"
                                            />
                                            <span className="material-icons">keyboard_arrow_down </span>
                                            <datalist id="cosultancy">
                                                <option value="Buildig Number" />
                                            </datalist>
                                        </div>
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="cunt">
                                        <div className="numb">10</div>
                                    </div>
                                    <div className="itm-cnt">
                                        <div className="form-group">
                                            <label className="form-control-placeholder" for="f-name">
                                                Client Users
                                            </label>
                                            <input
                                                type="text"
                                                id="text"
                                                className="form-control"
                                                placeholder="Enter Client Users "
                                                list="client-u"
                                                name="client-u"
                                            />
                                            <span className="material-icons">keyboard_arrow_down </span>
                                            <datalist id="client-u">
                                                <option value="Buildig Number" />
                                            </datalist>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="head mt-4">
                                <h3>More Info</h3>
                            </div>
                            <div className="frm">
                                <div className="itm">
                                    <div className="cunt">
                                        <div className="numb">01</div>
                                    </div>
                                    <div className="itm-cnt">
                                        <div className="form-group">
                                            <label className="form-control-placeholder" for="f-name">
                                                Area (Sq)
                                            </label>
                                            <input
                                                type="number"
                                                value={state.area}
                                                id="text"
                                                onChange={e => {
                                                    setState({ area: e.target.value });
                                                }}
                                                className="form-control"
                                                placeholder="Enter Area (Sq) "
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="cunt">
                                        <div className="numb">02</div>
                                    </div>
                                    <div className="itm-cnt">
                                        <div className="form-group">
                                            <label className="form-control-placeholder" for="f-name">
                                                Cost
                                            </label>
                                            <input
                                                type="number"
                                                id="text"
                                                value={state.cost}
                                                onChange={e => {
                                                    setState({ cost: e.target.value });
                                                }}
                                                className="form-control"
                                                placeholder="Enter Cost "
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="cunt">
                                        <div className="numb">03</div>
                                    </div>
                                    <div className="itm-cnt">
                                        <div className="form-group">
                                            <label className="form-control-placeholder" for="f-name">
                                                Enterprise Index
                                            </label>
                                            <input
                                                type="text"
                                                id="text"
                                                value={state.enterprise_index}
                                                onChange={e => {
                                                    setState({ enterprise_index: e.target.value });
                                                }}
                                                className="form-control"
                                                placeholder="Enter Enterprise Index "
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="itm">
                                    <div className="cunt">
                                        <div className="numb">04</div>
                                    </div>
                                    <div className="itm-cnt">
                                        <div className="form-group">
                                            <label className="form-control-placeholder" for="f-name">
                                                Ownership
                                            </label>
                                            <input
                                                type="text"
                                                value={state.ownership}
                                                id="text"
                                                onChange={e => {
                                                    setState({ ownership: e.target.value });
                                                }}
                                                className="form-control"
                                                placeholder="Enter Ownership "
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="itm">
                                    <div className="cunt">
                                        <div className="numb">05</div>
                                    </div>
                                    <div className="itm-cnt">
                                        <div className="form-group">
                                            <label className="form-control-placeholder" for="f-name">
                                                Ownership Type
                                            </label>
                                            <input
                                                type="text"
                                                value={state.ownership_type}
                                                id="text"
                                                onChange={e => {
                                                    setState({ ownership_type: e.target.value });
                                                }}
                                                className="form-control"
                                                placeholder="Enter Ownership Type"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="itm">
                                    <div className="cunt">
                                        <div className="numb">06</div>
                                    </div>
                                    <div className="itm-cnt">
                                        <div className="form-group">
                                            <label className="form-control-placeholder" for="f-name">
                                                Use
                                            </label>
                                            <input
                                                type="text"
                                                id="text"
                                                value={state.use}
                                                onChange={e => {
                                                    setState({ use: e.target.value });
                                                }}
                                                className="form-control"
                                                placeholder="Enter Use "
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="cunt">
                                        <div className="numb">07</div>
                                    </div>
                                    <div className="itm-cnt">
                                        <div className="form-group">
                                            <label className="form-control-placeholder" for="f-name">
                                                Manager
                                            </label>
                                            <input
                                                type="text"
                                                id="text"
                                                value={state.manager}
                                                onChange={e => {
                                                    setState({ manager: e.target.value });
                                                }}
                                                className="form-control"
                                                placeholder="Enter Manager "
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="cunt">
                                        <div className="numb">08</div>
                                    </div>
                                    <div className="itm-cnt">
                                        <div className="form-group">
                                            <label className="form-control-placeholder" for="f-name">
                                                Year Built
                                            </label>
                                            <input
                                                type="number"
                                                id="text"
                                                value={state.year}
                                                onChange={e => {
                                                    setState({ year: e.target.value });
                                                }}
                                                className="form-control"
                                                placeholder="Enter Year Built "
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="cunt">
                                        <div className="numb">09</div>
                                    </div>
                                    <div className="itm-cnt">
                                        <div className="form-group">
                                            <label className="form-control-placeholder" for="f-name">
                                                Ministry
                                            </label>
                                            <input
                                                type="text"
                                                id="text"
                                                value={state.ministry}
                                                onChange={e => {
                                                    setState({ ministry: e.target.value });
                                                }}
                                                className="form-control"
                                                placeholder="Enter Ministry "
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="head mt-4">
                                <h3>Address</h3>
                            </div>
                            <div className="frm">
                                <div className="itm">
                                    <div className="cunt">
                                        <div className="numb">01</div>
                                    </div>
                                    <div className="itm-cnt">
                                        <div className="form-group">
                                            <label className="form-control-placeholder" for="f-name">
                                                Street
                                            </label>
                                            <input
                                                type="text"
                                                id="text"
                                                value={state.street}
                                                onChange={e => {
                                                    setState({ street: e.target.value });
                                                }}
                                                className="form-control"
                                                placeholder="Enter Street "
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="cunt">
                                        <div className="numb">02</div>
                                    </div>
                                    <div className="itm-cnt">
                                        <div className="form-group">
                                            <label className="form-control-placeholder" for="f-name">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                id="text"
                                                value={state.city}
                                                onChange={e => {
                                                    setState({ city: e.target.value });
                                                }}
                                                className="form-control"
                                                placeholder="Enter City "
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="cunt">
                                        <div className="numb">03</div>
                                    </div>
                                    <div className="itm-cnt">
                                        <div className="form-group">
                                            <label className="form-control-placeholder" for="f-name">
                                                State
                                            </label>
                                            <input
                                                type="text"
                                                id="text"
                                                value={state.state}
                                                onChange={e => {
                                                    setState({ state: e.target.value });
                                                }}
                                                className="form-control"
                                                placeholder="Enter State "
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="itm">
                                    <div className="cunt">
                                        <div className="numb">04</div>
                                    </div>
                                    <div className="itm-cnt">
                                        <div className="form-group">
                                            <label className="form-control-placeholder" for="f-name">
                                                Country
                                            </label>
                                            <input
                                                type="text"
                                                id="text"
                                                value={state.country}
                                                onChange={e => {
                                                    setState({ country: e.target.value });
                                                }}
                                                className="form-control"
                                                placeholder="Enter Country"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="itm">
                                    <div className="cunt">
                                        <div className="numb">05</div>
                                    </div>
                                    <div className="itm-cnt">
                                        <div className="form-group">
                                            <label className="form-control-placeholder" for="f-name">
                                                Zip Code
                                            </label>
                                            <input
                                                type="number"
                                                id="text"
                                                value={state.zip_code}
                                                onChange={e => {
                                                    setState({ zip_code: e.target.value });
                                                }}
                                                className="form-control"
                                                placeholder="Enter Zip Code "
                                                list="zip"
                                                name="zip"
                                            />
                                            <datalist id="zip">
                                                <option value="686541" />
                                            </datalist>
                                        </div>
                                    </div>
                                </div>

                                <div className="itm">
                                    <div className="cunt">
                                        <div className="numb">06</div>
                                    </div>
                                    <div className="itm-cnt">
                                        <div className="form-group">
                                            <label className="form-control-placeholder" for="f-name">
                                                Comments
                                            </label>
                                            <input
                                                type="text"
                                                id="text"
                                                value={state.comments}
                                                onChange={e => {
                                                    setState({ comments: e.target.value });
                                                }}
                                                className="form-control"
                                                placeholder="Enter Comments "
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-row align-items-center">
                                <div className="btn-sec">
                                    <button className="btn btn-cncl-back mr-2" onClick={() => history.push("/buildingDemo")}>
                                        <i className="material-icons tic"> close</i>Cancel
                                    </button>
                                </div>
                                <div className="frm btn-sec">
                                    <button
                                        className="btn btn-submit"
                                        onClick={() => {
                                            addBuilding();
                                        }}
                                    >
                                        {" "}
                                        <i className="material-icons tic"> check</i>Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AddBuildingForm;
