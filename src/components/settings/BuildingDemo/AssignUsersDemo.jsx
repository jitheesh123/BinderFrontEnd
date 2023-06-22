import React from "react";

const AssignUsersDemo = ({ cancel }) => {
    return (
        <div>
            <button className="btn btn-primary" onClick={cancel}>
                close
            </button>
            <h1 style={{ color: "white", textAlign: "center", marginTop: "5%", fontWeight: "bolder" }}>AssignUsersDemo</h1>
        </div>
    );
};

export default AssignUsersDemo;
