import _ from "lodash"
import HttpException from "../../exceptions/HttpException"
import { withPagination } from "../../utils/pagination"
import IPaginationResultDto from "../exportDtos/PaginationResultDto"
import ClassDao from "../daos/ClassDao"
import { UniqueConstraintError } from "sequelize"
import { ClassModel } from "../../models/Class"

export default new (class ClassService {
    public async getClasses(query?: {
        offset: number
        limit: number
    }): Promise<IPaginationResultDto<ClassModel>> {
        const data = await ClassDao.findAll()
        return withPagination(data.length, data, query?.offset, query?.limit)
    }

    public async createClass(
        Class: ClassModel
    ): Promise<ClassModel> {
        try {
            await this.ifNameExistedThenThrow(Class)
            const result = await ClassDao.create(Class)
            return result
        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new HttpException(error.message, 500)
        }
    }

    public async updateClass(
        Class: ClassModel
    ): Promise<boolean> {
        try {
            await this.ifNameExistedThenThrow(Class)
            const result = await ClassDao.update(Class)
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

    private async ifNameExistedThenThrow(Class: ClassModel) {
        const data = await ClassDao.findAllByName(Class.name)
        const hasRepeat = _.filter(
            data,
            (item) => item.name === Class.name && item.id !== Class.id
        )
        if (hasRepeat.length > 0) {
            throw new HttpException("名稱重複", 400)
        }
    }

    public async deleteClass(id: string | number): Promise<boolean> {
        const result = await ClassDao.deleteById(id as number)
        if (result.affectedRows === 0) {
            throw new HttpException("查無資料", 400)
        }
        return true
    }
})()
