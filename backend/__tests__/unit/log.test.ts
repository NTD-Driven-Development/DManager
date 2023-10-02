import LogDao from "../../src/core/daos/LogDao"
import LogService from "../../src/core/services/LogService"
import ip from "../../src/utils/ip"

jest.spyOn(JSON, "stringify")
jest.spyOn(ip, "getClientIp").mockReturnValue("127.0.0.1")
jest.spyOn(ip, "getServerIp").mockReturnValue("127.0.0.1")

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
    const fakeLog = {
        id: 1,
        clientip: "123",
        serverip: "123",
        url: "123",
        http_method: "123",
        http_status: 123,
        user_agent: "123",
        user_id: 1,
        user_name: "123",
        headers: "123",
        query: "123",
        params: "123",
        body: "123",
        detail: "123",
        created_at: new Date(),
    } as any

    function testLogDataFactory(count: number) {
        const result: any[] = []
        for (let i = 1; i <= count; i++) {
            result.push({
                id: i,
                user_id: i + 10,
                user_name: `name${i}`,
                operation_name: `operation${i}`,
            })
        }
        return result
    }

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
                serverip: "127.0.0.1",
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
                serverip: "127.0.0.1",
                url: "/api/users/:id",
                user_agent: "UnitTest",
                user_id: 1,
                user_name: "TEST",
            })
        })
    })

    describe("讀取操作紀錄列表", () => {
        it("查詢第一頁，每頁一筆資料，呼叫 LogDao 取得操作紀錄列表", async () => {
            // given
            const payload = {
                offset: 1,
                limit: 1,
            }
            // when
            jest.spyOn(LogDao, "findAllSysLog").mockResolvedValue([
                fakeLog,
                fakeLog,
            ])
            // jest.spyOn(LogDao, "findAllSysErrorLog").mockResolvedValue([
            //     fakeLog,
            //     fakeLog,
            // ])
            const result = await LogService.getOperationLogs(payload)
            // then
            // expect(LogDao.findAllSysErrorLog).toBeCalledTimes(1)
            expect(LogDao.findAllSysLog).toBeCalledTimes(1)
            expect(result).toEqual({
                total: 2,
                per_page: 1,
                current_page: 1,
                last_page: 2,
                from: 1,
                to: 1,
                items: [fakeLog],
            })
        })

        it("給予查詢參數 search，搜尋符合使用者id、使用者名稱、操作名稱", async () => {
            // given
            const payload1 = {
                search: "11",
            }
            const payload2 = {
                search: "name",
            }
            const payload3 = {
                search: "operation2",
            }
            // when
            jest.spyOn(LogDao, "findAllSysLog").mockResolvedValue(testLogDataFactory(3))
            const result1 = await LogService.getOperationLogs(payload1)
            const result2 = await LogService.getOperationLogs(payload2)
            const result3 = await LogService.getOperationLogs(payload3)
            // then
            expect(result1.items.length).toBe(1)
            expect(result2.items.length).toBe(3)
            expect(result3.items.length).toBe(1)
        })
    })
})
