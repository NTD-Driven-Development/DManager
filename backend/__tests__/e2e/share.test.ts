import { Transaction } from "sequelize"
import { App, mockUser } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"
import ProjectDao from "../../src/core/daos/ProjectDao"
import PointRuleDao from "../../src/core/daos/PointRuleDao"
import BoarderRoleDao from "../../src/core/daos/BoarderRoleDao"
import BoarderDao from "../../src/core/daos/BoarderDao"
import UserDao from "../../src/core/daos/UserDao"

describe("Acceptance test for ShareController.", () => {
    let testProject: any
    let testPointRule: any
    let testBoarderRole: any
    let testBoarder: any
    let testUser: any

    async function happyPathData() {
        try {
            const now = new Date()
            await Db.sequelize.transaction(async (t: Transaction) => {
                testProject = await ProjectDao.create({
                    name: "E2Etest",
                    remark: "E2Etest",
                    created_at: now,
                })
                testPointRule = await PointRuleDao.create({
                    code: "E2Etest",
                    reason: "E2Etest",
                    point: 1,
                    is_actived: true,
                    created_at: now,
                })
                testBoarderRole = await BoarderRoleDao.create({
                    project_id: testProject.id,
                    name: "E2Etest",
                    created_at: now,
                })
                testBoarder = await BoarderDao.create({
                    id: "PAWDAWOMOQWFQWPDP",
                    project_id: testProject.id,
                    name: "E2Etest",
                    boarder_status_id: 1,
                    created_at: now,
                })
                testUser = await UserDao.create({
                    email: "E2Etest",
                    password: "E2Etest",
                    name: "E2Etest",
                    created_at: now,
                })
            })
        } catch (error: any) {
            console.log(error)
        }
    }

    async function deleteHappyPathData() {
        try {
            await Db.boarder_role.destroy({
                where: { project_id: testProject.id },
            })
            await Db.boarder.destroy({ where: { id: testBoarder.id } })
            await Db.project.destroy({ where: { id: testProject.id } })
            await Db.point_rule.destroy({ where: { id: testPointRule.id } })
            await Db.user.destroy({ where: { id: testUser.id } })
        } catch (error: any) {
            console.log(error)
            await deleteHappyPathData()
        }
    }

    async function generateTestData() {
        await happyPathData()
    }

    async function deleteTestData() {
        await deleteHappyPathData()
    }

    beforeAll(async () => {
        await generateTestData()
    })
    afterAll(async () => {
        await deleteTestData()
    })

    it("取得樓區室床清單", async () => {
        const response = await App.get("/api/share/bunks")
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBeGreaterThan(0)
    })

    it("取得班級清單", async () => {
        const response = await App.get("/api/share/classes")
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBeGreaterThan(0)
    })

    it("取得住宿生狀態清單", async () => {
        const response = await App.get("/api/share/boarderStatuses")
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBeGreaterThan(0)
    })

    it("取得住宿生身分別清單", async () => {
        const payload = {
            project_id: testProject.id,
        }
        const response = await App.get("/api/share/boarderRoles").query(payload)
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBe(1)
    })

    it("取得電話卡聯絡人清單", async () => {
        const response = await App.get("/api/share/telCards/contacter")
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBeGreaterThan(0)
    })

    it("取得加扣點規則清單", async () => {
        const response = await App.get("/api/share/points/rule")
        const testData = _.find(response.body?.data, { id:  testPointRule.id})

        expect(response.status).toBe(200)
        expect(testData).toBeTruthy()
    })

    it("取得項目清單", async () => {
        const response = await App.get("/api/share/projects")
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBeGreaterThan(0)
    })

    it("取得某項目住宿生清單", async () => {
        const payload = {
            project_id: testProject.id,
        }
        const response = await App.get("/api/share/boarders").query(payload)
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBeGreaterThan(0)
    })

    it("取得某項目住宿生清單，只能查詢單一項目", async () => {
        const payload = {
            project_id: -1,
        }
        const response = await App.get("/api/share/boarders").query(payload)
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBe(0)
    })

    it("取得角色清單", async () => {
        const response = await App.get("/api/share/roles")
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBeGreaterThan(0)
    })

    it("取得使用者清單", async () => {
        const response = await App.get("/api/share/users")
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBeGreaterThan(0)
    })
})
