import _ from "lodash"
import UserDao from "../daos/UserDao"
import UserRoleDao from "../daos/UserRoleDao"
import { UserModel } from "../../models/User"
import HttpException from "../../exceptions/HttpException"
import UpdateUserDto from "../importDtos/users/UpdateUserDto"
import CreateUserDto from "../importDtos/users/CreateUserDto"
import strings from "../../utils/strings"
import { ForeignKeyConstraintError, UniqueConstraintError } from "sequelize"
import RequestUser from "../exportDtos/auth/RequestUser"
import IPaginationResultDto from "../exportDtos/PaginationResultDto"
import { withPagination } from "../../utils/pagination"

export default new (class UserService {
    private convertCreateDtoToUserModel(
        data: CreateUserDto,
        created_by: number
    ): UserModel {
        const hashedPwd = strings.hash(data?.sid as string)
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

    public async getUsers(query?: {
        offset: number
        limit: number
    }): Promise<IPaginationResultDto<UserModel>> {
        const users = await UserDao.findAll()
        return withPagination(users.length, users, query?.offset, query?.limit)
    }

    public async getUserById(user_id: string | number): Promise<UserModel> {
        const result = await UserDao.findOneById(user_id)
        if (!result) {
            throw new HttpException("查無資料", 400)
        }
        return result
    }

    public async createUser(
        data: CreateUserDto,
        user: RequestUser
    ): Promise<UserModel> {
        const users = await UserDao.findAll()
        const isExist = _.find(users, (u) => u.email === data.email && u.deleted_at === null)
        if (isExist) {
            throw new HttpException("此 Email 已被註冊", 400)
        }
        const model = this.convertCreateDtoToUserModel(data, user.id)
        const result = await UserDao.create(model)
        await UserRoleDao.bulkCreateUserRole(result.id as number, data.role_ids)
        return result
    }

    public async updateUser(
        data: UpdateUserDto,
        user: RequestUser
    ): Promise<true> {
        try {
            const model = _.pick(data, [
                "id",
                "sid",
                "name",
                "remark",
            ]) as UserModel
            model.updated_by = user.id
            const result = await UserDao.update(model)
            if (result.affectedRows === 0) {
                throw new HttpException("查無資料", 400)
            }
            const roles = _.pick(data, ["role_ids"]) as number[]
            await UserRoleDao.deleteByUserId(data.id)
            await UserRoleDao.bulkCreateUserRole(data.id, roles)
            return true
        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error
            }
            if (error instanceof ForeignKeyConstraintError) {
                throw new HttpException("資料錯誤", 400)
            }
            throw new HttpException(error.message, 500)
        }
    }

    public async deleteUser(
        id: string | number,
        user: RequestUser
    ): Promise<true> {
        const result = await UserDao.delete(id, user.id)
        if (result.affectedRows === 0) {
            throw new HttpException("查無資料", 400)
        }
        return true
    }
})()
