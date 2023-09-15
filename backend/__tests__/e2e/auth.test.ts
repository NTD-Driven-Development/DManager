import { App, mockUser, mockBeforeLoginHeader } from "../../config/preE2eConfig"
import mail from "../../src/utils/sendMail"
import Db from "../../src/models"
import _ from "lodash"
import LogDao from "../../src/core/daos/LogDao"
import strings from "../../src/utils/strings"

describe("AuthController", () => {
    const orgPassword = "test123456"
    const hashPassword = strings.hash(orgPassword)
    const fakeUser = {
        email: "testerE2e@gmail.com",
        is_admin: false,
        password: hashPassword,
        name: "testerE2e",
    }

    afterEach(async () => {
        jest.restoreAllMocks()
    })

    beforeAll(async () => {
        // 建立測試帳號
        await Db.user.create(fakeUser)
    })

    describe("登入登出流程", () => {
        let refresh_token: string
        let access_token: string

        it("成功登入", async () => {
            // given
            const payload = {
                email: fakeUser.email,
                password: orgPassword,
            }
            // when
            const res = await App.post("/api/auth/login")
                .set(mockBeforeLoginHeader)
                .send(payload)
            // then
            expect(res.status).toBe(200)
            expect(res.header["set-cookie"][0]).toContain("refresh_token")
            expect(res.body.data.access_token).toBeDefined()
            access_token = res.body.data.access_token
            refresh_token = res.header["set-cookie"][0]
                .split("=")[1]
                .split(";")[0]
        })

        it("成功刷新 Token", async () => {
            // given
            // when
            const res = await App.post("/api/auth/refresh")
                .set(mockBeforeLoginHeader)
                .set("Cookie", [`refresh_token=${refresh_token}`])
                .set("Authorization", `${access_token}`)
                .send()
            // then
            expect(res.status).toBe(200)
            expect(res.header["set-cookie"][0]).toContain("refresh_token")
            expect(res.body.data.access_token).toBeDefined()
            access_token = res.body.data.access_token
        })

        it("成功登出", async () => {
            // when
            const res = await App.post("/api/auth/logout")
                .set(mockBeforeLoginHeader)
                .set("Authorization", `${access_token}`)
                .send()
            // then
            expect(res.status).toBe(200)
            expect(res.header["set-cookie"][0]).toContain("refresh_token=;")
        })
    })

    describe("忘記密碼流程", () => {
        let forget_password_token: string

        it("成功送出忘記密碼信件", async () => {
            // given
            const payload = {
                email: fakeUser.email,
            }
            // when
            jest.spyOn(mail, "sendEmail").mockImplementation(() =>
                Promise.resolve()
            )
            const res = await App.post("/api/auth/forget")
                .set(mockBeforeLoginHeader)
                .send(payload)
            // then
            expect(res.status).toBe(200)
            expect(mail.sendEmail).toBeCalledTimes(1)
        })

        it("驗證忘記密碼信件", async () => {
            // given
            const token = (
                await LogDao.findSysPasswordLogByEmail(fakeUser.email)
            ).token
            const payload = {
                email: fakeUser.email,
                token: token,
            }
            // when
            const res = await App.post("/api/auth/verifyForget")
                .set(mockBeforeLoginHeader)
                .send(payload)
            // then
            expect(res.status).toBe(200)
            expect(res.header["set-cookie"][0]).toContain(
                "forget_password_token"
            )
            forget_password_token = res.header["set-cookie"][0]
                .split("=")[1]
                .split(";")[0]
        })

        it("重設密碼", async () => {
            // given
            const payload = {
                password: "test123456",
            }
            // when
            const res = await App.patch("/api/auth/resetPassword")
                .set(mockBeforeLoginHeader)
                .set("Cookie", [
                    `forget_password_token=${forget_password_token}`,
                ])
                .send(payload)
            // then
            expect(res.status).toBe(200)
            expect(res.header["set-cookie"][0]).toContain("refresh_token")
            expect(res.body.data.access_token).toBeDefined()
        })
    })

    describe("取得個人資訊", () => {
        it("成功取得個人資訊", async () => {
            // given
            // when
            const res = await App.get("/api/auth/check").send()
            // then
            const data = res.body.data
            expect(res.status).toBe(200)
            expect(data).toHaveProperty("id")
            expect(data).toHaveProperty("email")
            expect(data).toHaveProperty("name")
            expect(data).toHaveProperty("is_admin")
            expect(data).toHaveProperty("is_actived")
            expect(data).toHaveProperty("roles")
            expect(data).toHaveProperty("permissions")
            expect(data).toHaveProperty("remark")
        })
    })

    afterAll(async () => {
        await Db.sys_password_log.destroy({ where: { email: fakeUser.email } })
        await Db.user.destroy({ where: { email: fakeUser.email } })
    })
})
