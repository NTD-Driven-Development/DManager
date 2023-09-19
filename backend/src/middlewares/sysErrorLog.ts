import LogService from "../core/services/LogService"
import Db from "../models"
import { Transaction } from "sequelize"
import _ from "lodash"
import { IRequest, IResponse } from "../core/interfaces/IHttp"
import { NextFunction } from "express"

// 紀錄系統日誌 (需注入至路由)
export default async (req: IRequest, res: IResponse, next: NextFunction) => {
    try {
        const afterResponse = async () => {
            if (res.statusCode >= 400) {
                // remove listener
                res.removeListener("finish", afterResponse)
                res.removeListener("close", afterResponse)
                console.log("sysErrorLog")
                await Db.sequelize.transaction(
                    {
                        // 避免 insert Deadlock
                        isolationLevel:
                            Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
                    },
                    async (t: Transaction) => {
                        await LogService.saveSysErrorLog(
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
