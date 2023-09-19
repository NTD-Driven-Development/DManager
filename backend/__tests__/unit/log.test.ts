import LogDao from "../../src/core/daos/LogDao"
import LogService from "../../src/core/services/LogService"

jest.spyOn(JSON, "stringify")

describe("Unit test for LogService", () => {
    const fakeRequest = {
        headers: {
            "user-agent": "UnitTest",
            "x-forwarded-for": "127.0.0.1",
            authorization: "bearer xxx",
        },
        user: {
            id: 1,
            name: "TEST",
        },
        params: { id: "3" },
        body: {},
        query: {},
        baseUrl: "/api/users",
        route: {
            path: "/:id",
        },
        method: "GET",
    } as any

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe("測試寫入系統日誌", () => {
        it("傳入當前請求資訊及狀態碼，呼叫 LogDao 寫入 SysLog: ip, url, httpMethod, statusCode, userAgent, userId, userName 以及攜帶參數資料，並確保 header, params, query, body 存入的是 json，不可存入 authorization", async () => {
            // given
            const detail = undefined
            const req = fakeRequest
            const statusCode = 200
            // when
            jest.spyOn(Date, "now").mockReturnValue(1234567890)
            jest.spyOn(LogDao, "saveSysLog").mockResolvedValue({
                id: 1,
                clientip: "127.0.0.1",
                serverip: "127.0.0.1",
                url: "api/users",
                http_method: "GET",
                http_status: statusCode,
                user_agent: "UnitTest",
                user_id: 1,
                user_name: "TEST",
                headers: `{"user-agent":"UnitTest","x-forwarded-for":""}`,
                query: "",
                params: `{"id":"3"}`,
                body: "",
                detail: undefined,
                created_at: new Date(),
            })
            const result = await LogService.saveSysLog(req, statusCode, detail)
            // then
            expect(JSON.stringify).toBeCalledTimes(4)
            expect(LogDao.saveSysLog).toBeCalledTimes(1)
            expect(LogDao.saveSysLog).toBeCalledWith({
                body: "{}",
                clientip: "127.0.0.1",
                detail: undefined,
                headers:
                    '{"user-agent":"UnitTest","x-forwarded-for":"127.0.0.1"}',
                http_method: "GET",
                http_status: 200,
                params: `{"id":"3"}`,
                query: "{}",
                serverip: "172.18.0.4",
                url: "/api/users/:id",
                user_agent: "UnitTest",
                user_id: 1,
                user_name: "TEST",
            })
        })
    })

    describe("測試寫入錯誤日誌", () => {
        it("傳入當前請求資訊及狀態碼，呼叫 LogDao 寫入 ErrorLog: ip, url, httpMethod, statusCode, userAgent, userId, userName 以及攜帶參數資料，不可存入 authorization", async () => {
            // given
            const detail = undefined
            const req = fakeRequest
            const statusCode = 400
            // when
            jest.spyOn(Date, "now").mockReturnValue(1234567890)
            jest.spyOn(LogDao, "saveSysErrorLog").mockResolvedValue({
                id: 1,
                clientip: "127.0.0.1",
                serverip: "127.0.0.1",
                url: "api/users/:id",
                http_method: "GET",
                http_status: statusCode,
                user_agent: "UnitTest",
                user_id: 1,
                user_name: "TEST",
                headers: `{"user-agent":"UnitTest","x-forwarded-for":""}`,
                query: "",
                params: `{"id":"3"}`,
                body: "",
                detail: undefined,
                created_at: new Date(),
            })
            const result = await LogService.saveSysErrorLog(
                req,
                statusCode,
                detail
            )
            // then
            expect(JSON.stringify).toBeCalledTimes(4)
            expect(LogDao.saveSysErrorLog).toBeCalledTimes(1)
            expect(LogDao.saveSysErrorLog).toBeCalledWith({
                body: "{}",
                clientip: "127.0.0.1",
                detail: undefined,
                headers:
                    '{"user-agent":"UnitTest","x-forwarded-for":"127.0.0.1"}',
                http_method: "GET",
                http_status: 400,
                params: `{"id":"3"}`,
                query: "{}",
                serverip: "172.18.0.4",
                url: "/api/users/:id",
                user_agent: "UnitTest",
                user_id: 1,
                user_name: "TEST",
            })
        })
    })
})
