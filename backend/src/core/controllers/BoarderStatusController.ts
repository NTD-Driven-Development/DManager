import { NextFunction } from "express"
import { IRequest, IResponse } from "../../core/interfaces/IHttp"
import BoarderService from "../services/BoarderService"
import HttpResponse from "../../utils/httpResponse"
import Db from "../../models"
import RequestUser from "../exportDtos/auth/RequestUser"
import route from "../../utils/route"

export default new (class BoarderStatusController {
    public async getBoarderStatuses(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await BoarderService.getBoarderStatuses(
                req.query as any
            )
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async getBoarderStatuseById(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const id = req.params.id
            const data = await BoarderService.getBoarderStatusById(id)
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async createBoarderStatus(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await BoarderService.createBoarderStatus(
                req.body as any,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, "建立住宿生狀態", 201))
        } catch (error: any) {
            next(error)
        }
    }

    public async updateBoarderStatus(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await BoarderService.updateBoarderStatus(
                req.body as any,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, "修改住宿生狀態"))
        } catch (error: any) {
            next(error)
        }
    }

    public async deleteBoarderStatus(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await BoarderService.deleteBoarderStatus(
                req.params.id,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, "刪除住宿生狀態"))
        } catch (error: any) {
            next(error)
        }
    }
})()
