import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import BoarderModel from "../../models/Boarder"
import _ from "lodash"

export default new (class BoarderDao extends BaseDao {
    public async findAll(): Promise<BoarderModel[]> {
        const boarders = await Db.boarder.findAll({
            include: [
                {
                    model: Db.boarder_role,
                    as: "boarder_roles",
                    required: false,
                },
                {
                    model: Db.class,
                    as: "class",
                    required: false,
                },
                {
                    model: Db.boarder_status,
                    as: "boarder_status",
                    required: false,
                }
            ],
            where: { deleted_at: null },
        })
        return boarders
    }

    public async create(boarder: BoarderModel): Promise<BoarderModel> {
        boarder.created_at = moment().toDate()
        return await Db.boarder.create(boarder)
    }

    public async bulkCreate(data: BoarderModel[]): Promise<BoarderModel[]> {
        const now = moment().toDate()
        const map = _.map(data, (item) => {
            return { ...item, created_at: now }
        })
        return await Db.boarder.bulkCreate(map)
    }
})()
