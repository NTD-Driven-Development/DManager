import ShareService from "../../src/core/services/ShareService"
import ShareDao from "../../src/core/daos/ShareDao"
import HttpException from "../../src/exceptions/HttpException"

describe("Unit test for ShareService.", () => {
    function expectBunksData() {
        return [
            {
                floor: 1,
                rooms: [
                    {
                        type: "D",
                        numbers: [
                            {
                                no: 1,
                                beds: [1, 2],
                            },
                        ],
                    },
                    {
                        type: "E",
                        numbers: [
                            {
                                no: 2,
                                beds: [1, 2],
                            },
                        ],
                    },
                ],
            },
        ]
    }
    async function whenGetBunks() {
        const now = new Date()
        const rawData = [
            {
                id: 1,
                floor: 1,
                room_type: "D",
                room_no: 1,
                bed: 1,
                created_at: now,
            },
            {
                id: 2,
                floor: 1,
                room_type: "D",
                room_no: 1,
                bed: 2,
                created_at: now,
            },
            {
                id: 3,
                floor: 1,
                room_type: "E",
                room_no: 2,
                bed: 1,
                created_at: now,
            },
            {
                id: 4,
                floor: 1,
                room_type: "E",
                room_no: 2,
                bed: 2,
                created_at: now,
            },
        ]
        jest.spyOn(ShareDao, "getBunks").mockResolvedValue(rawData as any)
        return ShareService.getBunks()
    }

    function expectClassesData() {
        return [
            {
                id: 1,
                name: "資應五甲",
            },
            {
                id: 2,
                name: "資管五甲",
            },
        ]
    }
    async function whenGetClasses() {
        const rawData = expectClassesData()
        jest.spyOn(ShareDao, "getClasses").mockResolvedValue(rawData as any)
        return ShareService.getClasses()
    }

    function expectBoarderStatusesData() {
        return [
            {
                id: 1,
                name: "住宿中",

            },
        ]
    }
    async function whenGetBoarderStatuses() {
        const rawData = expectBoarderStatusesData()
        jest.spyOn(ShareDao, "getBoarderStatuses").mockResolvedValue(rawData as any)
        return await ShareService.getBoarderStatuses()
    }

    function expectBoarderRolesData() {
        return [
            {
                id: 1,
                name: "一般生",

            },
        ]
    }
    async function whenGetBoarderRoles() {
        const rawData = expectBoarderRolesData()
        jest.spyOn(ShareDao, "getBoarderRoles").mockResolvedValue(rawData as any)
        return await ShareService.getBoarderRoles()
    }

    function expectTelCardContactersData() {
        return [
            {
                id: 1,
                name: "一般生",
            },
        ]
    }
    async function whenGetTelCardContacters() {
        const rawData = expectTelCardContactersData()
        jest.spyOn(ShareDao, "getTelCardContacters").mockResolvedValue(rawData as any)
        return await ShareService.getTelCardContacters()
    }

    function expectPointRulesData() {
        return [
            {
                id: 1,
                code: "A1",
                reason: "加扣點規則1",
                point: 1,
                is_active: true,
            },
        ]
    }
    async function whenGetPointRules() {
        const rawData = expectPointRulesData()
        jest.spyOn(ShareDao, "getPointRules").mockResolvedValue(rawData as any)
        return await ShareService.getPointRules()
    }

    it("取得樓區室床", async () => {
        const result = await whenGetBunks()
        expect(result).toEqual(expectBunksData())
    })

    it("取得班級", async () => {
        const result = await whenGetClasses()
        expect(result).toEqual(expectClassesData())
    })

    it("取得住宿狀態", async () => {
        const result = await whenGetBoarderStatuses()
        expect(result).toEqual(expectBoarderStatusesData())
    })

    it("取得住宿生身分別", async () => {
        const result = await whenGetBoarderRoles()
        expect(result).toEqual(expectBoarderRolesData())
    })

    it("取得電話卡聯絡人", async () => {
        const result = await whenGetTelCardContacters()
        expect(result).toEqual(expectTelCardContactersData())
    })

    it("取得加扣點規則", async () => {
        const result = await whenGetPointRules()
        expect(result).toEqual(expectPointRulesData())
    })
})
