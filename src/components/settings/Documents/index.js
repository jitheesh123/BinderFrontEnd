import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";

import actions from "./actions";
import TopSlider from "../../../components/common/components/TopSlider";
import history from "../../../config/history";
import { checkPermission } from "../../../config/utils";
import ToastMsg from "../../common/ToastMessage";
import CommonTable from "../../../components/common/components/CommonTable";
import TableTopHeader from "../../../components/common/components/TableTopHeader";
import Pagination from "../../../components/common/components/Pagination";
import Portal from "../../common/components/Portal";
import ConfirmationModal from "../../../components/common/components/ConfirmationModal";
import { documentTableData } from "./Components/tableConfig";
import ViewModal from "../../common/components/ViewModal";
import ViewUser from "./viewUser";
// import Form from "./userForm";
import Loader from "../../common/components/Loader";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consultancyList: [],
            tableData: documentTableData,
            showConfirmation: false,
            selectedItem: null,
            params: this.props.documentReducer.entityParams.params,
            paginationParams: this.props.documentReducer.entityParams.paginationParams,
            showViewModal: false,
            selectedUser: this.props.match.params.id,
            logData: {
                count: "",
                data: []
            },
            historyPaginationParams: this.props.documentReducer.entityParams.historyPaginationParams,
            historyParams: this.props.documentReducer.entityParams.historyParams,
            showConfirmModalLog: false,
            selectedLog: "",
            isRestoreOrDelete: "",
            showWildCardFilter: false,
            showUpdateBuildingLogbookAssignmentModal: false,
            showUpdateBuildingAssignmentModal: false
        };
    }

    componentDidMount = async () => {
        await this.setState({
            tableData: {
                ...this.state.tableData,
                keys: documentTableData.keys,
                config: this.props.documentReducer.entityParams.tableConfig || documentTableData.config
            }
        });
        await this.getDocuments();
    };

    componentDidUpdate = async prevProps => {
        if (prevProps.masterFilters !== this.props.masterFilters) {
            await this.getDocuments();
        }
    };

    getDocuments = async () => {
        this.props.setIsLoading(true);
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        const { paginationParams, params } = this.state;
        const { tableData } = this.state;
        await this.props.getAllDocument({ ...params,...master_filters });

        if (this.props.documentReducer.documentData.success) {
            this.setState({
                tableData: {
                    ...tableData,
                    data: this.props.documentReducer.documentData.logbook_documents
                },
                paginationParams: {
                    ...paginationParams,
                    totalCount: this.props.documentReducer.documentData.count,
                    totalPages: Math.ceil(this.props.documentReducer.documentData.count / paginationParams.perPage)
                },
                showWildCardFilter: this.state.params.filters ? true : false
            });
        }

        this.props.setIsLoading(false);
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

    deleteItemConfirm = async id => {
        await this.setState({
            selectedUser: id
        });
        this.togglShowConfirmation();
    };

    deleteItem = async () => {
        const { selectedUser } = this.state;
        this.togglShowConfirmation();
        await this.props.deleteUsers(selectedUser);
        await this.getDocuments();
        ToastMsg(this.props.userReducer.deleteUsersById.message, "info");
        if (this.props.match.params.id) {
            history.push("/document");
        }
    };

    editItem = async item => {
        history.push("/editConsultancy", { consultancyItem: item });
    };

    addItem = async () => {
        this.props.history.push("/addConsultancy");
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
        this.updateEntityParams();
        await this.getDocuments();
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
        this.updateEntityParams();
        await this.getDocuments();
    };

    updateTableSortFilters = async searchKey => {
        if (this.state.params.order) {
            await this.setState({
                params: {
                    ...this.state.params,
                    order: {
                        ...this.state.params.order,
                        [searchKey]: this.state.params.order[searchKey] === "desc" ? "asc" : "desc"
                    }
                }
            });
        } else {
            await this.setState({
                params: {
                    ...this.state.params,
                    order: { [searchKey]: "asc" }
                }
            });
        }
        this.updateEntityParams();
        await this.getDocuments();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.getDocuments();
    };

    showViewModal = () => {
        this.setState({
            showViewModal: true
        });
    };

    handleHideColumn = async keyItem => {
        if (keyItem !== "selectAll" && keyItem !== "deselectAll") {
            await this.setState({
                tableData: {
                    ...this.state.tableData,
                    config: {
                        ...this.state.tableData.config,
                        [keyItem]: {
                            ...this.state.tableData.config[keyItem],
                            isVisible: !this.state.tableData.config[keyItem].isVisible
                        }
                    }
                }
            });
        } else {
            let tempConfig = this.state.tableData.config;
            this.state.tableData.keys.map(item => {
                if (item !== "image") {
                    if (keyItem === "selectAll") {
                        tempConfig[item].isVisible = true;
                    } else {
                        tempConfig[item].isVisible = false;
                    }
                }
            });
            await this.setState({
                tableData: {
                    ...this.state.tableData,
                    config: tempConfig
                }
            });
        }
        this.updateEntityParams();
        return true;
    };

    renderColumnViewHideModal = () => {
        const { showViewModal, tableData } = this.state;
        if (!showViewModal) return null;
        let tempKeys = tableData.keys.filter(item => item !== "image");
        return (
            <Portal
                body={
                    <ViewModal
                        keys={tempKeys}
                        config={tableData.config}
                        handleHideColumn={this.handleHideColumn}
                        onCancel={() => this.setState({ showViewModal: false })}
                    />
                }
                onCancel={() => this.setState({ showViewModal: false })}
            />
        );
    };

    getListForCommonFilter = async params => {
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        const { search, filters, list } = this.state.params;
        params.search = search;
        params.filters = filters;
        params.list = list;
        await this.props.getListForCommonFilterForDocuments({ ...params, ...master_filters });
        return (this.props.documentReducer.getListForCommonFilterResponse && this.props.documentReducer.getListForCommonFilterResponse.list) || [];
    };

    showInfoPage = id => {
        const { history } = this.props;
        this.setState({
            selectedUser: id,
            infoTabsData: [
                { label: "Document Details", path: `/document/documentinfo/${id}/basicdetails`, key: "basicdetails" },
                { label: "Assigned Reports", path: `/document/documentinfo/${id}/assignedreports`, key: "assignedreports" },
            ]
        });
        history.push(
            `/document/documentinfo/${id}/${this.props.match.params && this.props.match.params.tab ? this.props.match.params.tab : "basicdetails"}`
        );
    };

    getDataById = async id => {
        await this.props.getDocumentById(id);
        return this.props.documentReducer.getDocumentById;
    };

    showEditPage = id => {
        const { history } = this.props;
        this.setState({
            selectedUser: id
        });
        history.push(`/document/edit/${id}`);
    };

    showAddForm = () => {
        const { history } = this.props;
        this.setState({
            selectedUser: null
        });
        history.push("/document/add");
    };

    exportTable = async () => {
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        const { params } = this.state;
        await this.props.exportUsers({
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order,
            ...master_filters
        });
    };

    // getLogData = async id => {
    //     const { historyParams } = this.state;
    //     await this.props.getAllUsersLogs(historyParams, id);
    //     const {
    //         userReducer: {
    //             getAllUsersLogResponse: { logs, count }
    //         }
    //     } = this.props;
    //     await this.setState({
    //         logData: {
    //             ...this.state.logData,
    //             data: logs
    //         },
    //         historyPaginationParams: {
    //             ...this.state.historyPaginationParams,
    //             totalCount: count,
    //             totalPages: Math.ceil(count / this.state.historyPaginationParams.perPage)
    //         }
    //     });
    // };

    handleDeleteLog = async (id, choice) => {
        await this.setState({
            showConfirmModalLog: true,
            selectedLog: id,
            isRestoreOrDelete: choice
        });
    };

    renderConfirmationModalLog = () => {
        const { showConfirmModalLog, isRestoreOrDelete } = this.state;
        if (!showConfirmModalLog) return null;
        if (isRestoreOrDelete === "delete") {
            return (
                <Portal
                    body={
                        <ConfirmationModal
                            heading={"Do you want to delete this log?"}
                            paragraph={"This action cannot be reverted, are you sure that you need to delete this item?"}
                            onCancel={() => this.setState({ showConfirmModalLog: false })}
                            onOk={this.deleteLogOnConfirm}
                        />
                    }
                    onCancel={() => this.setState({ showConfirmModalLog: false })}
                />
            );
        }
    };

    deleteLogOnConfirm = async () => {
        const { selectedLog } = this.state;
        await this.props.deleteUsersLog(selectedLog);
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    handleRestoreLog = async id => {
        const { selectedLog } = this.state;
        await this.props.restoreUsersLog(id);
        await this.getDocuments();
    };

    handlePageClickHistory = async page => {
        const { historyPaginationParams, historyParams } = this.state;
        await this.setState({
            historyPaginationParams: {
                ...historyPaginationParams,
                currentPage: page.selected
            },
            historyParams: {
                ...historyParams,
                page: page.selected + 1
            }
        });
        // await this.getLogData(this.props.match.params.id);
    };

    handleGlobalSearchHistory = async search => {
        const { historyParams, historyPaginationParams } = this.state;
        await this.setState({
            historyParams: {
                ...historyParams,
                page: 1,
                search
            },
            historyPaginationParams: {
                ...historyPaginationParams,
                currentPage: 0
            }
        });
        await this.getLogData(this.props.match.params.id);
    };

    updateLogSortFilters = async searchKey => {
        if (this.state.historyParams.order) {
            await this.setState({
                historyParams: {
                    ...this.state.historyParams,
                    order: {
                        ...this.state.historyParams.order,
                        [searchKey]: this.state.historyParams.order[searchKey] === "desc" ? "asc" : "desc"
                    }
                }
            });
        } else {
            await this.setState({
                historyParams: {
                    ...this.state.historyParams,
                    order: { [searchKey]: "asc" }
                }
            });
        }
        await this.getLogData(this.props.match.params.id);
    };

    resetAllFilters = async () => {
        await this.setState({
            paginationParams: {
                totalPages: 0,
                perPage: 40,
                currentPage: 0,
                totalCount: 0
            },
            params: {
                ...this.state.params,
                limit: 40,
                page: 1,
                search: "",
                filters: null,
                list: null,
                order: null
            },
            tableData: {
                ...this.state.tableData,
                config: documentTableData.config
            }
        });
        this.updateEntityParams();
        await this.getDocuments();
    };

    toggleFilter = () => {
        this.setState({
            showWildCardFilter: !this.state.showWildCardFilter
        });
    };

    updateWildCardFilter = async newFilter => {
        await this.setState({
            params: {
                ...this.state.params,
                offset: 0,
                filters: newFilter
            }
            // paginationParams: {
            //     ...this.state.paginationParams,
            //     currentPage: 0
            // }
        });
        this.updateEntityParams();
        await this.getDocuments();
    };

    resetWildCardFilter = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                filters: null,
                list: null,
                search: ""
            }
        });
        this.updateEntityParams();
        await this.getDocuments();
    };

    updateEntityParams = async () => {
        let entityParams = {
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            tableConfig: this.state.tableData.config,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams
        };
        await this.props.updateDocumentEntityParams(entityParams);
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
        await this.getDocuments();
    };

    updateCommonFilter = async commonFilters => {
        await this.setState({
            params: {
                ...this.state.params,
                page: 1,
                list: commonFilters
            },
            paginationParams: {
                ...this.state.paginationParams,
                currentPage: 0
            }
        });
        this.updateEntityParams();
        this.getDocuments();
    };

    render() {
        const { tableData, params, paginationParams, infoTabsData, logData, historyPaginationParams, historyParams, showWildCardFilter } = this.state;
        const {
            match: {
                params: { section }
            },
            isLoading
        } = this.props;

        if (!checkPermission("forms", "users", "view"))
            return (
                <section className="cont-ara">
                    <div className="list-area">
                        <TopSlider />
                        <div className="lst-bt-nav"></div>
                    </div>
                </section>
            );

        return (
            <React.Fragment>
                <section className="cont-ara">
                    <LoadingOverlay active={isLoading} spinner={<Loader />}>
                        {/* {section === "add" || section === "edit" ? (
                            <Form />
                        ) :  */}
                        {section === "documentinfo" ? (
                            <ViewUser
                                keys={tableData.keys}
                                config={tableData.config}
                                infoTabsData={infoTabsData}
                                showInfoPage={this.showInfoPage}
                                getDataById={this.getDataById}
                                // deleteItem={this.deleteItemConfirm}
                                // showEditPage={this.showEditPage}
                                // getLogData={this.getLogData}
                                // logData={logData}
                                // handleDeleteLog={this.handleDeleteLog}
                                // HandleRestoreLog={this.handleRestoreLog}
                                // handlePageClickHistory={this.handlePageClickHistory}
                                // handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                                // globalSearchKeyHistory={
                                //     this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""
                                // }
                                // historyPaginationParams={historyPaginationParams}
                                // updateLogSortFilters={this.updateLogSortFilters}
                                // historyParams={historyParams}
                                hasLogView={false}
                                hasLogDelete={false}
                                hasLogRestore={false}
                                hasEdit={false}
                                hasDelete={false}
                            />
                        ) : (
                            <>
                                <div className="list-area">
                                    <TopSlider />
                                    <div className="lst-bt-nav">
                                        <div className="table table-ara">
                                            <TableTopHeader
                                                entity={"Document"}
                                                // addItem={this.showAddForm}
                                                handleGlobalSearch={this.handleGlobalSearch}
                                                globalSearchKey={this.state.params.search}
                                                resetSort={this.resetSort}
                                                tableParams={params}
                                                showViewModal={this.showViewModal}
                                                exportTable={this.exportTable}
                                                resetAllFilters={this.resetAllFilters}
                                                toggleFilter={this.toggleFilter}
                                                showWildCardFilter={showWildCardFilter}
                                                resetWildCardFilter={this.resetWildCardFilter}
                                                hasExport={checkPermission("forms", "document", "export")}
                                                showAddButton={false}
                                            />
                                            <div className="list-sec">
                                                <div className="table-section">
                                                    <CommonTable
                                                        // deleteItem={this.deleteItemConfirm}
                                                        // editItem={this.showEditPage}
                                                        tableData={tableData}
                                                        updateTableSortFilters={this.updateTableSortFilters}
                                                        tableParams={params}
                                                        hasSort={true}
                                                        getListForCommonFilter={this.getListForCommonFilter}
                                                        showInfoPage={this.showInfoPage}
                                                        showWildCardFilter={showWildCardFilter}
                                                        updateWildCardFilter={this.updateWildCardFilter}
                                                        updateCommonFilter={this.updateCommonFilter}
                                                        commonFilter={this.state.params.list}
                                                        isWidthAction={true}
                                                        hasEdit={false}
                                                        hasDelete={false}
                                                        showViewDocument={true}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <Pagination
                                            paginationParams={paginationParams}
                                            handlePageClick={this.handlePageClick}
                                            handlePerPageChange={this.handlePerPageChange}
                                            isRecordPerPage={true}
                                        />
                                    </div>
                                </div>

                                {this.renderColumnViewHideModal()}
                            </>
                        )}
                        {this.renderConfirmationModal()}
                        {this.renderConfirmationModalLog()}
                    </LoadingOverlay>
                </section>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { documentReducer } = state;
    return { documentReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(index));
