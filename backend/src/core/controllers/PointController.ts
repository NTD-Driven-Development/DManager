import { NextFunction } from "express"
import { IRequest, IResponse } from "../../core/interfaces/IHttp"
import PointService from "../services/PointService"
import HttpResponse from "../../utils/httpResponse"
import Db from "../../models"
import RequestUser from "../exportDtos/auth/RequestUser"
import route from "../../utils/route"

export default new (class PointController {
    public async getPointRules(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await PointService.getPointRules(req.query as any)
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async getPointRuleById(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await PointService.getPointRuleById(req.params.id)
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async createPointRule(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await PointService.createPointRule(
                req.body as any,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, "建立加扣點規則", 201))
        } catch (error: any) {
            next(error)
        }
    }

    public async updatePointRule(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await PointService.updatePointRule(
                req.body as any,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, "修改加扣點規則"))
        } catch (error: any) {
            next(error)
        }
    }

    public async deletePointRule(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await PointService.deletePointRule(
                req.params.id,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, "刪除加扣點規則"))
        } catch (error: any) {
            next(error)
        }
    }

    public async getPointLogs(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await PointService.getPointLogs(req.query as any)
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async getPointLogById(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await PointService.getPointLogById(req.params.id)
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async createPointLog(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await PointService.createPointLog(
                req.body as any,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, "建立住宿生加扣點紀錄", 201))
        } catch (error: any) {
            next(error)
        }
    }

    public async deletePointLog(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await PointService.deletePointLog(
                req.params.id,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, "刪除住宿生加扣點紀錄"))
        } catch (error: any) {
            next(error)
        }
    }
})()
