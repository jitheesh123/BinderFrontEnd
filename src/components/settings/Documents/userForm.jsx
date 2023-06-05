import React, { Component } from "react";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import { withRouter } from "react-router-dom";
import NumberFormat from "react-number-format";
import ReactTooltip from "react-tooltip";
import _ from "lodash";
import { Multiselect } from "multiselect-react-dropdown";

import history from "../../../config/history";
import TopSlider from "../../common/components/TopSlider";
import actions from "./actions";
import ToastMsg from "../../common/ToastMessage";
import commonActions from "../actions";
import { reportsList } from "../../../config/utils";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";

const mapStateToProps = state => {
    const { userReducer, settingsCommonReducer } = state;
    return { userReducer, settingsCommonReducer };
};

class editConsultancy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consultancyIdList: [],
            roleIdList: [],
            clientIdList: [],
            userPermissionList: [],
            formParams: {
                name: "",
                email: "",
                password: "",
                first_name: "",
                last_name: "",
                printed_name: "",
                title: "",
                work_phone: "",
                cell_phone: "",
                room_number: "",
                room_name: "",
                emergency_contact_no: "",
                emergency_contact_name: "",
                notes: "",
                address: "",
                state: "",
                city: "",
                zip_code: "",
                department: "",
                credentials: "",
                location: "",
                role_id: "",
                building_name: "",
                cmms_username: "",
                consultancy_id: "",
                client_id: "",
                image: null,
                image_description: "",
                password_confirm: "",
                permission_id: "",
                view_only: "no"
            },
            errorParams: {
                name: false,
                role_id: false,
                consultancy_id: false,
                confirmPassword: false
            },
            isEdit: false,
            showErrorBorder: false,
            selectedUser: props.match.params.id,
            selectedImage: "",
            role_name: "",
            confirmPasswordErrorMessage: "",
            initialData: {
                name: "",
                email: "",
                password: "",
                first_name: "",
                last_name: "",
                printed_name: "",
                title: "",
                work_phone: "",
                cell_phone: "",
                room_number: "",
                room_name: "",
                emergency_contact_no: "",
                emergency_contact_name: "",
                notes: "",
                address: "",
                state: "",
                city: "",
                zip_code: "",
                department: "",
                credentials: "",
                location: "",
                role_id: "",
                building_name: "",
                cmms_username: "",
                consultancy_id: "",
                client_id: "",
                image: null,
                image_description: "",
                password_confirm: "",
                permission_id: "",
                view_only: "no"
            },
            showConfirmModal: false,
            escalationsList: []
        };
    }

    componentDidMount = async () => {
        await this.refreshUserData();
    };

    refreshUserData = async () => {
        const { selectedUser } = this.state;
        await this.props.getConsultancyDropdown();
        await this.props.getRoleDropdown();
        await this.setState({
            consultancyIdList: this.props.settingsCommonReducer.consultancyDropdownData.data,
            roleIdList: this.props.settingsCommonReducer.roleDropdownData.data
        });
        if (selectedUser) {
            await this.props.getUsersById(this.props.match.params.id);
            const {
                userReducer: {
                    getUsersById: {
                        user: {
                            name,
                            email,
                            password,
                            first_name,
                            last_name,
                            printed_name,
                            title,
                            work_phone,
                            cell_phone,
                            room_number,
                            room_name,
                            emergency_contact_no,
                            emergency_contact_name,
                            notes,
                            address,
                            state,
                            city,
                            zip_code,
                            department,
                            credentials,
                            location,
                            role,
                            building_name,
                            // is_active,
                            // is_blocked,
                            cmms_username,
                            consultancy,
                            client,
                            image,
                            permission,
                            reports,
                            escalation,
                            view_only = "no"
                        },
                        success
                    }
                }
            } = this.props;
            if (success) {
                this.getClientDropdown(consultancy.id);
                await this.props.getUserPermissionDropdown({ consultancy_id: consultancy.id });
                const {
                    userReducer: {
                        userPermissionDropdownResponse: { permissions }
                    }
                } = this.props;
                await this.setState({
                    formParams: {
                        name,
                        email,
                        image,
                        password,
                        password_confirm: password,
                        first_name,
                        last_name,
                        printed_name,
                        title,
                        work_phone,
                        cell_phone,
                        room_number,
                        room_name,
                        emergency_contact_no,
                        emergency_contact_name,
                        notes,
                        address,
                        state,
                        city,
                        zip_code,
                        department,
                        credentials,
                        location,
                        view_only,
                        role_id: role.id || "",
                        building_name,
                        cmms_username,
                        consultancy_id: consultancy.id || "",
                        client_id: client.id || "",
                        permission_id: permission.id || "",
                        reports: reports ? reports.map(item => ({ id: item, name: item })) : [],
                        escalation: escalation ? escalation.map(item => ({ id: item, name: item })) : [],
                        image_description: image.description,
                        image_id: image ? image.url : ""
                    },
                    initialData: {
                        name,
                        email,
                        image,
                        password,
                        password_confirm: password,
                        first_name,
                        last_name,
                        printed_name,
                        title,
                        work_phone,
                        cell_phone,
                        room_number,
                        room_name,
                        emergency_contact_no,
                        emergency_contact_name,
                        notes,
                        address,
                        state,
                        city,
                        zip_code,
                        department,
                        credentials,
                        location,
                        view_only,
                        role_id: role.id || "",
                        building_name,
                        cmms_username,
                        consultancy_id: consultancy.id || "",
                        client_id: client.id || "",
                        permission_id: permission.id || "",
                        reports: reports ? reports.map(item => ({ id: item, name: item })) : [],
                        escalation: escalation ? escalation.map(item => ({ id: item, name: item })) : [],
                        image_description: image.description,
                        image_id: image ? image.url : ""
                    },
                    role_name: role.name || "",
                    isEdit: true,
                    selectedImage: image,
                    userPermissionList: permissions,
                    escalationsList: reports ? reports.map(item => ({ id: item, name: item })) : []
                });
            }
        }
    };

    componentDidUpdate = async prevProps => {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            await this.refreshUserData();
        }
    };

    getClientDropdown = async consultancy_id => {
        await this.props.getClientDropdown({ consultancy_id });
        await this.setState({
            clientIdList: this.props.settingsCommonReducer.clientDropdownData.data
        });
    };

    selectConsultancyId = async value => {
        const { formParams } = this.state;
        await this.setState({
            formParams: {
                ...formParams,
                consultancy_id: value,
                permission_id: ""
            }
        });
        this.getClientDropdown(value);
        await this.props.getUserPermissionDropdown({ consultancy_id: value });
        const {
            userReducer: {
                userPermissionDropdownResponse: { permissions }
            }
        } = this.props;
        await this.setState({
            userPermissionList: permissions
        });
    };

    validate = () => {
        const { formParams } = this.state;
        let emailExp = /^\w+([\.-]?\w+)*@\w+([\.-]?(\.\w{2,3})+)*(\.\w{2,3})+$/;
        let passwordExp = /^(?=.{6,}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?\W).*$/;
        let errorParams = {
            name: false
        };
        let showErrorBorder = false;
        let confirmPasswordErrorMessage = "";
        if (!formParams.name || !formParams.name.trim().length) {
            errorParams.name = true;
            showErrorBorder = true;
        }
        if (!formParams.email.trim().length) {
            errorParams.email = true;
            showErrorBorder = true;
        }
        if (!emailExp.test(formParams.email.trim())) {
            errorParams.email = true;
            showErrorBorder = true;
        }
        if (!this.state.selectedUser && (!formParams.password.trim().length || !passwordExp.test(formParams.password))) {
            errorParams.password = true;
            showErrorBorder = true;
        }
        if (formParams.password && formParams.password.trim().length && !passwordExp.test(formParams.password)) {
            errorParams.password = true;
            showErrorBorder = true;
        }
        if (this.state.role_name !== "super_admin" && (!formParams.consultancy_id || !formParams.consultancy_id.trim().length)) {
            errorParams.consultancy_id = true;
            showErrorBorder = true;
        }
        if (this.state.role_name !== "super_admin" && (!formParams.role_id || !formParams.role_id.trim().length)) {
            errorParams.role_id = true;
            showErrorBorder = true;
        }
        if (this.state.role_name === "client_user" && (!formParams.client_id || !formParams.role_id.trim().length)) {
            errorParams.clien_id = true;
            showErrorBorder = true;
        }
        if (formParams.password && !formParams.password_confirm) {
            showErrorBorder = true;
            errorParams.confirmPassword = true;
        }
        if (formParams.password && formParams.password_confirm && formParams.password !== formParams.password_confirm) {
            confirmPasswordErrorMessage = "confirm password not matching";
            showErrorBorder = true;
            errorParams.confirmPassword = false;
        }
        this.setState({
            showErrorBorder,
            errorParams,
            confirmPasswordErrorMessage
        });

        if (showErrorBorder) return false;
        return true;
    };

    handleSelectRoleName = async roleId => {
        const { roleIdList, formParams } = this.state;
        let temprole = "";
        roleIdList.map(item => {
            if (item.id === roleId) {
                temprole = item.name;
                return true;
            }
        });
        await this.setState({
            role_name: temprole,
            formParams: {
                ...formParams,
                client_id: null
            }
        });
    };

    updateUser = async () => {
        const { formParams, selectedImage } = this.state;
        if (this.validate()) {
            let params = new FormData();
            params.append("user[name]", formParams.name);
            params.append("user[image_description]", formParams.image_description);
            params.append("user[email]", formParams.email);
            if (formParams.password && formParams.password.length) {
                params.append("user[password]", formParams.password);
            }
            if (formParams.password_confirm && formParams.password_confirm.length) {
                params.append("user[password_confirm]", formParams.password_confirm);
            }
            params.append("user[permission_id]", formParams.permission_id);
            params.append("user[first_name]", formParams.first_name);
            params.append("user[last_name]", formParams.last_name);
            params.append("user[printed_name]", formParams.printed_name);
            params.append("user[title]", formParams.title);
            params.append("user[work_phone]", formParams.work_phone);
            params.append("user[cell_phone]", formParams.cell_phone);
            params.append("user[room_number]", formParams.room_number);
            params.append("user[room_name]", formParams.room_name);
            params.append("user[emergency_contact_no]", formParams.emergency_contact_no);
            params.append("user[emergency_contact_name]", formParams.emergency_contact_name);
            params.append("user[notes]", formParams.notes);
            params.append("user[address]", formParams.address);
            params.append("user[state]", formParams.state);
            params.append("user[city]", formParams.city);
            params.append("user[zip_code]", formParams.zip_code);
            params.append("user[department]", formParams.department);
            params.append("user[credentials]", formParams.credentials);
            params.append("user[location]", formParams.location);
            params.append("user[role_id]", formParams.role_id);
            params.append("user[building_name]", formParams.building_name);
            params.append("user[cmms_username]", formParams.cmms_username);
            params.append("user[consultancy_id]", formParams.consultancy_id);
            params.append("user[role_id]", formParams.role_id);
            params.append("user[client_id]", formParams.client_id);
            params.append("user[view_only]", formParams.view_only);
            params.append("user[reports]", formParams.reports ? JSON.stringify(formParams.reports.map(item => item.id)) : JSON.stringify([]));
            params.append(
                "user[escalation]",
                formParams.escalation ? JSON.stringify(formParams.escalation.map(item => item.id)) : JSON.stringify([])
            );
            if (selectedImage && selectedImage.name !== formParams.image.name) {
                params.append("user[image]", formParams.image);
            } else if (!formParams.image_id && formParams.image) {
                params.append("user[image]", formParams.image);
            }
            await this.props.editUsersById(params, this.props.match.params.id);
            ToastMsg(this.props.userReducer.editUsersById.message, "info");
            if (this.props.userReducer.editUsersById.success) {
                if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                    history.push(`/user/userinfo/${this.props.match.params.id}/basicdetails`);
                } else if (this.props.location && this.props.location.state && this.props.location.state.prevPagePath) {
                    history.push(this.props.location.state.prevPagePath);
                } else {
                    history.push("/users");
                }
            }
        }
    };

    addUser = async () => {
        const { formParams } = this.state;
        if (this.validate()) {
            let params = new FormData();
            params.append("user[name]", formParams.name);
            params.append("user[image_description]", formParams.image_description);
            params.append("user[image]", formParams.image);
            params.append("user[email]", formParams.email);
            params.append("user[password]", formParams.password);
            params.append("user[password_confirm]", formParams.password_confirm);
            params.append("user[permission_id]", formParams.permission_id);
            params.append("user[first_name]", formParams.first_name);
            params.append("user[last_name]", formParams.last_name);
            params.append("user[printed_name]", formParams.printed_name);
            params.append("user[title]", formParams.title);
            params.append("user[work_phone]", formParams.work_phone);
            params.append("user[cell_phone]", formParams.cell_phone);
            params.append("user[room_number]", formParams.room_number);
            params.append("user[room_name]", formParams.room_name);
            params.append("user[emergency_contact_no]", formParams.emergency_contact_no);
            params.append("user[emergency_contact_name]", formParams.emergency_contact_name);
            params.append("user[notes]", formParams.notes);
            params.append("user[address]", formParams.address);
            params.append("user[state]", formParams.state);
            params.append("user[city]", formParams.city);
            params.append("user[zip_code]", formParams.zip_code);
            params.append("user[department]", formParams.department);
            params.append("user[credentials]", formParams.credentials);
            params.append("user[location]", formParams.location);
            params.append("user[role_id]", formParams.role_id);
            params.append("user[building_name]", formParams.building_name);
            params.append("user[cmms_username]", formParams.cmms_username);
            params.append("user[consultancy_id]", formParams.consultancy_id);
            params.append("user[role_id]", formParams.role_id);
            params.append("user[client_id]", formParams.client_id);
            params.append("user[view_only]", formParams.view_only);
            params.append("user[reports]", formParams.reports ? JSON.stringify(formParams.reports.map(item => item.id)) : JSON.stringify([]));
            params.append(
                "user[escalation]",
                formParams.escalation ? JSON.stringify(formParams.escalation.map(item => item.id)) : JSON.stringify([])
            );
            await this.props.addUsers(params);
            ToastMsg(this.props.userReducer.addUsersData.message, "info");
            if (this.props.userReducer.addUsersData.success) {
                history.push("/document");
            }
        }
    };

    handleAddAttachment = async e => {
        const { formParams } = this.state;
        await this.setState({
            formParams: {
                ...formParams,
                image: e.target.files[0]
            }
        });
    };

    cancelForm = async () => {
        if (this.state.showConfirmModal) {
            await this.setState({ showConfirmModal: false });
            if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                history.push(`/document/documentinfo/${this.props.match.params.id}/basicdetails`);
            } else if (this.props.location && this.props.location.state && this.props.location.state.prevPagePath) {
                history.push(this.props.location.state.prevPagePath);
            } else {
                history.push("/document");
            }
        } else if (_.isEqual(this.state.initialData, this.state.formParams)) {
            if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                history.push(`/document/documentinfo/${this.props.match.params.id}/basicdetails`);
            } else if (this.props.location && this.props.location.state && this.props.location.state.prevPagePath) {
                history.push(this.props.location.state.prevPagePath);
            } else {
                history.push("/document");
            }
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };

    checkEmailExist = async () => {
        const { formParams } = this.state;
        let emailExp = /^\w+([\.-]?\w+)*@\w+([\.-]?(\.\w{2,3})+)*(\.\w{2,3})+$/;
        if (formParams.email.trim().length && emailExp.test(formParams.email.trim())) {
            await this.props.getExistingUsers({ email: formParams.email });
            if (this.props.userReducer.existingEmailResponse && this.props.userReducer.existingEmailResponse.result) {
                ToastMsg("User Already Exists!", "error");
            }
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

    onReportSelect = selectedReports => {
        const { formParams } = this.state;
        let rank = {
            "Threshold Start": 1,
            "Threshold Middle": 2,
            "Due Next Day": 3,
            "Due Today": 4,
            "Threshold 3 Day End": 5,
            "Threshold 1 Day End": 6
        };
        selectedReports = _.orderBy(selectedReports, item => rank[item.id]);
        this.setState({
            formParams: {
                ...formParams,
                reports: selectedReports
            },
            escalationsList: selectedReports
        });
    };

    onReportRemove = selectedReports => {
        // tempReportsList = selectedReports.map(item => item.id);
        const { formParams } = this.state;
        let tempEscalations = [];
        if (formParams.escalation.length) {
            let tempSelectedReports = selectedReports.length ? selectedReports.map(item => item.id) : [];
            if (tempSelectedReports.length) {
                tempEscalations = formParams.escalation.filter(item => tempSelectedReports.includes(item.id));
            }
        }
        this.setState({
            formParams: {
                ...formParams,
                reports: selectedReports,
                escalation: tempEscalations
            },
            escalationsList: selectedReports
        });
    };

    onEscalationSelect = selectedEscalations => {
        const { formParams } = this.state;
        this.setState({
            formParams: {
                ...formParams,
                escalation: selectedEscalations
            }
        });
    };

    onEscalationRemove = selectedEscalations => {
        const { formParams } = this.state;
        this.setState({
            formParams: {
                ...formParams,
                escalation: selectedEscalations
            }
        });
    };

    render() {
        const {
            formParams,
            showErrorBorder,
            errorParams,
            selectedUser,
            consultancyIdList,
            clientIdList,
            roleIdList,
            userPermissionList,
            escalationsList
        } = this.state;
        let currentUser = this.props.match.params.id || "";
        let userId = localStorage.getItem("user_id");
        let userRole = localStorage.getItem("user_role");

        return (
            <section className="cont-ara act-main">
                <div className="list-area">
                    <ToastContainer />
                    <TopSlider />
                    <ReactTooltip />
                    <div className="lst-bt-nav create">
                        <div className="table table-ara">
                            <div className="list-sec">
                                <div className="nav-ara">
                                    <div className="head">
                                        <h4>{selectedUser ? "Edit" : "Add"} Document </h4>
                                    </div>
                                </div>
                            </div>
                            <form autoComplete="off">
                                <div className="cr-frm">
                                    <div className="col-md-9">
                                        <div className="form-area">
                                            <div className="itm">
                                                <div className="form-group">
                                                    <label className={showErrorBorder && errorParams.name ? "text-red" : ""}>User Name *</label>
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
                                                        placeholder="User Name"
                                                        autocomplete="off"
                                                    />
                                                </div>
                                            </div>
                                            <div className="itm">
                                                <div className="form-group">
                                                    <label className={`form-control-placeholder`}>First Name</label>
                                                    <input
                                                        type="text"
                                                        value={formParams.first_name}
                                                        onChange={e => {
                                                            this.setState({
                                                                formParams: {
                                                                    ...formParams,
                                                                    first_name: e.target.value
                                                                }
                                                            });
                                                        }}
                                                        className="form-control"
                                                        placeholder="First Name"
                                                        autocomplete="off"
                                                    />
                                                </div>
                                            </div>
                                            <div className="itm">
                                                <div className="form-group">
                                                    <label className={`form-control-placeholder`}>Last Name</label>
                                                    <input
                                                        type="text"
                                                        value={formParams.last_name}
                                                        onChange={e => {
                                                            this.setState({
                                                                formParams: {
                                                                    ...formParams,
                                                                    last_name: e.target.value
                                                                }
                                                            });
                                                        }}
                                                        className="form-control"
                                                        placeholder="Last Name"
                                                        autocomplete="off"
                                                    />
                                                </div>
                                            </div>
                                            <div className="itm">
                                                <div className="form-group">
                                                    <label className={`form-control-placeholder`}>Printed Name</label>
                                                    <input
                                                        type="text"
                                                        value={formParams.printed_name}
                                                        onChange={e => {
                                                            this.setState({
                                                                formParams: {
                                                                    ...formParams,
                                                                    printed_name: e.target.value
                                                                }
                                                            });
                                                        }}
                                                        className="form-control"
                                                        placeholder="Printed Name"
                                                        autocomplete="off"
                                                    />
                                                </div>
                                            </div>
                                            <div className="itm">
                                                <div className="form-group">
                                                    <label className={showErrorBorder && errorParams.email ? "text-red" : ""}>Email *</label>
                                                    <input
                                                        type="text"
                                                        value={formParams.email}
                                                        onChange={async e => {
                                                            await this.setState({
                                                                formParams: {
                                                                    ...formParams,
                                                                    email: e.target.value
                                                                }
                                                            });
                                                        }}
                                                        onBlur={() => this.checkEmailExist()}
                                                        autocomplete="off"
                                                        className="form-control"
                                                        placeholder="Email"
                                                    />
                                                </div>
                                            </div>
                                            {currentUser !== userId ? (
                                                <>
                                                    <div className="itm">
                                                        <div className="form-group">
                                                            <label className={showErrorBorder && errorParams.password ? "text-red" : ""}>
                                                                Password *
                                                                <span
                                                                    class="material-icons"
                                                                    data-multiline={true}
                                                                    data-tip={
                                                                        "Password must contain minimum 6 characters , 1 Special character , 1 number & Combination of upper and lower case letters"
                                                                    }
                                                                >
                                                                    info
                                                                </span>
                                                            </label>
                                                            <input
                                                                type="password"
                                                                value={formParams.password}
                                                                autocomplete="new-password"
                                                                onChange={e => {
                                                                    this.setState({
                                                                        formParams: {
                                                                            ...formParams,
                                                                            password: e.target.value
                                                                        }
                                                                    });
                                                                }}
                                                                className="form-control"
                                                                placeholder="Password"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="itm">
                                                        <div className="form-group">
                                                            <label className={showErrorBorder && errorParams.confirmPassword ? "text-red" : ""}>
                                                                Confirm Password *
                                                            </label>
                                                            <input
                                                                type="password"
                                                                value={formParams.password_confirm}
                                                                autocomplete="new-password"
                                                                onChange={e => {
                                                                    this.setState({
                                                                        formParams: {
                                                                            ...formParams,
                                                                            password_confirm: e.target.value
                                                                        }
                                                                    });
                                                                }}
                                                                className="form-control"
                                                                placeholder="Confirm Password"
                                                            />
                                                            {this.state.showErrorBorder && this.state.confirmPasswordErrorMessage ? (
                                                                <div className="text-red">{this.state.confirmPasswordErrorMessage}</div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="itm">
                                                        <div className="form-group">
                                                            <label
                                                                className={`${
                                                                    showErrorBorder && errorParams.consultancy_id ? "text-red " : ""
                                                                }form-control-placeholder`}
                                                            >
                                                                Consultancy *
                                                            </label>
                                                            <div className="custom-selecbox">
                                                                <select
                                                                    className="custom-selecbox form-control"
                                                                    value={formParams.consultancy_id}
                                                                    onChange={e => this.selectConsultancyId(e.target.value)}
                                                                    autocomplete="off"
                                                                >
                                                                    <option value="">Select</option>
                                                                    {consultancyIdList.length &&
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
                                                            <label
                                                                className={`${
                                                                    showErrorBorder && errorParams.role_id ? "text-red " : ""
                                                                }form-control-placeholder`}
                                                            >
                                                                Role *
                                                            </label>
                                                            <div className="custom-selecbox">
                                                                <select
                                                                    className="custom-selecbox form-control"
                                                                    value={formParams.role_id}
                                                                    autocomplete="off"
                                                                    onChange={async e => {
                                                                        await this.setState({
                                                                            formParams: {
                                                                                ...formParams,
                                                                                role_id: e.target.value
                                                                            }
                                                                        });
                                                                        await this.handleSelectRoleName(this.state.formParams.role_id);
                                                                    }}
                                                                >
                                                                    <option value="">Select</option>
                                                                    {roleIdList.length &&
                                                                        roleIdList.map((item, idex) => {
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
                                                    {this.state.role_name === "client_user" ? (
                                                        <div className="itm">
                                                            <div className="form-group">
                                                                <label
                                                                    className={`${
                                                                        showErrorBorder && errorParams.client_id ? "text-red " : ""
                                                                    }form-control-placeholder`}
                                                                >
                                                                    Client *
                                                                </label>
                                                                <div className="custom-selecbox">
                                                                    <select
                                                                        className="form-control custom-selecbox"
                                                                        value={formParams.client_id}
                                                                        onChange={e => {
                                                                            this.setState({
                                                                                formParams: {
                                                                                    ...formParams,
                                                                                    client_id: e.target.value
                                                                                }
                                                                            });
                                                                        }}
                                                                        autocomplete="off"
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
                                                    ) : null}

                                                    <div className="itm">
                                                        <div className="form-group">
                                                            <label className={`form-control-placeholder`}>User Permission</label>
                                                            <div className="custom-selecbox">
                                                                <select
                                                                    className="form-control custom-selecbox"
                                                                    value={formParams.permission_id}
                                                                    onChange={e => {
                                                                        this.setState({
                                                                            formParams: {
                                                                                ...formParams,
                                                                                permission_id: e.target.value
                                                                            }
                                                                        });
                                                                    }}
                                                                    autocomplete="off"
                                                                >
                                                                    <option value="">Select</option>
                                                                    {userPermissionList &&
                                                                        userPermissionList.map((item, idex) => {
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
                                                            <label className={`form-control-placeholder`}>Reports</label>
                                                            <Multiselect
                                                                options={reportsList}
                                                                selectedValues={formParams.reports}
                                                                onSelect={this.onReportSelect}
                                                                onRemove={this.onReportRemove}
                                                                placeholder={"Select Reports"}
                                                                displayValue="name"
                                                                showCheckbox={true}
                                                                showArrow={true}
                                                                closeOnSelect={false}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="itm">
                                                        <div className="form-group">
                                                            <label className={`form-control-placeholder`}>Escalations</label>
                                                            <Multiselect
                                                                options={escalationsList}
                                                                selectedValues={formParams.escalation}
                                                                onSelect={this.onEscalationSelect}
                                                                onRemove={this.onEscalationRemove}
                                                                placeholder={"Select Escalations"}
                                                                displayValue="name"
                                                                showCheckbox={true}
                                                                showArrow={true}
                                                                closeOnSelect={false}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="itm">
                                                        <div className="form-group">
                                                            <label className={`form-control-placeholder`}>Title</label>
                                                            <input
                                                                type="text"
                                                                value={formParams.title}
                                                                onChange={e => {
                                                                    this.setState({
                                                                        formParams: {
                                                                            ...formParams,
                                                                            title: e.target.value
                                                                        }
                                                                    });
                                                                }}
                                                                autocomplete="off"
                                                                className="form-control"
                                                                placeholder="Title"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="itm">
                                                        <div className="form-group">
                                                            <label className={`form-control-placeholder`}>Department</label>
                                                            <input
                                                                type="text"
                                                                value={formParams.department}
                                                                onChange={e => {
                                                                    this.setState({
                                                                        formParams: {
                                                                            ...formParams,
                                                                            department: e.target.value
                                                                        }
                                                                    });
                                                                }}
                                                                autocomplete="off"
                                                                className="form-control"
                                                                placeholder="Department"
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : null}
                                            <div className="itm">
                                                <div className="form-group">
                                                    <label className={`form-control-placeholder`}>Work Phone</label>
                                                    <NumberFormat
                                                        autoComplete="nope"
                                                        value={formParams.work_phone}
                                                        // thousandSeparator={true}
                                                        decimalScale={0}
                                                        className="form-control"
                                                        placeholder="Work Phone"
                                                        format="(###) ###-####"
                                                        onValueChange={values => {
                                                            const { value } = values;
                                                            this.setState({
                                                                formParams: {
                                                                    ...formParams,
                                                                    work_phone: value
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="itm">
                                                <div className="form-group">
                                                    <label className={`form-control-placeholder`}>Cell Phone</label>
                                                    <NumberFormat
                                                        autoComplete="nope"
                                                        value={formParams.cell_phone}
                                                        // thousandSeparator={true}
                                                        decimalScale={0}
                                                        className="form-control"
                                                        placeholder="Cell Phone"
                                                        format="(###) ###-####"
                                                        onValueChange={values => {
                                                            const { value } = values;
                                                            this.setState({
                                                                formParams: {
                                                                    ...formParams,
                                                                    cell_phone: value
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {currentUser !== userId ? (
                                                <>
                                                    <div className="itm">
                                                        <div className="form-group">
                                                            <label className={`form-control-placeholder`}>Building Name</label>
                                                            <input
                                                                type="text"
                                                                autocomplete="off"
                                                                value={formParams.building_name}
                                                                onChange={e => {
                                                                    this.setState({
                                                                        formParams: {
                                                                            ...formParams,
                                                                            building_name: e.target.value
                                                                        }
                                                                    });
                                                                }}
                                                                className="form-control"
                                                                placeholder="Building Name"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="itm">
                                                        <div className="form-group">
                                                            <label className={`form-control-placeholder`}>Room Number</label>
                                                            <input
                                                                type="text"
                                                                value={formParams.room_number}
                                                                onChange={e => {
                                                                    this.setState({
                                                                        formParams: {
                                                                            ...formParams,
                                                                            room_number: e.target.value
                                                                        }
                                                                    });
                                                                }}
                                                                className="form-control"
                                                                placeholder="Room Number"
                                                                autocomplete="off"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="itm">
                                                        <div className="form-group">
                                                            <label className={`form-control-placeholder`}>Room Name</label>
                                                            <input
                                                                type="text"
                                                                value={formParams.room_name}
                                                                onChange={e => {
                                                                    this.setState({
                                                                        formParams: {
                                                                            ...formParams,
                                                                            room_name: e.target.value
                                                                        }
                                                                    });
                                                                }}
                                                                className="form-control"
                                                                placeholder="Room Name"
                                                                autocomplete="off"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="itm">
                                                        <div className="form-group">
                                                            <label className={`form-control-placeholder`}>City</label>
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
                                                                placeholder="City"
                                                                autocomplete="off"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="itm">
                                                        <div className="form-group">
                                                            <label className={`form-control-placeholder`}>Location</label>
                                                            <input
                                                                type="text"
                                                                value={formParams.location}
                                                                onChange={e => {
                                                                    this.setState({
                                                                        formParams: {
                                                                            ...formParams,
                                                                            location: e.target.value
                                                                        }
                                                                    });
                                                                }}
                                                                className="form-control"
                                                                placeholder="Location"
                                                                autocomplete="off"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="itm">
                                                        <div className="form-group">
                                                            <label className={`form-control-placeholder`}>State</label>
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
                                                                placeholder="State"
                                                                autocomplete="off"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="itm">
                                                        <div className="form-group">
                                                            <label className={`form-control-placeholder`}>Zip Code</label>
                                                            <NumberFormat
                                                                autoComplete="nope"
                                                                value={formParams.zip_code}
                                                                // thousandSeparator={true}
                                                                decimalScale={0}
                                                                className="form-control"
                                                                placeholder="Zip Code"
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
                                                            <label className={`form-control-placeholder`}>Address</label>
                                                            <input
                                                                type="text"
                                                                value={formParams.address}
                                                                onChange={e => {
                                                                    this.setState({
                                                                        formParams: {
                                                                            ...formParams,
                                                                            address: e.target.value
                                                                        }
                                                                    });
                                                                }}
                                                                className="form-control"
                                                                placeholder="Address"
                                                                autocomplete="off"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="itm">
                                                        <div className="form-group">
                                                            <label className={`form-control-placeholder`}>Emergency Contact Number</label>
                                                            <NumberFormat
                                                                autoComplete="nope"
                                                                value={formParams.emergency_contact_no}
                                                                // thousandSeparator={true}
                                                                decimalScale={0}
                                                                className="form-control"
                                                                placeholder="Emergency Contact Number"
                                                                format="(###) ###-####"
                                                                onValueChange={values => {
                                                                    const { value } = values;
                                                                    this.setState({
                                                                        formParams: {
                                                                            ...formParams,
                                                                            emergency_contact_no: value
                                                                        }
                                                                    });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="itm">
                                                        <div className="form-group">
                                                            <label className={`form-control-placeholder`}>Emergency Contact Name</label>
                                                            <input
                                                                type="text"
                                                                value={formParams.emergency_contact_name}
                                                                onChange={e => {
                                                                    this.setState({
                                                                        formParams: {
                                                                            ...formParams,
                                                                            emergency_contact_name: e.target.value
                                                                        }
                                                                    });
                                                                }}
                                                                className="form-control"
                                                                placeholder="Emergency Contact Name"
                                                                autocomplete="off"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="itm">
                                                        <label>View Only</label>
                                                        <div className="chek">
                                                            <div className="chekbox-sec">
                                                                <label className="container">
                                                                    Yes
                                                                    <input
                                                                        type="radio"
                                                                        name="view_only"
                                                                        value="yes"
                                                                        onChange={async e => {
                                                                            await this.setState({
                                                                                formParams: {
                                                                                    ...formParams,
                                                                                    view_only: e.target.value
                                                                                }
                                                                            });
                                                                        }}
                                                                        checked={formParams.view_only === "yes"}
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
                                                                                    view_only: e.target.value
                                                                                }
                                                                            });
                                                                        }}
                                                                        checked={formParams.view_only === "no"}
                                                                    />
                                                                    <span className="checkmark"></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : null}
                                            <div className="itm">
                                                <div className="form-group">
                                                    <label className={`form-control-placeholder`}>Notes</label>
                                                    <input
                                                        type="text"
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
                                                        autocomplete="off"
                                                    />
                                                </div>
                                            </div>
                                            {/* <div className="itm">
                                            <div className="form-group">
                                                <label>Is Active</label>
                                                <div className="custom-selecbox">
                                                    <select
                                                        className="custom-selecbox form-control"
                                                        value={formParams.is_active}
                                                        onChange={e =>
                                                            this.setState({
                                                                formParams: {
                                                                    ...formParams,
                                                                    is_active: e.target.value
                                                                }
                                                            })
                                                        }
                                                    >
                                                        <option value="yes">YES</option>
                                                        <option value="no">NO</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="itm">
                                            <div className="form-group">
                                                <label>Is Blocked</label>
                                                <div className="custom-selecbox">
                                                    <select
                                                        className="custom-selecbox form-control"
                                                        value={formParams.is_blocked}
                                                        onChange={e =>
                                                            this.setState({
                                                                formParams: {
                                                                    ...formParams,
                                                                    is_blocked: e.target.value
                                                                }
                                                            })
                                                        }
                                                    >
                                                        <option value="yes">YES</option>
                                                        <option value="no">NO</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div> */}
                                        </div>
                                    </div>
                                    <div className="col-md-3 pl-0">
                                        <div className="file-upload">
                                            {formParams.image && formParams.image.url === null ? (
                                                <img src="/images/add-img.svg" alt="" />
                                            ) : formParams.image ? (
                                                <>
                                                    <img
                                                        src={formParams.image.url ? formParams.image.url : URL.createObjectURL(formParams.image)}
                                                        alt=""
                                                    />
                                                </>
                                            ) : (
                                                <img src="/images/add-img.svg" alt="" />
                                            )}

                                            <div className="btn-upload">
                                                <input type="file" id="attachmentFiles" name="profilePic" onChange={this.handleAddAttachment} />
                                                <img src="/images/add-btn.svg" alt="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="btn-sec">
                                    <button type="button" className="btn btn-cncl-back mr-2" onClick={() => this.cancelForm()}>
                                        <i className="material-icons tic"> close</i>Cancel
                                    </button>
                                    {selectedUser ? (
                                        <button type="button" className="btn btn-create" onClick={() => this.updateUser()}>
                                            <i className="material-icons tic"> check</i> Update User
                                        </button>
                                    ) : (
                                        <button type="button" className="btn btn-create" onClick={() => this.addUser()}>
                                            <i className="material-icons tic"> check</i> Add User
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {this.renderConfirmationModal()}
            </section>
        );
    }
}

export default withRouter(connect(mapStateToProps, { ...actions, ...commonActions })(editConsultancy));
