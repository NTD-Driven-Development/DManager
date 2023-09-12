import UserService from "../../src/core/services/UserService"
import UserDao from "../../src/core/daos/UserDao"
import UserRoleDao from "../../src/core/daos/UserRoleDao"
import strings from "../../src/utils/strings"
import RoleEnum from "../../src/enumerates/Role"
import { UniqueConstraintError } from "sequelize"

describe("Unit test for UserService.", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
    const hashedPwd = "passwordhashed"

    const fakeUser = {
        id: 1,
        email: "abc@gmail.com",
        name: "測試",
        sid: "0",
        password: hashedPwd,
        is_admin: false,
        is_actived: true,
        created_at: new Date(),
    } as any
    function givenCreateUserPayload() {
        return {
            email: "abc@gmail.com",
            name: "測試",
            sid: "0",
            roles: [RoleEnum.檢視者],
        }
    }

    async function whenCreateUser(payload: any) {
        jest.spyOn(UserDao, "create").mockResolvedValue(fakeUser)
        jest.spyOn(strings, "hash").mockReturnValue(hashedPwd)
        jest.spyOn(UserRoleDao, "bulkCreateUserRole").mockResolvedValue(
            true as any
        )
        return await UserService.createUser(payload, fakeUser)
    }

    async function whenCreateSameEmailUser(payload: any) {
        jest.spyOn(UserDao, "create").mockRejectedValue(
            new UniqueConstraintError({})
        )
        return await UserService.createUser(payload, fakeUser)
    }

    function givenUpdateUserPayload() {
        return {
            id: 1,
            sid: "0",
            name: "測試修改",
        }
    }

    describe("建立使用者帳號", () => {
        it("給予姓名、email、檢視者身分，建立一位使用者，密碼預設為學號。", async () => {
            // given
            const payload = givenCreateUserPayload()

            // when
            const createdResult = await whenCreateUser(payload)

            // then
            expect(createdResult).toBe(fakeUser)
            expect(strings.hash).toBeCalledTimes(1)
            expect(strings.hash).toBeCalledWith(payload.sid)
            expect(UserDao.create).toBeCalledTimes(1)
            expect(UserRoleDao.bulkCreateUserRole).toBeCalledTimes(1)
            expect(UserDao.create).toHaveBeenCalledWith({
                sid: payload.sid,
                name: payload.name,
                email: payload.email,
                password: hashedPwd,
                is_admin: false,
                is_actived: true,
                created_by: fakeUser.id,
            })
        })

        it("重複註冊相同 Email 應拋出「此 Email 已被註冊」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "此 Email 已被註冊"
            const payload = givenCreateUserPayload()

            // when
            const result = whenCreateSameEmailUser(payload)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })

    describe("更新使用者資料", () => {
        it("給予 id、學號、姓名，更新一位使用者資料。", async () => {
            // given
            const payload = givenUpdateUserPayload()

            // when
            jest.spyOn(UserDao, "update").mockResolvedValue({
                affectedRows: 1,
            } as any)
            const updatedResult = await UserService.updateUser(
                payload,
                fakeUser
            )

            // then
            expect(updatedResult).toBe(true)
            expect(UserDao.update).toBeCalledTimes(1)
            expect(UserDao.update).toBeCalledWith({
                id: payload.id,
                sid: payload.sid,
                name: payload.name,
                updated_by: fakeUser.id,
            })
        })

        it("若更新資料無異動，應拋出「查無資料」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "查無資料"
            const payload = givenUpdateUserPayload()
            jest.spyOn(UserDao, "update").mockResolvedValue({
                affectedRows: 0,
            } as any)
            const result = UserService.updateUser(payload, fakeUser)
            // then
            expect(UserDao.update).toBeCalledTimes(1)
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })

    describe("刪除使用者資料", () => {
        it("給予 id，刪除一位使用者資料。", async () => {
            // given
            const user_id = 1
            // when
            jest.spyOn(UserDao, "delete").mockResolvedValue({
                affectedRows: 1,
            } as any)
            const deleteResult = await UserService.deleteUser(user_id, fakeUser)
            // then
            expect(deleteResult).toBe(true)
            expect(UserDao.delete).toBeCalledTimes(1)
            expect(UserDao.delete).toBeCalledWith(user_id, fakeUser.id)
        })

        it("若刪除資料無異動，應拋出「查無資料」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "查無資料"
            const user_id = 1
            jest.spyOn(UserDao, "delete").mockResolvedValue({
                affectedRows: 0,
            } as any)
            const result = UserService.deleteUser(user_id, fakeUser)
            // then
            expect(UserDao.delete).toBeCalledTimes(1)
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })

    describe("取得使用者列表", () => {
        it("查詢分頁第一頁，每頁資料為一筆的使用者清單", async () => {
            // given
            const payload = {
                offset: 1,
                limit: 1,
            }
            const fakeResult = [fakeUser, fakeUser]
            // when
            jest.spyOn(UserDao, "findAll").mockResolvedValue(fakeResult as any)
            const result = await UserService.getUsers(payload)
            // then
            expect(result).toEqual({
                total: 2,
                current_page: 1,
                per_page: 1,
                last_page: 2,
                from: 1,
                to: 1,
                items: [fakeResult[0]],
            })
            expect(UserDao.findAll).toBeCalledTimes(1)
        })
    })

    describe("取得單筆使用者資料", () => {
        it("給予 id，取得一位使用者資料。", async () => {
            // given
            const user_id = 1
            // when
            jest.spyOn(UserDao, "findOneById").mockResolvedValue(
                fakeUser as any
            )
            const result = await UserService.getUserById(user_id)
            // then
            expect(result).toEqual(fakeUser)
            expect(UserDao.findOneById).toBeCalledTimes(1)
        })

        it("若查無資料，應拋出「查無資料」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "查無資料"
            const user_id = 1
            jest.spyOn(UserDao, "findOneById").mockResolvedValue(null as any)
            const result = UserService.getUserById(user_id)
            // then
            expect(UserDao.findOneById).toBeCalledTimes(1)
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })
})
