import { Express, Request, Response, Router } from "express"
import TelCardController from "../../core/controllers/TelCardController"
import jwtAuth from "../../middlewares/jwtAuth"
import validate from "../../middlewares/validateRequest"

const router = Router()

router
    .use(jwtAuth("jwt"))
    // 取得住宿生電話卡紀錄
    .get("/log", TelCardController.getTelCardLogs)
    // 取得單筆住宿生電話卡紀錄
    .get("/log/:id", TelCardController.getTelCardLogById)
    // 新增住宿生電話卡紀錄
    .post("/log", TelCardController.createTelCardLog)
    // 刪除住宿生電話卡紀錄
    .delete("/log/:id", TelCardController.deleteTelCardLog)
    // 取得電話卡聯絡人
    .get("/contacter", TelCardController.getTelCardContacters)
    // 取得單筆電話卡聯絡人
    .get("/contacter/:id", TelCardController.getTelCardContacterById)
    // 新增電話卡聯絡人
    .post("/contacter", TelCardController.createTelCardContacter)
    // 修改電話卡聯絡人
    .put("/contacter", TelCardController.updateTelCardContacter)
    // 刪除電話卡聯絡人
    .delete("/contacter/:id", TelCardController.deleteTelCardContacter)

export default router
