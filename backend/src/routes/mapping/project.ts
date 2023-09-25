import { Express, Request, Response, Router } from "express"
import ProjectController from "../../core/controllers/ProjectController"
import jwtAuth from "../../middlewares/jwtAuth"
import validate from "../../middlewares/validateRequest"

const router = Router()

router
    .use(jwtAuth("jwt"))
    // 取得所有項目
    .get("", ProjectController.getProjects)
    // 取得單筆項目資料
    .get("/:id", ProjectController.getProjectById)
    // 匯入該項目住宿生 & 床位對應資訊
    .post("/import", [], ProjectController.importBoardersData)
    // 交換床位
    .post("/:id/swapBunk", [], ProjectController.swapBunk)
    // 建立項目
    .post("", [], ProjectController.createProject)
    // 修改項目
    .put("", ProjectController.updateProject)
    // 刪除項目
    .delete("/:id", ProjectController.deleteProject)

export default router
