import { Request, Response, NextFunction } from "express"
import BoarderService from "../services/BoarderService"
import HttpResponse from "../../utils/httpResponse"
import Db from "../../models"
import Sequelize from "sequelize"

export default new (class BoarderController {
    public async getBoardersFromProject (req: Request, res: Response, next: NextFunction) {
        try {
            const project_id = req.query?.project_id as string
            const data = await BoarderService.getBoardersFromProject(project_id, req.query as any)
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }
})()
