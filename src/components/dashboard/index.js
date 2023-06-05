import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Highcharts from "highcharts";
import LoadingOverlay from "react-loading-overlay";

import actions from "./actions";
import EntityCount from "./components/EntityCount";
import EventBreakdownChart from "./components/charts/EventBreakdownCharts";
import CompletedEventBreakdownChart from "./components/charts/CompletedEventBreakdownChart";
import IncompletedEventBreakdownChart from "./components/charts/IncompleteEventsBreakdownChart";
import CalenderAnalysisChart from "./components/charts/CalenderAnalysisChart";
import CompletedWithFailuresChart from "./components/charts/CompletedWithFailures";
import { checkPermission } from "../../config/utils";
import Loader from "../common/components/Loader";
import Portal from "../common/components/Portal";
import TopSlider from "../common/components/TopSlider";
import SmartReportModal from "./components/SmartReportModal";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            counts: [],
            event_breakdown: [],
            completed_events_breakdown: [],
            incomplete_events_breakdown: [],
            calendar_analysis: [],
            top_10_completed_with_failures: [],
            view: "trailing",
            isLoading: true,
            masterFilterList: [
                { key: "consultancies", label: "Consultancies" },
                { key: "clients", label: "Clients" },
                { key: "logbooks", label: "Logbooks" },
                { key: "sectors", label: "Sectors" },
                { key: "campus", label: "Campuses" },
                { key: "buildings", label: "Buildings" },
                { key: "building_types", label: "Building types" }
            ],
            selectedFiterDropdown: null,
            filterDriodownList: [],
            isLoadingDropdown: true,
            showSmartReportModal: false,
            chart: "",
            item: "",
            fullScreenChart: "",
            isFullScreen: false,
            chart_view: "average"
        };
    }

    componentDidMount = async () => {
        // const { isLoading } = this.state;
        await this.refreshDashboardData();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.masterFilters !== this.props.masterFilters) {
            await this.refreshDashboardData();
        }
    };

    refreshDashboardData = async () => {
        this.props.setIsLoading(true);
        window.Highcharts = Highcharts;
        const { chart_view } = this.state;
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        await this.props.getDashboardData({ ...master_filters, chart_view });
        const {
            dashboardReducer: {
                getDashboardDataResponse: {
                    counts = [],
                    event_breakdown = [],
                    completed_events_breakdown = [],
                    incomplete_events_breakdown = [],
                    calendar_analysis = [],
                    top_10_completed_with_failures = []
                }
            }
        } = this.props;
        await this.setState({
            counts,
            event_breakdown,
            completed_events_breakdown,
            incomplete_events_breakdown,
            calendar_analysis,
            top_10_completed_with_failures
        });
        this.props.setIsLoading(false);
    };

    toggleAnnualTrailing = async choice => {
        await this.setState({ view: choice, selectedFiterDropdown: null });
        await this.refreshDashboardData();
    };

    toggleChartView = async chart_view => {
        await this.setState({ chart_view });
        await this.refreshDashboardData();
    };

    smartReportHandler = async (chartType, selectedItem) => {
        await this.setState({
            chart: chartType,
            item: selectedItem
        });
        this.toggleSmartReportModal();
    };

    toggleSmartReportModal = item => {
        const { showSmartReportModal } = this.state;
        this.setState({
            showSmartReportModal: !showSmartReportModal
        });
    };

    renderSmartReportModal = () => {
        const { showSmartReportModal, chart, item, view } = this.state;
        if (!showSmartReportModal) return null;
        return (
            <Portal
                body={
                    <SmartReportModal
                        onCancel={this.toggleSmartReportModal}
                        chart={chart}
                        item={item}
                        view={view}
                        refreshDashboardData={this.refreshDashboardData}
                    />
                }
                onCancel={this.toggleSmartReportModal}
            />
        );
    };

    fullViewHandler = chartName => {
        this.setState({
            fullScreenChart: chartName,
            isFullScreen: !this.state.isFullScreen
        });
    };

    render() {
        const {
            counts,
            event_breakdown,
            completed_events_breakdown,
            incomplete_events_breakdown,
            calendar_analysis,
            top_10_completed_with_failures,
            isFullScreen,
            fullScreenChart,
            chart_view
        } = this.state;
        const { isLoading, showEntityCount } = this.props;
        if (!checkPermission("menu", "dashboard", null))
            return (
                <section className="cont-ara">
                    <div className="fst content-main"></div>
                </section>
            );

        return (
            <section className="cont-ara">
                <LoadingOverlay active={isLoading} spinner={<Loader />}>
                    <div className="fst content-main">
                        <TopSlider />
                        <div className="gry-area">
                            <div className="content-area">
                                {showEntityCount ? (
                                    <div className="info-outer">
                                        {counts && counts.length
                                            ? counts.map(item => {
                                                  return <EntityCount countData={item} />;
                                              }
                                              )
                                            : null}
                                    </div>
                                ) : null}
                                <div className="graph-otr">
                                    <EventBreakdownChart
                                        eventBreakdownData={event_breakdown}
                                        toggleSmartReportModal={this.smartReportHandler}
                                        fullViewHandler={this.fullViewHandler}
                                        isFullScreen={isFullScreen}
                                        fullScreenChart={fullScreenChart}
                                    />
                                    <CompletedEventBreakdownChart
                                        completedEventBreakdownData={completed_events_breakdown}
                                        toggleSmartReportModal={this.smartReportHandler}
                                        isFullScreen={isFullScreen}
                                        fullScreenChart={fullScreenChart}
                                        fullViewHandler={this.fullViewHandler}
                                    />
                                    <IncompletedEventBreakdownChart
                                        IncompletedEventBreakdownData={incomplete_events_breakdown}
                                        toggleSmartReportModal={this.smartReportHandler}
                                        isFullScreen={isFullScreen}
                                        fullScreenChart={fullScreenChart}
                                        fullViewHandler={this.fullViewHandler}
                                    />
                                    <CalenderAnalysisChart
                                        calenderAnalysisData={calendar_analysis}
                                        toggleSmartReportModal={this.smartReportHandler}
                                        isFullScreen={isFullScreen}
                                        fullScreenChart={fullScreenChart}
                                        fullViewHandler={this.fullViewHandler}
                                    />
                                    <CompletedWithFailuresChart
                                        completedWithFailureData={top_10_completed_with_failures}
                                        toggleSmartReportModal={this.smartReportHandler}
                                        isFullScreen={isFullScreen}
                                        fullScreenChart={fullScreenChart}
                                        fullViewHandler={this.fullViewHandler}
                                        toggleChartView={this.toggleChartView}
                                        chart_view={chart_view}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.renderSmartReportModal()}
                </LoadingOverlay>
            </section>
        );
    }
}

const mapStateToProps = state => {
    const { dashboardReducer } = state;
    return { dashboardReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(index));
