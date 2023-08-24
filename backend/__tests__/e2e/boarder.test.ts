import { Op } from "sequelize"
import { App } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"
import moment from "moment"

describe("Acceptance test for BoarderController.", () => {
    const now = moment().toDate()
    let testProject: any

    describe("取得匯入後住宿生資訊", () => {
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

        it("預先建立項目", async () => {
            // given
            const payload = {
                name: "test",
            };

            // when
            const response = await App.post("/api/projects").send(payload);

            // then
            expect(response.status).toBe(201);
            expect(response.body?.error).toBeNull();
            testProject = response.body?.data;
        });

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
        })

        it("有分頁", async () => {
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

        async function deleteImportData() {
            try {
                await Db.project_bunk.destroy({
                    where: { project_id: testProject?.id },
                })
                await Db.boarder_mapping_role.destroy({
                    where: { created_at: { [Op.gte]: now } },
                })
                await Db.boarder_role.destroy({
                    where: { project_id: testProject?.id },
                })
                await Db.boarder.destroy({
                    where: { project_id: testProject?.id },
                })
                await Db.project.destroy({ where: { id: testProject?.id } })
                await Db.class.destroy({
                    where: {
                        name: {
                            [Op.in]: givenImportPayload(testProject?.id)
                                .all_new_classes,
                        },
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
