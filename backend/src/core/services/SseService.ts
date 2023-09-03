import _ from "lodash"
import BoarderDao from "../daos/BoarderDao"
import { BoarderModel } from "../../models/Boarder"
import AreaOfBoarderStatusDto from "../exportDtos/sse/AreaOfBoarderStatusDto"

export default new (class SSeService {
    private convertBoardersToSSEBoardersStatus(
        data: BoarderModel[]
    ): AreaOfBoarderStatusDto[] {
        const result = [] as AreaOfBoarderStatusDto[]
        if (_.isEmpty(data)) return result
        _.forEach(data, (boarder) => {
            const boarderStatus = {
                id: boarder.id,
                name: boarder.name,
                boarder_status_id: _.toInteger(boarder.boarder_status_id),
                floor: _.toInteger(boarder?.project_bunk?.floor),
                room_type: boarder?.project_bunk?.room_type,
                room_no: _.toInteger(boarder?.project_bunk?.room_no),
                bed: _.toInteger(boarder?.project_bunk?.bed),
            } as AreaOfBoarderStatusDto
            result.push(boarderStatus)
        })
        return result
    }

    public async getAreaOfBoarderStatus(payload: {
        project_id: number | string
    }): Promise<AreaOfBoarderStatusDto[]> {
        const data = await BoarderDao.findBoardersByProjectId(
            payload.project_id
        )
        const result = this.convertBoardersToSSEBoardersStatus(data)
        return result
    }
})()
