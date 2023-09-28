import Db from "../../models"
import BaseDao from "./BaseDao"
import { Op } from "sequelize"
import Core from "../interfaces/IDao"
import { RoleModel } from "../../models/Role"
import { PermissionModel } from "../../models/Permission"
import { UserModel } from "../../models/User"

interface RolePermission extends RoleModel {
    permissions?: PermissionModel[]
}

interface UserAuthInfo extends UserModel {
    roles?: RolePermission[]
}

export default new (class AuthDao extends BaseDao {
    public async getUserAuthInfoByEmail(email: string): Promise<UserAuthInfo> {
        const user: any = await Db.user.findOne({
            include: [
                {
                    model: Db.role,
                    attributes: ["id", "name"],
                    where: { deleted_at: null, is_actived: true },
                    as: "roles",
                    required: false,
                    include: [
                        {
                            model: Db.permission,
                            attributes: ["id", "path", "method"],
                            where: { is_actived: true },
                            as: "permissions",
                            required: false,
                        },
                    ],
                },
            ],
            where: {
                deleted_at: null,
                email: email,
            },
        })
        return user
    }

    public async getUserAuthInfoById(id: number): Promise<UserAuthInfo> {
        const user: any = await Db.user.findOne({
            include: [
                {
                    model: Db.role,
                    attributes: ["id", "name"],
                    where: { deleted_at: null, is_actived: true },
                    as: "roles",
                    required: false,
                    include: [
                        {
                            model: Db.permission,
                            attributes: ["id", "path", "method"],
                            through: {
                                attributes: [],
                                where: { is_actived: true },
                            },
                            where: { is_actived: true },
                            as: "permissions",
                            required: false,
                        },
                    ],
                },
            ],
            where: {
                deleted_at: null,
                id: id,
            },
        })
        return user
    }

    public async getUserInfoByEmail(email: string): Promise<UserModel> {
        const user: any = await Db.user.findOne({
            where: {
                email: email,
                deleted_at: null,
            },
        })
        return user
    }

    public async updateUserPasswordByEmail(
        email: string,
        password: string
    ): Promise<Core.IExecuteResult> {
        return await this.executeResult(
            Db.user.update(
                { password: password },
                {
                    where: {
                        email: email,
                    },
                }
            )
        )
    }
})()
