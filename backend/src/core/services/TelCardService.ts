import _ from "lodash"
import HttpException from "../../exceptions/HttpException"
import { withPagination } from "../../utils/pagination"
import IPaginationResultDto from "../exportDtos/PaginationResultDto"
import TelCardContacterDao from "../daos/TelCardContacterDao"
import { UniqueConstraintError } from "sequelize"
import { TelCardContacterModel } from "../../models/TelCardContacter"

export default new (class TelCardService {
    public async getTelCardContacters(query?: {
        offset: number
        limit: number
    }): Promise<IPaginationResultDto<TelCardContacterModel>> {
        const data = await TelCardContacterDao.findAll()
        return withPagination(data.length, data, query?.offset, query?.limit)
    }

    public async createTelCardContacter(
        TelCardContacter: TelCardContacterModel
    ): Promise<TelCardContacterModel> {
        try {
            await this.ifNameRepeatedThenThrow(TelCardContacter)
            const result = await TelCardContacterDao.create(TelCardContacter)
            return result
        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new HttpException(error.message, 500)
        }
    }

    private async ifNameRepeatedThenThrow(TelCardContacter: TelCardContacterModel) {
        const data = await TelCardContacterDao.findAllByName(TelCardContacter.name)
        const hasRepeat = _.filter(
            data,
            (item) => item.name === TelCardContacter.name && item.id !== TelCardContacter.id
        )
        if (hasRepeat.length > 0) {
            throw new HttpException("名稱重複", 400)
        }
    }

    public async updateTelCardContacter(
        TelCardContacter: TelCardContacterModel
    ): Promise<boolean> {
        try {
            await this.ifNameRepeatedThenThrow(TelCardContacter)
            const result = await TelCardContacterDao.update(TelCardContacter)
            if (result.affectedRows === 0) {
                throw new HttpException("查無資料", 400)
            }
            return true
        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new HttpException(error.message, 500)
        }
    }

    public async deleteTelCardContacter(id: string | number): Promise<boolean> {
        const result = await TelCardContacterDao.deleteById(id as number)
        if (result.affectedRows === 0) {
            throw new HttpException("查無資料", 400)
        }
        return true
    }
})()
