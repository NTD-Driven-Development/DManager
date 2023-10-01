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
            res.operationName = "匯出住宿生加扣點及電話卡紀錄"
            const data = await ExportService.getBoarderPointAndTelCardLogs(
                req.query as any
            )
            res.logMessage = log.logFormatJson(res.operationName, req.query)
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }
})()
