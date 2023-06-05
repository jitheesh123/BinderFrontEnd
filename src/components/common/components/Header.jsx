/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ReactTooltip from "react-tooltip";

import history from "../../../config/history";
import { checkPermission } from "../../../config/utils";
import commonActions from "../actions";
import Loader from "./Loader";

class Header extends Component {
    componentDidUpdate = async () => {
        ReactTooltip.rebuild();
    };


    render() {
      
        const {
            toggleMasterFilter,
            isMasterFiltered,
            showMasterFilter,
            notifications,
            isLoadingNotifications,
            showNotificationsDropDown,
            showProfileDropDown,
            notificationCount,
            view_only,
            userName,
            audit_mode,
            toggleAppliedMasterFilterModal,
            resetMasterFilter,
            handleNotificationIconClick,
            onNotificationClick,
            handleDeleteNotification,
            handleShowAllNotificationClick,
            toggleShowProfileDropDown,
            viewMyProfile,
            togglePasswordConfirmationModal,
            toggleChangePasswordConfirmationModal,
            enableAuditMode,
            logOut,
            toggleSideMenu,
            expandSideMenu,
            view_only_surveyor
        } = this.props;

        return (
            <React.Fragment>
                <header>
                    <ToastContainer />
                    <nav className="navbar">
                        <div className="mnu-ico">
                            <button className="navbar-toggler" type="button" onClick={() => toggleSideMenu(expandSideMenu)}>
                                {expandSideMenu ? (
                                    <img src="/images/clear.svg" className="open" alt="" />
                                ) : (
                                    <img src="/images/menu.svg" className="close" alt="" />
                                )}
                            </button>
                        </div>
                        <span className="navbar-brand">
                            <img
                                className="cursor-pointer"
                                src="/images/logo-inner.svg"
                                alt=""
                                onClick={() => {
                                    toggleSideMenu(true);
                                    history.push(audit_mode ? "/logbooksmain" : "/dashboard");
                                }}
                            />
                        </span>
                        <div className="mnu-info ml-auto drop-grp">
                            {!showMasterFilter && isMasterFiltered ? (
                                <div className="btn-grp btn-grp-top">
                                    <button
                                        className="btn"
                                        onClick={() => toggleAppliedMasterFilterModal()}
                                        data-tip="View Applied Filters"
                                        data-for="common_nav"
                                    >
                                        <img src="/images/wild-card.svg" alt="" />
                                    </button>
                                    <button
                                        className="btn active"
                                        onClick={() => resetMasterFilter()}
                                        data-tip="Reset Master Filters"
                                        data-for="common_nav"
                                    >
                                        <img src="/images/reset-wild-card.svg" alt="" />
                                    </button>
                                </div>
                            ) : null}
                            {!audit_mode &&
                            <div className="ml-3">
                             <button  className="btn btn-report" onClick ={ () => history.push("/global-report" )}>
                                Global report
                            </button>
                            </div>}
                            <div className="custom-drop icon-drop show">
                                <button
                                    className="btn btn-secondary fltr dropdown-toggle"
                                    onClick={() => toggleMasterFilter()}
                                    data-tip="Master Filters"
                                    data-for="common_nav"
                                >
                                    <img src="/images/filter-icon.svg" alt="" />
                                </button>
                                <span className="top-slider-icon" data-tip="Display Logbooks" data-for="common_nav">
                                    <i
                                        className="material-icons"
                                        data-toggle="collapse"
                                        data-target="#collapseExample"
                                        aria-expanded="true"
                                        aria-controls="collapseExample"
                                    >
                                        expand_more
                                    </i>
                                </span>
                                {!audit_mode ? (
                                    <>
                                        <button
                                            type="button"
                                            className="btn btn-secondary dropdown-toggle"
                                            onClick={() => handleNotificationIconClick()}
                                            data-tip="Notifications"
                                            data-for="common_nav"
                                        >
                                            <i>
                                                <img src="/images/bell-icon.svg" alt="" />
                                                <span className="circle">{notificationCount}</span>
                                            </i>
                                        </button>
                                        {showNotificationsDropDown && !audit_mode ? (
                                            <div className="dropdown-menu dropdown-menu-right notification-view show">
                                                <ul>
                                                    {isLoadingNotifications ? (
                                                        <li>
                                                            <Loader />
                                                        </li>
                                                    ) : notifications && notifications.length ? (
                                                        notifications.map((item, i) => (
                                                            <li className="cursor-pointer" key={i} onClick={() => onNotificationClick(item)}>
                                                                <div className="icon">
                                                                    <img src="/images/notification.svg" alt="" />
                                                                </div>
                                                                <div className="content">
                                                                    <strong>{item.body || "-"}</strong>

                                                                    <div className="time">{item.created_at || "-"}</div>
                                                                </div>
                                                                <i onClick={e => handleDeleteNotification(e, item.id)}>
                                                                    <img src="/images/delete.svg" alt="" />
                                                                </i>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li>
                                                            <div className="icon">
                                                                <img src="/images/notification.svg" alt="" />
                                                            </div>
                                                            <div className="content">
                                                                <strong>{"No New Notifications!"}</strong>
                                                            </div>
                                                        </li>
                                                    )}
                                                </ul>
                                                <div className="show-all-outer">
                                                    <span className="btn-primary cursor-pointer" onClick={() => handleShowAllNotificationClick()}>
                                                        Show all items
                                                    </span>
                                                </div>
                                            </div>
                                        ) : null}
                                    </>
                                ) : null}
                            </div>
                            <ul className="prf-lst">
                                <li className="nav-item dropdown show">
                                    <div
                                        className="nav-link dropdown-toggle "
                                        id="profile-info"
                                        role="button"
                                        onClick={() => toggleShowProfileDropDown()}
                                    >
                                        <div className="prf-img">
                                            <img src="/images/profile-icon.svg" alt="" />
                                        </div>
                                        <div className="pdf-name">{userName}</div>
                                    </div>
                                    {showProfileDropDown ? (
                                        <div className="dropdown-menu profile-view show" aria-labelledby="profile-info">
                                            {checkPermission("forms", "users", "edit") ? (
                                                <button onClick={() => viewMyProfile()}>
                                                    <span>My Profile</span>
                                                </button>
                                            ) : null}
                                            {view_only === "no" && !view_only_surveyor ? (
                                                <>
                                                    {audit_mode ? (
                                                        <button onClick={() => togglePasswordConfirmationModal()}>
                                                            <span>Disable View Only</span>
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => enableAuditMode()}>
                                                            <span>View Only</span>
                                                        </button>
                                                    )}
                                                </>
                                            ) : null}
                                            <button 
                                            onClick={()=>toggleChangePasswordConfirmationModal()}
                                            >
                                                <span>Reset Password</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    logOut();
                                                }}
                                            >
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    ) : null}
                                </li>
                            </ul>
                        </div>
                    </nav>
                </header>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { commonReducer } = state;
    return { commonReducer };
};

export default withRouter(connect(mapStateToProps, { ...commonActions })(Header));
