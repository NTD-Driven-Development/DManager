import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import { UserDutyModel } from "../../models/UserDuty"
import _ from "lodash"
import { Op } from "sequelize"
import moment from "moment"

export default new (class UserDutyDao extends BaseDao {
    public async findAll(): Promise<UserDutyModel[]> {
        return await Db.user_duty.findAll({
            include: [
                {
                    model: Db.user,
                    attributes: ["id", "name", "email", "sid"],
                    as: "user",
                    required: false,
                },
                {
                    model: Db.user,
                    attributes: ["id", "name", "email"],
                    as: "creator",
                    required: false,
                },
                {
                    model: Db.user,
                    attributes: ["id", "name", "email"],
                    as: "updater",
                    required: false,
                },
            ],
            order: [["id", "DESC"]],
        })
    }

    public async findAllByToday(): Promise<UserDutyModel[]> {
        return await Db.user_duty.findAll({
            include: [
                {
                    model: Db.user,
                    attributes: ["id", "name", "email", "sid"],
                    as: "user",
                    required: false,
                },
                {
                    model: Db.user,
                    attributes: ["id", "name", "email"],
                    as: "creator",
                    required: false,
                },
                {
                    model: Db.user,
                    attributes: ["id", "name", "email"],
                    as: "updater",
                    required: false,
                },
            ],
            where: {
                [Op.and]: [
                    {
                        start_time: {
                            [Op.and]: [
                                {
                                    [Op.lt]: moment(),
                                },
                            ],
                        },
                    },
                    {
                        end_time: {
                            [Op.and]: [
                                {
                                    [Op.gte]: moment(),
                                },
                            ],
                        },
                    },
                ],
            },
        })
    }
    public async findOneById(id: string | number): Promise<UserDutyModel> {
        return await Db.user_duty.findOne({
            include: [
                {
                    model: Db.user,
                    attributes: ["id", "name", "email", "sid"],
                    as: "user",
                    required: false,
                },
                {
                    model: Db.user,
                    attributes: ["id", "name", "email"],
                    as: "creator",
                    required: false,
                },
                {
                    model: Db.user,
                    attributes: ["id", "name", "email"],
                    as: "updater",
                    required: false,
                },
            ],
            where: {
                id: id,
            },
        })
    }
    public async create(payload: UserDutyModel): Promise<UserDutyModel> {
        return await Db.user_duty.create(payload)
    }

    public async update(payload: UserDutyModel): Promise<Core.IExecuteResult> {
        return await Db.user_duty.update(payload, {
            where: {
                id: payload.id,
            },
        })
    }

    public async delete(id: string | number): Promise<Core.IExecuteResult> {
        return await Db.user_duty.destroy({
            where: {
                id,
            },
        })
    }
})()
