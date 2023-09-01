import { BoarderModel } from "../../../models/Boarder"
import { PointLogModel } from "../../../models/PointLog"
import { TelCardLogModel } from "../../../models/TelCardLog"

export default interface ExportBoarderPointAndTelCardLogsDto {
    boarder: BoarderModel
    point_logs: PointLogModel[]
    tel_card_logs: TelCardLogModel[]
}