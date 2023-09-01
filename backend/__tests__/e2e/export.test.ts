import { Op, Transaction } from "sequelize"
import { App, mockUser } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"

describe("Acceptance test for ExportController", () => {
    async function deleteImportData(project_id: number) {
        try {
            await Db.point_log.destroy({
                where: {
                    project_id: project_id,
                },
            })
            await Db.tel_card_log.destroy({
                where: {
                    project_id: project_id,
                },
            })
            await Db.project_bunk.destroy({
                where: {
                    project_id: project_id,
                },
            })
            await Db.boarder.destroy({
                where: {
                    project_id: project_id,
                },
            })
            await Db.project.destroy({
                where: {
                    id: project_id,
                },
            })
        } catch (error: any) {
            console.log(error)
            await deleteImportData(project_id)
        }
    }

    describe("取得全區電話卡及加扣點紀錄", () => {
        let testProject: any
        let testBoarder: any

        beforeAll(async () => {
            try {
                await Db.sequelize.transaction(async (t: Transaction) => {
                    testProject = await Db.project.create({
                        name: "E2eTest",
                    })
                    testBoarder = await Db.boarder.create({
                        name: "E2eTest",
                        project_id: testProject.id,
                        boarder_status_id: 1,
                        class_id: 1,
                    })
                    await Db.project_bunk.create({
                        project_id: testProject.id,
                        boarder_id: testBoarder.id,
                        floor: "1",
                        room_type: "E",
                        room_no: "1",
                        bed: "1",
                    })
                    await Db.tel_card_log.create({
                        project_id: testProject.id,
                        boarder_id: testBoarder.id,
                        tel_card_contacter_id: 1,
                        contacted_at: new Date(),
                    })
                    await Db.point_log.create({
                        project_id: testProject.id,
                        boarder_id: testBoarder.id,
                        point_rule_id: 1,
                        point: 1,
                    })
                })
            } catch (error: any) {
                console.log(error)
            }
        })

        it("每位住宿生皆包含床位、班級、電話卡紀錄、加扣點紀錄", async () => {
            // given
            const payload = {
                project_id: 1,
            }
            // when
            const res = await App.get("/api/exports/pointsCheck").query(payload)
            // then
            const data = res.body.data
            expect(res.status).toBe(200)
            _.forEach(data, (item) => {
                expect(item).toHaveProperty("boarder")
                expect(item).toHaveProperty("tel_card_logs")
                expect(item).toHaveProperty("point_logs")
                expect(item?.boarder).toHaveProperty("project_bunk")
                expect(item?.boarder).toHaveProperty("class")
                _.forEach(item?.tel_card_logs, (tel_card_log) => {
                    expect(tel_card_log).toHaveProperty("tel_card_contacter")
                    expect(tel_card_log).toHaveProperty("creator")
                })
                _.forEach(item?.point_logs, (point_log) => {
                    expect(point_log).toHaveProperty("point_rule")
                    expect(point_log).toHaveProperty("creator")
                })
            })
        })

        it("項目查詢不到應回傳空值", async () => {
            // given
            const payload = {
                project_id: -1,
            }
            // when
            const res = await App.get("/api/exports/pointsCheck").query(payload)
            // then
            const data = res.body.data
            expect(res.status).toBe(200)
            expect(data).toEqual([])
        })

        afterAll(async () => {
            await deleteImportData(testProject.id)
        })
    })
})
