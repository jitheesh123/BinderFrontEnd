import { logbookGateWay } from '../../../services/authorizationService'
import * as serviceEndPoints from '../../../config/serviceEndPoints'

export const getUsers = params => logbookGateWay.get(serviceEndPoints.userEndPoints.getBuildingUsers, { params })
export const addUsers = params => logbookGateWay.post(serviceEndPoints.userEndPoints.getUsers, params)
export const getUsersById = id => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getBuildingUsers}/${id}`)
export const editUsersById = (params, id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getUsers}/${id}`, params)
export const deleteUsers = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getBuildingUsers}/${id}`)
export const getListForCommonFilterForUsers = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getUsers}/get_list`, {
        params
    });
// export const getUsersById = id => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getUsers}/${id}`);

export const exportUsers = params =>
    logbookGateWay.get(`${serviceEndPoints.userEndPoints.getBuildingUsers}/export_xl`, {
        method: "GET", responseType: "blob", params
    });
export const getAllUsersLogs = (params,id) => {
        return logbookGateWay.get(`${serviceEndPoints.userEndPoints.getUsers}/${id}/logs`,{params});
    };
export const restoreUsersLog = (id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogs}/${id}/restore`);
export const deleteUsersLog = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getLogs}/${id}`);
