import ExportService from "../../src/core/services/ExportService"
import ExportDao from "../../src/core/daos/ExportDao"
import { UniqueConstraintError } from "sequelize"
import _ from "lodash"

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
        daoData: () => {
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
        ).mockResolvedValue(daoData())
        const result = await ExportService.getBoarderPointAndTelCardLogs(
            payload
        )
        return result
    }
    function getBoarderPointAndTelCardLogsWithUnSortedBunkFromDao() {
        const fakeBoarder1 = {
            ...fakeBoarder,
            tel_card_logs: [fakeTelCardLog],
            point_logs: [fakePointLog],
        }
        const fakeBoarder2 = {
            ...fakeBoarder,
            project_bunk: {
                ...fakeBoarder.project_bunk,
                bed: "2",
            } as any,
            tel_card_logs: [fakeTelCardLog],
            point_logs: [fakePointLog],
        }
        const fakeBoarder3 = {
            ...fakeBoarder,
            project_bunk: {
                ...fakeBoarder.project_bunk,
                room_no: "2",
            } as any,
            tel_card_logs: [fakeTelCardLog],
            point_logs: [fakePointLog],
        }
        const fakeBoarder4 = {
            ...fakeBoarder,
            project_bunk: {
                ...fakeBoarder.project_bunk,
                room_type: "F",
            } as any,
            tel_card_logs: [fakeTelCardLog],
            point_logs: [fakePointLog],
        }
        const fakeBoarder5 = {
            ...fakeBoarder,
            project_bunk: {
                ...fakeBoarder.project_bunk,
                floor: "2",
            } as any,
            tel_card_logs: [fakeTelCardLog],
            point_logs: [fakePointLog],
        }
        return [
            fakeBoarder4,
            fakeBoarder2,
            fakeBoarder1,
            fakeBoarder3,
            fakeBoarder5,
        ]
    }
    function expectExportBoarderPointAndTelCardLogsWithSortedBunk() {
        const expectResult = _.map(getBoarderPointAndTelCardLogsWithUnSortedBunkFromDao(), (item) => {
            const point_logs = item.point_logs ?? []
            const tel_card_logs = item.tel_card_logs ?? []
            const boarder = {
                ...item,
                point_logs: undefined,
                tel_card_logs: undefined,
            }
            return {
                boarder: boarder,
                point_logs,
                tel_card_logs,
            }
        })
        return [
            expectResult[2],
            expectResult[1],
            expectResult[3],
            expectResult[0],
            expectResult[4],
        ]
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

        it("匯出結果要按照樓區室床排序", async () => {
            // given
            const payload = {
                project_id: 1,
            }
            const expectResult = expectExportBoarderPointAndTelCardLogsWithSortedBunk()
            // when
            const result = await whenGetBoarderPointAndTelCardLogs(
                getBoarderPointAndTelCardLogsWithUnSortedBunkFromDao,
                payload
            )
            // then
            expect(ExportDao.getBoarderPointAndTelCardLogs).toBeCalledTimes(1)
            expect(result).toEqual(expectResult)
        })

        it("給予查詢參數 search，搜尋符合樓寢床、姓名", async () => {
            // given
            const payload1 = {
                search: "2A1-1",
            }
            const payload2 = {
                search: "姓名",
            }
            // when
            jest.spyOn(ExportDao, "getBoarderPointAndTelCardLogs").mockResolvedValue([
                {
                    id: "1",
                    project_bunk: {
                        floor: 1,
                        room_type: "A",
                        room_no: 1,
                        bed: 1,
                    } as any,
                    name: "姓名1",

                } as any,
                {
                    id: "2",
                    project_id: 1,
                    project_bunk: {
                        floor: 2,
                        room_type: "A",
                        room_no: 1,
                        bed: 1,
                    } as any,
                    name: "姓名2",
                } as any,
                {
                    id: "3",
                    project_id: 1,
                    project_bunk: {
                        floor: 2,
                        room_type: "A",
                        room_no: 1,
                        bed: 1,
                    } as any,
                    name: "姓名3",
                } as any,
            ])
            const result1 = await ExportService.getBoarderPointAndTelCardLogs(payload1)
            const result2 = await ExportService.getBoarderPointAndTelCardLogs(payload2)
            // then
            expect(result1.length).toBe(2)
            expect(result2.length).toBe(3)
        })
    })
})
