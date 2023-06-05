import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import BuildModalHeader from "./BuildModalHeader";
import commonActions from "../actions";
import ToastMsg from "../../common/ToastMessage";

class PasswordResetConfirmationModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            current_password: "",
            password_confirmation: "",
            passwordErrorMessage: "",
            errorMsg: "",
            isLoading: false
        };
    }

    validate = async () => {
        let passwordExp = /^(?=.{6,}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?\W).*$/;
        if (!this.state.current_password || !this.state.current_password.trim().length) {
            this.setState({ passwordErrorMessage: "Please enter your current password" });
            return false;
        }
        if (!this.state.password || !this.state.password.trim().length) {
            this.setState({ passwordErrorMessage: "Please enter Your new password" });
            return false;
        }
        if ( !passwordExp.test(this.state.password)) {
            this.setState({ passwordErrorMessage: "Password must contain minimum 6 characters ,1 special character ,1 number & combination of upper and lower case letters" });
            return false;
        }
        if (!this.state.password_confirmation || !this.state.password_confirmation.trim().length) {
            this.setState({ passwordErrorMessage: "Please enter your confirm password" });
            return false;
        }
        if (this.state.password_confirmation !== this.state.password ) {
            this.setState({ passwordErrorMessage: "The password confirmation doesn't match" });
            return false;
        }
        this.resetPassword();
    };

    resetPassword = async () => {
        this.setState({
            isLoading: true
        });
        const { password, password_confirmation, current_password } = this.state;
        await this.props.resetPassword({ current_password, password, password_confirmation });
        const {
            commonReducer: {
                resetPasswordResponse: { success = false, message }
            }
        } = this.props;
        if (success) {
            ToastMsg(message,"success")
            this.props.onCancel()
        } 
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
                                                <h3>Reset Password</h3>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group col-md-12">
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        onChange={current_password =>
                                                            this.setState({
                                                                current_password: current_password.target.value,
                                                                passwordErrorMessage: "",
                                                                errorMsg: ""
                                                            })
                                                        }
                                                        placeholder="CURRENT PASSWORD"
                                                    />
                                                </div>
                                                <div className="form-group col-md-12">
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        onChange={password =>
                                                            this.setState({ password: password.target.value, passwordErrorMessage: "", errorMsg: "" })
                                                        }
                                                        placeholder="NEW PASSWORD"
                                                    />
                                                </div>
                                                <div className="form-group col-md-12">
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        onChange={password_confirmation =>
                                                            this.setState({
                                                                password_confirmation: password_confirmation.target.value,
                                                                passwordErrorMessage: "",
                                                                errorMsg: ""
                                                            })
                                                        }
                                                        placeholder="CONFIRM PASSWORD"
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

const mapStateToProps = state => {
    const { commonReducer } = state;
    return { commonReducer };
};

export default withRouter(connect(mapStateToProps, { ...commonActions })(PasswordResetConfirmationModal));
