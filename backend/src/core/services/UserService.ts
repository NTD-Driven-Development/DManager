import _ from "lodash"
import UserDao from "../daos/UserDao"
import UserRoleDao from "../daos/UserRoleDao"
import UserModel from "../../models/User"
import HttpException from "../../exceptions/HttpException"
import UpdateUserDto from "../importDtos/users/UpdateUserDto"
import CreateUserDto from "../importDtos/users/CreateUserDto"
import strings from "../../utils/strings"

export default new (class UserService {
    private convertCreateDtoToUserModel(data: CreateUserDto): UserModel {
        const hashedPwd = strings.hash("password")
        const model = {
            sid: data.sid,
            name: data.name,
            email: data.email,
            password: hashedPwd,
            is_admin: false,
            is_actived: true,
        } as UserModel
        return model
    }

    public async createUser(data: CreateUserDto): Promise<any> {
        const model: UserModel = this.convertCreateDtoToUserModel(data)
        const user: UserModel = await UserDao.create(model)
        await UserRoleDao.bulkCreateUserRole(user.id as number, data.roles)
        return true
    }
})()
