import { NextFunction } from "express"
import { IRequest, IResponse } from "../../core/interfaces/IHttp"
import ProjectService from "../services/ProjectService"
import HttpResponse from "../../utils/httpResponse"
import Db from "../../models"
import { Transaction } from "sequelize"
import RequestUser from "../exportDtos/auth/RequestUser"
import route from "../../utils/route"

export default new (class ProjectController {
    public async getProjects(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const query = req.query
            const data = await ProjectService.getProjects(query as any)
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async getProjectById(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const id = req.params.id
            const data = await ProjectService.getProjectById(id)
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async createProject(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await ProjectService.createProject(
                req.body,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, "建立項目", 201))
        } catch (error: any) {
            next(error)
        }
    }

    public async updateProject(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            await Db.sequelize.transaction(async (t: Transaction) => {
                const data = await ProjectService.updateProject(
                    req.body,
                    req.user as RequestUser
                )
                t.afterCommit(() => {
                    next(HttpResponse.success(data, "修改項目"))
                })
            })
        } catch (error: any) {
            next(error)
        }
    }

    public async deleteProject(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            await Db.sequelize.transaction(async (t: Transaction) => {
                const data = await ProjectService.deleteProject(
                    req.params.id,
                    req.user as RequestUser
                )
                t.afterCommit(() => {
                    next(HttpResponse.success(data, "刪除項目"))
                })
            })
        } catch (error: any) {
            next(error)
        }
    }

    public async importBoardersData(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            await Db.sequelize.transaction(async (t: Transaction) => {
                const data = await ProjectService.importBoardersData(
                    req.body,
                    req.user as RequestUser
                )
                t.afterCommit(() => {
                    next(HttpResponse.success(data, "匯入項目"))
                })
            })
        } catch (error: any) {
            next(error)
        }
    }

    public async swapBunk(req: IRequest, res: IResponse, next: NextFunction) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const project_id = req.params.id
            await Db.sequelize.transaction(async (t: Transaction) => {
                const data = await ProjectService.swapBunk(
                    project_id as any,
                    req.body,
                    req.user as RequestUser
                )
                t.afterCommit(() => {
                    next(HttpResponse.success(data, "交換床位"))
                })
            })
        } catch (error: any) {
            next(error)
        }
    }
})()
