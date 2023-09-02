import { Request, Response, NextFunction } from "express"
import _ from "lodash"
import SSEService from "../services/SseService"

export default new (class SseController {
    getAreaOfBoarderStatus = (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const intervalTime = _.toInteger(process.env.SSE_INTERVAL) || 3000
            res.writeHead(200, {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no",
            })
            const interval = setInterval(async () => {
                const data = await SSEService.getAreaOfBoarderStatus(
                    req.query as any
                )
                res.write(`data: ${JSON.stringify(data)}\n\n`)
                console.log("Sending data")
            }, intervalTime)
            req.on("error", (err) => {
                console.error(`Error: ${err}`)
                clearInterval(interval)
                res.end()
            })
            req.on("close", () => {
                console.log("Client disconnected")
                clearInterval(interval)
                res.end()
            })
        } catch (error) {
            next(error)
        }
    }
})()
