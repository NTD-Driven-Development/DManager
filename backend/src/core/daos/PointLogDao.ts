import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import { PointLogModel } from "../../models/PointLog"
import _ from "lodash"
import { Op, Sequelize } from "sequelize"

export default new (class PointLogDao extends BaseDao {
    public async findAll(filter?: any): Promise<PointLogModel[]> {
        return await Db.point_log.findAll({
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
                    model: Db.point_rule,
                    attributes: ["id", "code", "reason", "point"],
                    as: "point_rule",
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

    public async findOneById(id: number): Promise<PointLogModel> {
        return await Db.point_log.findOne({
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
                    model: Db.point_rule,
                    attributes: ["id", "code", "reason", "point"],
                    as: "point_rule",
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

    public async create(data: PointLogModel): Promise<PointLogModel> {
        return await Db.point_log.create(data)
    }

    public async delete(
        id: number,
        deleted_by: number
    ): Promise<Core.IExecuteResult> {
        return await this.executeResult(
            Db.point_log.destroy({
                where: {
                    id: id,
                },
            })
        )
    }
})()
