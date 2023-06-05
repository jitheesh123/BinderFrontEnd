import React, { Component } from "react";
import ReactTooltip from "react-tooltip";

import CommonRow from "./CommonRow";
import CommonTableHeader from "./CommonTableHeader";
import WildCardFilter from "./WildCardFilter";
import SummaryRow from "./SummaryRow";

class CommonTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeRow: null
        };
    }

    componentDidMount = () => {
        ReactTooltip.rebuild();
    };

    componentDidUpdate = () => {
        ReactTooltip.rebuild();
    };

    setActiveRow = async activeRow => {
        await this.setState({
            activeRow
        });
    };

    render() {
        const {
            deleteItem,
            editItem,
            pushItem,
            tableData,
            hasActionCalendar = false,
            hasActionAssign = false,
            hasActionActivityAssign = false,
            hasActionActivityScheduling = false,
            updateActivityScheduling = null,
            updateScheduling = null,
            updateAssignment = null,
            updateActivityAssignment = null,
            hasActionColumn = true,
            hasTableViewDetails = true,
            updateTableSortFilters,
            tableParams,
            hasSort,
            resetSort,
            getListForCommonFilter,
            showWildCardFilter,
            updateWildCardFilter,
            showInfoPage,
            updateCommonFilter,
            hasEdit,
            hasFireEdit,
            hasClientFireEdit,
            hasDelete,
            commonFilter,
            actionShow,
            hasActionDeemingAgencyAssign,
            updateDeemingAgencyAssignment,
            updateFrequencyAssignment,
            hasActionFrequencyAssign,
            hasActionUserAssign,
            updateUserAssignment,
            isWidthAction,
            hasActionBuildingLogbookAssign,
            updateBuildingLogbookAssignment,
            hasActionBuildingAssign,
            updateBuildingAssignment,
            hasActionConsultancyAssign,
            updateConsultancyAssignment,
            hasActionClientAssign,
            updateClientAssignment,
            hasActionProcedureAssign,
            updateProcedureAssignment,
            isActivity,
            isDashboard = false,
            isReportsPage = false,
            summaryRowData,
            hasSummaryRow = false,
            hasActionFormAssign,
            updateFormAssignment,
            hasPush,
            showViewDocument
        } = this.props;
        const { activeRow } = this.state;
        let columnCount = 2;
        let randomId = "common_table" + Math.random();
        return (
            <React.Fragment>
                <ReactTooltip id={randomId} effect="solid" />
                <table className="table table-bordered common-table">
                    <thead>
                        <CommonTableHeader
                            config={tableData.config}
                            keys={tableData.keys}
                            tableData={tableData}
                            updateTableSortFilters={updateTableSortFilters}
                            tableParams={tableParams}
                            hasSort={hasSort}
                            resetSort={resetSort}
                            getListForCommonFilter={getListForCommonFilter}
                            updateCommonFilter={updateCommonFilter}
                            hasActionColumn={hasActionColumn}
                            hasTableViewDetails={hasTableViewDetails}
                            commonFilter={commonFilter}
                            hasActionAssign={hasActionAssign}
                            hasActionActivityAssign={hasActionActivityAssign}
                            hasActionActivityScheduling={hasActionActivityScheduling}
                            hasActionCalendar={hasActionCalendar}
                            isWidthAction={isWidthAction}
                            isActivity={isActivity}
                            randomId={randomId}
                        />
                        {showWildCardFilter ? (
                            <WildCardFilter
                                config={tableData.config}
                                keys={tableData.keys}
                                updateWildCardFilter={updateWildCardFilter}
                                actionShow={actionShow}
                                // updateWildCardFilter={updateWildCardFilter}
                                // wildCardFilter={wildCardFilter}
                                // keys={tableData.keys}
                                // config={tableData.config}
                            />
                        ) : null}
                    </thead>
                    <tbody>
                        {tableData.data && tableData.data.length ? (
                            <>
                                {tableData.data.map((item, index) => (
                                    <CommonRow
                                        config={tableData.config}
                                        keys={tableData.keys}
                                        key={index}
                                        editItem={editItem}
                                        pushItem={pushItem}
                                        deleteItem={deleteItem}
                                        rowData={item}
                                        hasActionCalendar={hasActionCalendar}
                                        updateScheduling={updateScheduling}
                                        updateAssignment={updateAssignment}
                                        hasActionAssign={hasActionAssign}
                                        hasActionActivityAssign={hasActionActivityAssign}
                                        updateActivityAssignment={updateActivityAssignment}
                                        showInfoPage={showInfoPage}
                                        tableParams={tableParams}
                                        hasActionColumn={hasActionColumn}
                                        hasTableViewDetails={hasTableViewDetails}
                                        updateActivityScheduling={updateActivityScheduling}
                                        hasActionActivityScheduling={hasActionActivityScheduling}
                                        hasEdit={hasEdit}
                                        hasFireEdit={hasFireEdit}
                                        hasClientFireEdit={hasClientFireEdit}
                                        hasDelete={hasDelete}
                                        hasActionDeemingAgencyAssign={hasActionDeemingAgencyAssign}
                                        updateDeemingAgencyAssignment={updateDeemingAgencyAssignment}
                                        updateFrequencyAssignment={updateFrequencyAssignment}
                                        hasActionFrequencyAssign={hasActionFrequencyAssign}
                                        hasActionUserAssign={hasActionUserAssign}
                                        updateUserAssignment={updateUserAssignment}
                                        hasActionBuildingLogbookAssign={hasActionBuildingLogbookAssign}
                                        updateBuildingLogbookAssignment={updateBuildingLogbookAssignment}
                                        hasActionBuildingAssign={hasActionBuildingAssign}
                                        updateBuildingAssignment={updateBuildingAssignment}
                                        hasActionConsultancyAssign={hasActionConsultancyAssign}
                                        updateConsultancyAssignment={updateConsultancyAssignment}
                                        hasActionClientAssign={hasActionClientAssign}
                                        updateClientAssignment={updateClientAssignment}
                                        hasActionProcedureAssign={hasActionProcedureAssign}
                                        updateProcedureAssignment={updateProcedureAssignment}
                                        activeRow={activeRow}
                                        setActiveRow={this.setActiveRow}
                                        isDashboard={isDashboard}
                                        isReportsPage={isReportsPage}
                                        hasActionFormAssign={hasActionFormAssign}
                                        updateFormAssignment={updateFormAssignment}
                                        randomId={randomId}
                                        hasPush={hasPush}
                                        showViewDocument={showViewDocument}
                                    />
                                ))}
                                {hasSummaryRow ? (
                                    <SummaryRow
                                        keys={tableData.keys}
                                        config={tableData.config}
                                        tableData={tableData}
                                        summaryRowData={summaryRowData}
                                    />
                                ) : null}
                            </>
                        ) : (
                            <tr>
                                {tableData.keys.map(keyItem => {
                                    if (tableData.config && tableData.config[keyItem] && tableData.config[keyItem].isVisible) {
                                        columnCount += 1;
                                    }
                                })}
                                <td colSpan={columnCount} className="text-center">
                                    No records found!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </React.Fragment>
        );
    }
}

export default CommonTable;
