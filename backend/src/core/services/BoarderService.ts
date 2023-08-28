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

    public async updateBoarder(boarder: UpdateBoarderDto): Promise<boolean> {
        try {
            const result = await BoarderDao.update(boarder)
            if (result.affectedRows === 0) {
                throw new HttpException("查無資料", 400)
            }
            await BoarderMappingRoleDao.destroyByBoarderId(boarder.id)
            await BoarderMappingRoleDao.bulkCreate(
                _.map(boarder.boarder_role_ids, (item) => {
                    return {
                        boarder_id: boarder.id,
                        boarder_role_id: item,
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

    public async deleteBoarder(id: string): Promise<boolean> {
        const result = await BoarderDao.deleteById(id)
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

    public async createBoarderRole(
        boarderRole: BoarderRoleModel
    ): Promise<BoarderRoleModel> {
        try {
            const data = await BoarderRoleDao.findAll()
            const hasRepeatData = _.filter(
                data,
                (item) =>
                    item.project_id == boarderRole.project_id &&
                    item.name == boarderRole.name
            )
            if (hasRepeatData.length > 0) {
                throw new HttpException("資料已重複", 400)
            }
            const result = await BoarderRoleDao.create(boarderRole)
            return result
        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new HttpException(error.message, 500)
        }
    }

    public async updateBoarderRole(
        boarderRole: BoarderRoleModel
    ): Promise<boolean> {
        const result = await BoarderRoleDao.update(boarderRole)
        if (result.affectedRows === 0) {
            throw new HttpException("查無資料", 400)
        }
        return true
    }

    public async deleteBoarderRole(id: string | number): Promise<boolean> {
        const result = await BoarderRoleDao.deleteById(id as number)
        if (result.affectedRows === 0) {
            throw new HttpException("查無資料", 400)
        }
        return true
    }

    public async getBoarderStatuses(query?: {
        offset: number
        limit: number
    }): Promise<IPaginationResultDto<BoarderStatusModel>> {
        const data = await BoarderStatusDao.findAll()
        return withPagination(data.length, data, query?.offset, query?.limit)
    }

    public async createBoarderStatus(
        boarderStatus: BoarderStatusModel
    ): Promise<BoarderStatusModel> {
        try {
            const data = await BoarderStatusDao.findAll()
            const hasRepeatData = _.filter(
                data,
                (item) => item?.name == boarderStatus?.name
            )
            if (hasRepeatData.length > 0) {
                throw new HttpException("資料已重複", 400)
            }
            const result = await BoarderStatusDao.create(boarderStatus)
            return result
        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new HttpException(error.message, 500)
        }
    }

    public async updateBoarderStatus(
        boarderStatus: BoarderStatusModel
    ): Promise<boolean> {
        const result = await BoarderStatusDao.update(boarderStatus)
        if (result.affectedRows === 0) {
            throw new HttpException("查無資料", 400)
        }
        return true
    }

    public async deleteBoarderStatus(id: string | number): Promise<boolean> {
        const result = await BoarderStatusDao.deleteById(id as number)
        if (result.affectedRows === 0) {
            throw new HttpException("查無資料", 400)
        }
        return true
    }
})()
