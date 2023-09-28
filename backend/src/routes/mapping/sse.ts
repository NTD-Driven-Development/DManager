import { Express, Request, Response, Router } from "express"
import SseController from "../../core/controllers/SseController"
import jwtAuth from "../../middlewares/jwtAuth"
import permission from "../../middlewares/permission"

const router = Router()

router
    // .use(jwtAuth("jwt"))
    // .use(permission)
    .get("/boarders", SseController.getAreaOfBoarderStatus)

export default router
