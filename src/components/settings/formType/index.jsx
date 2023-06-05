import React, { Component } from "react";
import { connect } from "react-redux";
import LoadingOverlay from "react-loading-overlay";
import ReactTooltip from "react-tooltip";

import TopSlider from "../../common/components/TopSlider";
import Loader from "../../common/components/Loader";
import actions from "./actions";
import Portal from "../../common/components/Portal";
import FromSettingsModal from "./components/fromSettingsModal";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: [],
            showSettingsModal: false,
            showViewModal: false,
            selectedForm: null
        };
    }

    componentDidMount = async () => {
        this.refreshFormTypesData();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.masterFilters !== this.props.masterFilters) {
            await this.refreshFormTypesData();
        }
    };

    refreshFormTypesData = async () => {
        this.props.setIsLoading(true);
        const { path = "event_forms", building_id = null, client_id = null } = this.props;

        // let master_filters = JSON.parse(localStorage.getItem("master_filters"));

        let params = {};
        if (path === "building_event_forms") {
            params = { ...params, building_id };
        }
        if (path === "client_event_forms") {
            params = { ...params, client_id };
        }

        await this.props.getAllFormTypes(params, path);
        const {
            formTypeReducer: {
                getAllFormTypesResponse: { forms = [] }
            }
        } = this.props;
        await this.setState({
            forms
        });
        this.props.setIsLoading(false);
    };

    togglShowSettingsModal = value => {
        const { showSettingsModal } = this.state;
        this.setState({
            showSettingsModal: value ? value : !showSettingsModal
        });
    };

    renderFromSettingsModal = () => {
        const { showSettingsModal, selectedForm } = this.state;
        const { path = "event_forms" } = this.props;
        if (!showSettingsModal || !selectedForm) return null;
        return (
            <Portal
                body={<FromSettingsModal selectedForm={selectedForm} onCancel={this.togglShowSettingsModal} path={path} />}
                onCancel={this.togglShowSettingsModal}
            />
        );
    };

    handleViewClick = async item => {};

    handleSettingsClick = async item => {
        await this.setState({
            selectedForm: item
        });
        this.togglShowSettingsModal(true);
    };

    render() {
        const { forms } = this.state;
        const { isLoading } = this.props;
        return (
            <section className="cont-ara">
                <ReactTooltip effect="solid" id="form_types" />
                <LoadingOverlay active={isLoading} spinner={<Loader />}>
                    <div className="dash form-types">
                        <TopSlider />
                        <div className="dash-cont">
                            <div className="pub-ara six">
                                {forms && forms.length
                                    ? forms.map((item, i) => (
                                          <div className="items cursor-pointer">
                                              <div className="item-head">
                                                  <div className="icon">
                                                      <div className="count">{i + 1}</div>
                                                  </div>
                                              </div>
                                              <div className="itm-cnt">
                                                  <img src="/images/assign.svg" className="img-resposive" alt="" />
                                              </div>
                                              <div className="itm-btm">
                                                  <div className="head">
                                                      <h2>{item.display_name || item.name}</h2>
                                                  </div>
                                                  <div className="buttonSection">
                                                      <button
                                                          class="btn view"
                                                          data-tip="View Form"
                                                          data-for="form_types"
                                                          onClick={() => this.handleViewClick(item)}
                                                      >
                                                          <img src="/images/view.svg" alt="" />
                                                      </button>
                                                      <button
                                                          class="btn settings"
                                                          data-tip="View Settings"
                                                          data-for="form_types"
                                                          onClick={() => this.handleSettingsClick(item)}
                                                      >
                                                          <img src="/images/filter-icon.svg" alt="" />
                                                      </button>
                                                  </div>
                                              </div>
                                          </div>
                                      ))
                                    : 
                                    <h2 class="text-center">No records found!</h2>}
                            </div>
                        </div>
                    </div>
                </LoadingOverlay>
                {this.renderFromSettingsModal()}
            </section>
        );
    }
}

const mapStateToProps = state => {
    const { formTypeReducer } = state;
    return { formTypeReducer };
};

export default connect(mapStateToProps, { ...actions })(index);
