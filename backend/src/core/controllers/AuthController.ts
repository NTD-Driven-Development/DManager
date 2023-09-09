import { Request, Response, NextFunction } from "express"
import AuthService from "../services/AuthService"
import HttpResponse from "../../utils/httpResponse"
import RequestUser from "../exportDtos/auth/RequestUser"
import { UserModel } from "../../models/User"
import Db from "../../models"
import { Transaction } from "sequelize"

export default new (class AuthController {
    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            // set transaction
            await Db.sequelize.transaction(async (t: Transaction) => {
                const user = req.user as UserModel
                const data = await AuthService.login(user, req, res)
                t.afterCommit(() => {
                    next(HttpResponse.success(data))
                })
            })
        } catch (error) {
            next(error)
        }
    }

    public async logout(req: Request, res: Response, next: NextFunction) {
        try {
            await AuthService.logout(res)
            next(HttpResponse.success(null))
        } catch (error) {
            next(error)
        }
    }

    public async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            // set transaction
            await Db.sequelize.transaction(async (t: Transaction) => {
                const data = await AuthService.refreshToken(req, res)
                t.afterCommit(() => {
                    next(HttpResponse.success(data))
                })
            })
        } catch (error) {
            next(error)
        }
    }

    public async healthCheck(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user as RequestUser
            const data = await AuthService.getUserAuthInfoById(
                user.id as number
            )
            next(HttpResponse.success(data))
        } catch (error) {
            next(error)
        }
    }

    public async forgetPassword(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { email } = req.body
            await Db.sequelize.transaction(async (t: Transaction) => {
                await AuthService.forgetPassword(req, email)
                t.afterCommit(() => {
                    next(HttpResponse.success("已寄送重設密碼信件至您的信箱"))
                })
            })
        } catch (error) {
            next(error)
        }
    }

    public async verifyForgetPasswordToken(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { email, token } = req.body
            const verified_token = await AuthService.verifyForgetPasswordToken(
                email,
                token
            )
            res.cookie("forget_password_token", verified_token, {
                maxAge: 86400000,
                httpOnly: true,
                sameSite: "strict",
            })
            next(HttpResponse.success(null))
        } catch (error) {
            next(error)
        }
    }

    public async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { password } = req.body
            const forget_password_token = req.cookies.forget_password_token
            await Db.sequelize.transaction(async (t: Transaction) => {
                await AuthService.resetPassword(
                    req,
                    password,
                    forget_password_token
                )
                t.afterCommit(() => {
                    next(HttpResponse.success(null))
                    res.clearCookie("forget_password_token")
                })
            })
        } catch (error) {
            next(error)
        }
    }

    public async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { old_password, new_password } = req.body
            const { email } = req.user as RequestUser
            await Db.sequelize.transaction(async (t: Transaction) => {
                await AuthService.changePassword(
                    req,
                    email,
                    old_password,
                    new_password
                )
                t.afterCommit(() => {
                    next(HttpResponse.success(null))
                })
            })
        } catch (error) {
            next(error)
        }
    }
})()
