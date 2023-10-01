import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import { ProjectModel } from "../../models/Project"
import { ProjectBunkModel } from "../../models/ProjectBunk"
import _ from "lodash"
import { Op, Sequelize } from "sequelize"

export interface IFindOneProjectResult extends ProjectModel {
    project_bunks?: ProjectBunkModel[]
}

export default new (class ProjectDao extends BaseDao implements Core.IDao {
    public async findAll(): Promise<ProjectModel[]> {
        return await Db.project.findAll({
            include: [
                {
                    model: Db.user,
                    attributes: ["id", "name"],
                    as: "creator",
                    required: false,
                },
                {
                    model: Db.user,
                    attributes: ["id", "name"],
                    as: "updater",
                    required: false,
                },
            ],
            where: { deleted_at: null },
            order: [["id", "DESC"]],
        })
    }

    public async findOneById(
        id: string | number
    ): Promise<IFindOneProjectResult> {
        return await Db.project.findOne({
            include: [
                {
                    model: Db.project_bunk,
                    as: "project_bunks",
                    required: false,
                    include: [
                        {
                            model: Db.boarder,
                            as: "boarder",
                            required: false,
                        },
                    ],
                },
                {
                    model: Db.user,
                    attributes: ["id", "name"],
                    as: "creator",
                    required: false,
                },
                {
                    model: Db.user,
                    attributes: ["id", "name"],
                    as: "updater",
                    required: false,
                },
            ],
            where: { id: id, deleted_at: null },
        })
    }

    public async create(project: ProjectModel): Promise<ProjectModel> {
        return await Db.project.create(project)
    }

    public async update(project: ProjectModel): Promise<Core.IExecuteResult> {
        project.updated_at = moment().toDate()
        return await this.executeResult(
            Db.project.update(project, { where: { id: project.id } })
        )
    }

    public async delete(
        id: string | number,
        deleted_by: number
    ): Promise<Core.IExecuteResult> {
        return await this.executeResult(
            Db.project.update(
                {
                    deleted_at: moment().toDate(),
                    deleted_by: deleted_by,
                },
                { where: { id: id, deleted_at: null } }
            )
        )
    }

    public async bulkCreateProjectBunk(
        data: ProjectBunkModel[]
    ): Promise<ProjectBunkModel[]> {
        const now = moment().toDate()
        const map = _.map(data, (item) => {
            return { ...item, created_at: now }
        })
        return await Db.project_bunk.bulkCreate(map)
    }

    public async createProjectBunk(
        data: ProjectBunkModel
    ): Promise<ProjectBunkModel> {
        return await Db.project_bunk.create(data)
    }

    public async swapBunk(data: {
        project_id: number
        origin_bunk_id: number
        origin_boarder_id: string
        swap_bunk_id: number
        swap_boarder_id: string,
        updated_by: number
    }): Promise<Core.IExecuteResult> {
        return await this.executeResult(
            Db.sequelize.query(
                `
                UPDATE project_bunk
                SET boarder_id = CASE 
                    WHEN id = :ORIGIN_BUNK_ID THEN :swap_BOARDER_ID 
                    WHEN id = :swap_BUNK_ID THEN :ORIGIN_BOARDER_ID 
                END,
                updated_at = :UPDATED_AT,
                updated_by = :UPDATED_BY
                WHERE id IN (:ORIGIN_BUNK_ID, :swap_BUNK_ID)
                AND project_id = :PROJECT_ID
            `,
                {
                    replacements: {
                        ORIGIN_BUNK_ID: data.origin_bunk_id,
                        swap_BOARDER_ID: data.swap_boarder_id,
                        swap_BUNK_ID: data.swap_bunk_id,
                        ORIGIN_BOARDER_ID: data.origin_boarder_id,
                        PROJECT_ID: data.project_id,
                        UPDATED_AT: moment().toDate(),
                        UPDATED_BY: data.updated_by
                    },
                }
            )
        )
    }

    public async deleteBunkByBoarderId(
        boarder_id: string
    ): Promise<Core.IExecuteResult> {
        return await this.executeResult(
            Db.project_bunk.destroy({
                where: {
                    boarder_id: boarder_id,
                },
            })
        )
    }
})()
