import os from "os"
import { Request } from "express"


const getServerIp = () => {
    const interfaces = os.networkInterfaces()
    let ip = ""
    for (const devName in interfaces) {
        const iface = interfaces[devName]
        if (!iface) continue
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i]
            if (
                alias.family === "IPv4" &&
                alias.address !== '' &&
                !alias.internal
            ) {
                ip = alias.address
            }
        }
    }
    return ip
}

const getClientIp = (req: Request): string => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress
    if (!ip) return ""
    if (typeof ip === "string") return ip
    return ip.join(",")
}

export default {
    getServerIp,
    getClientIp,
}
