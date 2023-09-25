import { Express, Request, Response, Router } from "express"
import ClassController from "../../core/controllers/ClassController"
import jwtAuth from "../../middlewares/jwtAuth"
import validate from "../../middlewares/validateRequest"

const router = Router()

router
    .use(jwtAuth("jwt"))
    // 取得班級列表
    .get("", ClassController.getClasses)
    // 取得單筆班級
    .get("/:id", ClassController.getClassById)
    // 建立班級
    .post("", ClassController.createClass)
    // 修改班級
    .put("", ClassController.updateClass)
    // 刪除班級
    .delete("/:id", ClassController.deleteClass)

export default router
