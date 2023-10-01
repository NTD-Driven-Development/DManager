import _ from "lodash"
import { App, mockUser } from "../../config/preE2eConfig"
import UserDao from "../../src/core/daos/UserDao"
import Db from "../../src/models"
import RoleEnum from "../../src/enumerates/Role"
import UserDutyDao from "../../src/core/daos/UserDutyDao"

describe("Acceptance test for UserController.", () => {
    function givenCreateUserPayload(concatStr: string) {
        return {
            name: `ATDD_user_${concatStr}`,
            email: `ATDD_user_${concatStr}@gmail.com`,
            sid: `ATDD_user_${concatStr}`,
            role_ids: [RoleEnum.檢視者],
        }
    }

    describe("取得使用者列表", () => {
        let testUser: any

        it("建立兩位使用者，取得使用者列表，每位使用者須包含角色屬性，並且有分頁", async () => {
            // given
            const res1 = await App.post("/api/users").send(
                givenCreateUserPayload("1")
            )
            const res2 = await App.post("/api/users").send(
                givenCreateUserPayload("2")
            )
            const payload = {
                page: 1,
                limit: 1,
            }
            // when
            const response = await App.get("/api/users").query(payload)
            // then
            const data = response.body?.data
            testUser = res1.body?.data
            expect(response.status).toBe(200)
            expect(response.body?.error).toBeFalsy()
            expect(response.body?.data).toHaveProperty("items")
            expect(data?.items.length).toBeLessThanOrEqual(payload.limit)
            _.forEach(data?.items, (item) => {
                expect(item).toHaveProperty("roles")
            })
        })

        it("取得單筆使用者資料，需包含角色屬性", async () => {
            // given
            const user_id = testUser?.id
            // when
            const response = await App.get(`/api/users/${user_id}`)
            // then
            const data = response.body?.data
            expect(response.status).toBe(200)
            expect(response.body?.error).toBeFalsy()
            expect(data?.id).toBe(user_id)
            expect(data).toHaveProperty("roles")
        })

        it("取得單筆使用者資料，若無此使用者，應回傳 400「查無資料」", async () => {
            // given
            const user_id = -123465789
            // when
            const response = await App.get(`/api/users/${user_id}`)
            // then
            expect(response.status).toBe(400)
            expect(response.body?.error).toBe("查無資料")
        })
    })

    describe("建立使用者，並且能夠編輯 & 刪除。", () => {
        let createdUser: any

        it("不符合輸入格式應回傳 400.", async () => {
            // given
            const invalidPayload = [
                {
                    name: "ATDD_user",
                    email: "ATDD_usergmail.com",
                    sid: "S1234567890ATDD_user",
                    role_ids: [RoleEnum.檢視者],
                },
                {
                    name: "ATDD_user",
                    email: "ATDD_user@gmail.com",
                    sid: "S1234567890ATDD_user",
                    role_ids: [],
                },
                {
                    name: "",
                    email: "ATDD_user@gmail.com",
                    sid: "S1234567890ATDD_user",
                },
                {},
            ]
            for (const payload of invalidPayload) {
                // when
                const response = await App.post("/api/users").send(payload)
                // then
                expect(response.status).toBe(400)
                expect(response.body?.error).not.toBeFalsy()
            }
        })

        it("新用戶應能夠正常新增.", async () => {
            // given
            const payload = givenCreateUserPayload("3")
            // when
            const response = await App.post("/api/users").send(payload)
            // then
            createdUser = response.body?.data
            expect(response.status).toBe(201)
            expect(response.body?.error).toBeFalsy()
            expect(createdUser?.name).toBe(payload.name)
            expect(createdUser?.email).toBe(payload.email)
            expect(createdUser?.sid).toBe(payload.sid)
            expect(createdUser?.created_by).toBe(mockUser.id)
        })

        it("不可重複新增相同 Email 使用者.", async () => {
            // given
            const payload = givenCreateUserPayload("3")
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
                name: "ATDD_user(ed)",
                sid: "ATDD_user(ed)",
                role_ids: [],
            }
            // when
            const response = await App.put("/api/users").send(payload)
            // then
            expect(response.status).toBe(200)
            const result = await UserDao.findOneById(createdUser?.id)
            expect(response.body?.error).toBeFalsy()
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
            expect(response.body?.error).toBeFalsy()
            expect(result).toBeFalsy()
        })
    })

    describe("取得輪值表", () => {
        let testUser: any
        let testUserDuty: any

        it("建立一位使用者，該使用者建立兩筆輪值", async () => {
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

        it("查詢第一頁使用者輪值清單，分頁筆數不超過一筆", async () => {
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
            expect(response.body?.error).toBeFalsy()
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
            expect(response.body?.error).toBeFalsy()
            expect(data?.id).toBe(duty_id)
            expect(data).toHaveProperty("user")
            expect(data).toHaveProperty("creator")
            expect(data).toHaveProperty("updater")
        })
    })

    describe("建立輪值時段，可以修改時間跟刪除", () => {
        let createdUser: any
        let testDuty: any

        beforeAll(async () => {})

        it("為使用者建立一筆輪值時段", async () => {
            // given
            const res = await App.post("/api/users").send(
                givenCreateUserPayload("4")
            )
            createdUser = res.body?.data
            const payload = {
                user_id: createdUser.id,
                start_time: "2021-01-01 00:00:00",
                end_time: "2021-01-01 00:22:00",
            }
            // when
            const response = await App.post("/api/users/duty").send(payload)
            // then
            expect(response.status).toBe(201)
            expect(response.body?.error).toBeFalsy()
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
            expect(response.body?.error).toBeFalsy()
            const result = await UserDutyDao.findOneById(testDuty.id)
            expect(new Date(result?.start_time)).toEqual(
                new Date(payload.start_time)
            )
            expect(new Date(result?.end_time)).toEqual(
                new Date(payload.end_time)
            )
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
            expect(response.body?.error).toBeFalsy()
            const result = await UserDutyDao.findOneById(testDuty.id)
            expect(result).toBeFalsy()
        })
    })
})
