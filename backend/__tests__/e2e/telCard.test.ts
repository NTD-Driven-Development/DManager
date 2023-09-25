import { ForeignKeyConstraintError, Op, Transaction } from "sequelize"
import { App, mockUser } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"
import TelCardContacterDao from "../../src/core/daos/TelCardContacterDao"
import TelCardLogDao from "../../src/core/daos/TelCardLogDao"
import ProjectDao from "../../src/core/daos/ProjectDao"
import BoarderDao from "../../src/core/daos/BoarderDao"

describe("Acceptance test for TelCardController.", () => {
    function givenCreateTelCardContacterPayload(concatStr: string) {
        return {
            name: `ATDD_tel${concatStr}`,
        }
    }

    function givenCreateTelCardLogPayload(
        boarder_id: any,
        project_id: any,
        tel_card_contacter_id: any
    ): any {
        return {
            boarder_id: boarder_id,
            project_id: project_id,
            tel_card_contacter_id: tel_card_contacter_id,
            contacted_at: new Date("2022-01-01T00:00:00.000Z"),
            remark: "ATDD_telCard",
            created_by: mockUser.id,
        }
    }

    describe("取得電話卡聯絡人列表", () => {
        let tel_card_contacter_1: any

        it("建立兩筆電話卡聯絡人，查詢第一頁電話卡聯絡人列表，分頁不大於一筆，statusCode 為 200", async () => {
            // given
            tel_card_contacter_1 = await TelCardContacterDao.create(
                givenCreateTelCardContacterPayload("1")
            )
            const tel_card_contacter_2 = await TelCardContacterDao.create(
                givenCreateTelCardContacterPayload("2")
            )
            const payload = {
                offset: 1,
                limit: 1,
            }
            // when
            const res = await App.get("/api/telCards/contacter").query(payload)
            // then
            const data = res.body?.data
            expect(res.status).toBe(200)
            expect(data?.items.length).toBeLessThanOrEqual(payload.limit)
        })

        it("查詢已建立的單筆電話卡聯絡人紀錄，statusCode 為 200", async () => {
            // given
            const id = tel_card_contacter_1?.id
            // when
            const response = await App.get(`/api/telCards/contacter/${id}`)
            // then
            const data = response.body?.data
            expect(response.status).toBe(200)
            expect(data?.id).toEqual(id)
        })

        it("查無單筆，statusCode 為 404「查無資料」", async () => {
            // given
            const id = -1
            // when
            const response = await App.get(`/api/telCards/contacter/${id}`)
            // then
            expect(response.status).toBe(400)
            expect(response.body?.error).toBe("查無資料")
        })
    })

    describe("建立電話卡聯絡人，並能夠編輯和刪除", () => {
        let testTelCardContacter: any

        it("建立電話卡聯絡人", async () => {
            // given
            const payload = givenCreateTelCardContacterPayload("3")
            // when
            const res = await App.post("/api/telCards/contacter").send(payload)
            // then
            testTelCardContacter = res.body?.data
            expect(res.status).toBe(201)
            expect(testTelCardContacter?.name).toBe(payload.name)
            expect(testTelCardContacter?.created_by).toBe(mockUser.id)
        })

        it("不可重複建立", async () => {
            // given
            const payload = givenCreateTelCardContacterPayload("3")
            // when
            const response = await App.post("/api/telCards/contacter").send(
                payload
            )
            // then
            expect(response.status).toBe(400)
        })

        it("編輯電話卡聯絡人", async () => {
            // given
            const payload = {
                id: testTelCardContacter?.id,
                name: "ATDD_(ed)",
            }
            // when
            const res = await App.put("/api/telCards/contacter").send(payload)
            // then
            expect(res.status).toBe(200)
            const result = await TelCardContacterDao.findOneById(payload.id)
            expect(result.name).toBe(payload.name)
            expect(result.created_by).toBe(mockUser.id)
        })

        it("若電話卡聯絡人名稱已存在，回應 400 「名稱已存在」", async () => {
            // given
            const payload = {
                id: -1,
                name: "ATDD_(ed)",
            }
            // when
            const res = await App.put("/api/telCards/contacter").send(payload)
            // then
            expect(res.status).toBe(400)
            expect(res.body?.error).toBe("名稱已存在")
        })

        it("刪除電話卡聯絡人", async () => {
            // given
            const id = testTelCardContacter?.id
            // when
            const res = await App.delete(`/api/telCards/contacter/${id}`)
            // then
            expect(res.status).toBe(200)
            expect(await TelCardContacterDao.findOneById(id)).toBeNull()
            expect(
                (await Db.tel_card_contacter.findOne({ where: { id: id } }))
                    .deleted_by
            ).toBe(mockUser.id)
        })
    })

    describe("取得住宿生電話卡紀錄，能夠建立及刪除", () => {
        let testProject: any
        let testBoarder: any
        let testTelCardLog: any

        it("建立一個項目、一位住宿生、一個電話卡聯絡人、兩筆住宿生電話卡紀錄", async () => {
            testProject = await ProjectDao.create({
                name: "ATDD_telCard",
            })
            testBoarder = await BoarderDao.create({
                id: "ATDD_telCard",
                project_id: testProject.id as number,
                name: "ATDD_telCard",
                boarder_status_id: 1,
            })
            const testTelCardContacter = await TelCardContacterDao.create(
                givenCreateTelCardContacterPayload("4")
            )
            testTelCardLog = await Db.tel_card_log.create(
                givenCreateTelCardLogPayload(
                    testBoarder.id,
                    testProject.id,
                    testTelCardContacter.id
                )
            )
            await Db.tel_card_log.create(
                givenCreateTelCardLogPayload(
                    testBoarder.id,
                    testProject.id,
                    testTelCardContacter.id
                )
            )
        })

        it("查詢指定項目第一頁取得住宿生電話卡紀錄，並且分頁數量不大於一筆", async () => {
            // given
            const payload = {
                project_id: testProject.id,
                offset: 1,
                limit: 1,
            }
            // when
            const res = await App.get("/api/telCards/log").query(payload)
            // then
            expect(res.status).toBe(200)
            expect(res.body?.data?.items?.length).toBeLessThanOrEqual(1)
        })

        it("取得單筆", async () => {
            // given
            const id = testTelCardLog?.id
            // when
            const response = await App.get(`/api/telCards/log/${id}`)
            // then
            const data = response.body?.data
            expect(response.status).toBe(200)
            expect(data?.id).toEqual(id)
        })

        it("建立住宿生電話卡紀錄", async () => {
            // given
            const payload = givenCreateTelCardLogPayload(
                testBoarder.id,
                testProject.id,
                testTelCardLog.id
            )
            // when
            const res = await App.post("/api/telCards/log").send(payload)
            // then
            testTelCardLog = res.body?.data
            expect(res.status).toBe(201)
            expect(testTelCardLog?.project_id).toBe(payload.project_id)
            expect(testTelCardLog?.boarder_id).toBe(payload.boarder_id)
            expect(testTelCardLog?.tel_card_contacter_id).toBe(
                payload.tel_card_contacter_id
            )
            expect(testTelCardLog?.remark).toBe(payload.remark)
            expect(testTelCardLog?.created_by).toBe(mockUser.id)
        })

        it("刪除住宿生電話卡紀錄", async () => {
            // given
            const id = testTelCardLog?.id
            // when
            const res = await App.delete(`/api/telCards/log/${id}`)
            // then
            expect(res.status).toBe(200)
            const result = await TelCardLogDao.findOneById(id)
            expect(result).toBeNull()
        })
    })
})
