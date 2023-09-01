import { Request, Response, NextFunction } from "express"
import PointService from "../services/PointService"
import HttpResponse from "../../utils/httpResponse"
import Db from "../../models"
import Sequelize from "sequelize"
import RequestUser from "../exportDtos/auth/RequestUser"

export default new (class PointController {
    public async getPointRules(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await PointService.getPointRules(req.query as any)
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }

    public async getPointRuleById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await PointService.getPointRuleById(req.params.id)
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }

    public async createPointRule(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await PointService.createPointRule(
                req.body as any,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, 201))
        } catch (error) {
            next(error)
        }
    }

    public async updatePointRule(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await PointService.updatePointRule(
                req.body as any,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }

    public async deletePointRule(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await PointService.deletePointRule(
                req.params.id,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }

    public async getPointLogs(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await PointService.getPointLogs(req.query as any)
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }

    public async getPointLogById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await PointService.getPointLogById(req.params.id)
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }

    public async createPointLog(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await PointService.createPointLog(
                req.body as any,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, 201))
        } catch (error) {
            next(error)
        }
    }

    public async deletePointLog(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await PointService.deletePointLog(
                req.params.id,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }
})()
