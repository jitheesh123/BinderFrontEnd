import { logbookGateWay } from '../../../services/authorizationService'
import * as serviceEndPoints from '../../../config/serviceEndPoints'

export const getAllDocument = params => logbookGateWay.get(serviceEndPoints.documentEndPoints.getAllDocument, { params })
// export const addUsers = params => logbookGateWay.post(serviceEndPoints.userEndPoints.getUsers, params)
export const getDocumentById = id => logbookGateWay.get(`${serviceEndPoints.documentEndPoints.getAllDocument}/${id}`)
// export const editUsersById = (params, id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getUsers}/${id}`, params)
// export const deleteUsers = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getUsers}/${id}`)
export const getListForCommonFilterForDocuments = params =>
    logbookGateWay.get(`${serviceEndPoints.documentEndPoints.getAllDocument}/get_list`, {
        params
    });
// // export const getUsersById = id => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getUsers}/${id}`);

// export const exportUsers = params =>
//     logbookGateWay.get(`${serviceEndPoints.userEndPoints.getUsers}/export_xl`, {
//         method: "GET", responseType: "blob", params
//     });
// export const getAllUsersLogs = (params,id) => {
//         return logbookGateWay.get(`${serviceEndPoints.userEndPoints.getUsers}/${id}/logs`,{params});
//     };
// export const restoreUsersLog = (id) => logbookGateWay.patch(`${serviceEndPoints.userEndPoints.getLogs}/${id}/restore`);
// export const deleteUsersLog = id => logbookGateWay.delete(`${serviceEndPoints.userEndPoints.getLogs}/${id}`);
// export const getExistingUsers = params => logbookGateWay.get(`${serviceEndPoints.userEndPoints.getUsers}/existing_email`, { params })
// export const getUserPermissionDropdown = params => logbookGateWay.get(`${serviceEndPoints.userPermissionEndPoints.getUserPermissions}/templates_dropdown`, { params })
