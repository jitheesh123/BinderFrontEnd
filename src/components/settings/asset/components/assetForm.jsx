import React, { Component } from "react";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import NumberFormat from "react-number-format";

import history from "../../../../config/history";
import TopSlider from "../../../common/components/TopSlider";
import ToastMsg from "../../../common/ToastMessage";
import actions from "../actions";
import commonActions from "../../actions";
import ConfirmationModal from "../../../common/components/ConfirmationModal";
import Portal from "../../../common/components/Portal";

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consultancyIdList: [],
            clientIdList: [],
            sectorIdList: [],
            campusIdList: [],
            buildingIdList: [],
            assetConditionIdList: [],
            floorIdList: [],
            formParams: {
                asset_id: "",
                name: "",
                asset_type: "Generator",
                consultancy_id: "",
                client_id: "",
                sector_id: "",
                campus_id: "",
                building_id: "",
                floor_id: "",
                room: "",
                area_served: "",
                make: "",
                model_number: "",
                serial_number: "",
                size: "",
                volts: "",
                amps: "",
                year_of_unit: "",
                installed_year: "",
                service_life: "",
                // useful_life_remaining: "",
                crv: "",
                asset_condition_id: "",
                notes: "",
                device_count: 1,
                is_active: "yes"
            },
            errorParams: {
                name: false,
                consultancy_id: false,
                client_id: false,
                sector_id: false,
                campus_id: false,
                asset_condition_id: false,
                building_id: false
            },
            isEdit: false,
            showErrorBorder: false,
            selectedAsset: props.match.params.id,
            initialData: {
                asset_id: "",
                name: "",
                asset_type: "Generator",
                consultancy_id: "",
                client_id: "",
                sector_id: "",
                campus_id: "",
                building_id: "",
                floor_id: "",
                room: "",
                area_served: "",
                make: "",
                model_number: "",
                serial_number: "",
                size: "",
                volts: "",
                amps: "",
                year_of_unit: "",
                installed_year: "",
                service_life: "",
                // useful_life_remaining: "",
                crv: "",
                asset_condition_id: "",
                notes: "",
                device_count: 1,
                is_active: "yes"
            },
            showConfirmModal: false
        };
    }

    componentDidMount = async () => {
        const { selectedAsset } = this.state;
        await this.props.getConsultancyDropdown();
        await this.props.getAssetConditionsDropdown();
        await this.setState({
            consultancyIdList: this.props.settingsCommonReducer.consultancyDropdownData.data,
            assetConditionIdList: this.props.settingsCommonReducer.assetConditionDropdownData.data
        });
        if (selectedAsset) {
            await this.props.getAssetById(selectedAsset);
            const {
                assetReducer: {
                    getAssetByIdResponse: {
                        asset: {
                            asset_id,
                            name,
                            asset_type,
                            consultancy,
                            client,
                            sector,
                            campus,
                            building,
                            floor,
                            area_served,
                            make,
                            model_number,
                            serial_number,
                            size,
                            volts,
                            amps,
                            year_of_unit,
                            installed_year,
                            service_life,
                            // useful_life_remaining,
                            crv,
                            asset_condition,
                            notes,
                            device_count,
                            is_active,
                            room
                        },
                        success
                    }
                }
            } = this.props;
            if (success) {
                this.getClientDropdown(consultancy.id);
                this.getSectorsDropdown(client.id);
                this.getCampusDropdown(sector.id);
                this.getBuildingsDropdown(campus.id);
                this.getFloorsDropdown(building.id);
                await this.setState({
                    formParams: {
                        asset_id,
                        name,
                        asset_type,
                        consultancy_id: consultancy.id || "",
                        client_id: client.id || "",
                        sector_id: sector.id || "",
                        campus_id: campus.id || "",
                        building_id: building.id || "",
                        floor_id: floor.id || "",
                        area_served,
                        make,
                        model_number,
                        serial_number,
                        size,
                        volts,
                        amps,
                        year_of_unit,
                        installed_year,
                        service_life,
                        // useful_life_remaining,
                        crv,
                        asset_condition_id: asset_condition.id || "",
                        notes,
                        device_count,
                        is_active,
                        room
                    },
                    initialData: {
                        asset_id,
                        name,
                        asset_type,
                        consultancy_id: consultancy.id || "",
                        client_id: client.id || "",
                        sector_id: sector.id || "",
                        campus_id: campus.id || "",
                        building_id: building.id || "",
                        floor_id: floor.id || "",
                        area_served,
                        make,
                        model_number,
                        serial_number,
                        size,
                        volts,
                        amps,
                        year_of_unit,
                        installed_year,
                        service_life,
                        // useful_life_remaining,
                        crv,
                        asset_condition_id: asset_condition.id || "",
                        notes,
                        device_count,
                        is_active,
                        room
                    },
                    isEdit: true
                });
            }
        }
    };

    validate = () => {
        const { formParams } = this.state;
        let errorParams = {
            name: false,
            consultancy_id: false,
            client_id: false,
            sector_id: false,
            campus_id: false,
            asset_condition_id: false,
            building_id: false
        };
        let showErrorBorder = false;
        if (!formParams.name || !formParams.name.trim().length) {
            errorParams.name = true;
            showErrorBorder = true;
        }
        if (!formParams.consultancy_id || !formParams.consultancy_id.trim().length) {
            errorParams.consultancy_id = true;
            showErrorBorder = true;
        }
        if (!formParams.client_id || !formParams.client_id.trim().length) {
            errorParams.client_id = true;
            showErrorBorder = true;
        }
        if (!formParams.sector_id || !formParams.sector_id.trim().length) {
            errorParams.sector_id = true;
            showErrorBorder = true;
        }
        if (!formParams.campus_id || !formParams.campus_id.trim().length) {
            errorParams.campus_id = true;
            showErrorBorder = true;
        }
        if (!formParams.building_id || !formParams.building_id.trim().length) {
            errorParams.building_id = true;
            showErrorBorder = true;
        }
        if (!formParams.asset_condition_id || !formParams.asset_condition_id.trim().length) {
            errorParams.asset_condition_id = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });

        if (showErrorBorder) return false;
        return true;
    };

    addAsset = async () => {
        const { formParams } = this.state;
        let path = (this.props.location.state && this.props.location.state.prevPath) || "/assets";
        if (this.validate()) {
            await this.props.addAsset({ asset: formParams });
            ToastMsg(this.props.assetReducer.addAssetData.message, "info");
            if (this.props.assetReducer.addAssetData.success) {
                history.push(path);
            }
        }
    };

    editAsset = async () => {
        const { formParams } = this.state;
        let path = (this.props.location.state && this.props.location.state.prevPath) || "/assets";
        let prePrevPath = (this.props.location.state && this.props.location.state.prePrevPath) || "/assets";
        if (this.validate()) {
            await this.props.editAssetById({ asset: formParams }, this.props.match.params.id);
            ToastMsg(this.props.assetReducer.editAssetResponse.message, "info");
            if (this.props.assetReducer.editAssetResponse.success) {
                history.push(path, { prevPath: prePrevPath });
            }
        }
    };

    cancelForm = async () => {
        let path = (this.props.location.state && this.props.location.state.prevPath) || "/assets";
        let prePrevPath = (this.props.location.state && this.props.location.state.prePrevPath) || "/assets";
        if (this.state.showConfirmModal) {
            await this.setState({ showConfirmModal: false });
            history.push(path, { prevPath: prePrevPath });
        } else if (_.isEqual(this.state.initialData, this.state.formParams)) {
            history.push(path, { prevPath: prePrevPath });
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to clear and lose all changes?"}
                        paragraph={"This action cannot be reverted, are you sure that you need to cancel?"}
                        onCancel={() => this.setState({ showConfirmModal: false })}
                        onOk={this.cancelForm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    selectConsultancyId = async value => {
        const { formParams } = this.state;
        await this.setState({
            formParams: {
                ...formParams,
                consultancy_id: value,
                client_id: "",
                sector_id: "",
                campus_id: "",
                building_id: "",
                floor_id: ""
            }
        });
        this.getClientDropdown(value);
    };

    getClientDropdown = async consultancy_id => {
        await this.props.getClientDropdown({ consultancy_id });
        await this.setState({
            clientIdList: this.props.settingsCommonReducer.clientDropdownData.data
        });
    };

    selectClientId = async value => {
        const { formParams } = this.state;
        await this.setState({
            formParams: {
                ...formParams,
                client_id: value,
                sector_id: "",
                campus_id: "",
                building_id: "",
                floor_id: ""
            }
        });
        this.getSectorsDropdown(value);
    };

    getSectorsDropdown = async client_id => {
        await this.props.getSectorDropdown({ client_id });
        await this.setState({
            sectorIdList: this.props.settingsCommonReducer.sectorDropdownData.data
        });
    };

    selectSectorId = async value => {
        const { formParams } = this.state;
        await this.setState({
            formParams: {
                ...formParams,
                sector_id: value,
                campus_id: "",
                building_id: "",
                floor_id: ""
            }
        });
        this.getCampusDropdown(value);
    };

    getCampusDropdown = async sector_id => {
        await this.props.getCampusesDropdown({ sector_id });
        await this.setState({
            campusIdList: this.props.settingsCommonReducer.campusDropdownData.data
        });
    };

    selectCampusId = async value => {
        const { formParams } = this.state;
        await this.setState({
            formParams: {
                ...formParams,
                campus_id: value,
                building_id: "",
                floor_id: ""
            }
        });
        this.getBuildingsDropdown(value);
    };

    getBuildingsDropdown = async campus_id => {
        await this.props.getBuildingsDropdown({ campus_id });
        await this.setState({
            buildingIdList: this.props.settingsCommonReducer.buildingDropdownData.data
        });
    };

    selectBuildingId = async value => {
        const { formParams } = this.state;
        await this.setState({
            formParams: {
                ...formParams,
                building_id: value,
                floor_id: ""
            }
        });
        this.getFloorsDropdown(value);
    };

    getFloorsDropdown = async building_id => {
        await this.props.getFloorsDropdown({ building_id });
        await this.setState({
            floorIdList: this.props.settingsCommonReducer.floorDropdownData.data
        });
    };

    render() {
        const {
            consultancyIdList,
            clientIdList,
            sectorIdList,
            campusIdList,
            buildingIdList,
            floorIdList,
            assetConditionIdList,
            formParams,
            errorParams,
            showErrorBorder,
            selectedAsset
        } = this.state;
        return (
            <section className="cont-ara act-main">
                <div className="list-area">
                    <ToastContainer />
                    <TopSlider />
                    <div className="lst-bt-nav create">
                        <div className="table table-ara">
                            <div className="list-sec">
                                <div className="nav-ara">
                                    <div className="head">
                                        <h4>{selectedAsset ? "Edit" : "Add"} Asset</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="form-area">
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label>Asset Id</label>
                                        <input
                                            type="text"
                                            id="text"
                                            value={formParams.asset_id}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        asset_id: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Asset Id"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label className={showErrorBorder && errorParams.name ? "text-red" : ""}>Asset Name *</label>
                                        <input
                                            type="text"
                                            id="text"
                                            value={formParams.name}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        name: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Name"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label>Asset Type</label>
                                        <div className="custom-selecbox">
                                            <select
                                                className="custom-selecbox form-control"
                                                value={formParams.asset_type}
                                                onChange={e => {
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            asset_type: e.target.value
                                                        }
                                                    });
                                                }}
                                                disabled={true}
                                            >
                                                <option value="Generator">Generator</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label
                                            className={`${showErrorBorder && errorParams.consultancy_id ? "text-red " : ""}form-control-placeholder`}
                                        >
                                            Consultancy *
                                        </label>
                                        <div className="custom-selecbox">
                                            <select
                                                className="custom-selecbox form-control"
                                                value={formParams.consultancy_id}
                                                onChange={e => this.selectConsultancyId(e.target.value)}
                                            >
                                                <option value="">Select</option>
                                                {consultancyIdList &&
                                                    consultancyIdList.length &&
                                                    consultancyIdList.map((item, idex) => {
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

                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label className={`${showErrorBorder && errorParams.client_id ? "text-red " : ""}form-control-placeholder`}>
                                            Client *
                                        </label>
                                        <div className="custom-selecbox">
                                            <select
                                                className="form-control custom-selecbox"
                                                value={formParams.client_id}
                                                onChange={e => {
                                                    this.selectClientId(e.target.value);
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {clientIdList &&
                                                    clientIdList.map((item, idex) => {
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
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label className={`${showErrorBorder && errorParams.sector_id ? "text-red " : ""}form-control-placeholder`}>
                                            Sector *
                                        </label>
                                        <div className="custom-selecbox">
                                            <select
                                                className="form-control custom-selecbox"
                                                value={formParams.sector_id}
                                                onChange={e => {
                                                    this.selectSectorId(e.target.value);
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {sectorIdList &&
                                                    sectorIdList.map((item, idex) => {
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
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label className={`${showErrorBorder && errorParams.campus_id ? "text-red " : ""}form-control-placeholder`}>
                                            Campus *
                                        </label>
                                        <div className="custom-selecbox">
                                            <select
                                                className="form-control custom-selecbox"
                                                value={formParams.campus_id}
                                                onChange={e => {
                                                    this.selectCampusId(e.target.value);
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {campusIdList &&
                                                    campusIdList.map((item, idex) => {
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
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label className={`${showErrorBorder && errorParams.building_id ? "text-red " : ""}form-control-placeholder`}>
                                            Building *
                                        </label>
                                        <div className="custom-selecbox">
                                            <select
                                                className="form-control custom-selecbox"
                                                value={formParams.building_id}
                                                onChange={e => {
                                                    this.selectBuildingId(e.target.value);
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {buildingIdList.length &&
                                                    buildingIdList.map((item, idex) => {
                                                        return <option value={item.id}> {item.name} </option>;
                                                    })}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label
                                            className={`${
                                                showErrorBorder && errorParams.asset_condition_id ? "text-red " : ""
                                            }form-control-placeholder`}
                                        >
                                            Asset Condition *
                                        </label>
                                        <div className="custom-selecbox">
                                            <select
                                                className="form-control custom-selecbox"
                                                value={formParams.asset_condition_id}
                                                onChange={e => {
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            asset_condition_id: e.target.value
                                                        }
                                                    });
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {assetConditionIdList &&
                                                    assetConditionIdList.length &&
                                                    assetConditionIdList.map((item, idex) => {
                                                        return <option value={item.id}> {item.name} </option>;
                                                    })}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label className={`form-control-placeholder`}>Floor</label>
                                        <div className="custom-selecbox">
                                            <select
                                                className="form-control custom-selecbox"
                                                value={formParams.floor_id}
                                                onChange={e => {
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            floor_id: e.target.value
                                                        }
                                                    });
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {floorIdList.length &&
                                                    floorIdList.map((item, idex) => {
                                                        return <option value={item.id}> {item.name} </option>;
                                                    })}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label>Room</label>
                                        <input
                                            type="text"
                                            id="text"
                                            value={formParams.room}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        room: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Room"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label>Area Served</label>
                                        <input
                                            type="text"
                                            id="text"
                                            value={formParams.area_served}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        area_served: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Area Served"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label>Make</label>
                                        <input
                                            type="text"
                                            id="text"
                                            value={formParams.make}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        make: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Make"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label>Model Number</label>
                                        <input
                                            type="text"
                                            id="text"
                                            value={formParams.model_number}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        model_number: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Model Number"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label>Serial Number</label>
                                        <input
                                            type="text"
                                            id="text"
                                            value={formParams.serial_number}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        serial_number: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Serial Number"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label>Size</label>
                                        <input
                                            type="text"
                                            id="text"
                                            value={formParams.size}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        size: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Size"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label>Volts</label>
                                        <NumberFormat
                                            value={formParams.volts}
                                            thousandSeparator={false}
                                            decimalScale={0}
                                            className="form-control"
                                            placeholder="Volts"
                                            onValueChange={values => {
                                                const { value } = values;
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        volts: parseInt(value)
                                                    }
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label>Amps</label>
                                        <NumberFormat
                                            value={formParams.amps}
                                            thousandSeparator={false}
                                            decimalScale={0}
                                            className="form-control"
                                            placeholder="Amps"
                                            onValueChange={values => {
                                                const { value } = values;
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        amps: parseInt(value)
                                                    }
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label>Year of Unit</label>
                                        <NumberFormat
                                            value={formParams.year_of_unit}
                                            // thousandSeparator={true}
                                            decimalScale={0}
                                            format="####"
                                            className="form-control"
                                            placeholder="Year of Unit"
                                            onValueChange={values => {
                                                const { value } = values;
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        year_of_unit: parseInt(value)
                                                    }
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label>Installed Year</label>
                                        <NumberFormat
                                            value={formParams.installed_year}
                                            decimalScale={0}
                                            format="####"
                                            className="form-control"
                                            placeholder="Installed Year"
                                            onValueChange={values => {
                                                const { value } = values;
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        installed_year: parseInt(value)
                                                    }
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label>Service Life</label>
                                        <NumberFormat
                                            value={formParams.service_life}
                                            // thousandSeparator={true}
                                            decimalScale={0}
                                            className="form-control"
                                            placeholder="Service Life"
                                            onValueChange={values => {
                                                const { value } = values;
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        service_life: parseInt(value)
                                                    }
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                                {/* <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label>Useful Life Remaining</label>
                                        <NumberFormat
                                            value={formParams.useful_life_remaining}
                                            thousandSeparator={true}
                                            decimalScale={0}
                                            className="form-control"
                                            placeholder="Useful Life Remaining"
                                            onValueChange={values => {
                                                const { value } = values;
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        useful_life_remaining: parseInt(value)
                                                    }
                                                });
                                            }}
                                        />
                                    </div>
                                </div> */}
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label>CRV</label>
                                        <NumberFormat
                                            value={formParams.crv}
                                            thousandSeparator={true}
                                            decimalScale={0}
                                            className="form-control"
                                            placeholder="CRV"
                                            onValueChange={values => {
                                                const { value } = values;
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        crv: parseInt(value)
                                                    }
                                                });
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label>Device Count</label>
                                        <NumberFormat
                                            value={formParams.device_count}
                                            // thousandSeparator={true}
                                            decimalScale={0}
                                            className="form-control"
                                            placeholder="Device Count"
                                            onValueChange={values => {
                                                const { value } = values;
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        device_count: parseInt(value)
                                                    }
                                                });
                                            }}
                                            disabled={true}
                                        />
                                    </div>
                                </div>
                                <div className="itm col-md-3">
                                    <label>Is Active?</label>
                                    <div className="chek">
                                        <div className="chekbox-sec">
                                            <label className="container">
                                                Yes
                                                <input
                                                    type="radio"
                                                    name="is_active"
                                                    value="yes"
                                                    onChange={async e => {
                                                        await this.setState({
                                                            formParams: {
                                                                ...formParams,
                                                                [e.target.name]: e.target.value
                                                            }
                                                        });
                                                    }}
                                                    checked={formParams.is_active === "yes"}
                                                />
                                                <span className="checkmark"></span>
                                            </label>
                                            <label className="container">
                                                No
                                                <input
                                                    type="radio"
                                                    name="is_active"
                                                    value="no"
                                                    onChange={async e => {
                                                        await this.setState({
                                                            formParams: {
                                                                ...formParams,
                                                                [e.target.name]: e.target.value
                                                            }
                                                        });
                                                    }}
                                                    checked={formParams.is_active === "no"}
                                                />
                                                <span className="checkmark"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="itm col-md-3">
                                    <div className="form-group">
                                        <label>Notes</label>
                                        <textarea
                                            value={formParams.notes}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        notes: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Notes"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="btn-sec">
                                <button className="btn btn-cncl-back mr-2" onClick={() => this.cancelForm()}>
                                    <i className="material-icons tic"> close</i>Cancel
                                </button>
                                {selectedAsset ? (
                                    <button className="btn btn-create" onClick={() => this.editAsset()}>
                                        <i className="material-icons tic"> check</i> Update Asset
                                    </button>
                                ) : (
                                    <button className="btn btn-create" onClick={() => this.addAsset()}>
                                        <i className="material-icons tic"> check</i> Add Asset
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {this.renderConfirmationModal()}
            </section>
        );
    }
}

const mapStateToProps = state => {
    const { assetReducer, settingsCommonReducer } = state;
    return { assetReducer, settingsCommonReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions, ...commonActions })(Form));
