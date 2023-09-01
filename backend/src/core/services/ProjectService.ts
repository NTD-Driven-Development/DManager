import _ from "lodash"
import ProjectDao, { IFindOneProjectResult } from "../daos/ProjectDao"
import { ProjectModel } from "../../models/Project"
import HttpException from "../../exceptions/HttpException"
import ImportBoardersDto from "../importDtos/projects/ImportBoardersDto"
import { v4 } from "uuid"
import { ForeignKeyConstraintError } from "sequelize"
import ClassDao from "../daos/ClassDao"
import BoarderRoleDao from "../daos/BoarderRoleDao"
import BoarderMappingRoleDao from "../daos/BoarderMappingRoleDao"
import BoarderDao from "../daos/BoarderDao"
import { BoarderModel } from "../../models/Boarder"
import { BoarderRoleModel } from "../../models/BoarderRole"
import { BoarderMappingRoleModel } from "../../models/BoarderMappingRole"
import { ClassModel } from "../../models/Class"
import { ProjectBunkModel } from "../../models/ProjectBunk"
import FindOneProjectResultDto from "../exportDtos/project/FindOneProjectResultDto"
import PaginationResultDto from "../exportDtos/PaginationResultDto"
import { withPagination } from "../../utils/pagination"
import RequestUser from "../exportDtos/auth/RequestUser"

export default new (class ProjectService {
    public async getProjects(query?: {
        offset: number
        limit: number
    }): Promise<PaginationResultDto<ProjectModel>> {
        const projects = await ProjectDao.findAll()
        return withPagination(
            projects.length,
            projects,
            query?.offset,
            query?.limit
        )
    }

    private convertToFindOneProjectResultDto(
        data: IFindOneProjectResult
    ): FindOneProjectResultDto {
        const bunks = data?.project_bunks
        return {
            id: data.id,
            name: data.name,
            remark: data.remark,
            bunks: bunks ?? [],
            created_at: data.created_at,
        } as FindOneProjectResultDto
    }

    public async getProjectById(
        id: string | number
    ): Promise<FindOneProjectResultDto> {
        const project = await ProjectDao.findOneById(id)
        if (_.isEmpty(project)) {
            throw new HttpException("此項目不存在", 400)
        }
        const result = this.convertToFindOneProjectResultDto(project)
        return result
    }

    public async createProject(
        payload: ProjectModel,
        user: RequestUser
    ): Promise<any> {
        await this.ifProjectNameRepeatedThenThrow(payload)
        const model = {
            ...payload,
            created_by: user.id,
        }
        const project = await ProjectDao.create(model)
        return project
    }

    private async ifProjectNameRepeatedThenThrow(payload: ProjectModel) {
        const data = await ProjectDao.findAll()
        const hasRepeat = _.filter(
            data,
            (item) => item.name === payload.name && item.id !== payload.id
        )
        if (hasRepeat.length > 0) {
            throw new HttpException("名稱已存在", 400)
        }
    }

    public async updateProject(
        payload: ProjectModel,
        user: RequestUser
    ): Promise<boolean> {
        await this.ifProjectNameRepeatedThenThrow(payload)
        const model = {
            ...payload,
            updated_by: user.id,
        }
        const result = await ProjectDao.update(model)
        if (result.affectedRows === 0) {
            throw new HttpException("此項目不存在", 400)
        }
        return true
    }

    public async deleteProject(
        id: string | number,
        user: RequestUser
    ): Promise<boolean> {
        const result = await ProjectDao.delete(id, user.id)
        if (result.affectedRows === 0) {
            throw new HttpException("此項目不存在", 400)
        }
        return true
    }

    private convertImportDtoToBoarderModel(
        data: any,
        project_id: number
    ): BoarderModel[] {
        return _.map(data, (str) => {
            return { name: str, project_id: project_id }
        }) as BoarderModel[]
    }

    private convertImportDtoToBoarderMapRoleModel(
        boarder_id: string,
        boarderRoles: number[],
        created_by: number
    ): BoarderMappingRoleModel[] {
        return _.map(boarderRoles, (role) => {
            return { boarder_id, boarder_role_id: role, created_by }
        }) as BoarderMappingRoleModel[]
    }

    private getImportDataClassId(
        data: any,
        all_new_classes: ClassModel[]
    ): number | undefined {
        return (
            data.class_id ??
            _.find(
                all_new_classes,
                (item: ClassModel) => item.name === data.new_class
            )?.id
        )
    }

    private getImportDataBoarderRoleIds(
        data: any,
        boarder_roles: BoarderRoleModel[]
    ): (number | undefined)[] {
        return _.map(data.new_boarder_roles, (role) => {
            return _.find(boarder_roles, (result) => result.name === role)?.id
        })
    }

    public async importBoardersData(
        data: ImportBoardersDto,
        user: RequestUser
    ): Promise<boolean> {
        try {
            const newBoarderMappingRoles: BoarderMappingRoleModel[] = []
            const newProjectBunk: ProjectBunkModel[] = []

            // import new Class
            const classCreatedResult = await ClassDao.bulkCreate(
                data.all_new_classes
            )
            // import new BoarderRole
            const boarderRoleCreatedResult = await BoarderRoleDao.bulkCreate(
                this.convertImportDtoToBoarderModel(
                    data.all_new_boarder_roles,
                    data.project_id
                )
            )
            // Mappping Boarders Data
            const boarders = _.map(data.items, (item) => {
                const classId = this.getImportDataClassId(
                    item,
                    classCreatedResult
                )
                const boarderRoles = this.getImportDataBoarderRoleIds(
                    item,
                    boarderRoleCreatedResult
                ) as number[]
                const boarder_id = v4()
                const boarderMap = this.convertImportDtoToBoarderMapRoleModel(
                    boarder_id,
                    boarderRoles,
                    user.id
                )
                newBoarderMappingRoles.push(...boarderMap)
                newProjectBunk.push({
                    project_id: data.project_id,
                    boarder_id,
                    floor: item.floor,
                    room_type: item.room_type,
                    room_no: item.room_no,
                    bed: item.bed,
                    created_by: user.id,
                } as ProjectBunkModel)
                return {
                    id: boarder_id,
                    project_id: data.project_id,
                    class_id: classId,
                    name: item.name,
                    remark: item.remark,
                    sid: item.sid,
                    boarder_status_id: data.default_boarder_status_id,
                    created_by: user.id,
                } as BoarderModel
            })

            // import new Boarder
            await BoarderDao.bulkCreate(boarders)
            // import new BoarderMappingRole
            await BoarderMappingRoleDao.bulkCreate(newBoarderMappingRoles)
            // import new ProjectBunk
            await ProjectDao.bulkCreateProjectBunk(newProjectBunk)

            return true
        } catch (error: any) {
            if (error instanceof ForeignKeyConstraintError) {
                throw new HttpException("此項目不存在", 400)
            }
            throw new HttpException(error.message, 500)
        }
    }

    public async swapBunk(
        project_id: number,
        payload: {
            origin_bunk_id: number
            origin_boarder_id: string
            swap_bunk_id: number
            swap_boarder_id: string
        },
        user: RequestUser
    ): Promise<boolean> {
        try {
            const params = {
                project_id,
                ...payload,
            }
            const result = await ProjectDao.swapBunk(params)
            if (result.affectedRows !== 2) {
                throw new HttpException("交換失敗", 400)
            }
            return true
        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error
            }
            if (error instanceof ForeignKeyConstraintError) {
                throw new HttpException("交換對象不存在", 400)
            }
            throw new HttpException(error.message, 500)
        }
    }
})()
