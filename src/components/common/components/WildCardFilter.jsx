import React, { Component } from "react";
import moment from "moment";
import NumberFormat from "react-number-format";
import MonthFilter from "./WildCardFilterMonth";

class WildCardFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newWildCardFilters: this.props.wildCardFilter || {},
            tempWildCardFilters:this.props.wildCardFilter || {},
            selectedField: null,
            filterTextValues: {},
            filterDate: {},
            selectedDateFilterKey: {}
        };
    }

    componentDidMount = async () => {
        const { keys, config, isMonthFilter } = this.props;
        document.addEventListener("keydown", this.handleKeyPress);
        window.addEventListener("click", e => {
            let wildcardFilterRow = document.getElementById(isMonthFilter ? "wildcardFilterRowCalendar" : "wildcardFilterRow");
            if (wildcardFilterRow && !wildcardFilterRow.contains(e.target)) {
                this.setState({
                    selectedField: null
                });
            }
        });
        let tempWcFilter = {};
        if (this.state.newWildCardFilters) {
            if (keys && keys.length) {
                keys.map((keyItem, i) => {
                    tempWcFilter[config[keyItem].searchKey] = { key: null, filters: ["contains"] };
                });
            }
            await this.setState({
                newWildCardFilters: tempWcFilter
            });
        }
        let tempFilterTextValues = {};
        if (keys && keys.length) {
            keys.map((keyItem, i) => {
                tempFilterTextValues[config[keyItem].searchKey] = null;
            });
        }
        this.setState({
            filterTextValues: tempFilterTextValues
        });
        this.setState({
            isLoading: false
        });
    };

    componentWillUnmount = () => {
        document.removeEventListener("keydown", this.handleKeyPress);
        document.removeEventListener(
            "click",
            this.setState({
                selectedField: null
            })
        );
    };

    handleKeyPress = e => {
        if (e.keyCode === 27) {
            e.preventDefault();
            this.setState({ selectedField: null });
        }
    };

    showFilterDropDown = keyItem => {
        this.setState({
            selectedField: this.state.selectedField === keyItem ? null : keyItem
        });
    };

    setFilterKeys = (filterKey, searchKey) => {
        let tempWcFilter = this.state.newWildCardFilters;
        if (!tempWcFilter[searchKey].filters.includes(filterKey)) {
            tempWcFilter[searchKey].filters = [filterKey];
        } else {
            tempWcFilter[searchKey].filters = tempWcFilter[searchKey].filters.filter(item => item !== filterKey);
        }
        if (filterKey === "not_null" || filterKey === "null") {
            tempWcFilter[searchKey].key = "";
            this.props.updateWildCardFilter(tempWcFilter);
            return true;
        } else if (tempWcFilter[searchKey].key && tempWcFilter[searchKey].key.trim().length) {
            this.props.updateWildCardFilter(tempWcFilter);
            return true;
        }
        this.setState({
            newWildCardFilters: tempWcFilter
        });
    };

    dateFinder = dayString => {
        let dateRange = { from: "", to: "" };
        switch (dayString) {
            case "yesterday":
                dateRange.from = moment(new Date()).subtract(1, "days").format("YYYY-MM-DD");
                dateRange.to = moment(new Date()).format("YYYY-MM-DD");
                break;
            case "today":
                dateRange.from = moment(new Date()).format("YYYY-MM-DD");
                dateRange.to = moment(new Date()).add(1, "days").format("YYYY-MM-DD");
                break;
            case "tomorrow":
                dateRange.from = moment(new Date()).add(1, "days").format("YYYY-MM-DD");
                dateRange.to = moment(new Date()).add(2, "days").format("YYYY-MM-DD");
                break;
            case "last_month":
                dateRange.from = moment(new Date()).subtract(1, "months").startOf("month").format("YYYY-MM-DD");
                dateRange.to = moment(new Date()).subtract(1, "months").endOf("month").format("YYYY-MM-DD");
                break;
            case "this_month":
                dateRange.from = moment(new Date()).startOf("month").format("YYYY-MM-DD");
                dateRange.to = moment(new Date()).endOf("month").format("YYYY-MM-DD");
                break;
            case "next_month":
                dateRange.from = moment(new Date()).add(1, "months").startOf("month").format("YYYY-MM-DD");
                dateRange.to = moment(new Date()).add(1, "months").endOf("month").format("YYYY-MM-DD");
                break;
            case "last_week":
                dateRange.from = moment(new Date()).subtract(1, "weeks").startOf("week").format("YYYY-MM-DD");
                dateRange.to = moment(new Date()).subtract(1, "weeks").endOf("week").format("YYYY-MM-DD");
                break;
            case "this_week":
                dateRange.from = moment(new Date()).startOf("week").format("YYYY-MM-DD");
                dateRange.to = moment(new Date()).endOf("week").format("YYYY-MM-DD");
                break;
            case "next_week":
                dateRange.from = moment(new Date()).add(1, "weeks").startOf("week").format("YYYY-MM-DD");
                dateRange.to = moment(new Date()).add(1, "weeks").endOf("week").format("YYYY-MM-DD");
                break;
            case "last_year":
                dateRange.from = moment(new Date()).subtract(1, "years").startOf("year").format("YYYY-MM-DD");
                dateRange.to = moment(new Date()).subtract(1, "years").endOf("year").format("YYYY-MM-DD");
                break;
            case "this_year":
                dateRange.from = moment(new Date()).startOf("year").format("YYYY-MM-DD");
                dateRange.to = moment(new Date()).endOf("year").format("YYYY-MM-DD");
                break;
            case "next_year":
                dateRange.from = moment(new Date()).add(1, "years").startOf("year").format("YYYY-MM-DD");
                dateRange.to = moment(new Date()).add(1, "years").endOf("year").format("YYYY-MM-DD");
                break;

            default:
                break;
        }
        return dateRange;
    };

    setFilterKeysForDate = async (filterKey, searchKey, keyItem) => {
        let tempFilterKey = "in_between";
        let tempWcFilter = this.state.newWildCardFilters;

        if (this.state.selectedDateFilterKey[keyItem] !== filterKey) {
            await this.setState(prevState => ({
                selectedDateFilterKey: {
                    ...prevState.selectedDateFilterKey,
                    [keyItem]: filterKey
                }
            }));
            if (filterKey !== "in_between") {
                let selctedDate = await this.dateFinder(filterKey);
                await this.setState(prevState => ({
                    filterDate: {
                        ...prevState.filterDate,

                        [keyItem]: selctedDate
                    }
                }));
            }

            if (filterKey !== "in_between") {
                tempWcFilter[searchKey].filters = [tempFilterKey];
                tempWcFilter[searchKey].key = {
                    from: this.state.filterDate[keyItem].from,
                    to: this.state.filterDate[keyItem].to
                };
            } else {
                tempWcFilter[searchKey].filters = [tempFilterKey];
                tempWcFilter[searchKey].key = {
                    from: this.state.filterDate.from,
                    to: this.state.filterDate.to
                };
            }
        } else {
            this.setState(prevState => ({
                selectedDateFilterKey: {
                    ...prevState.selectedDateFilterKey,
                    [keyItem]: null
                }
            }));
            if (filterKey !== "in_between") {
                await this.setState({
                    filterDate: {}
                });
            }
            tempWcFilter[searchKey].key = null;
        }
        this.props.updateWildCardFilter(tempWcFilter);
        this.setState({
            newWildCardFilters: tempWcFilter
        });
    };

    renderFilters = keyItem => {
        if (this.state.selectedField !== keyItem) {
            return null;
        }
        const { newWildCardFilters } = this.state;
        const { config } = this.props;
        const defaultFilteKeys = [
            { value: "contains", label: "Contains" },
            { value: "exclude", label: "Doesn't Contain" },
            { value: "equals", label: "Equals" },
            { value: "unequals", label: "Doesn't Equal" },
            { value: "begins_with", label: "Begins With" },
            { value: "ends_with", label: "Ends With" },
            { value: "not_null", label: "Not Null" },
            { value: "null", label: "Null" },
            { value: "like", label: "Like (%,_)" }
        ];
        const dateFilterKeys = [
            // { value: "in_between", label: "In between" },
            // { value: null, label: null },
            { value: "yesterday", label: "Yesterday" },
            { value: "last_month", label: "Last Month" },
            { value: "today", label: "Today" },
            { value: "this_month", label: "This Month" },
            { value: "tomorrow", label: "Tomorrow" },
            { value: "next_month", label: "Next Month" },
            { value: "last_week", label: "Last Week" },
            { value: "last_year", label: "Last Year" },
            { value: "this_week", label: "This Week" },
            { value: "this_year", label: "This Year" },
            { value: "next_week", label: "Next Week" },
            { value: "next_year", label: "Next Year" }
        ];
        const numberFilterKeys = [
            { value: "equals", label: "Equals" },
            { value: "unequals", label: "Doesn't Equal" },
            { value: "less_than", label: "Less Than" },
            { value: "less_than_or_equal", label: "Less Than or Equal to" },
            { value: "greater_than", label: "Greater Than" },
            { value: "greater_than_or_equal", label: "Greater Than or Equal to" },
            { value: "not_null", label: "Not Null" },
            { value: "like", label: "Like (%,_)" }
        ];

        if (config[keyItem] && config[keyItem].type && config[keyItem].type === "date") {
            return (
                <div className="dropdown-menu dropdown-table tempDrop" aria-labelledby="dropdownMenuButton">
                    <div className="dropdown-item select-date-drop">
                        <div className="form-group-out">
                            <label className="col-md-3 p-0">From</label>
                            <input
                                className="form-control col-md-9"
                                value={(this.state.filterDate[keyItem] && this.state.filterDate[keyItem].from) || this.state.filterDate.from}
                                type="date"
                                onChange={e =>
                                    this.setState({
                                        filterDate: {
                                            ...this.state.filterDate,
                                            from: e.target.value
                                        }
                                    })
                                }
                            />
                        </div>
                        <div className="form-group-out">
                            <label className="col-md-3 p-0">To</label>
                            <input
                                className="form-control col-md-9"
                                value={(this.state.filterDate[keyItem] && this.state.filterDate[keyItem].to) || this.state.filterDate.to}
                                type="date"
                                onChange={e =>
                                    this.setState({
                                        filterDate: {
                                            ...this.state.filterDate,
                                            to: e.target.value
                                        }
                                    })
                                }
                            />
                        </div>
                    </div>
                    <div className="dropdown-item drop-out">
                        <div className="custom-control custom-checkbox">
                            <input
                                type="checkbox"
                                id="customCheck"
                                name="example1"
                                className="custom-control-input"
                                checked={
                                    this.state.selectedDateFilterKey[keyItem] === "in_between" &&
                                    this.state.selectedDateFilterKey.hasOwnProperty(keyItem)
                                }
                                onClick={() => this.setFilterKeysForDate("in_between", config[keyItem].searchKey, keyItem)}
                            />
                            <label className="custom-control-label" for="customCheck">
                                In between
                            </label>
                        </div>
                    </div>
                    <hr />
                    <div className="dropdown-item d-flex drop-out flex-wrap">
                        {dateFilterKeys.map((item, i) => (
                            <>
                                <div key={i} className="custom-control custom-checkbox col-md-6">
                                    {item.value ? (
                                        <>
                                            <input
                                                className="custom-control-input"
                                                id={i}
                                                type="checkbox"
                                                checked={
                                                    this.state.selectedDateFilterKey[keyItem] === item.value &&
                                                    this.state.selectedDateFilterKey.hasOwnProperty(keyItem)
                                                }
                                                onClick={() => this.setFilterKeysForDate(item.value, config[keyItem].searchKey, keyItem)}
                                            />
                                        </>
                                    ) : null}
                                    <label className="custom-control-label" for={i}>
                                        {item.label}
                                    </label>
                                </div>
                                {i % 6 === 1 ? <div className="col-md-12"></div> : null}
                            </>
                        ))}
                    </div>
                </div>
            );
        } else if (config[keyItem] && config[keyItem].type && config[keyItem].type === "number") {
            return (
                <div className="dropdown-menu dropdown-table tempDrop" aria-labelledby="dropdownMenuButton">
                    {numberFilterKeys.map((item, i) => (
                        <div className="dropdown-item">
                            <div className="custom-control custom-checkbox">
                                <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id={i}
                                    name="example1"
                                    checked={newWildCardFilters[config[keyItem].searchKey].filters.includes(item.value)}
                                    onClick={() => this.setFilterKeys(item.value, config[keyItem].searchKey)}
                                />
                                <label className="custom-control-label" for={i}>
                                    {item.label}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            );
        } else {
            return (
                <div className="dropdown-menu dropdown-table tempDrop" aria-labelledby="dropdownMenuButton">
                    {defaultFilteKeys.map((item, i) => (
                        <div className="dropdown-item">
                            <div className="custom-control custom-checkbox">
                                <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id={i}
                                    name="example1"
                                    checked={newWildCardFilters[config[keyItem].searchKey].filters.includes(item.value)}
                                    onClick={() => this.setFilterKeys(item.value, config[keyItem].searchKey)}
                                />
                                <label className="custom-control-label" for={i}>
                                    {item.label}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
    };

    handleCloseClick = async value => {
        // await this.setState({
        //     newWildCardFilters: {
        //         ...this.state.newWildCardFilters,
        //         [value.searchKey]: {
        //             filters: ["contains"],
        //             key: ""
        //         }
        //     }
        // });
        let isFilterValue = this.state.newWildCardFilters[value.searchKey];
        let type = value.type;
        let filterPresent = false;
        if (isFilterValue.key || isFilterValue.filters?.includes("null") || isFilterValue.filters?.includes("not_null")) {
            filterPresent = true;
        }
        await this.setState({
            newWildCardFilters: {
                ...this.state.newWildCardFilters,
                [value.searchKey]: {
                    filters: [type === "number" ? "equals" : "contains"],
                    key: ""
                }
            },
            tempWildCardFilters: {
                ...this.state.tempWildCardFilters,
                [value.searchKey]: {
                    filters: [type === "number" ? "equals" : "contains"],
                    key: ""
                }
            }
        });

        this.setState(
            {
                newWildCardFilters: {
                    ...this.state.newWildCardFilters,
                    [value.searchKey]: {
                        filters: this.state.newWildCardFilters[value.searchKey].filters,
                        key: null
                    }
                },
                tempWildCardFilters: {
                    ...this.state.tempWildCardFilters,
                    [value.searchKey]: {
                        filters: this.state.tempWildCardFilters[value.searchKey].filters,
                        key: null
                    }
                }
            },
            () => {
                if (filterPresent) {
                    this.props.updateWildCardFilter(this.state.newWildCardFilters);
                }
            }
        );
        // await this.setState({
        //     newWildCardFilters: {
        //         ...this.state.newWildCardFilters,
        //         [value.searchKey]: {
        //             filters: this.state.newWildCardFilters[value.searchKey].filters,
        //             key: null
        //         }
        //     }
        // });
        // this.props.updateWildCardFilter(this.state.newWildCardFilters);
    };

    render() {
        const {
            keys,
            config,
            updateWildCardFilter,
            actionShow = true,
            isNormalTable = true,
            closView = true,
            filterBlue = "",
            isMonthFilter = false,
            wildCardFilterMonth,
            updateWildCardFilterMonth
        } = this.props;
        return (
            <>
                <tr className={`filter-tr  filter-tr-sticky ${filterBlue}`} id={isMonthFilter ? "wildcardFilterRowCalendar" : "wildcardFilterRow"}>
                    {isNormalTable && <td className="img-sq-box cursor-pointer bg-clr" />}
                    {keys && keys.length
                        ? keys.map((keyItem, i) =>
                              config[keyItem].isVisible ? (
                                  <>
                                      <td className={`filter-box dropdown drop-fil ${config[keyItem].type === "date" ? "drop-date" : ""}`}>
                                          {config[keyItem] && config[keyItem].hasWildCardSearch ? (
                                              <div>
                                                  {config[keyItem] && config[keyItem].type !== "date" ? (
                                                      <>
                                                          <div className="form-group ali">
                                                              {config[keyItem].type === "number" ? (
                                                                  <NumberFormat
                                                                      value={
                                                                          this.state.newWildCardFilters[config[keyItem].searchKey] &&
                                                                          this.state.newWildCardFilters[config[keyItem].searchKey].key
                                                                      }
                                                                      thousandSeparator={true}
                                                                      className={"form-control"}
                                                                      onValueChange={values => {
                                                                          const { value } = values;
                                                                          this.setState({
                                                                              newWildCardFilters: {
                                                                                  ...this.state.newWildCardFilters,
                                                                                  [config[keyItem].searchKey]: {
                                                                                      filters:
                                                                                          this.state.newWildCardFilters[config[keyItem].searchKey]
                                                                                              .filters,
                                                                                      key: value.trim().length ? value : null
                                                                                  }
                                                                              }
                                                                          });
                                                                      }}
                                                                      onKeyPress={event => {
                                                                          if (event.key === "Enter") {
                                                                              this.props.updateWildCardFilter(this.state.newWildCardFilters);
                                                                              this.setState({
                                                                                  selectedField: null
                                                                              });
                                                                          }
                                                                      }}
                                                                  />
                                                              ) : (
                                                                  <input
                                                                      type="text"
                                                                      className="form-control"
                                                                      value={
                                                                          this.state.newWildCardFilters[config[keyItem].searchKey] &&
                                                                          this.state.newWildCardFilters[config[keyItem].searchKey].key
                                                                      }
                                                                      onChange={e => {
                                                                          this.setState({
                                                                              newWildCardFilters: {
                                                                                  ...this.state.newWildCardFilters,
                                                                                  [config[keyItem].searchKey]: {
                                                                                      filters:
                                                                                          this.state.newWildCardFilters[config[keyItem].searchKey]
                                                                                              .filters,
                                                                                      key: e.target.value.trim().length ? e.target.value : null
                                                                                  }
                                                                              }
                                                                          });
                                                                      }}
                                                                      onKeyPress={event => {
                                                                          if (event.key === "Enter") {
                                                                              updateWildCardFilter(this.state.newWildCardFilters);
                                                                              this.setState({
                                                                                  selectedField: null
                                                                              });
                                                                          }
                                                                      }}
                                                                  />
                                                              )}
                                                              {closView && (
                                                                  <span
                                                                      className="material-icons clear"
                                                                      onClick={() => this.handleCloseClick(config[keyItem])}
                                                                  >
                                                                      clear
                                                                  </span>
                                                              )}
                                                              <span
                                                                  className="material-icons img-ali cursor-pointer dropdown-toggle"
                                                                  id="dropdownMenuButton"
                                                                  aria-haspopup="true"
                                                                  aria-expanded="false"
                                                                  onClick={() => this.showFilterDropDown(keyItem)}
                                                              >
                                                                  filter_alt
                                                              </span>
                                                          </div>
                                                      </>
                                                  ) : (
                                                      <>
                                                          <div
                                                              className="caln-div cursor-pointer"
                                                              // onClick={() => this.showFilterDropDown(keyItem)}
                                                          >
                                                              <div className="ali" onClick={() => this.showFilterDropDown(keyItem)}>
                                                                  <div className="caln-txt wid-date">Select Date</div>
                                                                  <span className="material-icons">calendar_today</span>
                                                              </div>
                                                          </div>
                                                      </>
                                                  )}
                                                  {config[keyItem].searchKey && this.renderFilters(keyItem)}
                                              </div>
                                          ) : null}
                                      </td>
                                  </>
                              ) : null
                          )
                        : null}
                    {isMonthFilter ? (
                        <MonthFilter
                            keys={keys}
                            config={config}
                            updateWildCardFilter={updateWildCardFilterMonth}
                            actionShow={actionShow}
                            isNormalTable={isNormalTable}
                            closView={closView}
                            filterBlue={filterBlue}
                            wildCardFilterMonth={wildCardFilterMonth}
                        />
                    ) : null}
                    {actionShow && <td className="action bg-clr" />}
                </tr>
            </>
        );
    }
}
export default WildCardFilter;
