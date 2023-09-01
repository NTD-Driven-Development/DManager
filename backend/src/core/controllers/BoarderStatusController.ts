import { Request, Response, NextFunction } from "express"
import BoarderService from "../services/BoarderService"
import HttpResponse from "../../utils/httpResponse"
import Db from "../../models"
import RequestUser from "../exportDtos/auth/RequestUser"

export default new (class BoarderStatusController {
    public async getBoarderStatuses(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await BoarderService.getBoarderStatuses(
                req.query as any
            )
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }

    public async getBoarderStatuseById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const id = req.params.id
            const data = await BoarderService.getBoarderStatusById(id)
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }

    public async createBoarderStatus(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await BoarderService.createBoarderStatus(
                req.body as any,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, 201))
        } catch (error) {
            next(error)
        }
    }

    public async updateBoarderStatus(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await BoarderService.updateBoarderStatus(
                req.body as any,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }

    public async deleteBoarderStatus(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await BoarderService.deleteBoarderStatus(
                req.params.id,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }
})()
