import ExportService from "../../src/core/services/ExportService"
import ExportDao from "../../src/core/daos/ExportDao"
import { UniqueConstraintError } from "sequelize"

describe("Unit test for ExportService.", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    const fakeTelCardLog = {
        id: 1,
        project_id: 1,
        boarder_id: "1",
        tel_card_contacter_id: 1,
        contacted_at: new Date(),
        created_at: new Date(),
        creator: {
            id: 1,
            name: "UnitTest",
        } as any,
    }
    const fakePointLog = {
        id: 1,
        project_id: 1,
        boarder_id: "1",
        point_rule_id: 1,
        point: 1,
        created_at: new Date(),
        creator: {
            id: 1,
            name: "UnitTest",
        } as any,
    }
    const fakeBoarder = {
        id: "1",
        name: "UnitTest",
        project_id: 1,
        boarder_status_id: 1,
        class: {
            id: 1,
            name: "UnitTest",
        },
        project_bunk: {
            id: 1,
            floor: "1",
            room_type: "E",
            room_no: "1",
            bed: "1",
        } as any,
    }

    function getBoarderPointAndTelCardLogsFromDaoData() {
        return [
            {
                ...fakeBoarder,
                point_logs: [fakePointLog],
                tel_card_logs: [fakeTelCardLog],
            },
        ]
    }
    async function whenGetBoarderPointAndTelCardLogs(
        getBoarderPointAndTelCardLogsFromDaoData: () => {
            point_logs: {
                id: number
                project_id: number
                boarder_id: string
                point_rule_id: number
                point: number
                created_at: Date
                creator: any
            }[]
            tel_card_logs: {
                id: number
                project_id: number
                boarder_id: string
                tel_card_contacter_id: number
                contacted_at: Date
                created_at: Date
                creator: any
            }[]
            id: string
            name: string
            project_id: number
            boarder_status_id: number
            class: { id: number; name: string }
            project_bunk: any
        }[],
        payload: { project_id: number }
    ) {
        jest.spyOn(
            ExportDao,
            "getBoarderPointAndTelCardLogs"
        ).mockResolvedValue(getBoarderPointAndTelCardLogsFromDaoData())
        const result = await ExportService.getBoarderPointAndTelCardLogs(
            payload
        )
        return result
    }

    describe("取得某項目住宿生電話卡及加扣點紀錄表", () => {
        it("確實呼叫 DAO，並轉換正確格式", async () => {
            // given
            const payload = {
                project_id: 1,
            }
            // when
            const result = await whenGetBoarderPointAndTelCardLogs(
                getBoarderPointAndTelCardLogsFromDaoData,
                payload
            )
            // then
            expect(ExportDao.getBoarderPointAndTelCardLogs).toBeCalledTimes(1)
            expect(result).toEqual([
                {
                    boarder: fakeBoarder,
                    point_logs: [fakePointLog],
                    tel_card_logs: [fakeTelCardLog],
                },
            ])
        })

        it("可篩選項目編號，若給定不存在之項目編號應回傳空值", async () => {
            // given
            const payload = {
                project_id: -1,
            }
            // when
            const result = await whenGetBoarderPointAndTelCardLogs(
                getBoarderPointAndTelCardLogsFromDaoData,
                payload
            )
            // then
            expect(ExportDao.getBoarderPointAndTelCardLogs).toBeCalledTimes(1)
            expect(result).toEqual([])
        })
    })
})
