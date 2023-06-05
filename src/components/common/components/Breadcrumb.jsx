import React, { Component } from "react";

class Breadcrumb extends Component {
    render() {
        return (
            <div className="pagenation">
                <ul>
                    <li>
                        <span>Activity </span>
                    </li>

                    <li className="active">
                        <span>View Details </span>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Breadcrumb;
