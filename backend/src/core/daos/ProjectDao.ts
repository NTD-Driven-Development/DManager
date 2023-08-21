import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import ProjectModel from "../../models/Project"

export default new (class ProjectDao extends BaseDao implements Core.IDao {
    public async findAll(): Promise<ProjectModel[]> {
        const projects = await Db.project.findAll({
            where: { deleted_at: null },
        })
        return projects
    }

    public async findOneById(id: string | number): Promise<ProjectModel> {
        const project = await Db.project.findOne({
            where: { id: id, deleted_at: null },
        })
        return project
    }

    public async create(project: ProjectModel): Promise<ProjectModel> {
        project.created_at = moment().toDate()
        return await Db.project.create(project)
    }

    public async update(
        id: string | number,
        project: ProjectModel
    ): Promise<Core.IExecuteResult> {
        project.updated_at = moment().toDate()
        return await this.executeResult(() =>
            Db.project.update(project, { where: { id: id } })
        )
    }

    public async delete(id: string | number): Promise<Core.IExecuteResult> {
        return await this.executeResult(() =>
            Db.project.destroy({ where: { id: id } })
        )
    }
})()
