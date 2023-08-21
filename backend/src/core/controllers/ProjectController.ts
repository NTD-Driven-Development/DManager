import { Request, Response, NextFunction } from "express"
import ProjectService from "../services/ProjectService"
import HttpResponse from "../../utils/httpResponse"
import Db from "../../models"
import Sequelize from "sequelize"

export default new (class ProjectController {
    public async getAllProjectsData(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await ProjectService.getAllProjectsData()
            next(HttpResponse.success(data))
        } catch (error) {
            next(error)
        }
    }

    public async createProject(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await ProjectService.createProject(req.body)
            next(HttpResponse.success(data, 201))
        } catch (error) {
            next(error)
        }
    }

    public async updateProject(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            await Db.sequelize.transaction(async (t: Sequelize.Transaction) => {
                const data = await ProjectService.updateProject(req.body)
                next(HttpResponse.success(data))
            })
        } catch (error) {
            next(error)
        }
    }

    public async deleteProject(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            await Db.sequelize.transaction(async (t: Sequelize.Transaction) => {
                const data = await ProjectService.deleteProject(req.params.id)
                next(HttpResponse.success(data))
            })
        } catch (error) {
            next(error)
        }
    }
})()
