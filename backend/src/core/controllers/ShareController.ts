import { Request, Response, NextFunction } from "express"
import ShareService from "../services/ShareService"
import HttpResponse from "../../utils/httpResponse"

export default new (class ShareController {
    public async getBunks(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ShareService.getBunks()
            next(HttpResponse.success(data))
        } catch (error) {
            next(error)
        }
    }

    public async getClasses(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ShareService.getClasses()
            next(HttpResponse.success(data))
        } catch (error) {
            next(error)
        }
    }

    public async getBoarderStatuses(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await ShareService.getBoarderStatuses()
            next(HttpResponse.success(data))
        } catch (error) {
            next(error)
        }
    }

    public async getBoarderRoles(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const project_id = req.query?.project_id as string
            const data = await ShareService.getBoarderRoles(project_id)
            next(HttpResponse.success(data))
        } catch (error) {
            next(error)
        }
    }

    public async getTelCardContacters(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await ShareService.getTelCardContacters()
            next(HttpResponse.success(data))
        } catch (error) {
            next(error)
        }
    }

    public async getPointRules(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await ShareService.getPointRules()
            next(HttpResponse.success(data))
        } catch (error) {
            next(error)
        }
    }

    public async getProjects(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ShareService.getProjects()
            next(HttpResponse.success(data))
        } catch (error) {
            next(error)
        }
    }

    public async getBoardersFromProject(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const project_id = req.query?.project_id as string
            const data = await ShareService.getBoardersFromProject(project_id)
            next(HttpResponse.success(data))
        } catch (error) {
            next(error)
        }
    }
})()
