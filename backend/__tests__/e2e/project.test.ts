import Sequelize, { Op } from "sequelize"
import { App, mockUser } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"
import ProjectDao from "../../src/core/daos/ProjectDao"

describe("Acceptance test for ProjectController.", () => {
    async function deleteImportData(project_id: number) {
        try {
            const boarder_role_ids = await Db.boarder_role
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
            if (error instanceof Sequelize.ForeignKeyConstraintError) {
                await deleteImportData(project_id)
            }
        }
    }

    function givenCreateProjectPayload() {
        return {
            name: "E2ETestCreateProject",
            remark: null,
        }
    }

    function givenUpdateProjectPayload(id: number) {
        return {
            id: id,
            name: "E2ETestUpdateProject",
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

    function givenCreateBunkPayload(boarderRolesId: number) {
        return {
            floor: "9",
            room_type: "E",
            room_no: "7",
            bed: "6",
            remark: "",
            name: "測試人物",
            sid: "1999999999",
            class_id: 66,
            boarder_status_id: 1,
            boarder_role_ids: [boarderRolesId],
        }
    }
    describe("取得項目列表", () => {
        let testProject: any

        it("預先建立項目", async () => {
            // given
            const payload = givenCreateProjectPayload()
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

        afterAll(async () => {
            await Db.project.destroy({ where: { id: testProject.id } })
        })
    })

    describe("建立項目", () => {
        let testProject: any

        it("測試資料建立成功", async () => {
            // given
            const payload = givenCreateProjectPayload()
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
            const payload = givenCreateProjectPayload()
            // when
            const response = await App.post("/api/projects").send(payload)
            // then
            expect(response.status).toBe(400)
            expect(response.body?.error).toBe("名稱已存在")
        })
        afterAll(async () => {
            await Db.project.destroy({ where: { id: testProject.id } })
        })
    })

    describe("取得項目並更新", () => {
        let testProject: any

        it("預先建立項目", async () => {
            // given
            const payload = givenCreateProjectPayload()
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

        afterAll(async () => {
            await Db.project.destroy({ where: { id: testProject.id } })
        })
    })

    describe("刪除項目", () => {
        let testProject: any

        it("預先建立項目", async () => {
            // given
            const payload = givenCreateProjectPayload()
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

        afterAll(async () => {
            await Db.project.destroy({ where: { id: testProject.id } })
        })
    })

    describe("匯入住宿生資料", () => {
        let testProject: any

        it("建立項目", async () => {
            // given
            const payload = givenCreateProjectPayload()
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

        afterAll(async () => {
            await deleteImportData(testProject?.id)
        })
    })

    describe("該項目建立床位", () => {
        let testProject: any
        let boarderRoles: any

        it("預先建立項目", async () => {
            // given
            const payload = givenCreateProjectPayload()
            // when
            const response = await App.post("/api/projects").send(payload)
            testProject = response.body?.data
            // then
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

        it("取得該項目之住宿生身分別", async () => {
            // given
            const project_id = testProject.id
            // when
            const response = await App.get(
                "/api/share/boarderRoles?project_id=" + project_id
            )
            // then
            boarderRoles = response.body?.data
            expect(response.status).toBe(200)
            expect(boarderRoles).toBeTruthy()
            expect(boarderRoles.length).toBe(
                givenImportPayload(project_id).all_new_boarder_roles.length
            )
        })

        it("建立該項目之床位與住宿生資訊", async () => {
            // given
            const boarderRolesId = _.first(_.map(boarderRoles, (br) => br.id))
            const payload = givenCreateBunkPayload(boarderRolesId)
            // when
            const response = await App.post(
                `/api/projects/${testProject.id}/bunks`
            ).send(payload)
            // then
            const testBunk = response.body?.data
            expect(response.status).toBe(201)
            expect(testBunk).toBeTruthy()
        })

        it("確認該項目床位已建立", async () => {
            // given
            const boarderRolesId = _.first(_.map(boarderRoles, (br) => br.id))
            const payload = givenCreateBunkPayload(boarderRolesId)
            const project_id = testProject.id
            // when
            const response = await App.get("/api/projects/" + project_id)
            // then
            const data = response.body?.data
            const filterHasBunk = _.find(
                data?.bunks,
                (b) =>
                    b.floor === payload.floor &&
                    b.room_type === payload.room_type &&
                    b.room_no === payload.room_no &&
                    b.bed === payload.bed
            )
            expect(response.status).toBe(200)
            expect(filterHasBunk).toBeTruthy()
        })

        it("確認住宿生及身分已建立", async () => {
            // given
            const project_id = testProject.id
            // when
            const response = await App.get(
                "/api/boarders?project_id=" + project_id
            )
            // then
            const data = response.body?.data.items
            const filterHasTestData = _.find(data, (b) => b.name === "測試人物")
            expect(response.status).toBe(200)
            expect(filterHasTestData).toBeTruthy()
            expect(filterHasTestData).toHaveProperty("boarder_roles")
        })

        it("若重複建立床位則回應「400」，error = 「建立失敗，此床位已存在」", async () => {
            // given
            const boarderRolesId = _.first(_.map(boarderRoles, (br) => br.id))
            const payload = givenCreateBunkPayload(boarderRolesId)
            // when
            const response = await App.post(
                `/api/projects/${testProject.id}/bunks`
            ).send(payload)
            // then
            expect(response.status).toBe(400)
            expect(response.body?.error).toBe("建立失敗，此床位已存在")
        })

        it("測試 call /api/boarders 正常", async () => {
            // given
            const payload = {
                project_id: testProject.id,
            }
            // when
            const response = await App.get(`/api/boarders`).query(payload)
            // then
            expect(response.status).toBe(200)
            expect(response.body?.error).toBeNull()
        })

        afterAll(async () => {
            await deleteImportData(testProject?.id)
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
            const payload = givenCreateProjectPayload()

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

        afterAll(async () => {
            await deleteImportData(testProject?.id)
        })
    })
})
