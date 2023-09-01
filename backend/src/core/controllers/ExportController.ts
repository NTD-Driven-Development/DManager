import { Request, Response, NextFunction } from "express"
import ExportService from "../services/ExportService"
import HttpResponse from "../../utils/httpResponse"
import Db from "../../models"
import RequestUser from "../exportDtos/auth/RequestUser"

export default new (class ExportController {
    public async getBoarderPointAndTelCardLogs(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await ExportService.getBoarderPointAndTelCardLogs(req.query as any)
            next(HttpResponse.success(data, 200))
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
})()
