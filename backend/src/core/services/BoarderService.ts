import _, { toInteger } from "lodash"
import BoarderDao from "../daos/BoarderDao"
import BoarderModel from "../../models/Boarder"
import HttpException from "../../exceptions/HttpException"

export default new (class BoarderService {
    public async getBoardersFromProject(
        project_id: string | number
    ): Promise<BoarderModel[]> {
        const result = await BoarderDao.findAll()
        return _.filter(result, (item) => item.project_id == project_id)
    }
})()
