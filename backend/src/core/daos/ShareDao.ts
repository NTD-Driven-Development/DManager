import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import BunkModel from "../../models/Bunk"
import ClassModel from "../../models/Class"
import BoarderRoleModel from "../../models/BoarderRole"
import BoarderStatusModel from "../../models/BoarderStatus"
import TelCardContacterModel from "../../models/TelCardContacter"
import PointRuleModel from "../../models/PointRule"
import _ from "lodash"

export default new (class ShareDao extends BaseDao {
    public async getBunks(): Promise<BunkModel[]>  {
        return await Db.bunk.findAll()
    }
    public async getClasses(): Promise<ClassModel[]> {
        return await Db.class.findAll({
            attributes: ["id", "name"],
        })
    }
    public async getBoarderStatuses(): Promise<BoarderStatusModel[]> {
        return await Db.boarder_status.findAll({
            attributes: ["id", "name"],
        })
    }
    public async getBoarderRoles(): Promise<BoarderRoleModel[]> {
        return await Db.boarder_role.findAll({
            attributes: ["id", "name", "project_id"],
        })
    }
    public async getTelCardContacters(): Promise<TelCardContacterModel[]> {
        return await Db.tel_card_contacter.findAll({
            attributes: ["id", "name"],
        })
    }
    public async getPointRules(): Promise<PointRuleModel[]> {
        return await Db.point_rule.findAll({
            attributes: ["id", "code", "reason", "point"],
            where: {
                is_actived: true
            },
        })
    }

})()
