import _ from "lodash"
import ProjectDao from "../daos/ProjectDao"
import ProjectModel from "../../models/Project"
import HttpException from "../../exceptions/HttpException"
import Sequelize  from "sequelize"

export default new (class ProjectService {
    public async getAllProjectsData(): Promise<ProjectModel[]> {
        const projects = await ProjectDao.findAll()
        return projects
    }
    public async createProject(data: { name: string, remark: string }): Promise<any> {
        const project = await ProjectDao.create(data as ProjectModel)
        return project
    }

    public async updateProject(data: { id: string | number, name: string, remark: string }): Promise<boolean> {
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
})()
