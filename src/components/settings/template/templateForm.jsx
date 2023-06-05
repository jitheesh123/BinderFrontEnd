import React, { Component } from "react";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import { withRouter } from "react-router-dom";
import _ from "lodash";

import history from "../../../config/history";
import { checkPermission } from "../../../config/utils";
import TopSlider from "../../common/components/TopSlider";
import actions from "./actions";
import ToastMsg from "../../common/ToastMessage";
import commonActions from "../actions";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";

class templateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            templateList: [],
            clientIdList: [],
            initialValues: {},
            formParams: {
                name: null,
                display_order: null,
                logs: null,
                forms: null,
                menu: null,
                assign: null,
                event: null,
                template: true
            },
            errorParams: {
                name: false,
                consultancy_id: false
            },
            isEdit: false,
            showErrorBorder: false,
            selectedTemplate: props.match.params.id,
            activeTab: "menu",
            activeTabItems: {},
            activeTabHeaders: []
        };
    }

    componentDidMount = async () => {
        const { selectedTemplate } = this.state;
        await this.props.getTemplateInitialValues();
        await this.props.getTemplateDropdown();
        await this.setState({
            templateList: this.props.settingsCommonReducer.getTemplateDropdownResponse.data,
            initialValues:
                this.props.settingsCommonReducer.getTemplateInitialValuesResponse.data &&
                this.props.settingsCommonReducer.getTemplateInitialValuesResponse.data.permissions,
            formParams: {
                ...(this.props.settingsCommonReducer.getTemplateInitialValuesResponse.data &&
                    this.props.settingsCommonReducer.getTemplateInitialValuesResponse.data.permissions),
                name: null,
                display_order: null,
                template: true
            }
        });
        this.setActiveTab("menu");
        if (selectedTemplate) {
            await this.props.getTemplatesById(selectedTemplate);
            const {
                templateReducer: {
                    getTemplatesById: {
                        permission: { assign, forms, event, logs, menu, name, template, display_order },
                        success
                    }
                }
            } = this.props;
            if (success) {
                await this.setState({
                    formParams: {
                        assign,
                        forms,
                        logs,
                        menu,
                        name,
                        event,
                        template,
                        display_order
                    },
                    isEdit: true
                });
            }
        }
    };

    validate = () => {
        const { formParams } = this.state;
        let errorParams = {
            name: false
        };
        let showErrorBorder = false;
        if (!formParams.name || !formParams.name.trim().length) {
            errorParams.name = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });
        if (showErrorBorder) return false;
        return true;
    };

    updateTemplate = async () => {
        const { formParams } = this.state;
        if (this.validate()) {
            await this.props.editTemplatesById({ permissions: formParams }, this.props.match.params.id);
            ToastMsg(this.props.templateReducer.editTemplatesById.message || this.props.templateReducer.editTemplatesById.error, "info");
            if (this.props.templateReducer.editTemplatesById.success) {
                history.push("/templates");
            }
        }
    };

    addTemplate = async () => {
        const { formParams } = this.state;
        if (this.validate()) {
            await this.props.addTemplates({ permissions: formParams });
            ToastMsg(this.props.templateReducer.addTemplatesData.message || this.props.templateReducer.addTemplatesData.error, "info");
            if (this.props.templateReducer.addTemplatesData.success) {
                history.push("/templates");
            }
        }
    };

    cancelForm = () => {
        if (this.props.location && this.props.location.state && this.props.location.state.fromInfo) {
            history.push(`/template/templateinfo/${this.props.match.params.id}/basicdetails`);
        } else {
            history.push("/templates");
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

    render() {
        const { formParams, showErrorBorder, errorParams, selectedTemplate, initialValues, activeTab, activeTabItems, activeTabHeaders } = this.state;

        let hasEdit = checkPermission("forms", "templates", "edit");
        let hasCreate = checkPermission("forms", "templates", "create");

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
                                        <h4>{selectedTemplate ? "Edit" : "Add"} Template </h4>
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
                                                placeholder="Template Name *"
                                                autocomplete="off"
                                            />
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
                                    <div className="col">
                                        <div className="form-group">
                                            <label
                                                className="container-check"
                                                onClick={e => {
                                                    this.setState({
                                                        formParams: {
                                                            ...formParams,
                                                            template: !this.state.formParams.template
                                                        }
                                                    });
                                                }}
                                            >
                                                Is Template
                                                <input type="checkbox" name="isTemplate" checked={formParams.template} />
                                                <span className="checkmark"></span>
                                            </label>
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
                                {selectedTemplate ? (
                                    hasEdit ? (
                                        <button className="btn btn-create" onClick={() => this.updateTemplate()}>
                                            <i className="material-icons tic"> check</i> Update Template
                                        </button>
                                    ) : null
                                ) : hasCreate ? (
                                    <button className="btn btn-create" onClick={() => this.addTemplate()}>
                                        <i className="material-icons tic"> check</i> Add Template
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

const mapStateToProps = state => {
    const { templateReducer, settingsCommonReducer } = state;
    return { templateReducer, settingsCommonReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions, ...commonActions })(templateForm));
