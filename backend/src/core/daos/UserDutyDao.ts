import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import { UserDutyModel } from "../../models/UserDuty"
import _ from "lodash"

export default new (class UserDutyDao extends BaseDao {
    public async findAll(): Promise<UserDutyModel[]> {
        return await Db.user_duty.findAll()
    }
    public async findOneById(id: string | number): Promise<UserDutyModel> {
        return await Db.user_duty.findByPk(id)
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
