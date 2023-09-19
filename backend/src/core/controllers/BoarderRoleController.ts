import { NextFunction } from "express"
import { IRequest, IResponse } from "../../core/interfaces/IHttp"
import BoarderService from "../services/BoarderService"
import HttpResponse from "../../utils/httpResponse"
import Db from "../../models"
import RequestUser from "../exportDtos/auth/RequestUser"
import route from "../../utils/route"

export default new (class BoarderRoleController {
    public async getBoarderRoles(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await BoarderService.getBoarderRoles(req.query as any)
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async getBoarderRoleById(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await BoarderService.getBoarderRoleById(req.params.id)
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async createBoarderRole(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await BoarderService.createBoarderRole(
                req.body as any,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, "建立住宿生角色", 201))
        } catch (error: any) {
            next(error)
        }
    }

    public async updateBoarderRole(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await BoarderService.updateBoarderRole(
                req.body as any,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, "修改住宿生角色"))
        } catch (error: any) {
            next(error)
        }
    }

    public async deleteBoarderRole(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await BoarderService.deleteBoarderRole(
                req.params.id,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, "刪除住宿生角色"))
        } catch (error: any) {
            next(error)
        }
    }
})()
