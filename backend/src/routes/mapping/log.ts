import { Express, Request, Response, Router } from "express"
import LogController from "../../core/controllers/LogController"
import jwtAuth from "../../middlewares/jwtAuth"
import permission from "../../middlewares/permission"

const router = Router()

router
    .use(jwtAuth("jwt"))
    .use(permission)
    // 取得系統操作紀錄
    .get("/operation", LogController.getOperationLogs)
export default router
