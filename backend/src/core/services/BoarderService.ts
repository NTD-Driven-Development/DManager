import _ from "lodash"
import BoarderDao, { BoarderData } from "../daos/BoarderDao"
import { BoarderModel } from "../../models/Boarder"
import HttpException from "../../exceptions/HttpException"
import { withPagination } from "../../utils/pagination"
import IPaginationResultDto from "../exportDtos/PaginationResultDto"
import ProjectDao from "../daos/ProjectDao"

export default new (class BoarderService {
    public async getBoardersFromProject(
        project_id: string | number,
        query?: {
            offset: number
            limit: number
        }
    ): Promise<IPaginationResultDto<BoarderData>> {
        const data = await BoarderDao.findAll()
        const dataFromProject = _.filter(
            data,
            (item) => item.project_id == project_id
        )
        // sort by floor, room_type, room_no, bed
        const result = _.sortBy(dataFromProject, [
            (dataFromProject) => dataFromProject?.project_bunk?.floor,
            (dataFromProject) => dataFromProject?.project_bunk?.room_type,
            (dataFromProject) => dataFromProject?.project_bunk?.room_no,
            (dataFromProject) => dataFromProject?.project_bunk?.bed,
        ])
        return withPagination(
            result.length,
            result,
            query?.offset,
            query?.limit
        )
    }

    public async getBoarderById(id: string | number): Promise<BoarderData> {
        const result = await BoarderDao.findOneById(id)
        if (!result) {
            throw new HttpException("查無資料", 400)
        }
        return result
    }

    public async updateBoarder(boarder: BoarderModel): Promise<boolean> {
        const result = await BoarderDao.update(boarder)
        if (result.affectedRows === 0) {
            throw new HttpException("查無資料", 400)
        }
        return true
    }

    public async deleteBoarder(id: string): Promise<boolean> {
        const result = await BoarderDao.deleteById(id)
        if (result.affectedRows === 0) {
            throw new HttpException("查無資料", 400)
        }
        await ProjectDao.deleteBunkByBoarderId(id)
        return true
    }
})()
