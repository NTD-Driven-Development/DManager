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
        const rawData = [
            {
                floor: 1,
                room_type: "D",
                room_no: 1,
                bed: 1,
            },
            {
                floor: 1,
                room_type: "D",
                room_no: 1,
                bed: 2,
            },
            {
                floor: 1,
                room_type: "E",
                room_no: 2,
                bed: 1,
            },
            {
                floor: 1,
                room_type: "E",
                room_no: 2,
                bed: 2,
            },
        ]
        jest.spyOn(ShareDao, "getBunks").mockResolvedValue(rawData)
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
        jest.spyOn(ShareDao, "getClasses").mockResolvedValue(rawData)
        return ShareService.getClasses()
    }

    it("取得樓區室床", async () => {
        const result = await whenGetBunks()
        expect(result).toEqual(expectBunksData())
    })

    it("取得班級", async () => {
        const result = await whenGetClasses()
        expect(result).toEqual(expectClassesData())
    })
})
