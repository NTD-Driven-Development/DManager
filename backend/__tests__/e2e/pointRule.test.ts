import Sequelize, { Op } from "sequelize"
import { App } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"

describe("Acceptance test for PointRuleController.", () => {
    describe("取得加扣點規則列表", () => {
        it("取得加扣點規則列表", async () => {
            const res = await App.get("/api/pointRules")
            expect(res.status).toBe(200)
        })

        it("取得加扣點規則列表，並且有分頁", async () => {
            const payload = {
                offset: 1,
                limit: 1,
            }
            const res = await App.get("/api/pointRules").query(payload)
            const data = res.body?.data
            expect(res.status).toBe(200)
            expect(data?.items.length).toBeLessThanOrEqual(payload.limit)
        })
    })

    describe("建立加扣點規則，並能夠編輯和刪除", () => {
        let testPointRule: any

        it("建立加扣點規則", async () => {
            const payload = {
                code: "E2eTest",
                reason: "E2eTest",
                point: 3,
            }

            const res = await App.post("/api/pointRules").send(payload)
            testPointRule = res.body?.data

            expect(res.status).toBe(201)
            expect(payload).toEqual({
                code: testPointRule?.code,
                reason: testPointRule?.reason,
                point: testPointRule?.point,
            })
        })

        it("不可重複建立", async () => {
            // given
            const payload = {
                code: "E2eTest",
                reason: "E2eTest",
                point: 3,
            }

            // when
            const response = await App.post("/api/pointRules").send(payload)

            // then
            expect(response.status).toBe(400)
        })

        it("編輯加扣點規則", async () => {
            const payload = {
                id: testPointRule?.id,
                code: "E2eTest(Edited)",
                reason: "E2eTest(Edited)",
                point: 5,
            }

            const res = await App.put("/api/pointRules").send(payload)

            expect(res.status).toBe(200)
        })

        it("確認加扣點規則是否編輯成功", async () => {
            const res = await App.get("/api/pointRules")
            const data = res.body?.data?.items
            const target = _.find(data, { id: testPointRule?.id })
            expect(target?.code).toBe("E2eTest(Edited)")
            expect(target?.reason).toBe("E2eTest(Edited)")
            expect(target?.point).toBe(5)
        })

        it("刪除加扣點規則", async () => {
            const id = testPointRule?.id

            const res = await App.delete(`/api/pointRules/${id}`)

            expect(res.status).toBe(200)
        })

        it("確認加扣點規則是否刪除成功", async () => {
            const id = testPointRule?.id

            const res = await App.get("/api/pointRules")
            const data = res.body?.data?.items
            const target = _.find(data, { id: id })

            expect(res.status).toBe(200)
            expect(target).toBeUndefined()
        })

        afterAll(async () => {
            await Db.point_rule.destroy({
                where: {
                    id: testPointRule?.id,
                },
            })
        })
    })
})
