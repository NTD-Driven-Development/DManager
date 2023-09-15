import { Request, Response, NextFunction } from "express"
import UserService from "../services/UserService"
import HttpResponse from "../../utils/httpResponse"
import Db from "../../models"
import { Transaction } from "sequelize"
import RequestUser from "../exportDtos/auth/RequestUser"

export default new (class UserController {
    public async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await UserService.getUsers(req.query as any)
            next(HttpResponse.success(data))
        } catch (error) {
            next(error)
        }
    }

    public async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await UserService.getUserById(req.params.id)
            next(HttpResponse.success(data))
        } catch (error) {
            next(error)
        }
    }

    public async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            await Db.sequelize.transaction(async (t: Transaction) => {
                const data = await UserService.createUser(
                    req.body,
                    req.user as RequestUser
                )
                t.afterCommit(() => {
                    next(HttpResponse.success(data, 201))
                })
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    public async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            await Db.sequelize.transaction(async (t: Transaction) => {
                const data = await UserService.updateUser(
                    req.body,
                    req.user as RequestUser
                )
                t.afterCommit(() => {
                    next(HttpResponse.success(data))
                })
            })
        } catch (error) {
            next(error)
        }
    }

    public async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            await Db.sequelize.transaction(async (t: Transaction) => {
                await UserService.deleteUser(
                    req.params.id,
                    req.user as RequestUser
                )
                t.afterCommit(() => {
                    next(HttpResponse.success(null, 200))
                })
            })
        } catch (error) {
            next(error)
        }
    }

    public async createUserDuty(req: Request, res: Response, next: NextFunction) {
        try {
            await Db.sequelize.transaction(async (t: Transaction) => {
                const data = await UserService.createUserDuty(
                    req.body,
                    req.user as RequestUser
                )
                t.afterCommit(() => {
                    next(HttpResponse.success(data, 201))
                })
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    public async updateUserDuty(req: Request, res: Response, next: NextFunction) {
        try {
            await Db.sequelize.transaction(async (t: Transaction) => {
                const data = await UserService.updateUserDuty(
                    req.body,
                    req.user as RequestUser
                )
                t.afterCommit(() => {
                    next(HttpResponse.success(data))
                })
            })
        } catch (error) {
            next(error)
        }
    }

    public async deleteUserDuty(req: Request, res: Response, next: NextFunction) {
        try {
            await Db.sequelize.transaction(async (t: Transaction) => {
                await UserService.deleteUserDuty(
                    req.params.id,
                    req.user as RequestUser
                )
                t.afterCommit(() => {
                    next(HttpResponse.success(null, 200))
                })
            })
        } catch (error) {
            next(error)
        }
    }

    public async getUserDuties(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await UserService.getUserDuties(req.query as any)
            next(HttpResponse.success(data))
        } catch (error) {
            next(error)
        }
    }

    public async getUserDutyById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await UserService.getUserDutyById(req.params.id)
            next(HttpResponse.success(data))
        } catch (error) {
            next(error)
        }
    }
})()
