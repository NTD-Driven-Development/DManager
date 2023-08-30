import _ from "lodash"
import HttpException from "../../exceptions/HttpException"
import { withPagination } from "../../utils/pagination"
import IPaginationResultDto from "../exportDtos/PaginationResultDto"
import TelCardContacterDao from "../daos/TelCardContacterDao"
import { UniqueConstraintError } from "sequelize"
import { TelCardContacterModel } from "../../models/TelCardContacter"
import RequestUser from "../exportDtos/auth/RequestUser"

export default new (class TelCardService {
    public async getTelCardContacters(query?: {
        offset: number
        limit: number
    }): Promise<IPaginationResultDto<TelCardContacterModel>> {
        const data = await TelCardContacterDao.findAll()
        return withPagination(data.length, data, query?.offset, query?.limit)
    }

    public async getTelCardContacterById(
        id: string | number
    ): Promise<TelCardContacterModel> {
        const data = await TelCardContacterDao.findOneById(id as number)
        if (!data) {
            throw new HttpException("查無資料", 400)
        }
        return data
    }

    public async createTelCardContacter(
        payload: TelCardContacterModel,
        user: RequestUser
    ): Promise<TelCardContacterModel> {
        try {
            await this.ifNameRepeatedThenThrow(payload)
            const model = {
                ...payload,
                created_by: user.id,
            }
            const result = await TelCardContacterDao.create(model)
            return result
        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new HttpException(error.message, 500)
        }
    }

    private async ifNameRepeatedThenThrow(payload: TelCardContacterModel) {
        const data = await TelCardContacterDao.findAllByName(payload.name)
        const hasRepeat = _.filter(
            data,
            (item) => item.name === payload.name && item.id !== payload.id
        )
        if (hasRepeat.length > 0) {
            throw new HttpException("名稱已存在", 400)
        }
    }

    public async updateTelCardContacter(
        payload: TelCardContacterModel,
        user: RequestUser
    ): Promise<boolean> {
        try {
            await this.ifNameRepeatedThenThrow(payload)
            const model = {
                ...payload,
                updated_by: user.id,
            }
            const result = await TelCardContacterDao.update(model)
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

    public async deleteTelCardContacter(
        id: string | number,
        user: RequestUser
    ): Promise<boolean> {
        const result = await TelCardContacterDao.delete(id as number, user.id)
        if (result.affectedRows === 0) {
            throw new HttpException("查無資料", 400)
        }
        return true
    }
})()
