import { NextFunction } from "express"
import { IRequest, IResponse } from "../../core/interfaces/IHttp"
import BoarderService from "../services/BoarderService"
import HttpResponse from "../../utils/httpResponse"
import Db from "../../models"
import RequestUser from "../exportDtos/auth/RequestUser"
import route from "../../utils/route"
import log from "../../utils/log"
import { Transaction } from "sequelize"

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
            res.operationName = "新增住宿生狀態"
            const data = await BoarderService.createBoarderStatus(
                req.body as any,
                req.user as RequestUser
            )
            res.logMessage = log.logFormatJson(res.operationName, data)
            next(HttpResponse.success(data, null, 201))
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
            res.operationName = "修改住宿生狀態"
            await Db.sequelize.transaction(async (t: Transaction) => {
                const beforeUpdateData =
                    await BoarderService.getBoarderStatusById(req.body?.id)
                const data = await BoarderService.updateBoarderStatus(
                    req.body as any,
                    req.user as RequestUser
                )
                t.afterCommit(() => {
                    res.logMessage = log.logFormatJson(
                        res.operationName,
                        beforeUpdateData
                    )
                    next(HttpResponse.success(data))
                })
            })
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
            res.operationName = "刪除住宿生狀態"
            await Db.sequelize.transaction(async (t: Transaction) => {
                const beforeDeleteData =
                    await BoarderService.getBoarderStatusById(req.params?.id)
                const data = await BoarderService.deleteBoarderStatus(
                    req.params?.id,
                    req.user as RequestUser
                )
                t.afterCommit(() => {
                    res.logMessage = log.logFormatJson(
                        res.operationName,
                        beforeDeleteData
                    )
                    next(HttpResponse.success(data))
                })
            })
        } catch (error: any) {
            next(error)
        }
    }
})()
