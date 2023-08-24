import _, { toInteger } from "lodash"
import ShareDao from "../daos/ShareDao"
import BunkModel from "../../models/Bunk"
import ClassModel from "../../models/Class"
import BoarderStatusModel from "../../models/BoarderStatus"
import BoarderRoleModel from "../../models/BoarderRole"
import TelCardContacterModel from "../../models/TelCardContacter"
import PointRuleModel from "../../models/PointRule"
import HttpException from "../../exceptions/HttpException"
import BunkResult from "../exportDtos/share/BunkResult"
import ProjectModel from "../../models/Project"

export default new (class UserService {
    private convertBunksToBunkResult(bunks: BunkModel[]): BunkResult[] {
        const result = [] as BunkResult[]
        // group by floor
        const groupedByFloor = _.groupBy(bunks, "floor")
        // group by room type
        _.forEach(groupedByFloor, (value, key) => {
            const groupedByRoomType = _.groupBy(value, "room_type")
            const rooms = [] as BunkResult["rooms"]
            _.forEach(groupedByRoomType, (value, key) => {
                const groupedByRoomNo = _.groupBy(value, "room_no")
                const numbers = [] as BunkResult["rooms"][0]["numbers"]
                _.forEach(groupedByRoomNo, (value, key) => {
                    const beds = _.map(value, (item) => _.toNumber(item.bed))
                    const number = {
                        no: _.toNumber(key),
                        beds: beds,
                    } as BunkResult["rooms"][0]["numbers"][0]
                    numbers.push(number)
                })
                const room = {
                    type: key,
                    numbers: numbers,
                } as BunkResult["rooms"][0]
                rooms.push(room)
            })
            const floor = {
                floor: _.toNumber(key),
                rooms: rooms,
            } as BunkResult
            result.push(floor)
        })
        return result
    }
    public async getBunks(): Promise<BunkResult[]> {
        const bunks: BunkModel[] = await ShareDao.getBunks()
        const result = this.convertBunksToBunkResult(bunks)
        return result
    }
    public async getClasses(): Promise<ClassModel[]> {
        const result = await ShareDao.getClasses()
        return result
    }
    public async getBoarderStatuses(): Promise<BoarderStatusModel[]> {
        const result = await ShareDao.getBoarderStatuses()
        return result
    }
    public async getBoarderRoles(query?: {project_id: number}): Promise<BoarderRoleModel[]> {
        const result = await ShareDao.getBoarderRoles()
        if (query?.project_id) {
            return _.filter(result, (item) => {
                return item.project_id == query.project_id
            })
        }
        return result
    }
    public async getTelCardContacters(): Promise<TelCardContacterModel[]> {
        const result = await ShareDao.getTelCardContacters()
        return result
    }
    public async getPointRules(): Promise<PointRuleModel[]> {
        const result = await ShareDao.getPointRules()
        return result
    }
    public async getProjects(): Promise<ProjectModel[]> {
        const result = await ShareDao.getProjects()
        return result
    }

})()
