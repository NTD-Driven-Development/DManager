import TelCardService from "../../src/core/services/TelCardService"
import TelCardContacterDao from "../../src/core/daos/TelCardContacterDao"
import TelCardLogDao from "../../src/core/daos/TelCardLogDao"
import { UniqueConstraintError } from "sequelize"

describe("Unit test for TelCardService.", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
    const fakeUser = {
        id: 1,
    } as any
    const fakeTelCardContacter = {
        id: 1,
        name: "E2eTest",
    }
    const fakeTelCardLog = {
        id: 1,
        boarder_id: "1",
        tel_card_contacter_id: 1,
        project_id: 1,
        remark: "E2eTest123",
        contacted_at: new Date("2022-01-01T00:00:00.000Z"),
        created_by: 1,
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
        const result = await TelCardService.createTelCardContacter(
            payload,
            fakeUser
        )
        return result
    }
    async function whenCreateTelCardContacterSucceeded(payload: {
        name: string
    }) {
        jest.spyOn(TelCardContacterDao, "findAllByName").mockResolvedValue([])
        jest.spyOn(TelCardContacterDao, "create").mockResolvedValue(true as any)
        const result = await TelCardService.createTelCardContacter(
            payload,
            fakeUser
        )
        return result
    }

    async function whenUpdateTelCardContacterNotFound(payload: any) {
        jest.spyOn(TelCardContacterDao, "findAllByName").mockResolvedValue([])
        jest.spyOn(TelCardContacterDao, "update").mockResolvedValue({
            affectedRows: 0,
        } as any)
        const result = await TelCardService.updateTelCardContacter(
            payload,
            fakeUser
        )
        return result
    }
    async function whenUpdateTelCardContacterRepeated(payload: any) {
        jest.spyOn(TelCardContacterDao, "findAllByName").mockResolvedValue([
            fakeTelCardContacter,
        ])
        jest.spyOn(TelCardContacterDao, "update").mockResolvedValue({
            affectedRows: 0,
        } as any)
        const result = await TelCardService.updateTelCardContacter(
            payload,
            fakeUser
        )
        return result
    }
    async function whenUpdateTelCardContacterSucceeded(payload: any) {
        jest.spyOn(TelCardContacterDao, "findAllByName").mockResolvedValue([])
        jest.spyOn(TelCardContacterDao, "update").mockResolvedValue({
            affectedRows: 1,
        } as any)
        const result = await TelCardService.updateTelCardContacter(
            payload,
            fakeUser
        )
        return result
    }
    async function whenDeleteTelCardContacterNotFound(id: number) {
        jest.spyOn(TelCardContacterDao, "delete").mockResolvedValue({
            affectedRows: 0,
        } as any)
        const result = await TelCardService.deleteTelCardContacter(id, fakeUser)
        return result
    }
    async function whenDeleteTelCardContacterSucceeded(id: number) {
        jest.spyOn(TelCardContacterDao, "delete").mockResolvedValue({
            affectedRows: 1,
        } as any)
        const result = await TelCardService.deleteTelCardContacter(id, fakeUser)
        return result
    }

    async function whenGetTelCardLogsFilterProject(payload: {
        project_id: number
        offset: number
        limit: number
    }) {
        jest.spyOn(TelCardLogDao, "findAll").mockResolvedValue([
            {
                id: 1,
                project_id: 1,
                boarder_id: "1",
                tel_card_contacter_id: 1,
                contacted_at: new Date("2022-01-01T00:00:00.000Z"),
            },
            {
                id: 2,
                project_id: 2,
                boarder_id: "2",
                tel_card_contacter_id: 1,
                contacted_at: new Date("2022-01-01T00:00:00.000Z"),
            },
            {
                id: 3,
                project_id: 2,
                boarder_id: "3",
                tel_card_contacter_id: 1,
                contacted_at: new Date("2022-01-01T00:00:00.000Z"),
            },
            {
                id: 4,
                project_id: 3,
                boarder_id: "4",
                tel_card_contacter_id: 2,
                contacted_at: new Date("2022-01-01T00:00:00.000Z"),
            },
        ])
        const result = await TelCardService.getTelCardLogs(payload)
        return result
    }
    async function whenGetTelCardLogsWithPaginatationSucceeded(
        fakeTelCardLog: {
            id: number
            boarder_id: string
            tel_card_contacter_id: number
            project_id: number
            contacted_at: Date
            remark: string
            created_by: number
        },
        payload: { offset: number; limit: number }
    ) {
        jest.spyOn(TelCardLogDao, "findAll").mockResolvedValue([
            fakeTelCardLog,
            fakeTelCardLog,
            fakeTelCardLog,
            fakeTelCardLog,
        ])
        const result = await TelCardService.getTelCardLogs(payload)
        return result
    }

    async function whenDeleteTelCardNotFound(id: number, fakeUser: any) {
        jest.spyOn(TelCardLogDao, "delete").mockResolvedValue({
            affectedRows: 0,
        } as any)
        const result = await TelCardService.deleteTelCardLog(id, fakeUser)
        return result
    }
    async function whenDeleteTelCardLogSucceeded(id: number, fakeUser: any) {
        jest.spyOn(TelCardLogDao, "delete").mockResolvedValue({
            affectedRows: 1,
        } as any)
        const result = await TelCardService.deleteTelCardLog(id, fakeUser)
        return result
    }

    async function whenCreateTelCardLogSucceeded(
        payload: {
            boarder_id: string
            tel_card_contacter_id: number
            project_id: number
            contacted_at: Date
            remark?: string
        },
        fakeUser: any
    ) {
        jest.spyOn(TelCardLogDao, "create").mockResolvedValue(true as any)
        const result = await TelCardService.createTelCardLog(payload, fakeUser)
        return result
    }

    async function whenGetTelCardLogByIdSucceeded(id: number) {
        jest.spyOn(TelCardLogDao, "findOneById").mockResolvedValue(fakeTelCardLog)
        const result = await TelCardService.getTelCardLogById(id)
        return result
    }
    function whenGetTelCardLogByIdNotFound(id: number) {
        jest.spyOn(TelCardLogDao, "findOneById").mockResolvedValue(null as any)
        const result = TelCardService.getTelCardLogById(id)
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

        it("重複建立應擲出例外「名稱已存在」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "名稱已存在"
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

        it("若更新名稱已存在則應擲出例外「名稱已存在」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "名稱已存在"
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
            expect(TelCardContacterDao.delete).toBeCalledTimes(1)
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

    describe("取得電話卡紀錄列表", () => {
        it("呼叫 DAO 與分頁邏輯", async () => {
            // given
            const payload = {
                offset: 1,
                limit: 2,
            }

            // when
            const result = await whenGetTelCardLogsWithPaginatationSucceeded(
                fakeTelCardLog,
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
                items: [fakeTelCardLog, fakeTelCardLog],
            })
            expect(TelCardLogDao.findAll).toBeCalledTimes(1)
        })

        it("項目篩選", async () => {
            // given
            const payload = {
                project_id: 2,
                offset: 1,
                limit: 2,
            }

            // when
            const result = await whenGetTelCardLogsFilterProject(payload)

            // then
            expect(result).toEqual({
                total: 2,
                from: 1,
                to: 2,
                current_page: 1,
                last_page: 1,
                per_page: 2,
                items: [
                    {
                        id: 2,
                        project_id: 2,
                        boarder_id: "2",
                        tel_card_contacter_id: 1,
                        contacted_at: new Date("2022-01-01T00:00:00.000Z"),
                    },
                    {
                        id: 3,
                        project_id: 2,
                        boarder_id: "3",
                        tel_card_contacter_id: 1,
                        contacted_at: new Date("2022-01-01T00:00:00.000Z"),
                    },
                ],
            })
            expect(TelCardLogDao.findAll).toBeCalledTimes(1)
        })
    })

    describe("取得單筆電話卡紀錄", () => {
        it("呼叫 DAO", async () => {
            // given
            const id = 1
            // when
            const result = await whenGetTelCardLogByIdSucceeded(id)
            // then
            expect(result).toEqual(fakeTelCardLog)
            expect(TelCardLogDao.findOneById).toBeCalledTimes(1)
        })

        it("若查無資料則應擲出例外「查無資料」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "查無資料"
            const id = 1
            // when
            const result = whenGetTelCardLogByIdNotFound(id)
            // then
            await expect(result).rejects.toThrow(errorMessage)
        })
    })

    describe("建立住宿生電話卡紀錄", () => {
        it("呼叫 DAO", async () => {
            // given
            const payload = {
                boarder_id: "1",
                tel_card_contacter_id: 1,
                project_id: 1,
                contacted_at: new Date("2022-01-01T00:00:00.000Z"),
            }
            // when
            const result = await whenCreateTelCardLogSucceeded(
                payload,
                fakeUser
            )
            // then
            expect(result).toEqual(true)
            expect(TelCardLogDao.create).toBeCalledTimes(1)
        })
    })

    describe("刪除住宿生電話卡紀錄", () => {
        it("呼叫 DAO", async () => {
            // given
            const id = 1

            // when
            const result = await whenDeleteTelCardLogSucceeded(id, fakeUser)

            // then
            expect(result).toEqual(true)
            expect(TelCardLogDao.delete).toBeCalledTimes(1)
        })

        it("若刪除資料無異動則應擲出例外「查無資料」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "查無資料"
            const id = 1

            // when
            const result = whenDeleteTelCardNotFound(id, fakeUser)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })
})
