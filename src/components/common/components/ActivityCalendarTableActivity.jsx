import React, { Component } from "react";
import Highlighter from "react-highlight-words";
import _ from "lodash";
import ReactTooltip from "react-tooltip";

import WildCardFilter from "./WildCardFilter";
import { formatNumber, formatmoney } from "../../../config/utils";
import { checkPermission } from "../../../config/utils";
import Loader from "./Loader";

class ActivityCalendarTableActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFieldForCommonSearch: null,
            filterList: [],
            commonFilterParams: this.props.commonFilter || {},
            selectAll: "",
            isCancel: false,
            isOk: false,
            isLoadingDropdown: false
        };
    }

    componentDidMount = () => {
        window.addEventListener("click", e => {
            let activityTableHeaderRow = document.getElementById("activityTableHeaderRow");
            if (activityTableHeaderRow && !activityTableHeaderRow.contains(e.target) && !e.target.hasAttribute("is-dropdown-item")) {
                this.setState({
                    selectedFieldForCommonSearch: null
                });
            }
        });
        this.initiateTableResize();
        for (let i = 0; i <= 16; i++) {
            this.initiateColumnResize(".activity-table-col" + i, i);
        }
        this.setScrollTopToTableContainer();
        if (this.props.commonFilter) {
            if (!this.state.isOk && Object.keys(this.props.commonFilter).length !== 0) {
                let initialValue = {};
                Object.keys(this.props.commonFilter).map(fil => {
                    initialValue = { ...initialValue, [fil]: true };
                });
                this.setState({
                    isOk: initialValue,
                    isCancel: initialValue
                });
            }
        }
    };

    componentDidUpdate = prevProps => {
        if (this.props.activityTableWidth !== prevProps.activityTableWidth) {
            this.initiateTableResize();
        }
        if (this.props.scrollTop !== prevProps.scrollTop) {
            this.setScrollTopToTableContainer();
        }
        if (prevProps.commonFilter !== this.props.commonFilter) {
            if (!_.isEmpty(this.props.commonFilter)) {
                const { selectAll } = [];
                let temp = selectAll;
                Object.keys(this.props.commonFilter).map(fil => {
                    if (this.props.commonFilter[fil] && this.props.commonFilter[fil].length == this.state.filterList.length) {
                        temp = { ...selectAll, [fil]: true };
                        this.setState({
                            selectAll: temp
                        });
                    }
                });
            } else {
                this.setState({
                    selectAll: {}
                });
            }
            this.setState({
                commonFilterParams: this.props.commonFilter || {},
                selectedFieldForCommonSearch: !this.props.commonFilter ? null : this.state.selectedFieldForCommonSearch
            });
        }
    };

    setScrollTopToTableContainer = () => {
        let tabContainer = document.getElementById("activity-table-container");
        tabContainer.scrollTop = this.props.scrollTop;
    };

    OnScroll = event => {
        const { updateScrollTop } = this.props;
        updateScrollTop(event.target.scrollTop);
    };

    setActivityTableWidth = async activityTableWidth => {
        await this.props.setActivityTableWidth(activityTableWidth);
    };

    initiateColumnResize = (className, index) => {
        let activityTable = document.querySelector(className);
        if (activityTable) {
            activityTable.className = activityTable.className + " resizable";
            let resizer = document.createElement("div");
            resizer.className = `resizer${index}`;
            activityTable.appendChild(resizer);
            resizer.addEventListener("mousedown", initDrag, false);
            let startX, startWidth;

            function initDrag(e) {
                e.preventDefault();
                startX = e.clientX;
                startWidth = parseInt(document.defaultView.getComputedStyle(activityTable).width, 10);
                document.documentElement.addEventListener("mousemove", doDrag, false);
                document.documentElement.addEventListener("mouseup", stopDrag, false);
            }

            function doDrag(e) {
                let currentWidth = startWidth + e.clientX - startX;
                activityTable.style.minWidth = currentWidth + "px";
            }

            function stopDrag(e) {
                document.documentElement.removeEventListener("mousemove", doDrag, false);
                document.documentElement.removeEventListener("mouseup", stopDrag, false);
            }
        }
    };

    initiateTableResize = () => {
        const { activityTableWidth } = this.props;
        let self = this;
        let activityTable = document.querySelector(".file-system-sec-left");
        activityTable.style.width = activityTableWidth;
        activityTable.className = activityTable.className + " resizable";
        let resizer = document.createElement("div");
        resizer.className = "resizer";
        activityTable.appendChild(resizer);
        resizer.addEventListener("mousedown", initDrag, false);
        let startX, startWidth;

        function initDrag(e) {
            e.preventDefault();
            startX = e.clientX;
            startWidth = parseInt(document.defaultView.getComputedStyle(activityTable).width, 10);
            document.documentElement.addEventListener("mousemove", doDrag, false);
            document.documentElement.addEventListener("mouseup", stopDrag, false);
        }

        function doDrag(e) {
            let currentWidth = startWidth + e.clientX - startX;
            if (currentWidth >= 0) {
                activityTable.style.width = currentWidth + "px";
            } else {
                activityTable.style.width = "0px";
            }
            activityTable.style.maxWidth = "98%";
            activityTable.style.height = "100%";
        }

        function stopDrag(e) {
            self.setActivityTableWidth(activityTable.style.width);
            document.documentElement.removeEventListener("mousemove", doDrag, false);
            document.documentElement.removeEventListener("mouseup", stopDrag, false);
        }
    };

    setSortOrderParams = async (event, searchKey) => {
        const { schedules } = this.props;
        if (schedules && schedules.length) {
            var thIconsContainer = document.getElementById(`thIconsContainer_${searchKey}`);
            if (thIconsContainer && !thIconsContainer.contains(event.target)) {
                await this.props.updateTableSortFilters(searchKey);
            }
        }
    };

    setSearchKeysArray = () => {
        const { tableParams = {} } = this.props;
        let returnArray = [];
        if (tableParams && tableParams.search) {
            returnArray.push(tableParams.search.toString());
        }
        if (tableParams && tableParams.filters && !_.isEmpty(tableParams.filters)) {
            const filters = Object.keys(tableParams.filters);
            for (const item of filters) {
                if (tableParams.filters[item] && tableParams.filters[item].key && tableParams.filters[item].key.length) {
                    if (tableParams.filters[item].filters[0] === "like") {
                        returnArray = returnArray.concat(tableParams.filters[item].key.toString().split("_").join("").split("%").join("").split("~"));
                    } else if (tableParams.filters[item].key.toString().includes("~")) {
                        returnArray = returnArray.concat(tableParams.filters[item].key.toString().split("~"));
                    } else {
                        returnArray.push(tableParams.filters[item].key.toString());
                    }
                }
            }
        }
        return returnArray;
    };

    renderCellData = (type, data) => {
        let returnData = data;
        switch (type) {
            case "string":
                returnData = data || "-";
                break;
            case "date":
                returnData = data || "-";
                break;
            case "object":
                returnData = (data && data.name) || "-";
                break;
            case "boolean":
                returnData = data === "true" || data === true || data === "yes" ? "Yes" : "No";
                break;
            case "number":
                returnData = data ? formatNumber(parseInt(data)) : "-";
                break;
            case "money":
                returnData = data ? formatmoney(parseInt(data)) : "-";
                break;
            case "window":
                if (data?.includes("~")) {
                    // returnData = data.replace(/~/g, "\n");
                    let dataToArray = data?.split("~").map(item => `${item.trim()}`).join("\n")
                    ;  
                    returnData = dataToArray || "-";
                //     returnData = (
                //         <ul type="i" className="listForWindow">
                //             {dataToArray}
                //         </ul>
                //     );
                } else {
                    returnData = data || "-";
                }
                break;
            default:
                returnData = data || "-";
                break;
        }
        return returnData;
    };

    filterHighlighter = searchKey => {
        let returnVal = false;
        if (this.props.tableParams && this.props.tableParams.filters) {
            Object.keys(this.props.tableParams.filters).map(fill => {
                if (fill === searchKey && this.props.tableParams.filters[searchKey].key && this.props.tableParams.filters[searchKey].key.length) {
                    returnVal = true;
                }
            });
        }
        if (this.props.tableParams && this.props.tableParams.search && this.props.tableParams.search.length) {
            returnVal = true;
        }
        return returnVal;
    };

    showCommonSearchDropDown = async (keyItem, searchKey) => {
        this.setState({
            selectedFieldForCommonSearch: this.state.selectedFieldForCommonSearch === keyItem ? null : keyItem,
            filterList: [],
            isLoadingDropdown: true
        });
        let getListParsms = { field: searchKey };
        let filterList = this.state.selectedFieldForCommonSearch === keyItem ? null : await this.props.getListForCommonFilter(getListParsms);
        this.setState({
            filterList,
            isLoadingDropdown: false
        });
    };

    renderFiltersForCommonSearch = keyItem => {
        if (this.state.selectedFieldForCommonSearch !== keyItem) {
            return null;
        }
        const { tableData } = this.props;

        let { filterList, isLoadingDropdown } = this.state;
        filterList = filterList.filter(item => item.name !== null && item.name !== "");

        let filterListToCheck = this.state.commonFilterParams[tableData.config[keyItem].searchKey]
            ? this.state.commonFilterParams[tableData.config[keyItem].searchKey]
            : [];

        return (
            <div className="dropdown-menu dropdown-table tempDrop" aria-labelledby="dropdownMenuButton">
                <div className="dropdown-item">
                    <div className="custom-control custom-checkbox">
                        <input
                            type="checkbox"
                            className="custom-control-input"
                            id="customCheck"
                            name="example1"
                            is-dropdown-item="true"
                            checked={this.state.selectAll && this.state.selectAll[tableData.config[keyItem].searchKey]}
                            onChange={() => this.selectAllHandler(tableData.config[keyItem])}
                        />
                        <label className="custom-control-label" for="customCheck">
                            Select All
                        </label>
                    </div>
                </div>
                <hr />
                {!isLoadingDropdown ? (
                    <div className="dropdown-item drp-scroll" onScroll={e => e.stopPropagation()}>
                        {filterList.length ? (
                            filterList.map((item, i) => (
                                <div className="custom-control custom-checkbox" key={i}>
                                    {item.name !== null && item.name !== "" ? (
                                        <>
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                checked={filterListToCheck && filterListToCheck.length && filterListToCheck.includes(item.name)}
                                                id={`customCheck${i}`}
                                                name="example1"
                                                is-dropdown-item="true"
                                                onClick={e => {
                                                    this.setCommonFilterParams(item.name, tableData.config[keyItem].searchKey, keyItem);
                                                }}
                                            />
                                            <label className="custom-control-label" for={`customCheck${i}`}>
                                                {item.name} ({item.count})
                                            </label>
                                        </>
                                    ) : null}
                                </div>
                            ))
                        ) : (
                            <div className="col-md-6">No data</div>
                        )}
                    </div>
                ) : (
                    <div className="dropdown-item">
                        <Loader />
                    </div>
                )}
                {filterList.length ? (
                    <div className="btn-otr d-flex justify-content-center">
                        <button className="btn btn-create" onClick={() => this.updateCommonFilterHandler(tableData.config[keyItem].searchKey)}>
                            OK
                        </button>
                        <button
                            className="btn btn-cncl-back ml-2"
                            onClick={() =>
                                this.cancelCommonFilterHandler(
                                    tableData.config[keyItem].commonSearchKey,
                                    tableData.config[keyItem],
                                    tableData.config[keyItem].searchKey
                                )
                            }
                        >
                            Cancel
                        </button>
                    </div>
                ) : null}
            </div>
        );
    };

    cancelCommonFilterHandler = async () => {
        await this.setState({
            commonFilterParams: { ...this.props.commonFilter } || {},
            selectedFieldForCommonSearch: null
        });
    };

    updateCommonFilterHandler = searchKey => {
        const { commonFilterParams } = this.state;
        if (Object.keys(commonFilterParams).length !== 0) {
            this.props.updateCommonFilter(commonFilterParams);
            this.setState(prevState => ({
                isOk: { ...prevState.isOk, [searchKey]: true },
                isCancel: { ...prevState.isCancel, [searchKey]: true }
            }));
        }
        if (this.state.isOk[searchKey] || this.checkHasCommonFilters() || this.state.isCancel[searchKey]) {
            this.props.updateCommonFilter(this.state.commonFilterParams);
            this.setState(prevState => ({
                isOk: { ...prevState.isOk, [searchKey]: false },
                isCancel: { ...prevState.isCancel, [searchKey]: false }
            }));
        }
        this.setState({
            selectedFieldForCommonSearch: null
        });
    };

    setCommonFilterParams = async (value, searchKey, keyItem) => {
        let tempList = { ...this.state.commonFilterParams };
        if (tempList[searchKey]) {
            if (!tempList[searchKey].includes(value)) {
                tempList[searchKey].push(value);
            } else {
                tempList[searchKey] = tempList[searchKey].filter(item => item !== value);
            }
            if (!tempList[searchKey].length) delete tempList[searchKey];
        } else {
            tempList[searchKey] = [value];
        }
        let isSelectAll;
        if (tempList && tempList[searchKey] && tempList[searchKey].length === this.state.filterList.length) {
            isSelectAll = true;
        } else {
            isSelectAll = false;
        }
        this.setState(prevState => ({
            commonFilterParams: tempList,
            selectAll: { ...prevState.selectAll, [searchKey]: isSelectAll }
        }));
    };

    selectAllHandler = async keyItem => {
        const selctAll = !this.state.selectAll[keyItem.searchKey];
        let { filterList } = this.state;
        filterList = filterList.filter(item => item.name !== null && item.name !== "");
        let tempList = this.state.commonFilterParams;

        if (selctAll) {
            tempList[keyItem.searchKey] = filterList.map(item => item.name);
            this.setState(prevState => ({
                selectAll: { ...prevState.selectAll, [keyItem.searchKey]: selctAll },
                commonFilterParams: tempList
            }));
        } else {
            this.setState(prevState => ({
                selectAll: { ...prevState.selectAll, [keyItem.searchKey]: selctAll },
                commonFilterParams: {}
            }));
        }
    };

    checkHasCommonFilters = searchKey => {
        const { tableParams = null } = this.props;
        if (tableParams) {
            if (tableParams.list && tableParams.list[searchKey] && tableParams.list[searchKey].length) {
                return true;
            }
        }
        return false;
    };

    setSortOrderParamsByArrow = async (event, searchKey, val) => {
        const { schedules } = this.props;
        if (schedules && schedules.length) {
            await this.props.updateTableSortFilters(searchKey, val);
        }
    };

    renderTooltipText = (keyItem, item) => {
        let ret = null;
        switch (keyItem) {
            case "standard":
                ret = item["standard_tooltip"];
                break;
            case "code_reference":
                ret = item["code_reference_tooltip"];
                break;
            case "activity_description":
                ret = item["activity_tooltip"];
                break;

            default:
                break;
        }
        return ret;
    };

    render() {
        const {
            isCalendarExpanded,
            schedules,
            tableData,
            tableParams,
            updateWildCardFilter,
            logbookById = true,
            deleteItem,
            showWildCardFilter,
            handleActivityEventClick,
            handleDeviceCountClick,
            wildCardFilter,
            hasLastPerformedClick = false,
            hasDeviceCountClick = false
        } = this.props;

        let searchKeysArray = this.setSearchKeysArray();
        let columnCount = 2;
        return (
            <div className={`file-system-sec-left ${isCalendarExpanded ? "outer-width" : null}`}>
                <div className="table-section" id="activity-table-container" onScroll={e => this.OnScroll(e)}>
                    <table className="table table-bordered file-system-table">
                        <thead>
                            <tr id="activityTableHeaderRow">
                                <th className="img-sq-box">
                                    <img alt="" src="/images/table-blue-dots.svg" />
                                </th>
                                {tableData.keys &&
                                    tableData.keys.map((keyItem, i) => {
                                        return tableData.config && tableData.config[keyItem] && tableData.config[keyItem].isVisible ? (
                                            <th
                                                className={`drop-fil activity-table-col${tableData.config[keyItem].item} ${
                                                    tableData.config[keyItem].class
                                                } ${this.checkHasCommonFilters(tableData.config[keyItem].searchKey) ? "active-hed" : ""}`}
                                                key={i}
                                            >
                                                <div
                                                    className="cursor-pointer"
                                                    onClick={
                                                        tableData.config[keyItem].hasSort
                                                            ? event => this.setSortOrderParams(event, tableData.config[keyItem].searchKey)
                                                            : null
                                                    }
                                                >
                                                    {tableData.config[keyItem].label}
                                                    <span id={`thIconsContainer_${tableData.config[keyItem].searchKey}`}>
                                                        {tableData.config[keyItem].hasCommonSearch ? (
                                                            <>
                                                                <span
                                                                    className="dropdown-toggle"
                                                                    id="dropdownMenuButton"
                                                                    aria-haspopup="true"
                                                                    aria-expanded="false"
                                                                    onClick={e => {
                                                                        this.showCommonSearchDropDown(keyItem, tableData.config[keyItem].searchKey);
                                                                    }}
                                                                >
                                                                    <span className="material-icons drop-icn">keyboard_arrow_down</span>
                                                                </span>
                                                                {this.renderFiltersForCommonSearch(keyItem)}
                                                            </>
                                                        ) : null}
                                                        {tableParams &&
                                                        tableParams.order &&
                                                        tableParams.order[tableData.config[keyItem].searchKey] ? (
                                                            <>
                                                                {tableParams.order[tableData.config[keyItem].searchKey] === "asc" ? (
                                                                    <i
                                                                        className={`material-icons table-sort-arrow`}
                                                                        onClick={event =>
                                                                            this.setSortOrderParamsByArrow(event, tableData.config[keyItem].searchKey)
                                                                        }
                                                                    >
                                                                        north
                                                                    </i>
                                                                ) : (
                                                                    <i
                                                                        className={`material-icons table-sort-arrow`}
                                                                        onClick={event =>
                                                                            this.setSortOrderParamsByArrow(
                                                                                event,
                                                                                tableData.config[keyItem].searchKey,
                                                                                tableData.config[keyItem].label
                                                                            )
                                                                        }
                                                                    >
                                                                        south
                                                                    </i>
                                                                )}
                                                            </>
                                                        ) : null}
                                                    </span>
                                                </div>
                                            </th>
                                        ) : null;
                                    })}

                                {checkPermission("assign", "buildings", "activities") || checkPermission("assign", "buildings", "logbooks")
                                    ? !logbookById && (
                                          <th className="action action-cal">
                                              <img src="/images/three-dots.svg" alt="" />
                                          </th>
                                      )
                                    : null}
                            </tr>
                            {showWildCardFilter ? (
                                <WildCardFilter
                                    config={tableData.config}
                                    keys={tableData.keys}
                                    updateWildCardFilter={updateWildCardFilter}
                                    actionShow={logbookById ? false : true}
                                    table-filter="table-filter"
                                    closView={true}
                                    wildCardFilter={wildCardFilter}
                                />
                            ) : null}
                        </thead>
                        <tbody>
                            <ReactTooltip id="activity_calendar_table" effect="solid" />
                            {schedules.length ? (
                                schedules.map((item, index) => (
                                    <tr key={index} className="table-row">
                                        <td className="img-sq-box">
                                            <img alt="" src="/images/table-blue-dots.svg" />
                                        </td>
                                        {tableData.keys &&
                                            tableData.keys.map((keyItem, j) => {
                                                return tableData.config && tableData.config[keyItem] && tableData.config[keyItem].isVisible ? (
                                                    <td
                                                        className="td-content"
                                                        key={j}
                                                        data-tip={this.renderTooltipText(keyItem, item)}
                                                        data-for="activity_calendar_table"
                                                        data-place="top"
                                                    >
                                                        {keyItem === "date_last_performed" ? (
                                                            item.date_last_performed_id && hasLastPerformedClick ? (
                                                                <div
                                                                    className="cursor-pointer"
                                                                    onClick={() =>
                                                                        handleActivityEventClick(item.date_last_performed_id, item.id, item.edit_form)
                                                                    }
                                                                >
                                                                    <Highlighter
                                                                        searchWords={
                                                                            this.filterHighlighter(tableData.config[keyItem].searchKey)
                                                                                ? searchKeysArray
                                                                                : []
                                                                        }
                                                                        textToHighlight={this.renderCellData(
                                                                            tableData.config[keyItem].type,
                                                                            item[keyItem]
                                                                        )}
                                                                        className="highlighter"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                this.renderCellData(tableData.config[keyItem].type, item[keyItem])
                                                            )
                                                        ) : keyItem === "default_total_devices" ? (
                                                            hasDeviceCountClick ? (
                                                                <div
                                                                    className="cursor-pointer"
                                                                    onClick={() => handleDeviceCountClick(item.building_activity_id,item?.asset?.id,item?.id)}
                                                                >
                                                                    <Highlighter
                                                                        searchWords={
                                                                            this.filterHighlighter(tableData.config[keyItem].searchKey)
                                                                                ? searchKeysArray
                                                                                : []
                                                                        }
                                                                        textToHighlight={this.renderCellData(
                                                                            tableData.config[keyItem].type,
                                                                            item[keyItem]
                                                                        )}
                                                                        className="highlighter"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <Highlighter
                                                                    searchWords={
                                                                        this.filterHighlighter(tableData.config[keyItem].searchKey)
                                                                            ? searchKeysArray
                                                                            : []
                                                                    }
                                                                    textToHighlight={this.renderCellData(
                                                                        tableData.config[keyItem].type,
                                                                        item[keyItem]
                                                                    )}
                                                                    className="highlighter"
                                                                />
                                                            )
                                                        ) : keyItem === "sl_no" ? (
                                                            (tableParams.page - 1) * tableParams.limit + index + 1
                                                        ) : keyItem === "standard" ? (
                                                           <span className="customWindow">
                                                            <Highlighter
                                                                searchWords={
                                                                    this.filterHighlighter(tableData.config[keyItem].searchKey) ? searchKeysArray : []
                                                                }
                                                                textToHighlight={this.renderCellData(tableData.config[keyItem].type, item[keyItem])}
                                                                className="highlighter"
                                                            />
                                                            </span>
                                                        ):(
                                                            <Highlighter
                                                                searchWords={
                                                                    this.filterHighlighter(tableData.config[keyItem].searchKey) ? searchKeysArray : []
                                                                }
                                                                textToHighlight={this.renderCellData(tableData.config[keyItem].type, item[keyItem])}
                                                                className="highlighter"
                                                            />

                                                        )     
                                                        }
                            
                                                    </td>
                                                ) : null;
                                            })}
                                        {!logbookById && (
                                            <td className="action">
                                                <div className="action-col">
                                                    <img
                                                        className="row-delete-icon"
                                                        src="/images/delete.svg"
                                                        alt=""
                                                        onClick={() => deleteItem(item.id)}
                                                        title="Delete"
                                                    />
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    {tableData.keys.map(keyItem => {
                                        if (tableData.config && tableData.config[keyItem].isVisible) {
                                            columnCount += 1;
                                        }
                                    })}
                                    <td colSpan={columnCount} className="text-center">
                                        No data found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default ActivityCalendarTableActivity;
