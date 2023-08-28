import { Request, Response, NextFunction } from "express"
import ClassService from "../services/ClassService"
import HttpResponse from "../../utils/httpResponse"
import Db from "../../models"
import Sequelize from "sequelize"

export default new (class ClassController {
    public async getClasses(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await ClassService.getClasses(
                req.query as any
            )
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }

    public async createClass(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await ClassService.createClass(req.body as any)
            next(HttpResponse.success(data, 201))
        } catch (error) {
            next(error)
        }
    }

    public async updateClass(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await ClassService.updateClass(req.body as any)
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }

    public async deleteClass(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await ClassService.deleteClass(req.params.id)
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }
})()