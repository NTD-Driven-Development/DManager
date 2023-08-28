import Sequelize, { Op } from "sequelize"
import { App } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"

describe("Acceptance test for ClassController.", () => {
    describe("取得班級列表", () => {
        it("取得班級列表", async () => {
            const res = await App.get("/api/classes")
            expect(res.status).toBe(200)
        })

        it("取得班級列表，並且有分頁", async () => {
            const payload = {
                offset: 1,
                limit: 1,
            }
            const res = await App.get("/api/classes").query(payload)
            const data = res.body?.data
            expect(res.status).toBe(200)
            expect(data?.items.length).toBeLessThanOrEqual(payload.limit)
        })
    })

    describe("建立班級，並能夠編輯和刪除", () => {
        let testClass: any

        it("建立班級", async () => {
            const payload = {
                name: "E2eTest",
            }

            const res = await App.post("/api/classes").send(payload)
            testClass = res.body?.data

            expect(res.status).toBe(201)
            expect(testClass?.name).toBe(payload.name)
        })

        it("不可重複建立", async () => {
            // given
            const payload = {
                name: "E2eTest",
            }

            // when
            const response = await App.post("/api/classes").send(payload)

            // then
            expect(response.status).toBe(400)
        })

        it("編輯班級", async () => {
            const payload = {
                id: testClass?.id,
                name: "E2eTest(Edited)",
            }

            const res = await App.put("/api/classes").send(payload)

            expect(res.status).toBe(200)
        })

        it("確認班級是否編輯成功", async () => {
            const res = await App.get("/api/classes")
            const data = res.body?.data?.items
            const target = _.find(data, { id: testClass?.id })
            expect(target?.name).toBe("E2eTest(Edited)")
        })

        it("刪除班級", async () => {
            const id = testClass?.id

            const res = await App.delete(`/api/classes/${id}`)

            expect(res.status).toBe(200)
        })

        it("確認班級是否刪除成功", async () => {
            const id = testClass?.id

            const res = await App.get("/api/classes")
            const data = res.body?.data?.items
            const target = _.find(data, { id: id })

            expect(res.status).toBe(200)
            expect(target).toBeUndefined()
        })

        afterAll(async () => {
            await Db.class.destroy({
                where: {
                    id: testClass?.id,
                },
            })
        })
    })
})
