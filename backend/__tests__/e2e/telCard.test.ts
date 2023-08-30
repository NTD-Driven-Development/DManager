import Sequelize, { Op } from "sequelize"
import { App, mockUser } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"
import TelCardContacterDao from "../../src/core/daos/TelCardContacterDao"

describe("Acceptance test for TelCardController.", () => {
    describe("取得電話卡聯絡人列表", () => {
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
                (await Db.tel_card_contacter.findOne({ where: { id: id } })).deleted_by
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
})
