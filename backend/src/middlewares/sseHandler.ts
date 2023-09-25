import { NextFunction } from "express"
import { IRequest, IResponse } from "../core/interfaces/IHttp"
import SseResponse from "../utils/sseResponse"
import moment from "moment"

export default (
    handle: SseResponse,
    req: IRequest,
    res: IResponse,
    next: NextFunction
) => {
    if (handle instanceof SseResponse) {
        console.log(moment().toDate(), "sse connected")
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        })
        res.write(`data: ${JSON.stringify(handle.data)}\n\n`)
        const interval = setInterval(async () => {
            try {
                const data = await handle.dataCallback()
                res.write(`data: ${JSON.stringify(data)}\n\n`)
            } catch (e) {
                console.log(moment().toDate(), e)
                res.end()
                clearInterval(interval)
            }
        }, handle.intervalTime)
        res.on("error", (err) => {
            console.error(moment().toDate(), `Error: ${err}`)
            clearInterval(interval)
        })
        res.on("close", () => {
            console.log(moment().toDate(), "sse closed")
            clearInterval(interval)
        })
        req.on("error", (err) => {
            console.error(moment().toDate(), `Error: ${err}`)
            clearInterval(interval)
            res.end()
        })
        req.on("close", () => {
            console.log(moment().toDate(), "Client disconnected")
            clearInterval(interval)
            res.end()
        })
    }
    return next(handle)
}
