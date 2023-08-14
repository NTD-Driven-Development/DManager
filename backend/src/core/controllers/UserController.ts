import { Request, Response, NextFunction } from "express"
import UserService from "../services/UserService"
import HttpResponse from "../../utils/httpResponse"

export default new (class UserController {
    public async createUser (req: Request, res: Response, next: NextFunction) {
        try {
            const data = await UserService.createUser(req.body)
            const response: HttpResponse = HttpResponse.success(data)
            return res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    }
})()
