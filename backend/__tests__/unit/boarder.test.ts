import BoarderService from "../../src/core/services/BoarderService"
import BoarderDao from "../../src/core/daos/BoarderDao"
import Sequelize from "sequelize"
import ProjectDao from "../../src/core/daos/ProjectDao"

describe("Unit test for BoarderService.", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
    const fakeBoarder = {
        id: "1",
        project_id: 1,
        sid: "1111134023",
        name: "周東澤",
        class_id: 66,
        class: {
            id: 66,
            name: "資工研二",
        },
        boarder_status_id: 1,
        boarder_status: {
            id: 1,
            name: "住宿生",
        },
        boarder_roles: [
            {
                id: 1,
                name: "1E區隊長",
            },
        ],
        project_bunk: {
            id: 1,
            project_id: 1,
            boarder_id: "1",
            floor: "1",
            room_type: "1",
            room_no: "1",
            bed: "1",
        },
    }

    function givenGetBoardersFromProjectPayload() {
        return {
            project_id: 1,
        }
    }
    function expectGetBoardersFromProjectData() {
        return {
            total: 1,
            from: 1,
            to: 1,
            current_page: 1,
            last_page: 1,
            per_page: 20,
            items: [fakeBoarder],
        }
    }
    function expectGivenOffset1Limit2ThenGetItemsCountShouldBeEqual2(
        offset: number,
        limit: number
    ) {
        return {
            total: 4,
            from: 1,
            to: 2,
            current_page: offset,
            last_page: 2,
            per_page: limit,
            items: [fakeBoarder, fakeBoarder],
        }
    }
    function expectGetBoardersFromProjectWithSortedBunk(fakeBoarder: {
        id: string
        project_id: number
        sid: string
        name: string
        class_id: number
        class: { id: number; name: string }
        boarder_status_id: number
        boarder_status: { id: number; name: string }
        boarder_roles: { id: number; name: string }[]
        project_bunk: {
            id: number
            project_id: number
            boarder_id: string
            floor: string
            room_type: string
            room_no: string
            bed: string
        }
    }) {
        const fakeBoarder1 = fakeBoarder
        const fakeBoarder2 = {
            ...fakeBoarder,
            project_bunk: {
                ...fakeBoarder.project_bunk,
                room_no: "2",
            },
        }
        const fakeBoarder3 = {
            ...fakeBoarder,
            project_bunk: {
                ...fakeBoarder.project_bunk,
                room_type: "B",
            },
        }
        const fakeBoarder4 = {
            ...fakeBoarder,
            project_bunk: {
                ...fakeBoarder.project_bunk,
                floor: "2",
            },
        }

        const expectResult = {
            total: 4,
            from: 1,
            to: 4,
            current_page: 1,
            last_page: 1,
            per_page: 20,
            items: [fakeBoarder1, fakeBoarder2, fakeBoarder3, fakeBoarder4],
        }
        return expectResult
    }
    async function whenGetBoardersFromProject(project_id: number | string) {
        const rawData = [fakeBoarder]
        jest.spyOn(BoarderDao, "findAll").mockResolvedValue(rawData as any)
        return await BoarderService.getBoardersFromProject(project_id)
    }
    async function whenGetBoardersFromProjectWithPagination(
        project_id: number | string,
        query: {
            offset: number
            limit: number
        }
    ) {
        const rawData = [fakeBoarder, fakeBoarder, fakeBoarder, fakeBoarder]
        jest.spyOn(BoarderDao, "findAll").mockResolvedValue(rawData as any)
        return await BoarderService.getBoardersFromProject(project_id, query)
    }
    async function whenGetBoardersFromProjectWithSortedBunk(
        project_id: number
    ) {
        const expect = expectGetBoardersFromProjectWithSortedBunk(fakeBoarder)
        jest.spyOn(BoarderDao, "findAll").mockResolvedValue([
            expect.items[3],
            expect.items[2],
            expect.items[0],
            expect.items[1],
        ] as any)
        const result = await BoarderService.getBoardersFromProject(project_id)
        return result
    }

    function givenUpdateBoarderPayload() {
        return {
            id: "boarder_id",
            sid: "1234567890",
            name: "testUpdate",
            phone: "0912345678",
            class_id: 1,
            birthday: "2000/01/01",
            avatar: null,
            remark: "備註",
            access_card: "ACC_123456_CARD",
            boarder_status_id: 2,
        }
    }
    async function whenUpdateBoarderSucceeded(payload: any) {
        jest.spyOn(BoarderDao, "update").mockResolvedValue({
            affectedRows: 1,
        } as any)
        return await BoarderService.updateBoarder(payload)
    }
    async function whenUpdateBoarderNotFound(payload: any) {
        jest.spyOn(BoarderDao, "update").mockResolvedValue({
            affectedRows: 0,
        } as any)
        return await BoarderService.updateBoarder(payload)
    }

    async function whenGetBoarderByIdSucceeded(boarder_id: number) {
        jest.spyOn(BoarderDao, "findOneById").mockResolvedValue(
            fakeBoarder as any
        )
        return await BoarderService.getBoarderById(boarder_id)
    }
    async function whenGetBoarderByIdNotFound(boarder_id: number) {
        jest.spyOn(BoarderDao, "findOneById").mockResolvedValue(null as any)
        const result = await BoarderService.getBoarderById(boarder_id)
        return result
    }

    async function whenDeleteBoarderSucceeded(boarder_id: string) {
        jest.spyOn(BoarderDao, "deleteById").mockResolvedValue({
            affectedRows: 1,
        } as any)
        jest.spyOn(ProjectDao, "deleteBunkByBoarderId").mockResolvedValue({
            affectedRows: 1,
        } as any)
        return await BoarderService.deleteBoarder(boarder_id)
    }

    async function whenDeleteBoarderNotFound(boarder_id: string) {
        jest.spyOn(BoarderDao, "deleteById").mockResolvedValue({
            affectedRows: 0,
        } as any)
        jest.spyOn(ProjectDao, "deleteBunkByBoarderId").mockResolvedValue({
            affectedRows: 0,
        } as any)
        return await BoarderService.deleteBoarder(boarder_id)
    }

    describe("取得某項目住宿生資訊", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const payload = givenGetBoardersFromProjectPayload()

            // when
            const result = await whenGetBoardersFromProject(payload.project_id)

            // then
            expect(result).toEqual(expectGetBoardersFromProjectData())
            expect(BoarderDao.findAll).toBeCalledTimes(1)
        })

        it("有分頁", async () => {
            // given
            const project_id = 1
            const payload = {
                offset: 1,
                limit: 2,
            }
            const expectResult =
                expectGivenOffset1Limit2ThenGetItemsCountShouldBeEqual2(
                    payload.offset,
                    payload.limit
                )

            // when
            const result = await whenGetBoardersFromProjectWithPagination(
                project_id,
                payload
            )

            // then
            expect(result).toEqual(expectResult)
            expect(BoarderDao.findAll).toBeCalledTimes(1)
        })

        it("依照樓區室床遞增排序", async () => {
            // given
            const project_id = 1
            const expectResult =
                expectGetBoardersFromProjectWithSortedBunk(fakeBoarder)

            // when
            const result = await whenGetBoardersFromProjectWithSortedBunk(
                project_id
            )

            // then
            expect(result).toEqual(expectResult)
            expect(BoarderDao.findAll).toBeCalledTimes(1)
        })
    })

    describe("編輯住宿生", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const payload = givenUpdateBoarderPayload()

            // when
            const result = await whenUpdateBoarderSucceeded(payload)

            // then
            expect(result).toEqual(true)
            expect(BoarderDao.update).toBeCalledTimes(1)
        })

        it("若更新資料無異動則應擲出例外「查無資料」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "查無資料"
            const payload = givenUpdateBoarderPayload()

            // when
            const result = whenUpdateBoarderNotFound(payload)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })

    describe("取得單筆住宿生資訊", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const boarder_id = 1
            const expectResult = fakeBoarder

            // when
            const result = await whenGetBoarderByIdSucceeded(boarder_id)

            // then
            expect(result).toEqual(expectResult)
            expect(BoarderDao.findOneById).toBeCalledTimes(1)
        })

        it("若查無資料則應擲出例外「查無資料」，設定狀態碼 400", async () => {
            // given
            const errorMessage: string = "查無資料"
            const boarder_id = 1

            // when
            const result = whenGetBoarderByIdNotFound(boarder_id)

            // then
            expect(result).rejects.toThrow(errorMessage)
            expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })

    describe("刪除住宿生資訊", () => {
        it("確實呼叫 DAO，清空床位對應", async () => {
            // given
            const boarder_id = "1"

            // when
            const result = await whenDeleteBoarderSucceeded(boarder_id)

            // then
            expect(result).toEqual(true)
            expect(BoarderDao.deleteById).toBeCalledTimes(1)
            expect(ProjectDao.deleteBunkByBoarderId).toBeCalledTimes(1)
        })

        it("若刪除資料無異動則應擲出例外「查無資料」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "查無資料"
            const boarder_id = "1"

            // when
            const result = whenDeleteBoarderNotFound(boarder_id)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })
})
