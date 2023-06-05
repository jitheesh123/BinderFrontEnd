import React, { Component } from "react";
import moment from "moment";
import ReactTooltip from "react-tooltip";

import BuildModalHeader from "../BuildModalHeader";
import Procedures from "../../../settings/activityProcedure/index";
import Forms from "../../../settings/activityForm/index";

class ViewOnlyFastDetails extends Component {
    render() {
        const { surveyDetails, formParams, showErrorBorder, errorParams, activeTab, setActiveTab, onCancel } = this.props;

        return (
            <React.Fragment>
                <div className="modal activity-event-modal event-detail-modal" role="dialog" style={{ display: "block" }} id="modalId">
                    <ReactTooltip id="activity_event_modal" effect="solid" />
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader
                                title={
                                    surveyDetails && surveyDetails.series_number
                                        ? `Series Activity Event (${surveyDetails.series_number})`
                                        : "Single Activity Event"
                                }
                                onCancel={onCancel}
                                modalClass="event-detail-modal"
                            />
                            <div className="modal-body">
                                <div className="tab-section">
                                    <ul>
                                        <li className={`cursor-pointer ${activeTab === 1 ? "active" : null}`} onClick={() => setActiveTab(1)}>
                                            <span className="numb">01</span>
                                            <span className="nme">Basic Info</span>
                                        </li>
                                        <li className={`cursor-pointer ${activeTab === 2 ? "active" : null}`} onClick={() => setActiveTab(2)}>
                                            <span className="numb">02</span>
                                            <span className="nme">Assigned Procedures</span>
                                        </li>
                                        <li className={`cursor-pointer ${activeTab === 3 ? "active" : null}`} onClick={() => setActiveTab(3)}>
                                            <span className="numb">03</span>
                                            <span className="nme">Assigned Forms</span>
                                        </li>
                                    </ul>
                                </div>
                                {activeTab === 1 ? (
                                    <div className="aep-tab-contents">
                                        <div className="box-section">
                                            {surveyDetails.asset && surveyDetails.asset.name ? (
                                                <>
                                                    <div className="col-md-2 box-layer">
                                                        <h3>Building</h3>
                                                        <h4>{surveyDetails.building && surveyDetails.building.name}</h4>
                                                    </div>
                                                    <div className="col-md-2 box-layer">
                                                        <h3>Asset Name</h3>
                                                        <h4>{surveyDetails.asset && surveyDetails.asset.name ? surveyDetails.asset.name : null}</h4>
                                                    </div>
                                                    <div className="col-md-2 box-layer">
                                                        <h3>Test Frequency</h3>
                                                        <h4>{surveyDetails.schedule && surveyDetails.schedule.test_frequency}</h4>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="col-md-3 box-layer">
                                                        <h3>Building</h3>
                                                        <h4>{surveyDetails.building && surveyDetails.building.name}</h4>
                                                    </div>
                                                    <div className="col-md-3 box-layer">
                                                        <h3>Test Frequency</h3>
                                                        <h4>{surveyDetails.schedule && surveyDetails.schedule.test_frequency}</h4>
                                                    </div>
                                                </>
                                            )}
                                            <div className="col-md-6 box-layer mt-35rem">
                                                <h3>Activity</h3>
                                                <h4>{surveyDetails.schedule && surveyDetails.schedule.activity_description}</h4>
                                            </div>
                                            <div className="col-md-3 box-layer">
                                                <h3>Next Due Date</h3>
                                                <h4>{surveyDetails && surveyDetails.next_due_date}</h4>
                                            </div>
                                            <div className="col-md-3 box-layer">
                                                <h3>Last performed</h3>
                                                <h4>{surveyDetails && surveyDetails.date_last_performed}</h4>
                                            </div>
                                            <div className="col-md-3 box-layer">
                                                <h3>Code Reference</h3>
                                                <h4>{surveyDetails.schedule && surveyDetails.schedule.code_reference}</h4>
                                            </div>
                                            <div className="col-md-3 box-layer">
                                                <h3>Flexible Date Calculation</h3>
                                                <h4>{surveyDetails && surveyDetails.flexible_date_calculation}</h4>
                                            </div>
                                        </div>

                                        <div className="box-form-sec">
                                            <div className="col-md-6 form-itm pr-0">
                                                <div className="itm">
                                                    <div className="form-group">
                                                        <label className={showErrorBorder && errorParams.performed_by ? "text-red" : ""}>
                                                            Perfomed By
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder=" "
                                                            value={formParams.performed_by}
                                                            disabled={true}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="itm">
                                                    <div className="form-group calendar">
                                                        <label>Due Date</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder=" "
                                                            value={formParams.due_date && moment(new Date(formParams.due_date)).format("MM-DD-YYYY")}
                                                            disabled={true}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="itm">
                                                    <div className="form-group calendar">
                                                        <label>Actual Date</label>
                                                        <input
                                                            type="text"
                                                            disabled={true}
                                                            className="form-control"
                                                            placeholder=" "
                                                            value={
                                                                formParams.actual_date &&
                                                                moment(new Date(formParams.actual_date)).format("MM-DD-YYYY")
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="itm">
                                                    <div className="form-group">
                                                        <label>Total Devices</label>
                                                        <input
                                                            type="number"
                                                            disabled={true}
                                                            className="form-control"
                                                            placeholder=" "
                                                            value={formParams.total_devices}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="itm">
                                                    <div className="form-group">
                                                        <label>Number Pass</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder=" "
                                                            disabled={true}
                                                            value={formParams.number_pass}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="itm">
                                                    <div className="form-group">
                                                        <label>Number Fail</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder=" "
                                                            disabled={true}
                                                            value={formParams.number_fail}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="itm">
                                                    <div className="form-group calendar">
                                                        <label>Corrected Date</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder=" "
                                                            disabled={true}
                                                            value={
                                                                formParams.corrected_date &&
                                                                moment(new Date(formParams.corrected_date)).format("MM-DD-YYYY")
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="itm">
                                                    <div className="form-group">
                                                        <label>Number Corrected</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder=" "
                                                            disabled={true}
                                                            value={formParams.number_corrected}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="itm itm-check pt-25">
                                                    <div className="custom-control custom-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            checked={formParams.ilsm === "yes" ? true : false}
                                                            className="custom-control-input"
                                                            id="customCheckIlsm"
                                                            name="example1"
                                                            disabled={true}
                                                        />
                                                        <label className="custom-control-label" for="customCheckIlsm">
                                                            ILSM
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3 form-itm frm-2">
                                                <div className="frm-comt">
                                                    <div className="form-group">
                                                        <label>Device Comments</label>
                                                        <textarea
                                                            className="form-control text-area"
                                                            value={formParams.device_comments}
                                                            disabled={true}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="itm itm-check check-dc mb-2">
                                                    <div className="custom-control custom-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            checked={formParams.total_device_updated === "yes" ? true : false}
                                                            className="custom-control-input"
                                                            id="customCheckdc"
                                                            name="example1"
                                                            disabled={true}
                                                        />
                                                        <label className="custom-control-label" for="customCheckdc">
                                                            DEVICE COUNT UPDATED
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="frm-comt">
                                                    <div className="form-group">
                                                        <label>Work Order Number & ILSM Comments</label>
                                                        <textarea
                                                            className="form-control text-area"
                                                            value={formParams.ilsm_comments}
                                                            disabled={true}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3 form-itm frm-1">
                                                <div className="frm-comt">
                                                    <div className="form-group">
                                                        <label>Comments</label>
                                                        <textarea className="form-control text-area" value={formParams.comments} disabled={true} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-sec">
                                            <div className="table-section">
                                                <div className="table-data">
                                                    <table className="table table-bordered file-system-table">
                                                        <thead>
                                                            <tr>
                                                                <th className="img-sq-box">
                                                                    <img alt="" src="/images/table-blue-dots.svg" />
                                                                </th>
                                                                <th className="doc-name">File Name</th>
                                                                <th className="doc-type">Document Type</th>
                                                                <th className="date-sign">Date Signed</th>
                                                                <th className="sign-by">Signed By</th>
                                                                <th className="action">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {surveyDetails.survey_documents && surveyDetails.survey_documents.length
                                                                ? surveyDetails.survey_documents.map((item, i) => (
                                                                      <tr>
                                                                          <td className="img-sq-box">
                                                                              <img alt="" src="/images/table-dot-white.svg" />
                                                                          </td>
                                                                          <td>{item.name || "-"}</td>
                                                                          <td>{item.doc_type || "-"}</td>
                                                                          <td>{item.date_signed || "-"}</td>
                                                                          <td>{item.signed_by || "-"}</td>
                                                                          <td>
                                                                              <div className="action-btn">
                                                                                  <a href={item.url} target="_blank" className="btn btn-view">
                                                                                      View Document
                                                                                  </a>
                                                                              </div>
                                                                          </td>
                                                                      </tr>
                                                                  ))
                                                                : null}
                                                            {surveyDetails.survey_documents && !surveyDetails.survey_documents.length ? (
                                                                <tr>
                                                                    <td className="text-center" colSpan="8">
                                                                        No records found !!
                                                                    </td>
                                                                </tr>
                                                            ) : null}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="btn-sec btn-survey-sec">
                                            <div className="btn-out-1">
                                                <button className="btn btn-cncl-back ml-2" onClick={onCancel}>
                                                    <i className="material-icons tic"> close</i>Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : activeTab === 2 ? (
                                    <div className="aep-tab-contents">
                                        <div className="infoPageContent">
                                            <div className="cmon-ara">
                                                <Procedures hasAction={false} activityId={formParams.activity_id} viewOnly={true} />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="aep-tab-contents">
                                        <div className="infoPageContent">
                                            <div className="cmon-ara">
                                                <Forms hasAction={false} activityId={formParams.activity_id} viewOnly={true} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ViewOnlyFastDetails;
