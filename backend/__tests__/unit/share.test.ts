import ShareService from "../../src/core/services/ShareService"
import ShareDao from "../../src/core/daos/ShareDao"
import HttpException from "../../src/exceptions/HttpException"
import { describe } from "node:test"

/// example
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

const example = [
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

describe("Unit test for ShareService.", () => {
    jest.spyOn(ShareDao, "getBunks").mockResolvedValue(rawData)
    it("取得樓區室床", async () => {
        const result = await ShareService.getBunks()
        expect(result).toEqual(example)
    })
})
