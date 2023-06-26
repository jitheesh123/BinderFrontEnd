import React from "react";

const AssignLogBooksDemo = ({ cancel }) => {
    return (
        <div>
            <button className="btn btn-primary" onClick={cancel}>
                close
            </button>
            <h1 style={{ color: "white", textAlign: "center", marginTop: "5%", fontWeight: "bolder" }}>AssignLogBooksDemo</h1>
        </div>
    );
};

export default AssignLogBooksDemo;
