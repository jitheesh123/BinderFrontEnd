import React, { Component } from "react";

import TopSlider from "./TopSlider";

class ComingSoon extends Component {
    render() {
        return (
            <section className="cont-ara">
                <div className="list-area coming-soon-layer">
                    <TopSlider />
                    <div className="lst-bt-nav fire-sytem-otr">
                        <div className="col-md-12 coming-soon-outer">
                            <div className="coming-soon-img">
                                <img src="/images/coming-soon.svg" alt="" />
                            </div>
                            <h3>COMING SOON</h3>
                            <h4>The page is in under Construction</h4>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default ComingSoon;
