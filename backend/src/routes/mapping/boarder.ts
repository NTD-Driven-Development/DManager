import { Express, Request, Response, Router } from "express"
import BoarderController from "../../core/controllers/BoarderController"
import jwtAuth from "../../middlewares/jwtAuth"
import validate from "../../middlewares/validateRequest"

const router = Router()

router
    .use(jwtAuth("jwt"))
    // 取得住宿生
    .get("", BoarderController.getBoarders)
    // 取得單筆住宿生
    .get("/:id", BoarderController.getBoarderById)
    // 建立住宿生
    .post("", BoarderController.createBoarder)
    // 修改住宿生
    .put("", BoarderController.updateBoarder)
    // 刪除住宿生
    .delete("/:id", BoarderController.deleteBoarder)

export default router
