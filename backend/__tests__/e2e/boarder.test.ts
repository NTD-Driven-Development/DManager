import { Op } from "sequelize"
import { App } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"

describe("Acceptance test for BoarderController.", () => {
    function givenCreateProjectPayload() {
        return {
            name: "test",
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

    function givenUpdateBoarderPayload(boarder_id: any) {
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
            await deleteImportData(project_id)
        }
    }

    describe("取得匯入後住宿生資訊，並能夠進行編輯及刪除", () => {
        let testProject: any
        let testBoarder: any

        it("預先建立項目", async () => {
            // given
            const payload = givenCreateProjectPayload()

            // when
            const response = await App.post("/api/projects").send(payload)
            testProject = response.body?.data

            // then
            expect(response.status).toBe(201)
            expect(response.body?.error).toBeNull()
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

        it("取得住宿生資訊", async () => {
            // given
            const payload = {
                project_id: testProject.id,
                offset: 1,
                limit: 10,
            }

            // when
            const response = await App.get("/api/boarders").query(payload)
            const data = response.body?.data

            // then
            expect(response.status).toBe(200)
            expect(response.body?.error).toBeNull()
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
            const data = response.body?.data

            // then
            expect(response.status).toBe(200)
            expect(response.body?.error).toBeNull()
            expect(data?.items?.length ?? 0).toBeLessThanOrEqual(payload.limit)
        })

        it("編輯住宿生資訊", async () => {
            // given
            const boarder_id = testBoarder.id
            const payload = givenUpdateBoarderPayload(boarder_id)

            // when
            const response = await App.put("/api/boarders").send(payload)

            // then
            expect(response.status).toBe(200)
            expect(response.body?.error).toBeNull()
        })

        it("確認編輯結果", async () => {
            // given
            const boarder_id = testBoarder.id
            const expectResult = givenUpdateBoarderPayload(boarder_id)

            // when
            const response = await App.get(`/api/boarders/${boarder_id}`)
            const {
                id,
                sid,
                name,
                phone,
                class_id,
                birthday,
                avatar,
                remark,
                access_card,
                boarder_status_id,
            } = response.body?.data
            const data = {
                id,
                sid,
                name,
                phone,
                class_id,
                birthday,
                avatar,
                remark,
                access_card,
                boarder_status_id,
            }

            // then
            expect(response.status).toBe(200)
            expect(response.body?.error).toBeNull()
            expect(data).toEqual(expectResult)
        })

        it("若編輯不存在之編號應回應 400「查無資料」", async () => {
            // given
            const errorMessage: string = "查無資料"
            const boarder_id = "-1"
            const payload = givenUpdateBoarderPayload(boarder_id)

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
            expect(response.status).toBe(200)
            expect(response.body?.error).toBeNull()
        })

        it("確認刪除結果，查詢單筆應回傳「查無資料」", async () => {
            // given
            const errorMessage: string = "查無資料"
            const boarder_id = testBoarder.id

            // when
            const response = await App.get(`/api/boarders/${boarder_id}`)

            // then
            expect(response.status).toBe(400)
            expect(response.body?.error).toEqual(errorMessage)
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
            const response = await App.post(
                `/api/projects/${payload.project_id}/bunks`
            ).send(payload)

            // then
            expect(response.status).toBe(201)
            expect(response.body?.error).toBeNull()
        })

        afterAll(async () => {
            await deleteImportData(testProject?.id)
        })
    })
})
