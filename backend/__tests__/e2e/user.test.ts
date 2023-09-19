import _ from "lodash"
import { App, mockUser } from "../../config/preE2eConfig"
import UserDao from "../../src/core/daos/UserDao"
import Db from "../../src/models"
import RoleEnum from "../../src/enumerates/Role"
import UserDutyDao from "../../src/core/daos/UserDutyDao"

describe("Acceptance test for UserController.", () => {
    describe("取得使用者列表", () => {
        let testUsers: any

        const createUserPayload = [
            {
                name: "test",
                email: "test_e2e@gmail.com",
                sid: "S1234567890test_e2e",
                role_ids: [RoleEnum.檢視者],
            },
            {
                name: "test22",
                email: "test_e2e22@gmail.com",
                sid: "S12345test_e2e+123",
                role_ids: [RoleEnum.檢視者],
            },
        ]
        beforeAll(async () => {
            // 測試前新增測資
            const res1 = await App.post("/api/users").send(createUserPayload[0])
            expect(res1.status).toBe(201)
            const res2 = await App.post("/api/users").send(createUserPayload[1])
            expect(res2.status).toBe(201)
        })

        it("取得使用者列表，每位使用者須包含角色屬性，並且有分頁", async () => {
            // given
            const payload = {
                page: 1,
                limit: 1,
            }
            // when
            const response = await App.get("/api/users").query(payload)
            // then
            const data = response.body?.data
            testUsers = data
            expect(response.status).toBe(200)
            expect(response.body?.error).toBeNull()
            expect(response.body?.data).toHaveProperty("items")
            expect(data?.items.length).toBeLessThanOrEqual(payload.limit)
            _.forEach(data?.items, (item) => {
                expect(item).toHaveProperty("roles")
            })
        })

        it("取得單筆使用者資料，需包含角色屬性", async () => {
            // given
            const user_id = testUsers?.items[0].id
            // when
            const response = await App.get(`/api/users/${user_id}`)
            // then
            const data = response.body?.data
            expect(response.status).toBe(200)
            expect(response.body?.error).toBeNull()
            expect(data?.id).toBe(user_id)
            expect(data).toHaveProperty("roles")
        })

        it("取得單筆使用者資料，若無此使用者，應回傳 400「查無資料」", async () => {
            // given
            const user_id = -9998978978
            // when
            const response = await App.get(`/api/users/${user_id}`)
            // then
            expect(response.status).toBe(400)
            expect(response.body?.error).toBe("查無資料")
        })

        afterAll(async () => {
            // 測試後刪除所有測資
            const users = _.filter(await UserDao.findAll(), (user) => {
                return (
                    user.email === createUserPayload[0].email ||
                    user.email === createUserPayload[1].email
                )
            })
            _.forEach(users, async (user) => {
                try {
                    await Db.user_role.destroy({
                        where: { user_id: user.id },
                    })
                    await Db.user.destroy({ where: { id: user.id } })
                } catch (error: any) {
                    console.log(error)
                }
            })
        })
    })

    describe("建立使用者，並且能夠編輯 & 刪除。", () => {
        let createdUser: any
        const createUserPayload = {
            name: "test",
            email: "test_e2e_createUser@gmail.com",
            sid: "S1234567890test_e2e",
            role_ids: [RoleEnum.檢視者],
        }

        it("不符合輸入格式應回傳 400.", async () => {
            // given
            const invalidPayload = [
                {
                    name: "test_e2e",
                    email: "test_e2egmail.com",
                    sid: "S1234567890test_e2e",
                    role_ids: [RoleEnum.檢視者],
                },
                {
                    name: "test_e2e",
                    email: "test_e2e@gmail.com",
                    sid: "S1234567890test_e2e",
                    role_ids: [],
                },
                {
                    name: "",
                    email: "test_e2e@gmail.com",
                    sid: "S1234567890test_e2e",
                },
                {},
            ]
            for (const payload of invalidPayload) {
                // when
                const response = await App.post("/api/users").send(payload)
                // then
                expect(response.status).toBe(400)
                expect(response.body?.error).not.toBeNull()
            }
        })

        it("新用戶應能夠正常新增.", async () => {
            // given
            const payload = createUserPayload
            // when
            const response = await App.post("/api/users").send(payload)
            // then
            createdUser = response.body?.data
            expect(response.status).toBe(201)
            expect(response.body?.error).toBeNull()
            expect(createdUser?.name).toBe(payload.name)
            expect(createdUser?.email).toBe(payload.email)
            expect(createdUser?.sid).toBe(payload.sid)
            expect(createdUser?.created_by).toBe(mockUser.id)
        })

        it("不可重複新增相同 Email 使用者.", async () => {
            // given
            const payload = createUserPayload
            // when
            const response = await App.post("/api/users").send(payload)
            // then
            expect(response.status).toBe(400)
            expect(response.body?.error).toBe("此 Email 已被註冊")
        })

        it("編輯使用者", async () => {
            // given
            const payload = {
                id: createdUser?.id,
                name: "test_e2e_updated",
                sid: "test_e2e_updated",
                role_ids: [],
            }
            // when
            const response = await App.put("/api/users").send(payload)
            // then
            expect(response.status).toBe(200)
            const result = await UserDao.findOneById(createdUser?.id)
            expect(response.body?.error).toBeNull()
            expect(result.sid).toBe(payload.sid)
            expect(result.name).toBe(payload.name)
        })

        it("刪除使用者", async () => {
            // given
            const user_id = createdUser?.id
            // when
            const response = await App.delete(`/api/users/${user_id}`)
            // then
            expect(response.status).toBe(200)
            const result = await UserDao.findOneById(user_id)
            expect(response.body?.error).toBeNull()
            expect(result).toBeNull()
        })

        afterAll(async () => {
            // 測試後刪除所有測資
            try {
                await Db.user_role.destroy({
                    where: { user_id: createdUser?.id },
                })
                await Db.user.destroy({
                    where: { email: createUserPayload.email },
                })
            } catch (error: any) {
                console.log(error)
            }
        })
    })

    describe("取得輪值表", () => {
        let testUser: any
        let testUserDuty: any

        beforeAll(async () => {
            // 建立測試 user
            testUser = await UserDao.create({
                name: "test",
                email: "testE2eUser@gmail.com",
                password: "password",
                sid: "S1234567890testE2e",
            })
            // 建立 2 筆輪值
            testUserDuty = await Db.user_duty.create({
                user_id: testUser.id,
                start_time: "2021-01-01 00:00:00",
                end_time: "2021-01-01 00:11:00",
            })
            await Db.user_duty.create({
                user_id: testUser.id,
                start_time: "2021-01-01 00:11:00",
                end_time: "2021-01-01 00:22:00",
            })
        })

        it("取得輪值清單，要分頁", async () => {
            // given
            const payload = {
                offset: 1,
                limit: 1,
            }
            // when
            const response = await App.get("/api/users/duty").query(payload)
            // then
            const data = response.body?.data
            expect(response.status).toBe(200)
            expect(response.body?.error).toBeNull()
            expect(data?.items.length).toBeLessThanOrEqual(payload.limit)
            expect(data?.items[0]).toHaveProperty("user")
            expect(data?.items[0]).toHaveProperty("creator")
            expect(data?.items[0]).toHaveProperty("updater")
        })

        it("取得單筆輪值資料", async () => {
            // given
            const duty_id = testUserDuty.id
            // when
            const response = await App.get(`/api/users/duty/${duty_id}`)
            // then
            const data = response.body?.data
            expect(response.status).toBe(200)
            expect(response.body?.error).toBeNull()
            expect(data?.id).toBe(duty_id)
            expect(data).toHaveProperty("user")
            expect(data).toHaveProperty("creator")
            expect(data).toHaveProperty("updater")
        })

        afterAll(async () => {
            try {
                await Db.user_duty.destroy({ where: { user_id: testUser.id } })
                await Db.user.destroy({ where: { id: testUser.id } })
            } catch (error: any) {
                console.log(error)
            }
        })
    })

    describe("建立輪值時段，可以修改時間跟刪除", () => {
        let createdUser: any
        let testDuty: any

        beforeAll(async () => {
            createdUser = await UserDao.create({
                name: "test",
                email: "testE2eUser123@gmail.com",
                password: "testE2e",
                sid: "S1234567890testE2e",
            })
        })

        it("建立輪值時段", async () => {
            // given
            const payload = {
                user_id: createdUser.id,
                start_time: "2021-01-01 00:00:00",
                end_time: "2021-01-01 00:22:00",
            }
            // when
            const response = await App.post("/api/users/duty").send(payload)
            // then
            expect(response.status).toBe(201)
            expect(response.body?.error).toBeNull()
            testDuty = response.body?.data
        })

        it("修改輪值時段", async () => {
            // given
            const payload = {
                id: testDuty.id,
                user_id: createdUser.id,
                start_time: "2021-01-01 00:00:00",
                end_time: "2021-01-01 00:33:00",
            }
            // when
            const response = await App.put("/api/users/duty").send(payload)
            // then
            expect(response.status).toBe(200)
            expect(response.body?.error).toBeNull()
            const result = await UserDutyDao.findOneById(testDuty.id)
            expect(new Date(result?.start_time)).toEqual(new Date(payload.start_time))
            expect(new Date(result?.end_time)).toEqual(new Date(payload.end_time))
            expect(result?.updated_by).toBe(mockUser.id)
        })

        it("刪除輪值時段", async () => {
            // given
            const payload = {
                id: testDuty.id,
            }
            // when
            const response = await App.delete("/api/users/duty/" + payload.id)
            // then
            expect(response.status).toBe(200)
            expect(response.body?.error).toBeNull()
            const result = await UserDutyDao.findOneById(testDuty.id)
            expect(result).toBeNull()
        })

        afterAll(async () => {
            try {
                await Db.user_duty.destroy({
                    where: { user_id: createdUser.id },
                })
                await Db.user.destroy({ where: { id: createdUser.id } })
            } catch (error: any) {
                console.log(error)
            }
        })
    })
})
