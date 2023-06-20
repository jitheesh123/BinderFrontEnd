import React, { Component } from "react";
import { connect } from "react-redux";
import NumberFormat from "react-number-format";
import { ToastContainer } from "react-toastify";
import { Multiselect } from "multiselect-react-dropdown";
import { withRouter } from "react-router-dom";
import _ from "lodash";

import TopSlider from "../../common/components/TopSlider";
import actions from "./actions";
import commonActions from "../actions";
import ToastMsg from "../../common/ToastMessage";
import history from "../../../config/history";
import Breadcrumb from "../../common/components/Breadcrumb";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";

class editBuilding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consultancyIdList: [],
            logbookIdList: [],
            clientIdList: [],
            sectorIdList: [],
            campusIdList: [],
            deeming_agencies: [],
            building_types: [],
            formParams: {
                name: null,
                display_name: null,
                zip_code: null,
                city: null,
                state: null,
                year: null,
                country: null,
                ownership: null,
                ownership_type: null,
                use: null,
                area: null,
                number: null,
                cost: null,
                enterprise_index: null,
                manager: null,
                street: null,
                ministry: null,
                description: null,
                comments: null,
                building_id: null,
                code: "",
                deeming_agency_id: null,
                building_type_id: null
            },
            errorParams: {
                name: false,
                consultancy_id: false,
                client_id: false,
                sector_id: false,
                campus_id: false,
                building_type_id: false
            },
            selectedBuildings: [],

            showErrorBorder: false,
            isEdit: false,
            selectedBuilding: props.match.params.id,
            initialData: {
                name: null,
                display_name: null,
                zip_code: null,
                city: null,
                state: null,
                year: null,
                country: null,
                ownership: null,
                ownership_type: null,
                use: null,
                area: null,
                number: null,
                cost: null,
                enterprise_index: null,
                manager: null,
                street: null,
                ministry: null,
                description: null,
                comments: null,
                building_id: null,
                code: "",
                deeming_agency_id: null,
                building_type_id: null
            },
            showConfirmModal: false
        };
    }

    componentDidMount = async () => {
        const { selectedBuilding } = this.state;
        await this.props.getConsultancyDropdown();
        await this.props.getDeemingAgencyDropdown();
        await this.setState({
            consultancyIdList: this.props.settingsCommonReducer.consultancyDropdownData.data,
            deeming_agencies: this.props.settingsCommonReducer.deemingAgencyDropdownData.data
        });
        if (selectedBuilding) {
            await this.props.getBuildingById(selectedBuilding);
            const {
                buildingReducer: {
                    getBuildingByIdResponse: {
                        building: {
                            name,
                            code,
                            display_name,
                            building_id,
                            consultancy,
                            client,
                            campus,
                            sector,
                            comments,
                            logbooks,
                            description,
                            ministry,
                            street,
                            manager,
                            enterprise_index,
                            cost,
                            number,
                            area,
                            use,
                            ownership_type,
                            ownership,
                            country,
                            zip_code,
                            city,
                            state,
                            year,
                            deeming_agency,
                            building_type
                        },
                        success
                    }
                }
            } = this.props;
            if (success) {
                this.getLogbookDropDown(client.id);
                this.getClientDropdown(consultancy.id);
                this.getSectorDropdown(client.id);
                this.getCampusDropdown(sector.id);
                await this.props.getBuildingTypeDropdown({ consultancy_id: consultancy.id, client_id: client.id });
                await this.setState({
                    formParams: {
                        name,
                        comments,
                        code,
                        display_name,
                        zip_code,
                        city,
                        state,
                        year,
                        country,
                        ownership,
                        ownership_type,
                        use,
                        area,
                        number,
                        cost,
                        enterprise_index,
                        manager,
                        street,
                        ministry,
                        description,
                        building_id,
                        sector_id: sector.id || "",
                        campus_id: campus.id || "",
                        client_id: client.id || "",
                        consultancy_id: consultancy.id,
                        deeming_agency_id: deeming_agency.id || "",
                        building_type_id: building_type.id || ""
                    },
                    initialData: {
                        name,
                        comments,
                        code,
                        display_name,
                        zip_code,
                        city,
                        state,
                        year,
                        country,
                        ownership,
                        ownership_type,
                        use,
                        area,
                        number,
                        cost,
                        enterprise_index,
                        manager,
                        street,
                        ministry,
                        description,
                        building_id,
                        sector_id: sector.id || "",
                        campus_id: campus.id || "",
                        client_id: client.id || "",
                        consultancy_id: consultancy.id,
                        deeming_agency_id: deeming_agency.id || "",
                        building_type_id: building_type.id || ""
                    },
                    selectedBuildings: logbooks,
                    isEdit: true,
                    building_types: this.props.settingsCommonReducer.buildingTypeDropdownData.data || []
                });
            }
        }
        // if (this.props.history.location.state && this.props.history.location.state.buildingItem) {
        //     let tempFormParam = this.props.history.location.state.buildingItem;
        //     tempFormParam.sector_id = tempFormParam.sector.id;
        //     tempFormParam.campus_id = tempFormParam.campus.id;
        //     tempFormParam.client_id = tempFormParam.client.id;
        //     tempFormParam.consultancy_id = tempFormParam.consultancy.id;

        //     this.getLogbookDropDown(this.props.history.location.state.client_id);
        //     this.getClientDropdown(this.props.history.location.state.consultancy_id);
        //     this.getSectorDropdown(this.props.history.location.state.client_id);
        //     this.getCampusDropdown(this.props.history.location.state.sector_id);
        //     await this.setState({
        //         formParams: tempFormParam,
        //         isEdit: true,
        //         selectedBuildings: tempFormParam.logbooks
        //     });
        // }
    };

    getLogbookDropDown = async client_id => {
        await this.props.getLogbookDropdown({ client_id });
        await this.setState({
            logbookIdList: this.props.settingsCommonReducer.logbookDropdownData.data
        });
        return true;
    };

    getClientDropdown = async consultancy_id => {
        await this.props.getClientDropdown({ consultancy_id });
        await this.setState({
            clientIdList: this.props.settingsCommonReducer.clientDropdownData.data
        });
    };

    getSectorDropdown = async client_id => {
        await this.props.getSectorDropdown({ client_id });
        await this.setState({
            sectorIdList: this.props.settingsCommonReducer.sectorDropdownData.data
        });
    };

    getCampusDropdown = async sector_id => {
        await this.props.getCampusesDropdown({ sector_id });
        await this.setState({
            campusIdList: this.props.settingsCommonReducer.campusDropdownData.data
        });
    };

    selectConsultancyId = async value => {
        const { formParams } = this.state;
        await this.setState({
            formParams: {
                ...formParams,
                consultancy_id: value,
                building_type_id: ""
            }
        });
        this.getClientDropdown(value);
    };

    selectClientId = async value => {
        const { formParams } = this.state;
        await this.props.getBuildingTypeDropdown({ consultancy_id: formParams.consultancy_id, client_id: value });
        await this.setState({
            formParams: {
                ...formParams,
                client_id: value,
                building_type_id: ""
            },
            building_types: this.props.settingsCommonReducer.buildingTypeDropdownData.data || []
        });
        this.getSectorDropdown(value);
        this.getLogbookDropDown(value);
    };

    selectSectorId = async value => {
        const { formParams } = this.state;
        await this.setState({
            formParams: {
                ...formParams,
                sector_id: value
            }
        });
        this.getCampusDropdown(value);
    };

    validate = () => {
        const { formParams, selectedBuildings } = this.state;
        let errorParams = {
            name: false,
            consultancy_id: false,
            client_id: false,
            sector_id: false,
            campus_id: false,
            logbook_id: false,
            building_type_id: false
        };
        let showErrorBorder = false;
        if (!formParams.name || !formParams.name.trim().length) {
            errorParams.name = true;
            showErrorBorder = true;
        }
        // if (!selectedBuildings || !selectedBuildings.length) {
        //     errorParams.logbook_ids = true;
        //     showErrorBorder = true;
        // }
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
        if (!formParams.building_type_id || !formParams.building_type_id.trim().length) {
            errorParams.building_type_id = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });

        if (showErrorBorder) return false;
        return true;
    };

    editBuilding = async () => {
        const { formParams } = this.state;
        if (this.validate()) {
            await this.props.editBuilding({ building: formParams }, this.props.match.params.id);
            ToastMsg(this.props.buildingReducer.editBuildingData.message, "info");
            if (this.props.buildingReducer.editBuildingData.success) {
                if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                    history.push(`/building/buildinginfo/${this.props.match.params.id}/basicdetails`);
                } else {
                    history.push("/buildings");
                }
            }
        }
    };

    addBuilding = async () => {
        const { formParams } = this.state;
        if (this.validate()) {
            await this.props.addBuilding({ building: formParams });
            ToastMsg(this.props.buildingReducer.addBuildingData.message, "info");
            if (this.props.buildingReducer.addBuildingData.success) {
                history.push("/buildings");
            }
        }
    };

    onLogbookSelect = async selectedList => {
        const { formParams } = this.state;
        let tempLogbookList = [];
        selectedList.map(item => tempLogbookList.push(item.id));
        await this.setState({
            formParams: {
                ...formParams,
                logbook_ids: tempLogbookList
            },
            selectedBuildings: selectedList
        });
    };

    onLogbookRemove = async selectedList => {
        const { formParams } = this.state;
        let tempLogbookList = [];
        selectedList.map(item => tempLogbookList.push(item.id));
        await this.setState({
            formParams: {
                ...formParams,
                logbook_ids: tempLogbookList
            },
            selectedBuildings: selectedList
        });
    };

    cancelForm = async () => {
        if (this.state.showConfirmModal) {
            await this.setState({ showConfirmModal: false });
            if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                history.push(`/building/buildinginfo/${this.props.match.params.id}/basicdetails`);
            } else {
                history.push("/buildings");
            }
        } else if (_.isEqual(this.state.initialData, this.state.formParams)) {
            if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                history.push(`/building/buildinginfo/${this.props.match.params.id}/basicdetails`);
            } else {
                history.push("/buildings");
            }
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
                        type="cancel"
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

    render() {
        const {
            isEdit,
            formParams,
            showErrorBorder,
            errorParams,
            consultancyIdList,
            clientIdList,
            sectorIdList,
            campusIdList,
            logbookIdList,
            selectedBuildings,
            deeming_agencies,
            selectedBuilding,
            building_types
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
                                        <h4>{selectedBuilding ? "Edit" : "Add"} Building</h4>
                                    </div>
                                    {/* <Breadcrumb /> */}
                                </div>
                            </div>
                            <div className="form-area">
                                <div className="head">
                                    <h3>Basic Info</h3>
                                </div>
                                {selectedBuilding ? (
                                    <div className="itm">
                                        <div className="form-group">
                                            <label>Code</label>
                                            <input type="text" className="form-control" placeholder="" value={formParams.code} disabled={true} />
                                        </div>
                                    </div>
                                ) : null}
                                <div className="itm">
                                    <div className="form-group">
                                        <label className={`${showErrorBorder && errorParams.name ? "text-red " : ""}form-control-placeholder`}>
                                            Building Name *
                                        </label>
                                        <input
                                            type="text"
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
                                            placeholder="Enter Building Name"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                                <div className="itm">
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
                                <div className="itm">
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

                                <div className="itm">
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
                                                {sectorIdList.length &&
                                                    sectorIdList.map((item, idex) => {
                                                        return <option value={item.id}> {item.name} </option>;
                                                    })}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="itm">
                                    <div className="form-group">
                                        <label className={`${showErrorBorder && errorParams.campus_id ? "text-red " : ""}form-control-placeholder`}>
                                            Campus *
                                        </label>
                                        <div className="custom-selecbox">
                                            <select
                                                className="form-control custom-selecbox"
                                                value={formParams.campus_id}
                                                onChange={e => {
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            campus_id: e.target.value
                                                        }
                                                    });
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {campusIdList.length &&
                                                    campusIdList.map((item, idex) => {
                                                        return <option value={item.id}> {item.name} </option>;
                                                    })}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="form-group">
                                        <label className={`form-control-placeholder`}>Deeming Agency</label>
                                        <div className="custom-selecbox">
                                            <select
                                                className="custom-selecbox form-control"
                                                value={formParams.deeming_agency_id}
                                                onChange={e => {
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            deeming_agency_id: e.target.value
                                                        }
                                                    });
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {deeming_agencies.length &&
                                                    deeming_agencies.map((item, idex) => {
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
                                    <div className="form-group">
                                        <label
                                            className={`${
                                                showErrorBorder && errorParams.building_type_id ? "text-red " : ""
                                            }form-control-placeholder`}
                                        >
                                            Building Type *
                                        </label>
                                        <div className="custom-selecbox">
                                            <select
                                                className="custom-selecbox form-control"
                                                value={formParams.building_type_id}
                                                onChange={e => {
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            building_type_id: e.target.value
                                                        }
                                                    });
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {building_types.length &&
                                                    building_types.map((item, idex) => {
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
                                    <div className="form-group">
                                        <label className="form-control-placeholder">Display Name</label>
                                        <input
                                            type="text"
                                            value={formParams.display_name}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        display_name: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Enter Display Name "
                                            list="builiding"
                                            name="builiding"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>

                                <div className="itm">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">Description</label>
                                        <input
                                            type="text"
                                            value={formParams.description}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        description: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Enter Description "
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">Building Number</label>
                                        <input
                                            type="text"
                                            value={formParams.number}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        number: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Enter Building Number"
                                            list="buildigNumber"
                                            name="buildigNumber"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                                {/* <div className="itm">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">Associated Logbooks</label>
                                        <div className="custom-selecbox">
                                            <Multiselect
                                                options={logbookIdList}
                                                selectedValues={selectedBuildings}
                                                onSelect={this.onLogbookSelect}
                                                onRemove={this.onLogbookRemove}
                                                displayValue="name"
                                            />
                                        </div>
                                    </div>
                                </div> */}

                                <div className="head mt-4">
                                    <h3>More Info</h3>
                                </div>
                                <div className="itm">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">Area (Sq)</label>
                                        <NumberFormat
                                            value={parseInt(formParams.area)}
                                            thousandSeparator={true}
                                            decimalScale={0}
                                            className="form-control"
                                            placeholder="Enter Area (Sq)"
                                            onValueChange={values => {
                                                const { value } = values;
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        area: value
                                                    }
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">Cost</label>
                                        <NumberFormat
                                            value={formParams.cost}
                                            thousandSeparator={true}
                                            decimalScale={0}
                                            className="form-control"
                                            placeholder="Enter Cost"
                                            prefix={formParams.cost && formParams.cost.length ? "$ " : ""}
                                            onValueChange={values => {
                                                const { value } = values;
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        cost: value
                                                    }
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">Enterprise Index</label>
                                        <input
                                            type="text"
                                            value={formParams.enterprise_index}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        enterprise_index: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Enter Enterprise Index "
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>

                                <div className="itm">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">Ownership</label>
                                        <input
                                            type="text"
                                            value={formParams.ownership}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        ownership: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Enter Ownership "
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>

                                <div className="itm">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">Ownership Type</label>
                                        <input
                                            type="text"
                                            value={formParams.ownership_type}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        ownership_type: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Enter Ownership Type"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>

                                <div className="itm">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">Use</label>
                                        <input
                                            type="text"
                                            value={formParams.use}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        use: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Enter Use "
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">Manager</label>
                                        <input
                                            type="text"
                                            value={formParams.manager}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        manager: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Enter Manager "
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">Year Built</label>
                                        <NumberFormat
                                            value={formParams.year}
                                            thousandSeparator={false}
                                            className="form-control"
                                            placeholder="Enter Year Built"
                                            format="####"
                                            onValueChange={values => {
                                                const { value } = values;
                                                if (parseInt(value.length) < 5) {
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            year: parseInt(value)
                                                        }
                                                    });
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">Ministry</label>
                                        <input
                                            type="text"
                                            value={formParams.ministry}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        ministry: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Enter Ministry "
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>

                                <div className="head mt-4">
                                    <h3>Address</h3>
                                </div>
                                <div className="itm">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">Street</label>
                                        <input
                                            type="text"
                                            value={formParams.street}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        street: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Enter Street "
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">City</label>
                                        <input
                                            type="text"
                                            value={formParams.city}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        city: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Enter City "
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                                <div className="itm">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">State</label>
                                        <input
                                            type="text"
                                            value={formParams.state}
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        state: e.target.value
                                                    }
                                                });
                                            }}
                                            className="form-control"
                                            placeholder="Enter State "
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>

                                <div className="itm">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">Country</label>
                                        <input
                                            type="text"
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        country: e.target.value
                                                    }
                                                });
                                            }}
                                            value={formParams.country}
                                            className="form-control"
                                            placeholder="Enter Country"
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>

                                <div className="itm">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">Zip Code</label>
                                        <NumberFormat
                                            value={formParams.zip_code}
                                            thousandSeparator={false}
                                            className="form-control"
                                            placeholder="Zipcode"
                                            format="######"
                                            onValueChange={values => {
                                                const { value } = values;
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        zip_code: value
                                                    }
                                                });
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="itm">
                                    <div className="form-group">
                                        <label className="form-control-placeholder">Comments</label>
                                        <input
                                            type="text"
                                            onChange={e => {
                                                this.setState({
                                                    formParams: {
                                                        ...formParams,
                                                        comments: e.target.value
                                                    }
                                                });
                                            }}
                                            value={formParams.comments}
                                            className="form-control"
                                            placeholder="Enter Comments "
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="btn-sec">
                                <button className="btn btn-cncl-back mr-2" onClick={() => this.cancelForm()}>
                                    <i className="material-icons tic"> close</i>Cancel
                                </button>
                                {selectedBuilding ? (
                                    <button className="btn btn-create" onClick={() => this.editBuilding()}>
                                        <i className="material-icons tic"> check</i> Update Building
                                    </button>
                                ) : (
                                    <button className="btn btn-create" onClick={() => this.addBuilding()}>
                                        <i className="material-icons tic"> check</i> Add Building
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
    const { buildingReducer, settingsCommonReducer } = state;
    return { buildingReducer, settingsCommonReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions, ...commonActions })(editBuilding));
