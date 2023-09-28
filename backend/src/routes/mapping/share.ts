import { Express, Request, Response, Router } from "express"
import ShareController from "../../core/controllers/ShareController"
import jwtAuth from "../../middlewares/jwtAuth"
import permission from "../../middlewares/permission"

const router = Router()

router
    .use(jwtAuth("jwt"))
    .use(permission)
    // 取得樓區室床
    .get("/bunks", ShareController.getBunks)
    // 取得班級
    .get("/classes", ShareController.getClasses)
    // 取得住宿生狀態
    .get("/boarderStatuses", ShareController.getBoarderStatuses)
    // 取得住宿生角色
    .get("/boarderRoles", ShareController.getBoarderRoles)
    // 取得電話卡聯絡人
    .get("/telCards/contacter", ShareController.getTelCardContacters)
    // 取得加扣點規則
    .get("/points/rule", ShareController.getPointRules)
    // 取得項目
    .get("/projects", ShareController.getProjects)
    // 取得某項目住宿生
    .get("/boarders", ShareController.getBoarders)
    // 取得角色
    .get("/roles", ShareController.getRoles)
    // 取得使用者
    .get("/users", ShareController.getUsers)
export default router
