import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import { BunkModel } from "../../models/Bunk"
import { ClassModel } from "../../models/Class"
import { BoarderRoleModel } from "../../models/BoarderRole"
import { BoarderStatusModel } from "../../models/BoarderStatus"
import { TelCardContacterModel } from "../../models/TelCardContacter"
import { PointRuleModel } from "../../models/PointRule"
import { ProjectModel } from "../../models/Project"
import _ from "lodash"
import { BoarderModel } from "../../models/Boarder"
import { RoleModel } from "../../models/Role"
import { UserModel } from "../../models/User"

export default new (class ShareDao extends BaseDao {
    public async getBunks(): Promise<BunkModel[]> {
        return await Db.bunk.findAll()
    }
    public async getClasses(): Promise<ClassModel[]> {
        return await Db.class.findAll({
            attributes: ["id", "name"],
            deleted_at: null,
        })
    }
    public async getBoarderStatuses(): Promise<BoarderStatusModel[]> {
        return await Db.boarder_status.findAll({
            attributes: ["id", "name"],
            deleted_at: null,
        })
    }
    public async getBoarderRoles(): Promise<BoarderRoleModel[]> {
        return await Db.boarder_role.findAll({
            attributes: ["id", "name", "project_id"],
            deleted_at: null,
        })
    }
    public async getTelCardContacters(): Promise<TelCardContacterModel[]> {
        return await Db.tel_card_contacter.findAll({
            attributes: ["id", "name"],
            deleted_at: null,
        })
    }
    public async getPointRules(): Promise<PointRuleModel[]> {
        return await Db.point_rule.findAll({
            attributes: ["id", "code", "reason", "point"],
            where: {
                is_actived: true,
                deleted_at: null,
            },
        })
    }
    public async getProjects(): Promise<ProjectModel[]> {
        return await Db.project.findAll({
            attributes: ["id", "name"],
            where: {
                deleted_at: null,
            },
            order: [["id", "DESC"]],
        })
    }
    public async getBoarders(
        project_id: number | string
    ): Promise<BoarderModel[]> {
        return await Db.boarder.findAll({
            // attributes: ["id", "sid", "name"],
            include: [
                {
                    model: Db.project_bunk,
                    as: "project_bunk",
                    required: false,
                },
                {
                    model: Db.class,
                    attributes: ["id", "name"],
                    as: "class",
                },
            ],
            where: {
                deleted_at: null,
                project_id: project_id,
            },
        })
    }
    public async getRoles(): Promise<RoleModel[]> {
        return await Db.role.findAll({
            attributes: ["id", "name"],
            where: {
                deleted_at: null,
            },
        })
    }
    public async getUsers(): Promise<UserModel[]> {
        return await Db.user.findAll({
            attributes: ["id", "name"],
            where: {
                deleted_at: null,
            },
        })
    }
})()
