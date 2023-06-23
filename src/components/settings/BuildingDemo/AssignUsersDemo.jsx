import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import Highlighter from "react-highlight-words";
import Portal from "../../common/components/Portal";
import BuildModalHeader from "../../common/components/BuildModalHeader";
import commonActions from "../../common/actions";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import ToastMsg from "../../common/ToastMessage";

let InitialValues = {
    activeTab: 1,
    showCurrentAssignmentModal: false,
    building: null,
    assigned_users: [],
    client_users: [],
    initial_assigned_users: [],
    consultancy_users: [],
    currentAssignments: [],
    user_ids: [],
    showConfirmation: false,
    consultancyUsersSearchKey: "",
    clienyUsersSearchKey: "",
    assignedSearchKey: "",
    showCancelConfirmModal: false
};

const AssignUsersDemo = ({ onCancel, building_id }) => {
    const [state, setState] = useState(InitialValues);

    const dispatch = useDispatch();

    const {
        activeTab,
        building,
        assigned_users,
        client_users,
        initial_assigned_users,
        consultancy_users,
        user_ids,
        showConfirmation,
        consultancyUsersSearchKey,
        clienyUsersSearchKey,
        assignedSearchKey,
        showCancelConfirmModal
    } = state;

    const { getAssignUserForBuildingPopupDetailsResponse, assignUsersToBuildingResponse } = useSelector(s => s.commonReducer);

    const { getAssignUserForBuildingPopupDetails, assignUsersToBuilding, updateAssignPopUpApiTrigger } = commonActions;

    useEffect(() => {
        dispatch(getAssignUserForBuildingPopupDetails(building_id));
    }, []);

    useEffect(() => {
        let { assigned_users = [], success } = getAssignUserForBuildingPopupDetailsResponse;
        if (success) {
            setState({
                ...state,
                ...getAssignUserForBuildingPopupDetailsResponse,
                initial_assigned_users: assigned_users.map(item => item.id),
                user_ids: assigned_users.map(item => item.id)
            });
        }
    }, [getAssignUserForBuildingPopupDetailsResponse]);

    useEffect(() => {
        if (assignUsersToBuildingResponse.success) onUpdateUsersConfirm();
    }, [assignUsersToBuildingResponse.success]);

    const searchInConsultancyUsers = consultancyUsersSearchKey => {
        let { consultancy_users = [] } = getAssignUserForBuildingPopupDetailsResponse;
        let assignedUserIds = assigned_users.map(item => item.id);
        let result = consultancy_users.filter(item => !assignedUserIds.includes(item.id));
        if (consultancyUsersSearchKey.trim().length) {
            result = result.filter(({ name }) => name.toLowerCase().includes(consultancyUsersSearchKey.toLowerCase()));
        }
        setState({ ...state, consultancyUsersSearchKey, consultancy_users: result });
    };

    const searchInInClientUsers = clienyUsersSearchKey => {
        let { client_users = [] } = getAssignUserForBuildingPopupDetailsResponse;
        let assignedUserIds = assigned_users.map(item => item.id);
        let result = client_users.filter(item => !assignedUserIds.includes(item.id));
        if (clienyUsersSearchKey.trim().length) {
            result = result.filter(({ name }) => name.toLowerCase().includes(clienyUsersSearchKey.toLowerCase()));
        }
        setState({ ...state, clienyUsersSearchKey, client_users: result });
    };

    const searchInAssigned = async assignedSearchKey => {
        let { assigned_users = [] } = getAssignUserForBuildingPopupDetailsResponse;
        let clientUserIds = client_users.map(item => item.id);
        let consultancyUserIds = consultancy_users.map(item => item.id);
        let result = assigned_users.filter(item => !clientUserIds.includes(item.id) && !consultancyUserIds.includes(item.id));
        if (assignedSearchKey.trim().length) {
            result = result.filter(
                ({ name, role }) =>
                    name.toLowerCase().includes(assignedSearchKey.toLowerCase()) || role.toLowerCase().includes(assignedSearchKey.toLowerCase())
            );
        }
        setState({ ...state, assignedSearchKey, assigned_users: result });
    };
    const togglShowConfirmation = () => setState({ ...state, showConfirmation: !showConfirmation });

    const updateAsignedLogbooksForBuilding = () => {
        if (_.isEqual(initial_assigned_users.sort(), user_ids.sort())) {
            onCancel();
            ToastMsg("Users Assigned Successfully", "info");
        } else {
            togglShowConfirmation();
        }
    };

    const onUpdateUsersConfirm = () => {
        if (!_.isEqual(initial_assigned_users.sort(), user_ids.sort())) {
            dispatch(assignUsersToBuilding(building_id, user_ids));
            let { success, message } = assignUsersToBuildingResponse;
            if (success) {
                dispatch(getAssignUserForBuildingPopupDetails(building_id));
                dispatch(updateAssignPopUpApiTrigger({ isTrigger: true }));
                togglShowConfirmation();
                onCancel();
            }
            ToastMsg(message, "info");
        }
        return true;
    };

    const updateAssignedList = (type, id, user_type) => {
        let itemObj = {};
        let tempAssignedUsers = assigned_users;
        let tempAvailableConsultancyUsers = consultancy_users;
        let tempAvailableClientUsers = client_users;
        let tempUserIds = [];
        if (id === "all") {
            if (type === "add") {
                if (user_type === "consultancy_users") {
                    tempAvailableConsultancyUsers.map(item => {
                        tempAssignedUsers.push({ ...item, type: "consultancy" });
                    });
                    tempAvailableConsultancyUsers = [];
                } else {
                    tempAvailableClientUsers.map(item => {
                        tempAssignedUsers.push({ ...item, type: "client" });
                    });
                    tempAvailableClientUsers = [];
                }
            } else {
                tempAssignedUsers.map(item => {
                    if (item && item.role === "consultancy_user") {
                        tempAvailableConsultancyUsers.push(item);
                    } else {
                        tempAvailableClientUsers.push(item);
                    }
                });
                tempAssignedUsers = [];
            }
        } else {
            if (type === "add") {
                if (user_type === "consultancy_users") {
                    itemObj = consultancy_users.find(item => item.id === id);
                    tempAssignedUsers.push({ ...itemObj, type: "consultancy" });
                    tempAvailableConsultancyUsers = tempAvailableConsultancyUsers.filter(item => item.id !== id);
                } else {
                    itemObj = client_users.find(item => item.id === id);
                    tempAssignedUsers.push({ ...itemObj, type: "client" });
                    tempAvailableClientUsers = tempAvailableClientUsers.filter(item => item.id !== id);
                }
            } else {
                itemObj = assigned_users.find(item => item.id === id);
                if ((itemObj && itemObj.type === "consultancy") || (itemObj && itemObj.role === "consultancy_user")) {
                    tempAvailableConsultancyUsers.push(itemObj);
                } else {
                    tempAvailableClientUsers.push(itemObj);
                }
                tempAssignedUsers = tempAssignedUsers.filter(item => item.id !== id);
            }
        }
        tempAvailableConsultancyUsers = _.uniqBy(tempAvailableConsultancyUsers, "id");
        tempAvailableClientUsers = _.uniqBy(tempAvailableClientUsers, "id");
        tempAssignedUsers = _.uniqBy(tempAssignedUsers, "id");
        tempUserIds = tempAssignedUsers.map(item => item.id);

        setState({
            ...state,
            assigned_users: tempAssignedUsers,
            consultancy_users: tempAvailableConsultancyUsers,
            client_users: tempAvailableClientUsers,
            user_ids: tempUserIds
        });
    };

    const onCancelModal = () => {
        if (showCancelConfirmModal) {
            setState({ ...state, showCancelConfirmModal: false });
            onCancel();
        } else if (!_.isEqual(initial_assigned_users.sort(), user_ids.sort())) {
            setState({ ...state, showCancelConfirmModal: true });
        } else {
            onCancel();
        }
    };

    return (
        <React.Fragment>
            <div className="modal assigned-build-modal three-col-modal" role="dialog" style={{ display: "block" }} id="modalId">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <BuildModalHeader title="Assign Users For building" onCancel={onCancel} modalClass="assigned-build-modal" />
                        <h5 className="ml-4">{building && building.name}</h5>
                        <div className="modal-body">
                            <div className="outer-act-build list-sec">
                                <div className="build-tem1">
                                    <h4>Consultancy Users</h4>
                                    <div className="outer-avl-bind">
                                        <div className="sr-sec search-section">
                                            <div className="sr-out">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    onChange={e => searchInConsultancyUsers(e.target.value)}
                                                    placeholder="Search"
                                                    value={consultancyUsersSearchKey}
                                                />
                                                <span
                                                    className="clear-btn"
                                                    onClick={() => (consultancyUsersSearchKey.trim().length ? searchInConsultancyUsers("") : null)}
                                                >
                                                    Clear
                                                </span>
                                            </div>
                                        </div>
                                        <div className="table-section">
                                            <table className="table table-bordered file-system-table">
                                                <thead>
                                                    <tr>
                                                        <th className="img-sq-box">
                                                            <span
                                                                className="material-icons icon-arw"
                                                                onClick={() => updateAssignedList("add", "all", "consultancy_users")}
                                                            >
                                                                height
                                                            </span>
                                                        </th>
                                                        <th className="sel-all">Assign All</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {consultancy_users && consultancy_users.length ? (
                                                        consultancy_users.map((item, i) => (
                                                            <tr key={i}>
                                                                <td className="img-sq-box">
                                                                    <span
                                                                        className="material-icons icon-arw"
                                                                        onClick={() => updateAssignedList("add", item.id, "consultancy_users")}
                                                                    >
                                                                        height
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <Highlighter
                                                                        searchWords={[`${consultancyUsersSearchKey}`]}
                                                                        textToHighlight={item.name}
                                                                        className="highlighter"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="2" className="text-center">
                                                                No Records Found !!
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="popup-counter">Count : {consultancy_users ? consultancy_users.length : 0}</div>
                                </div>
                                <div className="build-tem2">
                                    <h4>Client Users</h4>
                                    <div className="outer-avl-bind">
                                        <div className="sr-sec search-section">
                                            <div className="sr-out">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    onChange={e => searchInInClientUsers(e.target.value)}
                                                    placeholder="Search"
                                                    value={clienyUsersSearchKey}
                                                />
                                                <span
                                                    className="clear-btn"
                                                    onClick={() => (clienyUsersSearchKey.trim().length ? searchInInClientUsers("") : null)}
                                                >
                                                    Clear
                                                </span>
                                            </div>
                                        </div>
                                        <div className="table-section">
                                            <table className="table table-bordered file-system-table">
                                                <thead>
                                                    <tr>
                                                        <th className="img-sq-box">
                                                            <span
                                                                className="material-icons icon-arw"
                                                                onClick={() => updateAssignedList("add", "all")}
                                                            >
                                                                height
                                                            </span>
                                                        </th>
                                                        <th className="sel-all">Assign All</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {client_users && client_users.length ? (
                                                        client_users.map((item, i) => (
                                                            <tr key={i}>
                                                                <td className="img-sq-box">
                                                                    <span
                                                                        className="material-icons icon-arw"
                                                                        onClick={() => updateAssignedList("add", item.id, "client_users")}
                                                                    >
                                                                        height
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <Highlighter
                                                                        searchWords={[`${clienyUsersSearchKey}`]}
                                                                        textToHighlight={item.name}
                                                                        className="highlighter"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="2" className="text-center">
                                                                No Records Found !!
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="popup-counter">Count : {client_users ? client_users.length : 0}</div>
                                </div>
                                <div className="build-tem3">
                                    <h4>Assigned Users</h4>
                                    <div className="outer-avl-bind">
                                        <div className="sr-sec search-section">
                                            <div className="sr-out">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    onChange={e => searchInAssigned(e.target.value)}
                                                    placeholder="Search"
                                                    value={assignedSearchKey}
                                                />
                                                <span
                                                    className="clear-btn"
                                                    onClick={() => (assignedSearchKey.trim().length ? searchInAssigned("") : null)}
                                                >
                                                    Clear
                                                </span>
                                            </div>
                                        </div>
                                        <div className="table-section">
                                            <table className="table table-bordered file-system-table">
                                                <thead>
                                                    <tr>
                                                        <th className="img-sq-box">
                                                            <span
                                                                className="material-icons icon-arw"
                                                                onClick={() => updateAssignedList("remove", "all")}
                                                            >
                                                                height
                                                            </span>
                                                        </th>
                                                        <th className="sel-all">User Name</th>
                                                        <th>Role</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {assigned_users && assigned_users.length ? (
                                                        assigned_users.map((item, i) => (
                                                            <tr key={i}>
                                                                <td className="img-sq-box">
                                                                    <span
                                                                        className="material-icons icon-arw"
                                                                        onClick={() => updateAssignedList("remove", item.id)}
                                                                    >
                                                                        height
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <Highlighter
                                                                        searchWords={[`${assignedSearchKey}`]}
                                                                        textToHighlight={item.name}
                                                                        className="highlighter"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <Highlighter
                                                                        searchWords={[`${assignedSearchKey}`]}
                                                                        textToHighlight={item.role || `${item.type}_user`}
                                                                        className="highlighter"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="2" className="text-center">
                                                                No Records Found !!
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="popup-counter">Count : {assigned_users ? assigned_users.length : 0}</div>
                                </div>
                            </div>

                            <div className={`btn-sec ${activeTab === 2 ? "btn-survey-sec" : ""}`}>
                                <div className="btn-out-1">
                                    <button className="btn btn-create mr-2" onClick={() => updateAsignedLogbooksForBuilding()}>
                                        <i className="material-icons tic"> check</i> Update
                                    </button>
                                    <button className="btn btn-cncl-back" onClick={() => onCancelModal()}>
                                        <i className="material-icons tic"> close</i>Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {showConfirmation ? (
                    <Portal
                        body={<ConfirmationModal onCancel={togglShowConfirmation} onOk={onUpdateUsersConfirm} heading={"Update Assignment?"} />}
                        onCancel={togglShowConfirmation}
                    />
                ) : null}
                {showCancelConfirmModal ? (
                    <Portal
                        body={
                            <ConfirmationModal
                                heading={"Do you want to clear and lose all changes?"}
                                paragraph={"This action cannot be reverted, are you sure that you need to onCancel?"}
                                onCancel={() => setState({ ...state, showCancelConfirmModal: false })}
                                onOk={onCancelModal}
                            />
                        }
                        onCancel={() => setState({ ...state, showCancelConfirmModal: false })}
                    />
                ) : null}
            </div>
        </React.Fragment>
    );
};

export default AssignUsersDemo;
