import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopSlider from "../../common/components/TopSlider";
import { addBuilding, editBuilding, getBuildingById } from "./actions";
import commonActions from "../actions";
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

    const { getConsultancyDropdown, getClientDropdown, getSectorDropdown, getCampusesDropdown } = commonActions;

    const { consultancyDropdownData, clientDropdownData, sectorDropdownData, campusDropdownData } = useSelector(s => s.settingsCommonReducer);

    const { CommonResposeReduer, getBuildingByIdResponse } = useSelector(s => s.BuildingDemoReducer);

    let { building } = getBuildingByIdResponse;

    const [state, setState] = useState(InitialValues);

    useEffect(() => {
        if (id !== undefined) {
            setState({
                ...building,
                consultancy_id: building?.consultancy?.id || "",
                client_id: building?.client?.id || "",
                sector_id: building?.sector?.id || "",
                campus_id: building?.campus?.id || ""
            });
        }
        if (section === "edit") {
            dispatch(getClientDropdown({ consultancy_id: building?.consultancy?.id }));
            dispatch(getSectorDropdown({ client_id: building?.client?.id }));
            dispatch(getCampusesDropdown({ sector_id: building?.sector?.id }));
        }
    }, [getBuildingByIdResponse]);

    useEffect(() => {
        dispatch(getConsultancyDropdown());
        if (id) dispatch(getBuildingById(id));
        if (section === "add") setState(InitialValues);
    }, []);

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
        history.push("/buildingDemo");
        props.setState({ ...props.state, GetData: !props.state.GetData });
    }

    return (
        <div className="list-area">
            <TopSlider />
            <div className="lst-bt-nav create">
                <div className="table table-ara">
                    <div className="list-sec">
                        <div className="nav-ara">
                            <div className="head">
                                <h4>{section === "add" ? "Add" : "Edit"} Building</h4>
                            </div>
                        </div>
                    </div>
                    <div className="frm">
                        <div className="itm">
                            <div className="cunt">
                                <div className="numb">01</div>
                            </div>
                            <div className="itm-cnt">
                                <div className="form-group">
                                    <label className="form-control-placeholder" style={{ color: state.nameErrorMsg ? "red" : null }} for="f-name">
                                        Building Name
                                    </label>
                                    <input
                                        section="text"
                                        id="text"
                                        value={state.name}
                                        onChange={e => setState({ ...state, name: e?.target?.value, nameErrorMsg: false })}
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
                                    <label className="form-control-placeholder" style={{ color: state.consultancyErrorMsg && "red" }} for="f-name">
                                        Consultancy *
                                    </label>
                                    <select className="form-control select" value={state.consultancy_id} onChange={e => selectConsultancyId(e)}>
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
                                    <select className="form-control select" value={state.client_id} onChange={e => selectClientId(e)}>
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
                                    <select className="form-control select" value={state.sector_id} onChange={e => selectSectorId(e)}>
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
                                        onChange={e => setState({ ...state, campus_id: e?.target?.value, campusErrorMsg: false })}
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
                                        section="text"
                                        id="text"
                                        onChange={e => setState({ ...state, display_name: e?.target?.value })}
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
                                        section="text"
                                        value={state.description}
                                        id="text"
                                        onChange={e => setState({ ...state, description: e?.target?.value })}
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
                                        section="number"
                                        value={state.number}
                                        id="text"
                                        onChange={e => setState({ ...state, number: e?.target?.value })}
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
                                        section="text"
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
                                        section="text"
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
                                        section="number"
                                        value={state.area}
                                        id="text"
                                        onChange={e => setState({ ...state, area: e?.target?.value })}
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
                                        section="number"
                                        id="text"
                                        value={state.cost}
                                        onChange={e => setState({ ...state, cost: e?.target?.value })}
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
                                        section="text"
                                        id="text"
                                        value={state.enterprise_index}
                                        onChange={e => setState({ ...state, enterprise_index: e?.target?.value })}
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
                                        section="text"
                                        value={state.ownership}
                                        id="text"
                                        onChange={e => setState({ ...state, ownership: e?.target?.value })}
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
                                        section="text"
                                        value={state.ownership_section}
                                        id="text"
                                        onChange={e => setState({ ...state, ownership_section: e?.target?.value })}
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
                                        section="text"
                                        id="text"
                                        value={state.use}
                                        onChange={e => setState({ ...state, use: e?.target?.value })}
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
                                        section="text"
                                        id="text"
                                        value={state.manager}
                                        onChange={e => setState({ ...state, manager: e?.target?.value })}
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
                                        section="number"
                                        id="text"
                                        value={state.year}
                                        onChange={e => setState({ ...state, year: e?.target?.value })}
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
                                        section="text"
                                        id="text"
                                        value={state.ministry}
                                        onChange={e => setState({ ...state, ministry: e?.target?.value })}
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
                                        section="text"
                                        id="text"
                                        value={state.street}
                                        onChange={e => setState({ ...state, street: e?.target?.value })}
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
                                        section="text"
                                        id="text"
                                        value={state.city}
                                        onChange={e => setState({ ...state, city: e?.target?.value })}
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
                                        section="text"
                                        id="text"
                                        value={state.state}
                                        onChange={e => setState({ ...state, state: e?.target?.value })}
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
                                        section="text"
                                        id="text"
                                        value={state.country}
                                        onChange={e => setState({ ...state, country: e?.target?.value })}
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
                                        section="number"
                                        id="text"
                                        value={state.zip_code}
                                        onChange={e => setState({ ...state, zip_code: e?.target?.value })}
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
                                        section="text"
                                        id="text"
                                        value={state.comments}
                                        onChange={e => setState({ ...state, comments: e?.target?.value })}
                                        className="form-control"
                                        placeholder="Enter Comments "
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="btn-sec">
                        <button className="btn btn-cncl-back mr-2" onClick={() => history.push("/buildingDemo")}>
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
