import React, { Component } from "react";

export default class saveBuilding extends Component {
    render() {
        return (
            <section className="cont-ara">
                <div className="fst">
                    <div className="top-slider nav-ara">
                        <div className="tab-sec">
                            <ul className="nav nav-tabs">
                                <li className="active">
                                    <a data-toggle="tab" href="#bd">
                                        Basic Details
                                    </a>
                                </li>
                                <li>
                                    <a data-toggle="tab" href="#fls">
                                        Floors
                                    </a>
                                </li>
                                <li>
                                    <a data-toggle="tab" href="#img">
                                        Images
                                    </a>
                                </li>
                                <li>
                                    <a data-toggle="tab" href="#map">
                                        Map
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="pagenation">
                            <ul>
                                <li>
                                    <a href="#">Building </a>
                                </li>
                                <li>
                                    <a href="#">1920 </a>
                                </li>
                                <li className="active">
                                    <a href="#">Basic Details </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="frm-ara">
                        <div className="top-ara">
                            <h4>Add Building</h4>
                        </div>

                        <div className="head">
                            <h3>Basic Info</h3>
                        </div>
                        <div className="frm sav">
                            <div className="itm">
                                <div className="cunt">
                                    <div className="numb">01</div>
                                </div>
                                <div className="itm-cnt">
                                    <div className="form-group">
                                        <label className="form-control-placeholder-save">Host Full Name</label>
                                        <h3>Host Full Name</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="itm">
                                <div className="cunt">
                                    <div className="numb">02</div>
                                </div>
                                <div className="itm-cnt">
                                    <div className="form-group">
                                        <label className="form-control-placeholder-save">Consultancy</label>
                                        <h3>Consultancy</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="itm">
                                <div className="cunt">
                                    <div className="numb">03</div>
                                </div>
                                <div className="itm-cnt">
                                    <div className="form-group">
                                        <label className="form-control-placeholder-save">Client</label>
                                        <h3>Client</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="itm">
                                <div className="cunt">
                                    <div className="numb">04</div>
                                </div>
                                <div className="itm-cnt">
                                    <div className="form-group">
                                        <label className="form-control-placeholder-save">Builiding Type</label>
                                        <h3>Builiding Type</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="itm">
                                <div className="cunt">
                                    <div className="numb">05</div>
                                </div>
                                <div className="itm-cnt">
                                    <div className="form-group">
                                        <label className="form-control-placeholder-save">Sector</label>
                                        <h3>Sector</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="itm">
                                <div className="cunt">
                                    <div className="numb">06</div>
                                </div>
                                <div className="itm-cnt">
                                    <div className="form-group">
                                        <label className="form-control-placeholder-save">Campus</label>
                                        <h3>Campus</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="itm">
                                <div className="cunt">
                                    <div className="numb">07</div>
                                </div>
                                <div className="itm-cnt">
                                    <div className="form-group">
                                        <label className="form-control-placeholder-save">Descrtiption</label>
                                        <h3>Descrtiption</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="itm">
                                <div className="cunt">
                                    <div className="numb">08</div>
                                </div>
                                <div className="itm-cnt">
                                    <div className="form-group">
                                        <label className="form-control-placeholder-save">Buildig Number</label>
                                        <h3>Buildig Number</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="itm">
                                <div className="cunt">
                                    <div className="numb">09</div>
                                </div>
                                <div className="itm-cnt">
                                    <div className="form-group">
                                        <label className="form-control-placeholder-save">Associated Projects</label>
                                        <h3>Associated Projects</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="itm">
                                <div className="cunt">
                                    <div className="numb">10</div>
                                </div>
                                <div className="itm-cnt">
                                    <div className="form-group">
                                        <label className="form-control-placeholder-save">Consultancy Users</label>
                                        <div className="usr-ara">
                                            <div className="user-view">
                                                <div className="img">
                                                    <img src="/images/profileimg.jpg" />
                                                </div>
                                                <div className="usr-nme">User Name</div>
                                            </div>
                                            <div className="user-view">
                                                <div className="img">
                                                    <img src="/images/profileimg.jpg" />
                                                </div>
                                                <div className="usr-nme">User Name</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="itm">
                                <div className="cunt">
                                    <div className="numb">11</div>
                                </div>
                                <div className="itm-cnt">
                                    <div className="form-group">
                                        <label className="form-control-placeholder-save">Client Users</label>
                                        <div className="usr-ara">
                                            <div className="user-view">
                                                <div className="img">
                                                    <img src="/images/profileimg.jpg" />
                                                </div>
                                                <div className="usr-nme">User Name</div>
                                            </div>
                                            <div className="user-view">
                                                <div className="img">
                                                    <img src="/images/profileimg.jpg" />
                                                </div>
                                                <div className="usr-nme">User Name</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="head mt-4">
                            <h3>Basic Info</h3>
                        </div>
                        <div className="frm sav">
                            <div className="itm">
                                <div className="cunt">
                                    <div className="numb">01</div>
                                </div>
                                <div className="itm-cnt">
                                    <div className="form-group">
                                        <label className="form-control-placeholder-save">Arrea (Sq)</label>
                                        <h3>Arrea (Sq)</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="itm">
                                <div className="cunt">
                                    <div className="numb">02</div>
                                </div>
                                <div className="itm-cnt">
                                    <div className="form-group">
                                        <label className="form-control-placeholder-save">Cost</label>
                                        <h3>Cost</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="itm">
                                <div className="cunt">
                                    <div className="numb">03</div>
                                </div>
                                <div className="itm-cnt">
                                    <div className="form-group">
                                        <label className="form-control-placeholder-save">Enterprise Index</label>
                                        <h3>Enterprise Index</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="itm">
                                <div className="cunt">
                                    <div className="numb">04</div>
                                </div>
                                <div className="itm-cnt">
                                    <div className="form-group">
                                        <label className="form-control-placeholder-save">Ownership</label>
                                        <h3>Ownership</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="itm">
                                <div className="cunt">
                                    <div className="numb">05</div>
                                </div>
                                <div className="itm-cnt">
                                    <div className="form-group">
                                        <label className="form-control-placeholder-save">Ownership Type</label>
                                        <h3>Ownership Type</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="itm">
                                <div className="cunt">
                                    <div className="numb">06</div>
                                </div>
                                <div className="itm-cnt">
                                    <div className="form-group">
                                        <label className="form-control-placeholder-save"> Use</label>
                                        <h3>Use</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="itm">
                                <div className="cunt">
                                    <div className="numb">07</div>
                                </div>
                                <div className="itm-cnt">
                                    <div className="form-group">
                                        <label className="form-control-placeholder-save"> Manager</label>
                                        <h3>Manager</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="itm">
                                <div className="cunt">
                                    <div className="numb">08</div>
                                </div>
                                <div className="itm-cnt">
                                    <div className="form-group">
                                        <label className="form-control-placeholder-save"> Year Built</label>
                                        <h3>Year Built</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="itm">
                                <div className="cunt">
                                    <div className="numb">09</div>
                                </div>
                                <div className="itm-cnt">
                                    <div className="form-group">
                                        <label className="form-control-placeholder-save"> Ministry</label>
                                        <h3>Ministry</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="head mt-4">
                            <h3>Address</h3>
                        </div>
                        <div className="frm sav">
                            <div className="itm">
                                <div className="cunt">
                                    <div className="numb">01</div>
                                </div>
                                <div className="itm-cnt">
                                    <div className="form-group">
                                        <label className="form-control-placeholder-save"> Street</label>
                                        <h3>Street</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="itm">
                                <div className="cunt">
                                    <div className="numb">02</div>
                                </div>
                                <div className="itm-cnt">
                                    <div className="form-group">
                                        <label className="form-control-placeholder-save"> City</label>
                                        <h3>City</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="itm">
                                <div className="cunt">
                                    <div className="numb">03</div>
                                </div>
                                <div className="itm-cnt">
                                    <div className="form-group">
                                        <label className="form-control-placeholder-save"> State</label>
                                        <h3>State</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="itm">
                                <div className="cunt">
                                    <div className="numb">04</div>
                                </div>
                                <div className="itm-cnt">
                                    <div className="form-group">
                                        <label className="form-control-placeholder-save"> Country</label>
                                        <h3>Country</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="itm">
                                <div className="cunt">
                                    <div className="numb">05</div>
                                </div>
                                <div className="itm-cnt">
                                    <div className="form-group">
                                        <label className="form-control-placeholder-save"> Zip Code</label>
                                        <h3>Zip Code</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="itm">
                                <div className="cunt">
                                    <div className="numb">06</div>
                                </div>
                                <div className="itm-cnt">
                                    <div className="form-group">
                                        <label className="form-control-placeholder-save"> Comment</label>
                                        <h3>Comment</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
