import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import { BoarderModel } from "../../models/Boarder"
import _ from "lodash"

export default new (class ExportDao extends BaseDao {
    public async getBoarderPointAndTelCardLogs(): Promise<BoarderModel[]> {
        const boarders = await Db.boarder.findAll({
            include: [
                {
                    model: Db.class,
                    attributes: ["id", "name"],
                    as: "class",
                    required: false,
                },
                {
                    model: Db.boarder_status,
                    attributes: ["id", "name"],
                    as: "boarder_status",
                    required: false,
                },
                {
                    model: Db.boarder_role,
                    through: { attributes: [] },
                    attributes: ["id", "name"],
                    as: "boarder_roles",
                    required: false,
                },
                {
                    model: Db.project_bunk,
                    attributes: ["id", "floor", "room_type", "room_no", "bed"],
                    as: "project_bunk",
                    required: false,
                },
                {
                    model: Db.point_log,
                    include: [
                        {
                            model: Db.point_rule,
                            attributes: ["id", "code", "reason", "point"],
                            as: "point_rule",
                            required: false,
                        },
                        {
                            model: Db.user,
                            attributes: ["id", "name"],
                            as: "creator",
                            required: false,
                        },
                    ],
                    attributes: [
                        "id",
                        "project_id",
                        "boarder_id",
                        "point_rule_id",
                        "point",
                        "created_at",
                    ],
                    as: "point_logs",
                    required: false,
                },
                {
                    model: Db.tel_card_log,
                    include: [
                        {
                            model: Db.tel_card_contacter,
                            attributes: ["id", "name"],
                            as: "tel_card_contacter",
                            required: false,
                        },
                        {
                            model: Db.user,
                            attributes: ["id", "name"],
                            as: "creator",
                            required: false,
                        },
                    ],
                    attributes: [
                        "id",
                        "project_id",
                        "boarder_id",
                        "tel_card_contacter_id",
                        "contacted_at",
                        "created_at",
                    ],
                    as: "tel_card_logs",
                    required: false,
                },
            ],
            where: { deleted_at: null },
            // order: [["id", "DESC"]],
        })
        return boarders
    }
})()
