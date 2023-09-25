import { NextFunction } from "express"
import ClassService from "../services/ClassService"
import HttpResponse from "../../utils/httpResponse"
import Db from "../../models"
import RequestUser from "../exportDtos/auth/RequestUser"
import { IRequest, IResponse } from "../interfaces/IHttp"
import route from "../../utils/route"

export default new (class ClassController {
    public async getClasses(req: IRequest, res: IResponse, next: NextFunction) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await ClassService.getClasses(req.query as any)
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async getClassById(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await ClassService.getClassById(req.params.id)
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async createClass(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await ClassService.createClass(
                req.body as any,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, "建立班級", 201))
        } catch (error: any) {
            next(error)
        }
    }

    public async updateClass(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await ClassService.updateClass(
                req.body as any,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, "修改班級"))
        } catch (error: any) {
            next(error)
        }
    }

    public async deleteClass(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await ClassService.deleteClass(
                req.params.id,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, "刪除班級"))
        } catch (error: any) {
            next(error)
        }
    }
})()
