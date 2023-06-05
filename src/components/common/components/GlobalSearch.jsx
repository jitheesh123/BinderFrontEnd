import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class GlobalSearch extends Component {
    state = {
        inputValue: this.props.globalSearchKey
    };

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
        return (
            <div className="sr-sec search-section">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                    onChange={event => {
                        this.setState({ inputValue: event.target.value.trimStart() });
                        if (!event.target.value.trim().length) {
                            this.props.globalSearchKey && this.props.handleGlobalSearch("");
                        }
                    }}
                    onKeyPress={event => {
                        if (event.key === "Enter") {
                            this.handleGlobalSearch(event);
                        }
                    }}
                    value={this.state.inputValue}
                />
                {this.state.inputValue.trim().length ? (
                    <button
                        type="button"
                        className="btn btn-search"
                        onClick={event => {
                            this.setState({ inputValue: "" });
                            this.props.globalSearchKey && this.props.handleGlobalSearch("");
                        }}
                    >
                        <i class="material-icons clear-search-icon">close </i>
                    </button>
                ) : (
                    <button type="button" className="btn btn-search" onClick={event => this.handleGlobalSearch(event)}>
                        <img src="/images/serach.svg" alt="" />
                    </button>
                )}
            </div>
        );
    }
}

export default withRouter(GlobalSearch);
