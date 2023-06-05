/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { sideNavConfig } from "../../../config/sideNavConfig";
import commonActions from "../actions";

class SideNav extends Component {
    renderSubMenu = (menuData, level) => {
        const { pageChange, setExpandedSubMenu, expandedMenus } = this.props;
        return (
            <div className={level > 1 ? "sub-2 viw-sub" : "viw-sub"}>
                <div className={`collapse ${expandedMenus.includes(menuData.key) ? "show" : ""}`}>
                    <ul className="view">
                        {menuData.subMenus && menuData.subMenus.length
                            ? menuData.subMenus.map(subMenuItem =>
                                  subMenuItem.permission ? (
                                      <li>
                                          <a
                                              onClick={
                                                  subMenuItem.url ? () => pageChange(subMenuItem.url) : () => setExpandedSubMenu(subMenuItem.key)
                                              }
                                              className={subMenuItem.hasSubMenu ? "nav-link nav-link-sub" : ""}
                                              aria-expanded={subMenuItem.hasSubMenu ? expandedMenus.includes(subMenuItem.key) : ""}
                                          >
                                              {subMenuItem.label}
                                          </a>
                                          {subMenuItem.hasSubMenu ? this.renderSubMenu(subMenuItem, 2) : null}
                                      </li>
                                  ) : null
                              )
                            : null}
                    </ul>
                </div>
            </div>
        );
    };

    render() {
        let sideNavData = sideNavConfig();
        const { pageChange, logOut, expandSideMenu, setExpandedSubMenu, expandedMenus } = this.props;

        return (
            <React.Fragment>
                <aside className={`sidenav navbar-collapse fixed collapse ${expandSideMenu ? "" : "show"}`} id="navbarSupportedContent">
                    <ul className="navbar">
                        {sideNavData && sideNavData.length
                            ? sideNavData.map(navItem =>
                                  navItem.permission ? (
                                      <li className="nav-item">
                                          <a
                                              className="nav-link"
                                              onClick={navItem.url ? () => pageChange(navItem.url) : () => setExpandedSubMenu(navItem.key)}
                                              aria-expanded={navItem.hasSubMenu ? expandedMenus.includes(navItem.key) : ""}
                                          >
                                              <div className="icn-sec">
                                                  <img src={navItem.image} alt="" />
                                              </div>
                                              <span>{navItem.label}</span>
                                          </a>
                                          {navItem.hasSubMenu ? this.renderSubMenu(navItem, 1) : null}
                                      </li>
                                  ) : null
                              )
                            : null}
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => logOut()}>
                                <div className="icn-sec">
                                    <img src="/images/logout.svg" alt="" />
                                </div>
                                <span>Logout</span>
                            </a>
                        </li>
                    </ul>
                </aside>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { commonReducer } = state;
    return { commonReducer };
};

export default withRouter(connect(mapStateToProps, { ...commonActions })(SideNav));
