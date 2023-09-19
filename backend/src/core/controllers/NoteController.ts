import { NextFunction } from "express"
import { IRequest, IResponse } from "../../core/interfaces/IHttp"
import NoteService from "../services/NoteService"
import HttpResponse from "../../utils/httpResponse"
import Db from "../../models"
import RequestUser from "../exportDtos/auth/RequestUser"
import route from "../../utils/route"

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
            next(HttpResponse.success(data, "建立住宿生記事"))
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
            const data = await NoteService.updateBoarderNote(
                req.body as any,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, "修改住宿生記事"))
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
            const data = await NoteService.deleteBoarderNote(
                req.params.id,
                req.user as RequestUser
            )
            next(HttpResponse.success(data, "刪除住宿生記事"))
        } catch (error: any) {
            next(error)
        }
    }
})()
