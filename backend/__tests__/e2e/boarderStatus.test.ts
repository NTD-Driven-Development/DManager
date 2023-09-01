import { Op } from "sequelize"
import { App, mockUser } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"
import BoarderStatusDao from "../../src/core/daos/BoarderStatusDao"

describe("Acceptance test for BoarderStatusController.", () => {
    describe("取得住宿生狀態列表", () => {
        let testBoarderStatuses: any
        it("取得住宿生狀態列表", async () => {
            // given
            // when
            const res = await App.get("/api/boarderStatuses")
            // then
            expect(res.status).toBe(200)
        })

        it("取得住宿生狀態列表，並且有分頁", async () => {
            // given
            const payload = {
                offset: 1,
                limit: 1,
            }
            // when
            const res = await App.get("/api/boarderStatuses").query(payload)
            // then
            testBoarderStatuses = res.body?.data
            expect(res.status).toBe(200)
            expect(testBoarderStatuses?.items.length).toBeLessThanOrEqual(payload.limit)
        })

        it("請求單筆住宿生狀態", async () => {
            // given
            const id = testBoarderStatuses?.items[0]?.id
            // when
            const res = await App.get(`/api/boarderStatuses/${id}`)
            // then
            expect(res.status).toBe(200)
            expect(res.body?.data?.id).toBe(id)
        })
    })

    describe("建立住宿生狀態，並能夠編輯和刪除", () => {
        let testBoarderStatus: any

        it("建立住宿生狀態", async () => {
            // given
            const payload = {
                name: "E2eTest",
            }
            // when
            const res = await App.post("/api/boarderStatuses").send(payload)
            // then
            testBoarderStatus = res.body?.data
            expect(res.status).toBe(201)
            expect(testBoarderStatus?.name).toBe(payload.name)
            expect(testBoarderStatus?.created_by).toBe(mockUser.id)
        })

        it("不可重複建立", async () => {
            // given
            const payload = {
                name: "E2eTest",
            }
            // when
            const response = await App.post("/api/boarderStatuses").send(
                payload
            )
            // then
            expect(response.status).toBe(400)
        })

        it("編輯住宿生狀態", async () => {
            // given
            const payload = {
                id: testBoarderStatus?.id,
                name: "E2eTest(Edited)",
            }
            // when
            const res = await App.put("/api/boarderStatuses").send(payload)
            // then
            expect(res.status).toBe(200)
            const result = await BoarderStatusDao.findOneById(payload.id)
            expect(result.name).toBe(payload.name)
            expect(result.updated_by).toBe(mockUser.id)
        })

        it("若編輯住宿生狀態名稱已存在，回應 400 「名稱已存在」", async () => {
            // given
            const payload = {
                id: -1,
                name: "E2eTest(Edited)",
            }
            // when
            const res = await App.put("/api/boarderStatuses").send(payload)
            // then
            expect(res.status).toBe(400)
            expect(res.body?.error).toBe("名稱已存在")
        })

        it("刪除住宿生狀態", async () => {
            // given
            const id = testBoarderStatus?.id
            // when
            const res = await App.delete(`/api/boarderStatuses/${id}`)
            // then
            expect(res.status).toBe(200)
            expect(await BoarderStatusDao.findOneById(id)).toBeNull()
            expect(
                (await Db.boarder_status.findOne({ where: { id: id } }))
                    .deleted_by
            ).toBe(mockUser.id)
        })

        afterAll(async () => {
            await Db.boarder_status.destroy({
                where: {
                    id: testBoarderStatus?.id,
                },
            })
        })
    })
})
