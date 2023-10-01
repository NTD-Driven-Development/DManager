import _ from "lodash"
import HttpException from "../../exceptions/HttpException"
import { withPagination } from "../../utils/pagination"
import IPaginationResultDto from "../exportDtos/PaginationResultDto"
import PointRuleDao from "../daos/PointRuleDao"
import PointLogDao from "../daos/PointLogDao"
import { PointRuleModel } from "../../models/PointRule"
import RequestUser from "../exportDtos/auth/RequestUser"
import { PointLogModel } from "../../models/PointLog"
import strings from "../../utils/strings"
import { ProjectBunkModel } from "../../models/ProjectBunk"

export default new (class PointService {
    public async getPointRules(query?: {
        search?: string
        offset?: number
        limit?: number
    }): Promise<IPaginationResultDto<PointRuleModel>> {
        let data = await PointRuleDao.findAll()
        if (query?.search) {
            data = _.filter(data, (item) => {
                return (
                    _.includes(item?.code, query.search) ||
                    _.includes(item?.reason, query.search)
                )
            })
        }
        return withPagination(data.length, data, query?.offset, query?.limit)
    }

    public async getPointRuleById(
        id: string | number
    ): Promise<PointRuleModel> {
        const result = await PointRuleDao.findOneById(id as number)
        if (!result) {
            throw new HttpException("查無資料", 400)
        }
        return result
    }

    public async createPointRule(
        payload: PointRuleModel,
        user: RequestUser
    ): Promise<PointRuleModel> {
        try {
            await this.ifPointRuleCodeRepeatedThenThrow(payload)
            const model = {
                ...payload,
                created_by: user.id,
            }
            const result = await PointRuleDao.create(model)
            return result
        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new HttpException(error.message, 500)
        }
    }

    private async ifPointRuleCodeRepeatedThenThrow(payload: PointRuleModel) {
        const data = await PointRuleDao.findAllByCode(payload.code)
        const hasRepeat = _.filter(
            data,
            (item) => item.code === payload.code && item.id !== payload.id
        )
        if (hasRepeat.length > 0) {
            throw new HttpException("代碼重複", 400)
        }
    }

    public async updatePointRule(
        payload: PointRuleModel,
        user: RequestUser
    ): Promise<boolean> {
        await this.ifPointRuleCodeRepeatedThenThrow(payload)
        const model = {
            ...payload,
            updated_by: user.id,
        }
        const result = await PointRuleDao.update(model)
        if (result.affectedRows === 0) {
            throw new HttpException("查無資料", 400)
        }
        return true
    }

    public async deletePointRule(
        id: string | number,
        user: RequestUser
    ): Promise<boolean> {
        const result = await PointRuleDao.delete(id as number, user.id)
        if (result.affectedRows === 0) {
            throw new HttpException("查無資料", 400)
        }
        return true
    }

    public async getPointLogs(query?: {
        search?: string
        offset?: number
        limit?: number
        project_id?: number
    }): Promise<IPaginationResultDto<PointLogModel>> {
        let result = await PointLogDao.findAll()
        if (query?.project_id) {
            result = _.filter(
                result,
                (item) => item.project_id == query?.project_id
            )
        }
        if (query?.search) {
            result = _.filter(result, (item) => {
                const bunk = strings.formatBunkString(
                    item?.boarder?.project_bunk as ProjectBunkModel
                )
                return (
                    _.includes(item.boarder?.name, query.search) ||
                    _.includes(bunk, query.search)
                )
            })
        }

        return withPagination(
            result.length,
            result,
            query?.offset,
            query?.limit
        )
    }

    public async getPointLogById(id: string | number): Promise<PointLogModel> {
        const data = await PointLogDao.findOneById(id as number)
        if (!data) {
            throw new HttpException("查無資料", 400)
        }
        return data
    }

    public async createPointLog(
        payload: PointLogModel,
        user: RequestUser
    ): Promise<PointLogModel> {
        const model = {
            ...payload,
            created_by: user.id,
        }
        const result = await PointLogDao.create(model)
        return result
    }

    public async deletePointLog(
        id: string | number,
        user: RequestUser
    ): Promise<boolean> {
        const result = await PointLogDao.delete(id as number, user.id)
        if (result.affectedRows === 0) {
            throw new HttpException("查無資料", 400)
        }
        return true
    }
})()
