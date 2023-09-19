import { NextFunction } from "express"
import { IRequest, IResponse } from "../../core/interfaces/IHttp"
import TelCardService from "../services/TelCardService"
import HttpResponse from "../../utils/httpResponse"
import Db from "../../models"
import RequestUser from "../exportDtos/auth/RequestUser"
import route from "../../utils/route"

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
            const data = await TelCardService.createTelCardContacter(
                req.body as any,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, "建立電話卡聯絡人", 201))
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
            const data = await TelCardService.updateTelCardContacter(
                req.body as any,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, "修改電話卡聯絡人"))
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
            const data = await TelCardService.deleteTelCardContacter(
                req.params.id,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, "刪除電話卡聯絡人"))
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
            const data = await TelCardService.createTelCardLog(
                req.body as any,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, "建立住宿生電話卡紀錄", 201))
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
            const data = await TelCardService.deleteTelCardLog(
                req.params.id,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, "刪除住宿生電話卡紀錄"))
        } catch (error: any) {
            next(error)
        }
    }
})()
