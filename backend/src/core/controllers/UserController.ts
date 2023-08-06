import { Request, Response, NextFunction } from "express"
import UserService from "../services/UserService"
import HttpResponse from "../../utils/httpResponse"

export default new (class UserController {
    public async getAllUsersData(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await UserService.getAllUsersData()
            const response: HttpResponse = HttpResponse.success(data)
            return res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    }

    public async getUserDataById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params
            const data = await UserService.getUserDataById(id)
            const response: HttpResponse = HttpResponse.success(data)
            return res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    }

    public async createNewUser(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { body } = req
            const data = await UserService.createUser(body)
            const response: HttpResponse = HttpResponse.success(data)
            return res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    }

    public async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { body } = req
            const data = await UserService.updateUser(body)
            const response: HttpResponse = HttpResponse.success(data)
            return res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    }

    public async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const data = await UserService.deleteUser(id)
            const response: HttpResponse = HttpResponse.success(data)
            return res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    }
})()
