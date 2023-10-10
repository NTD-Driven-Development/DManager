import app from "./app"
import { createServer } from "http"

const server = createServer(app.getExpressApp())
const host = process.env.NODE_HOST || "localhost"
const port = parseInt(process.env.NODE_PORT || "8001") || 8001

server.listen(port, host)

server.on("close", function () {
    console.log("DManager Server closed")
})

server.on("listening", function () {
    console.log(`DManager Server listening on ${host}:${port}`)
})

server.on("error", (error: any) => {
    console.log(`DManager Server error: ${error.message}`)
})

export default server
