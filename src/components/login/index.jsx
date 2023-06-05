import React, { Component } from "react";
import { connect } from "react-redux";
import actions from "./actions";
import { WDS_SOCKET_PATH } from "../../config/contstants";
import ToastMsg from "../common/ToastMessage";
import "../../assets/css/login.css";

const mapStateToProps = state => {
    const { loginReducer } = state;
    return { loginReducer };
};

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            grant_type: "password",
            emailErrorMessage: "",
            passwordErrorMessage: "",
            rememberMe: true,
            errorMsg: "",
            isLoading: false
        };
    }

    validate = async () => {
        let passExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;
        let emailExp = /^\w+([\.-]?\w+)*@\w+([\.-]?(\.\w{2,3})+)*(\.\w{2,3})+$/;

        if (this.state.email === "") {
            this.setState({ emailErrorMessage: "Please enter email" });
        }
        if (this.state.email != "" && !emailExp.test(this.state.email.trim())) {
            this.setState({ emailErrorMessage: "Please enter vaild email" });
        }
        if (this.state.password === "") {
            this.setState({ passwordErrorMessage: "Please enter password" });
        }
        if (this.state.email != "" && this.state.password != "" && this.state.email != "" && emailExp.test(this.state.email.trim())) {
            this.login();
        }
    };

    login = async () => {
        await this.setState({
            isLoading: true
        });
        let params = {
            email: this.state.email,
            password: this.state.password,
            grant_type: this.state.grant_type
        };
        let defautMasterFilters = {
            logbook_ids: [],
            building_ids: [],
            building_type_ids: [],
            campus_ids: [],
            sector_ids: [],
            client_ids: [],
            consultancy_ids: [],
            view: "trailing",
            annual_years: [`${new Date().getFullYear()}`]
        };
        await this.props.login(params);
        if (this.props.loginReducer.loginUser.success) {
            const view_only_surveyor = this.props.loginReducer.loginUser?.view_only_surveyor === "yes";
            localStorage.setItem("logbook-token", this.props.loginReducer.loginUser.access_token);
            localStorage.setItem("token_type", this.props.loginReducer.loginUser.token_type);
            localStorage.setItem("userName", this.props.loginReducer.loginUser.user);
            localStorage.setItem("user", this.props.loginReducer.loginUser.user);
            localStorage.setItem("user_id", this.props.loginReducer.loginUser.user_id);
            localStorage.setItem("user_role", this.props.loginReducer.loginUser.role);
            localStorage.setItem(
                "audit_mode",
                this.props.loginReducer.loginUser.audit_mode || view_only_surveyor || this.props.loginReducer.loginUser.view_only
            );
            localStorage.setItem("view_only", this.props.loginReducer.loginUser.view_only);
            localStorage.setItem("user_permissions", JSON.stringify(this.props.loginReducer.loginUser.permissions));
            localStorage.setItem("rememberMe", this.state.rememberMe);
            localStorage.setItem("user_notification", JSON.stringify([]));
            localStorage.setItem("master_filters", JSON.stringify(defautMasterFilters));
            localStorage.setItem("master_filters_applied", JSON.stringify(defautMasterFilters));
            localStorage.setItem("view_only_surveyor", view_only_surveyor);
            if (this.props.loginReducer.loginUser && (this.props.loginReducer.loginUser.audit_mode || view_only_surveyor)) {
                this.props.history.push("/logbooksmain");
            } else {
                this.props.history.push("/dashboard");
            }
        } else if (this.props.loginReducer.loginUser.error_description && this.props.loginReducer.loginUser.error !== "invalid_grant") {
            this.setState({
                errorMsg: this.props.loginReducer.loginUser.error_description
            });
        } else {
            this.setState({
                errorMsg: "Invalid email or password"
            });
        }
        await this.setState({
            isLoading: false
        });
    };

    rememberMeClick = async () => {
        await this.setState({
            rememberMe: !this.state.rememberMe
        });
    };

    render() {
        const { isLoading } = this.state;
        return (
            <div className="login">
                <header>
                    <nav className="navbar fixed-top">
                        <span className="navbar-brand" href="#">
                            <img src="/images/logo-outer.svg" alt="" />
                        </span>
                    </nav>
                </header>
                <main>
                    <div className="log-sec">
                        <div className="hed">
                            <h3>LOGIN</h3>
                            <small>use your credentials</small>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-12">
                                <input
                                    type="text"
                                    className="form-control"
                                    onChange={email => this.setState({ email: email.target.value, emailErrorMessage: "", errorMsg: "" })}
                                    placeholder="EMAIL"
                                    onKeyPress={event => {
                                        if (event.key === "Enter") {
                                            this.validate();
                                        }
                                    }}
                                />
                                <span style={{ color: "red" }}>{this.state.emailErrorMessage}</span>
                            </div>

                            <div className="form-group col-md-12">
                                <input
                                    type="password"
                                    className="form-control"
                                    onChange={password => this.setState({ password: password.target.value, passwordErrorMessage: "", errorMsg: "" })}
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
                                <label className="container-check ml-1">
                                    Remember me
                                    <input type="checkbox" checked={this.state.rememberMe} onClick={() => this.rememberMeClick()} />
                                    <span className="checkmark"></span>
                                </label>
                                <span style={{ color: "red", fontSize: "15px" }}>{this.state.errorMsg}</span>
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
                                        Login
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* <div className="forgot">
                        <h6>
                            Not a Member Yet ? <span>Sign Up Now</span>
                        </h6>
                    </div> */}
                </main>
            </div>
        );
    }
}
export default connect(mapStateToProps, { ...actions })(Index);
