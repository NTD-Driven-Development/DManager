import { Express, Request, Response, Router } from "express"
import authRouter from "./mapping/auth"
import sseRouters from "./mapping/sse"
import userRouters from "./mapping/user"
import shareRouters from "./mapping/share"
import projectRouters from "./mapping/project"
import boarderRouters from "./mapping/boarder"
import boarderRoleRouters from "./mapping/boarderRole"
import boarderStatusRouters from "./mapping/boarderStatus"
import classRouters from "./mapping/class"
import pointRouters from "./mapping/point"
import telCardRouters from "./mapping/telCard"
import noteRouters from "./mapping/note"
import exportRouters from "./mapping/export"
import logRouters from "./mapping/log"

const router = Router()

router
    .use("/auth", authRouter)
    .use("/sse", sseRouters)
    .use("/users", userRouters)
    .use("/share", shareRouters)
    .use("/projects", projectRouters)
    .use("/boarders", boarderRouters)
    .use("/boarderRoles", boarderRoleRouters)
    .use("/boarderStatuses", boarderStatusRouters)
    .use("/classes", classRouters)
    .use("/points", pointRouters)
    .use("/telCards", telCardRouters)
    .use("/notes", noteRouters)
    .use("/exports", exportRouters)
    .use("/logs", logRouters)
export default router
