import request from "supertest"
import app from "../../src/index"

const mockApp = request(app)

describe("Acceptance test for ShareController.", () => {
    describe("取得樓區室床", () => {
        it("get .", async () => {
            const response = await mockApp
                .get("/api/share/bunks")
            expect(response.status).toBe(200)
            expect(response.body?.data?.length ?? 0).toBeGreaterThan(0)
        })
    })
})
