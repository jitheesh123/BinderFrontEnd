import React, { Component } from "react";
import BuildModalHeader from "./BuildModalHeader";

class AppliedMasterFiltersModal extends Component {
    getNameFromKey = key => {
        switch (key) {
            case "logbook_ids":
                return "Logbooks";
            case "building_ids":
                return "Buildings";
            case "building_type_ids":
                return "Building Types";
            case "campus_ids":
                return "Campuses";
            case "sector_ids":
                return "Sectors";
            case "client_ids":
                return "Clients";
            case "consultancy_ids":
                return "Consultancies";
            case "view":
                return "View";
            case "annual_years":
                return "Annual Years";
            default:
                return "";
        }
    };

    renderTableData = () => {
        let master_filters_applied = JSON.parse(localStorage.getItem("master_filters_applied"));
        return Object.keys(master_filters_applied).map(key => (
            <tr>
                <td className="filter-name">{this.getNameFromKey(key)}</td>
                <td>
                    {master_filters_applied[key] && master_filters_applied[key].length ? (
                        key !== "view" ? (
                            master_filters_applied[key].map(keyValues => <span className="tag">{keyValues}</span>)
                        ) : (
                            <span className="tag">{master_filters_applied[key]}</span>
                        )
                    ) : (
                        "-"
                    )}
                </td>
            </tr>
        ));
    };

    render() {
        const { onCancel } = this.props;
        return (
            <React.Fragment>
                <div
                    id="appliedMasterFiltersModal"
                    className="modal activity-event-modal appliedMasterFiltersModal"
                    style={{ display: "block" }}
                    role="dialog"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader title="Applied Master Filters" onCancel={onCancel} modalClass="appliedMasterFiltersModal" />
                            <div className="modal-body">
                                <div className="table-section">
                                    <table className="table">
                                        <tbody>{this.renderTableData()}</tbody>
                                    </table>
                                    <div className="text-danger">* Annual years are applicable only if view is "annual"</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default AppliedMasterFiltersModal;
