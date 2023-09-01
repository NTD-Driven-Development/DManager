import { Express, Request, Response, Router } from "express"
import NoteController from "../../core/controllers/NoteController"
import jwtAuth from "../../middlewares/jwtAuth"
import validate from "../../middlewares/validateRequest"

const router = Router()

router.use(jwtAuth("jwt"));
router.get("/boarder", NoteController.getBoarderNotes)
router.get("/boarder/:id", NoteController.getBoarderNoteById)
router.post("/boarder", NoteController.createBoarderNote)
router.put("/boarder", NoteController.updateBoarderNote)
router.delete("/boarder/:id", NoteController.deleteBoarderNote)

export default router
