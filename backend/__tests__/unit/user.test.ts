import UserService from "../../src/core/services/UserService"
import UserDao from "../../src/core/daos/UserDao"
import UserRoleDao from "../../src/core/daos/UserRoleDao"
import strings from "../../src/utils/strings"
import RoleEnum from "../../src/enumerates/Role"
import { ForeignKeyConstraintError, UniqueConstraintError } from "sequelize"
import UserDutyDao from "../../src/core/daos/UserDutyDao"
import moment from "moment"

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

    const fakeUserDuty = {
        id: 1,
        user_id: 1,
        start_time: new Date("2021-01-01 00:00:00"),
        end_time: new Date("2021-01-01 00:02:00"),
        created_at: new Date("2021-01-01 00:00:00"),
        updated_at: new Date("2021-01-01 00:00:00"),
        user: {
            id: 1,
            email: "abc@gmail.com",
            name: "測試",
        },
        creator: {
            id: 1,
            email: "abc@gmail.com",
            name: "測試",
        },
        updater: {
            id: 1,
            email: "abc@gmail.com",
            name: "測試",
        },
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
        jest.spyOn(UserDao, "findAll").mockResolvedValue([
            {
                id: 1,
                email: "123456@gmail.com",
                deleted_at: null,
            } as any,
        ])
        jest.spyOn(UserDao, "create").mockResolvedValue(fakeUser)
        jest.spyOn(strings, "hash").mockReturnValue(hashedPwd)
        jest.spyOn(UserRoleDao, "bulkCreateUserRole").mockResolvedValue(
            true as any
        )
        return await UserService.createUser(payload, fakeUser)
    }

    async function whenCreateSameEmailUser(payload: any) {
        jest.spyOn(UserDao, "findAll").mockResolvedValue([
            {
                id: 1,
                email: payload.email,
                deleted_at: null,
            } as any,
        ])
        jest.spyOn(UserDao, "create").mockResolvedValue(fakeUser)
        return await UserService.createUser(payload, fakeUser)
    }

    function givenUpdateUserPayload() {
        return {
            id: 1,
            sid: "0",
            name: "測試修改",
            remark: "測試修改",
            roles: [RoleEnum.編輯者],
        }
    }

    function testUserDutyFactory(
        count: number,
        start_time: Date,
        end_time: Date
    ): any {
        const result: any[] = []
        const daysCount = moment(end_time).diff(moment(start_time), "days") + 1
        let idCount = 1
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < daysCount; j++) {
                result.push({
                    id: idCount,
                    start_time: moment(start_time).add(j, "days").toDate(),
                    end_time: moment(start_time).add(j, "days").toDate(),
                    user: {
                        id: i + 1,
                        name: `測試${i + 1}`,
                    },
                })
            }
        }
        console.log(result)
        return result
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
        it("給予 id、學號、姓、備註，角色清單，更新一位使用者資料。", async () => {
            // given
            const payload = givenUpdateUserPayload()

            // when
            jest.spyOn(UserDao, "update").mockResolvedValue({
                affectedRows: 1,
            } as any)
            jest.spyOn(UserRoleDao, "deleteByUserId").mockResolvedValue({
                affectedRows: 1,
            } as any)
            jest.spyOn(UserRoleDao, "bulkCreateUserRole").mockResolvedValue(
                true as any
            )
            const updatedResult = await UserService.updateUser(
                payload,
                fakeUser
            )

            // then
            expect(updatedResult).toBe(true)
            expect(UserRoleDao.deleteByUserId).toBeCalledTimes(1)
            expect(UserRoleDao.bulkCreateUserRole).toBeCalledTimes(1)
            expect(UserDao.update).toBeCalledTimes(1)
            expect(UserDao.update).toBeCalledWith({
                id: payload.id,
                sid: payload.sid,
                name: payload.name,
                remark: payload.remark,
                updated_by: fakeUser.id,
            })
        })

        it("若修改時發生外鍵關聯錯誤，應擲出「資料錯誤」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "資料錯誤"
            const payload = givenUpdateUserPayload()
            jest.spyOn(UserDao, "update").mockResolvedValue({
                affectedRows: 1,
            } as any)
            jest.spyOn(UserRoleDao, "deleteByUserId").mockResolvedValue({
                affectedRows: 1,
            } as any)
            jest.spyOn(UserRoleDao, "bulkCreateUserRole").mockRejectedValue(
                new ForeignKeyConstraintError({})
            )
            const result = UserService.updateUser(payload, fakeUser)
            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
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

        it("給予查詢參數 search，搜尋符合學號、姓名、電子郵件", async () => {
            // given
            const payload1 = {
                search: "abc@gmail.com",
            }
            const payload2 = {
                search: "姓名2",
            }
            const payload3 = {
                search: "學號2",
            }
            // when
            jest.spyOn(UserDao, "findAll").mockResolvedValue([
                {
                    id: "1",
                    name: "姓名1",
                    email: "abc@gmail.com",
                    sid: "學號1",
                } as any,
                {
                    id: "2",
                    name: "姓名2",
                    email: "123@gmail.com",
                    sid: "學號3",
                } as any,
                {
                    id: "3",
                    name: "姓名2",
                    email: "AD@gmail.com",
                    sid: "學號2",
                } as any,
            ])
            const result1 = await UserService.getUsers(payload1)
            const result2 = await UserService.getUsers(payload2)
            const result3 = await UserService.getUsers(payload3)
            // then
            expect(result1.items.length).toBe(1)
            expect(result2.items.length).toBe(2)
            expect(result3.items.length).toBe(1)
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

    describe("建立輪值", () => {
        it("給予輪值人、輪值起始時間 & 結束時間，建立一筆輪值。", async () => {
            // given
            const payload = {
                user_id: 1,
                start_time: new Date(),
                end_time: new Date(),
            }
            // when
            jest.spyOn(UserDutyDao, "create").mockResolvedValue({
                id: 1,
                user_id: payload.user_id,
                start_time: payload.start_time,
                end_time: payload.end_time,
            } as any)
            const result = await UserService.createUserDuty(
                payload as any,
                fakeUser
            )
            // then
            expect(result).toHaveProperty("id", 1)
            expect(result).toHaveProperty("user_id", payload.user_id)
            expect(result).toHaveProperty("start_time", payload.start_time)
            expect(result).toHaveProperty("end_time", payload.end_time)
            expect(UserDutyDao.create).toBeCalledTimes(1)
        })

        it("如果不是 admin ，就不能建立除了自己以外的輪值", async () => {
            // given
            const payload = {
                user_id: 2,
                start_time: new Date(),
                end_time: new Date(),
            }
            // when
            const result = UserService.createUserDuty(payload as any, fakeUser)
            // then
            await expect(result).rejects.toThrow("權限不足")
            await expect(result).rejects.toHaveProperty("statusCode", 403)
        })
    })

    describe("修改輪值", () => {
        it("給予id、輪值人、輪值起始時間 & 結束時間，修改一筆輪值。", async () => {
            // given
            const payload = {
                id: 1,
                user_id: 1,
                start_time: new Date(),
                end_time: new Date(),
            }
            // when
            jest.spyOn(UserDutyDao, "update").mockResolvedValue(fakeUser as any)
            const result = await UserService.updateUserDuty(
                payload as any,
                fakeUser
            )
            // then
            expect(result).toEqual(true)
            expect(UserDutyDao.update).toBeCalledTimes(1)
        })

        it("如果不是 admin ，就不能修改除了自己以外的輪值", async () => {
            // given
            const payload = {
                id: 1,
                user_id: 2,
                start_time: new Date(),
                end_time: new Date(),
            }
            // when
            const result = UserService.updateUserDuty(payload as any, fakeUser)
            // then
            await expect(result).rejects.toThrow("權限不足")
            await expect(result).rejects.toHaveProperty("statusCode", 403)
        })

        it("找不到輪值，應拋出「查無資料」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "查無資料"
            const payload = {
                id: 1,
                user_id: 1,
                start_time: new Date(),
                end_time: new Date(),
            }
            jest.spyOn(UserDutyDao, "update").mockResolvedValue({
                affectedRows: 0,
            } as any)
            const result = UserService.updateUserDuty(payload as any, fakeUser)
            // then
            expect(UserDutyDao.update).toBeCalledTimes(1)
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })

    describe("刪除輪值", () => {
        it("給予id，刪除一筆輪值。", async () => {
            // given
            const duty_id = 1
            // when
            jest.spyOn(UserDutyDao, "findOneById").mockResolvedValue({
                id: 1,
                user_id: fakeUser.id,
            } as any)
            jest.spyOn(UserDutyDao, "delete").mockResolvedValue({
                affectedRows: 1,
            } as any)
            const result = await UserService.deleteUserDuty(duty_id, fakeUser)
            // then
            expect(result).toEqual(true)
            expect(UserDutyDao.delete).toBeCalledTimes(1)
        })

        it("找不到輪值，應拋出「查無資料」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "查無資料"
            const duty_id = 1
            jest.spyOn(UserDutyDao, "findOneById").mockResolvedValue(
                null as any
            )
            const result = UserService.deleteUserDuty(duty_id, fakeUser)
            // then
            expect(UserDutyDao.findOneById).toBeCalledTimes(1)
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })

        it("如果不是 admin，就不能刪除其他人的輪值表", async () => {
            // given
            const duty_id = 1
            // when
            jest.spyOn(UserDutyDao, "findOneById").mockResolvedValue({
                id: 1,
                user_id: fakeUser.id + 123456789,
            } as any)
            const result = UserService.deleteUserDuty(duty_id, fakeUser)
            // then
            await expect(result).rejects.toThrow("權限不足")
            await expect(result).rejects.toHaveProperty("statusCode", 403)
        })
    })

    describe("取得輪值清單", () => {
        it("查詢分頁第一頁，每頁資料為一筆的輪值清單", async () => {
            // given
            const payload = {
                offset: 1,
                limit: 1,
            }
            const fakeResult = [fakeUserDuty, fakeUserDuty]
            // when
            jest.spyOn(UserDutyDao, "findAll").mockResolvedValue(
                fakeResult as any
            )
            const result = await UserService.getUserDuties(payload)
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
            expect(UserDutyDao.findAll).toBeCalledTimes(1)
        })

        it("給予查詢參數 search, start_times，搜尋符合姓名、指定輪值日的資料", async () => {
            // given
            const payload1 = {
                search: "測試1",
                start_times: [
                    "2021-01-01T00:00:00.000Z",
                ],
            }
            const payload2 = {
                search: "測試2",
                // start_times: "2021-01-02T00:00:00.000Z",
            }
            // when
            jest.spyOn(UserDutyDao, "findAll").mockResolvedValue(
                testUserDutyFactory(
                    2,
                    new Date("2021-01-01T00:00:00.000Z"),
                    new Date("2021-01-02T00:00:00.000Z")
                ) as any
            )
            const result1 = await UserService.getUserDuties(payload1)
            const result2 = await UserService.getUserDuties(payload2)
            // then
            expect(result1.items.length).toBe(1)
            expect(result2.items.length).toBe(2)
        })
    })

    describe("取得單筆輪值表", () => {
        it("給予 id，取得一筆輪值表。", async () => {
            // given
            const duty_id = 1
            // when
            jest.spyOn(UserDutyDao, "findOneById").mockResolvedValue(
                fakeUserDuty as any
            )
            const result = await UserService.getUserDutyById(duty_id)
            // then
            expect(result).toEqual(fakeUserDuty)
            expect(UserDutyDao.findOneById).toBeCalledTimes(1)
        })

        it("若查無資料，應拋出「查無資料」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "查無資料"
            const duty_id = 1
            jest.spyOn(UserDutyDao, "findOneById").mockResolvedValue(
                null as any
            )
            const result = UserService.getUserDutyById(duty_id)
            // then
            expect(UserDutyDao.findOneById).toBeCalledTimes(1)
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })
})
