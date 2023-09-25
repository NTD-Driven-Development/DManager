import { Express, Request, Response, Router } from "express"
import BoarderRoleController from "../../core/controllers/BoarderRoleController"
import jwtAuth from "../../middlewares/jwtAuth"
import validate from "../../middlewares/validateRequest"

const router = Router()

router
    .use(jwtAuth("jwt"))
    // 取得住宿生角色列表
    .get("", BoarderRoleController.getBoarderRoles)
    // 取得單筆住宿生角色
    .get("/:id", BoarderRoleController.getBoarderRoleById)
    // 建立住宿生角色
    .post("", BoarderRoleController.createBoarderRole)
    // 修改住宿生角色
    .put("", BoarderRoleController.updateBoarderRole)
    // 刪除住宿生角色
    .delete("/:id", BoarderRoleController.deleteBoarderRole)

export default router
