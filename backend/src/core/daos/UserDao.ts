import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import UserModel from "../../models/User"

export default new (class UserDao extends BaseDao implements Core.IDao {
    public async findAll(): Promise<UserModel[]> {
        const users = await Db.user.findAll({
            attributes: { exclude: ["password", "is_admin"] },
        })
        return users
    }

    public async findOneById(id: string | number): Promise<UserModel> {
        const user = await Db.user.findByPk(id, {
            attributes: { exclude: ["password", "is_admin"] },
        })
        return user
    }

    public async create(user: UserModel): Promise<UserModel> {
        user.created_at = moment().toDate()
        return await Db.user.create(user)
    }

    public async update(
        id: string | number,
        user: UserModel
    ): Promise<Core.IExecuteResult> {
        user.updated_at = moment().toDate()
        return await this.executeResult(() =>
            Db.user.update(user, { where: { id: id } })
        )
    }

    public async delete(id: string | number): Promise<Core.IExecuteResult> {
        return await this.executeResult(() =>
            Db.user.destroy({ where: { id: id } })
        )
    }
})()
