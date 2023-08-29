import _ from "lodash"
import HttpException from "../../exceptions/HttpException"
import { withPagination } from "../../utils/pagination"
import IPaginationResultDto from "../exportDtos/PaginationResultDto"
import PointRuleDao from "../daos/PointRuleDao"
import { UniqueConstraintError } from "sequelize"
import { PointRuleModel } from "../../models/PointRule"
import RequestUser from "../exportDtos/auth/RequestUser"

export default new (class PointRuleService {
    public async getPointRules(query?: {
        offset: number
        limit: number
    }): Promise<IPaginationResultDto<PointRuleModel>> {
        const data = await PointRuleDao.findAll()
        return withPagination(data.length, data, query?.offset, query?.limit)
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
})()
