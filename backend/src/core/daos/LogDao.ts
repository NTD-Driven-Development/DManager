import Db from "../../models"
import { Op } from "sequelize"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import SysLog from "../../models/SysLog"
import SysErrorLog from "../../models/SysErrorLog"
import SysAuthLog from "../../models/SysAuthLog"
import SysLoginLog from "../../models/SysLoginLog"

export default new (class LogDao extends BaseDao {
    public async saveSysLog(log: SysLog): Promise<SysLog> {
        log.created_at = moment().toDate()
        return await Db.sys_log.create(log)
    }

    public async saveSysErrorLog(log: SysErrorLog): Promise<SysErrorLog> {
        log.created_at = moment().toDate()
        return await Db.sys_error_log.create(log)
    }

    public async saveSysAuthLog(log: SysAuthLog): Promise<SysAuthLog> {
        log.created_at = moment().toDate()
        return await Db.sys_auth_log.create(log)
    }

    public async saveSysLoginLog(log: SysLoginLog): Promise<SysLoginLog> {
        log.created_at = moment().toDate()
        return await Db.sys_login_log.create(log)
    }

    public async findSysAuthLogByRefreshtoken(refresh_token: string): Promise<SysAuthLog> {
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
