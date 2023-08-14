import _ from "lodash"
import UserDao from "../daos/UserDao"
import UserModel from "../../models/User"
import HttpException from "../../exceptions/HttpException"
import IUpdateUser from "../importModels/users/IUpdateUser"
import ICreateUser from "../importModels/users/ICreateUser"
import strings from "../../utils/strings"

export default new (class UserService {
    public async createUser(data: any): Promise<any> {
        return false
    }
})()
