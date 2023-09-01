import _ from "lodash"
import HttpException from "../../exceptions/HttpException"
import ExportDao from "../daos/ExportDao"
import RequestUser from "../exportDtos/auth/RequestUser"
import { BoarderModel } from "../../models/Boarder"
import ExportBoarderPointAndTelCardLogsDto from "../exportDtos/export/ExportBoarderPointAndTelCardLogsDto"

export default new (class ExportService {
    private async convertBoarderPointAndTelCardLogsToExport(
        data: BoarderModel[]
    ): Promise<ExportBoarderPointAndTelCardLogsDto[]> {
        if (_.isEmpty(data)) return []

        const result = [] as ExportBoarderPointAndTelCardLogsDto[]
        _.forEach(data, (item) => {
            const boarder = item
            const point_logs = item.point_logs ?? []
            const tel_card_logs = item.tel_card_logs ?? []
            delete boarder.point_logs
            delete boarder.tel_card_logs
            result.push({
                boarder: boarder,
                point_logs,
                tel_card_logs,
            })
        })
        return result
    }

    public async getBoarderPointAndTelCardLogs(query?: {
        project_id: number | string
    }): Promise<ExportBoarderPointAndTelCardLogsDto[]> {
        let data = await ExportDao.getBoarderPointAndTelCardLogs()
        if (query?.project_id) {
            data = _.filter(data, (item) => item.project_id == query.project_id)
        }
        const result = await this.convertBoarderPointAndTelCardLogsToExport(
            data
        )
        return result
    }
})()
