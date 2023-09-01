import { Op } from "sequelize"
import { App, mockUser } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"
import TelCardContacterDao from "../../src/core/daos/TelCardContacterDao"
import TelCardLogDao from "../../src/core/daos/TelCardLogDao"

describe("Acceptance test for TelCardController.", () => {
    describe("取得電話卡聯絡人列表", () => {
        let testTelCardContacters: any

        it("取得電話卡聯絡人列表", async () => {
            // given
            // when
            const res = await App.get("/api/telCards/contacter")
            // then
            expect(res.status).toBe(200)
        })

        it("取得電話卡聯絡人列表，並且有分頁", async () => {
            // given
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
            testTelCardContacters = data
        })

        it("取得單筆", async () => {
            // given
            const id = testTelCardContacters?.items[0]?.id
            // when
            const response = await App.get(`/api/telCards/contacter/${id}`)
            // then
            const data = response.body?.data
            expect(response.status).toBe(200)
            expect(data?.id).toEqual(id)
        })

        it("若取得單筆不存在，回應 404 「查無資料」", async () => {
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
            const payload = {
                name: "E2eTest",
            }
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
            const payload = {
                name: "E2eTest",
            }
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
                name: "E2eEdited",
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
                name: "E2eEdited",
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

        afterAll(async () => {
            await Db.tel_card_contacter.destroy({
                where: {
                    id: testTelCardContacter?.id,
                },
            })
        })
    })

    describe("取得住宿生電話卡紀錄，能夠建立及刪除", () => {
        let testProject: any
        let testBoarder: any
        let testTelCardContacter: any
        let testTelCardLogs: any = []
        let testTelCardLog: any

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
            testTelCardContacter = await Db.tel_card_contacter.create({
                name: "E2eTest",
            })
            await Db.tel_card_log.create({
                boarder_id: testBoarder.id,
                project_id: testProject.id,
                tel_card_contacter_id: testTelCardContacter.id,
                contacted_at: new Date("2022-01-01T00:00:00.000Z"),
                remark: "E2eTest123",
                created_by: mockUser.id,
            })
            await Db.tel_card_log.create({
                boarder_id: testBoarder.id,
                project_id: testProject.id,
                tel_card_contacter_id: testTelCardContacter.id,
                contacted_at: new Date("2022-01-01T00:00:00.000Z"),
                remark: "E2eTest123",
                created_by: mockUser.id,
            })
        })

        it("取得住宿生電話卡紀錄，並且有分頁", async () => {
            // given
            const payload = {
                project_id: testProject.id,
                offset: 1,
                limit: 1,
            }
            // when
            const res = await App.get("/api/telCards/log").query(payload)
            // then
            testTelCardLogs = res.body?.data?.items
            expect(res.status).toBe(200)
            expect(res.body?.data?.items?.length).toBeLessThanOrEqual(1)
        })

        it("取得單筆", async () => {
            // given
            const id = testTelCardLogs[0]?.id
            // when
            const response = await App.get(`/api/telCards/log/${id}`)
            // then
            const data = response.body?.data
            expect(response.status).toBe(200)
            expect(data?.id).toEqual(id)
        })

        it("建立住宿生電話卡紀錄", async () => {
            // given
            const payload = {
                project_id: testProject.id,
                boarder_id: testBoarder.id,
                tel_card_contacter_id: testTelCardContacter.id,
                contacted_at: new Date("2022-01-01T00:00:00.000Z"),
                remark: "E2eTest123",
            }
            // when
            const res = await App.post("/api/telCards/log").send(payload)
            // then
            testTelCardLog = res.body?.data
            expect(res.status).toBe(201)
            expect(testTelCardLog?.project_id).toBe(payload.project_id)
            expect(testTelCardLog?.boarder_id).toBe(payload.boarder_id)
            expect(testTelCardLog?.tel_card_contacter_id).toBe(payload.tel_card_contacter_id)
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

        afterAll(async () => {
            await Db.tel_card_log.destroy({
                where: {
                    project_id: testProject.id,
                },
            })
            await Db.tel_card_contacter.destroy({
                where: {
                    id: testTelCardContacter.id,
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
