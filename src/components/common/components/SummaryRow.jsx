import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import NumberFormat from "react-number-format";
import _ from "lodash";

class SummaryRow extends Component {
    setSummaryRowData = () => {
        const { tableData, keys, config, summaryRowData } = this.props;
        let temSummaryRow = {};
        tableData.data.map(rowData => {
            keys.map(keyItem => {
                if (config && config[keyItem].type === "number") {
                    if (keyItem === "number_pass") {
                        temSummaryRow[keyItem] = summaryRowData["number_pass_total"] || 0;
                    } else if (keyItem === "number_fail") {
                        temSummaryRow[keyItem] = summaryRowData["number_fail_total"] || 0;
                    } else if (keyItem === "number_corrected") {
                        temSummaryRow[keyItem] = summaryRowData["number_corrected_total"] || 0;
                    } else if (keyItem === "total_devices") {
                        temSummaryRow[keyItem] = summaryRowData["total_devices_total"] || 0;
                    } else if (keyItem === "default_total_devices") {
                        temSummaryRow[keyItem] = summaryRowData["default_total_devices_total"] || 0;
                    } else if (keyItem === "failure_percentage") {
                        temSummaryRow[keyItem] = parseFloat(summaryRowData["failure_percentage_average"]).toFixed(2) || 0;
                    }
                }
            });
        });
        return temSummaryRow;
    };

    render() {
        const { keys, config } = this.props;
        let summaryRow = this.setSummaryRowData();
        return (
            <React.Fragment>
                {!_.isEmpty(summaryRow) ? (
                    <tr>
                        <td className="text-center"></td>
                        {keys.map((keyItem, i) => {
                            return config[keyItem] && config[keyItem].isVisible ? (
                                <td key={i} className={`${config[keyItem].class}`}>
                                    <span className="summary-row-column">
                                        {summaryRow[keyItem]}
                                        {/* {summaryRow[keyItem] && (
                                            // <NumberFormat value={summaryRow[keyItem]} thousandSeparator={true} displayType={"text"} />
                                        )} */}
                                    </span>
                                </td>
                            ) : null;
                        })}
                        {/* <td className=""></td> */}
                    </tr>
                ) : null}
            </React.Fragment>
        );
    }
}

export default withRouter(SummaryRow);
