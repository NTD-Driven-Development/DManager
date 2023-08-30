import Sequelize, { Op } from "sequelize"
import { App, mockUser } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"
import PointRuleDao from "../../src/core/daos/PointRuleDao"
import PointLogDao from "../../src/core/daos/PointLogDao"

describe("Acceptance test for PointRuleController.", () => {
    describe("取得加扣點規則列表", () => {
        let testPointRules: any

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
            testPointRules = data
        })

        it("取得單筆", async () => {
            // given
            const id = testPointRules?.items[0]?.id
            // when
            const response = await App.get(`/api/pointRules/${id}`)
            // then
            const data = response.body?.data
            expect(response.status).toBe(200)
            expect(data?.id).toEqual(id)
        })

        it("若取得單筆不存在，回應 404 「查無資料」", async () => {
            // given
            const id = -1
            // when
            const response = await App.get(`/api/pointRules/${id}`)
            // then
            expect(response.status).toBe(400)
            expect(response.body?.error).toBe("查無資料")
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

    describe("取得住宿生加扣點紀錄，能夠建立及刪除", () => {
        let testProject: any
        let testBoarder: any
        let testPointRule: any
        let testPointLog: any

        beforeAll(async () => {
            testProject = await Db.project.create({
                name: "E2eTest",
                remark: "E2eTest",
            })
            testBoarder = await Db.boarder.create({
                id: "E2eTest",
                project_id: testProject.id,
                name: "E2eTest",
                boarder_status_id: 1,
            })
            testPointRule = await Db.point_rule.create({
                code: "E2eTest",
                reason: "E2eTest",
                point: 3,
                is_actived: true,
            })
            await Db.point_log.create({
                boarder_id: testBoarder.id,
                project_id: testProject.id,
                point_rule_id: testPointRule.id,
                remark: "E2eTest123",
                created_by: mockUser.id,
            })
            await Db.point_log.create({
                boarder_id: testBoarder.id,
                project_id: testProject.id,
                point_rule_id: testPointRule.id,
                remark: "E2eTest123",
                created_by: mockUser.id,
            })
        })

        it("取得住宿生加扣點紀錄，並且有分頁", async () => {
            // given
            const payload = {
                project_id: testProject.id,
                offset: 1,
                limit: 1,
            }
            // when
            const res = await App.get("/api/pointRules/log").query(payload)
            // then
            expect(res.status).toBe(200)
            expect(res.body?.data?.items?.length).toBeLessThanOrEqual(1)
        })

        it("建立住宿生加扣點紀錄", async () => {
            // given
            const payload = {
                project_id: testProject.id,
                boarder_id: testBoarder.id,
                point_rule_id: testPointRule.id,
                remark: "E2eTest123",
            }
            // when
            const res = await App.post("/api/pointRules/log").send(payload)
            // then
            testPointLog = res.body?.data
            expect(res.status).toBe(201)
            expect(testPointLog?.project_id).toBe(payload.project_id)
            expect(testPointLog?.boarder_id).toBe(payload.boarder_id)
            expect(testPointLog?.point_rule_id).toBe(payload.point_rule_id)
            expect(testPointLog?.remark).toBe(payload.remark)
            expect(testPointLog?.created_by).toBe(mockUser.id)
        })

        it("刪除住宿生加扣點紀錄", async () => {
            // given
            const id = testPointLog?.id
            // when
            const res = await App.delete(`/api/pointRules/log/${id}`)
            // then
            expect(res.status).toBe(200)
            const result = await PointLogDao.findOneById(id)
            expect(result).toBeNull()
        })

        afterAll(async () => {
            await Db.point_log.destroy({
                where: {
                    project_id: testProject.id,
                },
            })
            await Db.point_rule.destroy({
                where: {
                    id: testPointRule.id,
                },
            })
            await Db.boarder.destroy({
                where: {
                    id: testBoarder.id,
                },
            })
            await Db.project.destroy({
                where: {
                    id: testProject.id,
                },
            })
        })
    })
})
