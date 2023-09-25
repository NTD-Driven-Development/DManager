import LogService from "../core/services/LogService"
import Db from "../models"
import { Transaction } from "sequelize"
import routeUtil from "../utils/route"
import _ from "lodash"
import { IRequest, IResponse } from "../core/interfaces/IHttp"
import { NextFunction } from "express"

// 紀錄系統日誌
export default async (req: IRequest, res: IResponse, next: NextFunction) => {
    try {
        // block bot request
        // const bool = req.headers['user-agent']?.includes('axios') ||
        //     req.headers['user-agent']?.includes('PostmanRuntime') ||
        //     req.headers['user-agent']?.includes('Apache-HttpClient') ||
        //     req.headers['user-agent']?.includes('okhttp');
        // if (bool) {
        //     return next();
        // }
        const afterResponse = async () => {
            const { method } = req
            // 取得當前路由的完整路徑
            const full_path = routeUtil.getApiRouteFullPathFromRequest(req)
            switch (true) {
                // 設定不紀錄的路由
                case _.eq(method, "POST") &&
                    _.startsWith(full_path, "/api/auth/refresh"):
                case _.eq(method, "POST") &&
                    _.startsWith(full_path, "/api/auth/login"):
                case _.eq(method, "POST") &&
                    _.startsWith(full_path, "/api/auth/logout"):
                case _.eq(method, "POST") &&
                    _.startsWith(full_path, "/api/auth/changePassword"):
                case _.eq(method, "POST") &&
                    _.startsWith(full_path, "/api/auth/resetPassword"):
                case _.eq(method, "GET"):
                case res.statusCode != 200 && res.statusCode != 201:
                    return
                default:
                    // remove listener
                    res.removeListener("finish", afterResponse)
                    res.removeListener("close", afterResponse)
                    await Db.sequelize.transaction(
                        {
                            // 避免 insert Deadlock
                            isolationLevel:
                                Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
                        },
                        async (t: Transaction) => {
                            req.params = routeUtil.getUrlParams(
                                req.originalUrl,
                                req.routeUrl as string
                            )
                            await LogService.saveSysLog(
                                req,
                                res.statusCode,
                                res?.customMessage
                            )
                        }
                    )
            }
        }

        res.on("finish", afterResponse)
        res.on("close", afterResponse)
        return next()
    } catch (error: any) {
        console.log(error.message)
        return next()
    }
}
