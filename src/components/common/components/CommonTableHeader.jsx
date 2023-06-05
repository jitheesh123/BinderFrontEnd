import React, { Component } from "react";
import _ from "lodash";
import { withRouter } from "react-router-dom";

import Loader from "./Loader";

class CommonTableHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFieldForCommonSearch: null,
            filterList: [],
            commonFilterParams: {},
            isLoadingDropdown: false,
            selectAll: "",
            isCancel: false,
            isOk: false
        };
    }

    componentDidMount = async () => {
        window.addEventListener("click", e => {
            let commonTableHeaderRow = document.getElementById("commonTableHeaderRow");
            if (commonTableHeaderRow && !commonTableHeaderRow.contains(e.target) && !e.target.hasAttribute("is-dropdown-item")) {
                this.setState({
                    selectedFieldForCommonSearch: null
                });
            }
        });
        const { keys, config, commonFilter } = this.props;
        if (keys) {
            keys.map(
                keyItem => config && config[keyItem] && config[keyItem].isVisible && this.initiateColumnResize(`.resize-col-${keyItem}`, keyItem)
            );
        }
        if (commonFilter) {
            if (!this.state.isOk && Object.keys(commonFilter).length !== 0) {
                let initialValue = {};
                Object.keys(commonFilter).map(fil => {
                    initialValue = { ...initialValue, [fil]: true };
                });
                this.setState({
                    isOk: initialValue,
                    isCancel: initialValue,
                    commonFilterParams: this.props.commonFilter
                });
            }
        }
    };

    componentDidUpdate = async prevProps => {
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

    initiateColumnResize = (className, index) => {
        let tableColumn = document.querySelector(className);
        tableColumn.className = tableColumn.className + " resizable";
        let resizer = document.createElement("div");
        resizer.className = `resizer${index}`;
        resizer.id = `resizer${index}`;
        tableColumn.appendChild(resizer);
        resizer.addEventListener("mousedown", initDrag, false);
        let startX, startWidth;
        function initDrag(e) {
            e.preventDefault();
            startX = e.clientX;
            startWidth = parseInt(document.defaultView.getComputedStyle(tableColumn).width, 10);
            document.documentElement.addEventListener("mousemove", doDrag, false);
            document.documentElement.addEventListener("mouseup", stopDrag, false);
        }

        function doDrag(e) {
            let currentWidth = startWidth + e.clientX - startX;
            tableColumn.style.width = currentWidth + "px";
            tableColumn.style.minWidth = currentWidth + "px";
        }

        function stopDrag(e) {
            document.documentElement.removeEventListener("mousemove", doDrag, false);
            document.documentElement.removeEventListener("mouseup", stopDrag, false);
        }
    };

    setSortOrderParams = async (event, searchKey, val, keyItem) => {
        const { tableData } = this.props;
        if (tableData && tableData.data && tableData.data.length) {
            let thIconsContainer = document.getElementById(`thIconsContainer_${searchKey}`);
            let resizer = document.getElementById(`resizer${keyItem}`);
            if (thIconsContainer && !thIconsContainer.contains(event.target) && resizer && !resizer.contains(event.target)) {
                await this.props.updateTableSortFilters(searchKey, val);
            }
        }
    };

    renderFiltersForCommonSearch = keyItem => {
        if (this.state.selectedFieldForCommonSearch !== keyItem) {
            return null;
        }
        const { config } = this.props;

        let { filterList, isLoadingDropdown } = this.state;
        filterList = filterList && filterList.filter(item => item.name !== null && item.name !== "");

        let filterListToCheck =
            this.state.commonFilterParams && this.state.commonFilterParams[config[keyItem].searchKey]
                ? this.state.commonFilterParams[config[keyItem].searchKey]
                : [];

        return (
            <div className="dropdown-menu dropdown-table tempDrop" aria-labelledby="dropdownMenuButton">
                <div className="dropdown-item">
                    <div className="custom-control custom-checkbox common-filter-select-all">
                        <input
                            type="checkbox"
                            className="custom-control-input"
                            id="customCheck"
                            name="example1"
                            is-dropdown-item="true"
                            checked={this.state.selectAll && this.state.selectAll[config[keyItem].searchKey]}
                            onClick={() => this.selectAllHandler(config[keyItem])}
                        />
                        <label className="custom-control-label" for="customCheck">
                            Select All
                        </label>
                        <span>({filterListToCheck && filterListToCheck.length})</span>
                    </div>
                </div>
                <hr />
                {!isLoadingDropdown ? (
                    <div className="dropdown-item drp-scroll" onScroll={e => e.stopPropagation()}>
                        {filterList.length ? (
                            <>
                                {filterList.map((item, i) =>
                                    filterListToCheck && filterListToCheck.length && filterListToCheck.includes(item.name) ? (
                                        <div className="custom-control custom-checkbox" key={i}>
                                            {item.name !== null && item.name !== "" ? (
                                                <>
                                                    <input
                                                        type="checkbox"
                                                        className="custom-control-input"
                                                        checked={
                                                            filterListToCheck && filterListToCheck.length && filterListToCheck.includes(item.name)
                                                        }
                                                        id={`customCheck${i}`}
                                                        is-dropdown-item="true"
                                                        name="example1"
                                                        onClick={() => this.setCommonFilterParams(item.name, config[keyItem].searchKey, keyItem)}
                                                    />
                                                    <label className="custom-control-label" for={`customCheck${i}`}>
                                                        {item.name} ({item.count})
                                                    </label>
                                                </>
                                            ) : null}
                                        </div>
                                    ) : null
                                )}
                                {filterListToCheck && filterListToCheck.length ? <hr className="filter-devider" /> : null}
                                {filterList.map((item, i) =>
                                    !filterListToCheck || !filterListToCheck.length || !filterListToCheck.includes(item.name) ? (
                                        <div className="custom-control custom-checkbox" key={i}>
                                            {item.name !== null && item.name !== "" ? (
                                                <>
                                                    <input
                                                        type="checkbox"
                                                        className="custom-control-input"
                                                        checked={
                                                            filterListToCheck && filterListToCheck.length && filterListToCheck.includes(item.name)
                                                        }
                                                        id={`customCheck${i}`}
                                                        is-dropdown-item="true"
                                                        name="example1"
                                                        onClick={() => this.setCommonFilterParams(item.name, config[keyItem].searchKey, keyItem)}
                                                    />
                                                    <label className="custom-control-label" for={`customCheck${i}`}>
                                                        {item.name} ({item.count})
                                                    </label>
                                                </>
                                            ) : null}
                                        </div>
                                    ) : null
                                )}
                            </>
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
                        <button className="btn btn-create" onClick={() => this.updateCommonFilterHandler(config[keyItem].searchKey)}>
                            OK
                        </button>
                        <button
                            className="btn btn-cncl-back ml-2"
                            onClick={() => this.cancelCommonFilterHandler(config[keyItem].searchKey, config[keyItem], config[keyItem].searchKey)}
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

    setCommonFilterParams = (value, searchKey, keyItem) => {
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
        const { tableParams = null } = this.props
        if (tableParams) {
            if (tableParams.list && tableParams.list[searchKey] && tableParams.list[searchKey].length) {
                return true;
            }
            else if ((tableParams.filters && tableParams.filters[searchKey] && tableParams.filters[searchKey]?.key?.length)) {
                return true;
            }else if(tableParams.filters && tableParams.filters[searchKey]?.filters[0] !== "contains" && tableParams.filters[searchKey]?.filters.length )
            {
                return true
            }
            
        }
        return false;
    };

    setSortOrderParamsByArrow = async (event, searchKey, val) => {
        const { tableData } = this.props;
        if (tableData && tableData.data && tableData.data.length) {
            await this.props.updateTableSortFilters(searchKey, val);
        }
    };

    render() {
        const {
            config,
            keys,
            tableParams,
            hasSort = false,
            hasActionColumn = true,
            hasActionAssign,
            hasActionActivityAssign,
            hasActionActivityScheduling,
            hasActionCalendar,
            isWidthAction = false,
            isActivity = false
        } = this.props;
        return (
            <tr id="commonTableHeaderRow">
                <th className="img-sq-box">
                    <img src="/images/table-blue-dots.svg" alt="" />
                </th>
                {keys &&
                    keys.map((keyItem, i) => {
                        return config && config[keyItem] && config[keyItem].isVisible ? (
                            <th
                                className={`region dropdown  resize-col-${keyItem} drop-fil ${
                                    this.checkHasCommonFilters(config[keyItem].searchKey) ? "active-hed" : ""
                                }
                                `}
                                key={i}
                                onClick={event =>
                                    hasSort ? this.setSortOrderParams(event, config[keyItem].searchKey, config[keyItem].label, keyItem) : null
                                }
                            >
                                {config[keyItem].label}
                                <span id={`thIconsContainer_${config[keyItem].searchKey}`}>
                                    {config[keyItem].hasCommonSearch ? (
                                        <>
                                            <span
                                                className="dropdown-toggle"
                                                id="dropdownMenuButton"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                                onClick={e => {
                                                    this.showCommonSearchDropDown(keyItem, config[keyItem].searchKey);
                                                }}
                                            >
                                                <span className="material-icons drop-icn">keyboard_arrow_down</span>
                                            </span>
                                            {this.renderFiltersForCommonSearch(keyItem)}
                                        </>
                                    ) : null}
                                    {tableParams && tableParams.order && tableParams.order[config[keyItem].searchKey] ? (
                                        <>
                                            {tableParams.order[config[keyItem].searchKey] === "asc" ? (
                                                <i
                                                    className={`material-icons table-sort-arrow`}
                                                    onClick={event =>
                                                        hasSort
                                                            ? this.setSortOrderParamsByArrow(
                                                                  event,
                                                                  config[keyItem].searchKey,
                                                                  config[keyItem].label,
                                                                  keyItem
                                                              )
                                                            : null
                                                    }
                                                >
                                                    north
                                                </i>
                                            ) : (
                                                <i
                                                    className={`material-icons table-sort-arrow`}
                                                    onClick={event =>
                                                        hasSort
                                                            ? this.setSortOrderParamsByArrow(
                                                                  event,
                                                                  config[keyItem].searchKey,
                                                                  config[keyItem].label,
                                                                  keyItem
                                                              )
                                                            : null
                                                    }
                                                >
                                                    south
                                                </i>
                                            )}
                                        </>
                                    ) : null}
                                </span>
                            </th>
                        ) : null;
                    })}
                {hasActionColumn ? (
                    <th
                        className={`action ${isWidthAction ? "action-fr action-wider" : "action-cal"} ${isActivity ? "action-activity" : ""} ${
                            !isWidthAction && ((hasActionAssign && hasActionActivityAssign) || (hasActionActivityScheduling && hasActionCalendar))
                                ? " row-action"
                                : ""
                        }`}
                    >
                        <img src="/images/three-dots.svg" alt="" />
                    </th>
                ) : null}
            </tr>
        );
    }
}

export default withRouter(CommonTableHeader);
