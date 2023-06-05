import React, { Component } from "react";
import BuildModalHeader from "./BuildModalHeader";
// import { RRule, RRuleSet, rrulestr } from "rrule";

class FrequencyModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sliderSettings: {
                dots: false,
                infinite: false,
                speed: 500,
                slidesToShow: 5,
                slidesToScroll: 5
            },
        };
    }

    componentDidMount = async () => {
        const { frequency, test_frequency, freequencyInterval } = this.props;
        this.props.getData(frequency, test_frequency, freequencyInterval);
    };

 
    render() {
        const { monthList, frequencyList, dayList, test_frequency, type, isEdit, rRuleGen, onCancel} = this.props;
        return (
            <React.Fragment>
                <div className="modal frequency-modal" role="dialog" style={{ display: "block" }} id="modalId">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader title="Frequency" onCancel={this.props.clearFrequency} modalClass="frequency-modal" />

                            {type === "form" ? (
                                <div className="modal-body">
                                    <div className="frm-modal">
                                        <div className="form-group">
                                            <label>Select Frequency</label>
                                            <div className="bck-ara frequency">
                                                {frequencyList?.map((item, i) => (
                                                    <button
                                                        key={i}
                                                        className={`btn btn-frm ${rRuleGen.freq === item.value ? "active" : ""}`}
                                                        onClick={() => this.props.setFrequencyList(item.key)}
                                                        disabled={isEdit}
                                                    >
                                                        {item.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="item-row">
                                            <div className="item">
                                                <div className="form-group">
                                                    <label>Interval</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        disabled={isEdit}
                                                        className="form-control"
                                                        value={rRuleGen.interval}
                                                        name="interval"
                                                        onChange={e =>
                                                            this.props.handleChange(e)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>By Month</label>
                                            <div className="bck-ara">
                                                <div className="slider month">
                                                    {monthList.map((item, i) => (
                                                        <div className="slide" key={i}>
                                                            <button
                                                                className={`btn btn-frm ${
                                                                    rRuleGen && rRuleGen.bymonth.includes(i + 1) ? "active" : ""
                                                                }`}
                                                                onClick={() => this.props.setByMonthForRRuleGen(i + 1)}
                                                                disabled={isEdit}
                                                            >
                                                                {item}
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>By Day</label>
                                            <div className="bck-ara day">
                                                {dayList.map((item, i) => (
                                                    <button
                                                        key={i}
                                                        className={`btn btn-frm ${this.props.checkRRuleHasDay(i) ? "active" : ""}`}
                                                        onClick={() => this.props.setByDayForRRuleGen(i)}
                                                        disabled={isEdit}
                                                    >
                                                        {item.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Test Frequency</label>
                                            <input
                                                type="text"
                                                value={test_frequency}
                                                className="form-control"
                                                onChange={
                                                    e => this.props.handleChangeFrequency(e)
                                                }
                                                disabled={isEdit}
                                            />
                                        </div>

                                        <div className="btn-sec">
                                            <button className="btn btn-cncl-back mr-2" onClick={() => this.props.clearFrequency()}>
                                                <i className="material-icons tic"> close</i>Cancel
                                            </button>
                                            <button
                                                className="btn btn-create"
                                                onClick={() => {
                                                    onCancel();
                                                    this.props.setIsCheck();
                                                }}
                                                disabled={isEdit}
                                            >
                                                <i className="material-icons tic"> check</i> Apply
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="modal-body">
                                    <div className="frm-modal">
                                        <div className="form-group">
                                            <label>Frequency</label>
                                            <div className="bck-ara frequency">
                                                {frequencyList.map((item, i) => (
                                                    <button
                                                        className={`btn btn-frm cursor-not-allowed ${rRuleGen.freq === item.value ? "active" : ""}`}
                                                        disabled={!(rRuleGen.freq === item.value)}
                                                    >
                                                        {item.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="item-row">
                                            <div className="item">
                                                <div className="form-group">
                                                    <label>Interval</label>
                                                    <input
                                                        type="number"
                                                        disabled="true"
                                                        min="1"
                                                        className="form-control cursor-not-allowed"
                                                        value={rRuleGen.interval}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>By Month</label>
                                            <div className="bck-ara">
                                                <div className="slider month">
                                                    {monthList.map((item, i) => (
                                                        <div className="slide" key={i}>
                                                            <button
                                                                className={`btn btn-frm cursor-not-allowed ${
                                                                    rRuleGen && rRuleGen.bymonth.includes(i + 1) ? "active" : ""
                                                                }`}
                                                                disabled={!(rRuleGen && rRuleGen.bymonth.includes(i + 1))}
                                                            >
                                                                {item}
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>By Day</label>
                                            <div className="bck-ara day">
                                                {dayList.map((item, i) => (
                                                    <button
                                                        className={`btn btn-frm cursor-not-allowed ${this.props.checkRRuleHasDay(i) ? "active" : ""}`}
                                                        disabled={!this.props.checkRRuleHasDay(i)}
                                                    >
                                                        {item.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Test Frequency</label>
                                            <input type="text" disabled="true" value={test_frequency} className="form-control cursor-not-allowed" />
                                        </div>

                                        <div className="btn-sec">
                                            <button className="btn btn-cncl-back mr-2" onClick={() => this.props.clearFrequency()}>
                                                <i className="material-icons tic"> close</i>Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default FrequencyModel;
