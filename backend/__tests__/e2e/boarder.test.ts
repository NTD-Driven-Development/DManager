import { ForeignKeyConstraintError, Op } from "sequelize"
import { App, mockUser } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"
import BoarderDao from "../../src/core/daos/BoarderDao"

describe("Acceptance test for BoarderController.", () => {
    function givenCreateProjectPayload(concatStr: string) {
        return {
            name: `ATDD_boarder${concatStr}`,
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
            all_new_classes: ["ATDD_boarder"],
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
                    new_class: "ATDD_boarder",
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

    function givenUpdateBoarderPayload(
        boarder_id: string,
        boarder_role_ids: number[]
    ) {
        return {
            id: boarder_id,
            sid: "1234567890",
            name: "testUpdate",
            phone: "0912345678",
            class_id: 1,
            birthday: "2000-01-01T00:00:00.000Z",
            avatar: null,
            remark: "備註",
            access_card: "ACC_123456_CARD",
            boarder_status_id: 2,
            boarder_role_ids: boarder_role_ids,
        }
    }

    function givenCreateBunkPayload(
        project_id: number,
        boarderRolesId: number
    ) {
        return {
            project_id: project_id,
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

    describe("取得匯入後住宿生資訊，並能夠進行編輯及刪除", () => {
        let testProject: any
        let testBoarder: any

        it("預先建立項目", async () => {
            // given
            const payload = givenCreateProjectPayload("1")
            // when
            const response = await App.post("/api/projects").send(payload)
            // then
            testProject = response.body?.data
            expect(response.status).toBe(201)
            expect(response.body?.error).toBeFalsy()
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
            expect(response.body?.error).toBeFalsy()
        })

        it("取得住宿生資訊", async () => {
            // given
            const payload = {
                project_id: testProject.id,
                offset: 1,
                limit: 10,
            }
            // when
            const response = await App.get("/api/boarders").query(payload)
            // then
            const data = response.body?.data
            expect(response.status).toBe(200)
            expect(response.body?.error).toBeFalsy()
            expect(data?.items?.length ?? 0).toBeGreaterThan(0)
            _.forEach(data?.items, (item) => {
                expect(item).toHaveProperty("id")
                expect(item).toHaveProperty("name")
                expect(item).toHaveProperty("boarder_status")
                expect(item).toHaveProperty("project_bunk")
            })
            testBoarder = data?.items[0]
        })

        it("確認分頁邏輯無誤", async () => {
            // given
            const payload = {
                project_id: testProject.id,
                offset: 1,
                limit: 1,
            }
            // when
            const response = await App.get("/api/boarders").query(payload)
            // then
            const data = response.body?.data
            expect(response.status).toBe(200)
            expect(response.body?.error).toBeFalsy()
            expect(data?.items?.length ?? 0).toBeLessThanOrEqual(payload.limit)
        })

        it("編輯住宿生資訊", async () => {
            // given
            const boarder_id = testBoarder.id
            const boarder_role_ids = await Db.boarder_role
                .findAll({
                    where: { project_id: testProject.id },
                })
                .then((result: any) => _.map(result, (item) => item.id))
            const payload = givenUpdateBoarderPayload(
                boarder_id,
                boarder_role_ids
            )
            // when
            const response = await App.put("/api/boarders").send(payload)
            // then
            const result = await BoarderDao.findOneById(boarder_id)
            expect(response.status).toBe(200)
            expect(response.body?.error).toBeFalsy()
            expect(boarder_role_ids.length).toEqual(
                result.boarder_roles?.length
            )
            expect(result.created_by).toBe(mockUser.id)
        })

        it("若編輯不存在之編號應回應 400「查無資料」", async () => {
            // given
            const errorMessage: string = "查無資料"
            const boarder_id = "-1"
            const payload = givenUpdateBoarderPayload(boarder_id, [])
            // when
            const response = await App.put("/api/boarders").send(payload)
            // then
            expect(response.status).toBe(400)
            expect(response.body?.error).toEqual(errorMessage)
        })

        it("刪除住宿生資訊", async () => {
            // given
            const boarder_id = testBoarder.id
            // when
            const response = await App.delete(`/api/boarders/${boarder_id}`)
            // then
            const expectResult = await BoarderDao.findOneById(boarder_id)
            expect(response.status).toBe(200)
            expect(response.body?.error).toBeFalsy()
            expect(expectResult).toBeFalsy()
            expect(
                (await Db.boarder.findOne({ where: { id: boarder_id } }))
                    .deleted_by
            ).toBe(mockUser.id)
        })

        it("若刪除不存在之編號應回應 400「查無資料」", async () => {
            // given
            const errorMessage: string = "查無資料"
            const boarder_id = "-1"
            // when
            const response = await App.delete(`/api/boarders/${boarder_id}`)
            // then
            expect(response.status).toBe(400)
            expect(response.body?.error).toEqual(errorMessage)
        })

        it("刪除後可再建立同床位資料", async () => {
            // given
            const payload = {
                project_id: testProject.id,
                ...testBoarder,
                ...testBoarder.project_bunk,
            }
            // when
            const response = await App.post(`/api/boarders`).send(payload)
            // then
            expect(response.status).toBe(201)
            expect(response.body?.error).toBeFalsy()
        })
    })

    describe("建立住宿生(床位)", () => {
        let testProject: any
        let boarderRoles: any

        it("預先建立項目", async () => {
            // given
            const payload = givenCreateProjectPayload("2")
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
            expect(response.body?.error).toBeFalsy()
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
            const payload = givenCreateBunkPayload(
                testProject.id,
                boarderRolesId
            )
            // when
            const response = await App.post(`/api/boarders`).send(payload)
            // then
            const testBunk = response.body?.data
            expect(response.status).toBe(201)
            expect(testBunk).toBeTruthy()
        })

        it("確認該項目床位已建立", async () => {
            // given
            const boarderRolesId = _.first(_.map(boarderRoles, (br) => br.id))
            const payload = givenCreateBunkPayload(
                testProject.id,
                boarderRolesId
            )
            const project_id = testProject.id
            // when
            const response = await App.get("/api/projects/" + project_id)
            // then
            const data = response.body?.data
            const filterHasBunk = _.find(
                data?.bunks,
                (b) =>
                    b.floor == payload.floor &&
                    b.room_type == payload.room_type &&
                    b.room_no == payload.room_no &&
                    b.bed == payload.bed
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
            const payload = givenCreateBunkPayload(
                testProject.id,
                boarderRolesId
            )
            // when
            const response = await App.post(`/api/boarders`).send(payload)
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
            expect(response.body?.error).toBeFalsy()
        })
    })
})
