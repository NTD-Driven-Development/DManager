import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import { BoarderRoleModel } from "../../models/BoarderRole"
import _ from "lodash"

export default new (class BoarderRoleDao extends BaseDao {
    public async findAll(): Promise<BoarderRoleModel[]> {
        return await Db.boarder_role.findAll({
            include: [
                {
                    model: Db.user,
                    attributes: ["id", "name"],
                    as: "creator",
                    required: false,
                },
                {
                    model: Db.user,
                    attributes: ["id", "name"],
                    as: "updater",
                    required: false,
                },
            ],
            where: {
                deleted_at: null,
            },
            order: [["id", "DESC"]],
        })
    }

    public async findOneById(id: number): Promise<BoarderRoleModel> {
        return await Db.boarder_role.findOne({
            include: [
                {
                    model: Db.user,
                    attributes: ["id", "name"],
                    as: "creator",
                    required: false,
                },
                {
                    model: Db.user,
                    attributes: ["id", "name"],
                    as: "updater",
                    required: false,
                },
            ],
            where: {
                id: id,
                deleted_at: null,
            },
        })
    }

    public async create(data: BoarderRoleModel): Promise<BoarderRoleModel> {
        return await Db.boarder_role.create(data)
    }

    public async bulkCreate(
        data: { name: string; project_id: number }[]
    ): Promise<BoarderRoleModel[]> {
        const map = _.map(data, (item) => {
            return { name: item.name, project_id: item.project_id }
        })
        return await Db.boarder_role.bulkCreate(map)
    }

    public async update(data: BoarderRoleModel): Promise<Core.IExecuteResult> {
        data.updated_at = moment().toDate()
        return await this.executeResult(
            Db.boarder_role.update(data, {
                where: {
                    id: data.id,
                    deleted_at: null,
                },
            })
        )
    }

    public async delete(
        id: number,
        deleted_by: number
    ): Promise<Core.IExecuteResult> {
        return await this.executeResult(
            Db.boarder_role.update(
                {
                    deleted_at: moment().toDate(),
                    deleted_by: deleted_by,
                },
                {
                    where: {
                        id: id,
                        deleted_at: null,
                    },
                }
            )
        )
    }
})()
