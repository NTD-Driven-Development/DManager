import { Express, Request, Response, Router } from "express"
import ClassController from "../../core/controllers/ClassController"
import jwtAuth from "../../middlewares/jwtAuth"
import validate from "../../middlewares/validateRequest"

const router = Router()

router.use(jwtAuth("jwt"));
router.get("", ClassController.getClasses)
router.get("/:id", ClassController.getClassById)
router.post("", ClassController.createClass)
router.put("", ClassController.updateClass)
router.delete("/:id", ClassController.deleteClass)

export default router
