import _ from "lodash"
import LogDao from "../daos/LogDao"
import ip from "../../utils/ip"
import { Request } from "express"
import route from "../../utils/route"
import { SysLogModel } from "../../models/SysLog"
import { SysErrorLogModel } from "../../models/SysErrorLog"
import RequestUser from "../exportDtos/auth/RequestUser"
import { IRequest } from "../interfaces/IHttp"
import IPaginationResultDto from "../exportDtos/PaginationResultDto"
import { withPagination } from "../../utils/pagination"

export default new (class LogService {
    public async saveSysLog(
        req: IRequest,
        statusCode: number,
        detail: string | undefined
    ): Promise<SysLogModel> {
        const clientip = ip.getClientIp(req)
        const serverip = ip.getServerIp()
        const url = route.getApiRouteFullPathFromRequest(req)

        const { method, headers, query, params, body } = req
        const user = req.user as RequestUser
        const filterHeaders = _.omit(headers, ["authorization"]) // 這裡過濾掉 authorization
        const model: SysLogModel = {
            clientip,
            serverip,
            url,
            http_method: method,
            http_status: statusCode,
            user_agent: headers["user-agent"] as string,
            user_id: user?.id,
            user_name: user?.name,
            headers: JSON.stringify(filterHeaders),
            query: JSON.stringify(query),
            params: JSON.stringify(params),
            body: JSON.stringify(body),
            detail,
        }
        return await LogDao.saveSysLog(model)
    }

    public async saveSysErrorLog(
        req: IRequest,
        statusCode: number,
        detail: string | undefined
    ): Promise<SysLogModel> {
        const clientip = ip.getClientIp(req)
        const serverip = ip.getServerIp()
        const url = route.getApiRouteFullPathFromRequest(req)

        const { method, headers, query, params, body } = req
        const filterHeaders = _.omit(headers, ["authorization"]) // 這裡過濾掉 authorization
        const user = req.user as RequestUser
        const model: SysErrorLogModel = {
            clientip,
            serverip,
            url,
            http_method: method,
            http_status: statusCode,
            user_agent: headers["user-agent"] as string,
            user_id: user?.id,
            user_name: user?.name,
            headers: JSON.stringify(filterHeaders),
            query: JSON.stringify(query),
            params: JSON.stringify(params),
            body: JSON.stringify(body),
            detail,
        }
        return await LogDao.saveSysErrorLog(model)
    }

    public async getOperationLogs(query: {
        offset?: number
        limit?: number
    }): Promise<IPaginationResultDto<SysLogModel | SysErrorLogModel>> {
        const { offset, limit } = query
        const errorLogs = await LogDao.findAllSysErrorLog()
        const logs = await LogDao.findAllSysLog()
        const combinedLogs = _.concat(logs, errorLogs)
        const sortedLogs = _.sortBy(combinedLogs, ["created_at"]).reverse()
        return withPagination(sortedLogs.length, sortedLogs, offset, limit)
    }
})()
