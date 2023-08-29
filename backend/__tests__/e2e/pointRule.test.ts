import Sequelize, { Op } from "sequelize"
import { App, mockUser } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"
import PointRuleDao from "../../src/core/daos/PointRuleDao"

describe("Acceptance test for PointRuleController.", () => {
    describe("取得加扣點規則列表", () => {
        it("取得加扣點規則列表", async () => {
            // given
            // when
            const res = await App.get("/api/pointRules")
            // then
            expect(res.status).toBe(200)
        })

        it("取得加扣點規則列表，並且有分頁", async () => {
            // given
            const payload = {
                offset: 1,
                limit: 1,
            }
            // when
            const res = await App.get("/api/pointRules").query(payload)
            // then
            const data = res.body?.data
            expect(res.status).toBe(200)
            expect(data?.items.length).toBeLessThanOrEqual(payload.limit)
        })
    })

    describe("建立加扣點規則，並能夠編輯和刪除", () => {
        let testPointRule: any

        it("建立加扣點規則", async () => {
            // given
            const payload = {
                code: "E2eTest",
                reason: "E2eTest",
                point: 3,
            }
            // when
            const res = await App.post("/api/pointRules").send(payload)
            // then
            testPointRule = res.body?.data
            expect(res.status).toBe(201)
            expect(payload).toEqual({
                code: testPointRule?.code,
                reason: testPointRule?.reason,
                point: testPointRule?.point,
            })
            expect(testPointRule?.created_by).toBe(mockUser.id)
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
            // given
            const payload = {
                id: testPointRule?.id,
                code: "E2eTest(Edited)",
                reason: "E2eTest(Edited)",
                point: 5,
            }
            // when
            const res = await App.put("/api/pointRules").send(payload)
            // then
            expect(res.status).toBe(200)
            const result = await PointRuleDao.findOneById(payload.id)
            expect(result.code).toEqual(payload.code)
            expect(result.reason).toEqual(payload.reason)
            expect(result.point).toEqual(payload.point)
            expect(result.updated_by).toBe(mockUser.id)
        })

        it("若編輯代碼已存在應回應 400", async () => {
            // given
            const payload = {
                id: -1,
                code: "E2eTest(Edited)",
                reason: "E2eTest(Edited)",
                point: 5,
            }
            // when
            const res = await App.put("/api/pointRules").send(payload)
            // then
            expect(res.status).toBe(400)
            expect(res.body?.error).toBe("代碼重複")
        })

        it("刪除加扣點規則", async () => {
            // given
            const id = testPointRule?.id
            // when
            const res = await App.delete(`/api/pointRules/${id}`)
            // then
            expect(res.status).toBe(200)
            expect(await PointRuleDao.findOneById(id)).toBeNull()
            expect(
                (await Db.point_rule.findOne({ where: { id: id } })).deleted_by
            ).toBe(mockUser.id)
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
