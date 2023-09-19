import { NextFunction } from "express"
import { IRequest, IResponse } from "../../core/interfaces/IHttp"
import UserService from "../services/UserService"
import HttpResponse from "../../utils/httpResponse"
import Db from "../../models"
import { Transaction } from "sequelize"
import RequestUser from "../exportDtos/auth/RequestUser"
import route from "../../utils/route"

export default new (class UserController {
    public async getUsers(req: IRequest, res: IResponse, next: NextFunction) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await UserService.getUsers(req.query as any)
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async getUserById(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await UserService.getUserById(req.params.id)
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async createUser(req: IRequest, res: IResponse, next: NextFunction) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            await Db.sequelize.transaction(async (t: Transaction) => {
                const data = await UserService.createUser(
                    req.body,
                    req.user as RequestUser
                )
                t.afterCommit(() => {
                    next(HttpResponse.success(data, "建立使用者", 201))
                })
            })
        } catch (error: any) {
            next(error)
        }
    }

    public async updateUser(req: IRequest, res: IResponse, next: NextFunction) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            await Db.sequelize.transaction(async (t: Transaction) => {
                const data = await UserService.updateUser(
                    req.body,
                    req.user as RequestUser
                )
                t.afterCommit(() => {
                    next(HttpResponse.success(data, "修改使用者"))
                })
            })
        } catch (error: any) {
            next(error)
        }
    }

    public async deleteUser(req: IRequest, res: IResponse, next: NextFunction) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            await Db.sequelize.transaction(async (t: Transaction) => {
                await UserService.deleteUser(
                    req.params.id,
                    req.user as RequestUser
                )
                t.afterCommit(() => {
                    next(HttpResponse.success(null, "刪除使用者"))
                })
            })
        } catch (error: any) {
            next(error)
        }
    }

    public async createUserDuty(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            await Db.sequelize.transaction(async (t: Transaction) => {
                const data = await UserService.createUserDuty(
                    req.body,
                    req.user as RequestUser
                )
                t.afterCommit(() => {
                    next(HttpResponse.success(data, "建立輪值", 201))
                })
            })
        } catch (error: any) {
            console.log(error)
            next(error)
        }
    }

    public async updateUserDuty(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            await Db.sequelize.transaction(async (t: Transaction) => {
                const data = await UserService.updateUserDuty(
                    req.body,
                    req.user as RequestUser
                )
                t.afterCommit(() => {
                    next(HttpResponse.success(data, "修改輪值"))
                })
            })
        } catch (error: any) {
            next(error)
        }
    }

    public async deleteUserDuty(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            await Db.sequelize.transaction(async (t: Transaction) => {
                await UserService.deleteUserDuty(
                    req.params.id,
                    req.user as RequestUser
                )
                t.afterCommit(() => {
                    next(HttpResponse.success(null, "刪除輪值"))
                })
            })
        } catch (error: any) {
            next(error)
        }
    }

    public async getUserDuties(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await UserService.getUserDuties(req.query as any)
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async getUserDutyById(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await UserService.getUserDutyById(req.params.id)
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }
})()
