import { App } from "../preE2eConfig"

describe("Acceptance test for ShareController.", () => {
    it("取得樓區室床", async () => {
        const response = await App
            .get("/api/share/bunks")
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBeGreaterThan(0)
    })

    it("取得班級", async () => {
        const response = await App
            .get("/api/share/classes")
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBeGreaterThan(0)
    })
})
