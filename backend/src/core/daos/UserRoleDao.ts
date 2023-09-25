import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import { UserRoleModel } from "../../models/UserRole"
import _ from "lodash"

export default new (class UserRoleDao extends BaseDao {
    public async bulkCreateUserRole(
        user_id: number,
        roles: number[]
    ): Promise<UserRoleModel> {
        const map = _.map(roles, (role_id) => {
            return { user_id: user_id, role_id: role_id }
        })
        return await Db.user_role.bulkCreate(map)
    }

    public async deleteByUserId(user_id: number): Promise<Core.IExecuteResult> {
        return await this.executeResult(
            Db.user_role.destroy({ where: { user_id: user_id } })
        )
    }
})()
