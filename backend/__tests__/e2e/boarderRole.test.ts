import { ForeignKeyConstraintError, Op } from "sequelize"
import { App, mockUser } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"
import BoarderRoleDao from "../../src/core/daos/BoarderRoleDao"

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
            all_new_classes: ["ATDD_boarderRole"],
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
                    new_class: "ATDD_boarderRole",
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

    describe("取得住宿生身分列表", () => {
        let testProject: any
        let testBoarderRoles: any

        it("預先建立項目", async () => {
            // given
            const payload = {
                name: "ATDD_boarder_role",
            }
            // when
            const response = await App.post("/api/projects").send(payload)
            // then
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

        it("取得住宿生身分列表", async () => {
            // given
            const payload = {
                project_id: testProject.id,
            }
            // when
            const response = await App.get("/api/boarderRoles").query(payload)
            // then
            const data = response.body?.data
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
            // then
            const data = response.body?.data
            expect(response.status).toBe(200)
            expect(data?.items?.length ?? 0).toBeLessThanOrEqual(2)
            testBoarderRoles = data
        })

        it("取得單筆", async () => {
            // given
            const id = testBoarderRoles?.items[0]?.id
            // when
            const response = await App.get(`/api/boarderRoles/${id}`)
            // then
            const data = response.body?.data
            expect(response.status).toBe(200)
            expect(data?.id).toEqual(id)
        })

        it("查無單筆紀錄，statusCode 為 404「查無資料」", async () => {
            // given
            const id = -1
            // when
            const response = await App.get(`/api/boarderRoles/${id}`)
            // then
            expect(response.status).toBe(400)
            expect(response.body?.error).toBe("查無資料")
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
            testProject = response.body?.data
            expect(response.status).toBe(201)
        })

        it("建立住宿生身分", async () => {
            // given
            const payload = {
                project_id: testProject.id,
                name: "E2E住宿生身分測試",
            }
            // when
            const response = await App.post("/api/boarderRoles").send(payload)
            // then
            testBoarderRole = response.body?.data
            expect(response.status).toBe(201)
            expect(testBoarderRole?.name).toEqual(payload.name)
            expect(testBoarderRole?.created_by).toEqual(mockUser.id)
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
                project_id: testProject.id,
                name: "E2E住宿生身分測試(已編輯)",
            }
            // when
            const response = await App.put("/api/boarderRoles").send(payload)
            // then
            const result = await BoarderRoleDao.findOneById(payload.id)
            expect(response.status).toBe(200)
            expect(response.body?.error).toBeNull()
            expect(result.name).toBe(payload.name)
            expect(result.updated_by).toBe(mockUser.id)
        })

        it("若編輯住宿生身分名稱已存在，回應 400 「名稱已存在」", async () => {
            // given
            const payload = {
                id: -1,
                project_id: testProject.id,
                name: "E2E住宿生身分測試(已編輯)",
            }
            // when
            const response = await App.put("/api/boarderRoles").send(payload)
            // then
            expect(response.status).toBe(400)
            expect(response.body?.error).toBe("名稱已存在")
        })

        it("刪除住宿生身分", async () => {
            // given
            const id = testBoarderRole.id
            // when
            const response = await App.delete(`/api/boarderRoles/${id}`)
            // then
            expect(response.status).toBe(200)
            expect(response.body?.error).toBeNull()
            expect(await BoarderRoleDao.findOneById(id)).toBeNull()
            expect(
                (await Db.boarder_role.findOne({ where: { id: id } }))
                    .deleted_by
            ).toBe(mockUser.id)
        })
    })
})
