import React, { Component } from "react";
import { connect } from "react-redux";
import LoadingOverlay from "react-loading-overlay";

import TopSlider from "../common/components/TopSlider";
import Loader from "../common/components/Loader";
import actions from "./actions";
import history from "../../config/history";
import ToastMsg from "../common/ToastMessage";
import ReactTooltip from "react-tooltip";
class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allLogbook: [],
            distinctLines: []
        };
    }

    componentDidMount = async () => {
        this.refreshLogbooksData();
        ReactTooltip.rebuild();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.masterFilters !== this.props.masterFilters) {
            await this.refreshLogbooksData();
        }
        ReactTooltip.rebuild();
    };

    refreshLogbooksData = async () => {
        this.props.setIsLoading(true);
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        await this.props.getAllLogbooks(master_filters);
        const {
            logbooksReducer: {
                allLogbooksResponse: { logbooks = [] }
            }
        } = this.props;
        await this.setState({
            allLogbook: logbooks
        });
        this.setLogbookLines();
        this.props.setIsLoading(false);
    };

    setLogbookLines = async () => {
        const { allLogbook } = this.state;
        let tmpDistinctLines = [...new Set(allLogbook.map(logbook => logbook.line))];
        await this.setState({
            distinctLines: tmpDistinctLines
        });
    };

    handleSliderClick = async item => {
        if (item && item.assigned_or_not === true) {
            if (item.is_active && item.is_active === "yes") {
                let master_filters = JSON.parse(localStorage.getItem("master_filters"));
                if (master_filters.view === "trailing") {
                    history.push("/trailingCalendar", { logbook: item });
                } else {
                    history.push("/activityCalendar", { logbook: item });
                }
                await this.setState({
                    activeLogbook: item.id
                });
            } else {
                ToastMsg("No Access at This Time", "info");
            }
        } else {
            ToastMsg("Logbook Not Assigned", "info");
        }
    };
    addDefaultSrc(ev) {
        ev.target.src = "/images/4.png";
    }
    render() {
        const { allLogbook, distinctLines } = this.state;
        const { isLoading } = this.props;
        // let orderCount = Math.max(...allLogbook.map(o => o.order))
        // console.log("count",orderCount)
        let lines = {};
        allLogbook.forEach(item => {
            if (lines[item.line]) {
                lines[item.line] = [...lines[item.line], item.order];
            } else {
                lines[item.line] = [item.order];
            }
        });
        // Object.entries(lines).map(([key,value])=> console.log("key",key,"value",value,"length",value.length))
        let lineCount = Object.entries(lines).map(([key, value]) => value.length) || [];
        let orderCount = lineCount.length ? Math.max(...lineCount) : 4;
        orderCount = orderCount > 6 ? 6 : orderCount;
        // console.log("count", orderCount);
        return (
            <section className="cont-ara">
                <LoadingOverlay active={isLoading} spinner={<Loader />}>
                    <div className="dash">
                        <TopSlider />
                        <ReactTooltip id="log_book" />
                        <div className={orderCount <= 4 ? "dash-cont dash-cont-four" : "dash-cont"}>
                            {distinctLines && distinctLines.length
                                ? distinctLines.map(line => (
                                      <div className={orderCount <= 4 ? "pub-ara four outer-four" : "pub-ara six outer-six"}>
                                          {allLogbook && allLogbook.length
                                              ? allLogbook.map((item, i) => (
                                                    <>
                                                        {item.line === line ? (
                                                            <div
                                                                className={
                                                                    item.assigned_or_not === true
                                                                        ? "items cursor-pointer"
                                                                        : "items cursor-pointer disable"
                                                                }
                                                                data-tip={
                                                                    item.assigned_or_not === true
                                                                        ? ""
                                                                        : "Logbook Not Assigned"
                                                                }
                                                                data-for="log_book"
                                                                onClick={() => this.handleSliderClick(item)}
                                                            >
                                                                <div
                                                                    className="item-head"
                                                                >
                                                                    <div className="icon">
                                                                        <img src="/images/logo-inner.svg" alt="" />
                                                                    </div>
                                                                    {/* <div className="count">{i + 1}</div> */}
                                                                </div>
                                                                {item.image && item.image.url ? (
                                                                    <div className="itm-cnt">
                                                                        <img
                                                                            onError={this.addDefaultSrc}
                                                                            src={item.image && item.image.url}
                                                                            className="img-resposive"
                                                                            alt=""
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <div className="itm-cnt no-data">
                                                                        <img src={`images/no-data.svg`} className="img-resposive" alt="" />
                                                                    </div>
                                                                )}
                                                                <div className="itm-btm">
                                                                    <div className="head">
                                                                        <h2>{item.display_name || item.name}</h2>
                                                                    </div>
                                                                    <div className="lnk-mor">
                                                                        <span>
                                                                            <img src="/images/blu-rig.svg" alt="" />
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                    </>
                                                ))
                                              : null}
                                      </div>
                                  ))
                                : null}
                        </div>
                    </div>
                </LoadingOverlay>
            </section>
        );
    }
}

const mapStateToProps = state => {
    const { logbooksReducer } = state;
    return { logbooksReducer };
};

export default connect(mapStateToProps, { ...actions })(index);
