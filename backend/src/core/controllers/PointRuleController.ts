import { Request, Response, NextFunction } from "express"
import PointRuleService from "../services/PointRuleService"
import HttpResponse from "../../utils/httpResponse"
import Db from "../../models"
import Sequelize from "sequelize"
import RequestUser from "../exportDtos/auth/RequestUser"

export default new (class PointRuleController {
    public async getPointRules(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await PointRuleService.getPointRules(req.query as any)
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
            const data = await PointRuleService.getPointRuleById(req.params.id)
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
            const data = await PointRuleService.createPointRule(
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
            const data = await PointRuleService.updatePointRule(
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
            const data = await PointRuleService.deletePointRule(
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
            const data = await PointRuleService.getPointLogs(req.query as any)
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
            const data = await PointRuleService.createPointLog(
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
            const data = await PointRuleService.deletePointLog(
                req.params.id,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }
})()
