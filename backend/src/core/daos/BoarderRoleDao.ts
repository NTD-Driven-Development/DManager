import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import BoarderRoleModel from "../../models/BoarderRole"
import _ from "lodash"

export default new (class BoarderRoleDao extends BaseDao {
    public async bulkCreate(
        data: { name: string; project_id: number }[]
    ): Promise<BoarderRoleModel[]> {
        const now = moment().toDate()
        const map = _.map(data, (item) => {
            return { name: item.name, project_id: item.project_id, created_at: now }
        })
        return await Db.boarder_role.bulkCreate(map)
    }
})()
