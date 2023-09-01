import { Request, Response, NextFunction } from "express"
import TelCardService from "../services/TelCardService"
import HttpResponse from "../../utils/httpResponse"
import Db from "../../models"
import RequestUser from "../exportDtos/auth/RequestUser"

export default new (class TelCardController {
    public async getTelCardContacters(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await TelCardService.getTelCardContacters(
                req.query as any
            )
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }

    public async getTelCardContacterById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await TelCardService.getTelCardContacterById(
                req.params.id
            )
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }

    public async createTelCardContacter(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await TelCardService.createTelCardContacter(
                req.body as any,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, 201))
        } catch (error) {
            next(error)
        }
    }

    public async updateTelCardContacter(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await TelCardService.updateTelCardContacter(
                req.body as any,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }

    public async deleteTelCardContacter(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await TelCardService.deleteTelCardContacter(
                req.params.id,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }

    public async getTelCardLogs(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await TelCardService.getTelCardLogs(req.query as any)
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }

    public async getTelCardLogById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await TelCardService.getTelCardLogById(req.params.id)
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }

    public async createTelCardLog(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await TelCardService.createTelCardLog(
                req.body as any,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, 201))
        } catch (error) {
            next(error)
        }
    }

    public async deleteTelCardLog(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await TelCardService.deleteTelCardLog(
                req.params.id,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }
})()
