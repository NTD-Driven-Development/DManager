import _ from "lodash"
import UserDao from "../daos/UserDao"
import UserRoleDao from "../daos/UserRoleDao"
import UserDutyDao from "../daos/UserDutyDao"
import { UserModel } from "../../models/User"
import HttpException from "../../exceptions/HttpException"
import UpdateUserDto from "../importDtos/users/UpdateUserDto"
import CreateUserDto from "../importDtos/users/CreateUserDto"
import strings from "../../utils/strings"
import { ForeignKeyConstraintError, UniqueConstraintError } from "sequelize"
import RequestUser from "../exportDtos/auth/RequestUser"
import IPaginationResultDto from "../exportDtos/PaginationResultDto"
import { withPagination } from "../../utils/pagination"
import UserDuty, { UserDutyModel } from "../../models/UserDuty"

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
        search?: string
        offset?: number
        limit?: number
    }): Promise<IPaginationResultDto<UserModel>> {
        let result = await UserDao.findAll()
        if (query?.search) {
            result = _.filter(result, (item) => {
                return (
                    _.includes(item.email, query.search) ||
                    _.includes(item.name, query.search) ||
                    _.includes(item.sid, query.search)
                )
            })
        }
        return withPagination(result.length, result, query?.offset, query?.limit)
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
        const isExist = _.find(
            users,
            (u) => u.email === data.email && u.deleted_at === null
        )
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
            await UserRoleDao.deleteByUserId(data.id)
            if (data?.role_ids?.length !== 0) {
                await UserRoleDao.bulkCreateUserRole(
                    data.id,
                    data?.role_ids as number[]
                )
            }
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

    public async createUserDuty(
        payload: UserDutyModel,
        user: RequestUser
    ): Promise<UserDutyModel> {
        payload.created_by = user.id
        if (!user.is_admin) {
            if (user.id !== payload.user_id) {
                throw new HttpException("權限不足", 403)
            }
        }
        const result = await UserDutyDao.create(payload)
        return result
    }

    public async updateUserDuty(
        payload: UserDutyModel,
        user: RequestUser
    ): Promise<true> {
        payload.updated_by = user.id
        if (!user.is_admin) {
            if (user.id !== payload.user_id) {
                throw new HttpException("權限不足", 403)
            }
        }
        const result = await UserDutyDao.update(payload)
        if (result.affectedRows === 0) {
            throw new HttpException("查無資料", 400)
        }
        return true
    }

    public async deleteUserDuty(
        id: string | number,
        user: RequestUser
    ): Promise<true> {
        const user_duty = await UserDutyDao.findOneById(id)
        if (!user_duty) {
            throw new HttpException("查無資料", 400)
        }
        if (!user.is_admin) {
            if (user.id !== user_duty.user_id) {
                throw new HttpException("權限不足", 403)
            }
        }
        await UserDutyDao.delete(id)
        return true
    }

    public async getUserDuties(query?: {
        offset: number
        limit: number
    }): Promise<IPaginationResultDto<UserDutyModel>> {
        const user_duties = await UserDutyDao.findAll()
        return withPagination(
            user_duties.length,
            user_duties,
            query?.offset,
            query?.limit
        )
    }

    public async getUserDutyById(id: string | number): Promise<UserDutyModel> {
        const result = await UserDutyDao.findOneById(id)
        if (!result) {
            throw new HttpException("查無資料", 400)
        }
        return result
    }
})()
