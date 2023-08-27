import _ from "lodash"
import BoarderDao from "../daos/BoarderDao"
import { BoarderModel } from "../../models/Boarder"
import HttpException from "../../exceptions/HttpException"
import { withPagination } from "../../utils/pagination"
import IPaginationResultDto from "../exportDtos/PaginationResultDto"

export default new (class BoarderService {
    public async getBoardersFromProject(
        project_id: string | number, 
        query?: {
            offset: number
            limit: number
        }
    ): Promise<IPaginationResultDto> {
        const data = await BoarderDao.findAll()
        const result = _.filter(data, (item) => item.project_id == project_id)
        return withPagination(
            result.length,
            result,
            query?.offset,
            query?.limit
        )
    }
})()
