import React, { Component } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import highcharts3d from "highcharts/highcharts-3d";
import highchartsMore from "highcharts/highcharts-more";
import _ from "lodash";
import * as htmlToImage from "html-to-image";
import moment from "moment";

import { graphDummyData } from "../../../../config/utils";

highchartsMore(Highcharts);

highcharts3d(Highcharts);

class EventBreakdownChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: null,
            chartType: "3D",
            legendData: [],
            totalCount: "",
            showLegendsDetails: false
        };
    }
    componentDidMount = async () => {
        await this.renderChartData();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (!_.isEqual(prevProps.completedEventBreakdownData, this.props.completedEventBreakdownData)) {
            await this.renderChartData();
        }
        if (prevState.chartType !== this.state.chartType) {
            await this.renderChartData();
        }
        if (prevProps.isFullScreen !== this.props.isFullScreen) {
            if (!this.props.isFullscreen) {
                Highcharts.charts.map(chart => {
                    while (chart && chart.series && chart.series.length > 0) chart.series[0].remove(true);
                });
            }
            Highcharts.charts.map(chart => {
                chart && chart.reflow();
            });
            await this.renderChartData();
        }
    };

    getColor = type => {
        // eslint-disable-next-line default-case
        switch (type) {
            case "Completed":
                return "#00FF00";
            case "With Failures":
                return "#80FF80";
            case "With Device":
                return "#44ad36";
            case "Non-Compliant":
                return "#FF8000";
            case "Failed 30 Minute Run":
                return "#55F440";
            case "Failed 10 sec transfer":
                return "#77CF6B";
            case "Other Failure":
                return "#1EA00C";
            case "Failed 30% Load":
                return "#16B600";
        }
    };

    replaceSpaceWithNewLine = str => {
        return str;
        return str.replace(" ", "<br>");
    };

    renderChartData = async () => {
        const { completedEventBreakdownData, toggleSmartReportModal } = this.props;
        let tempData = graphDummyData.completedEventBreakdownData.map(item => {
            return { label: this.replaceSpaceWithNewLine(item.status), name: item.status, y: item.count, color: this.getColor(item.status) };
        });
        let total = 0;
        if (completedEventBreakdownData.length) {
            tempData = completedEventBreakdownData.map(item => {
                total = total + item.count;
                return { label: this.replaceSpaceWithNewLine(item.status), name: item.status, y: item.count, color: this.getColor(item.status) };
            });
        }
        let legendList = tempData;
        const { chartType } = this.state;
        let dataSource = {};
        dataSource = {
            chart: {
                type: "pie",
                backgroundColor: "#FFFFFF",
                options3d: {
                    enabled: chartType == "3D" ? true : false,
                    alpha: 45,
                    beta: 0
                },
                style: {
                    fontFamily: "Poppins, sans-serif"
                }
            },
            navigation: {
                buttonOptions: {
                    theme: {
                        "stroke-width": 1,
                        stroke: "silver",
                        r: 0,
                        states: {
                            hover: {
                                fill: "#bada55"
                            },
                            select: {
                                stroke: "#039",
                                fill: "#bbadab"
                            }
                        }
                    }
                }
            },
            title: {
                text: ""
            },
            accessibility: {
                point: {
                    valueSuffix: "%"
                }
            },

            tooltip: {
                pointFormat: "<b>{point.percentage:.1f}%({point.y})</b>"
            },
            colors: ["#058DC7", "#50B432", "#ED561B", "#DDDF00", "#24CBE5", "#64E572", "#FF9655", "#FFF263", "#6AF9C4"],
            plotOptions: {
                pie: {
                    innerSize: chartType == "doughnut2d" || chartType == "doughnut3d" ? 100 : 0,
                    allowPointSelect: false,
                    cursor: "pointer",
                    depth: 30,
                    showInLegend: this.props.isFullScreen ? true : false,
                    backgroundColor: "#FFFFFF",
                    dataLabels: {
                        enabled: true,
                        format: "{point.label}"
                    },
                    point: {
                        events: {
                            legendItemClick: event => {
                                if (event.target.visible) {
                                    total = total - event.target.options.y;
                                    legendList = legendList && legendList.filter(legend => legend.name != event.target.options.name);
                                } else {
                                    total = total + event.target.options.y;
                                    legendList.push({ name: event.target.options.name, y: event.target.options.y });
                                }
                                this.setState({
                                    legendData: legendList,
                                    totalCount: total
                                });
                            }
                        }
                    }
                },
                series: {
                    cursor: "pointer",
                    events: {
                        click: event => {
                            toggleSmartReportModal("completed_events_breakdown", event.point.name.toLowerCase().replace(/ /g, "_"));
                        }
                    },
                    startAngle: 90,
                    dataLabels: {
                        style: {
                            fontSize: 10
                        }
                    }
                }
            },
            series: [
                {
                    data: tempData,
                    animation: false
                }
            ]
        };
        await this.setState({
            dataSource,
            legendData: tempData,
            totalCount: total
        });
    };

    convertToImage = imgType => {
        let user = localStorage.getItem("userName") || "";
        let name = `Completed_Events_Breakdown-${user}-${moment().format("MM_DD_YYYY HH_mm_ss")}`;
        if (imgType == "jpeg") {
            htmlToImage.toJpeg(document.getElementById("chartComEveBre"), { quality: 0.95 }).then(function (dataUrl) {
                var link = document.createElement("a");
                link.download = `${name}.jpeg`;
                link.href = dataUrl;
                link.click();
            });
        } else if (imgType == "png") {
            htmlToImage.toPng(document.getElementById("chartComEveBre"), { quality: 0.95 }).then(function (dataUrl) {
                var link = document.createElement("a");
                link.download = `${name}.png`;
                link.href = dataUrl;
                link.click();
            });
        }
    };

    renderClass = () => {
        const { isFullScreen, fullScreenChart } = this.props;
        if (isFullScreen) {
            if (fullScreenChart === "completed_events_breakdown") {
                return "col-12";
            } else {
                return "d-none";
            }
        } else {
            return "";
        }
    };

    toggleShowProfileDropDown = value => {
        const { showLegendsDetails } = this.state;
        this.setState({
            showLegendsDetails: value ? value : !showLegendsDetails
        });
    };

    render() {
        const { dataSource, chartType, legendData, totalCount, showLegendsDetails } = this.state;
        const { fullViewHandler, isFullScreen, completedEventBreakdownData } = this.props;
        return (
            <div className={`graph-bx col-xl-4 col-lg-4 col-md-6 ${this.renderClass()}`}>
                <div className="graph-hd">
                    <strong>Completed activity events breakdown</strong>
                    <div className="btn-grp">
                        {!isFullScreen ? (
                            <ul
                                className="prf-lst show-legends-eye"
                                onMouseEnter={() => this.toggleShowProfileDropDown(true)}
                                onMouseLeave={() => this.toggleShowProfileDropDown(false)}
                            >
                                <span className="material-icons">info</span>
                                {!isFullScreen && showLegendsDetails ? (
                                    <div className="dropdown-menu profile-view show" aria-labelledby="profile-info">
                                        <div className="dropdown-content">
                                            {legendData && legendData.length
                                                ? legendData.map(lData => {
                                                      return (
                                                          <button>
                                                              <span>
                                                                  <strong>{lData.name}</strong>
                                                              </span>
                                                              <span>
                                                                  {lData.y ? Number(((lData.y / totalCount) * 100).toFixed(1)) : 0}% ({lData.y})
                                                              </span>
                                                          </button>
                                                      );
                                                  })
                                                : null}
                                        </div>
                                        <button className="total-btn">
                                            <span>
                                                <strong>TOTAL</strong>
                                            </span>
                                            <span>{totalCount}</span>
                                        </button>
                                    </div>
                                ) : null}
                            </ul>
                        ) : null}
                        <div className="dropdown">
                            <button
                                className="btn btn-secondary dropdown-toggle"
                                type="button"
                                id="dropdownMenu2"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                {chartType}
                            </button>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu2">
                                <button className="dropdown-item" type="button" onClick={() => this.setState({ chartType: "2D" })}>
                                    2D
                                </button>
                                <button className="dropdown-item" type="button" onClick={() => this.setState({ chartType: "3D" })}>
                                    3D
                                </button>
                            </div>
                        </div>
                        <div className="dropdown dot-drop">
                            <button
                                className="btn btn-secondary dropdown-toggle"
                                type="button"
                                id="dropdownMenu2"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            ></button>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu2">
                                <button className="dropdown-item" type="button" onClick={() => this.convertToImage("png")}>
                                    Export to PNG
                                </button>
                                <button className="dropdown-item" type="button" onClick={() => this.convertToImage("jpeg")}>
                                    Export to JPEG
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="btn-grp btn-grp-top ml-1 p-0">
                        <button className="btn" onClick={() => fullViewHandler("completed_events_breakdown")}>
                            <img src="images/restore.svg" alt="" />
                        </button>
                    </div>
                </div>
                <div className={`graph-content ${!completedEventBreakdownData.length ? "no-data-sctn" : ""}`} data-descr="No Activity To Report">
                    <div className="g-box" id="chartComEveBre">
                        {dataSource && dataSource.series && dataSource.series.length ? (
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={dataSource}
                                containerProps={
                                    isFullScreen ? { style: { height: "500px", width: "100%" } } : { style: { height: "100%", width: "100%" } }
                                }
                                allowChartUpdate
                            />
                        ) : null}
                        {isFullScreen && dataSource && dataSource.series && dataSource.series.length ? (
                            <div className="chart-footer">
                                <div className="row">
                                    <div className="col-md-9 pr-0">
                                        <div className="result-list">
                                            <ul>
                                                {legendData && legendData.length
                                                    ? legendData.map(lData => {
                                                          return (
                                                              <li>
                                                                  <div className="otr">
                                                                      <strong>{lData.name}</strong>
                                                                      <p>
                                                                          {lData.y ? Number(((lData.y / totalCount) * 100).toFixed(1)) : 0}% (
                                                                          {lData.y})
                                                                      </p>
                                                                  </div>
                                                              </li>
                                                          );
                                                      })
                                                    : null}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="result-total">
                                            <strong>TOTAL = {totalCount}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }
}

export default EventBreakdownChart;
