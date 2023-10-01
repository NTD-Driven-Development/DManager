import { NextFunction } from "express"
import { IRequest, IResponse } from "../../core/interfaces/IHttp"
import ProjectService from "../services/ProjectService"
import HttpResponse from "../../utils/httpResponse"
import Db from "../../models"
import { Transaction } from "sequelize"
import RequestUser from "../exportDtos/auth/RequestUser"
import route from "../../utils/route"
import log from "../../utils/log"

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
            res.operationName = "建立項目"
            const data = await ProjectService.createProject(
                req.body,
                req.user as RequestUser
            )
            res.logMessage = log.logFormatJson(res.operationName, data)
            next(HttpResponse.success(data, null, 201))
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
            res.operationName = "修改項目"
            await Db.sequelize.transaction(async (t: Transaction) => {
                const beforeUpdateData = await ProjectService.getProjectById(
                    req.body?.id
                )
                const data = await ProjectService.updateProject(
                    req.body,
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

    public async deleteProject(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            res.operationName = "刪除項目"
            await Db.sequelize.transaction(async (t: Transaction) => {
                const beforeDeleteData = await ProjectService.getProjectById(
                    req.params.id
                )
                const data = await ProjectService.deleteProject(
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

    public async importBoardersData(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            res.operationName = "匯入項目"
            await Db.sequelize.transaction(async (t: Transaction) => {
                const beforeImportData = await ProjectService.getProjectById(
                    req.body?.project_id
                )
                const data = await ProjectService.importBoardersData(
                    req.body,
                    req.user as RequestUser
                )
                t.afterCommit(() => {
                    res.logMessage = log.logFormatJson(
                        res.operationName,
                        beforeImportData
                    )
                    next(HttpResponse.success(data))
                })
            })
        } catch (error: any) {
            next(error)
        }
    }

    public async swapBunk(req: IRequest, res: IResponse, next: NextFunction) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            res.operationName = "交換床位"
            const project_id = req.params.id
            await Db.sequelize.transaction(async (t: Transaction) => {
                const beforeSwapData =
                    await ProjectService.getSwapBunkBoardersEventMessage({
                        project_id,
                        ...req.body,
                    })
                const data = await ProjectService.swapBunk(
                    project_id as any,
                    req.body,
                    req.user as RequestUser
                )
                t.afterCommit(() => {
                    res.logMessage = log.logFormatJson(
                        res.operationName,
                        beforeSwapData
                    )
                    next(HttpResponse.success(data))
                })
            })
        } catch (error: any) {
            next(error)
        }
    }
})()
