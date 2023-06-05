import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Highlighter from "react-highlight-words";
import Pagination from "./Pagination";

class ViewHistory extends Component {
    state = {
        inputValue: ""
    };

    componentDidMount = async () => {
        const Id = this.props.match.params.id;
        await this.props.getLogData(Id);
    };
    thousands_separators = num => {
        let numbe = num.toString();
        let number = numbe.split(".");
        number[0] = number[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return number.join(".");
    };

    searchHandler = e => {
        e.preventDefault();
        const { inputValue } = this.state;
        if (inputValue.trim().length) {
            this.props.handleGlobalSearchHistory(inputValue);
        }
    };

    setSortOrderParams = async (event, searchKey, val) => {
        await this.props.updateLogSortFilters(searchKey, val);
    };

    render() {
        const {
            logData,
            historyPaginationParams,
            handleDeleteLog,
            handleRestoreLog,
            handlePageClickHistory,
            historyParams,
            hasLogDelete,
            hasLogRestore
        } = this.props;

        return (
            <React.Fragment>
                <div className="table table-ara">
                    <div className="top-fil-ara title-btn-wrapper top-log-nav">
                        <div className="cap">
                            <h4>Logs</h4>
                        </div>
                        <div className="right-cont">
                            <div className="sr-sec search-section">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    onChange={event => {
                                        this.setState({ inputValue: event.target.value });
                                        if (!event.target.value.trim().length) {
                                            this.props.globalSearchKeyHistory && this.props.handleGlobalSearchHistory("");
                                        }
                                    }}
                                    onKeyPress={event => {
                                        if (event.key === "Enter") {
                                            this.searchHandler(event);
                                        }
                                    }}
                                    value={this.state.inputValue}
                                />
                                {this.props.globalSearchKeyHistory && this.state.inputValue ? (
                                    <button
                                        type="button"
                                        className="btn btn-search"
                                        onClick={event => {
                                            this.setState({ inputValue: "" });
                                            this.props.handleGlobalSearchHistory("");
                                        }}
                                    >
                                        <img src="/images/clear-1.svg" alt="" className="global-clear" />
                                    </button>
                                ) : (
                                    <button type="button" className="btn btn-search" onClick={event => this.searchHandler(event)}>
                                        <img src="/images/serach.svg" alt="" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="list-sec">
                        <div className="region-table">
                            <div className="table-section">
                                <table className="table table-bordered file-system-table temptable common-table">
                                    <thead>
                                        <tr>
                                            <th className="img-sq-box">
                                                <img src="/images/table-blue-dots.svg" />
                                            </th>
                                            <th className="ref">All Logs</th>
                                            <th onClick={event => this.setSortOrderParams(event, "versions.created_at")} className="region">
                                                Date and Time
                                                {historyParams && historyParams.order && historyParams.order["versions.created_at"] ? (
                                                    <>
                                                        {historyParams.order["versions.created_at"] === "asc" ? (
                                                            <i
                                                                className={`material-icons table-sort-arrow`}
                                                                onClick={event => this.setSortOrderParams(event, "versions.created_at")}
                                                            >
                                                                north
                                                            </i>
                                                        ) : (
                                                            <i
                                                                className={`material-icons table-sort-arrow`}
                                                                onClick={event => this.setSortOrderParams(event, "versions.created_at")}
                                                            >
                                                                south
                                                            </i>
                                                        )}
                                                    </>
                                                ) : null}
                                            </th>
                                            <th className="consultancy">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logData.data && logData.data.length ? (
                                            <>
                                                {logData.data.map((item, i) => (
                                                    <tr>
                                                        <td className="img-sq-box">
                                                            <img src="/images/table-dot-white.svg" />
                                                        </td>
                                                        <td>
                                                            <ul className="logs-ul">
                                                                {Object.entries(item.changeset).map((data, index) => {
                                                                    return (
                                                                        <li key={index}>
                                                                            <b>
                                                                                <Highlighter
                                                                                    searchWords={[historyParams.search ? historyParams.search : ""]}
                                                                                    textToHighlight={item.user}
                                                                                    autoEscape={true}
                                                                                />
                                                                            </b>{" "}
                                                                            {item.event === "restore" ? "restored" : "changed"} the field{" "}
                                                                            <b>
                                                                                <Highlighter
                                                                                    searchWords={[historyParams.search ? historyParams.search : ""]}
                                                                                    textToHighlight={data[0].replace("_id", "").replace(/_/g, " ")}
                                                                                    autoEscape={true}
                                                                                />
                                                                            </b>{" "}
                                                                            from{" "}
                                                                            <b className="customWindow">
                                                                                <Highlighter
                                                                                    searchWords={[historyParams.search ? historyParams.search : ""]}
                                                                                    textToHighlight={
                                                                                        typeof data[1][0] === "number"
                                                                                            ? this.thousands_separators(
                                                                                                  data[1][0] && data[1][0].toString()
                                                                                              ) || "null"
                                                                                            : (data[1][0] && data[1][0].toString()) || "null"
                                                                                    }
                                                                                    autoEscape={true}
                                                                                />
                                                                            </b>{" "}
                                                                            to{" "}
                                                                            <b className="customWindow">
                                                                                <Highlighter
                                                                                    searchWords={[historyParams.search ? historyParams.search : ""]}
                                                                                    textToHighlight={
                                                                                        typeof data[1][1] === "number"
                                                                                            ? this.thousands_separators(
                                                                                                  data[1][1] && data[1][1].toString()
                                                                                              ) || "null"
                                                                                            : (data[1][1] && data[1][1].toString()) || "null"
                                                                                    }
                                                                                    autoEscape={true}
                                                                                />
                                                                            </b>
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                        </td>
                                                        <td>{item.created_at}</td>
                                                        <td className="action">
                                                            <div className="action-col">
                                                                {hasLogRestore ? (
                                                                    <img
                                                                        className="row-reset-icon"
                                                                        src="/images/reset-icon.svg"
                                                                        alt=""
                                                                        onClick={() => handleRestoreLog(item.id, item.changeset)}
                                                                        title="Restore"
                                                                    />
                                                                ) : null}
                                                                {hasLogDelete ? (
                                                                    <img
                                                                        className="row-delete-icon"
                                                                        src="/images/delete.svg"
                                                                        alt=""
                                                                        onClick={() => handleDeleteLog(item.id, "delete")}
                                                                        title="Delete"
                                                                    />
                                                                ) : null}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </>
                                        ) : (
                                            <tr>
                                                <td colspan="4" className="text-center">
                                                    No records found!
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <Pagination paginationParams={historyPaginationParams} handlePageClick={handlePageClickHistory} />
            </React.Fragment>
        );
    }
}

export default withRouter(ViewHistory);
