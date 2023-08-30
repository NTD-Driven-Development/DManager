import Sequelize, { Op } from "sequelize"
import { App, mockUser } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"
import ClassDao from "../../src/core/daos/ClassDao"

describe("Acceptance test for ClassController.", () => {
    describe("取得班級列表", () => {
        let testClasses: any

        it("取得班級列表", async () => {
            // given
            // when
            const res = await App.get("/api/classes")
            // then
            expect(res.status).toBe(200)
        })

        it("取得班級列表，並且有分頁", async () => {
            // given
            const payload = {
                offset: 1,
                limit: 1,
            }
            // when
            const res = await App.get("/api/classes").query(payload)
            // then
            const data = res.body?.data
            expect(res.status).toBe(200)
            expect(data?.items.length).toBeLessThanOrEqual(payload.limit)
            testClasses = data
        })

        it("取得單筆", async () => {
            // given
            const id = testClasses?.items[0]?.id
            // when
            const response = await App.get(`/api/classes/${id}`)
            // then
            const data = response.body?.data
            expect(response.status).toBe(200)
            expect(data?.id).toEqual(id)
        })

        it("若取得單筆不存在，回應 404 「查無資料」", async () => {
            // given
            const id = -1
            // when
            const response = await App.get(`/api/classes/${id}`)
            // then
            expect(response.status).toBe(400)
            expect(response.body?.error).toBe("查無資料")
        })
    })

    describe("建立班級，並能夠編輯和刪除", () => {
        let testClass: any

        it("建立班級", async () => {
            // given
            const payload = {
                name: "E2eTest",
            }
            // when
            const res = await App.post("/api/classes").send(payload)
            // then
            testClass = res.body?.data
            expect(res.status).toBe(201)
            expect(testClass?.name).toBe(payload.name)
            expect(testClass?.created_by).toBe(mockUser.id)
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
            // given
            const payload = {
                id: testClass?.id,
                name: "E2eTest(Edited)",
            }
            // when
            const res = await App.put("/api/classes").send(payload)
            // then
            expect(res.status).toBe(200)
            const result = await ClassDao.findOneById(testClass?.id)
            expect(result.name).toBe(payload.name)
            expect(result.updated_by).toBe(mockUser.id)
        })

        it("若編輯班級名稱已存在，回應 400 「名稱已存在」", async () => {
            // given
            const payload = {
                id: -1,
                name: "E2eTest(Edited)",
            }
            // when
            const res = await App.put("/api/classes").send(payload)
            // then
            expect(res.status).toBe(400)
            expect(res.body?.error).toBe("名稱已存在")
        })

        it("刪除班級", async () => {
            // given
            const id = testClass?.id
            // when
            const res = await App.delete(`/api/classes/${id}`)
            // then
            expect(res.status).toBe(200)
            expect(await ClassDao.findOneById(id)).toBeNull()
            expect(
                (await Db.class.findOne({ where: { id: id } })).deleted_by
            ).toBe(mockUser.id)
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
