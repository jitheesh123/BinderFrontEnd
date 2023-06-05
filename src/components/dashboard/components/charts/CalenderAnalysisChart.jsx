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
            showLegendsDetails: false
        };
    }
    componentDidMount = async () => {
        await this.renderChartData();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (!_.isEqual(prevProps.calenderAnalysisData, this.props.calenderAnalysisData)) {
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
        switch (type) {
            case "Threshold Start":
                return "#BFFFBF";
            case "Threshold Middle":
                return "#00FFFF";
            case "Due Next Day":
                return "#FFFF00";
            case "Due Today":
                return "#FFBF00";
            case "Threshold 3 Day End":
                return "#FF8000";
            case "Threshold 1 Day End":
                return "#FF0000";
        }
    };

    renderChartData = async () => {
        const { calenderAnalysisData, toggleSmartReportModal } = this.props;
        let tempData = graphDummyData.calenderAnalysisData.map(item => {
            return { name: item.report, y: item.count, color: this.getColor(item.report) };
        });
        let total = 0;
        if (calenderAnalysisData.length) {
            tempData = calenderAnalysisData.map(item => {
                total = total + item.count;
                return { name: item.report, y: item.count, color: this.getColor(item.report) };
            });
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
            plotOptions: {
                column: {
                    dataLabels: {
                        enabled: true
                    },
                    showInLegend: this.props.isFullScreen ? true : false
                },
                series: {
                    pointPadding: 0,
                    events: {
                        click: event => {
                            toggleSmartReportModal("calendar_analysis", event.point.name.toLowerCase().replace(/ /g, "_"));
                        },
                        legendItemClick: event => {
                            if (event.target.visible) {
                                total = 0;
                                legentList = [];
                            } else {
                                event.target.options.data.map(item => {
                                    total = total + item.y;
                                    legentList.push({ name: item.name, y: item.y });
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
                allowDecimals: false,
                min: 0,
                max: calenderAnalysisData.length ? null : 125,
                title: {
                    text: ""
                }
            },
            tooltip: {
                pointFormat: "<b>{point.y}</b>"
            },
            series: [
                {
                    name: "Activity Calender Analysis",
                    colorByPoint: true,
                    data: tempData
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
        let name = `Calender_Analysis-${user}-${moment().format("MM_DD_YYYY HH_mm_ss")}`;
        if (imgType == "jpeg") {
            htmlToImage.toJpeg(document.getElementById("chartCalAny"), { quality: 0.95 }).then(function (dataUrl) {
                var link = document.createElement("a");
                link.download = `${name}.jpeg`;
                link.href = dataUrl;
                link.click();
            });
        } else if (imgType == "png") {
            htmlToImage.toPng(document.getElementById("chartCalAny"), { quality: 0.95 }).then(function (dataUrl) {
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
            if (fullScreenChart === "calendar_analysis") {
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
        const { fullViewHandler, isFullScreen, calenderAnalysisData } = this.props;
        return (
            <div className={`graph-bx col-xl-6 col-lg-6 col-md-6 ${this.renderClass()}`}>
                <div className="graph-hd">
                    <strong>Activity Calendar Notifications</strong>
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
                        <button className="btn" onClick={() => fullViewHandler("calendar_analysis")}>
                            <img src="images/restore.svg" alt="" />
                        </button>
                    </div>
                </div>
                <div className={`graph-content ${!calenderAnalysisData.length ? "no-data-sctn" : ""}`} data-descr="No Activity To Report">
                    <div className="g-box" id="chartCalAny">
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
                                                                      <p>{lData ? lData.y : 0}</p>
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
