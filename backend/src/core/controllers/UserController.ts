import { Request, Response, NextFunction } from "express"
import UserService from "../services/UserService"
import HttpResponse from "../../utils/httpResponse"
import Db from "../../models"
import Sequelize from "sequelize"

export default new (class UserController {
    public async createUser (req: Request, res: Response, next: NextFunction) {
        try {
            await Db.sequelize.transaction(async (t: Sequelize.Transaction) => {
                const data = await UserService.createUser(req.body)
                next(HttpResponse.success(data, 201))
            })
        } catch (error) {
            next(error)
        }
    }
})()
