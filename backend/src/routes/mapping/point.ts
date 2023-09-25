import { Express, Request, Response, Router } from "express"
import PointController from "../../core/controllers/PointController"
import jwtAuth from "../../middlewares/jwtAuth"
import validate from "../../middlewares/validateRequest"
import sysLog from "../../middlewares/sysLog"
import sysErrorLog from "../../middlewares/sysErrorLog"

const router = Router()

router
    .use(jwtAuth("jwt"))
    // 取得加扣點紀錄
    .get("/log", PointController.getPointLogs)
    // 取得單筆加扣點紀錄
    .get("/log/:id", PointController.getPointLogById)
    // 新增加扣點紀錄
    .post("/log", PointController.createPointLog)
    // 刪除加扣點紀錄
    .delete("/log/:id", PointController.deletePointLog)
    // 取得加扣點規則
    .get("/rule", PointController.getPointRules)
    // 取得單筆加扣點規則
    .get("/rule/:id", PointController.getPointRuleById)
    // 新增加扣點規則
    .post("/rule", PointController.createPointRule)
    // 修改加扣點規則
    .put("/rule", PointController.updatePointRule)
    // 刪除加扣點規則
    .delete("/rule/:id", PointController.deletePointRule)

export default router
