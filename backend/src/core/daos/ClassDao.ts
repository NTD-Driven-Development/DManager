import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import ClassModel from "../../models/Class"
import _ from "lodash"

export default new (class ClassDao extends BaseDao {
    public async bulkCreate(
        names: string[]
    ): Promise<ClassModel[]> {
        const now = moment().toDate()
        const map = _.map(names, (name) => {
            return { name: name, created_at: now }
        })
        return await Db.class.bulkCreate(map)
    }
})()
