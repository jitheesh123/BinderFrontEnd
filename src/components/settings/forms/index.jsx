import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";

import actions from "./actions";
import TopSlider from "../../../components/common/components/TopSlider";
import history from "../../../config/history";
import ToastMsg from "../../common/ToastMessage";
import CommonTable from "../../../components/common/components/CommonTable";
import TableTopHeader from "../../../components/common/components/TableTopHeader";
import Pagination from "../../../components/common/components/Pagination";
import Portal from "../../common/components/Portal";
import ConfirmationModal from "../../../components/common/components/ConfirmationModal";
import { formTableData } from "./tableConfig";
import ViewModal from "../../common/components/ViewModal";
import FormModal from "./components/formModal";
import FormRecordsModal from "./components/FormRecordsModal";
import UploadRecordModal from "./components/UploadRecordModal";
import { checkPermission } from "../../../config/utils";
import Loader from "../../common/components/Loader";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consultancyList: [],
            tableData: formTableData,
            showConfirmation: false,
            selectedItem: null,
            params: this.props.formReducer.entityParams.params,
            paginationParams: this.props.formReducer.entityParams.paginationParams,
            showViewModal: false,
            selectedForm: this.props.match.params.id,
            logData: {
                count: "",
                data: []
            },
            historyPaginationParams: this.props.formReducer.entityParams.historyPaginationParams,
            historyParams: this.props.formReducer.entityParams.historyParams,
            showConfirmModalLog: false,
            selectedLog: "",
            isRestoreOrDelete: "",
            showWildCardFilter: false,
            showUpdateFrequencyDeemingAgencyAssigmentModal: false,
            showFormModal: false,
            formDetails: {},
            showFormRecordsModal: false,
            showUploadRecordModal: false,
            activeDocType: null,
            formRecords: [],
            selectedFormRecords: []
        };
    }

    componentDidMount = async () => {
        await this.setState({
            tableData: {
                ...this.state.tableData,
                keys: formTableData.keys,
                config: this.props.formReducer.entityParams.tableConfig || formTableData.config
            }
        });
        await this.getFormData();
    };

    componentDidUpdate = async prevProps => {
        if (prevProps.masterFilters !== this.props.masterFilters) {
            await this.getFormData();
        }
    };

    getFormData = async () => {
        this.props.setIsLoading(true);
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        const { params, paginationParams } = this.state;
        const { tableData } = this.state;
        await this.props.getForm({ ...params, ...master_filters });
        if (this.props.formReducer.formData.success) {
            this.setState({
                tableData: {
                    ...tableData,
                    data: this.props.formReducer.formData.forms
                },
                paginationParams: {
                    ...paginationParams,
                    totalCount: this.props.formReducer.formData.count,
                    totalPages: Math.ceil(this.props.formReducer.formData.count / paginationParams.perPage)
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
            selectedForm: id
        });
        this.togglShowConfirmation();
    };

    deleteItem = async () => {
        const { selectedForm } = this.state;
        this.togglShowConfirmation();
        await this.props.deleteForm(selectedForm);
        await this.getFormData();
        ToastMsg(this.props.formReducer.deleteformById.message, "info");
    };

    viewItem = async item => {
        const { tableData } = this.state;
        history.push("/building_type/basicdetails", { item: item, keys: tableData.keys, config: tableData.config });
    };

    editItem = async item => {
        history.push("/editDeemingAgency", { consultancyItem: item });
    };

    addItem = async () => {
        this.props.history.push("/addDeemingAgency");
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
        await this.getFormData();
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
        await this.getFormData();
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
        await this.getFormData();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.getFormData();
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
        await this.props.getListForCommonFilterForForm({ ...params, ...master_filters });
        return (this.props.formReducer.getListForCommonFilterResponse && this.props.formReducer.getListForCommonFilterResponse.list) || [];
    };

    showEditPage = async id => {
        this.setState({
            selectedForm: id
        });
        await this.getFormDetails(id);
        this.toggleShowFormModal();
    };

    showAddForm = () => {
        this.setState({
            selectedForm: null,
            selectedFormRecords: []
        });
        this.toggleShowFormModal();
    };

    formAddHandler = async data => {
        const { selectedFormRecords } = this.state;
        data.form.record_ids = selectedFormRecords;
        await this.props.addForm(data);
        await this.getFormData();
        this.toggleShowFormModal();
    };

    updateFormHandler = async data => {
        const { selectedForm } = this.state;
        await this.props.editFormById(data, selectedForm);
        await this.getFormData();
        this.toggleShowFormModal();
    };

    getFormDetails = async id => {
        await this.props.getFormById(id);
        const {
            formReducer: {
                getformByIdResponse: { form = {} }
            }
        } = this.props;
        let tempSelectedRecords = [];
        form &&
            form.records &&
            form.records.map((item, i) => {
                tempSelectedRecords.push(item.record_id);
            });
        await this.setState({
            selectedFormRecords: tempSelectedRecords
        });
        await this.setState({
            formDetails: form
        });
        return true;
    };

    toggleShowFormModal = async () => {
        await this.setState({
            showFormModal: !this.state.showFormModal
        });
        await this.getFormRecords();
    };

    renderFormModal = () => {
        const { showFormModal, formDetails, selectedFormRecords, formRecords, selectedForm } = this.state;
        if (!showFormModal) return null;
        return (
            <Portal
                body={
                    <FormModal
                        formRecords={formRecords}
                        toggleShowActivityEventDocumentsModal={this.toggleShowFormRecordsModal}
                        formDetails={formDetails}
                        selectedFormRecords={selectedFormRecords}
                        saveForm={this.formAddHandler}
                        UpdateSelectedFormRecords={this.UpdateSelectedFormRecords}
                        removeAttachment={this.removeAttachment}
                        onCancel={this.toggleShowFormModal}
                        selectedForm={selectedForm}
                        updateForm={this.updateFormHandler}
                        viewOnly={selectedForm ? !checkPermission("forms", "forms", "edit") : !checkPermission("forms", "forms", "create")}
                    />
                }
                onCancel={this.toggleShowFormModal}
            />
        );
    };

    toggleShowFormRecordsModal = () => {
        const { showFormRecordsModal } = this.state;
        this.setState({
            showFormRecordsModal: !showFormRecordsModal
        });
    };

    renderFormRecordsModal = data => {
        const { showFormRecordsModal, formRecords, selectedFormRecords } = this.state;
        if (!showFormRecordsModal) return null;
        return (
            <Portal
                body={
                    <FormRecordsModal
                        formRecords={formRecords}
                        selectedFormRecords={selectedFormRecords}
                        toggleShowUploadRecordModal={this.toggleShowUploadRecordModal}
                        UpdateSelectedFormRecords={this.UpdateSelectedFormRecords}
                        attachSelectedFormRecords={this.attachSelectedFormRecords}
                        onCancel={this.toggleShowFormRecordsModal}
                    />
                }
                onCancel={this.toggleShowFormRecordsModal}
            />
        );
    };

    attachSelectedFormRecords = async selectedFormRecords => {
        let tempDcos = this.state.selectedFormRecords;
        selectedFormRecords.map(item => tempDcos.push(item));
        await this.setState({
            selectedFormRecords: tempDcos
        });
        this.toggleShowFormRecordsModal();
    };

    UpdateSelectedFormRecords = async selectedFormRecords => {
        await this.setState({
            selectedFormRecords
        });
    };

    removeAttachment = async id => {
        await this.props.removeAttachment(id);
        const {
            formReducer: {
                removeAttachmentResponse: { success, message }
            }
        } = this.props;
        if (success) {
            const { selectedForm } = this.state;
            await this.getFormDetails(selectedForm);
        }
        ToastMsg(message, "info");
    };

    toggleShowUploadRecordModal = (doc_type = null) => {
        const { showUploadRecordModal } = this.state;
        this.setState({
            showUploadRecordModal: !showUploadRecordModal,
            activeDocType: doc_type
        });
    };

    renderUploadRecordModal = data => {
        const { showUploadRecordModal, activeDocType } = this.state;
        if (!showUploadRecordModal) return null;
        return (
            <Portal
                body={
                    <UploadRecordModal
                        activeDocType={activeDocType}
                        handleUploadFile={this.handleUploadFile}
                        onCancel={this.toggleShowUploadRecordModal}
                    />
                }
                onCancel={this.toggleShowUploadRecordModal}
            />
        );
    };

    handleUploadFile = async (records, option, doc_type) => {
        let formData = new FormData();
        if (records && records.length) {
            records.map((item, i) => formData.append(`record[${i}]`, item));
        }
        formData.append("option", option);
        await this.props.uploadFormRecords(formData);

        const {
            formReducer: {
                uploadRecordsResponse: { message }
            }
        } = this.props;

        await this.getFormRecords();
        this.toggleShowUploadRecordModal();
        ToastMsg(message, "info");
    };

    getFormRecords = async () => {
        await this.props.getFormRecords();
        const {
            formReducer: {
                getFormRecordsResponse: { records = [] }
            }
        } = this.props;
        await this.setState({
            formRecords: records
        });
        return true;
    };

    exportTable = async () => {
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        await this.props.exportForm({
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order,
            ...master_filters
        });
    };

    getLogData = async id => {
        const { historyParams } = this.state;
        await this.props.getAllBuildingTypeLogs(historyParams, id);
        const {
            formReducer: {
                getAllbuildingTypeLogResponse: { logs, count }
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
        await this.props.deleteBuildingTypeLog(selectedLog);
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    handleRestoreLog = async id => {
        await this.props.restoreBuildingTypeLog(id);
        await this.getFormData();
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
                config: formTableData.config
            }
        });
        this.updateEntityParams();
        await this.getFormData();
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
        await this.getFormData();
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
        await this.getFormData();
    };

    updateEntityParams = async () => {
        let entityParams = {
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            tableConfig: this.state.tableData.config,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams
        };
        await this.props.updateFormEntityParams(entityParams);
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
        await this.getFormData();
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
        this.getFormData();
    };

    render() {
        const { tableData, params, paginationParams, infoTabsData, logData, historyPaginationParams, historyParams, showWildCardFilter } = this.state;
        const {
            match: {
                params: { section }
            },
            isLoading
        } = this.props;

        if (!checkPermission("forms", "forms", "view"))
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
                        <>
                            <div className="list-area">
                                <TopSlider />
                                <div className="lst-bt-nav">
                                    <div className="table table-ara">
                                        <TableTopHeader
                                            entity={"Form"}
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
                                            hasExport={checkPermission("forms", "forms", "export")}
                                            showAddButton={checkPermission("forms", "forms", "create")}
                                        />
                                        <div className="list-sec">
                                            <div className="table-section">
                                                <CommonTable
                                                    viewItem={this.viewItem}
                                                    deleteItem={this.deleteItemConfirm}
                                                    editItem={this.showEditPage}
                                                    tableData={tableData}
                                                    updateTableSortFilters={this.updateTableSortFilters}
                                                    tableParams={params}
                                                    hasSort={true}
                                                    getListForCommonFilter={this.getListForCommonFilter}
                                                    showInfoPage={this.showEditPage}
                                                    showWildCardFilter={showWildCardFilter}
                                                    updateWildCardFilter={this.updateWildCardFilter}
                                                    updateCommonFilter={this.updateCommonFilter}
                                                    commonFilter={this.state.params.list}
                                                    hasEdit={checkPermission("forms", "forms", "edit")}
                                                    hasDelete={checkPermission("forms", "forms", "delete")}
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
                        {this.renderConfirmationModal()}
                        {this.renderConfirmationModalLog()}
                        {this.renderFormModal()}
                        {this.renderFormRecordsModal()}
                        {this.renderUploadRecordModal()}
                    </LoadingOverlay>
                </section>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { formReducer } = state;
    return { formReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(index));
