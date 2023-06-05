import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import history from "../../../config/history";
import CommonView from "../../common/components/CommonView";
import Portal from "../../common/components/Portal";
import ConfirmationModal from "../../../components/common/components/ConfirmationModal";
import CommonViewTabs from "../../common/components/CommonViewTabs";
import GlobalReport from "../../globalReport";

class viewConsultancy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            basicDetails: {
                code: "",
                name: "",
                building:"",
                campus:"",
                consultancy:"",
                doc_type:"",
                sector:"",
                date_uploaded:"",
                logbook:"",
                signed_by:"",
                uploaded_by:"",
                deeming_agency:"",
                id:""

            },
            showConfirmModalLog: false,
            selectedLog: "",
            logChanges: "",
            isLogView: false
        };
    }

    componentDidMount = async () => {
        this.props.showInfoPage(this.props.match.params.id);
        await this.refreshinfoDetails();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.props.showInfoPage(this.props.match.params.id);
            await this.refreshinfoDetails();
        }
    };

    refreshinfoDetails = async () => {
        let documentData = await this.props.getDataById(this.props.match.params.id);
        // console.log("hi",userData)
        if (documentData && documentData.success) {
            this.setState({
                basicDetails: {
                    // code: userData.logbook_document.name,
                    name: documentData.logbook_document.name,
                    building:documentData.logbook_document.building,
                    campus:documentData.logbook_document.campus,
                    consultancy:documentData.logbook_document.consultancy,
                    doc_type:documentData.logbook_document.doc_type,
                    sector:documentData.logbook_document.sector,
                    signed_by:documentData.logbook_document.signed_by,
                    uploaded_by:documentData.logbook_document.uploaded_by,
                    deeming_agency:documentData.logbook_document.deeming_agency,
                    date_uploaded:documentData.logbook_document.date_uploaded,
                    date_signed:documentData.logbook_document.date_signed,
                    client:documentData.logbook_document.client,
                    logbook:documentData.logbook_document.logbook,
                    id:documentData.logbook_document.id
                }
            });
        }
        return true;
    };

    goBack = () => {
        history.push("/Document");
    };

    handleRestoreLog = async (id, changes) => {
        await this.setState({
            showConfirmModalLog: true,
            selectedLog: id,
            logChanges: changes
        });
    };

    renderConfirmationModalLog = () => {
        const { showConfirmModalLog, logChanges } = this.state;
        if (!showConfirmModalLog) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        paragraph={logChanges}
                        onCancel={() => this.setState({ showConfirmModalLog: false })}
                        onOk={this.restoreLogOnConfirm}
                        isRestore={true}
                        type={"restore"}
                        isLogRestore={true}
                    />
                }
                onCancel={() => this.setState({ showConfirmModalLog: false })}
            />
        );
    };

    restoreLogOnConfirm = async () => {
        const { selectedLog } = this.state;
        await this.props.HandleRestoreLog(selectedLog);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null,
            isLogView: false
        });
        await this.refreshinfoDetails();
    };

    toggleViewPage = async () => {
        await this.setState({ isLogView: !this.state.isLogView });
    };

    render() {
        const {
            keys,
            config,
            match: {
                params: { tab, id }
            },
            infoTabsData,
            deleteItem,
            showEditPage,
            getLogData,
            logData,
            handleDeleteLog,
            handlePageClickHistory,
            handleGlobalSearchHistory,
            globalSearchKeyHistory,
            historyPaginationParams,
            updateLogSortFilters,
            hasLogView,
            hasLogDelete,
            hasLogRestore,
            hasEdit,
            hasDelete,
            historyParams
        } = this.props;

        const { basicDetails } = this.state;
        return (
            <React.Fragment>
                <div className="fst">
                    <CommonViewTabs tabData={infoTabsData} goBack={this.goBack} item={basicDetails} keys={keys} config={config} currentTab={tab} />
                    {tab === "basicdetails"  ? (
                        <CommonView
                            item={basicDetails}
                            keys={keys}
                            config={config}
                            goBack={this.goBack}
                            // tabData={infoTabsData}
                            // editItem={showEditPage}
                            // deleteItem={deleteItem}
                            // getLogData={getLogData}
                            // logData={logData}
                            // handleDeleteLog={handleDeleteLog}
                            // isLogView={this.state.isLogView}
                            // toggleViewPage={this.toggleViewPage}
                            // handleRestoreLog={this.handleRestoreLog}
                            // handlePageClickHistory={handlePageClickHistory}
                            // handleGlobalSearchHistory={handleGlobalSearchHistory}
                            // globalSearchKeyHistory={globalSearchKeyHistory}
                            // historyPaginationParams={historyPaginationParams}
                            // updateLogSortFilters={updateLogSortFilters}
                            // historyParams={historyParams}
                            hasLogView={hasLogView}
                            hasLogDelete={hasLogDelete}
                            hasLogRestore={hasLogRestore}
                            hasEdit={hasEdit}
                            hasDelete={hasDelete}
                        />
                    ) : 
                    tab === "assignedreports" ? (
                        <div className="infoPageContent">
                            <div className="frm-ara cmon-ara">
                                <GlobalReport
                                reportType= {'logbook_document_info'}
                                logbook_document_id= {id}
                                />
                            </div>
                        </div>                       
                        ) : null}
                </div>
                {this.renderConfirmationModalLog()}
            </React.Fragment>
        );
    }
}

export default withRouter(viewConsultancy);
