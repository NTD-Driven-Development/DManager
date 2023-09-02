import { Request, Response, NextFunction } from "express"

export default new (class SseController {
    sseTest = (req: Request, res: Response, next: NextFunction) => {
        try {
            const intervalTime = 3000
            res.writeHead(200, {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no",
            })

            const interval = setInterval(() => {
                const date = new Date().toLocaleTimeString()
                res.write(`data: ${date}\n\n`)
                console.log("Sending data", date)
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
