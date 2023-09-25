import NoteService from "../../src/core/services/NoteService"
import BoarderNoteDao from "../../src/core/daos/BoarderNoteDao"
import { UniqueConstraintError } from "sequelize"
import _ from "lodash"

describe("Unit test for NoteService.", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
    const fakeUser = {
        id: 1,
    } as any
    const fakeBoarderNote = {
        id: 1,
        boarder_id: "unitTest",
        title: "unitTestTitle",
        description: "Description",
        boarder: {
            id: "unitTest",
            sid: "unitTest",
            project_id: 1,
            boarder_status_id: 1,
            name: "unitTestBoarderName",
            project: {
                id: 1,
            } as any,
            class: {
                id: 1,
                name: "unitTestClass",
            } as any,
            project_bunk: {
                floor: "1",
                room_type: "2",
                room_no: "3",
                bed: "4",
            } as any,
        } as any,
        creator: {
            id: 1,
            name: "unitTest",
        } as any,
        created_at: new Date(),
        updater: {
            id: 1,
            name: "unitTest",
        } as any,
        updated_at: new Date(),
    }

    async function whenGetBoarderNoteedWithPaginatationSucceeded(
        data: any,
        payload: any
    ) {
        jest.spyOn(BoarderNoteDao, "findAll").mockResolvedValue(data)
        const result = await NoteService.getBoarderNotes(payload)
        return result
    }

    async function whenGetBoarderNotesSucceeded() {
        jest.spyOn(BoarderNoteDao, "findAll").mockResolvedValue([
            fakeBoarderNote,
        ])
        const result = await NoteService.getBoarderNotes()
        return result
    }

    async function whenCreateBoarderNoteSucceeded(payload: {
        boarder_id: string
        title: string
        description: string
    }) {
        jest.spyOn(BoarderNoteDao, "create").mockResolvedValue(true as any)
        const result = await NoteService.createBoarderNote(payload, fakeUser)
        return result
    }

    async function whenUpdateBoarderNoteNotFound(payload: any) {
        jest.spyOn(BoarderNoteDao, "update").mockResolvedValue({
            affectedRows: 0,
        } as any)
        const result = await NoteService.updateBoarderNote(payload, fakeUser)
        return result
    }
    async function whenUpdateBoarderNoteSucceeded(payload: any) {
        jest.spyOn(BoarderNoteDao, "update").mockResolvedValue({
            affectedRows: 1,
        } as any)
        const result = await NoteService.updateBoarderNote(payload, fakeUser)
        return result
    }
    async function whenDeleteBoarderNoteNotFound(id: number) {
        jest.spyOn(BoarderNoteDao, "delete").mockResolvedValue({
            affectedRows: 0,
        } as any)
        const result = await NoteService.deleteBoarderNote(id, fakeUser)
        return result
    }
    async function whenDeleteBoarderNoteSucceeded(id: number) {
        jest.spyOn(BoarderNoteDao, "delete").mockResolvedValue({
            affectedRows: 1,
        } as any)
        const result = await NoteService.deleteBoarderNote(id, fakeUser)
        return result
    }

    describe("取得住宿生記事列表", () => {
        it("確實呼叫 DAO", async () => {
            // given
            // when
            const result = await whenGetBoarderNotesSucceeded()
            // then
            expect(result).toEqual({
                total: 1,
                from: 1,
                to: 1,
                current_page: 1,
                last_page: 1,
                per_page: 20,
                items: [fakeBoarderNote],
            })
        })

        it("分頁邏輯", async () => {
            // given
            const payload = {
                offset: 1,
                limit: 2,
            }
            const daoData = [
                fakeBoarderNote,
                fakeBoarderNote,
                fakeBoarderNote,
                fakeBoarderNote,
            ]
            // when
            const result = await whenGetBoarderNoteedWithPaginatationSucceeded(
                daoData,
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
                items: [fakeBoarderNote, fakeBoarderNote],
            })
            expect(BoarderNoteDao.findAll).toBeCalledTimes(1)
        })

        it("住宿生記事項目篩選", async () => {
            // given
            const payload = {
                offset: 1,
                limit: 20,
                project_id: 1,
            }
            const daoData = [
                fakeBoarderNote,
                fakeBoarderNote,
                fakeBoarderNote,
                fakeBoarderNote,
            ]
            // when
            const result = await whenGetBoarderNoteedWithPaginatationSucceeded(
                daoData,
                payload
            )
            // then
            const data = result.items
            expect(data?.length).toBe(daoData.length)
            _.forEach(data, (item) => {
                expect(item?.boarder?.project?.id).toBe(payload.project_id)
            })

            // given
            const payload2 = {
                offset: 1,
                limit: 20,
                project_id: -1,
            }
            const daoData2 = [
                fakeBoarderNote,
                fakeBoarderNote,
                fakeBoarderNote,
                fakeBoarderNote,
            ]
            // when
            const result2 = await whenGetBoarderNoteedWithPaginatationSucceeded(
                daoData2,
                payload2
            )
            // then
            const data2 = result2.items
            expect(data2?.length).toBe(0)
        })

        it("住宿生記事模糊查詢(住宿生姓名、樓區室床、標題、描述)", async () => {
            // given
            const payload = {
                offset: 1,
                limit: 20,
                project_id: 1,
                search: "unitTest",
            }
            const daoData = [
                fakeBoarderNote,
                fakeBoarderNote,
                fakeBoarderNote,
                fakeBoarderNote,
            ]
            // when
            const result1 = await whenGetBoarderNoteedWithPaginatationSucceeded(
                daoData,
                payload
            )
            // then
            expect(result1.items.length).toBe(4)

            // given
            const payload2 = {
                offset: 1,
                limit: 20,
                project_id: 1,
                search: "unitTestTitle",
            }
            const daoData2 = _.map(daoData, (item, index) => {
                if (index === 0) {
                    return {
                        ...item,
                        title: "1234",
                    }
                }
                return item
            })
            // when
            const result2 = await whenGetBoarderNoteedWithPaginatationSucceeded(
                daoData2,
                payload2
            )
            // then
            expect(result2.items.length).toBe(3)

            // given
            const payload3 = {
                offset: 1,
                limit: 20,
                project_id: 1,
                search: "-1234",
            }
            // when
            const result3 = await whenGetBoarderNoteedWithPaginatationSucceeded(
                daoData,
                payload3
            )
            // then
            expect(result3.items.length).toBe(0)

            // given
            const payload4 = {
                offset: 1,
                limit: 20,
                project_id: 1,
                search: "1235",
            }
            const daoData4 = _.map(daoData, (item, index) => {
                if (index === 0) {
                    return {
                        ...item,
                        title: "1235",
                    }
                }
                return item
            })
            // when
            const result4 = await whenGetBoarderNoteedWithPaginatationSucceeded(
                daoData4,
                payload4
            )
            // then
            expect(result4.items.length).toBe(1)
        })
    })

    describe("建立住宿生記事", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const payload = {
                boarder_id: "UnitTest",
                title: "UnitTest",
                description: "UnitTest",
            }
            // when
            const result = await whenCreateBoarderNoteSucceeded(payload)
            // then
            expect(result).toEqual(true)
            expect(BoarderNoteDao.create).toBeCalledTimes(1)
        })
    })

    describe("修改住宿生記事", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const payload = {
                id: 1,
                title: "UnitTest(Edited)",
                description: "UnitTest(Edited)",
            }
            // when
            const result = await whenUpdateBoarderNoteSucceeded(payload)
            // then
            expect(result).toEqual(true)
            expect(BoarderNoteDao.update).toBeCalledTimes(1)
        })

        it("若更新資料無異動則應擲出例外「查無資料」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "查無資料"
            const payload = {
                id: 1,
                title: "UnitTest(Edited)",
                description: "UnitTest(Edited)",
            }
            // when
            const result = whenUpdateBoarderNoteNotFound(payload)
            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })

    describe("刪除住宿生記事", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const id = 1
            // when
            const result = await whenDeleteBoarderNoteSucceeded(id)
            // then
            expect(result).toEqual(true)
            expect(BoarderNoteDao.delete).toBeCalledTimes(1)
        })

        it("若刪除資料無異動則應擲出例外「查無資料」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "查無資料"
            const id = 1
            // when
            const result = whenDeleteBoarderNoteNotFound(id)
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
            jest.spyOn(BoarderNoteDao, "findOneById").mockResolvedValue(
                fakeBoarderNote
            )
            const result = await NoteService.getBoarderNoteById(id)
            // then
            expect(result).toEqual(fakeBoarderNote)
            expect(BoarderNoteDao.findOneById).toBeCalledTimes(1)
        })
        it("若查無資料則應擲出例外「查無資料」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "查無資料"
            const id = 1
            // when
            jest.spyOn(BoarderNoteDao, "findOneById").mockResolvedValue(
                null as any
            )
            const result = NoteService.getBoarderNoteById(id)
            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })
})
