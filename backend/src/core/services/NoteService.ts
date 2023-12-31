import _ from "lodash"
import HttpException from "../../exceptions/HttpException"
import { withPagination } from "../../utils/pagination"
import IPaginationResultDto from "../exportDtos/PaginationResultDto"
import BoarderNoteDao from "../daos/BoarderNoteDao"
import { BoarderNoteModel } from "../../models/BoarderNote"
import RequestUser from "../exportDtos/auth/RequestUser"
import strings from "../../utils/strings"
import { ProjectBunkModel } from "../../models/ProjectBunk"

export default new (class BoarderNoteService {
    public async getBoarderNotes(query?: {
        offset?: number
        limit?: number
        project_id?: number
        search?: string
    }): Promise<IPaginationResultDto<BoarderNoteModel>> {
        let data = await BoarderNoteDao.findAll()

        if (query?.project_id) {
            data = _.filter(
                data,
                (item) => item.boarder?.project?.id == query.project_id
            )
        }
        if (query?.search) {
            data = _.filter(data, (item) => {
                const bunk = strings.formatBunkString(
                    item?.boarder?.project_bunk as ProjectBunkModel
                )
                return (
                    _.includes(item.boarder?.name, query.search) ||
                    _.includes(item.title, query.search) ||
                    _.includes(item.description, query.search) ||
                    _.includes(bunk, query.search)
                )
            })
        }
        return withPagination(data.length, data, query?.offset, query?.limit)
    }

    public async getBoarderNoteById(
        id: string | number
    ): Promise<BoarderNoteModel> {
        const result = await BoarderNoteDao.findOneById(id as number)
        if (!result) {
            throw new HttpException("查無資料", 400)
        }
        return result
    }

    public async createBoarderNote(
        payload: BoarderNoteModel,
        user: RequestUser
    ): Promise<BoarderNoteModel> {
        try {
            const model = {
                ...payload,
                created_by: user.id,
            }
            const result = await BoarderNoteDao.create(model)
            return result
        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new HttpException(error.message, 500)
        }
    }

    public async updateBoarderNote(
        payload: BoarderNoteModel,
        user: RequestUser
    ): Promise<boolean> {
        try {
            const model = {
                ...payload,
                updated_by: user.id,
            }
            const result = await BoarderNoteDao.update(model)
            if (result.affectedRows === 0) {
                throw new HttpException("查無資料", 400)
            }
            return true
        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new HttpException(error.message, 500)
        }
    }

    public async deleteBoarderNote(
        id: string | number,
        user: RequestUser
    ): Promise<boolean> {
        const result = await BoarderNoteDao.delete(id as number, user.id)
        if (result.affectedRows === 0) {
            throw new HttpException("查無資料", 400)
        }
        return true
    }
})()
