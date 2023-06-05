import React, { Component } from "react";
import BuildModalHeader from "./BuildModalHeader";

class PasswoedConfirmationModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            passwordErrorMessage: "",
            errorMsg: "",
            isLoading: false
        };
    }

    validate = async () => {
        if (!this.state.password || !this.state.password.trim().length) {
            this.setState({ passwordErrorMessage: "Please enter password" });
            return false;
        }
        this.login();
    };

    login = () => {
        this.setState({
            isLoading: true
        });
        const { password } = this.state;
        this.props.onConfirm(password);
        this.setState({
            isLoading: false
        });
    };

    render() {
        const { onCancel } = this.props;
        const { isLoading } = this.state;
        return (
            <React.Fragment>
                <div id="confirmModal" className="modal confirmModal password-confirm" style={{ display: "block" }} role="dialog">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BuildModalHeader title=" " onCancel={onCancel} modalClass="password-confirm" />
                            <div className="modal-body confirm-otr text-center">
                                <div className="login">
                                    <main>
                                        <div className="log-sec">
                                            <div className="hed">
                                                <h3>Confirm Password</h3>
                                                <small>Please confirm your password</small>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group col-md-12">
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        onChange={password =>
                                                            this.setState({ password: password.target.value, passwordErrorMessage: "", errorMsg: "" })
                                                        }
                                                        placeholder="PASSWORD"
                                                        onKeyPress={event => {
                                                            if (event.key === "Enter") {
                                                                this.validate();
                                                            }
                                                        }}
                                                    />
                                                    <span style={{ color: "red" }}>{this.state.passwordErrorMessage}</span>
                                                </div>

                                                <div className="form-group col-md-12">
                                                    {isLoading ? (
                                                        <button className="btn btn-log">
                                                            <div className="spinner-border text-primary" role="status"></div>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                this.validate();
                                                            }}
                                                            className="btn btn-log"
                                                        >
                                                            Confirm
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </main>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default PasswoedConfirmationModal;
