import React, { Component } from "react";
import moment from "moment";
import DatePicker from "react-date-picker";
import { withRouter } from "react-router-dom";

class WildCardFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newWildCardFilters: this.props.wildCardFilterMonth || {},
            selectedField: null,
            filterTextValues: {},
            filterDate: {},
            selectedDateFilterKey: {},
            selectedStatuses: {},
            keySelectData: {},
            keySelectDataBetween: {},
            keys: [],
            tempFilters: null
        };
    }

    componentDidMount = async () => {
        document.addEventListener("keydown", this.handleKeyPress);
        await this.setCalendarColumns();
        const { config } = this.props;
        const { keys } = this.state;
        let tempWcFilter = {};
        if (this.state.newWildCardFilters) {
            if (keys && keys.length) {
                keys.map((keyItem, i) => {
                    tempWcFilter[config[keyItem].monthSearchKey] = {
                        key: null,
                        status: [],
                        not_null: false,
                        start_date: "",
                        end_date: ""
                    };
                });
            }
            await this.setState({
                newWildCardFilters: tempWcFilter
            });
        }
        let tempFilterTextValues = {};
        if (keys && keys.length) {
            keys.map((keyItem, i) => {
                tempFilterTextValues[config[keyItem].monthSearchKey] = null;
            });
        }
        this.setState({
            filterTextValues: tempFilterTextValues
        });
        this.setState({
            isLoading: false
        });
    };

    setCalendarColumns = async (type = true) => {
        let currentMonth = new Date().getMonth();
        let tempCalColums = [];
        let currentTemp = [];
        let PrevTemp = [];
        moment.monthsShort().map((month, i) => {
            if (currentMonth >= i) {
                currentTemp.push(month);
            } else {
                PrevTemp.push(month);
            }
        });
        tempCalColums = currentTemp.concat(PrevTemp);
        const {
            location: { pathname }
        } = this.props;
        if (pathname === "/trailingCalendar") {
            tempCalColums = currentTemp.reverse().concat(PrevTemp.reverse());
        }

        await this.setState({
            keys: tempCalColums
        });
    };

    componentWillUnmount = () => {
        document.removeEventListener("keydown", this.handleKeyPress);
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

    checkForDate = (keyItem, choice) => {
        if (choice === "from") {
            if ((this.state.filterDate[keyItem] && this.state.filterDate[keyItem].from) || this.state.filterDate.from) {
                return true;
            }
        } else {
            if ((this.state.filterDate[keyItem] && this.state.filterDate[keyItem].to) || this.state.filterDate.to) {
                return true;
            }
        }
        return false;
    };

    renderFilters = keyItem => {
        if (this.state.selectedField !== keyItem) {
            return null;
        }
        const { config } = this.props;
        const dateFilterKeys = [
            { value: "Completed with Failures", label: "Completed with Failures" },
            { value: "Completed with Device", label: "Completed with Device" },
            { value: "Incomplete", label: "Incomplete" },
            { value: "Incomplete Document", label: "Incomplete Document" },
            { value: "In the Threshold Window", label: "In the Threshold Window" },
            { value: "Incomplete Device", label: "Incomplete Device" },
            { value: "Non-Compliant", label: "Non-Compliant" },
            { value: "Add Survey", label: "Add Survey" },
            { value: "Completed", label: "Completed" },
            { value: "Add Survey Overdue", label: "Add Survey Overdue" }
        ];

        let filterListToCheck =
            this.state.newWildCardFilters[config[keyItem].monthSearchKey] && this.state.newWildCardFilters[config[keyItem].monthSearchKey].status
                ? this.state.newWildCardFilters[config[keyItem].monthSearchKey].status
                : [];

        if (config[keyItem] && config[keyItem].type && config[keyItem].type === "date") {
            return (
                <div className="dropdown-menu dropdown-table tempDrop wcf-month" aria-labelledby="dropdownMenuButton">
                    <div className="dropdown-item select-date-drop">
                        <div className="form-group-out form-group calendar">
                            <label className="col-md-3 p-0">From</label>
                            <DatePicker
                                format="MM-dd-y"
                                className="form-control"
                                onCalendarOpen={() => {
                                    if (!this.checkForDate(keyItem, "from")) {
                                        this.setState({
                                            newWildCardFilters: {
                                                ...this.state.newWildCardFilters,
                                                [keyItem]: {
                                                    ...this.state.newWildCardFilters[keyItem],
                                                    start_date: new Date(moment().month(keyItem).startOf("month")) || ""
                                                }
                                            }
                                        });
                                    }
                                }}
                                onChange={value => {
                                    this.setState({
                                        newWildCardFilters: {
                                            ...this.state.newWildCardFilters,
                                            [keyItem]: {
                                                ...this.state.newWildCardFilters[keyItem],
                                                start_date: value || ""
                                            }
                                        }
                                    });
                                }}
                                value={
                                    this.state.newWildCardFilters[keyItem] &&
                                    this.state.newWildCardFilters[keyItem].start_date &&
                                    new Date(this.state.newWildCardFilters[keyItem].start_date)
                                }
                            />
                        </div>
                        <div className="form-group-out form-group calendar">
                            <label className="col-md-3 p-0">To</label>
                            <DatePicker
                                format="MM-dd-y"
                                className="form-control"
                                onCalendarOpen={() => {
                                    if (!this.checkForDate(keyItem, "to")) {
                                        this.setState({
                                            newWildCardFilters: {
                                                ...this.state.newWildCardFilters,
                                                [keyItem]: {
                                                    ...this.state.newWildCardFilters[keyItem],
                                                    end_date: new Date(moment().month(keyItem).endOf("month")) || ""
                                                }
                                            }
                                        });
                                    }
                                }}
                                onChange={value => {
                                    this.setState({
                                        newWildCardFilters: {
                                            ...this.state.newWildCardFilters,
                                            [keyItem]: {
                                                ...this.state.newWildCardFilters[keyItem],
                                                end_date: value || ""
                                            }
                                        }
                                    });
                                }}
                                value={
                                    this.state.newWildCardFilters[keyItem] &&
                                    this.state.newWildCardFilters[keyItem].end_date &&
                                    new Date(this.state.newWildCardFilters[keyItem].end_date)
                                }
                            />
                        </div>
                    </div>
                    <hr />
                    <div className="dropdown-item drop-out">
                        <div className="custom-control custom-checkbox">
                            <input
                                type="checkbox"
                                id="customCheck1"
                                name="example2"
                                className="custom-control-input"
                                checked={
                                    this.state.newWildCardFilters &&
                                    this.state.newWildCardFilters[keyItem] &&
                                    this.state.newWildCardFilters[keyItem].not_null
                                }
                                onClick={() => this.setFilterKeysForDate("not_null", config[keyItem].monthSearchKey, keyItem)}
                            />
                            <label className="custom-control-label" for="customCheck1">
                                Not Null
                            </label>
                        </div>
                    </div>
                    <hr />
                    <div className="dropdown-item d-flex drop-out flex-wrap">
                        {dateFilterKeys.map((item, i) => (
                            <>
                                <div key={i} className="custom-control custom-checkbox col-md-12">
                                    {item.value ? (
                                        <>
                                            <input
                                                className="custom-control-input"
                                                id={i}
                                                type="checkbox"
                                                checked={filterListToCheck && filterListToCheck.length && filterListToCheck.includes(item.value)}
                                                onClick={() => this.setFilterKeysForDate(item.value, config[keyItem].monthSearchKey, keyItem)}
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
                    <div className="btn-otr d-flex justify-content-center">
                        <button className="btn btn-create" onClick={() => this.updateDateFilterHandler(config[keyItem].monthSearchKey)}>
                            OK
                        </button>
                        <button
                            className="btn btn-cncl-back ml-2"
                            onClick={() => this.cancelDateFilterHandler(config[keyItem].monthSearchKey, config[keyItem], config[keyItem].searchKey)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            );
        }
    };

    cancelDateFilterHandler = async keyItem => {
        const { tempFilters } = this.state;
        let tempFilNew = JSON.parse(JSON.stringify(this.state.tempFilters));
        if (tempFilters) {
            await this.setState({
                newWildCardFilters: tempFilNew
            });
        }
        this.showFilterDropDown(keyItem);
    };

    setFilterKeysForDate = async (filterKey, searchKey, keyItem) => {
        let tempWcFilter = this.state.newWildCardFilters;
        if (tempWcFilter[searchKey] && !tempWcFilter[searchKey].status) {
            tempWcFilter[searchKey].status = [];
        }
        if (this.state.selectedDateFilterKey[keyItem] !== filterKey) {
            await this.setState(prevState => ({
                selectedDateFilterKey: {
                    ...prevState.selectedDateFilterKey,
                    [keyItem]: filterKey
                }
            }));

            if (filterKey !== "in_between" && filterKey !== "not_null") {
                if (tempWcFilter[searchKey].status && !tempWcFilter[searchKey].status.includes(filterKey)) {
                    tempWcFilter[searchKey].status.push(filterKey);
                } else {
                    tempWcFilter[searchKey].status =
                        tempWcFilter[searchKey].status && tempWcFilter[searchKey].status.filter(item => item !== filterKey);
                }
            } else if (filterKey === "not_null") {
                tempWcFilter[searchKey].not_null = !tempWcFilter[searchKey].not_null;
            }
            tempWcFilter[searchKey].start_date = this.state.filterDate.from || "";
            tempWcFilter[searchKey].end_date = this.state.filterDate.to || "";
        } else {
            this.setState(prevState => ({
                selectedDateFilterKey: {
                    ...prevState.selectedDateFilterKey,
                    [keyItem]: null
                }
            }));
            if (filterKey !== "in_between" && filterKey !== "not_null") {
                if (tempWcFilter[searchKey].status && !tempWcFilter[searchKey].status.includes(filterKey)) {
                    tempWcFilter[searchKey].status.push(filterKey);
                } else {
                    tempWcFilter[searchKey].status = tempWcFilter[searchKey].status.filter(item => item !== filterKey);
                }
            } else if (filterKey === "not_null") {
                tempWcFilter[searchKey].not_null = !tempWcFilter[searchKey].not_null;
            }
            tempWcFilter[searchKey].start_date = this.state.filterDate.from || "";
            tempWcFilter[searchKey].end_date = this.state.filterDate.to || "";
        }
        this.setState({
            newWildCardFilters: tempWcFilter
        });
    };

    updateDateFilterHandler = async keyItem => {
        const { newWildCardFilters } = this.state;
        let tempFil = JSON.parse(JSON.stringify(this.state.newWildCardFilters));
        await this.setState({
            tempFilters: tempFil
        });
        this.props.updateWildCardFilter(newWildCardFilters);
        this.showFilterDropDown(keyItem);
    };

    render() {
        const { config, updateWildCardFilter, actionShow = true, closView = true } = this.props;
        const { keys } = this.state;
        return (
            <>
                {keys && keys.length
                    ? keys.map((keyItem, i) =>
                          config[keyItem].isMonth ? (
                              <td className={`filter-box dropdown drop-fil ${config[keyItem].type === "date" ? "drop-date" : ""}`}>
                                  {config[keyItem] && config[keyItem].hasWildCardSearch ? (
                                      <div>
                                          {
                                              <>
                                                  <div className="caln-div cursor-pointer">
                                                      <div className="form-group">
                                                          <input
                                                              type="text"
                                                              className="form-control"
                                                              onChange={async e => {
                                                                  await this.setState({
                                                                      newWildCardFilters: {
                                                                          ...this.state.newWildCardFilters,
                                                                          [config[keyItem].monthSearchKey]: {
                                                                              status: this.state.newWildCardFilters[config[keyItem].monthSearchKey]
                                                                                  .status,
                                                                              not_null:
                                                                                  this.state.newWildCardFilters[config[keyItem].monthSearchKey]
                                                                                      .not_null,
                                                                              start_date:
                                                                                  this.state.newWildCardFilters[config[keyItem].monthSearchKey]
                                                                                      .start_date,
                                                                              end_date:
                                                                                  this.state.newWildCardFilters[config[keyItem].monthSearchKey]
                                                                                      .end_date,
                                                                              key: e.target.value.trim().length ? e.target.value : ""
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
                                                              value={
                                                                  this.state.newWildCardFilters[config[keyItem].monthSearchKey] &&
                                                                  this.state.newWildCardFilters[config[keyItem].monthSearchKey].key
                                                              }
                                                          />
                                                          {closView && (
                                                              <span
                                                                  className="material-icons clear"
                                                                  onClick={async e => {
                                                                      await this.setState({
                                                                          newWildCardFilters: {
                                                                              ...this.state.newWildCardFilters,
                                                                              [config[keyItem].monthSearchKey]: {
                                                                                  key: null
                                                                              }
                                                                          }
                                                                      });
                                                                      updateWildCardFilter(this.state.newWildCardFilters);
                                                                      this.setState({
                                                                          selectedField: null
                                                                      });
                                                                  }}
                                                              >
                                                                  clear
                                                              </span>
                                                          )}
                                                          <span
                                                              className="material-icons img-ali cursor-pointer dropdown-toggle"
                                                              id="dropdownMenuButton"
                                                              onClick={() => this.showFilterDropDown(keyItem)}
                                                          >
                                                              filter_alt
                                                          </span>
                                                      </div>
                                                  </div>
                                              </>
                                          }
                                          {config[keyItem].monthSearchKey && this.renderFilters(keyItem)}
                                      </div>
                                  ) : null}
                              </td>
                          ) : null
                      )
                    : null}
                {actionShow && <td className="action bg-clr" />}
            </>
        );
    }
}
export default withRouter(WildCardFilter);
