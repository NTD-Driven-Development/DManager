import _ from "lodash"
import BoarderDao from "../daos/BoarderDao"
import { BoarderModel } from "../../models/Boarder"
import AreaOfBoarderStatusDto from "../exportDtos/sse/AreaOfBoarderStatusDto"
import UserDutyDao from "../daos/UserDutyDao"

export default new (class SSeService {
    private convertBoardersToSSEBoardersStatus(data: BoarderModel[]): {
        id: string
        sid: string
        name: string
        boarder_status_id: number
        floor: number
        room_type: string
        room_no: number
        bed: number
    }[] {
        const result = [] as any[]
        if (_.isEmpty(data)) return result
        _.forEach(data, (boarder) => {
            const boarderStatus = {
                id: boarder.id,
                sid: boarder.sid,
                name: boarder.name,
                boarder_status_id: _.toInteger(boarder.boarder_status_id),
                floor: _.toInteger(boarder?.project_bunk?.floor),
                room_type: boarder?.project_bunk?.room_type as string,
                room_no: _.toInteger(boarder?.project_bunk?.room_no),
                bed: _.toInteger(boarder?.project_bunk?.bed),
            }
            result.push(boarderStatus)
        })
        return result
    }

    public async getAreaOfBoarderStatus(payload: {
        project_id: number | string
    }): Promise<AreaOfBoarderStatusDto> {
        const result = {} as AreaOfBoarderStatusDto
        const boarderData = await BoarderDao.findBoardersByProjectId(
            payload.project_id
        )
        const TodayUserDuty = await UserDutyDao.findAllByToday()
        const filterCurrentUserDutyBySid = _.map(
            TodayUserDuty,
            (userDuty) => {
                const boarder = _.find(boarderData, (boarder) => {
                    return boarder?.sid == userDuty?.user?.sid
                })
                if (_.isEmpty(boarder)) return
                return {
                    id: userDuty?.user?.id,
                    sid: userDuty?.user?.sid,
                    name: userDuty?.user?.name,
                    email: userDuty?.user?.email,
                    project_bunk: {
                        id: boarder?.project_bunk?.id,
                        floor: boarder?.project_bunk?.floor,
                        room_type: boarder?.project_bunk?.room_type,
                        room_no: boarder?.project_bunk?.room_no,
                        bed: boarder?.project_bunk?.bed,
                    },
                }
            }
        )
        const currentUserDuty = _.uniqBy(
            filterCurrentUserDutyBySid,
            (userDuty) => {
                return userDuty?.id
            }
        )

        result.boarders = this.convertBoardersToSSEBoardersStatus(boarderData)
        result.users = currentUserDuty as any[]
        return result
    }
})()
