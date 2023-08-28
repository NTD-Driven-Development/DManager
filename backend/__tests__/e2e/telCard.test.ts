import Sequelize, { Op } from "sequelize"
import { App } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"


describe("Acceptance test for TelCardController.", () => {

    describe("取得電話卡聯絡人列表", () => {
        it("取得電話卡聯絡人列表", async () => {
            const res = await App.get("/api/telCards/contacter")
            expect(res.status).toBe(200)
        })

        it("取得電話卡聯絡人列表，並且有分頁", async () => {
            const payload = {
                offset: 1,
                limit: 1,
            }
            const res = await App.get("/api/telCards/contacter").query(payload)
            const data = res.body?.data
            expect(res.status).toBe(200)
            expect(data?.items.length).toBeLessThanOrEqual(payload.limit)
        })
    })

    describe("建立電話卡聯絡人，並能夠編輯和刪除", () => {
        let testTelCardContacter: any

        it("建立電話卡聯絡人", async () => {
            const payload = {
                name: "E2eTest",
            }

            const res = await App.post("/api/telCards/contacter").send(payload)
            testTelCardContacter = res.body?.data

            expect(res.status).toBe(201)
            expect(testTelCardContacter?.name).toBe(payload.name)
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
            const payload = {
                id: testTelCardContacter?.id,
                name: "E2eTest(Edited)",
            }

            const res = await App.put("/api/telCards/contacter").send(payload)

            expect(res.status).toBe(200)
        })

        it("確認電話卡聯絡人是否編輯成功", async () => {
            const res = await App.get("/api/telCards/contacter")
            const data = res.body?.data?.items
            const target = _.find(data, { id: testTelCardContacter?.id })
            expect(target?.name).toBe("E2eTest(Edited)")
        })

        it("刪除電話卡聯絡人", async () => {
            const id = testTelCardContacter?.id

            const res = await App.delete(`/api/telCards/contacter/${id}`)

            expect(res.status).toBe(200)
        })

        it("確認電話卡聯絡人是否刪除成功", async () => {
            const id = testTelCardContacter?.id

            const res = await App.get("/api/telCards/contacter")
            const data = res.body?.data?.items
            const target = _.find(data, { id: id })

            expect(res.status).toBe(200)
            expect(target).toBeUndefined()
        })

        afterAll(async () => {
            await Db.tel_card_contacter.destroy({
                where: {
                    id: testTelCardContacter?.id,
                },
            })
        })
    })



})