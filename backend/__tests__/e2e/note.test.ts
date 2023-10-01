import { ForeignKeyConstraintError, Op, Transaction } from "sequelize"
import { App, mockUser } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"
import BoarderNoteDao from "../../src/core/daos/BoarderNoteDao"
import BoarderDao from "../../src/core/daos/BoarderDao"
import strings from "../../src/utils/strings"

describe("Acceptance test for NoteController.", () => {
    function givenCreateProjectPayload(concatStr: string) {
        return {
            name: `ATDD_Note${concatStr}`,
            remark: null,
        }
    }
    function givenImportPayload(id: number) {
        return {
            project_id: id,
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
            all_new_classes: ["ATDD_Note"],
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
                    new_class: "ATDD_Note",
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

    async function givenPayloadWhenGetBoarderNoteThenAssertIsFiltered(payload: {
        offset: number
        limit: number
        project_id: any
        search: string
    }) {
        // when
        const res = await App.get("/api/notes/boarder").query(payload)
        // then
        let isAllItemPassing = true
        const data = res.body?.data?.items
        if (res.status !== 200) {
            console.log(res.body)
            return false
        } else if (!data || data.length === 0) {
            console.log("data is empty")
            console.log(data)
            return false
        }
        _.forEach(data, (item) => {
            const bunk =
                item?.boarder?.project_bunk?.floor +
                item?.boarder?.project_bunk?.room_type +
                item?.boarder?.project_bunk?.room_no +
                "-" +
                item?.boarder?.project_bunk?.bed
            if (
                !(
                    item?.project?.id === payload.project_id ||
                    item?.boarder?.name?.includes(payload.search) ||
                    item?.title?.includes(payload.search) ||
                    item?.description?.includes(payload.search) ||
                    bunk?.includes(payload.search)
                )
            ) {
                console.log("item not passing")
                console.log(item)
                isAllItemPassing = false
                return
            }
        })
        return isAllItemPassing
    }

    function givenCreateBoarderNotePayload(boarder_id: any): any {
        return {
            boarder_id: boarder_id,
            title: "ATDD_note",
            description: "ATDD_note",
        }
    }

    describe("取得住宿生記事", () => {
        let testProject: any
        let testBoarder: any
        let testBoarderNote: any

        it("建立項目、匯入項目，挑選一位住宿生紀錄兩筆記事", async () => {
            try {
                const res = await App.post("/api/projects").send(
                    givenCreateProjectPayload("1")
                )
                testProject = res.body?.data
                await App.post("/api/projects/import").send(
                    givenImportPayload(testProject.id)
                )
                const boarders = await BoarderDao.findBoardersByProjectId(
                    testProject.id
                )
                testBoarder = _.first(boarders)
                testBoarderNote = await BoarderNoteDao.create(
                    givenCreateBoarderNotePayload(testBoarder.id)
                )
                await BoarderNoteDao.create(
                    givenCreateBoarderNotePayload(testBoarder.id)
                )
            } catch (error: any) {
                console.log(error)
            }
        })

        it("查詢第一頁住宿生記事列表，分頁筆數不超過一筆", async () => {
            // given
            const payload = {
                offset: 1,
                limit: 1,
            }
            // when
            const res = await App.get("/api/notes/boarder").query(payload)
            // then
            expect(res.status).toBe(200)
            expect(res.body?.data?.items.length).toBeLessThanOrEqual(1)
        })

        it("取得住宿生記事列表，能夠篩選項目", async () => {
            // given
            const payload = {
                offset: 1,
                limit: 20,
                project_id: testProject.id,
            }
            // when
            const res = await App.get("/api/notes/boarder").query(payload)
            // then
            const data = res.body?.data?.items
            expect(res.status).toBe(200)
            _.forEach(data, (item) => {
                expect(item?.boarder?.project?.id).toBe(testProject.id)
            })
        })

        it("取得住宿生記事列表，能夠模糊查詢(樓區室床, 姓名, 標題, 描述)", async () => {
            // given
            const payload = {
                offset: 1,
                limit: 20,
                project_id: testProject.id,
                search: "ATDD",
            }
            // when
            const isAllItemPassing =
                await givenPayloadWhenGetBoarderNoteThenAssertIsFiltered(
                    payload
                )
            // then
            expect(isAllItemPassing).toBe(true)

            const importPayload = givenImportPayload(testProject.id)
            const boarder = await BoarderDao.findOneById(testBoarder.id)
            // given
            const payload2 = {
                offset: 1,
                limit: 20,
                project_id: testProject.id,
                search: boarder.name,
            }
            // when
            const isAllItemPassing2 =
                await givenPayloadWhenGetBoarderNoteThenAssertIsFiltered(
                    payload2
                )
            // then
            expect(isAllItemPassing2).toBe(true)

            // given
            const payload3 = {
                offset: 1,
                limit: 20,
                project_id: testProject.id,
                search:
                    strings.formatBunkString(boarder?.project_bunk as any)
            }
            // when
            const isAllItemPassing3 =
                await givenPayloadWhenGetBoarderNoteThenAssertIsFiltered(
                    payload3
                )
            // then
            expect(isAllItemPassing3).toBe(true)
        })

        it("取得單筆住宿生記事", async () => {
            // given
            const id = testBoarderNote.id
            // when
            const res = await App.get(`/api/notes/boarder/${id}`)
            // then
            expect(res.status).toBe(200)
            expect(res.body?.data?.id).toBe(id)
            expect(res.body?.data).toHaveProperty("boarder")
            expect(res.body?.data?.boarder).toHaveProperty("project_bunk")
            expect(res.body?.data?.boarder).toHaveProperty("project")
            expect(res.body?.data?.boarder).toHaveProperty("class")
        })
    })

    describe("建立住宿生記事，並能夠編輯和刪除", () => {
        let testProject: any
        let testBoarder: any
        let testBoarderNote: any
        beforeAll(async () => {
            const payload = givenCreateProjectPayload("2")
            const response = await App.post("/api/projects").send(payload)
            testProject = response.body?.data
            const importPayload = givenImportPayload(testProject?.id)
            await App.post("/api/projects/import").send(importPayload)
            const boarder = await Db.boarder.findOne({
                where: { project_id: testProject?.id, sid: "1111134023" },
            })
            testBoarder = boarder
        })

        it("建立住宿生記事", async () => {
            // given
            const payload = {
                boarder_id: testBoarder?.id,
                title: "test",
                description: "test",
            }
            // when
            const res = await App.post("/api/notes/boarder").send(payload)
            // then
            expect(res.status).toBe(201)
            expect(res.body?.data?.id).toBeTruthy()
            expect(res.body?.data?.title).toBe(payload.title)
            expect(res.body?.data?.description).toBe(payload.description)
            expect(res.body?.data?.boarder_id).toBe(payload.boarder_id)
            expect(res.body?.data?.created_by).toBe(mockUser.id)
            testBoarderNote = res.body?.data
        })

        it("編輯住宿生記事", async () => {
            // given
            const payload = {
                id: testBoarderNote?.id,
                title: "ATDD_note(ed)",
                description: "ATDD_note(ed)",
            }
            // when
            const res = await App.put("/api/notes/boarder").send(payload)
            // then
            expect(res.status).toBe(200)
            const result = await BoarderNoteDao.findOneById(testBoarderNote?.id)
            expect(result?.title).toBe(payload.title)
            expect(result?.description).toBe(payload.description)
        })

        it("刪除住宿生記事", async () => {
            // given
            const id = testBoarderNote?.id
            // when
            const res = await App.delete(`/api/notes/boarder/${id}`)
            // then
            expect(res.status).toBe(200)
            const result = await BoarderNoteDao.findOneById(id)
            expect(result).toBeFalsy()
        })
    })
})
