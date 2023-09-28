import { Express, Request, Response, Router } from "express"
import NoteController from "../../core/controllers/NoteController"
import jwtAuth from "../../middlewares/jwtAuth"
import validate from "../../middlewares/validateRequest"
import permission from "../../middlewares/permission"

const router = Router()

router
    .use(jwtAuth("jwt"))
    .use(permission)
    // 取得住宿生記事列表
    .get("/boarder", NoteController.getBoarderNotes)
    // 取得單筆住宿生記事
    .get("/boarder/:id", NoteController.getBoarderNoteById)
    // 建立住宿生記事
    .post("/boarder", NoteController.createBoarderNote)
    // 修改住宿生記事
    .put("/boarder", NoteController.updateBoarderNote)
    // 刪除住宿生記事
    .delete("/boarder/:id", NoteController.deleteBoarderNote)

export default router
