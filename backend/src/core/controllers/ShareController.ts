import { Request, Response, NextFunction } from "express"
import ShareService from "../services/ShareService"
import HttpResponse from "../../utils/httpResponse"

export default new (class ShareController {
    public async getBunks (req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ShareService.getBunks()
            next(HttpResponse.success(data))
        } catch (error) {
            next(error)
        }
    }

    public async getClasses (req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ShareService.getClasses()
            next(HttpResponse.success(data))
        } catch (error) {
            next(error)
        }
    }
})()
