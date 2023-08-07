import { Request, Response, NextFunction } from "express"
import AuthService from "../services/AuthService"
import HttpResponse from "../../utils/httpResponse"
import RequestUser from "../viewModels/auth/RequestUser"
import UserModel from "../../models/User"
import db from "../../models"

export default new (class AuthController {
    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            // set transaction
            await db.sequelize.transaction(async (t: any) => {
                const user = req.user as UserModel
                const data = await AuthService.login(user, req, res)
                const response: HttpResponse = HttpResponse.success(data)
                return res.status(response.statusCode).json(response)
            })
        } catch (error) {
            next(error)
        }
    }

    public async logout(req: Request, res: Response, next: NextFunction) {
        try {
            await AuthService.logout(res)
            const response: HttpResponse = HttpResponse.success(null)
            return res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    }

    public async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            // set transaction
            await db.sequelize.transaction(async (t: any) => {
                const data = await AuthService.refreshToken(req, res)
                const response: HttpResponse = HttpResponse.success(data)
                return res.status(response.statusCode).json(response)
            })
        } catch (error) {
            next(error)
        }
    }

    public async healthCheck(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user as RequestUser
            const data = AuthService.getUserAuthInfoById(user.id as number)
            const response: HttpResponse = HttpResponse.success(data)
            return res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    }
})()
