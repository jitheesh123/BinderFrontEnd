/* eslint-disable jsx-a11y/no-redundant-roles */
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import { ToastContainer } from "react-toastify";

import history from "../../../config/history";
import { checkPermission } from "../../../config/utils";
import TopSlider from "../../common/components/TopSlider";
import actions from "./actions";
import ToastMsg from "../../common/ToastMessage";
import commonActions from "../actions";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";

class userPermissionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consultancyIdList: [],
            templateList: [],
            clientIdList: [],
            formParams: {
                forms: null,
                logs: null,
                menu: null,
                assign: null,
                event: null,
                name: null,
                display_order: null,
                consultancy_id: null,
                template: false
            },
            errorParams: {
                name: false,
                consultancy_id: false
            },
            isEdit: false,
            showErrorBorder: false,
            selectedUserPermission: props.match.params.id || null,
            activeTab: "menu",
            activeTabItems: {},
            activeTabHeaders: [],
            selectedTemplate: null,
            assigned_users: [],
            available_users: [],
            user_ids: [],
            initialData: {
                forms: null,
                logs: null,
                menu: null,
                assign: null,
                event: null,
                name: null,
                display_order: null,
                consultancy_id: null,
                template: false
            },
            showConfirmModal: false
        };
    }

    componentDidMount = async () => {
        const { selectedUserPermission } = this.state;
        await this.props.getConsultancyDropdown();
        await this.props.getTemplateInitialValues();
        await this.props.getTemplateDropdown();
        await this.setState({
            consultancyIdList: this.props.settingsCommonReducer.consultancyDropdownData.data,
            templateList: this.props.settingsCommonReducer.getTemplateDropdownResponse.data,
            initialValues:
                this.props.settingsCommonReducer.getTemplateInitialValuesResponse.data &&
                this.props.settingsCommonReducer.getTemplateInitialValuesResponse.data.permissions,
            formParams: {
                ...(this.props.settingsCommonReducer.getTemplateInitialValuesResponse.data &&
                    this.props.settingsCommonReducer.getTemplateInitialValuesResponse.data.permissions),
                name: null,
                consultancy_id: null,
                display_order: null,
                template: false
            }
        });
        this.setActiveTab("menu");
        if (selectedUserPermission) {
            await this.props.getUserPermissionsById(selectedUserPermission);
            const {
                userPermissionReducer: {
                    getUserPermissionsById: {
                        permission: { assign, consultancy, forms, id, logs, menu, name, template, event, display_order, template_selected },
                        success
                    }
                }
            } = this.props;
            if (success) {
                await this.setState({
                    formParams: {
                        assign,
                        consultancy_id: consultancy.id,
                        forms,
                        id,
                        logs,
                        menu,
                        event,
                        name,
                        display_order,
                        template
                    },
                    selectedTemplate: template_selected.id,
                    initialData: {
                        assign,
                        consultancy_id: consultancy.id,
                        forms,
                        id,
                        logs,
                        menu,
                        event,
                        name,
                        display_order,
                        template
                    },
                    isEdit: true
                });
                this.getUserListForPermissions(consultancy.id);
            }
        }
    };

    getUserListForPermissions = async consultancy_id => {
        const { selectedUserPermission: id } = this.state;
        await this.props.getUserListForPermissions({ id, consultancy_id });
        const {
            userPermissionReducer: {
                getUserListForPermissionsResponse: { assigned_users = [], available_users = [] }
            }
        } = this.props;
        let tempAssignedUserIds = assigned_users && assigned_users.map(item => item.id);
        await this.setState({
            user_ids: tempAssignedUserIds,
            assigned_users,
            available_users
        });
    };

    getClientDropdown = async consultancy_id => {
        await this.props.getClientDropdown({ consultancy_id });
        await this.setState({
            clientIdList: this.props.settingsCommonReducer.clientDropdownData.data
        });
    };

    selectConsultancy = async value => {
        const { formParams } = this.state;
        await this.setState({
            formParams: {
                ...formParams,
                consultancy_id: value
            }
        });
        this.getUserListForPermissions(value);
    };

    updateAssignedList = async (type, id) => {
        const { assigned_users, available_users } = this.state;
        let itemObj = {};
        let tempAssignedUsers = assigned_users;
        let tempAvailableUsers = available_users;
        let tempUserIds = [];

        if (id === "all") {
            if (type === "add") {
                tempAvailableUsers.map(item => tempAssignedUsers.push(item));
                tempAvailableUsers = [];
            } else {
                tempAssignedUsers.map(item => tempAvailableUsers.push(item));
                tempAssignedUsers = [];
            }
        } else {
            if (type === "add") {
                itemObj = available_users.find(item => item.id === id);
                tempAssignedUsers.push(itemObj);
                tempAvailableUsers = tempAvailableUsers.filter(item => item.id !== id);
            } else {
                itemObj = assigned_users.find(item => item.id === id);
                tempAvailableUsers.push(itemObj);
                tempAssignedUsers = tempAssignedUsers.filter(item => item.id !== id);
            }
        }
        tempAssignedUsers = _.uniqBy(tempAssignedUsers, "id");
        tempAvailableUsers = _.uniqBy(tempAvailableUsers, "id");
        tempUserIds = tempAssignedUsers.map(item => item.id);
        await this.setState({
            assigned_users: tempAssignedUsers,
            available_users: tempAvailableUsers,
            user_ids: tempUserIds
        });
    };

    selectTemplate = async value => {
        const { formParams } = this.state;
        if (value) {
            await this.props.getTemplatesById(value);
            const {
                userPermissionReducer: {
                    getTemplatesById: {
                        permission: { assign, forms, logs, menu, event },
                        success
                    }
                }
            } = this.props;
            if (success) {
                await this.setState({
                    formParams: {
                        ...formParams,
                        assign,
                        forms,
                        logs,
                        menu,
                        event,
                        temp_id: value
                    },
                    selectedTemplate: value
                });
            }
        } else {
            const {
                settingsCommonReducer: {
                    getTemplateInitialValuesResponse: {
                        data: {
                            permissions: { assign, forms, logs, menu, event }
                        }
                    }
                }
            } = this.props;
            await this.setState({
                formParams: {
                    ...formParams,
                    assign,
                    forms,
                    logs,
                    menu,
                    event,
                    temp_id: value
                },
                selectedTemplate: value
            });
        }
    };

    validate = () => {
        const { formParams } = this.state;
        let errorParams = {
            name: false,
            consultancy_id: false
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
        this.setState({
            showErrorBorder,
            errorParams
        });
        if (showErrorBorder) return false;
        return true;
    };

    updateUserPermission = async () => {
        const { formParams, user_ids } = this.state;
        if (this.validate()) {
            await this.props.editUserPermissionsById({ permissions: formParams, user_ids }, this.props.match.params.id);
            ToastMsg(
                this.props.userPermissionReducer.editUserPermissionsById.message || this.props.userPermissionReducer.editUserPermissionsById.error,
                "info"
            );
            if (this.props.userPermissionReducer.editUserPermissionsById.success) {
                history.push("/userPermissions");
            }
        }
    };

    addUserPermission = async () => {
        const { formParams, user_ids } = this.state;
        if (this.validate()) {
            await this.props.addUserPermissions({ permissions: formParams, user_ids });
            ToastMsg(
                this.props.userPermissionReducer.addUserPermissionsData.message || this.props.userPermissionReducer.addUserPermissionsData.error,
                "info"
            );
            if (this.props.userPermissionReducer.addUserPermissionsData.success) {
                history.push("/userPermissions");
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
                history.push(`/userPermission/userPermissioninfo/${this.props.match.params.id}/basicdetails`);
            } else {
                history.push("/userPermissions");
            }
        } else if (_.isEqual(this.state.initialData, this.state.formParams)) {
            if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
                history.push(`/userPermission/userPermissioninfo/${this.props.match.params.id}/basicdetails`);
            } else {
                history.push("/userPermissions");
            }
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };

    setActiveTab = async keyItem => {
        const { formParams } = this.state;
        let activeTabItems = formParams[keyItem];
        let activeTabHeaders = [];
        activeTabHeaders = activeTabItems && Object.keys(activeTabItems[Object.keys(activeTabItems)[0]]);
        await this.setState({ activeTab: keyItem, activeTabItems, activeTabHeaders });
    };

    updateFormValues = async (activeTab, item, subItem, value) => {
        const { formParams } = this.state;
        let tempFormParams = formParams;
        if (subItem) {
            if (activeTab === "menu") {
                if (tempFormParams[activeTab][item][subItem].view !== null) tempFormParams[activeTab][item][subItem].view = value;
                if (value) {
                    if (tempFormParams[activeTab][item].view !== null) tempFormParams[activeTab][item].view = value;
                } else {
                    let tempVal = false;
                    for (const submenu in tempFormParams[activeTab][item]) {
                        if (submenu !== "view" && tempFormParams[activeTab][item][submenu].view !== null) {
                            if (tempFormParams[activeTab][item][submenu].view === true) tempVal = true;
                            tempFormParams[activeTab][item].view = tempVal;
                        }
                    }
                }
            } else {
                tempFormParams[activeTab][item][subItem] = value;
            }
        } else {
            if (activeTab === "menu") {
                if (tempFormParams[activeTab][item].view !== null) tempFormParams[activeTab][item].view = value;
                if (Object.keys(tempFormParams[activeTab][item]).length > 1)
                    for (const submenu in tempFormParams[activeTab][item]) {
                        if (submenu !== "view" && tempFormParams[activeTab][item][submenu].view !== null)
                            tempFormParams[activeTab][item][submenu].view = value;
                    }
            } else {
                tempFormParams[activeTab][item] = value;
            }
        }
        await this.setState({
            formParams: tempFormParams
        });
    };

    areAllValuesChecked = column => {
        const { formParams, activeTab } = this.state;
        for (const item in formParams[activeTab]) {
            if (activeTab === "menu") {
                if (formParams[activeTab][item].view !== true && formParams[activeTab][item].view !== null) return false;
                if (Object.keys(formParams[activeTab][item]).length > 1)
                    for (const submenu in formParams[activeTab][item]) {
                        if (submenu !== "view" && formParams[activeTab][item][submenu].view !== null && !formParams[activeTab][item][submenu].view)
                            return false;
                    }
            } else {
                if (formParams[activeTab][item][column] !== true && formParams[activeTab][item][column] !== null) return false;
            }
        }
        return true;
    };

    selectAllValuesInColumn = async column => {
        const { formParams, activeTab } = this.state;
        let tempFormParams = formParams;
        let setVal = !this.areAllValuesChecked(column);
        for (const item in formParams[activeTab]) {
            if (activeTab === "menu") {
                if (tempFormParams[activeTab][item].view !== null) tempFormParams[activeTab][item].view = setVal;
                if (Object.keys(tempFormParams[activeTab][item]).length > 1)
                    for (const submenu in tempFormParams[activeTab][item]) {
                        if (submenu !== "view" && tempFormParams[activeTab][item][submenu].view !== null)
                            tempFormParams[activeTab][item][submenu].view = setVal;
                    }
            } else {
                if (tempFormParams[activeTab][item][column] !== null) tempFormParams[activeTab][item][column] = setVal;
            }
        }
        await this.setState({
            formParams: tempFormParams
        });
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

    render() {
        const {
            formParams,
            showErrorBorder,
            errorParams,
            selectedUserPermission,
            consultancyIdList,
            templateList,
            initialValues,
            activeTab,
            activeTabItems,
            activeTabHeaders,
            selectedTemplate,
            assigned_users,
            available_users
        } = this.state;
        let hasEdit = checkPermission("forms", "user_permissions", "edit");
        let hasCreate = checkPermission("forms", "user_permissions", "create");

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
                                        <h4>{selectedUserPermission ? "Edit" : "Add"} User Permission </h4>
                                    </div>
                                </div>
                            </div>
                            <div className="activity form-area usr-mangnt">
                                <div className="frm-area">
                                    <div className="col">
                                        <div className={`${showErrorBorder && errorParams.name ? "error-border" : ""} form-group`}>
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
                                                className={`form-control`}
                                                placeholder="User Permission Name *"
                                                autocomplete="off"
                                            />
                                        </div>
                                    </div>
                                    <div className="col ">
                                        <div className="form-group custom-selecbox">
                                            <select
                                                className="custom-selecbox form-control"
                                                value={selectedTemplate}
                                                onChange={e => this.selectTemplate(e.target.value)}
                                                autocomplete="off"
                                                placeholder="Select Template"
                                            >
                                                <option value="">Select Template</option>
                                                {templateList.length &&
                                                    templateList.map((item, idex) => {
                                                        return (
                                                            <option key={idex} value={item.id}>
                                                                {item.name}
                                                            </option>
                                                        );
                                                    })}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col ">
                                        <div
                                            className={`${
                                                showErrorBorder && errorParams.consultancy_id ? "error-border" : ""
                                            } form-group custom-selecbox`}
                                        >
                                            <select
                                                className="custom-selecbox form-control"
                                                value={formParams.consultancy_id}
                                                onChange={e => this.selectConsultancy(e.target.value)}
                                                autocomplete="off"
                                                placeholder="Select Consultancy *"
                                            >
                                                <option value="">Select Consultancy *</option>
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
                                    <div className="col">
                                        <div className={`form-group`}>
                                            <input
                                                type="number"
                                                min="0"
                                                className="form-control"
                                                placeholder="Display Order"
                                                value={formParams.display_order}
                                                onChange={e =>
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            display_order: e.target.value
                                                        }
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    {/* <div className="col">
                                        <div className="form-group">
                                            <label className="container-check">
                                                Is Template
                                                <input type="checkbox" name="isTemplate" checked={formParams.template} />
                                                <span
                                                    className="checkmark"
                                                    onClick={e => {
                                                        this.setState({
                                                            formParams: {
                                                                ...formParams,
                                                                template: !this.state.formParams.template
                                                            }
                                                        });
                                                    }}
                                                ></span>
                                            </label>
                                        </div> 
                                    </div>*/}
                                    <div className="col ">
                                        <div className="form-group">
                                            <button
                                                className="btn btn-acco"
                                                data-toggle="collapse"
                                                href="#userList"
                                                role="button"
                                                aria-expanded="false"
                                                aria-controls="userList"
                                            >
                                                Users
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="acco-ara">
                                    <div className="collapse" id="userList">
                                        <div className="card card-body">
                                            <div className="outer-act-build list-sec">
                                                <div className="build-tem1">
                                                    <h4>Avilable Users</h4>
                                                    <div className="outer-avl-bind">
                                                        <div className="table-section">
                                                            <table className="table table-bordered file-system-table">
                                                                <thead>
                                                                    <tr>
                                                                        <th className="img-sq-box">
                                                                            <span
                                                                                className="material-icons icon-arw"
                                                                                onClick={() => this.updateAssignedList("add", "all")}
                                                                            >
                                                                                height
                                                                            </span>
                                                                        </th>
                                                                        <th className="sel-all">Assign All</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {available_users && available_users.length ? (
                                                                        available_users.map((item, i) => (
                                                                            <tr key={i}>
                                                                                <td className="img-sq-box">
                                                                                    <span
                                                                                        className="material-icons icon-arw"
                                                                                        onClick={() => this.updateAssignedList("add", item.id)}
                                                                                    >
                                                                                        height
                                                                                    </span>
                                                                                </td>
                                                                                <td>{item.name}</td>
                                                                            </tr>
                                                                        ))
                                                                    ) : (
                                                                        <tr>
                                                                            <td colSpan="2" className="text-center">
                                                                                No Records Found !!
                                                                            </td>
                                                                        </tr>
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="build-tem2">
                                                    <h4>Assigned Users</h4>
                                                    <div className="outer-avl-bind">
                                                        <div className="table-section">
                                                            <table className="table table-bordered file-system-table">
                                                                <thead>
                                                                    <tr>
                                                                        <th className="img-sq-box">
                                                                            <span
                                                                                className="material-icons icon-arw"
                                                                                onClick={() => this.updateAssignedList("remove", "all")}
                                                                            >
                                                                                height
                                                                            </span>
                                                                        </th>
                                                                        <th className="sel-all">Unassign All</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {assigned_users && assigned_users.length ? (
                                                                        assigned_users.map((item, i) => (
                                                                            <tr key={i}>
                                                                                <td className="img-sq-box">
                                                                                    <span
                                                                                        className="material-icons icon-arw"
                                                                                        onClick={() => this.updateAssignedList("remove", item.id)}
                                                                                    >
                                                                                        height
                                                                                    </span>
                                                                                </td>
                                                                                <td>{item.name}</td>
                                                                            </tr>
                                                                        ))
                                                                    ) : (
                                                                        <tr>
                                                                            <td colSpan="2" className="text-center">
                                                                                No Records Found !!
                                                                            </td>
                                                                        </tr>
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="min-nav">
                                    <ul>
                                        {initialValues &&
                                            Object.keys(initialValues).map(keyItem => (
                                                <li className={`${activeTab === keyItem ? "active" : ""}`} onClick={() => this.setActiveTab(keyItem)}>
                                                    {keyItem}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                                <div className="table-section table-scroll">
                                    <table className="table table-common table-min-height mt-0 tbl-area">
                                        <thead>
                                            <tr>
                                                <th className=" cursor-pointer">Title </th>
                                                {activeTabHeaders && activeTabHeaders.length
                                                    ? activeTabHeaders.map(item => (
                                                          <th className=" cursor-pointer">
                                                              <label className="container-check">
                                                                  {item}
                                                                  <input type="checkbox" checked={this.areAllValuesChecked(item)} />
                                                                  <span
                                                                      className="checkmark"
                                                                      onClick={() => this.selectAllValuesInColumn(item)}
                                                                  ></span>
                                                              </label>
                                                          </th>
                                                      ))
                                                    : null}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activeTabItems
                                                ? Object.keys(activeTabItems).map(item =>
                                                      activeTab === "menu" ? (
                                                          <>
                                                              <tr className="table-row">
                                                                  <td>{item}</td>
                                                                  <td>
                                                                      <label
                                                                          className={`container-check ${
                                                                              formParams[activeTab][item].view === null ? "disabled" : ""
                                                                          }`}
                                                                      >
                                                                          <input
                                                                              type="checkbox"
                                                                              checked={
                                                                                  formParams[activeTab] &&
                                                                                  formParams[activeTab][item].view !== null &&
                                                                                  formParams[activeTab][item].view
                                                                              }
                                                                              disabled={formParams[activeTab][item].view === null ? true : false}
                                                                              onClick={() =>
                                                                                  this.updateFormValues(
                                                                                      activeTab,
                                                                                      item,
                                                                                      null,
                                                                                      !formParams[activeTab][item].view
                                                                                  )
                                                                              }
                                                                          />
                                                                          <span className={`checkmark`}></span>
                                                                      </label>
                                                                  </td>
                                                              </tr>
                                                              {Object.keys(formParams[activeTab][item]).length > 1
                                                                  ? Object.keys(formParams[activeTab][item]).map(submenu =>
                                                                        submenu !== "view" ? (
                                                                            <tr className="table-row">
                                                                                <td className="template-form-submenu">&nbsp;&nbsp;{submenu}</td>
                                                                                <td className="template-form-submenu">
                                                                                    <label
                                                                                        className={`container-check ${
                                                                                            formParams[activeTab][item][submenu].view === null
                                                                                                ? "disabled"
                                                                                                : ""
                                                                                        }`}
                                                                                    >
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={
                                                                                                formParams[activeTab] &&
                                                                                                formParams[activeTab][item][submenu].view !== null &&
                                                                                                formParams[activeTab][item][submenu].view
                                                                                            }
                                                                                            disabled={
                                                                                                formParams[activeTab][item][submenu].view === null
                                                                                                    ? true
                                                                                                    : false
                                                                                            }
                                                                                            onClick={() =>
                                                                                                this.updateFormValues(
                                                                                                    activeTab,
                                                                                                    item,
                                                                                                    submenu,
                                                                                                    !formParams[activeTab][item][submenu].view
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                        <span className={`checkmark`}></span>
                                                                                    </label>
                                                                                </td>
                                                                            </tr>
                                                                        ) : null
                                                                    )
                                                                  : null}
                                                          </>
                                                      ) : (
                                                          <tr className="table-row">
                                                              <td>{item}</td>
                                                              {Object.keys(activeTabItems[item]).map((subItem, i) => (
                                                                  <td>
                                                                      <label
                                                                          className={`container-check ${
                                                                              formParams[activeTab][item][subItem] === null ? "disabled" : ""
                                                                          }`}
                                                                      >
                                                                          <input
                                                                              type="checkbox"
                                                                              checked={
                                                                                  formParams[activeTab][item][subItem] !== null &&
                                                                                  formParams[activeTab][item][subItem]
                                                                              }
                                                                              disabled={formParams[activeTab][item][subItem] === null ? true : false}
                                                                              onClick={() =>
                                                                                  this.updateFormValues(
                                                                                      activeTab,
                                                                                      item,
                                                                                      subItem,
                                                                                      !formParams[activeTab][item][subItem]
                                                                                  )
                                                                              }
                                                                          />
                                                                          <span className={`checkmark`}></span>
                                                                      </label>
                                                                  </td>
                                                              ))}
                                                          </tr>
                                                      )
                                                  )
                                                : null}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="btn-sec">
                                <button className="btn btn-cncl-back mr-2" onClick={() => this.cancelForm()}>
                                    <i className="material-icons tic"> close</i>Cancel
                                </button>
                                {selectedUserPermission ? (
                                    hasEdit ? (
                                        <button className="btn btn-create" onClick={() => this.updateUserPermission()}>
                                            <i className="material-icons tic"> check</i> Update UserPermission
                                        </button>
                                    ) : null
                                ) : hasCreate ? (
                                    <button className="btn btn-create" onClick={() => this.addUserPermission()}>
                                        <i className="material-icons tic"> check</i> Add User Permission
                                    </button>
                                ) : null}
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
    const { userPermissionReducer, settingsCommonReducer } = state;
    return { userPermissionReducer, settingsCommonReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions, ...commonActions })(userPermissionForm));
