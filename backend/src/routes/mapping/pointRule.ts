import { Express, Request, Response, Router } from "express"
import PointRuleController from "../../core/controllers/PointRuleController"
import jwtAuth from "../../middlewares/jwtAuth"
import validate from "../../middlewares/validateRequest"

const router = Router()

router.use(jwtAuth("jwt"));
// 取得加扣點紀錄
router.get("/log", PointRuleController.getPointLogs)
// 新增加扣點紀錄
router.post("/log", PointRuleController.createPointLog)
// 刪除加扣點紀錄
router.delete("/log/:id", PointRuleController.deletePointLog)
// 取得加扣點規則
router.get("", PointRuleController.getPointRules)
// 取得單筆加扣點規則
router.get("/:id", PointRuleController.getPointRuleById)
// 新增加扣點規則
router.post("", PointRuleController.createPointRule)
// 修改加扣點規則
router.put("", PointRuleController.updatePointRule)
// 刪除加扣點規則
router.delete("/:id", PointRuleController.deletePointRule)

export default router
