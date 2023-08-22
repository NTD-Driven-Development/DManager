import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import BoarderModel from "../../models/Boarder"
import _ from "lodash"

export default new (class BoarderDao extends BaseDao {
    public async findAll(): Promise<BoarderModel[]> {
        const boarders = await Db.boarder.findAll({
            where: { deleted_at: null },
        })
        return boarders
    }

    public async bulkCreate(data: BoarderModel[]): Promise<BoarderModel[]> {
        const now = moment().toDate()
        const map = _.map(data, (item) => {
            return { ...item, created_at: now }
        })
        return await Db.boarder.bulkCreate(map)
    }
})()
