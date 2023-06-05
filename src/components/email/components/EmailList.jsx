/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Highlighter from "react-highlight-words";
import ReactTooltip from "react-tooltip";

import actions from "../actions";

class EmailList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount = async () => {
        ReactTooltip.rebuild();
    };

    componentDidUpdate = () => {
        ReactTooltip.rebuild();
    };

    renderTooltipContent = data => {
        let renderData = data;
        if (renderData && renderData.length <= 25) {
            renderData = null;
        }
        return renderData;
    };

    renderReceipients = data => {
        let receipientList = "";
        if (data && data.length > 1) {
            data.map(d => {
                receipientList = receipientList + d + ",";
            });
        } else {
            receipientList = data[0];
        }
        return receipientList;
    };

    render() {
        const {
            viewDetails,
            emailList,
            match: {
                params: { section = null }
            },
            globalSearchKey
        } = this.props;
        let randomId = "mail" + Math.random();
        return (
            <React.Fragment>
                <ReactTooltip id={randomId} effect="solid" />
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th className="img-sq-box">{/* <img src="/images/drag_indicator.svg" /> */}</th>
                            {section !== "sentitems" ? <th className="ref">From</th> : null}
                            {section !== "inbox" ? <th className="region">To</th> : null}
                            <th className="consultancy">Content</th>
                            <th></th>
                            <th className="consultancy">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {emailList && emailList.length
                            ? emailList.map((email, i) => (
                                  <tr onClick={() => viewDetails(email.id)}>
                                      <td class="indicator">
                                          <i>
                                              <img src="/images/drag_indicator.svg" alt="" />
                                          </i>
                                      </td>
                                      {/* <td class="width-01 pl-3">
                                          <div class="custom-control custom-checkbox">
                                              <input type="checkbox" class="custom-control-input" id="customCheck" />
                                              <label class="custom-control-label" for="customCheck"></label>
                                          </div>
                                      </td> */}
                                      {section !== "sentitems" ? (
                                          <td class="width-02">
                                              <div class="mail-from">
                                                  <Highlighter
                                                      searchWords={globalSearchKey && globalSearchKey.length ? [globalSearchKey] : []}
                                                      textToHighlight={email.from}
                                                  />
                                              </div>
                                          </td>
                                      ) : null}

                                      {section !== "inbox" ? (
                                          <td
                                              class="width-02"
                                              data-tip={this.renderTooltipContent(this.renderReceipients(email.to))}
                                              data-for={randomId}
                                          >
                                              <div class="mail-from">
                                                  <Highlighter
                                                      searchWords={globalSearchKey && globalSearchKey.length ? [globalSearchKey] : []}
                                                      textToHighlight={
                                                          this.renderReceipients(email.to)
                                                          //   this.renderEmailData(section, email)
                                                      }
                                                  />
                                              </div>
                                          </td>
                                      ) : null}
                                      <td class="width-03">
                                          <div class="subject ml-2">
                                              <p>
                                                  <b>
                                                      <Highlighter
                                                          searchWords={globalSearchKey && globalSearchKey.length ? [globalSearchKey] : []}
                                                          textToHighlight={email.subject}
                                                      />
                                                  </b>
                                                  &nbsp;
                                                  <Highlighter
                                                      searchWords={globalSearchKey && globalSearchKey.length ? [globalSearchKey] : []}
                                                      textToHighlight={email.body}
                                                  />
                                              </p>

                                              {/* <div class="info">
                                                  <button class="btn" title="Reset Columns">
                                                      <img src="/images/delete-icon.svg" alt="" />
                                                  </button>
                                              </div> */}
                                          </div>
                                      </td>
                                      <td class="icon">
                                          {email.attachments && email.attachments.length ? <img src="/images/attachment.svg" alt="" /> : null}
                                      </td>

                                      <td class="time">
                                          <Highlighter
                                              searchWords={globalSearchKey && globalSearchKey.length ? [globalSearchKey] : []}
                                              textToHighlight={email.created_at}
                                          />
                                      </td>
                                  </tr>
                              ))
                            : null}
                    </tbody>
                </table>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { emailReducer } = state;
    return { emailReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(EmailList));
