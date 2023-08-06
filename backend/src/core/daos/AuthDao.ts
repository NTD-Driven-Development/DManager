import Db from "../../models"
import BaseDao from "./BaseDao"
import { Op } from "sequelize"
import Core from "../interfaces/IDao"
import RoleModel from "../../models/Role"
import PermissionModel from "../../models/Permission"
import UserModel from "../../models/User"
import StudentModel from "../../models/Student"

interface RolePermission extends RoleModel {
    permissions?: PermissionModel[]
}

interface UserAuthInfo extends UserModel {
    roles?: RolePermission[]
}

export default new (class AuthDao extends BaseDao {
    public async getUserAuthInfoByAccount(
        account: string
    ): Promise<UserAuthInfo> {
        const user: any = await Db.user.findOne({
            include: [
                {
                    model: Db.role,
                    attributes: ["id", "name"],
                    where: { deleted_at: null, is_active: true },
                    as: "roles",
                    required: false,
                    include: [
                        {
                            model: Db.permission,
                            attributes: ["id", "path", "method"],
                            where: { is_active: true },
                            as: "permissions",
                            required: false,
                        },
                    ],
                },
            ],
            where: {
                deleted_at: null,
                account: account,
            },
        })
        return user
    }

    public async getUserAuthInfoById(
        id: number
    ): Promise<UserAuthInfo> {
        const user: any = await Db.user.findOne({
            include: [
                {
                    model: Db.role,
                    attributes: ["id", "name"],
                    where: { deleted_at: null, is_active: true },
                    as: "roles",
                    required: false,
                    include: [
                        {
                            model: Db.permission,
                            attributes: ["id", "path", "method"],
                            where: { is_active: true },
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

    public async getUserInfoByAccount(account: string): Promise<UserModel> {
        const user: any = await Db.user.findOne({
            where: {
                account: account,
                deleted_at: null,
            }
        })
        return user
    }
})()
