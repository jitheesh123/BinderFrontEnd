import React, { Component } from "react";

import Breadcrumb from "./Breadcrumb";
import history from "../../../config/history";

class CommonViewTabs extends Component {
    render() {
        const { item, keys, goBack, config, tabData = [], currentTab = null, prevPath = "" } = this.props;
        return (
            <div className="top-slider nav-ara">
                <div className="tab-sec">
                    <button className="btn btn-submit btn-back" onClick={() => goBack()}>
                        <span className="material-icons">keyboard_backspace</span>
                    </button>
                    <ul className="nav nav-tabs">
                        {tabData.map((tabItem, index) => (
                            <li
                                key={index}
                                className={`cursor-pointer ${currentTab && tabItem.key === currentTab ? "active" : ""}`}
                                onClick={() =>
                                    history.push(tabItem.path, { item: item, keys: keys, config: config, prevPath: tabItem.prevPath || prevPath })
                                }
                            >
                                <span>{tabItem.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* <Breadcrumb /> */}
            </div>
        );
    }
}

export default CommonViewTabs;
