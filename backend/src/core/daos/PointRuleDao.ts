import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import { PointRuleModel } from "../../models/PointRule"
import _ from "lodash"
import { Op, Sequelize } from "sequelize"

export default new (class PointRuleDao extends BaseDao {
    public async findAll(): Promise<PointRuleModel[]> {
        return await Db.point_rule.findAll({
            include: [
                {
                    model: Db.user,
                    attributes: ["id", "name"],
                    as: "creator",
                    required: false,
                },
                {
                    model: Db.user,
                    attributes: ["id", "name"],
                    as: "updater",
                    required: false,
                },
            ],
            where: {
                deleted_at: null,
            },
            order: [["id", "DESC"]],
        })
    }

    public async findOneById(id: number): Promise<PointRuleModel> {
        return await Db.point_rule.findOne({
            include: [
                {
                    model: Db.user,
                    attributes: ["id", "name"],
                    as: "creator",
                    required: false,
                },
                {
                    model: Db.user,
                    attributes: ["id", "name"],
                    as: "updater",
                    required: false,
                },
            ],
            where: {
                id: id,
                deleted_at: null,
            },
        })
    }

    public async findAllByCode(code: string): Promise<PointRuleModel[]> {
        return await Db.point_rule.findAll({
            where: {
                code: code,
                deleted_at: null,
            },
        })
    }

    public async create(data: PointRuleModel): Promise<PointRuleModel> {
        data.is_actived = true
        return await Db.point_rule.create(data)
    }

    public async update(data: PointRuleModel): Promise<Core.IExecuteResult> {
        data.updated_at = moment().toDate()
        return await this.executeResult(
            Db.point_rule.update(data, {
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
            Db.point_rule.update(
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
