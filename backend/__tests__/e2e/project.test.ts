import { App } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"

describe("Acceptance test for ProjectController.", () => {
    const testProjectName = "E2ETestCreateProject"
    let testProject: any

    async function happyPathData() {
        const now = new Date()
    }

    async function deleteHappyPathData() {
        await Db.project.destroy({ where: { name: testProjectName } })
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

    describe("建立項目", () => {
        it("測試資料建立成功", async () => {
            const response = await App.post("/api/projects").send({
                name: testProjectName,
            })
            expect(response.status).toBe(201)
        })
    })
    describe("取得項目並更新", () => {
        it("取得測試建立後的資料", async () => {
            const response = await App.get("/api/projects")
            const data = response.body?.data
            testProject = _.find(data, (d) => d.name === testProjectName)
            expect(response.status).toBe(200)
            expect(testProject).toBeTruthy()
        })

        const updateRemark = "put_test"
        it("更新項目", async () => {
            const response = await App.put(
                "/api/projects"
            ).send({
                id: testProject.id,
                name: testProjectName,
                remark: updateRemark,
            })
            expect(response.status).toBe(200)
        })

        it("取得測試更新後的資料", async () => {
            const response = await App.get("/api/projects")
            const data = response.body?.data
            const project = _.find(data, (d) => d.name === testProjectName)
            expect(response.status).toBe(200)
            expect(project.remark).toBe(updateRemark)
        })
    })

    describe("刪除項目", () => {
        it("刪除測試資料", async () => {
            const response = await App.delete("/api/projects/" + testProject.id)
            expect(response.status).toBe(200)
        })

        it("刪除不存在的資料應出錯", async () => {
            const response = await App.delete("/api/projects/" + testProject.id)
            expect(response.status).toBe(400)
        })
    })
})
