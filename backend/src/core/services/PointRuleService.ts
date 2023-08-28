import _ from "lodash"
import HttpException from "../../exceptions/HttpException"
import { withPagination } from "../../utils/pagination"
import IPaginationResultDto from "../exportDtos/PaginationResultDto"
import PointRuleDao from "../daos/PointRuleDao"
import { UniqueConstraintError } from "sequelize"
import { PointRuleModel } from "../../models/PointRule"

export default new (class PointRuleService {
    public async getPointRules(query?: {
        offset: number
        limit: number
    }): Promise<IPaginationResultDto<PointRuleModel>> {
        const data = await PointRuleDao.findAll()
        return withPagination(data.length, data, query?.offset, query?.limit)
    }

    public async createPointRule(
        PointRule: PointRuleModel
    ): Promise<PointRuleModel> {
        try {
            const data = await PointRuleDao.findAllByCode(PointRule.code)
            const hasRepeat = _.filter(
                data,
                (item) =>
                    item.code === PointRule.code && item.id !== PointRule.id
            )
            if (hasRepeat.length > 0) {
                throw new HttpException("代碼重複", 400)
            }
            const result = await PointRuleDao.create(PointRule)
            return result
        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new HttpException(error.message, 500)
        }
    }

    public async updatePointRule(PointRule: PointRuleModel): Promise<boolean> {
        const data = await PointRuleDao.findAllByCode(PointRule.code)
        const hasRepeat = _.filter(
            data,
            (item) => item.code === PointRule.code && item.id !== PointRule.id
        )
        if (hasRepeat.length > 0) {
            throw new HttpException("代碼重複", 400)
        }
        const result = await PointRuleDao.update(PointRule)
        if (result.affectedRows === 0) {
            throw new HttpException("查無資料", 400)
        }
        return true
    }

    public async deletePointRule(id: string | number): Promise<boolean> {
        const result = await PointRuleDao.deleteById(id as number)
        if (result.affectedRows === 0) {
            throw new HttpException("查無資料", 400)
        }
        return true
    }
})()
