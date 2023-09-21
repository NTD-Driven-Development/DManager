import Db from "../../models"
import { Op } from "sequelize"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import { SysLogModel } from "../../models/SysLog"
import { SysErrorLogModel } from "../../models/SysErrorLog"
import { SysAuthLogModel } from "../../models/SysAuthLog"
import { SysLoginLogModel } from "../../models/SysLoginLog"
import { SysPasswordLogModel } from "../../models/SysPasswordLog"

export default new (class LogDao extends BaseDao {
    public async saveSysLog(log: SysLogModel): Promise<SysLogModel> {
        return await Db.sys_log.create(log)
    }

    public async saveSysErrorLog(
        log: SysErrorLogModel
    ): Promise<SysErrorLogModel> {
        return await Db.sys_error_log.create(log)
    }

    public async saveSysAuthLog(
        log: SysAuthLogModel
    ): Promise<SysAuthLogModel> {
        return await Db.sys_auth_log.create(log)
    }

    public async saveSysLoginLog(
        log: SysLoginLogModel
    ): Promise<SysLoginLogModel> {
        return await Db.sys_login_log.create(log)
    }

    public async saveSysPasswordLog(
        log: SysPasswordLogModel
    ): Promise<SysPasswordLogModel> {
        return await Db.sys_password_log.create(log)
    }

    public async updateSysPasswordLog(
        log: SysPasswordLogModel
    ): Promise<Core.IExecuteResult> {
        return await this.executeResult(
            Db.sys_password_log.update(log, {
                where: { id: log.id },
            })
        )
    }

    public async findSysPasswordLogByEmail(
        email: string
    ): Promise<SysPasswordLogModel> {
        return await Db.sys_password_log.findOne({
            where: {
                email: email,
                expired_at: {
                    [Op.gt]: moment().toDate(),
                },
            },
            order: [["id", "DESC"]],
        })
    }

    public async findSysPasswordLogByVerifiedToken(
        verified_token: string
    ): Promise<SysPasswordLogModel> {
        return await Db.sys_password_log.findOne({
            where: {
                verified_token: verified_token,
            },
        })
    }

    public async findSysAuthLogByRefreshtoken(
        refresh_token: string
    ): Promise<SysAuthLogModel> {
        return await Db.sys_auth_log.findOne({
            where: {
                refresh_token: refresh_token,
                refresh_expired_at: {
                    [Op.gt]: moment().toDate(),
                },
            },
        })
    }

    public async findAllSysLog(): Promise<SysLogModel[]> {
        return await Db.sys_log.findAll({
            order: [["id", "DESC"]],
        })
    }

    public async findAllSysErrorLog(): Promise<SysErrorLogModel[]> {
        return await Db.sys_error_log.findAll({
            order: [["id", "DESC"]],
        })
    }
})()
