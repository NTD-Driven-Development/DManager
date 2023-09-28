import { Express, Request, Response, Router } from "express"
import BoarderStatusController from "../../core/controllers/BoarderStatusController"
import jwtAuth from "../../middlewares/jwtAuth"
import validate from "../../middlewares/validateRequest"
import permission from "../../middlewares/permission"

const router = Router()

router
    .use(jwtAuth("jwt"))
    .use(permission)
    // 取得住宿生狀態列表
    .get("", BoarderStatusController.getBoarderStatuses)
    // 取得單筆住宿生狀態
    .get("/:id", BoarderStatusController.getBoarderStatuseById)
    // 新增住宿生狀態
    .post("", BoarderStatusController.createBoarderStatus)
    // 修改住宿生狀態
    .put("", BoarderStatusController.updateBoarderStatus)
    // 刪除住宿生狀態
    .delete("/:id", BoarderStatusController.deleteBoarderStatus)

export default router
