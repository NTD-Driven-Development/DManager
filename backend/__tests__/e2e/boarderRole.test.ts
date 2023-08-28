import Sequelize, { Op } from "sequelize"
import { App } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"

describe("Acceptance test for BoarderRoleController.", () => {
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

    describe("取得住宿生身分列表", () => {
        let testProject: any

        it("預先建立項目", async () => {
            // given
            const payload = {
                name: "E2E住宿生身分測試",
            }

            // when
            const response = await App.post("/api/projects").send(payload)

            // then
            expect(response.status).toBe(201)
            testProject = response.body?.data
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

        it("取得住宿生身分列表", async () => {
            // given
            const payload = {
                project_id: testProject.id,
            }

            // when
            const response = await App.get("/api/boarderRoles").query(payload)
            const data = response.body?.data

            // then
            expect(response.status).toBe(200)
            expect(data?.items?.length ?? 0).toEqual(
                givenImportPayload(payload.project_id).all_new_boarder_roles
                    .length
            )
        })

        it("實作分頁邏輯", async () => {
            // given
            const payload = {
                project_id: testProject.id,
                offset: 1,
                limit: 2,
            }

            // when
            const response = await App.get("/api/boarderRoles").query(payload)
            const data = response.body?.data

            // then
            expect(response.status).toBe(200)
            expect(data?.items?.length ?? 0).toBeLessThanOrEqual(2)
        })

        afterAll(async () => {
            await deleteImportData(testProject.id)
        })
    })

    describe("建立住宿生身分，並能夠編輯和刪除", () => {
        let testProject: any
        let testBoarderRole: any

        it("預先建立項目", async () => {
            // given
            const payload = {
                name: "E2E住宿生身分測試",
            }

            // when
            const response = await App.post("/api/projects").send(payload)

            // then
            expect(response.status).toBe(201)
            testProject = response.body?.data
        })

        it("建立住宿生身分", async () => {
            // given
            const payload = {
                project_id: testProject.id,
                name: "E2E住宿生身分測試",
            }

            // when
            const response = await App.post("/api/boarderRoles").send(payload)
            const data = response.body?.data

            // then
            expect(response.status).toBe(201)
            expect(data?.name).toEqual(payload.name)
            testBoarderRole = data
        })

        it("不可重複建立", async () => {
            // given
            const payload = {
                project_id: testProject.id,
                name: "E2E住宿生身分測試",
            }

            // when
            const response = await App.post("/api/boarderRoles").send(payload)

            // then
            expect(response.status).toBe(400)
            expect(response.body?.error).not.toBeNull()
        })

        it("編輯住宿生身分", async () => {
            // given
            const payload = {
                id: testBoarderRole.id,
                name: "E2E住宿生身分測試(已編輯)",
            }

            // when
            const response = await App.put("/api/boarderRoles").send(payload)

            // then
            expect(response.status).toBe(200)
            expect(response.body?.error).toBeNull()
        })

        it("確認是否編輯成功", async () => {
            // given
            const payload = {
                project_id: testProject.id,
            }

            // when
            const response = await App.get("/api/boarderRoles").query(payload)
            const data = response.body?.data

            // then
            expect(response.status).toBe(200)
            expect(data?.items?.length ?? 0).toEqual(1)
            expect(data?.items[0]?.name).toEqual("E2E住宿生身分測試(已編輯)")
        })

        it("刪除住宿生身分", async () => {
            // given
            const id = testBoarderRole.id

            // when
            const response = await App.delete(`/api/boarderRoles/${id}`)

            // then
            expect(response.status).toBe(200)
            expect(response.body?.error).toBeNull()
        })

        it("確認是否刪除成功", async () => {
            // given
            const payload = {
                project_id: testProject.id,
            }

            // when
            const response = await App.get("/api/boarderRoles").query(payload)
            const data = response.body?.data

            // then
            expect(response.status).toBe(200)
            expect(data?.items?.length ?? 0).toEqual(0)
        })

        afterAll(async () => {
            await deleteImportData(testProject.id)
        })
    })
})
