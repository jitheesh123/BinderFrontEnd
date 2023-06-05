import { logbookGateWay } from '../../services/authorizationService'
import * as serviceEndPoints from '../../config/serviceEndPoints'
export const login = params => logbookGateWay.post(serviceEndPoints.userEndPoints.loginUser, params)