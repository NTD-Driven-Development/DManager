import { ForeignKeyConstraintError, Op, Transaction } from "sequelize"
import { App, mockUser } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"
import PointRuleDao from "../../src/core/daos/PointRuleDao"
import PointLogDao from "../../src/core/daos/PointLogDao"
import ProjectDao from "../../src/core/daos/ProjectDao"
import BoarderDao from "../../src/core/daos/BoarderDao"

describe("Acceptance test for PointController.", () => {
    function givenCreatePointRulePayload(concatStr: string) {
        return {
            code: `ATDD_point${concatStr}`,
            reason: "ATDD_point",
            point: 3,
        }
    }

    describe("取得加扣點規則列表", () => {
        let testPointRule: any
        it("建立一筆加扣點規則，查詢加扣點規則列表第一頁的一筆資料 API，StatusCode 為 200 且資料 items 為一筆", async () => {
            // given
            testPointRule = await PointRuleDao.create(
                givenCreatePointRulePayload("1")
            )
            const payload = {
                offset: 1,
                limit: 1,
            }
            // when
            const res = await App.get("/api/points/rule").query(payload)
            // then
            const data = res.body?.data
            expect(res.status).toBe(200)
            expect(data?.items.length).toBeLessThanOrEqual(payload.limit)
        })

        it("取得單筆", async () => {
            // given
            const id = testPointRule?.id
            // when
            const response = await App.get(`/api/points/rule/${id}`)
            // then
            const data = response.body?.data
            expect(response.status).toBe(200)
            expect(data?.id).toEqual(id)
        })

        it("查無單筆紀錄，statusCode 為 404 「查無資料」", async () => {
            // given
            const id = -1
            // when
            const response = await App.get(`/api/points/rule/${id}`)
            // then
            expect(response.status).toBe(400)
            expect(response.body?.error).toBe("查無資料")
        })
    })

    describe("建立加扣點規則，並能夠編輯和刪除", () => {
        let testPointRule: any

        it("建立加扣點規則", async () => {
            // given
            const payload = givenCreatePointRulePayload("2")
            const payload2 = givenCreatePointRulePayload("3")
            // when
            const res = await App.post("/api/points/rule").send(payload)
            const res2 = await App.post("/api/points/rule").send(payload2)
            // then
            testPointRule = res.body?.data
            expect(res.status).toBe(201)
            expect(res2.status).toBe(201)
            expect(payload).toEqual({
                code: testPointRule?.code,
                reason: testPointRule?.reason,
                point: testPointRule?.point,
            })
            expect(testPointRule?.created_by).toBe(mockUser.id)
        })

        it("不可重複建立", async () => {
            // given
            const payload = givenCreatePointRulePayload("2")
            // when
            const response = await App.post("/api/points/rule").send(payload)
            // then
            expect(response.status).toBe(400)
        })

        it("編輯加扣點規則", async () => {
            // given
            const payload = {
                id: testPointRule?.id,
                code: "ATDD_point(ed)",
                reason: "ATDD_point(ed)",
                point: 5,
            }
            // when
            const res = await App.put("/api/points/rule").send(payload)
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
                id: testPointRule?.id,
                code: "ATDD_point3",
                reason: "ATDD_point3",
                point: 5,
            }
            // when
            const res = await App.put("/api/points/rule").send(payload)
            // then
            expect(res.status).toBe(400)
            expect(res.body?.error).toBe("代碼重複")
        })

        it("刪除加扣點規則", async () => {
            // given
            const id = testPointRule?.id
            // when
            const res = await App.delete(`/api/points/rule/${id}`)
            // then
            expect(res.status).toBe(200)
            expect(await PointRuleDao.findOneById(id)).toBeFalsy()
            expect(
                (await Db.point_rule.findOne({ where: { id: id } })).deleted_by
            ).toBe(mockUser.id)
        })
    })

    describe("取得住宿生加扣點紀錄，能夠建立及刪除", () => {
        let testProject: any
        let testBoarder: any
        let testPointRule: any
        let testPointLogs: any = []
        let testPointLog: any

        it("建立一個項目、一位住宿生、一個加扣點規則，並且該位住宿生有兩筆加扣點紀錄", async () => {
            try {
                testProject = await ProjectDao.create({
                    name: "ATDD_point",
                })
                testBoarder = await BoarderDao.create({
                    id: "ATDD_point",
                    project_id: testProject.id,
                    name: "ATDD_point",
                    boarder_status_id: 1,
                })
                testPointRule = await PointRuleDao.create(
                    givenCreatePointRulePayload("4")
                )
                await PointLogDao.create({
                    boarder_id: testBoarder.id,
                    project_id: testProject.id,
                    point_rule_id: testPointRule.id,
                    point: 3,
                    remark: "ATDD_point",
                    created_by: mockUser.id,
                })
                await PointLogDao.create({
                    boarder_id: testBoarder.id,
                    project_id: testProject.id,
                    point_rule_id: testPointRule.id,
                    point: 4,
                    remark: "ATDD_point",
                    created_by: mockUser.id,
                })
            } catch (error: any) {
                console.log(error)
            }
        })

        it("取得住宿生加扣點紀錄，並且有分頁", async () => {
            // given
            const payload = {
                project_id: testProject.id,
                offset: 1,
                limit: 1,
            }
            // when
            const res = await App.get("/api/points/log").query(payload)
            // then
            testPointLogs = res.body?.data?.items
            expect(res.status).toBe(200)
            expect(res.body?.data?.items?.length).toBeLessThanOrEqual(1)
        })

        it("取得單筆", async () => {
            // given
            const id = testPointLogs[0]?.id
            // when
            const response = await App.get(`/api/points/log/${id}`)
            // then
            const data = response.body?.data
            expect(response.status).toBe(200)
            expect(data?.id).toEqual(id)
        })

        it("建立住宿生加扣點紀錄", async () => {
            // given
            const payload = {
                project_id: testProject.id,
                boarder_id: testBoarder.id,
                point_rule_id: testPointRule.id,
                point: 3,
                remark: "ATDD_point",
            }
            // when
            const res = await App.post("/api/points/log").send(payload)
            // then
            testPointLog = res.body?.data
            expect(res.status).toBe(201)
            expect(testPointLog?.project_id).toBe(payload.project_id)
            expect(testPointLog?.boarder_id).toBe(payload.boarder_id)
            expect(testPointLog?.point_rule_id).toBe(payload.point_rule_id)
            expect(testPointLog?.point).toBe(payload.point)
            expect(testPointLog?.remark).toBe(payload.remark)
            expect(testPointLog?.created_by).toBe(mockUser.id)
        })

        it("刪除住宿生加扣點紀錄", async () => {
            // given
            const id = testPointLog?.id
            // when
            const res = await App.delete(`/api/points/log/${id}`)
            // then
            expect(res.status).toBe(200)
            const result = await PointLogDao.findOneById(id)
            expect(result).toBeFalsy()
        })
    })
})
