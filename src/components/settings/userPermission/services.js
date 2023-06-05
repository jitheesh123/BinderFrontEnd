import { logbookGateWay } from '../../../services/authorizationService'
import * as serviceEndPoints from '../../../config/serviceEndPoints'

export const getUserPermissions = params => logbookGateWay.get(serviceEndPoints.userPermissionEndPoints.getUserPermissions, { params })
export const getUserListForPermissions = params => logbookGateWay.get(serviceEndPoints.userPermissionEndPoints.getUserListForPermissions, { params })
export const addUserPermissions = params => logbookGateWay.post(serviceEndPoints.userPermissionEndPoints.getUserPermissions, params)
export const getUserPermissionsById = id => logbookGateWay.get(`${serviceEndPoints.userPermissionEndPoints.getUserPermissions}/${id}`)
export const editUserPermissionsById = (params, id) => logbookGateWay.patch(`${serviceEndPoints.userPermissionEndPoints.getUserPermissions}/${id}`, params)
export const deleteUserPermissions = id => logbookGateWay.delete(`${serviceEndPoints.userPermissionEndPoints.getUserPermissions}/${id}`)
export const getListForCommonFilterForUserPermissions = params =>
    logbookGateWay.get(`${serviceEndPoints.userPermissionEndPoints.getUserPermissions}/get_list`, {
        params
    });
// export const getUserPermissionsById = id => logbookGateWay.get(`${serviceEndPoints.userPermissionEndPoints.getUserPermissions}/${id}`);

export const exportUserPermissions = params =>
    logbookGateWay.get(`${serviceEndPoints.userPermissionEndPoints.getUserPermissions}/export_xl`, {
        method: "GET", responseType: "blob", params
    });
export const getAllUserPermissionsLogs = (params,id) => {
        return logbookGateWay.get(`${serviceEndPoints.userPermissionEndPoints.getUserPermissions}/${id}/logs`,{params});
    };
export const restoreUserPermissionsLog = (id) => logbookGateWay.patch(`${serviceEndPoints.userPermissionEndPoints.getLogs}/${id}/restore`);
export const deleteUserPermissionsLog = id => logbookGateWay.delete(`${serviceEndPoints.userPermissionEndPoints.getLogs}/${id}`);
export const getTemplatesById = id => logbookGateWay.get(`${serviceEndPoints.templateEndPoints.getTemplatesById}/${id}`)
