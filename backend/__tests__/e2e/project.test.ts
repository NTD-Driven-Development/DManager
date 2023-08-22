import { Op } from "sequelize"
import { App } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"
import moment from "moment"

describe("Acceptance test for ProjectController.", () => {
    const now = moment().toDate()
    const testProjectName = "E2ETestCreateProject"
    const testProjectNameModified = "E2ETestUpdateProject"
    let testProject: any
    function givenCreateProjectPayload() {
        return {
            name: testProjectName,
            remark: null,
        }
    }

    function givenUpdateProjectPayload(id: number) {
        return {
            id: id,
            name: testProjectNameModified,
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

    describe("建立項目", () => {
        it("測試資料建立成功", async () => {
            // given
            const payload = givenCreateProjectPayload()

            // when
            const response = await App.post("/api/projects").send(payload)
            testProject = response.body?.data

            // then
            expect(response.status).toBe(201)
            expect(testProject).toBeTruthy()
        })
        afterAll(async () => {
            await Db.project.destroy({ where: { name: testProjectName } })
        })
    })

    describe("取得項目並更新", () => {
        it("預先建立項目", async () => {
            // given
            const payload = givenCreateProjectPayload()

            // when
            const response = await App.post("/api/projects").send(payload)
            testProject = response.body?.data

            // then
            expect(response.status).toBe(201)
            expect(testProject).toBeTruthy()
        })

        it("取得測試建立後的資料", async () => {
            // given
            // when
            const response = await App.get("/api/projects")
            const data = response.body?.data?.items
            testProject = _.find(
                data,
                (d) => d.name === givenCreateProjectPayload().name
            )

            // then
            expect(response.status).toBe(200)
            expect(testProject).toBeTruthy()
        })

        it("更新項目", async () => {
            // given
            const payload = givenUpdateProjectPayload(testProject.id)

            // when
            const response = await App.put("/api/projects").send(payload)

            // then
            expect(response.status).toBe(200)
        })

        it("驗證測試更新後的資料", async () => {
            // given
            const payload = givenUpdateProjectPayload(testProject.id)

            // when
            const response = await App.get("/api/projects/" + payload.id)
            const data = response.body?.data

            expect(response.status).toBe(200)
            expect(data.name).toBe(payload.name)
        })

        afterAll(async () => {
            await Db.project.destroy({ where: { name: testProjectName } })
        })
    })

    describe("刪除項目", () => {
        it("預先建立項目", async () => {
            const response = await App.post("/api/projects").send({
                name: testProjectName,
            })
            testProject = response.body?.data
            expect(response.status).toBe(201)
        })

        it("刪除測試資料", async () => {
            const response = await App.delete("/api/projects/" + testProject.id)
            expect(response.status).toBe(200)
        })

        it("刪除不存在的資料應出錯", async () => {
            const response = await App.delete("/api/projects/" + testProject.id)
            expect(response.status).toBe(400)
        })
    })

    describe("匯入住宿生資料", () => {
        let testProject: any

        it("建立項目", async () => {
            const response = await App.post("/api/projects").send({
                name: testProjectName,
            })
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
            const project_id = testProject.id

            // when
            const response = await App.get(
                "/api/boarders?project_id=" + project_id
            )
            const data = response.body?.data

            // then
            expect(response.status).toBe(200)
            expect(data).toBeTruthy()
            expect(data.length).toBe(givenImportPayload(project_id).items.length)
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
            const filterHasBoarder = data?.bunks;

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
            const data = response.body?.data

            // then
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
                _.includes(givenImportPayload(testProject.id).all_new_classes, c.name)
            )

            // then
            expect(response.status).toBe(200)
            expect(filterHasNewClass).toBeTruthy()
            expect(filterHasNewClass.length).toBe(
                givenImportPayload(project_id).all_new_classes.length
            )
        })

        async function deleteImportData() {
            try {
                await Db.project_bunk.destroy({
                    where: { project_id: testProject?.id },
                })
                await Db.boarder_mapping_role.destroy({
                    where: { created_at: {[Op.gte]: now} },
                })
                await Db.boarder_role.destroy({
                    where: { project_id: testProject?.id },
                })
                await Db.boarder.destroy({ where: { project_id: testProject?.id } })
                await Db.project.destroy({ where: { name: testProjectName } })
                await Db.class.destroy({
                    where: {
                        name: { [Op.in]: givenImportPayload(testProject?.id).all_new_classes },
                    },
                })
            } catch (error: any) {
                console.log(error)
            }
        }

        afterAll(async () => {
            await deleteImportData()
        })
    })
})
