import { Express, Request, Response, Router } from "express"
import PointController from "../../core/controllers/PointController"
import jwtAuth from "../../middlewares/jwtAuth"
import validate from "../../middlewares/validateRequest"

const router = Router()

router.use(jwtAuth("jwt"));
// 取得加扣點紀錄
router.get("/log", PointController.getPointLogs)
// 新增加扣點紀錄
router.post("/log", PointController.createPointLog)
// 刪除加扣點紀錄
router.delete("/log/:id", PointController.deletePointLog)
// 取得加扣點規則
router.get("/rule", PointController.getPointRules)
// 取得單筆加扣點規則
router.get("/rule/:id", PointController.getPointRuleById)
// 新增加扣點規則
router.post("/rule", PointController.createPointRule)
// 修改加扣點規則
router.put("/rule", PointController.updatePointRule)
// 刪除加扣點規則
router.delete("/rule/:id", PointController.deletePointRule)

export default router
