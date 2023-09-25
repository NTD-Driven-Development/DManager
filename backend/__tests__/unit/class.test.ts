import ClassService from "../../src/core/services/ClassService"
import ClassDao from "../../src/core/daos/ClassDao"
import { UniqueConstraintError } from "sequelize"

describe("Unit test for ClassService.", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
    const fakeUser = {
        id: 1,
    } as any
    const fakeClass = {
        id: 1,
        name: "E2eTest",
    }

    async function whenGetClassedWithPaginatationSucceeded(payload: any) {
        jest.spyOn(ClassDao, "findAll").mockResolvedValue([
            fakeClass,
            fakeClass,
            fakeClass,
            fakeClass,
        ])
        const result = await ClassService.getClasses(payload)
        return result
    }

    async function whenGetClassesSucceeded() {
        jest.spyOn(ClassDao, "findAll").mockResolvedValue([fakeClass])
        const result = await ClassService.getClasses()
        return result
    }

    async function whenCreateClassRepeated(payload: { name: string }) {
        jest.spyOn(ClassDao, "findAllByName").mockResolvedValue([fakeClass])
        jest.spyOn(ClassDao, "create").mockResolvedValue(true as any)
        const result = await ClassService.createClass(payload, fakeUser)
        return result
    }
    async function whenCreateClassSucceeded(payload: { name: string }) {
        jest.spyOn(ClassDao, "findAllByName").mockResolvedValue([])
        jest.spyOn(ClassDao, "create").mockResolvedValue(true as any)
        const result = await ClassService.createClass(payload, fakeUser)
        return result
    }

    async function whenUpdateClassNotFound(payload: any) {
        jest.spyOn(ClassDao, "findAllByName").mockResolvedValue([])
        jest.spyOn(ClassDao, "update").mockResolvedValue({
            affectedRows: 0,
        } as any)
        const result = await ClassService.updateClass(payload, fakeUser)
        return result
    }
    async function whenUpdateClassRepeated(payload: any) {
        jest.spyOn(ClassDao, "findAllByName").mockResolvedValue([fakeClass])
        jest.spyOn(ClassDao, "update").mockResolvedValue({
            affectedRows: 0,
        } as any)
        const result = await ClassService.updateClass(payload, fakeUser)
        return result
    }
    async function whenUpdateClassSucceeded(payload: any) {
        jest.spyOn(ClassDao, "findAllByName").mockResolvedValue([])
        jest.spyOn(ClassDao, "update").mockResolvedValue({
            affectedRows: 1,
        } as any)
        const result = await ClassService.updateClass(payload, fakeUser)
        return result
    }
    async function whenDeleteClassNotFound(id: number) {
        jest.spyOn(ClassDao, "delete").mockResolvedValue({
            affectedRows: 0,
        } as any)
        const result = await ClassService.deleteClass(id, fakeUser)
        return result
    }
    async function whenDeleteClassSucceeded(id: number) {
        jest.spyOn(ClassDao, "delete").mockResolvedValue({
            affectedRows: 1,
        } as any)
        const result = await ClassService.deleteClass(id, fakeUser)
        return result
    }

    describe("取得班級列表", () => {
        it("確實呼叫 DAO", async () => {
            // given
            // when
            const result = await whenGetClassesSucceeded()
            // then
            expect(result).toEqual({
                total: 1,
                from: 1,
                to: 1,
                current_page: 1,
                last_page: 1,
                per_page: 20,
                items: [fakeClass],
            })
        })

        it("分頁邏輯", async () => {
            // given
            const payload = {
                offset: 1,
                limit: 2,
            }

            // when
            const result = await whenGetClassedWithPaginatationSucceeded(
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
                items: [fakeClass, fakeClass],
            })
            expect(ClassDao.findAll).toBeCalledTimes(1)
        })
    })

    describe("建立班級", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const payload = {
                name: "E2eTest",
            }

            // when
            const result = await whenCreateClassSucceeded(payload)

            // then
            expect(result).toEqual(true)
            expect(ClassDao.create).toBeCalledTimes(1)
        })

        it("重複建立應擲出例外「名稱已存在」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "名稱已存在"
            const payload = {
                name: "E2eTest",
            }

            // when
            const result = whenCreateClassRepeated(payload)
            // then
            expect(result).rejects.toThrow(errorMessage)
        })
    })

    describe("修改班級", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const payload = {
                id: 1,
                name: "E2eTest(Edited)",
            }

            // when
            const result = await whenUpdateClassSucceeded(payload)

            // then
            expect(result).toEqual(true)
            expect(ClassDao.update).toBeCalledTimes(1)
        })

        it("若更新資料無異動則應擲出例外「查無資料」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "查無資料"
            const payload = {
                id: 1,
                name: "E2eTest(Edited)",
            }

            // when
            const result = whenUpdateClassNotFound(payload)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })

        it("若更新班級名稱已存在則應擲出例外「名稱已存在」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "名稱已存在"
            const payload = {
                id: 3,
                name: "E2eTest",
            }

            // when
            const result = whenUpdateClassRepeated(payload)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })

    describe("刪除班級", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const id = 1

            // when
            const result = await whenDeleteClassSucceeded(id)

            // then
            expect(result).toEqual(true)
            expect(ClassDao.delete).toBeCalledTimes(1)
        })

        it("若刪除資料無異動則應擲出例外「查無資料」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "查無資料"
            const id = 1

            // when
            const result = whenDeleteClassNotFound(id)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })

    describe("取得單筆", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const id = 1

            // when
            jest.spyOn(ClassDao, "findOneById").mockResolvedValue(fakeClass)
            const result = await ClassService.getClassById(id)

            // then
            expect(result).toEqual(fakeClass)
            expect(ClassDao.findOneById).toBeCalledTimes(1)
        })
        it("若查無資料則應擲出例外「查無資料」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "查無資料"
            const id = 1

            // when
            jest.spyOn(ClassDao, "findOneById").mockResolvedValue(null as any)
            const result = ClassService.getClassById(id)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })
})
