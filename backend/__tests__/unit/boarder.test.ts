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
            items: [
                {
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
                },
            ],
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

    async function whenUpdateBoarderNotFound(payload: {
        id: string
        sid: string
        name: string
        phone: string
        class_id: number
        birthday: string
        avatar: null
        remark: string
        access_card: string
        boarder_status_id: number
    }) {
        return await BoarderService.updateBoarder(payload)
    }

    async function whenUpdateBoarderSucceed(payload: {
        id: string
        sid: string
        name: string
        phone: string
        class_id: number
        birthday: string
        avatar: null
        remark: string
        access_card: string
        boarder_status_id: number
    }) {
        return await BoarderService.updateBoarder(payload)
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
    })

    describe("編輯住宿生", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const payload = givenUpdateBoarderPayload()

            // when
            const result = await whenUpdateBoarderSucceed(payload)

            // then
            expect(result).toEqual(payload)
            expect(BoarderDao.update).toBeCalledTimes(1)
            expect(BoarderDao.updateBoarderRoles).toBeCalledTimes(1)
            expect(ProjectDao.updateProjectBunk).toBeCalledTimes(1)
        })

        it("若更新資料無異動則應擲出例外「查無資料」", async () => {
            // given
            const errorMessage: string = "查無資料"
            const payload = givenUpdateBoarderPayload()

            // when
            const result = whenUpdateBoarderNotFound(payload)

            // then
            await expect(result).rejects.toThrow(errorMessage)
        })
    })
})
