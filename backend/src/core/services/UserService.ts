import _ from "lodash"
import UserDao from "../daos/UserDao"
import UserRoleDao from "../daos/UserRoleDao"
import { UserModel } from "../../models/User"
import HttpException from "../../exceptions/HttpException"
import UpdateUserDto from "../importDtos/users/UpdateUserDto"
import CreateUserDto from "../importDtos/users/CreateUserDto"
import strings from "../../utils/strings"
import Sequelize from "sequelize"
import RequestUser from "../exportDtos/auth/RequestUser"

export default new (class UserService {
    private convertCreateDtoToUserModel(data: CreateUserDto, created_by: number): UserModel {
        const hashedPwd = strings.hash("password")
        const model = {
            sid: data.sid,
            name: data.name,
            email: data.email,
            password: hashedPwd,
            is_admin: false,
            is_actived: true,
            created_by: created_by,
        } as UserModel
        return model
    }

    public async createUser(
        data: CreateUserDto,
        user: RequestUser
    ): Promise<any> {
        const model = this.convertCreateDtoToUserModel(data, user.id)
        try {
            const result = await UserDao.create(model)
            await UserRoleDao.bulkCreateUserRole(result.id as number, data.roles)
            return result
        } catch (error: any) {
            if (error instanceof Sequelize.UniqueConstraintError) {
                throw new HttpException("此 Email 已被註冊", 400)
            }
            throw new HttpException(error.message, 500)
        }
    }
})()
