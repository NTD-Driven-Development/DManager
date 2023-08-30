import PointRuleService from "../../src/core/services/PointRuleService"
import PointRuleDao from "../../src/core/daos/PointRuleDao"
import Sequelize, { UniqueConstraintError } from "sequelize"

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
        jest.spyOn(PointRuleDao, "findAllByCode").mockResolvedValue([fakePointRule])
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
        jest.spyOn(PointRuleDao, "findAllByCode").mockResolvedValue([fakePointRule] as any)
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
})
