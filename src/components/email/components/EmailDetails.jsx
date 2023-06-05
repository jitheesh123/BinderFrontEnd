/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";
import ReactTooltip from "react-tooltip";

import actions from "../actions";
class EmailDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    goBack = () => {
        this.props.history.goBack();
    };

    render() {
        const { emailDetails } = this.props;
        let detailViewFrom = (this.props.location && this.props.location.state && this.props.location.state.from) || "";
        if (!emailDetails) return <div class="table table-ara col-xl-10 col-lg-9 min-hig-80vh"></div>;
        return (
            <React.Fragment>
                <ReactTooltip effect="solid" id="email_details" />
                <div class="table table-ara col-xl-10 col-lg-9">
                    <div class="top-fil-ara title-btn-wrapper">
                        <button className="btn btn-submit btn-back" onClick={() => this.goBack()}>
                            <span className="material-icons">keyboard_backspace</span>
                        </button>
                        <div class="cap">
                            <h4>
                                <span>{emailDetails.subject}</span>
                            </h4>
                        </div>
                        {detailViewFrom === "all_sent" ? (
                            <div class="mail-from mail-bdr">
                                <h5>
                                    From :<span>{emailDetails.from}</span>
                                </h5>
                            </div>
                        ) : null}
                        <div class="mail-from">
                            {/* {emailDetails.email_type !== "received" ? ( */}
                            <h5 data-tip={emailDetails.to && emailDetails.to.toString()} data-for="email_details">
                                {detailViewFrom === "all_sent" ? "To :" : null}{" "}
                                {emailDetails.to && emailDetails.to.length ? emailDetails.to.map(item => <span>({item})</span>) : null}
                            </h5>
                            {/* ) : null} */}
                            <div class="otr">
                                <span>
                                    {emailDetails.created_at} ({moment(new Date(emailDetails.created_at)).fromNow()})
                                </span>
                            </div>
                            {/* <div class="btn-otr">
                                <button class="btn" title="Reset Columns">
                                    <img src="/images/delete-icon.svg" alt="" />
                                </button>
                            </div> */}
                        </div>
                    </div>
                    <div class="mail-table-otr">
                        <div class="mail-table">
                            <div class="email-detail">
                                <table width="100%">
                                    <tbody>
                                        <tr>
                                            <td class="bg-01">
                                                <table class="header-mail">
                                                    <tbody>
                                                        <tr>
                                                            <td valign="top"> </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="spacing-01 bg-01">
                                                <table width="100%" class="table-width">
                                                    <tbody>
                                                        <tr>
                                                            <td class="logo-mail" valign="top" align="center">
                                                                <img src="/images/logo1.svg" alt="" />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="spacing-01 bg-02">
                                                <table class="table-width">
                                                    <tbody>
                                                        <tr>
                                                            <td align="left" height="300" class="spacing-02 bg-white">
                                                                <p>{emailDetails.body}</p>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="spacing-01 bg-02">
                                                <table class="table-width">
                                                    <tbody>
                                                        <tr>
                                                            <td class="mail-ftr">
                                                                {emailDetails.attachments && emailDetails.attachments.length ? (
                                                                    <>
                                                                        <h4>Attachments</h4>
                                                                        {emailDetails.attachments.map((attachment, i) => (
                                                                            <p>
                                                                                <a href={attachment.url} target="_blank">
                                                                                    {attachment.name}
                                                                                </a>
                                                                            </p>
                                                                        ))}
                                                                    </>
                                                                ) : null}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr></tr>
                                    </tbody>
                                </table>
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

export default withRouter(connect(mapStateToProps, { ...actions })(EmailDetails));
