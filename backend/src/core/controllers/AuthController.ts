import { NextFunction } from "express"
import { IRequest, IResponse } from "../../core/interfaces/IHttp"
import AuthService from "../services/AuthService"
import HttpResponse from "../../utils/httpResponse"
import RequestUser from "../exportDtos/auth/RequestUser"
import { UserModel } from "../../models/User"
import Db from "../../models"
import { Transaction } from "sequelize"
import route from "../../utils/route"

const setRefreshToken = (res: IResponse, refresh_token: string) => {
    res.cookie("refresh_token", refresh_token, {
        maxAge:
            parseInt(process.env.AUTH_REFRESH_EXPIRESIN_SEC as string) * 1000,
        httpOnly: true,
        sameSite: "strict",
    })
}
export default new (class AuthController {
    public async login(req: IRequest, res: IResponse, next: NextFunction) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            // set transaction
            await Db.sequelize.transaction(async (t: Transaction) => {
                const user = req.user as any
                const result = await AuthService.login(user, req)
                t.afterCommit(() => {
                    setRefreshToken(res, result.refresh_token)
                    next(
                        HttpResponse.success(
                            {
                                access_token: result.access_token,
                            },
                            "登入"
                        )
                    )
                })
            })
        } catch (error: any) {
            next(error)
        }
    }

    public async logout(req: IRequest, res: IResponse, next: NextFunction) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            await AuthService.logout(res)
            next(HttpResponse.success(null, "登出"))
        } catch (error: any) {
            next(error)
        }
    }

    public async refreshToken(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            // set transaction
            await Db.sequelize.transaction(async (t: Transaction) => {
                const result = await AuthService.refreshToken(req, res)
                t.afterCommit(() => {
                    setRefreshToken(res, result.refresh_token)
                    next(
                        HttpResponse.success(
                            {
                                access_token: result.access_token,
                            },
                            "刷新 Token"
                        )
                    )
                })
            })
        } catch (error: any) {
            next(error)
        }
    }

    public async healthCheck(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const user = req.user as RequestUser
            const data = await AuthService.getUserAuthInfoById(
                user.id as number
            )
            next(HttpResponse.success(data, "權限檢查"))
        } catch (error: any) {
            next(error)
        }
    }

    public async forgetPassword(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const { email } = req.body
            await Db.sequelize.transaction(async (t: Transaction) => {
                await AuthService.forgetPassword(req, email)
                t.afterCommit(() => {
                    next(
                        HttpResponse.success(
                            "已寄送重設密碼信件至您的信箱",
                            "忘記密碼"
                        )
                    )
                })
            })
        } catch (error: any) {
            next(error)
        }
    }

    public async verifyForgetPasswordToken(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const { email, token } = req.body
            const verified_token = await AuthService.verifyForgetPasswordToken(
                email,
                token
            )
            res.cookie("forget_password_token", verified_token, {
                maxAge: 10 * 60 * 1000,
                httpOnly: true,
                sameSite: "strict",
            })
            next(HttpResponse.success(null, "忘記密碼驗證"))
        } catch (error: any) {
            next(error)
        }
    }

    public async resetPassword(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const { password } = req.body
            const forget_password_token = req.cookies
                ?.forget_password_token as string
            await Db.sequelize.transaction(async (t: Transaction) => {
                const result = await AuthService.resetPassword(
                    req,
                    forget_password_token,
                    password
                )
                t.afterCommit(() => {
                    setRefreshToken(res, result.refresh_token)
                    next(
                        HttpResponse.success(
                            {
                                access_token: result.access_token,
                            },
                            "重設密碼"
                        )
                    )
                    res.clearCookie("forget_password_token")
                })
            })
        } catch (error: any) {
            next(error)
        }
    }

    public async changePassword(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
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
                    next(HttpResponse.success(null, "修改密碼"))
                })
            })
        } catch (error: any) {
            next(error)
        }
    }
})()
