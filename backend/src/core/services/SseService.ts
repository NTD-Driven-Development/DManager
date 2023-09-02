import _ from "lodash"
import BoarderDao from "../daos/BoarderDao"
import { BoarderModel } from "../../models/Boarder"

interface AreaOfBoarderStatus {
    floor: number
    rooms: {
        type: string
        boarders: {
            id: string
            name: string
            boarder_status_id: number
        }[]
    }[]
}

export default new (class SSeService {
    private convertBoardersToSSEBoardersStatus(
        data: BoarderModel[]
    ): AreaOfBoarderStatus[] {
        const result = [] as AreaOfBoarderStatus[]
        if (_.isEmpty(data)) return result
        const floors = _.uniqBy(data, (item) => item?.project_bunk?.floor)
        _.forEach(floors, (floor) => {
            const rooms = _.uniqBy(
                _.filter(
                    data,
                    (item) =>
                        item?.project_bunk?.floor == floor?.project_bunk?.floor
                ),
                (item) => item?.project_bunk?.room_type
            )
            const roomsResult = [] as AreaOfBoarderStatus["rooms"]
            _.forEach(rooms, (room) => {
                const boarders = _.filter(
                    data,
                    (item) =>
                        item?.project_bunk?.floor ==
                            floor?.project_bunk?.floor &&
                        item?.project_bunk?.room_type ==
                            room?.project_bunk?.room_type
                )
                const boardersResult =
                    [] as AreaOfBoarderStatus["rooms"][0]["boarders"]
                _.forEach(boarders, (boarder) => {
                    boardersResult.push({
                        id: boarder?.id,
                        name: boarder?.name,
                        boarder_status_id: boarder?.boarder_status_id,
                    })
                })
                roomsResult.push({
                    type: room?.project_bunk?.room_type as string,
                    boarders: boardersResult,
                })
            })
            result.push({
                floor: _.toInteger(floor?.project_bunk?.floor),
                rooms: roomsResult,
            })
        })
        return result
    }

    public async getAreaOfBoarderStatus(payload: {
        project_id: number | string
    }): Promise<AreaOfBoarderStatus[]> {
        const data = await BoarderDao.findBoardersByProjectId(payload.project_id)
        const result = this.convertBoardersToSSEBoardersStatus(data)
        return result
    }
})()
