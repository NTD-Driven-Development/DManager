import { Request, Response, NextFunction } from "express"
import BoarderService from "../services/BoarderService"
import HttpResponse from "../../utils/httpResponse"
import Db from "../../models"
import Sequelize, { Transaction } from "sequelize"
import RequestUser from "../exportDtos/auth/RequestUser"

export default new (class BoarderController {
    public async getBoardersFromProject(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const project_id = req.query?.project_id as string
            const data = await BoarderService.getBoardersFromProject(
                project_id,
                req.query as any
            )
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }

    public async getBoarderById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await BoarderService.getBoarderById(req.params.id)
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }

    public async updateBoarder(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            await Db.sequelize.transaction(async (t: Transaction) => {
                const data = await BoarderService.updateBoarder(
                    req.body as any,
                    req.user as RequestUser
                )
                t.afterCommit(() => {
                    next(HttpResponse.success(data, 200))
                })
            })
        } catch (error) {
            next(error)
        }
    }

    public async deleteBoarder(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await BoarderService.deleteBoarder(
                req.params.id,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }
})()
