import { Request, Response, NextFunction } from "express"
import _ from "lodash"
import SSEService from "../services/SseService"
import SseResponse from "../../utils/sseResponse"

export default new (class SseController {
    public async getAreaOfBoarderStatus(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const intervalTime = _.toInteger(process.env.SSE_INTERVAL) || 3000
            const data = await SSEService.getAreaOfBoarderStatus(
                req.query as any
            )
            const dataCallback = async () => {
                const data = await SSEService.getAreaOfBoarderStatus(
                    req.query as any
                )
                return data
            }
            next(SseResponse.success(data, dataCallback, intervalTime))
        } catch (error) {
            next(error)
        }
    }
})()
