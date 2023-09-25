import { Op, Transaction } from "sequelize"
import { App, mockUser } from "../../config/preE2eConfig"
import _ from "lodash"
import ProjectDao from "../../src/core/daos/ProjectDao"
import BoarderDao from "../../src/core/daos/BoarderDao"
import TelCardContacterDao from "../../src/core/daos/TelCardContacterDao"
import TelCardLogDao from "../../src/core/daos/TelCardLogDao"
import PointRuleDao from "../../src/core/daos/PointRuleDao"
import PointLogDao from "../../src/core/daos/PointLogDao"

describe("Acceptance test for ExportController", () => {
    describe("取得全區電話卡及加扣點紀錄", () => {
        let testProject: any
        let testBoarder: any

        it("建立一個項目、一個住宿生，該住宿生皆有電話卡、加扣點記錄各一筆", async () => {
            try {
                testProject = await ProjectDao.create({
                    name: "ATDD_exp",
                })
                testBoarder = await BoarderDao.create({
                    id: "ATDD_exp",
                    name: "ATDD_exp",
                    project_id: testProject.id,
                    boarder_status_id: 1,
                    class_id: 1,
                } as any)
                await ProjectDao.createProjectBunk({
                    project_id: testProject.id,
                    boarder_id: testBoarder.id,
                    floor: "1",
                    room_type: "E",
                    room_no: "1",
                    bed: "1",
                } as any)
                const testTelCardContacter = await TelCardContacterDao.create({
                    name: "ATDD_exp",
                })
                await TelCardLogDao.create({
                    project_id: testProject.id,
                    boarder_id: testBoarder.id,
                    tel_card_contacter_id: testTelCardContacter.id as number,
                    contacted_at: new Date(),
                })
                const testPointRule = await PointRuleDao.create({
                    code: "ATDD_exp",
                    reason: "ATDD_exp",
                    point: 1,
                } as any)
                await PointLogDao.create({
                    project_id: testProject.id,
                    boarder_id: testBoarder.id,
                    point_rule_id: testPointRule.id as number,
                    point: 1,
                })
            } catch (error) {
                console.log(error)
            }
        })

        it("住宿生皆包含狀態、身分、床位、班級、電話卡紀錄、加扣點紀錄", async () => {
            // given
            const payload = {
                project_id: testProject.id,
            }
            // when
            const res = await App.get("/api/exports/pointsCheck").query(payload)
            // then
            const data = res.body.data
            const item = _.first(data) as any
            expect(res.status).toBe(200)
            expect(data.length).toBe(1)
            expect(item).toHaveProperty("boarder")
            expect(item).toHaveProperty("tel_card_logs")
            expect(item).toHaveProperty("point_logs")
            expect(item?.boarder).toHaveProperty("boarder_status")
            expect(item?.boarder).toHaveProperty("boarder_roles")
            expect(item?.boarder).toHaveProperty("project_bunk")
            expect(item?.boarder).toHaveProperty("class")
            expect(item?.tel_card_logs?.length).toBe(1)
            expect(item?.point_logs?.length).toBe(1)
            _.forEach(item?.tel_card_logs, (tel_card_log) => {
                expect(tel_card_log).toHaveProperty("tel_card_contacter")
                expect(tel_card_log).toHaveProperty("creator")
            })
            _.forEach(item?.point_logs, (point_log) => {
                expect(point_log).toHaveProperty("point_rule")
                expect(point_log).toHaveProperty("creator")
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
    })
})
