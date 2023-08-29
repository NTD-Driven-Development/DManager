import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import { BoarderStatusModel } from "../../models/BoarderStatus"
import _ from "lodash"

export default new (class BoarderStatusDao extends BaseDao {
    public async findAll(): Promise<BoarderStatusModel[]> {
        return await Db.boarder_status.findAll({
            where: {
                deleted_at: null,
            },
            order: [["id", "DESC"]],
        })
    }

    public async findOneById(id: number): Promise<BoarderStatusModel> {
        return await Db.boarder_status.findOne({
            where: {
                id: id,
                deleted_at: null,
            },
        })
    }

    public async create(data: BoarderStatusModel): Promise<BoarderStatusModel> {
        return await Db.boarder_status.create(data)
    }

    public async update(
        data: BoarderStatusModel
    ): Promise<Core.IExecuteResult> {
        data.updated_at = moment().toDate()
        return await this.executeResult(
            Db.boarder_status.update(data, {
                where: {
                    id: data.id,
                    deleted_at: null,
                },
            })
        )
    }

    public async delete(
        id: number,
        deleted_by: number
    ): Promise<Core.IExecuteResult> {
        return await this.executeResult(
            Db.boarder_status.update(
                {
                    deleted_at: moment().toDate(),
                    deleted_by: deleted_by,
                },
                {
                    where: {
                        id: id,
                        deleted_at: null,
                    },
                }
            )
        )
    }
})()
