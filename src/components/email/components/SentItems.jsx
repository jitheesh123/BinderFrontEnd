/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import actions from "../actions";
import HeaderActions from "./HeaderActions";
import EmailList from "./EmailList";

class SentItems extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount = async () => {};

    render() {
        const { viewDetails, emailList, refreshMails, handleGlobalSearch, globalSearchKey } = this.props;
        return (
            <React.Fragment>
                <div class="table table-ara col-xl-10 col-lg-9">
                    <div class="top-fil-ara title-btn-wrapper">
                        <div class="cap">
                            <h4>Sent Items</h4>
                        </div>
                        <HeaderActions refreshMails={refreshMails} handleGlobalSearch={handleGlobalSearch} globalSearchKey={globalSearchKey} />
                    </div>
                    <div class="list-sec mail-table-otr">
                        <div class="mail-table">
                            <div class="table-section">
                                <EmailList viewDetails={viewDetails} emailList={emailList} globalSearchKey={globalSearchKey} />
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { emailReducer } = state;
    return { emailReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(SentItems));
