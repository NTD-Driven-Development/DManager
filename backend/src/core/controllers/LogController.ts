import { NextFunction } from "express"
import { IRequest, IResponse } from "../interfaces/IHttp"
import LogService from "../services/LogService"
import HttpResponse from "../../utils/httpResponse"
import route from "../../utils/route"

export default new (class ShareController {
    public async getOperationLogs(req: IRequest, res: IResponse, next: NextFunction) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await LogService.getOperationLogs(req.query)
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }
})()
