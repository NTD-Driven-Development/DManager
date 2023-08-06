import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import Passport from "passport"
import HttpException from "../exceptions/HttpException"
import UserModel from "../models/User"
import RequestUser from "../core/viewModels/auth/RequestUser"

const jwtAuth = (type: string) => {
    switch (_.toLower(type)) {
        case "local":
            return (req: Request, res: Response, next: NextFunction) => {
                Passport.authenticate(
                    "local",
                    { session: false },
                    async (err: any, user: UserModel) => {
                        try {
                            if (err || !user) {
                                throw new HttpException(err.message, err.status)
                            }
                            req.user = user
                            next()
                        } catch (error) {
                            return next(error)
                        }
                    }
                )(req, res, next)
            }
        case "jwt":
            return (req: Request, res: Response, next: NextFunction) => {
                Passport.authenticate(
                    "jwt",
                    { session: false },
                    (err: any, user: RequestUser) => {
                        try {
                            if (err || _.isEmpty(user)) {
                                throw new HttpException("請重新登入", 401)
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
            return (req: Request, res: Response, next: NextFunction) => {
                return next()
            }
    }
}

export default jwtAuth
