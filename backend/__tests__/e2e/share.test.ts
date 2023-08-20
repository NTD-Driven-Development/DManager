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

    it("取得住宿生狀態", async () => {
        const response = await App
            .get("/api/share/boarderStatuses")
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBeGreaterThan(0)
    })

    it("取得住宿生角色", async () => {
        const response = await App
            .get("/api/share/boarderRoles")
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBeGreaterThan(0)
    })

    it("取得電話卡聯絡人", async () => {
        const response = await App
            .get("/api/share/telCardContacters")
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBeGreaterThan(0)
    })

    it("取得加扣點規則", async () => {
        const response = await App
            .get("/api/share/pointRules")
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBeGreaterThan(0)
    })
})
