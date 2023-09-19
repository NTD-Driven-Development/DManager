import { NextFunction } from "express"
import { IRequest, IResponse } from "../../core/interfaces/IHttp"
import _ from "lodash"
import SSEService from "../services/SseService"
import SseResponse from "../../utils/sseResponse"
import route from "../../utils/route"

export default new (class SseController {
    public async getAreaOfBoarderStatus(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
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
            next(SseResponse.send(data, dataCallback, intervalTime))
        } catch (error: any) {
            next(error)
        }
    }
})()
