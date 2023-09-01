import { Request, Response, NextFunction } from "express"
import BoarderService from "../services/BoarderService"
import HttpResponse from "../../utils/httpResponse"
import Db from "../../models"
import RequestUser from "../exportDtos/auth/RequestUser"

export default new (class BoarderRoleController {
    public async getBoarderRoles(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await BoarderService.getBoarderRoles(req.query as any)
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }

    public async getBoarderRoleById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await BoarderService.getBoarderRoleById(req.params.id)
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }

    public async createBoarderRole(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await BoarderService.createBoarderRole(
                req.body as any,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, 201))
        } catch (error) {
            next(error)
        }
    }

    public async updateBoarderRole(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await BoarderService.updateBoarderRole(
                req.body as any,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }

    public async deleteBoarderRole(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await BoarderService.deleteBoarderRole(
                req.params.id,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }
})()
