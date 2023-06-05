import React, { Component } from "react";
import Highlighter from "react-highlight-words";

import BuildModalHeader from "./BuildModalHeader";
class CurrentAssignmentsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount = async () => {};

    render() {
        const { onCancel, currentAssignments, entity, searchInCurrentAssignments, currentAssignmentsSearchKey = "" } = this.props;
        return (
            <React.Fragment>
                <div id="assignment-modal" className="modal assigned-build-modal cur-as-mod" role="dialog" style={{ display: "block" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader title="Current Assignments" onCancel={onCancel} modalClass="cur-as-mod" />
                            <div className="modal-body">
                                <div className="outer-act-build list-sec survey-out">
                                    <div className="build-tem1">
                                        <div className="outer-avl-bind">
                                            <div className="sr-sec search-section">
                                                <div className="sr-out">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        onChange={e => searchInCurrentAssignments(e.target.value)}
                                                        placeholder="Search"
                                                        value={currentAssignmentsSearchKey}
                                                    />
                                                    <span
                                                        className="clear-btn"
                                                        onClick={() =>
                                                            currentAssignmentsSearchKey.trim().length ? searchInCurrentAssignments("") : null
                                                        }
                                                    >
                                                        Clear
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="table-section">
                                                <table className="table table-bordered survey-table ">
                                                    <thead>
                                                        <tr>
                                                            <th className="img-sq-box">
                                                                <img src="/images/table-blue-dots.svg" alt="" />
                                                            </th>
                                                            <th className="max-width-300">{entity} Name</th>
                                                            <th className="yr">Years</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentAssignments && currentAssignments.length ? (
                                                            currentAssignments.map((item, i) => (
                                                                <tr>
                                                                    <td className="img-sq-box">
                                                                        <img src="/images/table-blue-dots.svg" alt="" />
                                                                    </td>
                                                                    <td className="max-width-300">
                                                                        <Highlighter
                                                                            searchWords={[`${currentAssignmentsSearchKey}`]}
                                                                            textToHighlight={item.name || item.activity_description}
                                                                            className="highlighter"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {item.years && item.years.length
                                                                            ? item.years.sort().map((year, i) => (
                                                                                  <span key={i} className="badge-trans mr-1">
                                                                                      <Highlighter
                                                                                          searchWords={[`${currentAssignmentsSearchKey}`]}
                                                                                          textToHighlight={year}
                                                                                          className="highlighter"
                                                                                      />
                                                                                  </span>
                                                                              ))
                                                                            : null}
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="3" className="text-center">
                                                                    No Records Found !!
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="popup-counter">Count : {currentAssignments ? currentAssignments.length : 0}</div>
                                    </div>
                                </div>
                                <div className="btn-sec btn-cur">
                                    <div className="btn-out-1">
                                        <button className="btn btn-cncl-back" onClick={() => onCancel()}>
                                            <i className="material-icons tic"> close</i>Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default CurrentAssignmentsModal;
