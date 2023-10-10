import _ from "lodash"
import { NextFunction } from "express"
import Passport from "passport"
import HttpException from "../exceptions/HttpException"
import { UserModel } from "../models/User"
import RequestUser from "../core/exportDtos/auth/RequestUser"
import { IRequest, IResponse } from "../core/interfaces/IHttp"

const jwtAuth = (type: string) => {
    switch (_.toLower(type)) {
        case "local":
            return (req: IRequest, res: IResponse, next: NextFunction) => {
                Passport.authenticate(
                    "local",
                    { session: false },
                    async (
                        err: { status: number; message: string },
                        user: UserModel
                    ) => {
                        try {
                            if (err || !user) {
                                throw new HttpException(
                                    err?.message,
                                    err?.status ?? 502
                                )
                            }
                            req.user = user as any
                            next()
                        } catch (error: any) {
                            return next(error)
                        }
                    }
                )(req, res, next)
            }
        case "jwt":
            return (req: IRequest, res: IResponse, next: NextFunction) => {
                Passport.authenticate(
                    "jwt",
                    { session: false },
                    (err: any, user: RequestUser) => {
                        try {
                            if (err || !user) {
                                throw new HttpException("權限已過期，請重新登入", 401)
                            }
                            req.user = user
                            return next()
                        } catch (err) {
                            return next(err)
                        }
                    }
                )(req, res, next)
            }
        default:
            console.error(`Middlewares.auth : Unknow auth type ${type}`) // eslint-disable-line no-console
            return (req: IRequest, res: IResponse, next: NextFunction) => {
                return next()
            }
    }
}

export default jwtAuth
