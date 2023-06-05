/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ReactTooltip from "react-tooltip";

import history from "../../../config/history";
import { WDS_SOCKET_PATH } from "../../../config/contstants";
import { toggleTooltip } from "../../../config/utils";
import ToastMsg from "../../common/ToastMessage";
import commonActions from "../actions";
import Portal from "./Portal";
import PasswoedConfirmationModal from "./PasswoedConfirmationModal";
import AppliedMasterFiltersModal from "./AppliedMasterFiltersModal";
import Header from "./Header";
import SideNav from "./SideNav";
import PasswordResetConfirmationModal from "./PasswordResetConfirmationModal";

let defaultMasterFilters = {
    logbook_ids: [],
    building_ids: [],
    building_type_ids: [],
    campus_ids: [],
    sector_ids: [],
    client_ids: [],
    consultancy_ids: [],
    view: "trailing",
    annual_years: [`${new Date().getFullYear()}`]
};
class CommonNav extends Component {
    state = {
        asideClass: "show",
        navbarClass: "",
        settingClass: "",
        notifications:
            localStorage.getItem("user_notification") && localStorage.getItem("user_notification") !== "undefined"
                ? JSON.parse(localStorage.getItem("user_notification"))
                : [],
        isLoadingNotifications: true,
        showNotificationsDropDown: false,
        showProfileDropDown: false,
        showAppliedMasterFilterModal: false,
        expandSideMenu: false,
        showPasswoedConfirmationModal: false,
        expandedMenus: []
    };

    componentDidMount = async () => {
        if (WDS_SOCKET_PATH && WDS_SOCKET_PATH.length) {
            const userId = localStorage.getItem("user_id");
            this.createWebsocketConnection(userId || null, WDS_SOCKET_PATH);
        }
        this.getUnReadNotifications(true);
        await this.setState({
            isLoadingNotifications: false
        });
        toggleTooltip();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        ReactTooltip.rebuild();
    };

    logOut = () => {
        localStorage.clear();
        history.push("/login");
    };

    pageChange = pageName => {
        history.push("/" + pageName);
    };

    settingHandler = async () => {
        document.getElementById("navbarSupportedContent") && document.getElementById("navbarSupportedContent").classList.remove("show");
        document.getElementById("colbuttoninto") && document.getElementById("colbuttoninto").classList.add("icon-sta");
    };

    createWebsocketConnection = (roomId, WDS_SOCKET_PATH) => {
        const token = localStorage.getItem("logbook-token");
        const path = WDS_SOCKET_PATH + `?access_token=${token}`;
        let socket = new WebSocket(path);
        let self = this;
        socket.onopen = function (event) {
            console.log("WebSocket is connected.");
            const msg = {
                command: "subscribe",
                identifier: JSON.stringify({
                    room_id: roomId,
                    channel: "Api::V1::NotificationsChannel"
                })
            };
            socket.send(JSON.stringify(msg));
        };
        socket.onclose = function (event) {
            console.log("WebSocket is closed.");
        };
        socket.onmessage = function (event) {
            const response = event.data;
            const msg = JSON.parse(response);
            if (msg.type === "ping") {
                return;
            }
            console.log("FROM RAILS: ", msg);
            let currentNotifications = JSON.parse(localStorage.getItem("user_notification"));
            if (msg.message) {
                currentNotifications.push(msg.message.notification);
                localStorage.setItem("user_notification", JSON.stringify(currentNotifications || []));
                self.setState({
                    notifications: currentNotifications
                });
                ToastMsg("You have a new notification", "info");
            }
        };
        socket.onerror = function (error) {
            console.log("WebSocket Error: " + error);
        };
    };

    handleNotificationIconClick = async () => {
        const { showNotificationsDropDown } = this.state;
        await this.setState({
            showNotificationsDropDown: !showNotificationsDropDown,
            showProfileDropDown: false
        });
        if (!showNotificationsDropDown) {
            await this.setState({
                isLoadingNotifications: true
            });
            this.getUnReadNotifications();
            await this.setState({
                isLoadingNotifications: false
            });
        }
    };

    toggleShowProfileDropDown = () => {
        const { showProfileDropDown } = this.state;
        this.setState({
            showProfileDropDown: !showProfileDropDown,
            showNotificationsDropDown: false
        });
    };

    getUnReadNotifications = async (login = false) => {
        let audit_mode = localStorage.getItem("audit_mode") && localStorage.getItem("audit_mode") === "true" ? true : false;
        if (!audit_mode) {
            await this.props.getUnReadNotifications(login);
            const {
                commonReducer: {
                    getUnReadNotificationsResponse: { notifications, success }
                }
            } = this.props;
            if (success) {
                localStorage.setItem("user_notification", JSON.stringify(notifications));
                this.setState({
                    notifications: notifications
                });
            }
        }
    };

    handleDeleteNotification = async (event, id) => {
        event.preventDefault();
        event.stopPropagation();
        await this.props.deleteUnReadNotifications(id);
        this.getUnReadNotifications();
    };

    onNotificationClick = async notification => {
        await this.props.readNotification(notification.id);
        await this.setState({
            showNotificationsDropDown: false
        });
        this.getUnReadNotifications();
        history.push(notification.link);
    };

    handleShowAllNotificationClick = async id => {
        await this.setState({
            showNotificationsDropDown: false
        });
        history.push("/notifications");
    };

    toggleAppliedMasterFilterModal = item => {
        const { showAppliedMasterFilterModal } = this.state;
        this.setState({
            showAppliedMasterFilterModal: !showAppliedMasterFilterModal
        });
    };

    renderAppliedMasterFiltersModal = () => {
        const { showAppliedMasterFilterModal } = this.state;
        if (!showAppliedMasterFilterModal) return null;
        return (
            <Portal
                body={<AppliedMasterFiltersModal onCancel={this.toggleAppliedMasterFilterModal} />}
                onCancel={this.toggleAppliedMasterFilterModal}
            />
        );
    };

    resetMasterFilter = async () => {
        const { setMasterFilter } = this.props;
        ReactTooltip.hide();
        await localStorage.setItem("master_filters", JSON.stringify(defaultMasterFilters));
        await localStorage.setItem("master_filters_applied", JSON.stringify(defaultMasterFilters));
        await this.setState({
            selectedFiterDropdown: null
        });
        setMasterFilter(defaultMasterFilters);
    };

    enableAuditMode = async () => {
        await this.props.setAuditMode({ audit_mode: true });
        const {
            commonReducer: {
                setAuditModeResponse: { success = false }
            }
        } = this.props;
        if (success) {
            await localStorage.setItem("audit_mode", true);
            this.toggleShowProfileDropDown();
            history.push(`/logbooksmain`);
        }
    };

    disableAuditMode = async password => {
        await this.props.setAuditMode({ audit_mode: false, password });
        const {
            commonReducer: {
                setAuditModeResponse: { success = false, message }
            }
        } = this.props;
        if (success) {
            await localStorage.setItem("audit_mode", false);
            this.toggleShowProfileDropDown();
            this.togglePasswordConfirmationModal();
            history.push(`/dashboard`);
        } else {
            ToastMsg(message, "info");
        }
    };

    togglePasswordConfirmationModal = item => {
        const { showPasswoedConfirmationModal } = this.state;
        this.setState({
            showPasswoedConfirmationModal: !showPasswoedConfirmationModal
        });
    };

    renderPasswoedConfirmationModal = () => {
        const { showPasswoedConfirmationModal } = this.state;
        if (!showPasswoedConfirmationModal) return null;
        return (
            <Portal
                body={<PasswoedConfirmationModal onConfirm={this.disableAuditMode} onCancel={this.togglePasswordConfirmationModal} />}
                onCancel={this.togglePasswordConfirmationModal}
            />
        );
    };

    toggleChangePasswordConfirmationModal = item => {
        const { showChangePasswordConfirmationModal } = this.state;
        this.setState({
            showChangePasswordConfirmationModal: !showChangePasswordConfirmationModal
        });
    };

    renderChangePasswordConfirmationModal = () => {
        const { showChangePasswordConfirmationModal } = this.state;
        if (!showChangePasswordConfirmationModal) return null;
        return (
            <Portal
                body={<PasswordResetConfirmationModal  onCancel={this.toggleChangePasswordConfirmationModal} />}
                onCancel={this.toggleChangePasswordConfirmationModal}
            />
        );
    };

    viewMyProfile = () => {
        const userId = localStorage.getItem("user_id");
        this.toggleShowProfileDropDown();
        history.push(`/user/edit/${userId}`, { prevPagePath: this.props.location.pathname });
    };

    toggleSideMenu = expandSideMenu => {
        const { expandedMenus } = this.state;
        this.setState({
            expandSideMenu: !expandSideMenu,
            expandedMenus: expandSideMenu ? [] : expandedMenus
        });
    };

    setExpandedSubMenu = async item => {
        const { expandedMenus, expandSideMenu } = this.state;
        let tempList = expandedMenus;
        await this.setState({
            expandedMenus: []
        });
        if (tempList.length) {
            if (tempList.includes(item)) {
                tempList = tempList.filter(listitem => listitem !== item);
            } else {
                tempList.push(item);
            }
        } else {
            tempList.push(item);
        }
        await this.setState({
            expandedMenus: tempList,
            expandSideMenu: tempList.length ? true : expandSideMenu
        });
    };

    render() {
        let userName = localStorage.getItem("userName") || "User";
        let audit_mode = localStorage.getItem("audit_mode") && localStorage.getItem("audit_mode") === "true" ? true : false;
        let view_only_surveyor = localStorage.getItem("view_only_surveyor") && localStorage.getItem("view_only_surveyor") === "true" ? true : false;
        let view_only = localStorage.getItem("view_only") ? localStorage.getItem("view_only") : "no";

        const { notifications, isLoadingNotifications, showNotificationsDropDown, showProfileDropDown, expandSideMenu, expandedMenus } = this.state;
        const { toggleMasterFilter, isMasterFiltered, showMasterFilter } = this.props;
        let notificationCount =
            (this.props.commonReducer.getUnReadNotificationsResponse && this.props.commonReducer.getUnReadNotificationsResponse.count) || 0;
        return (
            <React.Fragment>
                <ReactTooltip effect="solid" id="common_nav" />
                <Header
                    toggleMasterFilter={toggleMasterFilter}
                    isMasterFiltered={isMasterFiltered}
                    showMasterFilter={showMasterFilter}
                    notifications={notifications}
                    isLoadingNotifications={isLoadingNotifications}
                    showNotificationsDropDown={showNotificationsDropDown}
                    showProfileDropDown={showProfileDropDown}
                    notificationCount={notificationCount}
                    view_only={view_only}
                    userName={userName}
                    audit_mode={audit_mode}
                    view_only_surveyor={view_only_surveyor}
                    toggleAppliedMasterFilterModal={this.toggleAppliedMasterFilterModal}
                    resetMasterFilter={this.resetMasterFilter}
                    handleNotificationIconClick={this.handleNotificationIconClick}
                    onNotificationClick={this.onNotificationClick}
                    handleDeleteNotification={this.handleDeleteNotification}
                    handleShowAllNotificationClick={this.handleShowAllNotificationClick}
                    toggleShowProfileDropDown={this.toggleShowProfileDropDown}
                    viewMyProfile={this.viewMyProfile}
                    togglePasswordConfirmationModal={this.togglePasswordConfirmationModal}
                    toggleChangePasswordConfirmationModal={this.toggleChangePasswordConfirmationModal}
                    enableAuditMode={this.enableAuditMode}
                    logOut={this.logOut}
                    toggleSideMenu={this.toggleSideMenu}
                    expandSideMenu={expandSideMenu}
                />

                <SideNav
                    audit_mode={audit_mode}
                    pageChange={this.pageChange}
                    settingHandler={this.settingHandler}
                    logOut={this.logOut}
                    toggleSideMenu={this.toggleSideMenu}
                    expandSideMenu={expandSideMenu}
                    setExpandedSubMenu={this.setExpandedSubMenu}
                    expandedMenus={expandedMenus}
                />

                {this.renderAppliedMasterFiltersModal()}
                {this.renderPasswoedConfirmationModal()}
                {this.renderChangePasswordConfirmationModal()}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { commonReducer } = state;
    return { commonReducer };
};

export default withRouter(connect(mapStateToProps, { ...commonActions })(CommonNav));
