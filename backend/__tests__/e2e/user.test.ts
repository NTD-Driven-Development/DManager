import { App, mockUser } from "../../config/preE2eConfig"
import Db from "../../src/models"

describe("Acceptance test for UserController.", () => {
    describe("建立使用者", () => {
        let createdUser: any
        const createUserPayload = {
            name: "test",
            email: "test_e2e@gmail.com",
            sid: "S1234567890test_e2e",
            roles: [1],
        }

        it("不符合輸入格式應回傳 400.", async () => {
            // given
            const invalidPayload = [
                {
                    name: "test_e2e",
                    email: "test_e2egmail.com",
                    sid: "S1234567890test_e2e",
                    roles: [1],
                },
                {
                    name: "test_e2e",
                    email: "test_e2e@gmail.com",
                    sid: "S1234567890test_e2e",
                    roles: [],
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

        afterAll(async () => {
            // 測試後刪除所有測資
            await Db.user_role.destroy({ where: { user_id: createdUser?.id } })
            await Db.user.destroy({ where: { email: createUserPayload.email } })
        })
    })
})
