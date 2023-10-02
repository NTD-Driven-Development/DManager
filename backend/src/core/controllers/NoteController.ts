import { NextFunction } from "express"
import { IRequest, IResponse } from "../../core/interfaces/IHttp"
import NoteService from "../services/NoteService"
import HttpResponse from "../../utils/httpResponse"
import Db from "../../models"
import RequestUser from "../exportDtos/auth/RequestUser"
import route from "../../utils/route"
import log from "../../utils/log"
import { Transaction } from "sequelize"

export default new (class NoteController {
    public async getBoarderNotes(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await NoteService.getBoarderNotes(req.query as any)
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async getBoarderNoteById(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await NoteService.getBoarderNoteById(req.params.id)
            next(HttpResponse.success(data))
        } catch (error: any) {
            next(error)
        }
    }

    public async createBoarderNote(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            const data = await NoteService.createBoarderNote(
                req.body as any,
                req.user as RequestUser
            )
            const afterCreateData = await NoteService.getBoarderNoteById(
                data.id as number
            )
            res.logMessage = log.logFormatJson(afterCreateData)
            next(HttpResponse.success(data, null, 201))
        } catch (error: any) {
            next(error)
        }
    }

    public async updateBoarderNote(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            await Db.sequelize.transaction(async (t: Transaction) => {
                const beforeUpdateData = await NoteService.getBoarderNoteById(
                    req.body?.id
                )
                const data = await NoteService.updateBoarderNote(
                    req.body as any,
                    req.user as RequestUser
                )
                t.afterCommit(() => {
                    res.logMessage = log.logFormatJson(beforeUpdateData)
                    next(HttpResponse.success(data))
                })
            })
        } catch (error: any) {
            next(error)
        }
    }

    public async deleteBoarderNote(
        req: IRequest,
        res: IResponse,
        next: NextFunction
    ) {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
            await Db.sequelize.transaction(async (t: Transaction) => {
                const beforeDeleteData = await NoteService.getBoarderNoteById(
                    req.params.id
                )
                const data = await NoteService.deleteBoarderNote(
                    req.params.id,
                    req.user as RequestUser
                )
                t.afterCommit(() => {
                    res.logMessage = log.logFormatJson(beforeDeleteData)
                    next(HttpResponse.success(data))
                })
            })
        } catch (error: any) {
            next(error)
        }
    }
})()
