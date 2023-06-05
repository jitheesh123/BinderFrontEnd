import React, { Component } from "react";
import Slider from "react-slick";
import { connect } from "react-redux";

import history from "../../../config/history";
import commonActions from "../actions";
import ToastMsg from "../ToastMessage";

const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3
};
class TopSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allLogbooks: [],
            activeLogbook: this.props.activeLogbook || null
        };
    }

    componentDidMount = async () => {
        this.refreshList();
    };

    refreshList = async () => {
        let master_filters = JSON.parse(localStorage.getItem("master_filters"));
        await this.props.getAllLogbooks(master_filters);
        const {
            commonReducer: {
                allLogbooksResponse: { logbooks = [] }
            }
        } = this.props;

        await this.setState({
            allLogbooks: logbooks,
            activeLogbook: this.props.activeLogbook || null
        });
    };

    handleSliderClick = async item => {
        if (item.is_active && item.is_active === "yes") {
            history.push("/trailingCalendar", { logbook: item });
            await this.setState({
                activeLogbook: item.id
            });
        } else {
            ToastMsg("No Access at This Time", "info");
        }
    };

    render() {
        const { allLogbooks, activeLogbook } = this.state;
        return (
            <div className="top-slider">
                <div className="collapse show" id="collapseExample">
                    {allLogbooks && allLogbooks.length ? (
                        <>
                            <div className="customer-logos slider custom-slider">
                                {/* <Slider {...settings}> */}
                                {allLogbooks.map((item, i) => (
                                    <div
                                        key={i}
                                        className={`slide custom-slide ${activeLogbook === item.id ? "active" : ""}`}
                                        onClick={() => this.handleSliderClick(item)}
                                    >
                                        <span>{item.display_name || item.name}</span>
                                    </div>
                                ))}
                                {/* </Slider> */}
                            </div>
                            <div className="arrows">
                                <div className="prev-arw cursor-pointer">
                                    <span className="material-icons">keyboard_arrow_left</span>
                                </div>
                                <div className="next-arw cursor-pointer">
                                    <span className="material-icons">keyboard_arrow_right</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-center pt-4">No logbooks yet</p>
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { commonReducer } = state;
    return { commonReducer };
};

export default connect(mapStateToProps, { ...commonActions })(TopSlider);
