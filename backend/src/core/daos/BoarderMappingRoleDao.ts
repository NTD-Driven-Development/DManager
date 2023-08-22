import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import BoarderMappingRoleModel from "../../models/BoarderMappingRole"
import _ from "lodash"

export default new (class BoarderMappingRoleDao extends BaseDao {
    public async bulkCreate(
        data: {
            boarder_id: string
            boarder_role_id: number
        }[]
    ): Promise<BoarderMappingRoleModel[]> {
        const now = moment().toDate()
        const map = _.map(data, (item) => {
            return {
                boarder_id: item.boarder_id,
                boarder_role_id: item.boarder_role_id,
                created_at: now,
            }
        })
        return await Db.boarder_mapping_role.bulkCreate(map)
    }
})()
