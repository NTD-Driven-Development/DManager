import { NextFunction } from "express"
import { IRequest, IResponse } from "../../core/interfaces/IHttp"
import ShareService from "../services/ShareService"
import HttpResponse from "../../utils/httpResponse"
import route from "../../utils/route"

export default new (class ShareController {
    public async getBunks(req: IRequest, res: IResponse, next: NextFunction) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await ShareService.getBunks()
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async getClasses(req: IRequest, res: IResponse, next: NextFunction) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await ShareService.getClasses()
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async getBoarderStatuses(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await ShareService.getBoarderStatuses()
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async getBoarderRoles(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const project_id = req.query?.project_id as string
            const data = await ShareService.getBoarderRoles(project_id)
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async getTelCardContacters(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await ShareService.getTelCardContacters()
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async getPointRules(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await ShareService.getPointRules()
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async getProjects(req: IRequest, res: IResponse, next: NextFunction) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await ShareService.getProjects()
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async getBoarders(req: IRequest, res: IResponse, next: NextFunction) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const project_id = req.query?.project_id as string
            const data = await ShareService.getBoarders(project_id)
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async getRoles(req: IRequest, res: IResponse, next: NextFunction) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await ShareService.getRoles()
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async getUsers(req: IRequest, res: IResponse, next: NextFunction) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await ShareService.getUsers()
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }
})()
