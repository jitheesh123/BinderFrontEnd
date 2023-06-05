import React, { Component } from "react";
import GlobalSearch from "./GlobalSearch";
import _ from "lodash";
import SendEmailModal from "../../email/components/sendEmailModal";
import Portal from "./Portal";

class TableTopheader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exportLoading: false,
            activeItem: "",
            showSendEmailModal: false
        };
    }
    componentDidMount = () => {};

    renderTitle = entity => {
        let retVal = entity;
        if (entity[entity.length - 1] === "y") {
            retVal = entity.slice(0, -1) + "ies";
        } else if (entity[entity.length - 1] === "s") {
            retVal = entity.slice(0, -1) + "ses";
        } else {
            retVal = entity + "s";
        }
        return retVal;
    };

    isSorted = () => {
        const { tableParams = {} } = this.props;
        if (tableParams.order && !_.isEmpty(tableParams.order)) {
            return true;
        }
        return false;
    };

    exportData = async () => {
        this.setState({
            exportLoading: true
        });
        await this.props.exportTable();
        this.setState({
            exportLoading: false
        });
    };

    setActiveItem = item => {
        this.setState({
            activeItem: item
        });
    };

    isWildCardActive = () => {
        const { tableParams = {} } = this.props;
        if (
            (tableParams.filters && !_.isEmpty(tableParams.filters)) ||
            (tableParams.list && !_.isEmpty(tableParams.list)) ||
            (tableParams.date_filters && !_.isEmpty(tableParams.date_filters))
        ) {
            // if (tableParams.filters && !_.isEmpty(tableParams.filters)) {
            //     let res = Object.keys(tableParams.filters).map(filter =>
            //         filter && tableParams.filters[filter] && tableParams.filters[filter].key && tableParams.filters[filter].key.length ? true : false
            //     );
            //     console.log("res",res)
            //     if (res.includes(true)) {
            //         return true;
            //     }
            // }
            if (tableParams.filters && !_.isEmpty(tableParams.filters)) {
                const filters = Object.keys(tableParams.filters);
                if (Object.values(tableParams.filters).every(item => item.key === null)) {
                    return false;
                }
                for (const item of filters) {
                    if (tableParams.filters[item] && tableParams.filters[item].key && tableParams.filters[item].key.length) {
                        return true;
                    }
                    if (
                        tableParams.filters[item] &&
                        tableParams.filters[item].filters &&
                        (tableParams.filters[item].filters.includes("not_null") || tableParams.filters[item].filters.includes("null"))
                    ) {
                        return true;
                    }
                }
                return true;
            }
            if (tableParams.list && !_.isEmpty(tableParams.list)) {
                let res = Object.keys(tableParams.list).map(filter =>
                    filter && tableParams.list[filter] && tableParams.list[filter].length ? true : false
                );
                if (res.includes(true)) {
                    return true;
                }
            }
        } else {
            return false;
        }
    };

    toggleShowSendEmailModal = () => {
        const { showSendEmailModal } = this.state;
        this.setState({ showSendEmailModal: !showSendEmailModal });
    };

    renderSendEmailModal = () => {
        const { showSendEmailModal } = this.state;
        if (!showSendEmailModal) return null;
        const { tableParams, entity, isReportPage = false, reportParams = null } = this.props;
        return (
            <Portal
                body={
                    <SendEmailModal
                        entity={isReportPage ? "reports" : entity}
                        reportParams={reportParams}
                        tableParams={tableParams}
                        onCancel={() => this.setState({ showSendEmailModal: false })}
                    />
                }
                onCancel={() => this.setState({ showSendEmailModal: false })}
            />
        );
    };

    render() {
        const { activeItem } = this.state;
        const {
            entity,
            addItem,
            handleGlobalSearch,
            showWildCardFilter,
            globalSearchKey = null,
            resetSort,
            toggleFilter,
            showViewModal,
            exportTable,
            resetAllFilters,
            resetWildCardFilter,
            showAddButton = true,
            hasExport = true
        } = this.props;

        return (
            <div className="top-fil-ara title-btn-wrapper">
                <div className="table-heading cap">
                    <h4>{this.renderTitle(entity)}</h4>
                </div>
                <div className="right-cont">
                    <div className="btn-section-2">
                        <div className="btn-toggle">
                            <button
                                className={`btn btn-top ${activeItem === "export" && showWildCardFilter ? "active" : ""}`}
                                title="Filter"
                                onClick={() => {
                                    toggleFilter && toggleFilter();
                                    this.setActiveItem("export");
                                }}
                            >
                                <img src="/images/wild-card.svg" className="mr-0" alt="" />{" "}
                            </button>
                            <button
                                className={`btn btn-top ${this.isWildCardActive() || globalSearchKey ? "active" : ""}`}
                                title="Clear Filter"
                                onClick={() => (this.isWildCardActive() || globalSearchKey) && resetWildCardFilter()}
                            >
                                <img src="/images/reset-wild-card.svg" className="mr-0" alt="" />
                            </button>
                        </div>
                        <button
                            className={`btn btn-top text-center ${this.isSorted() ? "active-reset" : ""}`}
                            title="Reset Sort"
                            onClick={() => this.isSorted() && resetSort()}
                        >
                            <img src="/images/reset-icon.svg" alt="" className="mr-0" />
                        </button>
                        {hasExport ? (
                            this.state.exportLoading ? (
                                <button className="btn btn-top min-wid">
                                    <div className="spinner-border cus-spin text-primary" role="status"></div>
                                </button>
                            ) : (
                                <button className="btn btn-top" onClick={() => exportTable && this.exportData()} title="Export Excel">
                                    <img src="/images/export.svg" alt="" />
                                </button>
                            )
                        ) : null}
                        <button className="btn btn-top" title="Email" onClick={() => this.toggleShowSendEmailModal()}>
                            <img src="/images/mail.svg" alt="" />
                        </button>
                        <button className="btn btn-top" onClick={() => showViewModal()} title="Column Window">
                            <img src="/images/colmns.svg" alt="" />
                        </button>
                        <button className={`btn btn-top`} title="Reset All" onClick={() => resetAllFilters()}>
                            <img src="/images/reset-column.svg" alt="" />
                        </button>
                    </div>
                    <GlobalSearch handleGlobalSearch={handleGlobalSearch} globalSearchKey={globalSearchKey} />
                    {showAddButton && (
                        <div className="fil-btn entity-add-button">
                            <button className="btn btn-add" onClick={() => addItem()}>
                                <span className="icon">
                                    <img src="/images/add-new-region.svg" alt="" />
                                </span>
                                Add {entity}
                            </button>
                        </div>
                    )}
                </div>
                {this.renderSendEmailModal()}
            </div>
        );
    }
}

export default TableTopheader;
