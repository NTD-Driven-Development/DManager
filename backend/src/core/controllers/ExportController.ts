import { NextFunction } from "express"
import { IRequest, IResponse } from "../../core/interfaces/IHttp"
import ExportService from "../services/ExportService"
import HttpResponse from "../../utils/httpResponse"
import Db from "../../models"
import route from "../../utils/route"
import log from "../../utils/log"

export default new (class ExportController {
    public async getBoarderPointAndTelCardLogs(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await ExportService.getBoarderPointAndTelCardLogs(
                req.query as any
            )
            res.logMessage = log.logFormatJson(req.query)
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }
})()
