import _ from "lodash"
import { Request, Response } from "express"
import AuthDao from "../daos/AuthDao"
import LogDao from "../daos/LogDao"
import RequestUser from "../viewModels/auth/RequestUser"
import AuthResult from "../viewModels/auth/AuthResult"
import UserModel from "../../models/User"
import jwt from "jsonwebtoken"
import { v4 } from "uuid"
import strings from "../../utils/strings"
import SysAuthLog from "../../models/SysAuthLog"
import RefreshTokenType from "../../enumerates/RefreshTokenType"
import moment from "moment"
import ip from "../../utils/ip"
import HttpException from "../../exceptions/HttpException"

export default new (class AuthService {
    public async getUserAuthInfoByAccount(
        account: string
    ): Promise<RequestUser> {
        const user = await AuthDao.getUserAuthInfoByAccount(account)
        const roles = _.map(user?.roles, (role) => {
            return { id: role.id, name: role.name }
        })
        const permissions = _.map(user?.roles, (role) => {
            return _.map(role.permissions, (permission) => {
                return {
                    id: permission.id,
                    path: permission.path,
                    method: permission.method,
                }
            })
        })
        const requestUser: RequestUser = {
            id: user.id,
            name: user.name,
            is_admin: user.is_admin,
            is_active: user.is_active,
            roles: roles,
            permissions: _.uniqWith(_.flatten(permissions), _.isEqual),
        }
        return requestUser
    }

    public async getUserAuthInfoById(
        id: number
    ): Promise<RequestUser> {
        const user = await AuthDao.getUserAuthInfoById(id)
        const roles = _.map(user?.roles, (role) => {
            return { id: role.id, name: role.name }
        })
        const permissions = _.map(user?.roles, (role) => {
            return _.map(role.permissions, (permission) => {
                return {
                    id: permission.id,
                    path: permission.path,
                    method: permission.method,
                }
            })
        })
        const requestUser: RequestUser = {
            id: user.id,
            name: user.name,
            is_admin: user.is_admin,
            is_active: user.is_active,
            roles: roles,
            permissions: _.uniqWith(_.flatten(permissions), _.isEqual),
        }
        return requestUser
    }

    public async getUserInfoByAccount(account: string): Promise<UserModel> {
        const user = await AuthDao.getUserInfoByAccount(account)
        return user
    }

    private async signJwtByAccount(account: string): Promise<string> {
        const user = await this.getUserAuthInfoByAccount(account)
        const access_token = jwt.sign(user, process.env.AUTH_SECRET as string, {
            expiresIn: process.env.AUTH_ACCESS_EXPIRESIN,
        })
        return access_token
    }

    private async signJwtById(id: number): Promise<string> {
        const user = await this.getUserAuthInfoById(id)
        const access_token = jwt.sign(user, process.env.AUTH_SECRET as string, {
            expiresIn: process.env.AUTH_ACCESS_EXPIRESIN,
        })
        return access_token
    }

    private async setRefreshToken(
        user_id: number,
        refreshTokenType: string,
        req: Request
    ): Promise<string> {
        const refresh_token = v4()
        const clientip = ip.getClientIp(req)
        const serverip = ip.getServerIp()
        const user_agent = req.headers["user-agent"] as string
        const model: SysAuthLog = {
            type: refreshTokenType,
            clientip: clientip,
            serverip: serverip,
            user_agent: user_agent,
            user_id: user_id,
            refresh_token: refresh_token,
            refresh_expired_at: moment()
                .add(
                    process.env.AUTH_REFRESH_EXPIRESIN_SEC as string,
                    "seconds"
                )
                .toDate(),
            status: true,
            detail: refreshTokenType + "成功",
            created_at: moment().toDate(),
        }
        await LogDao.saveSysAuthLog(model)
        return refresh_token
    }

    private async setRefreshTokenCookie(res: Response, refresh_token: string) {
        res.cookie("refresh_token", refresh_token, {
            maxAge:
                parseInt(process.env.AUTH_REFRESH_EXPIRESIN_SEC as string) *
                1000,
            httpOnly: true,
            sameSite: "strict",
            // secure: process.env.NODE_ENV == 'production' ? true : false,
        })
    }

    public async login(
        user: RequestUser,
        req: Request,
        res: Response
    ): Promise<AuthResult> {
        const access_token = await this.signJwtByAccount(user.account as string)
        const refresh_token = await this.setRefreshToken(
            user.id as number,
            RefreshTokenType.登入,
            req
        )
        await this.setRefreshTokenCookie(res, refresh_token)
        return {
            access_token: "Bearer " + access_token,
        }
    }

    public async logout(res: Response): Promise<void> {
        res.clearCookie("refresh_token")
    }

    private async vertifyJWTToken(
        access_token: string
    ): Promise<RequestUser | string> {
        try {
            const decoded = jwt.verify(
                access_token,
                process.env.AUTH_SECRET as string
            )
            return decoded as RequestUser
        } catch (error: any) {
            if (error.name === "TokenExpiredError") {
                return "Token已過期"
            }
            return "驗證失敗"
        }
    }

    public async refreshToken(req: Request, res: Response): Promise<AuthResult> {
        const access_token = _.split(
            req.headers?.authorization as string,
            " "
        )[1] as string
        const refresh_token = req.cookies?.refresh_token as string
        // if token is empty
        if (_.isEmpty(access_token) || _.isEmpty(refresh_token))
            throw new HttpException("請重新登入", 401)
        // if jwttoken is invalid
        const decoded = await this.vertifyJWTToken(access_token)
        if (typeof decoded === "string" && decoded === "驗證失敗") {
            throw new HttpException(decoded, 401)
        }
        const authLog = await LogDao.findSysAuthLogByRefreshtoken(refresh_token)
        // if refreshtoken is not found or expired
        if (_.isEmpty(authLog)) {
            throw new HttpException("請重新登入", 401)
        }

        const access_token_new = await this.signJwtById(authLog.user_id as number)
        const refresh_token_new = await this.setRefreshToken(
            authLog.user_id as number,
            RefreshTokenType.刷新,
            req
        )
        await this.setRefreshTokenCookie(res, refresh_token_new)
        return {
            access_token: "Bearer " + access_token_new,
        }
    }
})()
