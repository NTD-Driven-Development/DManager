import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import { BoarderModel } from "../../models/Boarder"
import _ from "lodash"

export default new (class BoarderDao extends BaseDao {
    public async findAll(): Promise<BoarderModel[]> {
        const boarders = await Db.boarder.findAll({
            include: [
                {
                    model: Db.boarder_role,
                    attributes: ["id", "name"],
                    as: "boarder_roles",
                    through: { attributes: [] },
                    required: false,
                },
                {
                    model: Db.class,
                    attributes: ["id", "name"],
                    as: "class",
                    required: false,
                },
                {
                    model: Db.boarder_status,
                    attributes: ["id", "name"],
                    as: "boarder_status",
                    required: false,
                },
                {
                    model: Db.project_bunk,
                    attributes: ["id", "floor", "room_type", "room_no", "bed"],
                    as: "project_bunk",
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
        return await Db.boarder.bulkCreate(data)
    }
})()
