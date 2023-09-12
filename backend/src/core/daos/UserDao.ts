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
                    model: Db.role,
                    attributes: ["id", "name"],
                    as: "roles",
                    required: false,
                    through: {
                        attributes: [],
                    },
                },
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
            where: { deleted_at: null },
        })
        return users
    }

    public async findOneById(id: string | number): Promise<UserModel> {
        const user = await Db.user.findOne({
            include: [
                {
                    model: Db.role,
                    attributes: ["id", "name"],
                    as: "roles",
                    required: false,
                    through: {
                        attributes: [],
                    },
                },
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
            where: { id: id, deleted_at: null },
        })
        return user
    }

    public async create(user: UserModel): Promise<UserModel> {
        return await Db.user.create(user)
    }

    public async update(user: UserModel): Promise<Core.IExecuteResult> {
        user.updated_at = moment().toDate()
        return await this.executeResult(
            Db.user.update(
                {
                    sid: user.sid,
                    name: user.name,
                    updated_at: user.updated_at,
                    updated_by: user.updated_by,
                },
                { where: { id: user.id, deleted_at: null } }
            )
        )
    }

    public async delete(
        id: string | number,
        deleted_by: string | number
    ): Promise<Core.IExecuteResult> {
        return await this.executeResult(
            Db.user.update(
                {
                    deleted_at: moment().toDate(),
                    deleted_by: deleted_by,
                    // is_actived: false,
                },
                {
                    where: { id: id, deleted_at: null },
                }
            )
        )
    }

    public async deleteBySid(sid: string): Promise<Core.IExecuteResult> {
        return await this.executeResult(
            Db.user.destroy({ where: { sid: sid } })
        )
    }
})()
