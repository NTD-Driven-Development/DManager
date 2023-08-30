import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import { UserModel } from "../../models/User"

export default new (class UserDao extends BaseDao implements Core.IDao {
    public async findAll(): Promise<UserModel[]> {
        const users = await Db.user.findAll({
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
            attributes: { exclude: ["password", "is_admin"] },
        })
        return users
    }

    public async findOneById(id: string | number): Promise<UserModel> {
        const user = await Db.user.findByPk(id, {
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
            attributes: { exclude: ["password", "is_admin"] },
        })
        return user
    }

    public async create(user: UserModel): Promise<UserModel> {
        return await Db.user.create(user)
    }

    public async update(
        user: UserModel
    ): Promise<Core.IExecuteResult> {
        user.updated_at = moment().toDate()
        return await this.executeResult(
            Db.user.update(user, { where: { id: user.id } })
        )
    }

    public async delete(id: string | number): Promise<Core.IExecuteResult> {
        return await this.executeResult(Db.user.destroy({ where: { id: id } }))
    }

    public async deleteBySid(sid: string): Promise<Core.IExecuteResult> {
        return await this.executeResult(
            Db.user.destroy({ where: { sid: sid } })
        )
    }
})()
