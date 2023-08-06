import _ from "lodash"
import UserDao from "../daos/UserDao"
import UserModel from "../../models/User"
import HttpException from "../../exceptions/HttpException"
import IUpdateUser from "../importModels/users/IUpdateUser"
import ICreateUser from "../importModels/users/ICreateUser"
import strings from "../../utils/strings"

export default new (class UserService {
    public async getUserDataById(id: string | number): Promise<UserModel> {
        return await UserDao.findOneById(id)
    }

    public async getAllUsersData(): Promise<UserModel[]> {
        return await UserDao.findAll()
    }

    public async createUser(item: ICreateUser): Promise<any> {
        const user = item as UserModel
        const password = "password";
        user.is_admin = false
        user.is_active = true
        user.password = strings.hash(password)
        await UserDao.create(user)
    }

    public async updateUser(item: IUpdateUser): Promise<any> {
        const result = await UserDao.update(item.id, item as UserModel)
        if (result.affectedRows === 0) {
            throw new HttpException("User not found", 404)
        }
    }

    public async deleteUser(id: string | number): Promise<any> {
        const result = await UserDao.delete(id)
        if (result.affectedRows === 0) {
            throw new HttpException("User not found", 404)
        }
    }
})()
