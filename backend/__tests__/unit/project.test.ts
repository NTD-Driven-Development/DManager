import ProjectService from "../../src/core/services/ProjectService"
import ProjectDao from "../../src/core/daos/ProjectDao"
import { ForeignKeyConstraintError } from "sequelize"
import BoarderDao from "../../src/core/daos/BoarderDao"
import ClassDao from "../../src/core/daos/ClassDao"
import BoarderRoleDao from "../../src/core/daos/BoarderRoleDao"
import BoarderMappingRoleDao from "../../src/core/daos/BoarderMappingRoleDao"
import * as uuid from "uuid"
jest.mock("uuid")

describe("Unit test for ProjectService.", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
    const now = new Date("August 17, 2023 03:24:00")
    const fakeUser = {
        id: 1,
    } as any
    const fakeProject = {
        id: 1,
        name: "測試",
        remark: "備註",
        project_bunks: [
            {
                id: 1,
                project_id: 1,
                floor: "1",
                room_type: "E",
                room_no: "1",
                bed: "1",
                boarder: {
                    id: "1",
                    project_id: 1,
                    class_id: 1,
                    name: "周東澤",
                    remark: "",
                    sid: "1111134023",
                    boarder_status_id: 1,
                    boarder_mapping_roles: [
                        {
                            id: 1,
                            boarder_id: "1",
                            boarder_role_id: 1,
                            boarder_role: {
                                id: 1,
                                name: "1E區隊長",
                                project_id: 1,
                            },
                        },
                    ],
                },
            },
        ],
        created_at: now,
    }

    function givenCreateProjectPayload() {
        return {
            name: "測試",
            remark: "備註",
        }
    }
    async function whenCreateProject(payload: any) {
        jest.spyOn(ProjectDao, "findAll").mockResolvedValue([] as any as Promise<any>)
        jest.spyOn(ProjectDao, "create").mockResolvedValue(fakeProject)
        return await ProjectService.createProject(payload, fakeUser)
    }

    function givenUpdateProjectPayload() {
        return {
            id: 1,
            name: "測試修改",
            remark: "測試修改",
        }
    }
    async function whenUpdateProject(payload: any) {
        jest.spyOn(ProjectDao, "update").mockResolvedValue({
            affectedRows: 1,
        })
        return await ProjectService.updateProject(payload, fakeUser)
    }
    async function whenUpdateNotFoundProject(payload: any) {
        jest.spyOn(ProjectDao, "update").mockResolvedValue({
            affectedRows: 0,
        })
        return await ProjectService.updateProject(payload, fakeUser)
    }

    function givenDeleteProjectPayload() {
        return 1
    }
    async function whenDeleteProject(payload: any) {
        jest.spyOn(ProjectDao, "delete").mockResolvedValue({
            affectedRows: 1,
        })
        return await ProjectService.deleteProject(payload, fakeUser)
    }
    async function whenDeleteNotFoundProject(payload: any) {
        jest.spyOn(ProjectDao, "delete").mockResolvedValue({
            affectedRows: 0,
        })
        return await ProjectService.deleteProject(payload, fakeUser)
    }

    function givenImportBoardersPayload() {
        return {
            default_boarder_status_id: 1,
            all_new_boarder_roles: [
                "1E區隊長",
                "活動一組組長",
                "卸任幹部",
                "副大隊長",
                "大隊長",
                "文書一組組長",
                "總務一組組長",
                "陸生",
                "僑生",
            ],
            all_new_classes: ["資工研二"],
            items: [
                {
                    sid: "1111134023",
                    floor: "1",
                    room_type: "E",
                    room_no: "1",
                    bed: "1",
                    name: "周東澤",
                    remark: "",
                    new_boarder_roles: ["1E區隊長"],
                    class_id: 66,
                },
                {
                    sid: "1110902044",
                    floor: "1",
                    room_type: "E",
                    room_no: "1",
                    bed: "2",
                    name: "賴冠宇",
                    remark: "",
                    new_boarder_roles: ["活動一組組長"],
                    class_id: 24,
                },
                {
                    sid: "",
                    floor: "1",
                    room_type: "E",
                    room_no: "1",
                    bed: "3",
                    name: "張瑋言",
                    remark: "",
                    new_boarder_roles: ["卸任幹部"],
                    class_id: 116,
                },
                {
                    sid: "1111032091",
                    floor: "1",
                    room_type: "E",
                    room_no: "2",
                    bed: "1",
                    name: "簡柏文",
                    remark: "",
                    new_boarder_roles: ["副大隊長"],
                    class_id: 54,
                },
                {
                    sid: "1110731037",
                    floor: "1",
                    room_type: "E",
                    room_no: "2",
                    bed: "2",
                    name: "廖奕帆",
                    remark: "",
                    new_boarder_roles: ["大隊長"],
                    class_id: 9,
                },
                {
                    sid: "1111032023",
                    floor: "1",
                    room_type: "E",
                    room_no: "2",
                    bed: "3",
                    name: "黃汎瑞",
                    remark: "",
                    new_boarder_roles: ["文書一組組長"],
                    class_id: 53,
                },
                {
                    sid: "1111032081",
                    floor: "1",
                    room_type: "E",
                    room_no: "2",
                    bed: "4",
                    name: "徐?將",
                    remark: "",
                    new_boarder_roles: ["總務一組組長"],
                    class_id: 54,
                },
                {
                    sid: "1811132024",
                    floor: "1",
                    room_type: "E",
                    room_no: "7",
                    bed: "1",
                    name: "王明如",
                    remark: "",
                    new_boarder_roles: ["陸生"],
                    new_class: "資工研二",
                },
                {
                    sid: "1411107038",
                    floor: "1",
                    room_type: "E",
                    room_no: "7",
                    bed: "2",
                    name: "關偉恒",
                    remark: "",
                    new_boarder_roles: ["僑生"],
                    class_id: 204,
                },
                {
                    sid: "1411132093",
                    floor: "1",
                    room_type: "E",
                    room_no: "7",
                    bed: "3",
                    name: "張庭恩",
                    remark: "",
                    new_boarder_roles: ["僑生"],
                    class_id: 222,
                },
            ],
        }
    }
    async function whenImportBoarders(payload: any) {
        jest.spyOn(ProjectDao, "bulkCreateProjectBunk").mockResolvedValue(
            true as any as Promise<any>
        )
        jest.spyOn(BoarderDao, "bulkCreate").mockResolvedValue(
            true as any as Promise<any>
        )
        jest.spyOn(ClassDao, "bulkCreate").mockResolvedValue(
            true as any as Promise<any>
        )
        jest.spyOn(BoarderRoleDao, "bulkCreate").mockResolvedValue(
            true as any as Promise<any>
        )
        jest.spyOn(BoarderMappingRoleDao, "bulkCreate").mockResolvedValue(
            true as any as Promise<any>
        )

        return await ProjectService.importBoardersData(payload, fakeUser)
    }
    async function whenImportBoardersNotFoundProject(payload: any) {
        jest.spyOn(ProjectDao, "bulkCreateProjectBunk").mockResolvedValue(
            true as any as Promise<any>
        )
        jest.spyOn(BoarderDao, "bulkCreate").mockRejectedValue(
            new ForeignKeyConstraintError({})
        )
        jest.spyOn(ClassDao, "bulkCreate").mockResolvedValue(
            true as any as Promise<any>
        )
        jest.spyOn(BoarderRoleDao, "bulkCreate").mockRejectedValue(
            new ForeignKeyConstraintError({})
        )
        jest.spyOn(BoarderMappingRoleDao, "bulkCreate").mockResolvedValue(
            true as any as Promise<any>
        )

        return await ProjectService.importBoardersData(payload, fakeUser)
    }

    function expectGetAllProjectsData() {
        return {
            total: 1,
            from: 1,
            to: 1,
            current_page: 1,
            last_page: 1,
            per_page: 20,
            items: [fakeProject],
        }
    }
    function expectGivenOffset1Limit2ThenGetItemsCountShouldBeEqual2(
        offset: number = 1,
        limit: number = 2
    ) {
        jest.spyOn(ProjectDao, "findAll").mockResolvedValue([
            fakeProject,
            fakeProject,
            fakeProject,
            fakeProject,
        ] as any as Promise<any>)
        return {
            total: 4,
            from: 1,
            to: 2,
            current_page: offset,
            last_page: 2,
            per_page: limit,
            items: [fakeProject, fakeProject],
        }
    }
    async function whenGetAllProjectData() {
        jest.spyOn(ProjectDao, "findAll").mockResolvedValue([
            fakeProject,
        ] as any as Promise<any>)
        return await ProjectService.getProjects()
    }

    function expectProjectDataByIdData() {
        return {
            id: 1,
            name: "測試",
            remark: "備註",
            bunks: [
                {
                    id: 1,
                    project_id: 1,
                    floor: "1",
                    room_type: "E",
                    room_no: "1",
                    bed: "1",
                    boarder: {
                        id: "1",
                        project_id: 1,
                        class_id: 1,
                        name: "周東澤",
                        remark: "",
                        sid: "1111134023",
                        boarder_status_id: 1,
                        boarder_mapping_roles: [
                            {
                                id: 1,
                                boarder_id: "1",
                                boarder_role_id: 1,
                                boarder_role: {
                                    id: 1,
                                    name: "1E區隊長",
                                    project_id: 1,
                                },
                            },
                        ],
                    },
                },
            ],
            created_at: now,
        }
    }
    async function whenGetProjectDataById(id: number) {
        jest.spyOn(ProjectDao, "findOneById").mockResolvedValue(
            fakeProject as any as Promise<any>
        )
        return await ProjectService.getProjectById(id)
    }
    async function whenGetProjectDataByIdNotFound(id: number) {
        jest.spyOn(ProjectDao, "findOneById").mockResolvedValueOnce(
            null as any as Promise<any>
        )
        return await ProjectService.getProjectById(id)
    }

    function givenswapBunkPayload() {
        return {
            origin_bunk_id: 1,
            origin_boarder_id: "123",
            swap_bunk_id: 2,
            swap_boarder_id: "456",
        }
    }
    async function whenSwapBunk(payload: any) {
        jest.spyOn(ProjectDao, "swapBunk").mockResolvedValue({
            affectedRows: 2,
        })
        return await ProjectService.swapBunk(1, payload, fakeUser)
    }
    async function whenSwapBunkAffectRowNotEqual2(payload: any) {
        jest.spyOn(ProjectDao, "swapBunk").mockResolvedValue({
            affectedRows: 0,
        })
        return await ProjectService.swapBunk(1, payload, fakeUser)
    }

    describe("取得項目列表", () => {
        it("確實呼叫 DAO，正確轉換分頁內容格式", async () => {
            // given
            const expectResult = expectGetAllProjectsData()

            // when
            const projectList = await whenGetAllProjectData()

            // then
            expect(projectList).toEqual(expectResult)
            expect(ProjectDao.findAll).toBeCalledTimes(1)
        })
        it("有分頁", async () => {
            // given
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
            const projectList = await ProjectService.getProjects(payload)

            // then
            expect(projectList).toEqual(expectResult)
            expect(ProjectDao.findAll).toBeCalledTimes(1)
        })
    })

    describe("取得單筆", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const expectResult = expectProjectDataByIdData()

            // when
            const project = await whenGetProjectDataById(expectResult.id)

            // then
            expect(project).toEqual(expectResult)
            expect(ProjectDao.findOneById).toBeCalledTimes(1)
        })

        it("若此項目不存在應擲出例外「此項目不存在」，設定狀態碼 400。", async () => {
            // given
            const project_id = -1
            const errorMessage: string = "此項目不存在"

            // when
            const result = whenGetProjectDataByIdNotFound(project_id)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })

    describe("建立項目", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const payload = givenCreateProjectPayload()

            // when
            const createdResult = await whenCreateProject(payload)

            // then
            expect(createdResult).toBe(fakeProject)
            expect(ProjectDao.create).toBeCalledTimes(1)
        })
    })

    describe("更新項目", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const payload = givenUpdateProjectPayload()

            // when
            const updatedResult = await whenUpdateProject(payload)

            // then
            expect(updatedResult).toBe(true)
            expect(ProjectDao.update).toBeCalledTimes(1)
        })

        it("若此項目不存在應擲出例外「此項目不存在」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "此項目不存在"
            const payload = givenUpdateProjectPayload()

            // when
            const result = whenUpdateNotFoundProject(payload)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })

    describe("刪除項目", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const payload = givenDeleteProjectPayload()

            // when
            const updatedResult = await whenDeleteProject(payload)

            // then
            expect(updatedResult).toBe(true)
            expect(ProjectDao.delete).toBeCalledTimes(1)
        })

        it("若此項目不存在應擲出例外「此項目不存在」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "此項目不存在"
            const payload = givenDeleteProjectPayload()

            // when
            const result = whenDeleteNotFoundProject(payload)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })

    describe("匯入住宿生資料", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const payload = givenImportBoardersPayload()

            // when
            const updatedResult = await whenImportBoarders(payload)

            // then
            expect(updatedResult).toBe(true)
            expect(BoarderRoleDao.bulkCreate).toBeCalledTimes(1)
            expect(ClassDao.bulkCreate).toBeCalledTimes(1)
            expect(BoarderDao.bulkCreate).toBeCalledTimes(1)
            expect(BoarderMappingRoleDao.bulkCreate).toBeCalledTimes(1)
        })

        it("若此項目不存在應擲出例外「此項目不存在」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "此項目不存在"
            const payload = givenImportBoardersPayload()

            // when
            const result = whenImportBoardersNotFoundProject(payload)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })

    

    describe("交換床位", () => {
        it("確實呼叫 DAO", async () => {
            // given
            const project_id = 1
            const payload = givenswapBunkPayload()

            // when
            const swapResult = await whenSwapBunk(payload)

            // then
            expect(swapResult).toBe(true)
            expect(ProjectDao.swapBunk).toBeCalledWith({
                project_id,
                ...payload,
            })
        })

        it("若更新資料影響數目不等於 2 筆，應擲出「交換失敗」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "交換失敗"
            const payload = givenswapBunkPayload()

            // when
            const result = whenSwapBunkAffectRowNotEqual2(payload)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })
})
