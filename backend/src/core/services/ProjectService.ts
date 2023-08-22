import _ from "lodash"
import ProjectDao, { IFindOneProjectResult } from "../daos/ProjectDao"
import ProjectModel from "../../models/Project"
import HttpException from "../../exceptions/HttpException"
import ImportBoardersDto from "../importDtos/projects/ImportBoardersDto"
import { v4 } from "uuid"
import Sequelize from "sequelize"
import ClassDao from "../daos/ClassDao"
import BoarderRoleDao from "../daos/BoarderRoleDao"
import BoarderMappingRoleDao from "../daos/BoarderMappingRoleDao"
import BoarderDao from "../daos/BoarderDao"
import BoarderModel from "../../models/Boarder"
import BoarderRoleModel from "../../models/BoarderRole"
import BoarderMappingRoleModel from "../../models/BoarderMappingRole"
import ClassModel from "../../models/Class"
import ProjectBunkModel from "../../models/ProjectBunk"
import FindOneProjectResultDto from "../exportDtos/project/FindOneProjectResultDto"
import PaginationResultDto from "../exportDtos/pagination/PaginationResultDto"
import { withPagination } from "../../utils/pagination"

export default new (class ProjectService {
    public async getAllProjectsData(query?: {offset: number, limit: number}): Promise<PaginationResultDto> {
        const projects = await ProjectDao.findAll()
        return withPagination(projects.length, projects, query?.offset, query?.limit)
    }

    private convertToFindOneProjectResultDto(
        data: IFindOneProjectResult
    ): FindOneProjectResultDto {
        const bunks = data?.project_bunks
        if (_.isEmpty(bunks)) {
            return {
                id: data.id,
                name: data.name,
                remark: data.remark,
                bunks: [],
                created_at: data.created_at,
            }
        }
        return {
            id: data.id,
            name: data.name,
            remark: data.remark,
            bunks: data.project_bunks,
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
            _.find(all_new_classes, (item: ClassModel) => {
                return item.name === data.new_class
            })?.id
        )
    }

    private getImportDataBoarderRoleIds(
        data: any,
        boarder_roles: BoarderRoleModel[]
    ): (number | undefined)[] {
        return _.map(data.new_boarder_roles, (role) => {
            return _.find(boarder_roles, (result) => {
                return result.name === role
            })?.id
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
})()
