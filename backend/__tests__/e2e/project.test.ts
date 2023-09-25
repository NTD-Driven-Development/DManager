import { ForeignKeyConstraintError, Op } from "sequelize"
import { App, mockUser } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"
import ProjectDao from "../../src/core/daos/ProjectDao"

describe("Acceptance test for ProjectController.", () => {
    function givenCreateProjectPayload(concatStr: string) {
        return {
            name: `ATDD_project${concatStr}`,
            remark: null,
        }
    }

    function givenUpdateProjectPayload(id: number) {
        return {
            id: id,
            name: "ATDD_project(ed)",
            remark: "remark",
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
            all_new_classes: ["ATDD_project"],
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
                    new_class: "ATDD_project",
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

    describe("取得項目列表", () => {
        let testProject: any

        it("預先建立項目", async () => {
            // given
            const payload = givenCreateProjectPayload("1")
            // when
            const response = await App.post("/api/projects").send(payload)
            // then
            testProject = response.body?.data
            expect(response.status).toBe(201)
            expect(testProject).toBeTruthy()
        })

        it("取得項目列表", async () => {
            // given
            // when
            const response = await App.get("/api/projects")
            // then
            const data = response.body?.data
            expect(response.status).toBe(200)
            expect(data).toBeTruthy()
            expect(data).toHaveProperty("total")
            expect(data).toHaveProperty("current_page")
            expect(data).toHaveProperty("last_page")
            expect(data).toHaveProperty("items")
            expect(data.items.length).toBeGreaterThan(0)
        })

        it("分頁邏輯", async () => {
            // given
            const payload = {
                offset: "1",
                limit: "1",
            }
            // when
            const response = await App.get("/api/projects").query(payload)
            // then
            const data = response.body?.data
            expect(response.status).toBe(200)
            expect(data).toBeTruthy()
            expect(data.items.length).toBeLessThanOrEqual(1)
        })
    })

    describe("建立項目", () => {
        let testProject: any

        it("測試資料建立成功", async () => {
            // given
            const payload = givenCreateProjectPayload("2")
            // when
            const response = await App.post("/api/projects").send(payload)
            // then
            testProject = response.body?.data
            expect(response.status).toBe(201)
            expect(testProject).toBeTruthy()
            expect(testProject.created_by).toBe(mockUser.id)
        })

        it("若建立項目名稱已存在，回應 400 「名稱已存在」", async () => {
            // given
            const payload = givenCreateProjectPayload("2")
            // when
            const response = await App.post("/api/projects").send(payload)
            // then
            expect(response.status).toBe(400)
            expect(response.body?.error).toBe("名稱已存在")
        })
    })

    describe("取得項目並更新", () => {
        let testProject: any

        it("預先建立項目", async () => {
            // given
            const payload = givenCreateProjectPayload("3")
            // when
            const response = await App.post("/api/projects").send(payload)
            // then
            testProject = response.body?.data
            expect(response.status).toBe(201)
        })

        it("更新項目", async () => {
            // given
            const payload = givenUpdateProjectPayload(testProject.id)
            // when
            const response = await App.put("/api/projects").send(payload)
            // then
            expect(response.status).toBe(200)
            const result = await ProjectDao.findOneById(payload.id)
            expect(result.name).toEqual(payload.name)
            expect(result.remark).toEqual(payload.remark)
            expect(result.updated_by).toBe(mockUser.id)
        })

        it("若更新項目名稱已存在，回應 400 「名稱已存在」", async () => {
            // given
            const payload = givenUpdateProjectPayload(-1)
            // when
            const response = await App.put("/api/projects").send(payload)
            // then
            expect(response.status).toBe(400)
            expect(response.body?.error).toBe("名稱已存在")
        })
    })

    describe("刪除項目", () => {
        let testProject: any

        it("預先建立項目", async () => {
            // given
            const payload = givenCreateProjectPayload("4")
            // when
            const response = await App.post("/api/projects").send(payload)
            // then
            testProject = response.body?.data
            expect(response.status).toBe(201)
        })

        it("刪除項目", async () => {
            // given
            const id = testProject.id
            // when
            const response = await App.delete(`/api/projects/${id}`)
            // then
            expect(response.status).toBe(200)
            expect(await ProjectDao.findOneById(id)).toBeNull()
            expect(
                (await Db.project.findOne({ where: { id: id } })).deleted_by
            ).toBe(mockUser.id)
        })

        it("刪除不存在的資料應出錯", async () => {
            // given
            const id = testProject.id
            // when
            const response = await App.delete(`/api/projects/${id}`)
            // then
            expect(response.status).toBe(400)
        })
    })

    describe("匯入住宿生資料", () => {
        let testProject: any

        it("建立項目", async () => {
            // given
            const payload = givenCreateProjectPayload("5")
            // when
            const response = await App.post("/api/projects").send(payload)
            // then
            testProject = response.body?.data
            expect(response.status).toBe(201)
        })

        it("匯入資料", async () => {
            // given
            const payload = givenImportPayload(testProject.id)
            // when
            const response = await App.post("/api/projects/import").send(
                payload
            )
            // then
            expect(response.status).toBe(200)
            expect(response.body?.error).toBeNull()
        })

        it("確認已匯入該項目住宿生資訊", async () => {
            // given
            const payload = {
                project_id: testProject.id,
            }
            // when
            const response = await App.get("/api/boarders").query(payload)
            // then
            const data = response.body?.data.items
            expect(response.status).toBe(200)
            expect(data).toBeTruthy()
            expect(data.length).toBe(
                givenImportPayload(payload.project_id).items.length
            )
            _.forEach(data, (item) => {
                expect(item).toHaveProperty("name")
                expect(item).toHaveProperty("class_id")
                expect(item).toHaveProperty("boarder_status_id")
            })
        })

        it("確認該項目床位已對應住宿生資訊", async () => {
            // given
            const project_id = testProject.id
            // when
            const response = await App.get("/api/projects/" + project_id)
            const data = response.body?.data
            const filterHasBoarder = data?.bunks
            // then
            expect(response.status).toBe(200)
            expect(data).toBeTruthy()
            expect(filterHasBoarder.length).toBe(
                givenImportPayload(project_id).items.length
            )
        })

        it("確認已匯入該項目住宿生身分列表", async () => {
            // given
            const project_id = testProject.id
            // when
            const response = await App.get(
                "/api/share/boarderRoles?project_id=" + project_id
            )
            // then
            const data = response.body?.data
            expect(response.status).toBe(200)
            expect(data).toBeTruthy()
            expect(data.length).toBe(
                givenImportPayload(project_id).all_new_boarder_roles.length
            )
        })

        it("匯入資料擁有新班級時需要同步至班級資料", async () => {
            // given
            const project_id = testProject.id
            // when
            const response = await App.get("/api/share/classes")
            const data = response.body?.data
            const filterHasNewClass = _.filter(data, (c: { id; name }) =>
                _.includes(
                    givenImportPayload(testProject.id).all_new_classes,
                    c.name
                )
            )
            // then
            expect(response.status).toBe(200)
            expect(filterHasNewClass).toBeTruthy()
            expect(filterHasNewClass.length).toBe(
                givenImportPayload(project_id).all_new_classes.length
            )
        })
    })

    describe("交換床位", () => {
        let testProject: any
        let bunks: any
        let origin_bunk_id: number
        let origin_boarder_id: number
        let swap_bunk_id: number
        let swap_boarder_id: number

        it("預先建立項目", async () => {
            const payload = givenCreateProjectPayload("6")

            const response = await App.post("/api/projects").send(payload)
            testProject = response.body?.data

            expect(response.status).toBe(201)
        })

        it("預先匯入資料", async () => {
            // given
            const payload = givenImportPayload(testProject.id)
            // when
            const response = await App.post("/api/projects/import").send(
                payload
            )
            // then
            expect(response.status).toBe(200)
            expect(response.body?.error).toBeNull()
        })

        it("取得該項目床位資料", async () => {
            // given
            const project_id = testProject.id
            // when
            const response = await App.get("/api/projects/" + project_id)
            const data = response.body?.data
            bunks = data?.bunks
            // then
            expect(response.status).toBe(200)
            expect(bunks).toBeTruthy()
            expect(bunks.length).toBe(
                givenImportPayload(project_id).items.length
            )
        })

        it("交換床位", async () => {
            // given
            origin_bunk_id = _.first(_.map(bunks, (b) => b.id))
            origin_boarder_id = _.first(_.map(bunks, (b) => b.boarder_id))
            swap_bunk_id = _.last(_.map(bunks, (b) => b.id))
            swap_boarder_id = _.last(_.map(bunks, (b) => b.boarder_id))
            const payload = {
                origin_bunk_id,
                origin_boarder_id,
                swap_bunk_id,
                swap_boarder_id,
            }
            // when
            const response = await App.post(
                `/api/projects/${testProject.id}/swapBunk`
            ).send(payload)
            // then
            expect(response.status).toBe(200)
            expect(response.body?.error).toBeNull()
        })

        it("確認交換後的床位", async () => {
            // given
            const project_id = testProject.id
            // when
            const response = await App.get("/api/projects/" + project_id)
            // then
            const data = response.body?.data
            const filterHasOriginBoarder = _.find(
                data?.bunks,
                (b) => b.boarder_id === origin_boarder_id
            )
            const filterHasSwapBoarder = _.find(
                data?.bunks,
                (b) => b.boarder_id === swap_boarder_id
            )
            expect(response.status).toBe(200)
            expect(filterHasOriginBoarder.id).toBe(swap_bunk_id)
            expect(filterHasSwapBoarder.id).toBe(origin_bunk_id)
        })
    })
})
