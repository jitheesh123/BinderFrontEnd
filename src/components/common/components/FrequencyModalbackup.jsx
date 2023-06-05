import React, { Component } from "react";
import BuildModalHeader from "./BuildModalHeader";
import { RRule, RRuleSet, rrulestr } from "rrule";


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
            monthList: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            frequencyList: [
                { name: "Year", key: "YEARLY", value: 0 },
                { name: "Month", key: "MONTHLY", value: 1 },
                { name: "Week", key: "WEEKLY", value: 2 },
                { name: "Day", key: "DAILY", value: 3 },
                { name: "Hour", key: "HOURLY", value: 4 }
            ],
            dayList: [
                { name: "Mon", key: "MO" },
                { name: "Tue", key: "TU" },
                { name: "Wed", key: "WE" },
                { name: "Thu", key: "TH" },
                { name: "Fri", key: "FR" },
                { name: "Sat", key: "SA" },
                { name: "Sun", key: "SU" }
            ],
            rRuleGen: {
                freq: 0,
                interval: props.freequencyInterval || "",
                wkst: RRule.MO,
                byweekday: [],
                bymonth: [],
                dtstart: "",
                until: ""
            },
            test_frequency: ""
        };
    }

    componentDidMount = async () => {
        const { frequency, test_frequency, freequencyInterval } = this.props;
        await this.setState({
            rRuleGen: {
                freq: 0,
                interval: freequencyInterval || "",
                wkst: RRule.MO,
                byweekday: [],
                bymonth: [],
                dtstart: "",
                until: ""
            }
        });
        if (frequency) {
            let rule = RRule.fromString(frequency);
            let rRuleGenObj = rule.origOptions;
            if (!Array.isArray(rRuleGenObj.bymonth)) {
                rRuleGenObj.bymonth = rRuleGenObj.bymonth ? [rRuleGenObj.bymonth] : [];
            }
            if (!Array.isArray(rRuleGenObj.byweekday)) {
                rRuleGenObj.byweekday = rRuleGenObj.byweekday ? [rRuleGenObj.byweekday] : [];
            }
            await this.setState({
                rRuleGen: rRuleGenObj,
                test_frequency
            });
            if (freequencyInterval) {
                await this.setState({
                    rRuleGen: {
                        ...this.state.rRuleGen,
                        interval: freequencyInterval || ""
                    }
                });
            }
        }
    };

    clearFrequency = async () => {
        const { onCancel } = this.props;
        await this.setState({
            rRuleGen: {
                freq: 0,
                interval: "",
                wkst: RRule.MO,
                byweekday: [],
                bymonth: [],
                dbstart: "",
                until: ""
            }
        });
        onCancel();
    };

    setByMonthForRRuleGen = value => {
        const {
            rRuleGen,
            rRuleGen: { bymonth }
        } = this.state;
        let tempByMonth = bymonth;
        if (tempByMonth.includes(value)) {
            tempByMonth = tempByMonth.filter(item => item !== value);
        } else {
            tempByMonth.push(value);
        }
        this.setState({
            rRuleGen: {
                ...rRuleGen,
                bymonth: tempByMonth
            }
        });
    };

    checkRRuleHasDay = value => {
        const {
            rRuleGen: { byweekday }
        } = this.state;
        if (byweekday && byweekday.find(item => item && item.weekday === value)) return true;
        return false;
    };

    setByDayForRRuleGen = value => {
        const {
            rRuleGen,
            dayList,
            rRuleGen: { byweekday }
        } = this.state;
        let tempByDay = byweekday;
        if (this.checkRRuleHasDay(value)) {
            tempByDay = tempByDay.filter(item => item.weekday !== value);
        } else {
            tempByDay.push(RRule[dayList[value].key]);
        }
        this.setState({
            rRuleGen: {
                ...rRuleGen,
                byweekday: tempByDay
            }
        });
    };

    generateRRule = () => {
        const { setFrequencyData, onCancel, formParams } = this.props;
        const { rRuleGen, test_frequency } = this.state;
        let event1 = formParams.push_start ? new Date(formParams.push_start) : "";
        let event2 = formParams.push_end ? new Date(formParams.push_end) : "";
        if (event1 !== "" || event2 !== "") {
            let rRuleGen1 = { ...rRuleGen, dtstart: event1, until: event2 };
            const rule = new RRule(rRuleGen1);
            let frequency = rule.toString();

            setFrequencyData(frequency, test_frequency, formParams.is_check);
        } else {
            const rule = new RRule(rRuleGen);
            let frequency = rule.toString();
            setFrequencyData(frequency, test_frequency, formParams.is_check);
        }
        onCancel();
    };
    render() {
        const { monthList, frequencyList, dayList, test_frequency, rRuleGen } = this.state;
        const { type, isEdit } = this.props;

        return (
            <React.Fragment>
                <div className="modal frequency-modal" role="dialog" style={{ display: "block" }} id="modalId">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader title="Frequency" onCancel={this.clearFrequency} modalClass="frequency-modal" />

                            {type === "form" ? (
                                <div className="modal-body">
                                    <div className="frm-modal">
                                        <div className="form-group">
                                            <label>Select Frequency</label>
                                            <div className="bck-ara frequency">
                                                {frequencyList.map((item, i) => (
                                                    <button
                                                        key={i}
                                                        className={`btn btn-frm ${rRuleGen.freq === item.value ? "active" : ""}`}
                                                        onClick={() => this.setState({ rRuleGen: { ...rRuleGen, freq: RRule[item.key] } })}
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
                                                        onChange={e =>
                                                            this.setState({
                                                                rRuleGen: {
                                                                    ...rRuleGen,
                                                                    interval: e.target.value
                                                                }
                                                            })
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
                                                                onClick={() => this.setByMonthForRRuleGen(i + 1)}
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
                                                        className={`btn btn-frm ${this.checkRRuleHasDay(i) ? "active" : ""}`}
                                                        onClick={() => this.setByDayForRRuleGen(i)}
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
                                                onChange={e => this.setState({ test_frequency: e.target.value })}
                                                disabled={isEdit}
                                            />
                                        </div>

                                        <div className="btn-sec">
                                            <button className="btn btn-cncl-back mr-2" onClick={() => this.clearFrequency()}>
                                                <i className="material-icons tic"> close</i>Cancel
                                            </button>
                                            <button className="btn btn-create" onClick={() => this.generateRRule()} disabled={isEdit}>
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
                                                        className={`btn btn-frm cursor-not-allowed ${this.checkRRuleHasDay(i) ? "active" : ""}`}
                                                        disabled={!this.checkRRuleHasDay(i)}
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
                                            <button className="btn btn-cncl-back mr-2" onClick={() => this.clearFrequency()}>
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
