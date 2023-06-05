import React, { Component, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import TopSlider from "../../common/components/TopSlider";
import axios from "axios";
import history from "../../../config/history";

const DemoForm = props => {
    const [data, setData] = useState([]);
    const [values, setValues] = useState({
        name: "",
        email: "",
        phone: ""
    });
    let selectedDemo = props.match.params.id;
    const getData = async () => {
        const { data } = await axios.get(`https://jsonplaceholder.typicode.com/users/${selectedDemo}`);
        setData(data);
    };
    useEffect(() => {
        getData();
    }, [selectedDemo]);
    useEffect(() => {
        if (data) {
            setValues({
                name: data.name,
                email: data.email,
                phone: data.phone
            });
        }
    }, [data]);
    return (
        <section className="cont-ara act-main">
            <div className="list-area">
                <ToastContainer />
                <TopSlider />
                <div className="lst-bt-nav create">
                    <div className="table table-ara">
                        <div className="list-sec">
                            <div className="nav-ara">
                                <div className="head">
                                    <h4>{selectedDemo ? "Edit" : "Add"} Demo</h4>
                                </div>
                            </div>
                        </div>
                        <div className="form-area">
                            <div className="itm col-md-3">
                                <div className="form-group">
                                    <label className="">Name</label>
                                    <input
                                        type="text"
                                        id="text"
                                        value={values.name}
                                        onChange={e => {
                                            setValues({
                                                ...values,
                                                name: e.target.value
                                            });
                                        }}
                                        className="form-control"
                                        placeholder="Name"
                                        autoComplete="off"
                                    />
                                </div>
                            </div>
                            <div className="itm col-md-3">
                                <div className="form-group">
                                    <label className="">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={values.email}
                                        onChange={e => {
                                            setValues({
                                                ...values,
                                                email: e.target.value
                                            });
                                        }}
                                        className="form-control"
                                        placeholder="Email"
                                        autoComplete="off"
                                    />
                                </div>
                            </div>
                            <div className="itm col-md-3">
                                <div className="form-group">
                                    <label className="">Phone</label>
                                    <input
                                        type="text"
                                        id="phone"
                                        value={values.phone}
                                        onChange={e => {
                                            setValues({
                                                ...values,
                                                phone: e.target.value
                                            });
                                        }}
                                        className="form-control"
                                        placeholder="Phone"
                                        autoComplete="off"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="btn-sec">
                            <button className="btn btn-cncl-back mr-2" onClick={() => history.push("/demo")}>
                                <i className="material-icons tic"> close</i>Cancel
                            </button>
                            {selectedDemo ? (
                                <button
                                    className="btn btn-create"
                                    onClick={() => {
                                        history.push("/demo");
                                        alert(JSON.stringify(values));
                                    }}
                                >
                                    <i className="material-icons tic"> check</i> Update Demo
                                </button>
                            ) : (
                                <button className="btn btn-create" onClick={() => this.addFloor()}>
                                    <i className="material-icons tic"> check</i> Add Demo
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* {this.renderConfirmationModal()} */}
        </section>
    );
};

export default DemoForm;
