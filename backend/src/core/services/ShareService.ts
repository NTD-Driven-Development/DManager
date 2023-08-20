import _, { toInteger } from "lodash"
import ShareDao from "../daos/ShareDao"
import BunkModel from "../../models/Bunk"
import ClassModel from "../../models/Class"
import HttpException from "../../exceptions/HttpException"
import BunkResult from "../exportDtos/share/BunkResult"

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
})()
