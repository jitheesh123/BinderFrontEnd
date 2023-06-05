import React, { Component } from "react";
import Highlighter from "react-highlight-words";
import _ from "lodash";
import { withRouter } from "react-router-dom";

import { formatNumber, formatmoney } from "../../../config/utils";

class CommonRow extends Component {
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

    renderCellData = (type, data, keyItem) => {
        let returnData = data;
        switch (type) {
            case "string":
                returnData = (data && data.toString()) || "-";
                break;
            case "date":
                returnData = data || "-";
                break;
            case "object":
                returnData = data && data.name ? data.name : "-";
                break;
            case "boolean":
                returnData = data === "true" || data === true || data === "yes" ? "Yes" : "No";
                break;
            case "number":
                returnData = data ? formatNumber(parseInt(data)) : "-";
                break;
            case "float":
                returnData = data ? formatNumber(parseFloat(data)) : "-";
                break;
            case "money":
                returnData = data ? formatmoney(parseInt(data)) : "-";
                break;
            case "arrayString":
                returnData = data && data.length ? data.join() : "-";
                break;
            case "window":
                if (data?.includes("~")) {
                    // returnData = data.replace(/~/g, "\n");
                    let dataToArray = data
                        ?.split("~")
                        .map(item => `${item.trim()}`)
                        .join("\n");
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
        if (keyItem === "linked_activity") {
            returnData = (data && data.activity_description) || "-";
        }
        return returnData;
    };

    renderTooltipContent = (keyItem, type, data) => {
        let renderData = this.renderCellData(type, data, keyItem);
        if (keyItem !== "activity_description" && keyItem !== "code_reference" && keyItem !== "standard") {
            if (renderData && renderData.length <= 25) {
                renderData = null;
            }
        }
        return renderData;
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

    setInputForTooltip = (keyItem, rowData, data) => {
        switch (keyItem) {
            case "activity_description":
                return rowData.activity_tooltip;
            case "code_reference":
                return rowData.code_reference_tooltip;
            case "standard":
                return rowData.standard_tooltip;
            default:
                return data;
        }
    };

    render() {
        const {
            editItem,
            deleteItem,
            rowData,
            keys,
            config,
            hasActionCalendar,
            updateAssignment,
            updateActivityAssignment,
            hasActionAssign,
            updateScheduling,
            showInfoPage,
            hasActionColumn = true,
            hasActionActivityAssign,
            hasTableViewDetails = true,
            updateActivityScheduling,
            hasActionActivityScheduling,
            hasEdit = true,
            hasFireEdit,
            hasClientFireEdit,
            hasDelete = true,
            match: {
                params: { tab }
            },
            hasActionDeemingAgencyAssign = false,
            updateDeemingAgencyAssignment,
            hasActionFrequencyAssign = false,
            updateFrequencyAssignment,
            hasActionUserAssign = false,
            updateUserAssignment,
            hasActionBuildingLogbookAssign = false,
            updateBuildingLogbookAssignment,
            hasActionBuildingAssign = false,
            updateBuildingAssignment,
            hasActionConsultancyAssign = false,
            updateConsultancyAssignment,
            hasActionClientAssign = false,
            updateClientAssignment,
            hasActionProcedureAssign = false,
            updateProcedureAssignment,
            activeRow,
            setActiveRow,
            isDashboard = false,
            isReportsPage = false,
            hasActionFormAssign = false,
            updateFormAssignment,
            randomId,
            hasPush = true,
            pushItem,
            showViewDocument,
            showDocument
        } = this.props;

        let searchKeysArray = this.setSearchKeysArray();
        return (
            <>
                <tr
                    onDoubleClick={() =>
                        hasTableViewDetails
                            ? isDashboard || isReportsPage
                                ? showInfoPage(rowData.id, rowData.schedule_id, rowData.logbook_id, rowData.edit_form)
                                : showInfoPage(
                                      rowData.id,
                                      rowData && rowData.consultancy
                                          ? rowData.consultancy.id
                                          : rowData && rowData.client
                                          ? rowData.client.id
                                          : rowData && rowData.building
                                          ? rowData.building.id
                                          : ""
                                  )
                            : null
                    }
                    className={activeRow === rowData.id ? "active-row table-row" : "table-row"}
                    onClick={() => setActiveRow(rowData.id)}
                >
                    <td
                        className="img-sq-box cursor-pointer"
                        onClick={() =>
                            hasTableViewDetails
                                ? isDashboard || isReportsPage
                                    ? showInfoPage(rowData.id, rowData.schedule_id, rowData.logbook_id, rowData.edit_form)
                                    : showInfoPage(
                                          rowData.id,
                                          rowData && rowData.consultancy
                                              ? rowData.consultancy.id
                                              : rowData && rowData.client
                                              ? rowData.client.id
                                              : rowData && rowData.building
                                              ? rowData.building.id
                                              : ""
                                      )
                                : null
                        }
                        title="View"
                    >
                        <img src="/images/table-blue-dots.svg" alt="" />
                    </td>
                    {keys &&
                        keys.map((keyItem, i) => {
                            return config && config[keyItem] && config[keyItem].isVisible ? (
                                config[keyItem].type === "window" && rowData[keyItem]?.includes("~") ? (
                                    // <td>{this.renderCellData(config[keyItem].type, rowData[keyItem], keyItem)}</td>
                                    <td className="customWindow">
                                        <Highlighter
                                            searchWords={this.filterHighlighter(config[keyItem].searchKey) ? searchKeysArray : []}
                                            textToHighlight={
                                                this.renderCellData(config[keyItem].type, rowData[keyItem], keyItem) &&
                                                this.renderCellData(config[keyItem].type, rowData[keyItem], keyItem)
                                            }
                                        />
                                    </td>
                                ) : tab && tab === "assignedconsultancies" ? (
                                    <td
                                        key={i}
                                        data-tip={
                                            this.renderTooltipContent(
                                                keyItem,
                                                config[keyItem].type,
                                                this.setInputForTooltip(keyItem, rowData, rowData.consultancy[keyItem])
                                            ) || ""
                                        }
                                        data-for={randomId}
                                    >
                                        <Highlighter
                                            searchWords={this.filterHighlighter(config[keyItem].searchKey) ? searchKeysArray : []}
                                            textToHighlight={
                                                this.renderCellData(config[keyItem].type, rowData.consultancy[keyItem], keyItem) &&
                                                this.renderCellData(config[keyItem].type, rowData.consultancy[keyItem], keyItem)
                                            }
                                        />
                                    </td>
                                ) : tab && tab === "assignedbuildings" ? (
                                    <td
                                        key={i}
                                        data-tip={
                                            this.renderTooltipContent(
                                                keyItem,
                                                config[keyItem].type,
                                                this.setInputForTooltip(keyItem, rowData, rowData.building[keyItem])
                                            ) || ""
                                        }
                                        data-for={randomId}
                                    >
                                        <Highlighter
                                            searchWords={this.filterHighlighter(config[keyItem].searchKey) ? searchKeysArray : []}
                                            textToHighlight={
                                                this.renderCellData(config[keyItem].type, rowData.building[keyItem], keyItem) &&
                                                this.renderCellData(config[keyItem].type, rowData.building[keyItem], keyItem)
                                            }
                                        />
                                    </td>
                                ) : tab && tab === "assignedclients" ? (
                                    <td
                                        key={i}
                                        data-tip={
                                            this.renderTooltipContent(
                                                keyItem,
                                                config[keyItem].type,
                                                this.setInputForTooltip(keyItem, rowData, rowData.client[keyItem])
                                            ) || ""
                                        }
                                        data-for={randomId}
                                    >
                                        <Highlighter
                                            searchWords={this.filterHighlighter(config[keyItem].searchKey) ? searchKeysArray : []}
                                            textToHighlight={
                                                this.renderCellData(config[keyItem].type, rowData.client[keyItem], keyItem) &&
                                                this.renderCellData(config[keyItem].type, rowData.client[keyItem], keyItem)
                                            }
                                        />
                                    </td>
                                ) : (
                                    <td
                                        key={i}
                                        data-tip={
                                            this.renderTooltipContent(
                                                keyItem,
                                                config[keyItem].type,
                                                this.setInputForTooltip(keyItem, rowData, rowData[keyItem])
                                            ) || ""
                                        }
                                        data-for={randomId}
                                    >
                                        <Highlighter
                                            className="high-lighter"
                                            searchWords={this.filterHighlighter(config[keyItem].searchKey) ? searchKeysArray : []}
                                            textToHighlight={
                                                this.renderCellData(config[keyItem].type, rowData[keyItem], keyItem) &&
                                                this.renderCellData(config[keyItem].type, rowData[keyItem], keyItem)
                                            }
                                            autoEscape={true}
                                        />
                                    </td>
                                )
                            ) : null;
                        })}
                    {hasActionColumn ? (
                        <td className={this.props.location.pathname === "/activities" ? "action action-th-wide " : "action"}>
                            <div className={this.props.location.pathname === "/Document" ? "action-col btn-blue-table" : "action-col"}>
                                {hasEdit ? (
                                    <img className="row-edit-icon" src="/images/edit.svg" title="Edit" alt="" onClick={() => editItem(rowData.id)} />
                                ) : null}
                                {hasPush && this.props.location.pathname === "/activities" ? (
                                    <img
                                        className="row-edit-icon"
                                        title="Push Activity"
                                        src="/images/push-activity.svg"
                                        alt=""
                                        onClick={() => pushItem(rowData.id)}
                                    />
                                ) : null}
                                {hasFireEdit && rowData?.building_logbook.name === "Fire Drill" ? (
                                    <img className="row-edit-icon" src="/images/edit.svg" alt="" onClick={() => editItem(rowData.id)} />
                                ) : null}
                                {hasClientFireEdit && rowData.logbook.name === "Fire Drill" ? (
                                    <img className="row-edit-icon" src="/images/edit.svg" alt="" onClick={() => editItem(rowData.id)} />
                                ) : null}

                                {hasActionConsultancyAssign ? (
                                    <img
                                        className="row-edit-icon row-assign"
                                        src="/images/assign-cunsaltancy-01.svg"
                                        alt=""
                                        onClick={() => updateConsultancyAssignment(rowData.id)}
                                        title="Assign Consultancies"
                                    />
                                ) : null}
                                {hasActionClientAssign ? (
                                    <img
                                        className="row-edit-icon row-assign"
                                        src="/images/assign-client-01.svg"
                                        alt=""
                                        onClick={() => updateClientAssignment(rowData.id)}
                                        title="Assign Clients"
                                    />
                                ) : null}
                                {hasActionBuildingAssign ? (
                                    <img
                                        className="row-edit-icon row-assign"
                                        src="/images/add-icon.svg"
                                        alt=""
                                        onClick={() => updateBuildingAssignment(rowData.id)}
                                        title="Assign Buildings"
                                    />
                                ) : null}
                                {hasActionCalendar ? (
                                    <img
                                        className="row-edit-icon row-assign"
                                        src="/images/assign.svg"
                                        alt=""
                                        onClick={() => updateScheduling(rowData.id)}
                                        title="Assign Logbooks"
                                    />
                                ) : null}
                                {hasActionActivityScheduling ? (
                                    <img
                                        className="row-edit-icon row-assign"
                                        src="/images/assign-activity.svg"
                                        alt=""
                                        onClick={() => updateActivityScheduling(rowData.id)}
                                        title="Assign Activities"
                                    />
                                ) : null}
                                {hasActionAssign ? (
                                    <img
                                        className="row-edit-icon row-assign"
                                        src="/images/assign.svg"
                                        alt=""
                                        onClick={() => updateAssignment(rowData.id)}
                                        title="Assign Logbooks"
                                    />
                                ) : null}
                                {hasActionActivityAssign ? (
                                    <img
                                        className="row-edit-icon row-assign"
                                        src="/images/assign-activity.svg"
                                        alt=""
                                        onClick={() => updateActivityAssignment(rowData.id)}
                                        title="Assign Activities"
                                    />
                                ) : null}
                                {hasActionDeemingAgencyAssign ? (
                                    <img
                                        className="row-edit-icon row-assign"
                                        src="/images/add-icon.svg"
                                        alt=""
                                        onClick={() => updateDeemingAgencyAssignment(rowData.id)}
                                        title="Assign Deeming Agencies"
                                    />
                                ) : null}
                                {hasActionFrequencyAssign ? (
                                    <img
                                        className="row-edit-icon row-assign"
                                        src="/images/add-icon.svg"
                                        alt=""
                                        onClick={() => updateFrequencyAssignment(rowData.id)}
                                        title="Assign Frequencies"
                                    />
                                ) : null}
                                {hasActionUserAssign ? (
                                    <img
                                        className="row-edit-icon row-assign"
                                        src="/images/add-icon.svg"
                                        alt=""
                                        onClick={() => updateUserAssignment(rowData.id)}
                                        title="Assign Users"
                                    />
                                ) : null}
                                {hasActionBuildingLogbookAssign ? (
                                    <img
                                        className="row-edit-icon row-assign"
                                        src="/images/assign.svg"
                                        alt=""
                                        onClick={() => updateBuildingLogbookAssignment(rowData.id)}
                                        title="Assign Building Logbooks"
                                    />
                                ) : null}
                                {hasActionProcedureAssign ? (
                                    <img
                                        className="row-edit-icon row-assign"
                                        src="/images/assign.svg"
                                        alt=""
                                        onClick={() => updateProcedureAssignment(rowData.id)}
                                        title="Assign Procedures"
                                    />
                                ) : null}
                                {hasActionFormAssign ? (
                                    <img
                                        className="row-edit-icon row-assign"
                                        src="/images/assign-activity.svg"
                                        alt=""
                                        onClick={() => updateFormAssignment(rowData.id)}
                                        title="Assign Forms"
                                    />
                                ) : null}
                                {showViewDocument ? (
                                    <a href={rowData.url} target="_blank">
                                        View Document
                                    </a>
                                ) : null}
                                {hasDelete ? (
                                    <img
                                        className="row-delete-icon"
                                        src="/images/delete.svg"
                                        alt=""
                                        onClick={() => deleteItem(rowData.id)}
                                        title="Delete"
                                    />
                                ) : null}
                            </div>
                        </td>
                    ) : null}
                </tr>
            </>
        );
    }
}

export default withRouter(CommonRow);
