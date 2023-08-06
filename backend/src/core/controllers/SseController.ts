import { Request, Response, NextFunction } from "express"

export default new class SseController {
    sseTest = (req: Request, res: Response, next: NextFunction) => {
        try {
            // const retryTime = 10000
            const intervalTime = 3000
            res.writeHead(200, {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Access-Control-Allow-Origin": "*",
                Connection: "keep-alive",
            })

            const interval = setInterval(() => {
                res.write(`data: ${new Date().toLocaleTimeString()}\n\n`)
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
}