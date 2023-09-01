import _ from "lodash"
import HttpException from "../../exceptions/HttpException"
import { withPagination } from "../../utils/pagination"
import IPaginationResultDto from "../exportDtos/PaginationResultDto"
import ClassDao from "../daos/ClassDao"
import { ClassModel } from "../../models/Class"
import RequestUser from "../exportDtos/auth/RequestUser"

export default new (class ClassService {
    public async getClasses(query?: {
        offset?: number
        limit?: number
    }): Promise<IPaginationResultDto<ClassModel>> {
        const data = await ClassDao.findAll()
        return withPagination(data.length, data, query?.offset, query?.limit)
    }

    public async getClassById(id: string | number): Promise<ClassModel> {
        const data = await ClassDao.findOneById(id as number)
        if (!data) {
            throw new HttpException("查無資料", 400)
        }
        return data
    }

    public async createClass(
        payload: ClassModel,
        user: RequestUser
    ): Promise<ClassModel> {
        try {
            await this.ifNameExistedThenThrow(payload)
            const model = {
                ...payload,
                created_by: user.id,
            }
            const result = await ClassDao.create(model)
            return result
        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new HttpException(error.message, 500)
        }
    }

    public async updateClass(
        payload: ClassModel,
        user: RequestUser
    ): Promise<boolean> {
        try {
            await this.ifNameExistedThenThrow(payload)
            const model = {
                ...payload,
                updated_by: user.id,
            }
            const result = await ClassDao.update(model)
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

    private async ifNameExistedThenThrow(payload: ClassModel) {
        const data = await ClassDao.findAllByName(payload.name)
        const hasRepeat = _.filter(
            data,
            (item) => item.name === payload.name && item.id !== payload.id
        )
        if (hasRepeat.length > 0) {
            throw new HttpException("名稱已存在", 400)
        }
    }

    public async deleteClass(
        id: string | number,
        user: RequestUser
    ): Promise<boolean> {
        const result = await ClassDao.delete(id as number, user.id)
        if (result.affectedRows === 0) {
            throw new HttpException("查無資料", 400)
        }
        return true
    }
})()
