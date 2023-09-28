import { NextFunction } from "express"
import HttpException from "../exceptions/HttpException"
import RequestUser from "../core/exportDtos/auth/RequestUser"
import _ from "lodash"
import { IRequest, IResponse } from "../core/interfaces/IHttp"
import { match } from "path-to-regexp"

export default (req: IRequest, res: IResponse, next: NextFunction) => {
    const user = req.user as RequestUser
    if (user?.is_admin) {
        return next()
    }

    const clearUrl = req.originalUrl.split("?")[0]
    const checkPermission = _.some(user?.permissions, (permission) => {
        const fn = match(permission?.path, { decode: decodeURIComponent })
        return fn(clearUrl) && req.method == permission?.method
    })

    if (!checkPermission) {
        return next(new HttpException("權限不足", 403))
    }
    return next()
}
