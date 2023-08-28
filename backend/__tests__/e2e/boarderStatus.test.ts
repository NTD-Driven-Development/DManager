import Sequelize, { Op } from "sequelize"
import { App } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"

describe("Acceptance test for BoarderStatusController.", () => {
    describe("取得住宿生狀態列表", () => {
        it("取得住宿生狀態列表", async () => {
            const res = await App.get("/api/boarderStatuses")
            expect(res.status).toBe(200)
        })

        it("取得住宿生狀態列表，並且有分頁", async () => {
            const payload = {
                offset: 1,
                limit: 1,
            }
            const res = await App.get("/api/boarderStatuses").query(payload)
            const data = res.body?.data
            expect(res.status).toBe(200)
            expect(data?.items.length).toBeLessThanOrEqual(payload.limit)
        })
    })

    describe("建立住宿生狀態，並能夠編輯和刪除", () => {
        let testBoarderStatus: any

        it("建立住宿生狀態", async () => {
            const payload = {
                name: "E2eTest",
            }

            const res = await App.post("/api/boarderStatuses").send(payload)
            testBoarderStatus = res.body?.data

            expect(res.status).toBe(201)
            expect(testBoarderStatus?.name).toBe(payload.name)
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
            const payload = {
                id: testBoarderStatus?.id,
                name: "E2eTest(Edited)",
            }

            const res = await App.put("/api/boarderStatuses").send(payload)

            expect(res.status).toBe(200)
        })

        it("確認住宿生狀態是否編輯成功", async () => {
            const res = await App.get("/api/boarderStatuses")
            const data = res.body?.data?.items
            const target = _.find(data, { id: testBoarderStatus?.id })
            expect(target?.name).toBe("E2eTest(Edited)")
        })

        it("刪除住宿生狀態", async () => {
            const id = testBoarderStatus?.id

            const res = await App.delete(`/api/boarderStatuses/${id}`)

            expect(res.status).toBe(200)
        })

        it("確認住宿生狀態是否刪除成功", async () => {
            const id = testBoarderStatus?.id

            const res = await App.get("/api/boarderStatuses")
            const data = res.body?.data?.items
            const target = _.find(data, { id: id })

            expect(res.status).toBe(200)
            expect(target).toBeUndefined()
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
