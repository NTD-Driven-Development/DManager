import _ from "lodash"
import BoarderDao from "../daos/BoarderDao"
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
import CreateBoarderDto from "../importDtos/boarders/CreateBoarderDto"
import { ProjectBunkModel } from "../../models/ProjectBunk"
import { BoarderMappingRoleModel } from "../../models/BoarderMappingRole"
import { v4 } from "uuid"

export default new (class BoarderService {
    public async getBoarders(query: {
        project_id: string | number
        search?: string
        offset?: number
        limit?: number
    }): Promise<IPaginationResultDto<BoarderModel>> {
        let data = await BoarderDao.findAll()
        if (query?.project_id) {
            data = _.filter(data, (item) => item.project_id == query.project_id)
        }
        if (query?.search) {
            data = _.filter(data, (item: BoarderModel) => {
                return (
                    _.includes(item?.name, query.search) ||
                    _.includes(item?.class?.name, query.search) ||
                    _.includes(
                        "" +
                            item?.project_bunk?.floor +
                            item?.project_bunk?.room_type +
                            item?.project_bunk?.room_no +
                            "-" +
                            item?.project_bunk?.bed,
                        query.search
                    )
                )
            })
        }

        // sort by floor, room_type, room_no, bed
        const result = _.sortBy(data, [
            (data) => data?.project_bunk?.floor,
            (data) => data?.project_bunk?.room_type,
            (data) => data?.project_bunk?.room_no,
            (data) => data?.project_bunk?.bed,
        ])
        return withPagination(
            result.length,
            result,
            query?.offset,
            query?.limit
        )
    }

    public async getBoarderById(id: string | number): Promise<BoarderModel> {
        const result = await BoarderDao.findOneById(id)
        if (!result) {
            throw new HttpException("查無資料", 400)
        }
        return result
    }

    private convertCreateBoarderDtoToBoarderModel(
        data: CreateBoarderDto,
        created_by: number
    ): BoarderModel {
        return {
            id: v4(),
            name: data.name,
            project_id: data.project_id,
            class_id: data?.class_id,
            sid: data?.sid,
            boarder_status_id: data.boarder_status_id,
            remark: data?.remark,
            created_by: created_by,
        } as BoarderModel
    }

    private convertCreateBoarderDtoToProjectBunkModel(
        boarder_id: string,
        data: CreateBoarderDto,
        created_by: number
    ): ProjectBunkModel {
        return {
            project_id: data.project_id,
            boarder_id: boarder_id,
            floor: data.floor,
            room_type: data.room_type,
            room_no: data.room_no,
            bed: data.bed,
            remark: data.remark,
            created_by: created_by,
        } as ProjectBunkModel
    }

    private convertCreateBoarderDtoToBoarderMapRoleModel(
        boarder_id: string,
        boarderRoles: number[],
        created_by: number
    ): BoarderMappingRoleModel[] {
        return _.map(boarderRoles, (role) => {
            return { boarder_id, boarder_role_id: role, created_by }
        }) as BoarderMappingRoleModel[]
    }

    public async createBoarder(
        payload: CreateBoarderDto,
        user: RequestUser
    ): Promise<any> {
        try {
            const boarderData: BoarderModel =
                this.convertCreateBoarderDtoToBoarderModel(payload, user.id)
            const boarder: BoarderModel = await BoarderDao.create(boarderData)

            if (!_.isEmpty(payload.boarder_role_ids)) {
                const boarderMap: BoarderMappingRoleModel[] =
                    this.convertCreateBoarderDtoToBoarderMapRoleModel(
                        boarder.id,
                        payload.boarder_role_ids as number[],
                        user.id
                    )
                await BoarderMappingRoleDao.bulkCreate(boarderMap)
            }
            const projectBunk: ProjectBunkModel =
                this.convertCreateBoarderDtoToProjectBunkModel(
                    boarder.id,
                    payload,
                    user.id
                )

            await ProjectDao.createProjectBunk(projectBunk)
            return true
        } catch (error: any) {
            if (error instanceof ForeignKeyConstraintError) {
                throw new HttpException("此項目不存在", 400)
            }
            if (error instanceof UniqueConstraintError) {
                throw new HttpException("建立失敗，此床位已存在", 400)
            }
            throw new HttpException(error.message, 500)
        }
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

    public async getBoarderRoles(query: {
        project_id?: string | number
        search?: string
        offset?: number
        limit?: number
    }): Promise<IPaginationResultDto<BoarderRoleModel>> {
        let result = await BoarderRoleDao.findAll()
        if (query?.project_id) {
            result = _.filter(
                result,
                (item) => item.project_id == query.project_id
            )
        }
        if (query?.search) {
            result = _.filter(result, (item) =>
                _.includes(item?.name, query.search)
            )
        }

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
        search?: string
        offset?: number
        limit?: number
    }): Promise<IPaginationResultDto<BoarderStatusModel>> {
        let data = await BoarderStatusDao.findAll()
        if (query?.search) {
            data = _.filter(data, (item) =>
                _.includes(item?.name, query.search)
            )
        }
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
