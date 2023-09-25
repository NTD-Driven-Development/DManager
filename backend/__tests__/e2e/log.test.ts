import { Op } from "sequelize"
import { App, mockUser } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"
import LogDao from "../../src/core/daos/LogDao"

describe("Acceptance test for LogController.", () => {

    describe("取得操作紀錄列表", () => {
        it("已有一筆 LOG 紀錄，查詢第一頁 1 筆項目的操作紀錄列表，得到結果為第一頁且 items 項目低於或等於 1 筆，且包含必要項目「http_method, url, http_status, detail, user_id, user_name, client_ip, server_ip, created_at 」", async () => {
            // given
            const payload = {
                offset: 1,
                limit: 1,
            }
            await LogDao.saveSysLog({
                url: "ATDD_log",
                http_method: "GET",
                http_status: 200,
                user_agent: "ATDD_log",
                detail: "ATDD_log",
                clientip: "ATDD_log",
                serverip: "ATDD_log",
            })
            // when
            const res = await App.get("/api/logs/operation").query(payload)
            // then
            expect(res.status).toBe(200)
            expect(res.body?.data?.items.length).toBeLessThanOrEqual(payload.limit)
            _.forEach(res.body?.data?.items, (item) => {
                expect(item).toHaveProperty("id")
                expect(item).toHaveProperty("url")
                expect(item).toHaveProperty("http_method")
                expect(item).toHaveProperty("http_status")
                expect(item).toHaveProperty("user_id")
                expect(item).toHaveProperty("user_name")
                expect(item).toHaveProperty("detail")
                expect(item).toHaveProperty("clientip")
                expect(item).toHaveProperty("serverip")
                expect(item).toHaveProperty("created_at")
            })
        })
    })
})