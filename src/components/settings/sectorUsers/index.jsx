import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

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
import { userTableData, sectotUserTableData } from "./components/tableConfig";
import ViewModal from "../../common/components/ViewModal";
import ViewUser from "./components/viewUser";
import CommonActions from "./../../common/actions";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consultancyList: [],
            tableData: props.match.params.tab && props.match.params.tab === "assignedconsultancy_users" ? sectotUserTableData : userTableData,
            showConfirmation: false,
            selectedItem: null,
            params: this.props.sectorUserReducer.entityParams.params,
            paginationParams: this.props.sectorUserReducer.entityParams.paginationParams,
            showViewModal: false,
            selectedUser: this.props.match.params.id,
            showViewModal: false,
            showConfirmModalLog: false,
            selectedLog: "",
            isRestoreOrDelete: "",
            showWildCardFilter: false,
            showUpdateLogbookConsultancyAssigmentModal: false
        };
    }

    componentDidMount = async () => {
        // await this.setState({
        //     tableData: {
        //         ...this.state.tableData,
        //         keys: userTableData.keys,
        //         config: this.props.sectorUserReducer.entityParams.tableConfig || userTableData.config
        //     }
        // });
        await this.getUsers();
    };

    componentDidUpdate = async prevProps => {
        if (prevProps.role !== this.props.role) {
            await this.getUsers();
        }
        if (this.props.commonReducer.AssignPopUpApiTrigger && this.props.commonReducer.AssignPopUpApiTrigger.isTrigger == true) {
            await this.props.updateAssignPopUpApiTrigger({ isTrigger: false });
            await this.getUsers();
        }
    };

    getUsers = async () => {
        const { params, paginationParams } = this.state;
        const { tableData } = this.state;
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        let sectorId = this.props.match.params.id;
        await this.props.getUsers({ ...params, sector_id: sectorId, role: tab === "assignedclient_users" ? "client_user" : "consultancy_user" });
        if (this.props.sectorUserReducer.usersData.success) {
            this.setState({
                tableData: {
                    ...tableData,
                    keys:
                        this.props.match.params.tab && this.props.match.params.tab === "assignedconsultancy_users"
                            ? sectotUserTableData.keys
                            : userTableData.keys,
                    config:
                        // this.props.sectorUserReducer.entityParams.tableConfig ||
                        (this.props.match.params.tab && this.props.match.params.tab === "assignedconsultancy_users")
                            ? sectotUserTableData.config
                            : userTableData.config,
                    data: this.props.sectorUserReducer.usersData.sector_users
                },
                paginationParams: {
                    ...paginationParams,
                    totalCount: this.props.sectorUserReducer.usersData.count,
                    totalPages: Math.ceil(this.props.sectorUserReducer.usersData.count / paginationParams.perPage)
                },
                showWildCardFilter: this.state.params.filters ? true : false
            });
        }
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
        const {
            match: {
                params: { section }
            }
        } = this.props;
        const { selectedUser } = this.state;
        let previousPath = this.props.location && this.props.location.state && this.props.location.state.prevPath;
        this.togglShowConfirmation();
        await this.props.deleteUsers(selectedUser);
        await this.getUsers();
        ToastMsg(this.props.sectorUserReducer.deleteUsersById.message, "info");
        if (section && section === "sectoruserinfo") {
            if (previousPath) {
                history.push(previousPath);
            } else {
                history.go(-2);
            }
        }
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
        await this.getUsers();
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
        await this.getUsers();
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
        await this.getUsers();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.getUsers();
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
        const { search, filters, list } = this.state.params;
        let sectorId = this.props.match.params.id;
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        params.search = search;
        params.filters = filters;
        params.list = list;
        params.sector_id = sectorId;
        params.role = tab === "assignedclient_users" ? "client_user" : "consultancy_user";
        await this.props.getListForCommonFilterForUsers(params);
        return (
            (this.props.sectorUserReducer.getListForCommonFilterResponse && this.props.sectorUserReducer.getListForCommonFilterResponse.list) || []
        );
    };

    showInfoPage = (id, choice, path = "") => {
        const { history } = this.props;
        const currentPath = this.props.location.pathname;
        this.setState({
            selectedUser: id,
            infoTabsData: [{ label: "Basic Details", path: `/sectoruser/sectoruserinfo/${id}/basicdetails`, key: "basicdetails" }]
        });
        history.push(`/sectoruser/sectoruserinfo/${id}/basicdetails`, { prevPath: path ? path : currentPath });
    };

    getDataById = async id => {
        await this.props.getUsersById(id);
        return this.props.sectorUserReducer.getUsersById;
    };

    exportTable = async () => {
        const { params } = this.state;
        let sectorId = this.props.match.params.id;
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        await this.props.exportUsers({
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order,
            sector_id: sectorId,
            role: tab === "assignedclient_users" ? "client_user" : "consultancy_user"
        });
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
                config:
                    this.props.match.params.tab && this.props.match.params.tab === "assignedconsultancy_users"
                        ? sectotUserTableData.config
                        : userTableData.config
            }
        });
        this.updateEntityParams();
        await this.getUsers();
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
        });
        this.updateEntityParams();
        await this.getUsers();
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
        await this.getUsers();
    };

    updateEntityParams = async () => {
        let entityParams = {
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            tableConfig: this.state.tableData.config,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams
        };
        await this.props.updateUsersEntityParams(entityParams);
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
        await this.getUsers();
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
        this.getUsers();
    };

    render() {
        const { tableData, params, paginationParams, infoTabsData, showWildCardFilter } = this.state;
        const {
            match: {
                params: { section }
            }
        } = this.props;
        return (
            <React.Fragment>
                {section === "sectoruserinfo" ? (
                    <ViewUser
                        keys={tableData.keys}
                        config={tableData.config}
                        infoTabsData={infoTabsData}
                        showInfoPage={this.showInfoPage}
                        getDataById={this.getDataById}
                        deleteItem={this.deleteItemConfirm}
                        hasDelete={checkPermission("assign", "sectors", "users")}
                    />
                ) : (
                    <section className="cont-ara">
                        <div className="list-area">
                            <TopSlider />
                            <div className="lst-bt-nav">
                                <div className="table table-ara">
                                    <TableTopHeader
                                        entity={"Sector User"}
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
                                    />
                                    <div className="list-sec">
                                        <div className="table-section">
                                            <CommonTable
                                                deleteItem={this.deleteItemConfirm}
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
                                                hasEdit={false}
                                                hasDelete={checkPermission("assign", "sectors", "users")}
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
                    </section>
                )}
                {this.renderConfirmationModal()}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { sectorUserReducer, commonReducer } = state;
    return { sectorUserReducer, commonReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions, ...CommonActions })(index));
