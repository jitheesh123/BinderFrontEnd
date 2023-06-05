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
import { assetTableData } from "./components/tableConfig";
import ViewModal from "../../common/components/ViewModal";
import ViewAsset from "./components/viewAsset";
import Form from "./components/assetForm";
import Loader from "../../common/components/Loader";
import UpdateAssetLogbookSchedulingModal from "./components/UpdateAssetLogbookSchedulingModal";
import UpdateAssetActivitySchedulingMoadl from "./components/UpdateAssetActivitySchedulingMoadl";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consultancyList: [],
            tableData: assetTableData,
            showConfirmation: false,
            selectedItem: null,
            params: this.props.assetReducer.entityParams.params,
            paginationParams: this.props.assetReducer.entityParams.paginationParams,
            showViewModal: false,
            selectedAsset: this.props.match.params.id,
            logData: {
                count: "",
                data: []
            },
            historyPaginationParams: this.props.assetReducer.entityParams.historyPaginationParams,
            historyParams: this.props.assetReducer.entityParams.historyParams,
            showConfirmModalLog: false,
            selectedLog: "",
            isRestoreOrDelete: "",
            showWildCardFilter: false,
            showUpdateFrequencyDeemingAgencyAssigmentModal: false,
            imageResponse: [],
            showAssetLogbookSchedulingModal: false,
            showAssetActivitySchedulingMoadl: false
        };
    }

    componentDidMount = async () => {
        await this.setState({
            tableData: {
                ...this.state.tableData,
                keys: assetTableData.keys,
                config: this.props.assetReducer.entityParams.tableConfig || assetTableData.config
            }
        });
        await this.getAssetData();
    };

    componentDidUpdate = async prevProps => {
        if (prevProps.masterFilters !== this.props.masterFilters) {
            await this.getAssetData();
        }
    };

    getAssetData = async () => {
        this.props.setIsLoading(true);
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        const { params, paginationParams, tableData } = this.state;
        const { buildingId = null } = this.props;
        await this.props.getAsset({ ...params, ...master_filters, building_id: buildingId });
        if (this.props.assetReducer.assetData.success) {
            this.setState({
                tableData: {
                    ...tableData,
                    data: this.props.assetReducer.assetData.assets
                },
                paginationParams: {
                    ...paginationParams,
                    totalCount: this.props.assetReducer.assetData.count,
                    totalPages: Math.ceil(this.props.assetReducer.assetData.count / paginationParams.perPage)
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
            selectedAsset: id
        });
        this.togglShowConfirmation();
    };

    deleteItem = async () => {
        const { selectedAsset } = this.state;
        let path = (this.props.location.state && this.props.location.state.prevPath) || "/assets";
        this.togglShowConfirmation();
        await this.props.deleteAsset(selectedAsset);
        await this.getAssetData();
        ToastMsg(this.props.assetReducer.deleteAssetResponse.message, "info");
        if (this.props.match.params.id) {
            history.push(path);
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
        await this.getAssetData();
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
        await this.getAssetData();
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
        await this.getAssetData();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.getAssetData();
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
        const { buildingId = null } = this.props;
        params.search = search;
        params.filters = filters;
        params.list = list;
        await this.props.getListForCommonFilterForAsset({ ...params, ...master_filters, building_id: buildingId });
        return (this.props.assetReducer.getListForCommonFilterResponse && this.props.assetReducer.getListForCommonFilterResponse.list) || [];
    };

    showInfoPage = (id, path = "") => {
        const { history } = this.props;
        const currentPath = this.props.location.pathname;

        this.setState({
            selectedAsset: id,
            infoTabsData: [
                { label: "Basic Details", path: `/asset/assetinfo/${id}/basicdetails`, key: "basicdetails", prevPath: path ? path : currentPath },
                { label: "Images", path: `/asset/assetinfo/${id}/images`, key: "images", prevPath: path ? path : currentPath }
            ]
        });
        history.push(`/asset/assetinfo/${id}/${"basicdetails"}`, { prevPath: path ? path : currentPath });
    };

    getDataById = async id => {
        await this.props.getAssetById(id);
        return this.props.assetReducer.getAssetByIdResponse;
    };

    showEditPage = id => {
        this.setState({
            selectedAsset: id
        });
        history.push(`/asset/edit/${id}`, { prevPath: this.props.location.pathname || "/assets" });
    };

    showAddForm = () => {
        this.setState({
            selectedAsset: null
        });
        history.push("/asset/add", { prevPath: this.props.location.pathname || "/assets" });
    };

    exportTable = async () => {
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        const { params } = this.state;
        const { buildingId = null } = this.props;
        await this.props.exportAsset({
            search: params.search,
            filters: params.filters,
            list: params.list,
            order: params.order,
            building_id: buildingId,
            ...master_filters
        });
    };

    getLogData = async id => {
        const { historyParams } = this.state;
        await this.props.getAllAssetLogs(historyParams, id);
        const {
            assetReducer: {
                getAllAssetLogResponse: { logs, count }
            }
        } = this.props;
        await this.setState({
            logData: {
                ...this.state.logData,
                data: logs
            },
            historyPaginationParams: {
                ...this.state.historyPaginationParams,
                totalCount: count,
                totalPages: Math.ceil(count / this.state.historyPaginationParams.perPage)
            }
        });
    };

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
        await this.props.deleteAssetLog(selectedLog);
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    handleRestoreLog = async id => {
        await this.props.restoreAssetLog(id);
        await this.getAssetData();
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
        await this.getLogData(this.props.match.params.id);
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
                config: assetTableData.config
            }
        });
        this.updateEntityParams();
        await this.getAssetData();
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
        await this.getAssetData();
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
        await this.getAssetData();
    };

    updateEntityParams = async () => {
        let entityParams = {
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            tableConfig: this.state.tableData.config,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams
        };
        await this.props.updateAssetEntityParams(entityParams);
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
        await this.getActivityData();
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
        await this.getAssetData();
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
        this.getAssetData();
    };

    getAllImageList = async id => {
        await this.props.getAllAssetImages(id);
        const {
            assetReducer: {
                getAllImagesResponse: { images }
            }
        } = this.props;
        await this.setState({
            imageResponse: images
        });
        return true;
    };

    uploadImages = async (imageData = {}) => {
        const { selectedAsset } = this.state;
        await this.props.uploadAssetImage(imageData, selectedAsset || this.props.match.params.id);
        await this.getAllImageList(selectedAsset);
        return true;
    };

    updateImageComment = async imageData => {
        const { selectedAsset } = this.state;
        await this.props.updateAssetImageComment(imageData);
        await this.getAllImageList(selectedAsset);
        return true;
    };

    deleteImages = async imageId => {
        const { selectedAsset } = this.state;
        await this.props.deleteAssetImage(imageId);
        await this.getAllImageList(selectedAsset);
        return true;
    };

    getBuildingId = () => {
        const { selectedItem } = this.state;
        const {
            assetReducer: {
                assetData: { assets = [] }
            }
        } = this.props;
        let buildingId = null;
        if (assets && assets.length) {
            buildingId = assets.find(item => item.id === selectedItem) ? assets.find(item => item.id === selectedItem).building.id : null;
        }
        return buildingId;
    };

    toggleShowAssetLogbookSchedulingModal = () => {
        const { showAssetLogbookSchedulingModal } = this.state;
        this.setState({
            showAssetLogbookSchedulingModal: !showAssetLogbookSchedulingModal
        });
    };

    updateAssetLogbookScheduling = async selectedItem => {
        await this.setState({
            selectedItem
        });
        this.toggleShowAssetLogbookSchedulingModal();
    };

    renderAssetLogbookSchedulingModal = () => {
        const { showAssetLogbookSchedulingModal, selectedItem } = this.state;
        if (!showAssetLogbookSchedulingModal) return null;
        let building_id = this.getBuildingId();
        return (
            <Portal
                body={
                    <UpdateAssetLogbookSchedulingModal
                        id={selectedItem}
                        building_id={building_id}
                        onCancel={this.toggleShowAssetLogbookSchedulingModal}
                        onOk={this.deleteItem}
                    />
                }
                onCancel={this.toggleShowAssetLogbookSchedulingModal}
            />
        );
    };

    toggleShowAssetActivitySchedulingMoadl = () => {
        const { showAssetActivitySchedulingMoadl } = this.state;
        this.setState({
            showAssetActivitySchedulingMoadl: !showAssetActivitySchedulingMoadl
        });
    };

    updateAssetActivityScheduling = async selectedItem => {
        await this.setState({
            selectedItem
        });
        this.toggleShowAssetActivitySchedulingMoadl();
    };

    renderAssetActivitySchedulingMoadl = () => {
        const { showAssetActivitySchedulingMoadl, selectedItem } = this.state;
        if (!showAssetActivitySchedulingMoadl) return null;
        let building_id = this.getBuildingId();
        return (
            <Portal
                body={
                    <UpdateAssetActivitySchedulingMoadl
                        id={selectedItem}
                        building_id={building_id}
                        onCancel={this.toggleShowAssetActivitySchedulingMoadl}
                        onOk={this.deleteItem}
                    />
                }
                onCancel={this.toggleShowAssetActivitySchedulingMoadl}
            />
        );
    };

    render() {
        const {
            tableData,
            params,
            paginationParams,
            infoTabsData,
            logData,
            historyPaginationParams,
            historyParams,
            showWildCardFilter,
            imageResponse
        } = this.state;
        const {
            match: {
                params: { section }
            },
            location: { pathname },
            isLoading
        } = this.props;
        if (!checkPermission("forms", "assets", "view"))
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
                        {section === "add" || section === "edit" ? (
                            <Form />
                        ) : section === "assetinfo" ? (
                            <ViewAsset
                                keys={tableData.keys}
                                config={tableData.config}
                                infoTabsData={infoTabsData}
                                showInfoPage={this.showInfoPage}
                                getDataById={this.getDataById}
                                deleteItem={this.deleteItemConfirm}
                                showEditPage={this.showEditPage}
                                getLogData={this.getLogData}
                                logData={logData}
                                handleDeleteLog={this.handleDeleteLog}
                                HandleRestoreLog={this.handleRestoreLog}
                                handlePageClickHistory={this.handlePageClickHistory}
                                handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                                globalSearchKeyHistory={
                                    this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""
                                }
                                historyPaginationParams={historyPaginationParams}
                                updateLogSortFilters={this.updateLogSortFilters}
                                updateAssignActivity={this.updateAssetActivityScheduling}
                                updateScheduling={this.updateAssetLogbookScheduling}
                                historyParams={historyParams}
                                hasLogView={checkPermission("logs", "assets", "view")}
                                hasLogDelete={checkPermission("logs", "assets", "delete")}
                                hasLogRestore={checkPermission("logs", "assets", "restore")}
                                hasEdit={checkPermission("forms", "assets", "edit")}
                                hasDelete={checkPermission("forms", "assets", "delete")}
                                hasLogbookAssign={checkPermission("assign", "assets", "logbooks")}
                                hasActivityAssign={checkPermission("assign", "assets", "activities")}
                                getAllImageList={this.getAllImageList}
                                imageResponse={imageResponse}
                                uploadImages={this.uploadImages}
                                updateImageComment={this.updateImageComment}
                                deleteImages={this.deleteImages}
                            />
                        ) : (
                            <>
                                <div className="list-area">
                                    <TopSlider />
                                    <div className="lst-bt-nav">
                                        <div className="table table-ara">
                                            <TableTopHeader
                                                entity={"Asset"}
                                                addItem={this.showAddForm}
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
                                                hasExport={checkPermission("forms", "assets", "export")}
                                                showAddButton={pathname === "/assets" ? checkPermission("forms", "assets", "create") : false}
                                            />
                                            <div className="list-sec">
                                                <div className="table-section">
                                                    <CommonTable
                                                        deleteItem={this.deleteItemConfirm}
                                                        editItem={this.showEditPage}
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
                                                        updateScheduling={this.updateAssetLogbookScheduling}
                                                        updateActivityScheduling={this.updateAssetActivityScheduling}
                                                        hasEdit={pathname === "/assets" ? checkPermission("forms", "assets", "edit") : false}
                                                        hasDelete={pathname === "/assets" ? checkPermission("forms", "assets", "delete") : false}
                                                        hasActionActivityScheduling={checkPermission("assign", "assets", "activities")}
                                                        hasActionCalendar={checkPermission("assign", "assets", "logbooks")}
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
                        {this.renderAssetLogbookSchedulingModal()}
                        {this.renderAssetActivitySchedulingMoadl()}
                    </LoadingOverlay>
                </section>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { assetReducer } = state;
    return { assetReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(index));
