import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import { BoarderMappingRoleModel } from "../../models/BoarderMappingRole"
import _ from "lodash"

export default new (class BoarderMappingRoleDao extends BaseDao {
    public async bulkCreate(
        data: BoarderMappingRoleModel[]
    ): Promise<BoarderMappingRoleModel[]> {
        return await Db.boarder_mapping_role.bulkCreate(data)
    }

    public async destroyByBoarderId(
        boarder_id: string
    ): Promise<Core.IExecuteResult> {
        return await this.executeResult(
            Db.boarder_mapping_role.destroy({
                where: {
                    boarder_id: boarder_id,
                },
            })
        )
    }
})()
