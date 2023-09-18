import _ from "lodash"
import ShareDao from "../daos/ShareDao"
import { BunkModel } from "../../models/Bunk"
import { ClassModel } from "../../models/Class"
import { BoarderStatusModel } from "../../models/BoarderStatus"
import { BoarderRoleModel } from "../../models/BoarderRole"
import { TelCardContacterModel } from "../../models/TelCardContacter"
import { PointRuleModel } from "../../models/PointRule"
import { ProjectModel } from "../../models/Project"
import BunkResult from "../exportDtos/share/BunkResult"
import { BoarderModel } from "../../models/Boarder"
import { RoleModel } from "../../models/Role"
import { UserModel } from "../../models/User"

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
    public async getBoarderRoles(
        project_id: string | number
    ): Promise<BoarderRoleModel[]> {
        const result = await ShareDao.getBoarderRoles()
        return _.filter(
            result,
            (item: BoarderRoleModel) => item.project_id == project_id
        )
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
    public async getBoarders(
        project_id: string | number
    ): Promise<BoarderModel[]> {
        const result = await ShareDao.getBoarders(project_id)
        return result
    }
    public async getRoles(): Promise<RoleModel[]> {
        const result = await ShareDao.getRoles()
        return result
    }
    public async getUsers(): Promise<UserModel[]> {
        const result = await ShareDao.getUsers()
        return result
    }
})()
