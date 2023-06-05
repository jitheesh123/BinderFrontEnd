import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";

import actions from "./actions";
import TopSlider from "../../components/common/components/TopSlider";
import history from "../../config/history";
import { checkPermission } from "../../config/utils";
import Inbox from "./components/Inbox";
import SentItems from "./components/SentItems";
import AllSentItems from "./components/AllSentItems";
import EmailDetails from "./components/EmailDetails";
import Pagination from "../../components/common/components/Pagination";
import Portal from "../common/components/Portal";
import ConfirmationModal from "../../components/common/components/ConfirmationModal";
import Loader from "../common/components/Loader";
import SendEmailModal from "./components/sendEmailModal";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showConfirmation: false,
            paginationParams: this.props.emailReducer.entityParams.paginationParams,
            params: this.props.emailReducer.entityParams.params,
            inboxEmailList: [],
            sentEmailList: [],
            emailDetails: null
        };
    }

    componentDidMount = async () => {
        this.getEmailData();
    };

    componentDidUpdate = async prevProps => {
        if (this.props.match.params.section !== prevProps.match.params.section) this.getEmailData();
        if (this.props.match.params.section === "details") {
            if (this.props.match.params.id !== prevProps.match.params.id) {
                this.getEmailData();
            }
        }
    };

    getEmailData = async () => {
        this.props.setIsLoading(true);
        const {
            match: {
                params: { section = null, id = null }
            }
        } = this.props;
        const { paginationParams, params } = this.state;
        if (section && section === "inbox") {
            await this.props.getInboxMails(params);
            const {
                emailReducer: {
                    emailListResponse: { inbox, count = 0 }
                }
            } = this.props;
            await this.setState({
                inboxEmailList: inbox,
                paginationParams: {
                    ...paginationParams,
                    totalCount: count,
                    totalPages: Math.ceil(count / paginationParams.perPage)
                }
            });
        } else if (section && section === "sentitems") {
            await this.props.getSentMails(params);
            const {
                emailReducer: {
                    emailListResponse: { sent, count = 0 }
                }
            } = this.props;
            await this.setState({
                sentEmailList: sent,
                paginationParams: {
                    ...paginationParams,
                    totalCount: count,
                    totalPages: Math.ceil(count / paginationParams.perPage)
                }
            });
        } else if (section && section === "allsentitems") {
            await this.props.getAllSentMails(params);
            const {
                emailReducer: {
                    emailListResponse: { all_sent, count = 0 }
                }
            } = this.props;
            await this.setState({
                allSentEmailList: all_sent,
                paginationParams: {
                    ...paginationParams,
                    totalCount: count,
                    totalPages: Math.ceil(count / paginationParams.perPage)
                }
            });
        } else if (section && section === "details") {
            if (id) {
                await this.props.getEmailDetails(id);
                const {
                    emailReducer: {
                        getEmailDetailsResponse: { email_log }
                    }
                } = this.props;
                await this.setState({
                    emailDetails: email_log
                });
            }
        }
        this.props.setIsLoading(false);
    };

    emailPageChange = pageName => {
        history.push("/" + pageName);
    };

    viewDetails = id => {
        const {
            match: {
                params: { section = "" }
            }
        } = this.props;
        history.push(`/emails/details/${id}`, { from: section === "allsentitems" ? "all_sent" : "" });
    };

    togglShowConfirmation = () => {
        const { showConfirmation } = this.state;
        this.setState({
            showConfirmation: !showConfirmation
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmation } = this.state;
        if (!showConfirmation) return null;

        return (
            <Portal
                body={
                    <ConfirmationModal
                        onCancel={this.togglShowConfirmation}
                        onOk={this.deleteItem}
                        heading={"Do you want to delete ?"}
                        paragraph={"This action cannot be reverted, are you sure that you need to delete this item ?"}
                    />
                }
                onCancel={this.toggleShowFrequencyModal}
            />
        );
    };

    handlePageClick = async page => {
        const { paginationParams, params } = this.state;
        await this.setState({
            paginationParams: {
                ...paginationParams,
                currentPage: page.selected
            },
            params: {
                ...params,
                page: page.selected + 1
            }
        });
        await this.getEmailData();
    };

    handlePerPageChange = async e => {
        const { paginationParams } = this.state;
        await this.setState({
            paginationParams: {
                ...paginationParams,
                perPage: e.target.value,
                currentPage: 0
            },
            params: {
                ...this.state.params,
                page: 1,
                limit: e.target.value
            }
        });
        await this.getEmailData();
    };

    handleGlobalSearch = async search => {
        const { params } = this.state;
        await this.setState({
            params: {
                ...params,
                page: 1,
                search
            }
        });
        await this.getEmailData();
    };

    toggleShowSendEmailModal = () => {
        const { showSendEmailModal } = this.state;
        this.setState({ showSendEmailModal: !showSendEmailModal });
    };

    renderSendEmailModal = () => {
        const { showSendEmailModal } = this.state;
        if (!showSendEmailModal) return null;

        return (
            <Portal
                body={
                    <SendEmailModal
                        entity={"Email"}
                        reportParams={null}
                        tableParams={null}
                        hasAttachment={true}
                        refreshMails={this.getEmailData}
                        onCancel={() => this.setState({ showSendEmailModal: false })}
                    />
                }
                onCancel={() => this.setState({ showSendEmailModal: false })}
            />
        );
    };

    render() {
        const {
            match: {
                params: { section = null }
            },
            isLoading
        } = this.props;
        const { paginationParams, inboxEmailList, sentEmailList, allSentEmailList, emailDetails, params } = this.state;

        if (!checkPermission("forms", "email_logs", "view"))
            return (
                <section className="cont-ara">
                    <div className="list-area">
                        <TopSlider />
                        <div className="lst-bt-nav"></div>
                    </div>
                </section>
            );

        let user_role = localStorage.getItem("user_role");

        return (
            <React.Fragment>
                <section className="cont-ara">
                    <LoadingOverlay active={isLoading} spinner={<Loader />}>
                        <div class="list-area">
                            <div class="lst-bt-nav row m-0 mail-box">
                                <div class="col-xl-2 col-lg-3">
                                    <div class="mail-sidebar">
                                        <button class="compose-btn" onClick={() => this.toggleShowSendEmailModal()}>
                                            Compose
                                        </button>
                                        <div class="card mt-3">
                                            <ul class="list-group list-group-flush ">
                                                <li
                                                    class={`list-group-item ${section && section === "inbox" ? "active" : ""}`}
                                                    onClick={() => this.emailPageChange("emails/inbox")}
                                                >
                                                    <button>
                                                        <i>
                                                            <img src="/images/inbox-icon.svg" alt="" />
                                                        </i>
                                                        Inbox
                                                        {/* <span>0</span> */}
                                                    </button>
                                                </li>
                                                <li
                                                    class={`list-group-item ${section && section === "sentitems" ? "active" : ""}`}
                                                    onClick={() => this.emailPageChange("emails/sentitems")}
                                                >
                                                    <button>
                                                        <i>
                                                            <img src="/images/forward_to_inbox.svg" alt="" />
                                                        </i>
                                                        Sent
                                                    </button>
                                                </li>
                                                {user_role === "super_admin" ? (
                                                    <li
                                                        class={`list-group-item ${section && section === "allsentitems" ? "active" : ""}`}
                                                        onClick={() => this.emailPageChange("emails/allsentitems")}
                                                    >
                                                        <button>
                                                            <i>
                                                                <img src="/images/forward_to_inbox.svg" alt="" />
                                                            </i>
                                                            All Sent
                                                        </button>
                                                    </li>
                                                ) : null}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                {section && section === "inbox" ? (
                                    <Inbox
                                        emailList={inboxEmailList}
                                        viewDetails={this.viewDetails}
                                        refreshMails={this.getEmailData}
                                        handleGlobalSearch={this.handleGlobalSearch}
                                        globalSearchKey={params.search}
                                    />
                                ) : section && section === "sentitems" ? (
                                    <SentItems
                                        emailList={sentEmailList}
                                        viewDetails={this.viewDetails}
                                        refreshMails={this.getEmailData}
                                        handleGlobalSearch={this.handleGlobalSearch}
                                        globalSearchKey={params.search}
                                    />
                                ) : section && section === "allsentitems" && user_role === "super_admin" ? (
                                    <AllSentItems
                                        emailList={allSentEmailList}
                                        viewDetails={this.viewDetails}
                                        refreshMails={this.getEmailData}
                                        handleGlobalSearch={this.handleGlobalSearch}
                                        globalSearchKey={params.search}
                                    />
                                ) : section && section === "details" ? (
                                    <EmailDetails emailDetails={emailDetails} />
                                ) : null}

                                {section && (section === "inbox" || section === "sentitems" || section === "allsentitems") ? (
                                    <Pagination
                                        paginationParams={paginationParams}
                                        handlePageClick={this.handlePageClick}
                                        handlePerPageChange={this.handlePerPageChange}
                                        isRecordPerPage={true}
                                    />
                                ) : null}
                            </div>
                        </div>
                        {/* {this.renderConfirmationModal()} */}
                        {this.renderSendEmailModal()}
                    </LoadingOverlay>
                </section>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { emailReducer } = state;
    return { emailReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(index));
