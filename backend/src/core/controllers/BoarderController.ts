import { NextFunction } from "express"
import { IRequest, IResponse } from "../../core/interfaces/IHttp"
import BoarderService from "../services/BoarderService"
import HttpResponse from "../../utils/httpResponse"
import Db from "../../models"
import { Transaction } from "sequelize"
import RequestUser from "../exportDtos/auth/RequestUser"
import route from "../../utils/route"
import log from "../../utils/log"

export default new (class BoarderController {
    public async getBoarders(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await BoarderService.getBoarders(req.query as any)
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async getBoarderById(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await BoarderService.getBoarderById(req.params.id)
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async createBoarder(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            await Db.sequelize.transaction(async (t: Transaction) => {
                const data = await BoarderService.createBoarder(
                    req.body as any,
                    req.user as RequestUser
                )
                t.afterCommit(async () => {
                    const afterCreateData = await BoarderService.getBoarderById(
                        data.id
                    )
                    res.logMessage = log.logFormatJson(afterCreateData)
                    next(HttpResponse.success(data, null, 201))
                })
            })
        } catch (error: any) {
            next(error)
        }
    }

    public async updateBoarder(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            await Db.sequelize.transaction(async (t: Transaction) => {
                const beforeUpdateData = await BoarderService.getBoarderById(
                    req.body?.id
                )
                const data = await BoarderService.updateBoarder(
                    req.body as any,
                    req.user as RequestUser
                )
                t.afterCommit(() => {
                    res.logMessage = log.logFormatJson(beforeUpdateData)
                    next(HttpResponse.success(data))
                })
            })
        } catch (error: any) {
            next(error)
        }
    }

    public async deleteBoarder(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            await Db.sequelize.transaction(async (t: Transaction) => {
                const beforeDeleteData = await BoarderService.getBoarderById(
                    req.params?.id
                )
                const data = await BoarderService.deleteBoarder(
                    req.params.id,
                    req.user as RequestUser
                )
                t.afterCommit(() => {
                    res.logMessage = log.logFormatJson(beforeDeleteData)
                    next(HttpResponse.success(data))
                })
            })
        } catch (error: any) {
            next(error)
        }
    }
})()
