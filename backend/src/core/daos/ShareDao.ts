import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import BunkModel from "../../models/Bunk"
import _ from "lodash"

export default new (class ShareDao extends BaseDao {
    public async getBunks(): Promise<BunkModel[]>  {
        return await Db.bunk.findAll()
    }
})()
