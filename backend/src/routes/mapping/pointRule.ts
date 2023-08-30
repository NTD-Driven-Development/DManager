import { Express, Request, Response, Router } from "express"
import PointRuleController from "../../core/controllers/PointRuleController"
import jwtAuth from "../../middlewares/jwtAuth"
import validate from "../../middlewares/validateRequest"

const router = Router()

router.use(jwtAuth("jwt"));
router.get("", PointRuleController.getPointRules)
router.post("", PointRuleController.createPointRule)
router.put("", PointRuleController.updatePointRule)
router.delete("/:id", PointRuleController.deletePointRule)

export default router
