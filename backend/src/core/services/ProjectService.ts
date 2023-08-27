import _ from "lodash"
import ProjectDao, { IFindOneProjectResult } from "../daos/ProjectDao"
import { ProjectModel } from "../../models/Project"
import HttpException from "../../exceptions/HttpException"
import ImportBoardersDto from "../importDtos/projects/ImportBoardersDto"
import { v4 } from "uuid"
import Sequelize from "sequelize"
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
import CreateProjectBunkDto from "../importDtos/projects/CreateProjectBunkDto"
import { withPagination } from "../../utils/pagination"

export default new (class ProjectService {
    public async getAllProjectsData(query?: {
        offset: number
        limit: number
    }): Promise<PaginationResultDto> {
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

    public async getProjectDataById(
        id: string | number
    ): Promise<FindOneProjectResultDto> {
        const project = await ProjectDao.findOneById(id)
        if (_.isEmpty(project)) {
            throw new HttpException("此項目不存在", 400)
        }
        const result = this.convertToFindOneProjectResultDto(project)
        return result
    }

    public async createProject(data: {
        name: string
        remark: string
    }): Promise<any> {
        const project = await ProjectDao.create(data as ProjectModel)
        return project
    }

    public async updateProject(data: {
        id: string | number
        name: string
        remark: string
    }): Promise<boolean> {
        const result = await ProjectDao.update(data.id, data as ProjectModel)
        if (result.affectedRows === 0) {
            throw new HttpException("此項目不存在", 400)
        }
        return true
    }

    public async deleteProject(id: string | number): Promise<boolean> {
        const result = await ProjectDao.delete(id)
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
        boarderRoles: number[]
    ): BoarderMappingRoleModel[] {
        return _.map(boarderRoles, (role) => {
            return { boarder_id, boarder_role_id: role as number }
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

    public async importBoardersData(data: ImportBoardersDto): Promise<boolean> {
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
                    boarderRoles
                )
                newBoarderMappingRoles.push(...boarderMap)
                newProjectBunk.push({
                    project_id: data.project_id,
                    boarder_id,
                    floor: item.floor,
                    room_type: item.room_type,
                    room_no: item.room_no,
                    bed: item.bed,
                } as ProjectBunkModel)
                return {
                    id: boarder_id,
                    project_id: data.project_id,
                    class_id: classId,
                    name: item.name,
                    remark: item.remark,
                    sid: item.sid,
                    boarder_status_id: data.default_boarder_status_id,
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
            if (error instanceof Sequelize.ForeignKeyConstraintError) {
                throw new HttpException("此項目不存在", 400)
            }
            throw new HttpException(error.message, 500)
        }
    }

    private convertCreateProjectBunkDtoToBoarderModel(
        data: CreateProjectBunkDto,
        project_id: number
    ): BoarderModel {
        return {
            id: v4(),
            name: data.name,
            project_id: project_id,
            class_id: data?.class_id,
            sid: data?.sid,
            boarder_status_id: data.boarder_status_id,
            remark: data?.remark,
        } as BoarderModel
    }

    private convertCreateProjectBunkDtoToProjectBunkModel(
        project_id: number,
        boarder_id: string,
        data: CreateProjectBunkDto
    ): ProjectBunkModel {
        return {
            project_id: project_id,
            boarder_id: boarder_id,
            floor: data.floor,
            room_type: data.room_type,
            room_no: data.room_no,
            bed: data.bed,
            remark: data.remark,
        } as ProjectBunkModel
    }

    public async createProjectBunk(
        project_id: number | string,
        payload: CreateProjectBunkDto
    ): Promise<any> {
        try {
            const boarderData: BoarderModel =
                this.convertCreateProjectBunkDtoToBoarderModel(
                    payload,
                    project_id as number
                )
            const boarder: BoarderModel = await BoarderDao.create(boarderData)

            if (!_.isEmpty(payload.boarder_role_ids)) {
                const boarderMap: BoarderMappingRoleModel[] =
                    this.convertImportDtoToBoarderMapRoleModel(
                        boarder.id,
                        payload.boarder_role_ids as number[]
                    )
                await BoarderMappingRoleDao.bulkCreate(boarderMap)
            }
            const projectBunk: ProjectBunkModel =
                this.convertCreateProjectBunkDtoToProjectBunkModel(
                    project_id as number,
                    boarder.id,
                    payload
                )

            await ProjectDao.createProjectBunk(projectBunk)
            return true
        } catch (error: any) {
            if (error instanceof Sequelize.ForeignKeyConstraintError) {
                throw new HttpException("此項目不存在", 400)
            }
            if (error instanceof Sequelize.UniqueConstraintError) {
                throw new HttpException("建立失敗，此床位已存在", 400)
            }
            console.log(error)
            throw new HttpException(error.message, 500)
        }
    }

    public async exchangeBunk(
        project_id: number,
        payload: {
            origin_bunk_id: number
            origin_boarder_id: string
            exchange_bunk_id: number
            exchange_boarder_id: string
        }
    ): Promise<boolean> {
        try {
            const params = {
                project_id,
                ...payload,
            }
            const result = await ProjectDao.exchangeBunk(params)
            if (result.affectedRows !== 2) {
                throw new HttpException("交換失敗", 400)
            }
            return true
        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error
            }
            if (error instanceof Sequelize.ForeignKeyConstraintError) {
                throw new HttpException("交換對象不存在", 400)
            }
            throw new HttpException(error.message, 500)
        }
    }
})()
