/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import actions from "../actions";

class HeaderActions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: this.props.globalSearchKey
        };
    }

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.globalSearchKey !== this.props.globalSearchKey) {
            await this.setState({
                inputValue: this.props.globalSearchKey
            });
        }
    };

    handleGlobalSearch = e => {
        e.preventDefault();
        const { inputValue } = this.state;
        if (inputValue.trim().length) {
            this.props.handleGlobalSearch(inputValue);
        }
    };

    render() {
        const { refreshMails, handleGlobalSearch, globalSearchKey } = this.props;
        const { inputValue } = this.state;
        return (
            <React.Fragment>
                <div class="right-cont">
                    <div class="btn-section-2">
                        <button class="btn btn-top" title="Reset Columns" onClick={() => refreshMails()}>
                            <img src="/images/refresh.svg" alt="" />
                        </button>
                        <div class="sr-sec search-section">
                            <input
                                type="text"
                                class="form-control"
                                placeholder="Search mail"
                                onKeyPress={event => {
                                    if (event.key === "Enter") {
                                        this.handleGlobalSearch(event);
                                    }
                                }}
                                onChange={event => {
                                    this.setState({ inputValue: event.target.value });
                                    if (!event.target.value.trim().length) {
                                        this.props.globalSearchKey && this.props.handleGlobalSearch("");
                                    }
                                }}
                                value={inputValue}
                            />
                            {inputValue && inputValue.length ? (
                                <button type="submit" class="btn btn-search" onClick={() => this.props.handleGlobalSearch("")}>
                                    <i class="material-icons clear-search-icon">close </i>
                                </button>
                            ) : (
                                <button type="submit" class="btn btn-search">
                                    <img src="/images/serach.svg" alt="" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { emailReducer } = state;
    return { emailReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(HeaderActions));
