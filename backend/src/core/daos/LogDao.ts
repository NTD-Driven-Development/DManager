import Db from "../../models"
import { Op } from "sequelize"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import { SysLogModel }from "../../models/SysLog"
import { SysErrorLogModel }from "../../models/SysErrorLog"
import { SysAuthLogModel }from "../../models/SysAuthLog"
import { SysLoginLogModel }from "../../models/SysLoginLog"

export default new (class LogDao extends BaseDao {
    public async saveSysLog(log: SysLogModel): Promise<SysLogModel> {
        return await Db.sys_log.create(log)
    }

    public async saveSysErrorLog(log: SysErrorLogModel): Promise<SysErrorLogModel> {
        return await Db.sys_error_log.create(log)
    }

    public async saveSysAuthLog(log: SysAuthLogModel): Promise<SysAuthLogModel> {
        return await Db.sys_auth_log.create(log)
    }

    public async saveSysLoginLog(log: SysLoginLogModel): Promise<SysLoginLogModel> {
        return await Db.sys_login_log.create(log)
    }

    public async findSysAuthLogByRefreshtoken(refresh_token: string): Promise<SysAuthLogModel> {
        return await Db.sys_auth_log.findOne({
            where: {
                refresh_token: refresh_token,
                refresh_expired_at: {
                    [Op.gt]: moment().toDate()
                }
            }
        })
    }
})()
