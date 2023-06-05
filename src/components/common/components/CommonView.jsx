import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import Portal from "./Portal";
import FrequencyModel from "./FrequencyModalbackup";
import ImageViewModal from "./ImageViewModal";
import { formatNumber, formatmoney } from "../../../config/utils";
import ViewHistory from "./ViewHistory";

class CommonView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showFrequencyModal: false,
            showImageModal: false,
        };
    }

    componentDidMount = () => {
        ReactTooltip.rebuild();
    };

    componentDidUpdate = () => {
        ReactTooltip.rebuild();
    };

    renderFrequencyModal = () => {
        const { showFrequencyModal } = this.state;
        const { item } = this.props;
        if (!showFrequencyModal) return null;

        return (
            <Portal
                body={
                    <FrequencyModel
                        onCancel={this.toggleShowFrequencyModal}
                        setFrequencyData={this.setFrequencyData}
                        frequency={item.frequency}
                        test_frequency={item.test_frequency}
                        type={"view"}
                    />
                }
                onCancel={this.toggleShowFrequencyModal}
            />
        );
    };

    toggleShowFrequencyModal = () => {
        const { showFrequencyModal } = this.state;
        this.setState({
            showFrequencyModal: !showFrequencyModal
        });
    };

    renderImageModall = data => {
        const { showImageModal } = this.state;
        if (!showImageModal) return null;
        return <Portal body={<ImageViewModal onCancel={this.toggleShowImageModal} imgData={data} />} onCancel={this.toggleShowImageModal} />;
    };

    toggleShowImageModal = () => {
        const { showImageModal } = this.state;
        this.setState({
            showImageModal: !showImageModal
        });
    };

    renderData = (type, data, keyItem) => {
        let returnData = data;
        switch (type) {
            case "string":
                returnData = <h3>{data || "-"}</h3>;
                break;
            case "date":
                returnData = <h3>{data || "-"}</h3>;
                break;
            case "object":
                returnData = <h3>{(data && data.name) || "-"}</h3>;
                break;
            case "boolean":
                returnData = <h3>{data === "true" || data === true || data === "yes" ? "Yes" : "No"}</h3>;
                break;
            case "number":
                returnData = <h3>{data ? formatNumber(parseInt(data)) : "-"}</h3>;
                break;
            case "float":
                returnData = <h3>{data ? formatNumber(parseFloat(data)) : "-"}</h3>;
                break;
            case "money":
                returnData = <h3>{data ? formatmoney(parseInt(data)) : "-"}</h3>;
                break;
            case "arrayString":
                returnData = <h3>{data && data.length ? data.join() : "-"}</h3>;
                break;
            case "rrule":
                returnData = data ? (
                    <button className="btn btn-frqy" onClick={() => this.toggleShowFrequencyModal()}>
                        View Frequency
                    </button>
                ) : (
                    "-"
                );
                break;
            case "window":
                // if (data.includes("~")) {
                //     // returnData = data.replace(/~/g, "\n");
                //     let dataToArray = data.split("~").map(item => (
                //         <li>
                //             <h3>{item.trim()}</h3>
                //         </li>
                //     ));
                //     returnData = (
                //         <ul type="i" className="listForWindow">
                //             {dataToArray}
                //         </ul>
                //     );
                // } else {
                //     // returnData = data || "-";
                //     let dataToArray = 
                //         <li>
                //             <h3>{data.trim()}</h3>
                //         </li>  
                //     returnData = (
                //         <ul type="i" className="listForWindow">
                //             {dataToArray}
                //         </ul>
                //     );
                // }
                if (data?.includes("~")) {
                    // returnData = data.replace(/~/g, "\n");
                    let dataToArray = data?.split("~").map(item => `${item.trim()}`).join("\n")
                        ;
                    // returnData = dataToArray || "-";
                    returnData = (
                        <ul type="i" className="customCommonStandard">
                            {dataToArray}
                        </ul>
                    );
                } else {
                    returnData = <ul type="i" className="customCommonStandard">
                        {data}
                    </ul> || "-";
                }
                break;
            default:
                returnData = <h3>{data || "-"}</h3>;
                break;
        }
        if (keyItem === "linked_activity") {
            returnData = <h3>{(data && data.activity_description) || "-"}</h3>;
        }
        return returnData;
    };

    toggleViewPage = async () => {
        await this.setState({ isLogView: !this.state.isLogView });
    };

    render() {
        const {
            isLogView,
            item,
            keys,
            config,
            history,
            deleteItem,
            getLogData,
            logData,
            handleDeleteLog,
            toggleViewPage,
            handleRestoreLog,
            handlePageClickHistory,
            handleGlobalSearchHistory,
            globalSearchKeyHistory,
            historyPaginationParams,
            updateLogSortFilters,
            historyParams,
            updateScheduling,
            showTopButtons = true,
            hasLogView = true,
            hasEdit = true,
            hasDelete = true,
            beforePrevPath = "",
            updateActivityScheduling,
            updateDeemingAgencyAssignment,
            updateFrequencyAssignment,
            updateUserAssignment,
            updateBuildingLogbookAssignment,
            updateBuildingAssignment,
            updateConsultancyAssignment,
            updateClientAssignment,
            hasLogbookAssign = true,
            hasActivityAssign = true,
            hasUserAssign = true,
            hasLogDelete = true,
            hasLogRestore = true,
            hasConsultancyAssign = true,
            hasClientAssign = true,
            hasBuildingAssign = true,
            hasFrequencyAssign = true,
            hasDeemingAgencyAssign = true,
            hasProcedureAssign = false,
            updateProcedureAssignment,
            updateFormAssignment,
        } = this.props;
        const {
            match: {
                params: { section }
            }
        } = this.props;
        let prevPath = (this.props.location && this.props.location.state && this.props.location.state.prevPath) || "";
        return (
            <div className="frm-ara cmon-ara">
                <ReactTooltip id="common_view_page" effect="solid" />
                <div className="head">
                    <h3>Basic Info</h3>
                    {showTopButtons && (
                        <div className="btn-sec">
                            {section === "buildinginfo" || section === "consultancyinfo" || section === "clientinfo" ? (
                                hasLogbookAssign ? (
                                    <button className="btn" onClick={() => updateScheduling(this.props.match.params.id)}>
                                        <img src={`/images/${"binder-icon.svg"}`} alt="" />
                                        Assign Logbooks
                                    </button>
                                ) : null
                            ) : null}
                            {section === "buildinginfo" || section === "consultancyinfo" || section === "clientinfo" ? (
                                hasActivityAssign ? (
                                    <button className="btn" onClick={() => updateActivityScheduling(this.props.match.params.id)}>
                                        <img src={`/images/${"binder-icon.svg"}`} alt="" />
                                        Assign Activities
                                    </button>
                                ) : null
                            ) : null}
                            {section === "frequencyinfo" ? (
                                hasDeemingAgencyAssign ? (
                                    <button className="btn" onClick={() => updateDeemingAgencyAssignment(this.props.match.params.id)}>
                                        <img src={`/images/${"add-icon.svg"}`} alt="" />
                                        Assign Deeming Agencies
                                    </button>
                                ) : null
                            ) : null}
                            {section === "deeming_agencyinfo" ? (
                                hasFrequencyAssign ? (
                                    <button className="btn" onClick={() => updateFrequencyAssignment(this.props.match.params.id)}>
                                        <img src={`/images/${"binder-icon.svg"}`} alt="" />
                                        Assign Frequencies
                                    </button>
                                ) : null
                            ) : null}
                            {section === "sectorinfo" || section === "campusinfo" || section === "buildinginfo" ? (
                                hasUserAssign ? (
                                    <button className="btn" onClick={() => updateUserAssignment(this.props.match.params.id)}>
                                        <img src={`/images/${"add-icon.svg"}`} alt="" />
                                        Assign Users
                                    </button>
                                ) : null
                            ) : null}
                            {section === "userinfo" ? (
                                <>
                                    {hasLogbookAssign ? (
                                        <button className="btn" onClick={() => updateBuildingLogbookAssignment(this.props.match.params.id)}>
                                            <img src={`/images/${"assign.svg"}`} alt="" />
                                            Assign Building Logbooks
                                        </button>
                                    ) : null}
                                    {hasBuildingAssign ? (
                                        <button className="btn" onClick={() => updateBuildingAssignment(this.props.match.params.id)}>
                                            <img src={`/images/${"add-icon.svg"}`} alt="" />
                                            Assign Buildings
                                        </button>
                                    ) : null}
                                </>
                            ) : null}
                            {section === "logbookinfo" || section === "activityinfo" ? (
                                <>
                                    {hasConsultancyAssign ? (
                                        <button className="btn" onClick={() => updateConsultancyAssignment(this.props.match.params.id)}>
                                            <img src={`/images/${"assign-cunsaltancy-01.svg"}`} alt="" />
                                            Assign Consultancies
                                        </button>
                                    ) : null}
                                    {hasClientAssign ? (
                                        <button className="btn" onClick={() => updateClientAssignment(this.props.match.params.id)}>
                                            <img src={`/images/${"assign-client-01.svg"}`} alt="" />
                                            Assign Clients
                                        </button>
                                    ) : null}
                                    {hasBuildingAssign ? (
                                        <button className="btn" onClick={() => updateBuildingAssignment(this.props.match.params.id)}>
                                            <img src={`/images/${"add-icon.svg"}`} alt="" />
                                            Assign Buildings
                                        </button>
                                    ) : null}
                                    {hasProcedureAssign && section === "activityinfo" ? (
                                        <>
                                            <button className="btn" onClick={() => updateProcedureAssignment(this.props.match.params.id)}>
                                                <img src={`/images/${"assign.svg"}`} alt="" />
                                                Assign Procedures
                                            </button>
                                            <button className="btn" onClick={() => updateFormAssignment(this.props.match.params.id)}>
                                                <img src={`/images/${"assign-activity.svg"}`} alt="" />
                                                Assign Forms
                                            </button>
                                        </>
                                    ) : null}
                                </>
                            ) : null}

                            {section === "assetinfo" ? (
                                hasLogbookAssign ? (
                                    <button className="btn" onClick={() => updateScheduling(this.props.match.params.id)}>
                                        <img src={`/images/${"binder-icon.svg"}`} alt="" />
                                        Schedule Asset Logbooks
                                    </button>
                                ) : null
                            ) : null}

                            {section === "assetinfo" ? (
                                hasActivityAssign ? (
                                    <button className="btn" onClick={() => updateActivityScheduling(this.props.match.params.id)}>
                                        <img src={`/images/${"binder-icon.svg"}`} alt="" />
                                        Schedule Asset Activities
                                    </button>
                                ) : null
                            ) : null}

                            {hasLogView ? (
                                <button className="btn" onClick={() => toggleViewPage()}>
                                    <img src="/images/calendar.svg" alt="" /> {isLogView ? "View Details" : "View History"}
                                </button>
                            ) : null}
                            {hasEdit ? (
                                <button
                                    className="btn"
                                    onClick={() => {
                                        history.push(`/${this.props.location.pathname.split("/")[1]}/edit/${this.props.match.params.id}`, {
                                            fromInfo: true,
                                            prevPath: this.props.location.pathname,
                                            beforePrevPath: beforePrevPath,
                                            prePrevPath: prevPath,
                                            buildingId: (prevPath.includes("building") && item.building && item.building.id) || null
                                        });
                                    }}
                                >
                                    <img src="/images/edit-gry.svg" alt="" />
                                    Edit
                                </button>
                            ) : null}
                            {hasDelete ? (
                                <button className="btn" onClick={() => deleteItem(this.props.match.params.id)}>
                                    <img src="/images/delete-gry.svg" alt="" />
                                    Delete
                                </button>
                            ) : null}
                        </div>
                    )}
                </div>
                {isLogView ? (
                    <ViewHistory
                        getLogData={getLogData}
                        logData={logData}
                        handleDeleteLog={handleDeleteLog}
                        handleRestoreLog={handleRestoreLog}
                        handlePageClickHistory={handlePageClickHistory}
                        handleGlobalSearchHistory={handleGlobalSearchHistory}
                        globalSearchKeyHistory={globalSearchKeyHistory}
                        historyPaginationParams={historyPaginationParams}
                        updateLogSortFilters={updateLogSortFilters}
                        historyParams={historyParams}
                        hasLogDelete={hasLogDelete}
                        hasLogRestore={hasLogRestore}
                    />
                ) : (
                    <div className={keys.includes("image") ? "row" : ""}>
                        <div className={`frm sav ${keys.includes("image") ? "col-md-9 pr-0" : ""}`}>
                            {keys?.map((keyItem, index) =>
                                config[keyItem].type !== "image" ? (
                                    <div key={index} className="itm">
                                        <div className="cunt">
                                            <div className="numb">{index + 1}</div>
                                        </div>
                                        <div className="itm-cnt">
                                            <div className="form-group">
                                                <label className="form-control-placeholder" htmlFor="f-name">
                                                    {config[keyItem].label}
                                                </label>
                                                {this.renderData(config[keyItem].type, item[keyItem], keyItem) &&
                                                    this.renderData(config[keyItem].type, item[keyItem], keyItem)}

                                            </div>
                                        </div>
                                    </div>
                                ) : null
                            )}
                        </div>
                        {keys.includes("image") ? (
                            <div className="frm col-md-3 pl-0">
                                {item.image && item.image.url ? (
                                    <div className="view-page-image-container">
                                        <div>
                                            <TransformWrapper defaultScale={1}>
                                                {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                                                    <React.Fragment>
                                                        <div className="md-grp-btn">
                                                            <button className="btn btn-top" onClick={() => zoomIn()}>
                                                                <img src="/images/zoom-in.svg" alt="" />
                                                            </button>
                                                            <button className="btn btn-top" onClick={() => zoomOut()}>
                                                                <img src="/images/zoom-out.svg" alt="" />
                                                            </button>
                                                        </div>
                                                        <TransformComponent>
                                                            <img
                                                                data-tip={item.image.description || ""}
                                                                data-for="common_view_page"
                                                                src={item.image.url}
                                                                data-place="top"
                                                                alt=""
                                                            />
                                                        </TransformComponent>
                                                    </React.Fragment>
                                                )}
                                            </TransformWrapper>
                                            <label className="image-name">{item.image.name || "-"}</label>
                                            <h3>Caption</h3>
                                            <label>{item.image.description || ""}</label>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="view-page-image-container no-image" data-tip={"No Image"} data-for="common_view_page">
                                        <img src="/images/no-img.png" data-place="top" alt="" />
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </div>
                )}
                {this.renderFrequencyModal()}
            </div>
        );
    }
}

export default withRouter(CommonView);
