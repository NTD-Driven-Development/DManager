import _ from "lodash"
import BoarderDao, { BoarderData } from "../daos/BoarderDao"
import { BoarderModel } from "../../models/Boarder"
import HttpException from "../../exceptions/HttpException"
import { withPagination } from "../../utils/pagination"
import IPaginationResultDto from "../exportDtos/PaginationResultDto"
import ProjectDao from "../daos/ProjectDao"
import BoarderRoleDao from "../daos/BoarderRoleDao"
import BoarderStatusDao from "../daos/BoarderStatusDao"
import { BoarderRoleModel } from "../../models/BoarderRole"
import { ForeignKeyConstraintError, UniqueConstraintError } from "sequelize"
import { BoarderStatusModel } from "../../models/BoarderStatus"
import UpdateBoarderDto from "../importDtos/boarders/UpdateBoarderDto"
import BoarderMappingRoleDao from "../daos/BoarderMappingRoleDao"
import RequestUser from "../exportDtos/auth/RequestUser"

export default new (class BoarderService {
    public async getBoardersFromProject(
        project_id: string | number,
        query?: {
            offset: number
            limit: number
        }
    ): Promise<IPaginationResultDto<BoarderData>> {
        const data = await BoarderDao.findAll()
        const dataFromProject = _.filter(
            data,
            (item) => item.project_id == project_id
        )
        // sort by floor, room_type, room_no, bed
        const result = _.sortBy(dataFromProject, [
            (dataFromProject) => dataFromProject?.project_bunk?.floor,
            (dataFromProject) => dataFromProject?.project_bunk?.room_type,
            (dataFromProject) => dataFromProject?.project_bunk?.room_no,
            (dataFromProject) => dataFromProject?.project_bunk?.bed,
        ])
        return withPagination(
            result.length,
            result,
            query?.offset,
            query?.limit
        )
    }

    public async getBoarderById(id: string | number): Promise<BoarderData> {
        const result = await BoarderDao.findOneById(id)
        if (!result) {
            throw new HttpException("查無資料", 400)
        }
        return result
    }

    public async updateBoarder(
        payload: UpdateBoarderDto,
        user: RequestUser
    ): Promise<boolean> {
        try {
            const model = {
                ...payload,
                created_by: user.id,
            }
            const result = await BoarderDao.update(model)
            if (result.affectedRows === 0) {
                throw new HttpException("查無資料", 400)
            }
            await BoarderMappingRoleDao.destroyByBoarderId(payload.id)
            await BoarderMappingRoleDao.bulkCreate(
                _.map(payload.boarder_role_ids, (item) => {
                    return {
                        boarder_id: payload.id,
                        boarder_role_id: item,
                        created_by: user.id,
                    }
                })
            )
            return true
        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error
            }
            if (error instanceof ForeignKeyConstraintError) {
                throw new HttpException("資料錯誤", 400)
            }
            throw new HttpException(error.message, 500)
        }
    }

    public async deleteBoarder(
        id: string,
        user: RequestUser
    ): Promise<boolean> {
        const result = await BoarderDao.delete(id, user.id)
        if (result.affectedRows === 0) {
            throw new HttpException("查無資料", 400)
        }
        await ProjectDao.deleteBunkByBoarderId(id)
        return true
    }

    public async getBoarderRolesFromProject(
        project_id: string | number,
        query?: {
            offset: number
            limit: number
        }
    ): Promise<IPaginationResultDto<BoarderRoleModel>> {
        const data = await BoarderRoleDao.findAll()
        const result = _.filter(data, (item) => item.project_id == project_id)
        return withPagination(
            result.length,
            result,
            query?.offset,
            query?.limit
        )
    }

    public async getBoarderRoleById(
        id: string | number
    ): Promise<BoarderRoleModel> {
        const result = await BoarderRoleDao.findOneById(id as number)
        if (!result) {
            throw new HttpException("查無資料", 400)
        }
        return result
    }

    public async createBoarderRole(
        payload: BoarderRoleModel,
        user: RequestUser
    ): Promise<BoarderRoleModel> {
        try {
            await this.ifBoarderRoleNameRepeatedThenThrow(payload)
            const model = {
                ...payload,
                created_by: user.id,
            }
            const result = await BoarderRoleDao.create(model)
            return result
        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new HttpException(error.message, 500)
        }
    }

    private async ifBoarderRoleNameRepeatedThenThrow(
        payload: BoarderRoleModel
    ) {
        const data = await BoarderRoleDao.findAll()
        const hasRepeatData = _.filter(
            data,
            (item) =>
                item.name == payload.name &&
                item.project_id == payload.project_id &&
                item.id !== payload.id
        )
        if (hasRepeatData.length > 0) {
            throw new HttpException("名稱已存在", 400)
        }
    }

    public async updateBoarderRole(
        payload: BoarderRoleModel,
        user: RequestUser
    ): Promise<boolean> {
        await this.ifBoarderRoleNameRepeatedThenThrow(payload)
        const model = {
            ...payload,
            updated_by: user.id,
        }
        const result = await BoarderRoleDao.update(model)
        if (result.affectedRows === 0) {
            throw new HttpException("查無資料", 400)
        }
        return true
    }

    public async deleteBoarderRole(
        id: string | number,
        user: RequestUser
    ): Promise<boolean> {
        const result = await BoarderRoleDao.delete(id as number, user.id)
        if (result.affectedRows === 0) {
            throw new HttpException("查無資料", 400)
        }
        return true
    }

    private async ifBoarderStatusNameRepeatedThenThrow(
        payload: BoarderStatusModel
    ) {
        const data = await BoarderStatusDao.findAll()
        const hasRepeatData = _.filter(
            data,
            (item) => item?.name == payload?.name && item?.id !== payload?.id
        )
        if (hasRepeatData.length > 0) {
            throw new HttpException("名稱已存在", 400)
        }
    }

    public async getBoarderStatuses(query?: {
        offset: number
        limit: number
    }): Promise<IPaginationResultDto<BoarderStatusModel>> {
        const data = await BoarderStatusDao.findAll()
        return withPagination(data.length, data, query?.offset, query?.limit)
    }

    public async getBoarderStatusById(
        id: string | number
    ): Promise<BoarderStatusModel> {
        const result = await BoarderStatusDao.findOneById(id as number)
        if (!result) {
            throw new HttpException("查無資料", 400)
        }
        return result
    }

    public async createBoarderStatus(
        payload: BoarderStatusModel,
        user: RequestUser
    ): Promise<BoarderStatusModel> {
        try {
            await this.ifBoarderStatusNameRepeatedThenThrow(payload)
            const model = {
                ...payload,
                created_by: user.id,
            }
            const result = await BoarderStatusDao.create(model)
            return result
        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new HttpException(error.message, 500)
        }
    }

    public async updateBoarderStatus(
        payload: BoarderStatusModel,
        user: RequestUser
    ): Promise<boolean> {
        await this.ifBoarderStatusNameRepeatedThenThrow(payload)
        const model = {
            ...payload,
            updated_by: user.id,
        }
        const result = await BoarderStatusDao.update(model)
        if (result.affectedRows === 0) {
            throw new HttpException("查無資料", 400)
        }
        return true
    }

    public async deleteBoarderStatus(
        id: string | number,
        user: RequestUser
    ): Promise<boolean> {
        const result = await BoarderStatusDao.delete(id as number, user.id)
        if (result.affectedRows === 0) {
            throw new HttpException("查無資料", 400)
        }
        return true
    }
})()
