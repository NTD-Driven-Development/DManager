import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import { TelCardLogModel } from "../../models/TelCardLog"
import _ from "lodash"
import { Op, Sequelize } from "sequelize"

export default new (class TelCardLogDao extends BaseDao {
    public async findAll(filter?: any): Promise<TelCardLogModel[]> {
        return await Db.tel_card_log.findAll({
            include: [
                {
                    model: Db.boarder,
                    attributes: ["id", "sid", "name"],
                    include: [
                        {
                            model: Db.class,
                            attributes: ["id", "name"],
                            as: "class",
                        },
                        {
                            model: Db.project_bunk,
                            attributes: [
                                "floor",
                                "room_type",
                                "room_no",
                                "bed",
                            ],
                            as: "project_bunk",
                        },
                    ],
                    as: "boarder",
                },
                {
                    model: Db.tel_card_contacter,
                    attributes: ["id", "name"],
                    as: "tel_card_contacter",
                },
                {
                    model: Db.user,
                    attributes: ["id", "name"],
                    as: "creator",
                    required: false,
                },
            ],
            // where: {
            //     deleted_at: null,
            // },
            order: [["id", "DESC"]],
        })
    }

    public async findOneById(id: number): Promise<TelCardLogModel> {
        return await Db.tel_card_log.findOne({
            include: [
                {
                    model: Db.boarder,
                    attributes: ["id", "sid", "name"],
                    include: [
                        {
                            model: Db.class,
                            attributes: ["id", "name"],
                            as: "class",
                        },
                        {
                            model: Db.project_bunk,
                            attributes: [
                                "floor",
                                "room_type",
                                "room_no",
                                "bed",
                            ],
                            as: "project_bunk",
                        },
                    ],
                    as: "boarder",
                },
                {
                    model: Db.tel_card_contacter,
                    attributes: ["id", "name"],
                    as: "tel_card_contacter",
                },
                {
                    model: Db.user,
                    attributes: ["id", "name"],
                    as: "creator",
                    required: false,
                },
            ],
            where: {
                id: id,
            },
        })
    }

    public async create(data: TelCardLogModel): Promise<TelCardLogModel> {
        return await Db.tel_card_log.create(data)
    }

    public async delete(
        id: number,
        deleted_by: number
    ): Promise<Core.IExecuteResult> {
        return await this.executeResult(
            Db.tel_card_log.destroy({
                where: {
                    id: id,
                },
            })
        )
    }
})()
