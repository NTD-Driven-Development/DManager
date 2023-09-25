import { NextFunction } from "express"
import HttpException from "../exceptions/HttpException"
import RequestUser from "../core/exportDtos/auth/RequestUser"
import route from "../utils/route"
import _ from "lodash"
import { IRequest, IResponse } from "../core/interfaces/IHttp"

export default (req: IRequest, res: IResponse, next: NextFunction) => {
    req.routeUrl = route.getApiRouteFullPathFromRequest(req)
    const user = req.user as RequestUser
    if (user?.is_admin) {
        return next()
    }

    const url = route.getApiRouteFullPathFromRequest(req)
    const method = req.method
    const filterPermission = _.find(user?.permissions, (permission) => {
        return permission?.path == url && permission?.method == method
    })
    if (!filterPermission) {
        return next(new HttpException("權限不足", 403))
    }
    return next()
}
