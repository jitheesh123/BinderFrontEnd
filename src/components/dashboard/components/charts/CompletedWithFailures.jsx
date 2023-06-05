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
        if (!_.isEqual(prevProps.completedWithFailureData, this.props.completedWithFailureData)) {
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

    renderChartData = async () => {
        const { completedWithFailureData, toggleSmartReportModal, chart_view } = this.props;
        let tempData = graphDummyData.completedWithFailureData.map(item => {
            return { name: item.activity_description, y: item.percentage, count: item.count };
        });
        let total = 0;
        if (completedWithFailureData.length) {
            if (chart_view === "percentage") {
                tempData = completedWithFailureData.map(item => {
                    total = total + item.count;
                    return {
                        name: item.activity_description,
                        logbook: item.logbook,
                        y: item.percentage,
                        count: item.count,
                        total_count: item.total_count
                    };
                });
            } else {
                tempData = completedWithFailureData.map(item => {
                    total = total + item.count;
                    return {
                        name: item.activity_description,
                        logbook: item.logbook,
                        y: item.percentage,
                        count: item.count,
                        total_devices: item.total_devices,
                        total_devices_failed: item.total_devices_failed
                    };
                });
            }
        }
        let legentList = tempData;
        const { chartType } = this.state;
        let dataSource = {};
        dataSource = {
            chart: {
                type: "column",
                options3d: {
                    enabled: chartType == "3D" ? true : false,
                    alpha: 15,
                    beta: 15,
                    viewDistance: 25,
                    depth: 95
                }
            },
            title: {
                text: ""
            },
            colors: ["#FF0000", "#FF6060", "#FF8000", "#FFBF00", "#FFFF00", "#0000FF", "#0080FF", "#00FFFF", "#80FF80", "#00FF00"],
            plotOptions: {
                column: {
                    dataLabels: {
                        enabled: true,
                        format: "{point.y:.1f}%"
                    },
                    // pointWidth: 40,
                    // pointPlacement: "between",
                    // pointPadding: 40,
                    showInLegend: this.props.isFullScreen ? true : false
                },
                series: {
                    pointPadding: 0,
                    events: {
                        click: event => {
                            toggleSmartReportModal("top_10_completed_with_failures", event.point.name);
                        },
                        legendItemClick: event => {
                            if (event.target.visible) {
                                total = 0;
                                legentList = [];
                            } else {
                                event.target.options.data.map(item => {
                                    total = total + item.count;
                                    legentList.push({ name: item.name, y: item.y, count: item.count });
                                });
                            }
                            this.setState({
                                legendData: legentList,
                                totalCount: total
                            });
                        }
                    }
                }
            },
            xAxis: {
                type: "category",
                labels: {
                    rotation: 0,
                    style: {
                        fontSize: "13px",
                        fontFamily: "Poppins, sans-serif"
                    }
                }
            },
            yAxis: {
                min: 0,
                max: completedWithFailureData.length ? null : 110,
                title: {
                    text: ""
                }
            },
            tooltip: {
                pointFormat:
                    chart_view === "percentage"
                        ? "<b>Logbook</b>: {point.logbook}" +
                          "</br>" +
                          "<b>Activity Name</b>: {point.name}" +
                          "</br>" +
                          "<b>Number of Activity Events Completed:</b> {point.total_count}" +
                          "</br>" +
                          "<b>Number of Activity Events Failure:</b> {point.count}" +
                          "</br>" +
                          "<b>Activity Event Failure Percentage:</b> {point.y:.1f}%"
                        : "<b>Logbook</b>: {point.logbook}" +
                          "</br>" +
                          "<b>Activity Name</b>: {point.name}" +
                          "</br>" +
                          "<b>Number of Activity Events Failure:</b> {point.count}" +
                          "</br>" +
                          "<b>Total Devices Inspected:</b> {point.total_devices}" +
                          "</br>" +
                          "<b>Total Devices Failed:</b> {point.total_devices_failed}" +
                          "</br>" +
                          "<b>Average Device Failure Percentage:</b> {point.y:.1f}%"
            },
            series: [
                {
                    name: "Top 10 Completed Activities with failures",
                    colorByPoint: true,
                    data: tempData
                }
            ]
            // series: tempData
        };
        await this.setState({
            dataSource,
            legendData: tempData,
            totalCount: total
        });
    };

    convertToImage = imgType => {
        let user = localStorage.getItem("userName") || "";
        let name = `Top_10_Completed_With_Failures-${user}-${moment().format("MM_DD_YYYY HH_mm_ss")}`;
        if (imgType == "jpeg") {
            htmlToImage.toJpeg(document.getElementById("chartComWiFail"), { quality: 0.95 }).then(function (dataUrl) {
                var link = document.createElement("a");
                link.download = `${name}.jpeg`;
                link.href = dataUrl;
                link.click();
            });
        } else if (imgType == "png") {
            htmlToImage.toPng(document.getElementById("chartComWiFail"), { quality: 0.95 }).then(function (dataUrl) {
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
            if (fullScreenChart === "top_10_completed_with_failures") {
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
        const { fullViewHandler, isFullScreen, toggleChartView, chart_view, completedWithFailureData } = this.props;
        return (
            <div className={`graph-bx col-xl-6 col-lg-6 col-md-12 ${this.renderClass()}`}>
                <div className="graph-hd">
                    <strong className="long-title">Top 10 Completed Activities with failures</strong>
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
                                                                  {lData ? parseFloat(lData.y).toFixed(1) : 0}% ({lData.count})
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
                        <div className="dropdown mr-2">
                            <button
                                className="btn btn-secondary dropdown-toggle"
                                type="button"
                                id="byEventByDevice"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                {chart_view === "percentage" ? "By Activity" : "By Device Count"}
                            </button>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="byEventByDevice">
                                <button className="dropdown-item" type="button" onClick={() => toggleChartView("average")}>
                                    By Device Count
                                </button>
                                <button className="dropdown-item" type="button" onClick={() => toggleChartView("percentage")}>
                                    By Activity
                                </button>
                            </div>
                        </div>
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
                        <button className="btn" onClick={() => fullViewHandler("top_10_completed_with_failures")}>
                            <img src="images/restore.svg" alt="" />
                        </button>
                    </div>
                </div>
                <div className={`graph-content ${!completedWithFailureData.length ? "no-data-sctn" : ""}`} data-descr="No Activity To Report">
                    <div className="g-box" id="chartComWiFail">
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
                                                                      <strong title={lData.name}>{lData.name}</strong>
                                                                      <p>
                                                                          {lData ? parseFloat(lData.y).toFixed(1) : 0}% ({lData.count})
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
                                            <strong>TOTAL ={totalCount}</strong>
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
