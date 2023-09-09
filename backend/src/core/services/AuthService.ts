import _ from "lodash"
import { Request, Response } from "express"
import AuthDao from "../daos/AuthDao"
import LogDao from "../daos/LogDao"
import RequestUser from "../exportDtos/auth/RequestUser"
import AuthResult from "../exportDtos/auth/AuthResult"
import { UserModel } from "../../models/User"
import { SysAuthLogModel } from "../../models/SysAuthLog"
import jwt from "jsonwebtoken"
import { v4 } from "uuid"
import RefreshTokenType from "../../enumerates/RefreshTokenType"
import moment from "moment"
import ip from "../../utils/ip"
import HttpException from "../../exceptions/HttpException"
import strings from "../../utils/strings"
import mail from "../../utils/sendMail"
import { SysPasswordLogModel } from "../../models/SysPasswordLog"

export default new (class AuthService {
    public async changePassword(
        req: Request,
        email: string,
        old_password: string,
        new_password: string
    ) {
        const user = await AuthDao.getUserInfoByEmail(email)
        if (_.isEmpty(user)) {
            throw new HttpException("查無此帳號", 400)
        }
        if (strings.verifyHash(old_password, user.password) === false) {
            throw new HttpException("舊密碼錯誤", 400)
        }
        const hashedNewPassword = strings.hash(new_password)
        await AuthDao.updateUserPasswordByEmail(email, hashedNewPassword)
        await this.savingSysPasswordLog(req, { email } as any, "修改密碼成功")
        return true
    }

    private async savingSysPasswordLog(
        req: Request,
        { ...arg }: SysPasswordLogModel,
        message: string
    ) {
        const clientip = ip.getClientIp(req)
        const serverip = ip.getServerIp()
        const user_agent = req.headers["user-agent"] as string
        const model: SysPasswordLogModel = {
            clientip: clientip,
            serverip: serverip,
            user_agent: user_agent,
            email: arg?.email,
            expired_at: arg?.expired_at,
            token: arg?.token,
            verified_token: arg?.verified_token,
            verified_at: arg?.verified_at,
            detail: message,
        }
        await LogDao.saveSysPasswordLog(model)
    }

    public async resetPassword(req: Request, token: string, password: string) {
        const sysPasswordLog = await LogDao.findSysPasswordLogByVerifiedToken(
            token
        )
        if (_.isEmpty(sysPasswordLog)) {
            throw new HttpException("傳送資料錯誤", 400)
        }
        const hashedPassword = strings.hash(password)
        await AuthDao.updateUserPasswordByEmail(
            sysPasswordLog.email,
            hashedPassword
        )
        await this.savingSysPasswordLog(
            req,
            { email: sysPasswordLog.email } as any,
            "重設密碼成功"
        )
        return true
    }

    public async verifyForgetPasswordToken(email: string, token: string) {
        const sysPasswordLog = await LogDao.findSysPasswordLogByEmail(email)
        if (sysPasswordLog?.token !== token) {
            throw new HttpException("驗證碼錯誤", 400)
        }
        const verified_token = v4()
        const model: SysPasswordLogModel = {
            ...sysPasswordLog,
            verified_token: verified_token,
            verified_at: moment().toDate(),
        }
        await LogDao.updateSysPasswordLog(model)
        return verified_token
    }

    public async forgetPassword(req: Request, email: string) {
        // const sysPasswordLog = await LogDao.findSysPasswordLogByEmail(email)
        const user = await AuthDao.getUserInfoByEmail(email)
        if (_.isEmpty(user)) {
            throw new HttpException("查無此帳號", 400)
        }
        const expired_at = moment().add(10, "minutes").toDate()
        const token = strings.random(8, null)
        await this.savingSysPasswordLog(
            req,
            { email: email, expired_at: expired_at, token: token } as any,
            "忘記密碼"
        )
        const subject = "忘記密碼"
        const content = `您的驗證碼為 ${token}，請於 10 分鐘內使用`
        await mail.sendEmail(email, subject, content)
        return true
    }

    public async getUserAuthInfoByEmail(email: string): Promise<RequestUser> {
        const user = await AuthDao.getUserAuthInfoByEmail(email)
        const roles = _.map(user?.roles, (role) => {
            return { id: role.id as number, name: role.name }
        })
        const permissions = _.map(user?.roles, (role) => {
            return _.map(role.permissions, (permission) => {
                return {
                    id: permission.id as number,
                    path: permission.path,
                    method: permission.method,
                }
            })
        })
        const requestUser: RequestUser = {
            id: user.id as number,
            name: user.name,
            email: user.email,
            is_admin: user.is_admin,
            is_actived: user.is_actived,
            roles: roles,
            permissions: _.uniqWith(_.flatten(permissions), _.isEqual),
        }
        return requestUser
    }

    public async getUserAuthInfoById(id: number): Promise<RequestUser> {
        const user = await AuthDao.getUserAuthInfoById(id)
        const roles = _.map(user?.roles, (role) => {
            return { id: role.id as number, name: role.name }
        })
        const permissions = _.map(user?.roles, (role) => {
            return _.map(role.permissions, (permission) => {
                return {
                    id: permission.id as number,
                    path: permission.path,
                    method: permission.method,
                }
            })
        })
        const requestUser: RequestUser = {
            id: user.id as number,
            name: user.name,
            email: user.email,
            is_admin: user.is_admin,
            is_actived: user.is_actived,
            roles: roles,
            permissions: _.uniqWith(_.flatten(permissions), _.isEqual),
        }
        return requestUser
    }

    public async getUserInfoByEmail(email: string): Promise<UserModel> {
        const user = await AuthDao.getUserInfoByEmail(email)
        return user
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
        const model: SysAuthLogModel = {
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
        user: UserModel,
        req: Request,
        res: Response
    ): Promise<AuthResult> {
        const userid = user.id as number
        const access_token = await this.signJwtById(userid)
        const refresh_token = await this.setRefreshToken(
            userid,
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

    public async refreshToken(
        req: Request,
        res: Response
    ): Promise<AuthResult> {
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

        const access_token_new = await this.signJwtById(
            authLog.user_id as number
        )
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
