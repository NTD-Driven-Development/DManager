import { App } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"

describe("Acceptance test for ShareController.", () => {
    const testProjectId = 1000000000
    const testPointRuleId = 1000000000

    async function happyPathData() {
        const now = new Date()
        await Db.project.create({
            id: testProjectId,
            name: "E2Etest",
            remark: "E2Etest",
            created_at: now,
        })
        await Db.point_rule.create({
            id: testPointRuleId,
            code: "E2Etest",
            reason: "E2Etest",
            point: 1,
            is_actived: true,
            created_at: now,
        })
        await Db.boarder_role.create({
            project_id: testProjectId,
            name: "E2Etest",
            created_at: now,
        })
    }

    async function deleteHappyPathData() {
        await Db.boarder_role.destroy({ where: { project_id: testProjectId } })
        await Db.project.destroy({ where: { id: testProjectId } })
        await Db.point_rule.destroy({ where: { id: testPointRuleId } })
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

    it("取得樓區室床", async () => {
        const response = await App.get("/api/share/bunks")
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBeGreaterThan(0)
    })

    it("取得班級", async () => {
        const response = await App.get("/api/share/classes")
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBeGreaterThan(0)
    })

    it("取得住宿生狀態", async () => {
        const response = await App.get("/api/share/boarderStatuses")
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBeGreaterThan(0)
    })

    it("取得住宿生身分別", async () => {
        const response = await App.get(
            "/api/share/boarderRoles?project_id=" + testProjectId
        )
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBe(1)
    })

    it("取得電話卡聯絡人", async () => {
        const response = await App.get("/api/share/telCardContacters")
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBeGreaterThan(0)
    })

    it("取得加扣點規則", async () => {
        const response = await App.get("/api/share/pointRules")
        const testData = _.find(response.body?.data, { id: testPointRuleId })

        expect(response.status).toBe(200)
        expect(testData).toBeTruthy()
    })

    it("取得項目", async () => {
        const response = await App.get("/api/share/projects")
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBeGreaterThan(0)
    })
})
