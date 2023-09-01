import { Request, Response, NextFunction } from "express"
import NoteService from "../services/NoteService"
import HttpResponse from "../../utils/httpResponse"
import Db from "../../models"
import Sequelize from "sequelize"
import RequestUser from "../exportDtos/auth/RequestUser"

export default new (class NoteController {
    public async getBoarderNotes(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await NoteService.getBoarderNotes(
                req.query as any
            )
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }

    public async getBoarderNoteById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await NoteService.getBoarderNoteById(req.params.id)
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }

    public async createBoarderNote(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await NoteService.createBoarderNote(req.body as any, req.user as RequestUser)
            next(HttpResponse.success(data, 201))
        } catch (error) {
            next(error)
        }
    }

    public async updateBoarderNote(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await NoteService.updateBoarderNote(req.body as any, req.user as RequestUser)
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }

    public async deleteBoarderNote(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = await NoteService.deleteBoarderNote(req.params.id, req.user as RequestUser)
            next(HttpResponse.success(data, 200))
        } catch (error) {
            next(error)
        }
    }
})()
