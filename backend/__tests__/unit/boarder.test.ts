import BoarderService from "../../src/core/services/BoarderService"
import BoarderDao from "../../src/core/daos/BoarderDao"
import Sequelize, { UniqueConstraintError } from "sequelize"
import ProjectDao from "../../src/core/daos/ProjectDao"
import BoarderRoleDao from "../../src/core/daos/BoarderRoleDao"
import BoarderStatusDao from "../../src/core/daos/BoarderStatusDao"
import BoarderMappingRoleDao from "../../src/core/daos/BoarderMappingRoleDao"
import * as uuid from "uuid"
jest.mock("uuid")

describe("Unit test for BoarderService.", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
    const fakeUser = {
        id: 1,
    } as any
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
    const fakeBoarderRole = {
        project_id: 1,
        id: 1,
        name: "1E區隊長",
    }
    const fakeBoarderStatus = {
        id: 1,
        name: "E2eTest",
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
    function expectGivenOffset1Limit2ThenGetBoardersCountShouldBeEqual2(
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
        class: any
        boarder_status_id: number
        boarder_status: any
        boarder_roles: any[]
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
            boarder_role_ids: [1, 2],
        }
    }
    async function whenUpdateBoarderSucceeded(payload: any) {
        jest.spyOn(BoarderDao, "update").mockResolvedValue({
            affectedRows: 1,
        } as any)
        jest.spyOn(
            BoarderMappingRoleDao,
            "destroyByBoarderId"
        ).mockResolvedValue({
            affectedRows: 1,
        })
        jest.spyOn(BoarderMappingRoleDao, "bulkCreate").mockResolvedValue(
            true as any
        )
        return await BoarderService.updateBoarder(payload, fakeUser)
    }
    async function whenUpdateBoarderNotFound(payload: any) {
        jest.spyOn(BoarderDao, "update").mockResolvedValue({
            affectedRows: 0,
        } as any)
        jest.spyOn(
            BoarderMappingRoleDao,
            "destroyByBoarderId"
        ).mockResolvedValue({
            affectedRows: 1,
        })
        jest.spyOn(BoarderMappingRoleDao, "bulkCreate").mockResolvedValue(
            true as any
        )
        return await BoarderService.updateBoarder(payload, fakeUser)
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
        jest.spyOn(BoarderDao, "delete").mockResolvedValue({
            affectedRows: 1,
        } as any)
        jest.spyOn(ProjectDao, "deleteBunkByBoarderId").mockResolvedValue({
            affectedRows: 1,
        } as any)
        return await BoarderService.deleteBoarder(boarder_id, fakeUser)
    }
    async function whenDeleteBoarderNotFound(boarder_id: string) {
        jest.spyOn(BoarderDao, "delete").mockResolvedValue({
            affectedRows: 0,
        } as any)
        jest.spyOn(ProjectDao, "deleteBunkByBoarderId").mockResolvedValue({
            affectedRows: 0,
        } as any)
        return await BoarderService.deleteBoarder(boarder_id, fakeUser)
    }

    function expectGetBoarderRolesFromProjectData() {
        return {
            total: 1,
            from: 1,
            to: 1,
            current_page: 1,
            last_page: 1,
            per_page: 20,
            items: [fakeBoarderRole],
        }
    }
    function expectGivenOffset1Limit2ThenGetBoarderRolesCountShouldBeEqual2(
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
            items: [fakeBoarderRole, fakeBoarderRole],
        }
    }
    async function whenGetBoarderRolesFromProject(project_id: number) {
        jest.spyOn(BoarderRoleDao, "findAll").mockResolvedValue([
            fakeBoarderRole,
        ])
        const result = await BoarderService.getBoarderRolesFromProject(
            project_id
        )
        return result
    }
    async function whenGetBoarderRolesFromProjectWithPagination(
        project_id: number,
        query: { offset: number; limit: number }
    ) {
        jest.spyOn(BoarderRoleDao, "findAll").mockResolvedValue([
            fakeBoarderRole,
            fakeBoarderRole,
            fakeBoarderRole,
            fakeBoarderRole,
        ])
        const result = await BoarderService.getBoarderRolesFromProject(
            project_id,
            query
        )
        return result
    }

    function givenCreateBoarderRolePayload() {
        return {
            project_id: 1,
            name: "1E區隊長",
        }
    }
    async function whenCreateBoarderRoleSucceeded(payload: {
        project_id: number
        name: string
    }) {
        jest.spyOn(BoarderRoleDao, "findAll").mockResolvedValue([])
        jest.spyOn(BoarderRoleDao, "create").mockResolvedValue(true as any)
        return await BoarderService.createBoarderRole(payload, fakeUser)
    }
    async function whenCreateBoarderRoleRepeated(payload: {
        project_id: number
        name: string
    }) {
        jest.spyOn(BoarderRoleDao, "findAll").mockResolvedValue([
            fakeBoarderRole,
        ])
        jest.spyOn(BoarderRoleDao, "create").mockRejectedValue(true as any)
        return await BoarderService.createBoarderRole(payload, fakeUser)
    }

    function givenUpdateBoarderRolePayload() {
        return {
            id: 1,
            name: "1E區隊長(已修改)",
        }
    }
    async function whenUpdateBoarderRoleSucceeded(payload: any) {
        jest.spyOn(BoarderRoleDao, "update").mockResolvedValue({
            affectedRows: 1,
        } as any)
        return await BoarderService.updateBoarderRole(payload, fakeUser)
    }
    async function whenUpdateBoarderRoleNotModified(payload: any) {
        jest.spyOn(BoarderRoleDao, "update").mockResolvedValue({
            affectedRows: 0,
        } as any)
        return await BoarderService.updateBoarderRole(payload, fakeUser)
    }

    async function whenDeleteBoarderRoleSucceeded(boarder_role_id: number) {
        jest.spyOn(BoarderRoleDao, "delete").mockResolvedValue({
            affectedRows: 1,
        } as any)
        return await BoarderService.deleteBoarderRole(boarder_role_id, fakeUser)
    }
    async function whenDeleteBoarderRoleNotFound(boarder_role_id: number) {
        jest.spyOn(BoarderRoleDao, "delete").mockResolvedValue({
            affectedRows: 0,
        } as any)
        return await BoarderService.deleteBoarderRole(boarder_role_id, fakeUser)
    }

    function expectGetBoarderStatuesData() {
        return {
            total: 1,
            from: 1,
            to: 1,
            current_page: 1,
            last_page: 1,
            per_page: 20,
            items: [fakeBoarderStatus],
        }
    }
    function expectGivenOffset1Limit2ThenGetBoarderStatusCountShouldBeEqual2(
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
            items: [fakeBoarderStatus, fakeBoarderStatus],
        }
    }
    async function whenGetBoarderStatues() {
        jest.spyOn(BoarderStatusDao, "findAll").mockResolvedValue([
            fakeBoarderStatus,
        ])
        const result = await BoarderService.getBoarderStatuses()
        return result
    }
    async function whenGetBoarderStatusesWithPagination(query: {
        offset: number
        limit: number
    }) {
        jest.spyOn(BoarderStatusDao, "findAll").mockResolvedValue([
            fakeBoarderStatus,
            fakeBoarderStatus,
            fakeBoarderStatus,
            fakeBoarderStatus,
        ])
        const result = await BoarderService.getBoarderStatuses(query)
        return result
    }

    async function whenDeleteBoarderStatusNotFound(id: number) {
        jest.spyOn(BoarderStatusDao, "delete").mockResolvedValue({
            affectedRows: 0,
        } as any)
        const result = await BoarderService.deleteBoarderStatus(id, fakeUser)
        return result
    }
    async function whenDeleteBoarderStatusSucceeded(id: number) {
        jest.spyOn(BoarderStatusDao, "delete").mockResolvedValue({
            affectedRows: 1,
        } as any)
        const result = await BoarderService.deleteBoarderStatus(id, fakeUser)
        return result
    }

    async function whenUpdateBoarderStatusNotFound(payload: {
        id: number
        name: string
    }) {
        jest.spyOn(BoarderStatusDao, "update").mockResolvedValue({
            affectedRows: 0,
        } as any)
        const result = await BoarderService.updateBoarderStatus(
            payload,
            fakeUser
        )
        return result
    }
    async function whenUpdateBoarderStatusSucceed(payload: {
        id: number
        name: string
    }) {
        jest.spyOn(BoarderStatusDao, "update").mockResolvedValue({
            affectedRows: 1,
        } as any)
        const result = await BoarderService.updateBoarderStatus(
            payload,
            fakeUser
        )
        return result
    }

    async function whenCreateBoarderStatusRepeated(payload: { name: string }) {
        jest.spyOn(BoarderStatusDao, "findAll").mockResolvedValue([
            fakeBoarderStatus,
        ])
        jest.spyOn(BoarderStatusDao, "create").mockResolvedValue(true as any)
        const result = await BoarderService.createBoarderStatus(
            payload,
            fakeUser
        )
        return result
    }
    async function whenCreateBoarderStatusSucceeded(payload: { name: string }) {
        jest.spyOn(BoarderStatusDao, "findAll").mockResolvedValue([])
        jest.spyOn(BoarderStatusDao, "create").mockResolvedValue(true as any)
        const result = await BoarderService.createBoarderStatus(
            payload,
            fakeUser
        )
        return result
    }

        function givenCreateProjectBunkPayload() {
        return {
            project_id: 1,
            floor: "9",
            room_type: "E",
            room_no: "7",
            bed: "6",
            remark: "",
            name: "測試人物",
            sid: "1999999999",
            class_id: 66,
            boarder_status_id: 1,
            boarder_role_ids: [1],
        }
    }
    async function whenCreateProjectBunk(project_id: number, payload: any) {
        jest.spyOn(uuid, "v4").mockReturnValue("123456")
        jest.spyOn(ProjectDao, "createProjectBunk").mockResolvedValue({
            id: 1,
        } as any as Promise<any>)
        jest.spyOn(BoarderDao, "create").mockResolvedValue({
            id: 1,
        } as any as Promise<any>)
        jest.spyOn(BoarderMappingRoleDao, "bulkCreate").mockResolvedValue([
            {
                id: 1,
            },
        ] as any as Promise<any>)
        return await BoarderService.createBoarder(payload, fakeUser)
    }
    async function whenCreateProjectBunkNotFoundProject(payload: any) {
        jest.spyOn(uuid, "v4").mockReturnValue("123456")
        jest.spyOn(ProjectDao, "createProjectBunk").mockRejectedValue(
            new Sequelize.ForeignKeyConstraintError({})
        )
        jest.spyOn(BoarderDao, "create").mockRejectedValue(
            new Sequelize.ForeignKeyConstraintError({})
        )
        jest.spyOn(BoarderMappingRoleDao, "bulkCreate").mockResolvedValue(
            true as any as Promise<any>
        )

        return await BoarderService.createBoarder(payload, fakeUser)
    }
    async function whenCreateProjectBunkRepeat(payload: any) {
        jest.spyOn(uuid, "v4").mockReturnValue("123456")
        jest.spyOn(ProjectDao, "createProjectBunk").mockRejectedValue(
            new Sequelize.UniqueConstraintError({})
        )
        jest.spyOn(BoarderDao, "create").mockResolvedValue(
            true as any as Promise<any>
        )
        jest.spyOn(BoarderMappingRoleDao, "bulkCreate").mockResolvedValue(
            true as any as Promise<any>
        )

        return await BoarderService.createBoarder(payload, fakeUser)
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
                expectGivenOffset1Limit2ThenGetBoardersCountShouldBeEqual2(
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

    describe("建立住宿生(床位)", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const project_id = 1
            const payload = givenCreateProjectBunkPayload()

            // when
            const createdResult = await whenCreateProjectBunk(
                project_id,
                payload
            )

            // then
            expect(createdResult).toBe(true)
            expect(BoarderDao.create).toBeCalledWith({
                name: payload.name,
                project_id: project_id,
                class_id: payload.class_id,
                sid: payload.sid,
                boarder_status_id: payload.boarder_status_id,
                remark: payload.remark,
                id: uuid.v4(),
            })
            expect(BoarderMappingRoleDao.bulkCreate).toBeCalledWith([
                {
                    boarder_id: 1,
                    boarder_role_id: payload.boarder_role_ids[0],
                },
            ])
            expect(ProjectDao.createProjectBunk).toBeCalledWith({
                boarder_id: 1,
                project_id: project_id,
                floor: payload.floor,
                room_type: payload.room_type,
                room_no: payload.room_no,
                bed: payload.bed,
                remark: payload.remark,
            })
        })

        it("若此項目不存在應擲出例外「此項目不存在」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "此項目不存在"
            const payload = givenCreateProjectBunkPayload()

            // when
            const result = whenCreateProjectBunkNotFoundProject(payload)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })

        it("若項目中已有此床位應擲出例外「建立失敗，此床位已存在」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "建立失敗，此床位已存在"
            const payload = givenCreateProjectBunkPayload()

            // when
            const result = whenCreateProjectBunkRepeat(payload)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
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
            expect(BoarderMappingRoleDao.destroyByBoarderId).toBeCalledTimes(1)
            expect(BoarderMappingRoleDao.bulkCreate).toBeCalledTimes(1)
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
            expect(BoarderDao.delete).toBeCalledTimes(1)
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

    describe("取得某項目住宿生身分列表", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const project_id = 1

            // when
            const result = await whenGetBoarderRolesFromProject(project_id)

            // then
            expect(result).toEqual(expectGetBoarderRolesFromProjectData())
            expect(BoarderRoleDao.findAll).toBeCalledTimes(1)
        })

        it("有分頁", async () => {
            // given
            const project_id = 1
            const payload = {
                offset: 1,
                limit: 2,
            }
            const expectResult =
                expectGivenOffset1Limit2ThenGetBoarderRolesCountShouldBeEqual2(
                    payload.offset,
                    payload.limit
                )

            // when
            const result = await whenGetBoarderRolesFromProjectWithPagination(
                project_id,
                payload
            )

            // then
            expect(result).toEqual(expectResult)
            expect(BoarderRoleDao.findAll).toBeCalledTimes(1)
        })
    })

    describe("取得單筆住宿生身分", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const id = 1
            const expectResult = fakeBoarderRole
            // when
            jest.spyOn(BoarderRoleDao, "findOneById").mockResolvedValue(
                expectResult as any
            )
            const result = await BoarderService.getBoarderRoleById(id)
            // then
            expect(result).toEqual(expectResult)
            expect(BoarderRoleDao.findOneById).toBeCalledTimes(1)
        })

        it("若查無資料則應擲出例外「查無資料」，設定狀態碼 400", async () => {
            // given
            const errorMessage: string = "查無資料"
            const id = 1
            // when
            jest.spyOn(BoarderRoleDao, "findOneById").mockResolvedValue(
                null as any
            )
            const result = await BoarderService.getBoarderRoleById(id)
            // then
            expect(result).rejects.toThrow(errorMessage)
            expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })

    describe("建立住宿生身分", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const payload = givenCreateBoarderRolePayload()

            // when
            const result = await whenCreateBoarderRoleSucceeded(payload)

            // then
            expect(result).toEqual(true)
            expect(BoarderRoleDao.create).toBeCalledTimes(1)
        })

        it("重複建立應擲出例外「資料已重複」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "資料已重複"
            const payload = givenCreateBoarderRolePayload()

            // when
            const result = whenCreateBoarderRoleRepeated(payload)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })

    describe("修改住宿生身分", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const payload = givenUpdateBoarderRolePayload()

            // when
            const result = await whenUpdateBoarderRoleSucceeded(payload)

            // then
            expect(result).toEqual(true)
            expect(BoarderRoleDao.update).toBeCalledTimes(1)
        })

        it("若更新資料無異動則應擲出例外「查無資料」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "查無資料"
            const payload = givenUpdateBoarderRolePayload()

            // when
            const result = whenUpdateBoarderRoleNotModified(payload)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })

    describe("刪除住宿生身分", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const boarder_role_id = 1

            // when
            const result = await whenDeleteBoarderRoleSucceeded(boarder_role_id)

            // then
            expect(result).toEqual(true)
            expect(BoarderRoleDao.delete).toBeCalledTimes(1)
        })

        it("若刪除資料無異動則應擲出例外「查無資料」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "查無資料"
            const boarder_role_id = 1

            // when
            const result = whenDeleteBoarderRoleNotFound(boarder_role_id)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })

    describe("取得住宿生狀態列表", () => {
        it("確實呼叫 DAO", async () => {
            // given

            // when
            const result = await whenGetBoarderStatues()

            // then
            expect(result).toEqual(expectGetBoarderStatuesData())
            expect(BoarderStatusDao.findAll).toBeCalledTimes(1)
        })

        it("有分頁", async () => {
            // given
            const payload = {
                offset: 1,
                limit: 2,
            }
            const expectResult =
                expectGivenOffset1Limit2ThenGetBoarderStatusCountShouldBeEqual2(
                    payload.offset,
                    payload.limit
                )

            // when
            const result = await whenGetBoarderStatusesWithPagination(payload)

            // then
            expect(result).toEqual(expectResult)
            expect(BoarderStatusDao.findAll).toBeCalledTimes(1)
        })
    })

    describe("建立住宿生狀態", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const payload = {
                name: "E2eTest",
            }

            // when
            const result = await whenCreateBoarderStatusSucceeded(payload)

            // then
            expect(result).toEqual(true)
            expect(BoarderStatusDao.create).toBeCalledTimes(1)
        })

        it("重複建立應擲出例外「資料已重複」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "資料已重複"
            const payload = {
                name: "E2eTest",
            }

            // when
            const result = whenCreateBoarderStatusRepeated(payload)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })

    describe("修改住宿生狀態", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const payload = {
                id: 1,
                name: "E2eTest(Edited)",
            }

            // when
            const result = await whenUpdateBoarderStatusSucceed(payload)

            // then
            expect(result).toEqual(true)
            expect(BoarderStatusDao.update).toBeCalledTimes(1)
        })

        it("若更新資料無異動則應擲出例外「查無資料」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "查無資料"
            const payload = {
                id: 1,
                name: "E2eTest(Edited)",
            }

            // when
            const result = whenUpdateBoarderStatusNotFound(payload)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })

    describe("刪除住宿生狀態", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const id = 1

            // when
            const result = await whenDeleteBoarderStatusSucceeded(id)

            // then
            expect(result).toEqual(true)
            expect(BoarderStatusDao.delete).toBeCalledTimes(1)
        })

        it("若刪除資料無異動則應擲出例外「查無資料」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "查無資料"
            const id = 1

            // when
            const result = whenDeleteBoarderStatusNotFound(id)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })
})
