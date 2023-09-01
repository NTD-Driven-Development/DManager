import { ForeignKeyConstraintError, Op } from "sequelize"
import { App, mockUser } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"
import BoarderNoteDao from "../../src/core/daos/BoarderNoteDao"

describe("Acceptance test for NoteController.", () => {
    function givenCreateProjectPayload() {
        return {
            name: "E2ETestCreateProject",
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
            all_new_classes: ["測試班級E2E"],
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
                    new_class: "測試班級E2E",
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

    async function deleteImportData(project_id: number) {
        try {
            const boarder_role_ids = await Db.boarder_role
                .findAll({
                    where: { project_id: project_id },
                })
                .then((result: any) => _.map(result, (item) => item.id))
            const boarder_ids = await Db.boarder
                .findAll({
                    where: { project_id: project_id },
                })
                .then((result: any) => _.map(result, (item) => item.id))
            await Db.boarder_mapping_role.destroy({
                where: { boarder_role_id: { [Op.in]: boarder_role_ids } },
            })
            await Db.project_bunk.destroy({
                where: { project_id: project_id },
            })
            await Db.boarder_role.destroy({
                where: { project_id: project_id },
            })
            await Db.boarder_note.destroy({
                where: { boarder_id: { [Op.in]: boarder_ids } },
            })
            await Db.boarder.destroy({
                where: { project_id: project_id },
            })
            await Db.project.destroy({ where: { id: project_id } })
            await Db.class.destroy({
                where: {
                    name: {
                        [Op.in]: givenImportPayload(project_id).all_new_classes,
                    },
                },
            })
        } catch (error: any) {
            console.log(error)
            if (error instanceof ForeignKeyConstraintError) {
                await deleteImportData(project_id)
            }
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

    describe("取得住宿生記事", () => {
        let testProject: any
        let testBoarder: any
        let testBoarderNote: any

        beforeAll(async () => {
            const payload = givenCreateProjectPayload()
            const response = await App.post("/api/projects").send(payload)
            testProject = response.body?.data
            const importPayload = givenImportPayload(testProject.id)
            await App.post("/api/projects/import").send(importPayload)
            const boarder = await Db.boarder.findOne({
                where: { project_id: testProject.id, sid: "1111134023" },
            })
            testBoarder = boarder
            const boarderNote = await Db.boarder_note.create({
                boarder_id: boarder.id,
                title: "test",
                description: "test",
            })
            testBoarderNote = boarderNote
            const boarderNote2 = await Db.boarder_note.create({
                boarder_id: boarder.id,
                title: "test2",
                description: "test2",
            })
        })

        it("取得住宿生記事列表，有分頁", async () => {
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
                search: "test",
            }
            // when
            const isAllItemPassing =
                await givenPayloadWhenGetBoarderNoteThenAssertIsFiltered(
                    payload
                )
            // then
            expect(isAllItemPassing).toBe(true)

            const importPayload = givenImportPayload(testProject.id)
            // given
            const payload2 = {
                offset: 1,
                limit: 20,
                project_id: testProject.id,
                search: importPayload.items[0].name,
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
                    importPayload.items[0].floor +
                    importPayload.items[0].room_type +
                    importPayload.items[0].room_no +
                    importPayload.items[0].bed,
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
        })

        afterAll(async () => {
            await deleteImportData(testProject?.id)
        })
    })

    describe("建立住宿生記事，並能夠編輯和刪除", () => {
        let testProject: any
        let testBoarder: any
        let testBoarderNote: any
        beforeAll(async () => {
            const payload = givenCreateProjectPayload()
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
            testBoarderNote = res.body?.data
        })

        it("編輯住宿生記事", async () => {
            // given
            const payload = {
                id: testBoarderNote?.id,
                title: "test2",
                description: "test2",
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
            expect(result).toBeNull()
        })

        afterAll(async () => {
            await deleteImportData(testProject?.id)
        })
    })
})
