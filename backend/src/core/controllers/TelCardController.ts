import { NextFunction } from "express"
import { IRequest, IResponse } from "../../core/interfaces/IHttp"
import TelCardService from "../services/TelCardService"
import HttpResponse from "../../utils/httpResponse"
import Db from "../../models"
import RequestUser from "../exportDtos/auth/RequestUser"
import route from "../../utils/route"
import log from "../../utils/log"
import { Transaction } from "sequelize"

export default new (class TelCardController {
    public async getTelCardContacters(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await TelCardService.getTelCardContacters(
                req.query as any
            )
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async getTelCardContacterById(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await TelCardService.getTelCardContacterById(
                req.params.id
            )
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async createTelCardContacter(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            res.operationName = "建立電話卡聯絡人"
            const data = await TelCardService.createTelCardContacter(
                req.body as any,
                req.user as RequestUser
            )
            res.logMessage = log.logFormatJson(res.operationName, data)
            next(HttpResponse.success(data, null, 201))
        } catch (error: any) {
            next(error)
        }
    }

    public async updateTelCardContacter(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            res.operationName = "修改電話卡聯絡人"
            await Db.sequelize.transaction(async (t: Transaction) => {
                const beforeUpdateData =
                    await TelCardService.getTelCardContacterById(req.body?.id)
                const data = await TelCardService.updateTelCardContacter(
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

    public async deleteTelCardContacter(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            res.operationName = "刪除電話卡聯絡人"
            await Db.sequelize.transaction(async (t: Transaction) => {
                const beforeDeleteData =
                    await TelCardService.getTelCardContacterById(req.params.id)
                const data = await TelCardService.deleteTelCardContacter(
                    req.params.id,
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

    public async getTelCardLogs(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await TelCardService.getTelCardLogs(req.query as any)
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async getTelCardLogById(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await TelCardService.getTelCardLogById(req.params.id)
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async createTelCardLog(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            res.operationName = "建立住宿生電話卡紀錄"
            const data = await TelCardService.createTelCardLog(
                req.body as any,
                req.user as RequestUser
            )
            res.logMessage = log.logFormatJson(res.operationName, data)
            next(HttpResponse.success(data, null, 201))
        } catch (error: any) {
            next(error)
        }
    }

    public async deleteTelCardLog(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            res.operationName = "刪除住宿生電話卡紀錄"
            await Db.sequelize.transaction(async (t: Transaction) => {
                const beforeDeleteData = await TelCardService.getTelCardLogById(
                    req.params.id
                )
                const data = await TelCardService.deleteTelCardLog(
                    req.params.id,
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
