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
            const formatRooms = [] as AreaOfBoarderStatusDto["rooms"]
            _.forEach(rooms, (room) => {
                const numbers = _.uniqBy(
                    _.filter(
                        data,
                        (item) =>
                            item?.project_bunk?.room_type ==
                            room?.project_bunk?.room_type
                    ),
                    (item) => item?.project_bunk?.room_no
                )
                const formatNumbers =
                    [] as AreaOfBoarderStatusDto["rooms"][0]["numbers"]
                _.forEach(numbers, (number) => {
                    const boarders = _.filter(
                        data,
                        (item) =>
                            item?.project_bunk?.room_no ==
                            number?.project_bunk?.room_no
                    )
                    const formatBoarders =
                        [] as AreaOfBoarderStatusDto["rooms"][0]["numbers"][0]["boarders"]
                    _.forEach(boarders, (boarder) => {
                        formatBoarders.push({
                            id: boarder?.id,
                            name: boarder?.name,
                            boarder_status_id: boarder?.boarder_status_id,
                        })
                    })
                    formatNumbers.push({
                        no: _.toInteger(number?.project_bunk?.room_no),
                        boarders: formatBoarders,
                    })
                })
                formatRooms.push({
                    type: room?.project_bunk?.room_type as string,
                    numbers: formatNumbers,
                })
            })
            result.push({
                floor: _.toInteger(floor?.project_bunk?.floor),
                rooms: formatRooms,
            })
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
