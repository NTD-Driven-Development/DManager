import AuthService from "../../src/core/services/AuthService"
import LogDao from "../../src/core/daos/LogDao"
import AuthDao from "../../src/core/daos/AuthDao"
import mailUtil from "../../src/utils/sendMail"
import moment from "moment"
import * as uuid from "uuid"
import strings from "../../src/utils/strings"
import jwt from "jsonwebtoken"
import { mockUser } from "../../config/preE2eConfig"
jest.mock("uuid")

describe("Unit Test for AuthService", () => {
    afterEach(() => {
        jest.restoreAllMocks()
    })

    const fakeRequest = {
        headers: {
            "user-agent": "UnitTest",
            "x-forwarded-for": "UnitTest",
        },
    } as any

    describe("登入", () => {
        it("登入成功，應回傳 access_token, refresh_token", async () => {
            // given
            const payload = {
                email: "123@gmail.com",
            }
            // when
            jest.spyOn(AuthDao, "getUserAuthInfoByEmail").mockResolvedValue({
                id: 1,
                email: payload.email,
                roles: [],
            } as any)
            jest.spyOn(jwt, "sign").mockImplementation(() => "UnitTest")
            jest.spyOn(uuid, "v4").mockReturnValue("UnitTest")
            jest.spyOn(LogDao, "saveSysAuthLog").mockResolvedValue({} as any)
            const result = await AuthService.login(mockUser as any, fakeRequest)
            // then
            expect(result).toHaveProperty("access_token")
            expect(result).toHaveProperty("refresh_token")
            expect(result.access_token).toEqual("Bearer " + "UnitTest")
            expect(result.refresh_token).toEqual("UnitTest")
            expect(jwt.sign).toBeCalledTimes(1)
            expect(uuid.v4).toBeCalledTimes(1)
            expect(LogDao.saveSysAuthLog).toBeCalledTimes(1)
        })
    })

    describe("忘記密碼", () => {
        it("查無此帳號，應擲出例外「查無此帳號」，狀態碼 400", async () => {
            // given
            const payload = {
                email: "123@gmail.com",
            }
            const errorMessage: string = "查無此帳號"
            // when
            jest.spyOn(AuthDao, "getUserInfoByEmail").mockResolvedValue(
                {} as any
            )
            const result = AuthService.forgetPassword(
                fakeRequest as any,
                payload.email
            )
            // then
            expect(AuthDao.getUserInfoByEmail).toBeCalledTimes(1)
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })

        it("確認有發送信件以及紀錄「忘記密碼」LOG。", async () => {
            // given
            const payload = {
                email: "123@gmail.com",
            }
            // when
            jest.spyOn(AuthDao, "getUserInfoByEmail").mockResolvedValue({
                id: 1,
                name: "UnitTest",
                email: payload.email,
            } as any)
            jest.spyOn(mailUtil, "sendEmail").mockResolvedValue()
            jest.spyOn(LogDao, "saveSysPasswordLog").mockResolvedValue(
                {} as any
            )
            await AuthService.forgetPassword(fakeRequest as any, payload.email)
            // then
            expect(mailUtil.sendEmail).toBeCalledTimes(1)
            expect(LogDao.saveSysPasswordLog).toBeCalledTimes(1)
        })

        it("忘記密碼權杖驗證成功應配發驗證成功 Token，並更新該筆 LOG", async () => {
            // given
            const payload = {
                email: "123@gmail.com",
                token: "UnitTest",
            }
            const verified_token = "123123123"
            // when
            jest.spyOn(uuid, "v4").mockReturnValue(verified_token)
            jest.spyOn(LogDao, "findSysPasswordLogByEmail").mockResolvedValue({
                id: 1,
                email: payload.email,
                token: payload.token,
            } as any)
            jest.spyOn(LogDao, "updateSysPasswordLog").mockResolvedValue({
                affectedRows: 1,
            } as any)
            jest.spyOn(Date, "now").mockReturnValue(
                new Date("2021-01-01 00:00:10").getTime()
            )
            const result = await AuthService.verifyForgetPasswordToken(
                payload.email,
                payload.token
            )
            // then
            expect(uuid.v4).toBeCalledTimes(1)
            expect(LogDao.findSysPasswordLogByEmail).toBeCalledTimes(1)
            expect(LogDao.updateSysPasswordLog).toBeCalledTimes(1)
            expect(LogDao.updateSysPasswordLog).toBeCalledWith({
                id: 1,
                verified_token: verified_token,
                verified_at: moment().toDate(),
            })
            expect(result).toEqual(verified_token)
        })

        it("忘記密碼權杖驗證失敗，應擲出例外「驗證碼錯誤」，狀態碼 400", async () => {
            // given
            const payload = {
                email: "123@gmail.com",
                token: "UnitTest",
            }
            const errorMessage: string = "驗證碼錯誤"
            // when
            jest.spyOn(LogDao, "findSysPasswordLogByEmail").mockResolvedValue({
                email: payload.email,
                token: "abc123",
            } as any)
            const result = AuthService.verifyForgetPasswordToken(
                payload.email,
                payload.token
            )
            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })

        it("攜帶驗證成功後的 verified_token 進行重設密碼，並記錄「重設成功」LOG，最後核發 access_token, refresh_token", async () => {
            // given
            const payload = {
                token: "UnitTest",
                password: "UnitTest",
            }
            const fakeAccessToken = "signedToken"
            const fakeRefreshToken = "signedRefreshToken"
            // when
            jest.spyOn(AuthDao, "getUserAuthInfoByEmail").mockResolvedValue({
                id: 1,
                email: "abc@gmail.com",
                roles: null,
            } as any)
            jest.spyOn(
                LogDao,
                "findSysPasswordLogByVerifiedToken"
            ).mockResolvedValue({
                email: "123@gmail.com",
                verified_token: payload.token,
            } as any)
            jest.spyOn(AuthDao, "updateUserPasswordByEmail").mockResolvedValue({
                affectedRows: 1,
            } as any)
            jest.spyOn(LogDao, "saveSysPasswordLog").mockResolvedValue(
                {} as any
            )
            // must be hash password
            jest.spyOn(strings, "hash").mockReturnValue("UnitTest")
            jest.spyOn(jwt, "sign").mockImplementation(() => fakeAccessToken)
            jest.spyOn(uuid, "v4").mockReturnValue(fakeRefreshToken)
            jest.spyOn(LogDao, "saveSysAuthLog").mockResolvedValue({} as any)
            const result = await AuthService.resetPassword(
                fakeRequest,
                payload.token,
                payload.password
            )
            // then
            expect(result).toHaveProperty("access_token")
            expect(result).toHaveProperty("refresh_token")
            expect(result.access_token).toEqual("Bearer " + fakeAccessToken)
            expect(result.refresh_token).toEqual(fakeRefreshToken)
            expect(strings.hash).toBeCalledTimes(1)
            expect(LogDao.findSysPasswordLogByVerifiedToken).toBeCalledTimes(1)
            expect(AuthDao.updateUserPasswordByEmail).toBeCalledTimes(1)
            expect(LogDao.saveSysPasswordLog).toBeCalledTimes(1)
            expect(LogDao.saveSysAuthLog).toBeCalledTimes(1)
        })

        it("若攜帶 verified_token 進行重設密碼，但查無此權杖，應擲出例外「傳送資料錯誤」，狀態碼 400", async () => {
            // given
            const payload = {
                token: "UnitTest",
                password: "UnitTest",
            }
            const errorMessage: string = "傳送資料錯誤"
            // when
            jest.spyOn(
                LogDao,
                "findSysPasswordLogByVerifiedToken"
            ).mockResolvedValue({} as any)
            const result = AuthService.resetPassword(
                fakeRequest,
                payload.token,
                payload.password
            )
            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })

        // it("1 分鐘內不可重複發送，若發生則擲出例外「請稍後 1 分鐘再試」", async () => {
        //     // given
        //     const payload = {
        //         email: "123@gmail.com",
        //     }
        //     const errorMessage: string = "請稍後 1 分鐘再試"
        //     // when
        //     // mock moment().toDate() 為 2021-01-01 00:00:10
        //     jest.spyOn(Date, "now").mockReturnValue(
        //         new Date("2021-01-01 00:00:10").getTime()
        //     )
        //     jest.spyOn(LogDao, "findSysPasswordLogByEmail").mockResolvedValue({
        //         email: payload.email,
        //         expired_at: new Date("2021-01-01 00:01:00"),
        //     } as any)
        //     jest.spyOn(mailUtil, "sendEmail").mockResolvedValue()
        //     const result = AuthService.forgetPassword(payload.email)
        //     // then
        //     expect(LogDao.findSysPasswordLogByEmail).toBeCalledTimes(1)
        //     expect(mailUtil.sendEmail).toBeCalledTimes(0)
        //     await expect(result).rejects.toThrow(errorMessage)
        // })
    })

    describe("修改密碼", () => {
        it("修改密碼成功，應更新「使用者」資料表密碼，並記錄「修改密碼」LOG", async () => {
            // given
            const payload = {
                email: "123@gmail.com",
                old_password: "UnitTest",
                new_password: "UnitTest123",
            }
            // when
            jest.spyOn(AuthDao, "getUserInfoByEmail").mockResolvedValue({
                id: 1,
                email: payload.email,
                password: "UnitTesthashed",
            } as any)
            jest.spyOn(AuthDao, "updateUserPasswordByEmail").mockResolvedValue({
                affectedRows: 1,
            } as any)
            jest.spyOn(LogDao, "saveSysPasswordLog").mockResolvedValue(
                {} as any
            )
            // must be verify old_password
            jest.spyOn(strings, "verifyHash").mockReturnValue(true)
            // must be hash new_password
            jest.spyOn(strings, "hash").mockReturnValue("UnitTest123")
            await AuthService.changePassword(
                fakeRequest,
                payload.email,
                payload.old_password,
                payload.new_password
            )
            // then
            expect(strings.verifyHash).toBeCalledTimes(1)
            expect(strings.hash).toBeCalledTimes(1)
            expect(AuthDao.getUserInfoByEmail).toBeCalledTimes(1)
            expect(AuthDao.updateUserPasswordByEmail).toBeCalledTimes(1)
            expect(LogDao.saveSysPasswordLog).toBeCalledTimes(1)
        })

        it("若舊密碼輸入錯誤則擲出例外「舊密碼錯誤」，狀態碼 400", async () => {
            // given
            const payload = {
                email: "123@gmail.com",
                old_password: "UnitTest",
                new_password: "UnitTest123",
            }
            const errorMessage: string = "舊密碼錯誤"
            // when
            jest.spyOn(AuthDao, "getUserInfoByEmail").mockResolvedValue({
                id: 1,
                email: payload.email,
                password: "UnitTesthashed",
            } as any)
            jest.spyOn(strings, "verifyHash").mockReturnValue(false)
            const result = AuthService.changePassword(
                fakeRequest,
                payload.email,
                payload.old_password,
                payload.new_password
            )
            // then
            expect(AuthDao.getUserInfoByEmail).toBeCalledTimes(1)
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })

    describe("取得個人資料", () => {
        it("取得個人資料成功，應回傳使用者資料", async () => {
            // given
            const payload = {
                email: "",
            }
            // when
            jest.spyOn(AuthDao, "getUserAuthInfoByEmail").mockResolvedValue({
                id: 1,
                email: "",
                remark: "",
                name: "",
                roles: [],
            } as any)
            const result = await AuthService.getUserAuthInfoById(1)
            // then
            expect(result).toHaveProperty("id")
            expect(result).toHaveProperty("email")
            expect(result).toHaveProperty("name")
            expect(result).toHaveProperty("remark")
            expect(result).toHaveProperty("is_admin")
            expect(result).toHaveProperty("is_actived")
            expect(result).toHaveProperty("roles")
            expect(result).toHaveProperty("permissions")
        })
    })
})
