import { Express, Request, Response, Router } from "express"
import ExportController from "../../core/controllers/ExportController"
import jwtAuth from "../../middlewares/jwtAuth"
import validate from "../../middlewares/validateRequest"

const router = Router()

router
    .use(jwtAuth("jwt"))
    // 加扣點與電話卡紀錄匯出
    .get("/pointsCheck", ExportController.getBoarderPointAndTelCardLogs)

export default router
