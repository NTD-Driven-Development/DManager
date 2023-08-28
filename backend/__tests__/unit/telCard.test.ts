import TelCardService from "../../src/core/services/TelCardService"
import TelCardContacterDao from "../../src/core/daos/TelCardContacterDao"
import Sequelize, { UniqueConstraintError } from "sequelize"

describe("Unit test for TelCardService.", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
    const fakeTelCardContacter = {
        id: 1,
        name: "E2eTest",
    }

    async function whenGetTelCardContacteredWithPaginatationSucceeded(
        payload: any
    ) {
        jest.spyOn(TelCardContacterDao, "findAll").mockResolvedValue([
            fakeTelCardContacter,
            fakeTelCardContacter,
            fakeTelCardContacter,
            fakeTelCardContacter,
        ])
        const result = await TelCardService.getTelCardContacters(payload)
        return result
    }

    async function whenGetTelCardContacteresSucceeded() {
        jest.spyOn(TelCardContacterDao, "findAll").mockResolvedValue([
            fakeTelCardContacter,
        ])
        const result = await TelCardService.getTelCardContacters()
        return result
    }

    async function whenCreateTelCardContacterRepeated(payload: {
        name: string
    }) {
        jest.spyOn(TelCardContacterDao, "findAllByName").mockResolvedValue([
            fakeTelCardContacter,
        ])
        jest.spyOn(TelCardContacterDao, "create").mockResolvedValue(true as any)
        const result = await TelCardService.createTelCardContacter(payload)
        return result
    }
    async function whenCreateTelCardContacterSucceeded(payload: {
        name: string
    }) {
        jest.spyOn(TelCardContacterDao, "findAllByName").mockResolvedValue([])
        jest.spyOn(TelCardContacterDao, "create").mockResolvedValue(true as any)
        const result = await TelCardService.createTelCardContacter(payload)
        return result
    }

    async function whenUpdateTelCardContacterNotFound(payload: any) {
        jest.spyOn(TelCardContacterDao, "findAllByName").mockResolvedValue([])
        jest.spyOn(TelCardContacterDao, "update").mockResolvedValue({
            affectedRows: 0,
        } as any)
        const result = await TelCardService.updateTelCardContacter(payload)
        return result
    }
    async function whenUpdateTelCardContacterRepeated(payload: any) {
        jest.spyOn(TelCardContacterDao, "findAllByName").mockResolvedValue([fakeTelCardContacter])
        jest.spyOn(TelCardContacterDao, "update").mockResolvedValue({
            affectedRows: 0,
        } as any)
        const result = await TelCardService.updateTelCardContacter(payload)
        return result
    }
    async function whenUpdateTelCardContacterSucceeded(payload: any) {
        jest.spyOn(TelCardContacterDao, "findAllByName").mockResolvedValue([])
        jest.spyOn(TelCardContacterDao, "update").mockResolvedValue({
            affectedRows: 1,
        } as any)
        const result = await TelCardService.updateTelCardContacter(payload)
        return result
    }
    async function whenDeleteTelCardContacterNotFound(id: number) {
        jest.spyOn(TelCardContacterDao, "deleteById").mockResolvedValue({
            affectedRows: 0,
        } as any)
        const result = await TelCardService.deleteTelCardContacter(id)
        return result
    }
    async function whenDeleteTelCardContacterSucceeded(id: number) {
        jest.spyOn(TelCardContacterDao, "deleteById").mockResolvedValue({
            affectedRows: 1,
        } as any)
        const result = await TelCardService.deleteTelCardContacter(id)
        return result
    }

    describe("取得電話卡聯絡人列表", () => {
        it("確實呼叫 DAO", async () => {
            // given
            // when
            const result = await whenGetTelCardContacteresSucceeded()
            // then
            expect(result).toEqual({
                total: 1,
                from: 1,
                to: 1,
                current_page: 1,
                last_page: 1,
                per_page: 20,
                items: [fakeTelCardContacter],
            })
        })

        it("分頁邏輯", async () => {
            // given
            const payload = {
                offset: 1,
                limit: 2,
            }

            // when
            const result =
                await whenGetTelCardContacteredWithPaginatationSucceeded(
                    payload
                )

            // then
            expect(result).toEqual({
                total: 4,
                from: 1,
                to: 2,
                current_page: 1,
                last_page: 2,
                per_page: 2,
                items: [fakeTelCardContacter, fakeTelCardContacter],
            })
            expect(TelCardContacterDao.findAll).toBeCalledTimes(1)
        })
    })

    describe("建立電話卡聯絡人", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const payload = {
                name: "E2eTest",
            }

            // when
            const result = await whenCreateTelCardContacterSucceeded(payload)

            // then
            expect(result).toEqual(true)
            expect(TelCardContacterDao.create).toBeCalledTimes(1)
        })

        it("重複建立應擲出例外「名稱重複」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "名稱重複"
            const payload = {
                name: "E2eTest",
            }

            // when
            const result = whenCreateTelCardContacterRepeated(payload)
            // then
            expect(result).rejects.toThrow(errorMessage)
        })
    })

    describe("修改電話卡聯絡人", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const payload = {
                id: 1,
                name: "E2eTest(Edited)",
            }

            // when
            const result = await whenUpdateTelCardContacterSucceeded(payload)

            // then
            expect(result).toEqual(true)
            expect(TelCardContacterDao.update).toBeCalledTimes(1)
        })

        it("若更新資料無異動則應擲出例外「查無資料」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "查無資料"
            const payload = {
                id: 1,
                name: "E2eTest(Edited)",
            }

            // when
            const result = whenUpdateTelCardContacterNotFound(payload)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })

        it("若更新名稱已存在則應擲出例外「名稱重複」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "名稱重複"
            const payload = {
                id: 3,
                name: "E2eTest",
            }

            // when
            const result = whenUpdateTelCardContacterRepeated(payload)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })

    describe("刪除電話卡聯絡人", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const id = 1

            // when
            const result = await whenDeleteTelCardContacterSucceeded(id)

            // then
            expect(result).toEqual(true)
            expect(TelCardContacterDao.deleteById).toBeCalledTimes(1)
        })

        it("若刪除資料無異動則應擲出例外「查無資料」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "查無資料"
            const id = 1

            // when
            const result = whenDeleteTelCardContacterNotFound(id)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })
})
