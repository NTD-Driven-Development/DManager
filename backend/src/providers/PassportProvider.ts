import _ from "lodash"
import { Express, Request } from "express"
import IProvider from "./IProvider"
import Passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt"
import config from "../configs/passport"
import RequestUser from "../core/viewModels/auth/RequestUser"
import AuthService from "../core/services/AuthService"
import strings from "../utils/strings"

class PassportProvider implements IProvider {
    app: Express

    constructor(expressApp: Express) {
        this.app = expressApp
    }

    addLocalStrategy = () => {
        const options = config.local
        Passport.use(
            new LocalStrategy(
                options,
                async (email: string, password: string, done) => {
                    const user = await AuthService.getUserInfoByEmail(email)
                    if (
                        _.isEmpty(user) ||
                        strings.verifyHash(password, user.password) == false
                    ) {
                        return done(
                            { status: 400, message: "帳號或密碼輸入錯誤" },
                            false
                        )
                    }

                    if (user.is_actived == false) {
                        return done(
                            { status: 400, message: "帳號已停用" },
                            false
                        )
                    }

                    if (user.is_admin == true) {
                        if (process.env.NODE_ENV == "production"){
                            return done(
                                { status: 400, message: "帳號或密碼輸入錯誤" },
                                false
                            )
                        }
                    }
                    return done(null, user)
                }
            )
        )
    }

    addJwtStrategy = () => {
        // Add JwtStrategy
        const options = {
            jwtFromRequest: (req: Request) =>
                ExtractJwt.fromAuthHeaderAsBearerToken()(req) ||
                ExtractJwt.fromUrlQueryParameter("jwt")(req),
            authScheme: "Bearer",
            ...config.jwt,
        }
        // const options = {
        //     jwtFromRequest: (req) =>
        //         req.cookies && req.cookies.access_token,
        //     ...config.jwt,
        // };
        Passport.use(
            new JwtStrategy(options, async (jwtPayload: RequestUser, done) => {
                return done(null, jwtPayload)
            })
        )
    }

    boot() {
        this.addLocalStrategy()
        this.addJwtStrategy()
        this.app.use(Passport.initialize())
    }
}

export default PassportProvider
