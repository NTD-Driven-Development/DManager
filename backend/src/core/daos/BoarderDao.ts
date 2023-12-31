import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import { BoarderModel } from "../../models/Boarder"
import _ from "lodash"

export default new (class BoarderDao extends BaseDao {
    public async findAll(): Promise<BoarderModel[]> {
        const boarders = await Db.boarder.findAll({
            include: [
                {
                    model: Db.boarder_role,
                    attributes: ["id", "name"],
                    as: "boarder_roles",
                    through: { attributes: [] },
                    required: false,
                },
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
                    model: Db.project_bunk,
                    attributes: ["id", "floor", "room_type", "room_no", "bed"],
                    as: "project_bunk",
                    required: false,
                },
            ],
            where: { deleted_at: null },
            // order: [["id", "DESC"]],
        })
        return boarders
    }

    public async findBoardersByProjectId(
        project_id: string | number
    ): Promise<BoarderModel[]> {
        const boarders = await Db.boarder.findAll({
            include: [
                {
                    model: Db.project_bunk,
                    attributes: ["id", "floor", "room_type", "room_no", "bed"],
                    as: "project_bunk",
                    required: false,
                },
            ],
            attributes: ["id", "name", "boarder_status_id", "sid"],
            where: { project_id: project_id, deleted_at: null },
        })
        return boarders
    }

    public async findOneById(id: string | number): Promise<BoarderModel> {
        const boarder = await Db.boarder.findOne({
            include: [
                {
                    model: Db.boarder_role,
                    attributes: ["id", "name"],
                    as: "boarder_roles",
                    through: { attributes: [] },
                    required: false,
                },
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
                    model: Db.project_bunk,
                    attributes: ["id", "floor", "room_type", "room_no", "bed"],
                    as: "project_bunk",
                    required: false,
                },
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
                {
                    model: Db.project,
                    attributes: ["id", "name"],
                    as: "project",
                    required: false,
                },
            ],
            where: { id: id, deleted_at: null },
        })
        return boarder
    }

    public async create(boarder: BoarderModel): Promise<BoarderModel> {
        boarder.created_at = moment().toDate()
        return await Db.boarder.create(boarder)
    }

    public async bulkCreate(data: BoarderModel[]): Promise<BoarderModel[]> {
        return await Db.boarder.bulkCreate(data)
    }

    public async update(boarder: BoarderModel): Promise<Core.IExecuteResult> {
        boarder.updated_at = moment().toDate()
        return await this.executeResult(
            Db.boarder.update(boarder, {
                where: { id: boarder.id },
            })
        )
    }

    public async delete(
        id: string | number,
        deleted_by: number
    ): Promise<Core.IExecuteResult> {
        return await this.executeResult(
            Db.boarder.update(
                {
                    deleted_at: moment().toDate(),
                    deleted_by: deleted_by,
                },
                {
                    where: { id: id, deleted_at: null },
                }
            )
        )
    }
})()
