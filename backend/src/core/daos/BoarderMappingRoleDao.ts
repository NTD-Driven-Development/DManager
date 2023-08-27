import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import { BoarderMappingRoleModel } from "../../models/BoarderMappingRole"
import _ from "lodash"

export default new (class BoarderMappingRoleDao extends BaseDao {
    public async bulkCreate(
        data: {
            boarder_id: string
            boarder_role_id: number
        }[]
    ): Promise<BoarderMappingRoleModel[]> {
        return await Db.boarder_mapping_role.bulkCreate(data)
    }
})()
