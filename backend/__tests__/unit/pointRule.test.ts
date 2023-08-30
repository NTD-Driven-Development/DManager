import PointRuleService from "../../src/core/services/PointRuleService"
import PointRuleDao from "../../src/core/daos/PointRuleDao"
import Sequelize, { UniqueConstraintError } from "sequelize"
import PointLogDao from "../../src/core/daos/PointLogDao"

describe("Unit test for PointRuleService.", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
    const fakeUser = {
        id: 1,
    } as any
    const fakePointRule = {
        id: 1,
        code: "E2eTest",
        reason: "E2eTest",
        point: 1,
        is_actived: true,
    }
    const fakePointLog = {
        id: 1,
        boarder_id: "1",
        point_rule_id: 1,
        project_id: 1,
    }

    async function whenGetPointRulesWithPaginatationSucceeded(payload: any) {
        jest.spyOn(PointRuleDao, "findAll").mockResolvedValue([
            fakePointRule,
            fakePointRule,
            fakePointRule,
            fakePointRule,
        ])
        const result = await PointRuleService.getPointRules(payload)
        return result
    }

    async function whenGetPointRulesSucceeded() {
        jest.spyOn(PointRuleDao, "findAll").mockResolvedValue([fakePointRule])
        const result = await PointRuleService.getPointRules()
        return result
    }

    async function whenCreatePointRuleRepeated(payload: any) {
        jest.spyOn(PointRuleDao, "findAllByCode").mockResolvedValue([
            fakePointRule,
        ])
        jest.spyOn(PointRuleDao, "create").mockResolvedValue(true as any)
        const result = await PointRuleService.createPointRule(payload, fakeUser)
        return result
    }
    async function whenCreatePointRuleSucceeded(payload: any) {
        jest.spyOn(PointRuleDao, "findAllByCode").mockResolvedValue([] as any)
        jest.spyOn(PointRuleDao, "create").mockResolvedValue(true as any)
        const result = await PointRuleService.createPointRule(payload, fakeUser)
        return result
    }

    async function whenUpdatePointRuleNotFound(payload: any) {
        jest.spyOn(PointRuleDao, "findAllByCode").mockResolvedValue([] as any)
        jest.spyOn(PointRuleDao, "update").mockResolvedValue({
            affectedRows: 0,
        } as any)
        const result = await PointRuleService.updatePointRule(payload, fakeUser)
        return result
    }
    async function whenUpdatePointRuleRepeat(payload: any) {
        jest.spyOn(PointRuleDao, "findAllByCode").mockResolvedValue([
            fakePointRule,
        ] as any)
        jest.spyOn(PointRuleDao, "update").mockResolvedValue({
            affectedRows: 0,
        } as any)
        const result = await PointRuleService.updatePointRule(payload, fakeUser)
        return result
    }
    async function whenUpdatePointRuleSucceeded(payload: any) {
        jest.spyOn(PointRuleDao, "update").mockResolvedValue({
            affectedRows: 1,
        } as any)
        const result = await PointRuleService.updatePointRule(payload, fakeUser)
        return result
    }
    async function whenDeletePointRuleNotFound(id: number) {
        jest.spyOn(PointRuleDao, "delete").mockResolvedValue({
            affectedRows: 0,
        } as any)
        const result = await PointRuleService.deletePointRule(id, fakeUser)
        return result
    }
    async function whenDeletePointRuleSucceeded(id: number) {
        jest.spyOn(PointRuleDao, "delete").mockResolvedValue({
            affectedRows: 1,
        } as any)
        const result = await PointRuleService.deletePointRule(id, fakeUser)
        return result
    }

    async function whenGetPointLogsWithPaginatationSucceeded(payload: {
        project_id?: number
        offset: number
        limit: number
    }) {
        jest.spyOn(PointLogDao, "findAll").mockResolvedValue([
            fakePointLog,
            fakePointLog,
            fakePointLog,
            fakePointLog,
        ])
        const result = await PointRuleService.getPointLogs(payload)
        return result
    }
    async function whenGetPointLogsWithFilterProject(payload: {
        project_id?: number
        offset: number
        limit: number
    }) {
        jest.spyOn(PointLogDao, "findAll").mockResolvedValue([
            {
                id: 1,
                project_id: 1,
                boarder_id: "1",
                point_rule_id: 1,
            },
            {
                id: 2,
                project_id: 2,
                boarder_id: "2",
                point_rule_id: 1,
            },
            {
                id: 3,
                project_id: 2,
                boarder_id: "3",
                point_rule_id: 1,
            },
            {
                id: 4,
                project_id: 3,
                boarder_id: "4",
                point_rule_id: 2,
            },
        ])
        const result = await PointRuleService.getPointLogs(payload)
        return result
    }

    async function whenDeletePointLogSucceeded(id: number, fakeUser: any) {
        jest.spyOn(PointLogDao, "delete").mockResolvedValue({
            affectedRows: 1,
        })
        const result = await PointRuleService.deletePointLog(id, fakeUser)
        return result
    }
    async function whenDeletePointLogNotFound(id: number, fakeUser: any) {
        jest.spyOn(PointLogDao, "delete").mockResolvedValue({
            affectedRows: 0,
        })
        const result = await PointRuleService.deletePointLog(id, fakeUser)
        return result
    }

    describe("取得加扣點規則列表", () => {
        it("確實呼叫 DAO", async () => {
            // given
            // when
            const result = await whenGetPointRulesSucceeded()
            // then
            expect(result).toEqual({
                total: 1,
                from: 1,
                to: 1,
                current_page: 1,
                last_page: 1,
                per_page: 20,
                items: [fakePointRule],
            })
        })

        it("分頁邏輯", async () => {
            // given
            const payload = {
                offset: 1,
                limit: 2,
            }

            // when
            const result = await whenGetPointRulesWithPaginatationSucceeded(
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
                items: [fakePointRule, fakePointRule],
            })
            expect(PointRuleDao.findAll).toBeCalledTimes(1)
        })
    })

    describe("建立加扣點規則", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const payload = {
                code: "E2eTest",
                reason: "E2eTest",
                point: 1,
            }

            // when
            const result = await whenCreatePointRuleSucceeded(payload)

            // then
            expect(result).toEqual(true)
            expect(PointRuleDao.create).toBeCalledTimes(1)
        })

        it("重複建立應擲出例外「代碼重複」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "代碼重複"
            const payload = {
                code: "E2eTest",
                reason: "E2eTest",
                point: 1,
            }

            // when
            const result = whenCreatePointRuleRepeated(payload)
            // then
            expect(result).rejects.toThrow(errorMessage)
        })
    })

    describe("修改加扣點規則", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const payload = {
                id: 1,
                code: "E2eTest(Edited)",
                reason: "E2eTest(Edited)",
                point: 3,
            }

            // when
            const result = await whenUpdatePointRuleSucceeded(payload)

            // then
            expect(result).toEqual(true)
            expect(PointRuleDao.update).toBeCalledTimes(1)
        })

        it("若更新資料無異動則應擲出例外「查無資料」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "查無資料"
            const payload = {
                id: 1,
                code: "E2eTest(Edited)",
                reason: "E2eTest(Edited)",
                point: 3,
            }

            // when
            const result = whenUpdatePointRuleNotFound(payload)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })

        it("若更新資料代碼已存在則擲出例外「代碼重複」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "代碼重複"
            const payload = {
                id: 3,
                code: "E2eTest",
                reason: "E2eTest(Edited)",
                point: 3,
            }

            // when
            const result = whenUpdatePointRuleRepeat(payload)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })

    describe("刪除加扣點規則", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const id = 1

            // when
            const result = await whenDeletePointRuleSucceeded(id)

            // then
            expect(result).toEqual(true)
            expect(PointRuleDao.delete).toBeCalledTimes(1)
        })

        it("若刪除資料無異動則應擲出例外「查無資料」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "查無資料"
            const id = 1

            // when
            const result = whenDeletePointRuleNotFound(id)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })

    describe("取得加扣點紀錄列表", () => {
        it("呼叫 DAO 與分頁邏輯", async () => {
            // given
            const payload = {
                offset: 1,
                limit: 2,
            }

            // when
            const result = await whenGetPointLogsWithPaginatationSucceeded(
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
                items: [fakePointLog, fakePointLog],
            })
            expect(PointLogDao.findAll).toBeCalledTimes(1)
        })

        it("項目篩選", async () => {
            // given
            const payload = {
                project_id: 2,
                offset: 1,
                limit: 2,
            }

            // when
            const result = await whenGetPointLogsWithFilterProject(payload)

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
                        point_rule_id: 1,
                    },
                    {
                        id: 3,
                        project_id: 2,
                        boarder_id: "3",
                        point_rule_id: 1,
                    },
                ],
            })
            expect(PointLogDao.findAll).toBeCalledTimes(1)
        })
    })

    describe("建立住宿生加扣點紀錄", () => {
        it("呼叫 DAO", async () => {
            // given
            const payload = {
                boarder_id: "1",
                point_rule_id: 1,
                project_id: 1,
            }
            // when
            jest.spyOn(PointLogDao, "create").mockResolvedValue(true as any)
            const result = await PointRuleService.createPointLog(
                payload,
                fakeUser
            )
            // then
            expect(result).toEqual(true)
            expect(PointLogDao.create).toBeCalledTimes(1)
        })
    })

    describe("刪除住宿生加扣點紀錄", () => {
        it("呼叫 DAO", async () => {
            // given
            const id = 1

            // when
            const result = await whenDeletePointLogSucceeded(id, fakeUser)

            // then
            expect(result).toEqual(true)
            expect(PointLogDao.delete).toBeCalledTimes(1)
        })

        it("若刪除資料無異動則應擲出例外「查無資料」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "查無資料"
            const id = 1

            // when
            const result = whenDeletePointLogNotFound(id, fakeUser)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })

    describe("取得單筆加扣點規則", () => {
        it("呼叫 DAO", async () => {
            // given
            const id = 1

            // when
            jest.spyOn(PointRuleDao, "findOneById").mockResolvedValue(fakePointRule)
            const result = await PointRuleService.getPointRuleById(id)

            // then
            expect(result).toEqual(fakePointRule)
            expect(PointRuleDao.findOneById).toBeCalledTimes(1)
        })

        it("若查無資料則應擲出例外「查無資料」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "查無資料"
            const id = 1

            // when
            jest.spyOn(PointRuleDao, "findOneById").mockResolvedValue(null as any)
            const result = PointRuleService.getPointRuleById(id)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })
})


