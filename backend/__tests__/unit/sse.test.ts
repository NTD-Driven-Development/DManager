import SseService from "../../src/core/services/SseService"
import BoarderDao from "../../src/core/daos/BoarderDao"

describe("Unit test for SseService.", () => {
    describe("取得特定項目之人數概況表", () => {
        it("呼叫取得住宿生資訊 DAO，並轉換正確格式", async () => {
            // given
            const payload = {
                project_id: 1,
            }
            // when
            jest.spyOn(BoarderDao, "findBoardersByProjectId").mockResolvedValue(
                [
                    {
                        id: "1",
                        name: "UnitTest",
                        boarder_status_id: 1,
                        project_bunk: {
                            id: 1,
                            floor: "1",
                            room_type: "E",
                            room_no: "1",
                            bed: "1",
                        } as any,
                    } as any,
                ]
            )
            const result = await SseService.getAreaOfBoarderStatus(payload)
            // then
            expect(BoarderDao.findBoardersByProjectId).toBeCalledWith(
                payload.project_id
            )
            expect(result).toEqual([
                {
                    id: "1",
                    name: "UnitTest",
                    boarder_status_id: 1,
                    floor: 1,
                    room_type: "E",
                    room_no: 1,
                    bed: 1,
                },
            ])
        })

        it("當項目不存在任何住宿生應回傳空陣列", async () => {
            // given
            const payload = {
                project_id: 1,
            }
            // when
            jest.spyOn(BoarderDao, "findBoardersByProjectId").mockResolvedValue(
                []
            )
            const result = await SseService.getAreaOfBoarderStatus(payload)
            // then
            expect(BoarderDao.findBoardersByProjectId).toBeCalledWith(
                payload.project_id
            )
            expect(result).toEqual([])
        })
    })
})
