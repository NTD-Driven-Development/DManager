import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import { BoarderNoteModel } from "../../models/BoarderNote"
import _ from "lodash"

export default new (class BoarderNoteDao extends BaseDao {
    public async findAll(): Promise<BoarderNoteModel[]> {
        return await Db.boarder_note.findAll({
            include: [
                {
                    model: Db.boarder,
                    include: [
                        {
                            model: Db.project_bunk,
                            attributes: ["floor", "room_type", "room_no", "bed"],
                            as: "project_bunk",
                            required: false,
                        },
                        {
                            model: Db.project,
                            attributes: ["id", "name"],
                            as: "project",
                            required: false,
                        },
                        {
                            model: Db.class,
                            attributes: ["id", "name"],
                            as: "class",
                            required: false,
                        }
                    ],
                    attributes: ["id", "name", "sid"],
                    as: "boarder",
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
            ],
            where: {
                deleted_at: null,
            },
            order: [["id", "DESC"]],
        })
    }

    public async findOneById(id: number): Promise<BoarderNoteModel> {
        return await Db.boarder_note.findOne({
            include: [
                {
                    model: Db.boarder,
                    include: [
                        {
                            model: Db.project_bunk,
                            attributes: ["floor", "room_type", "room_no", "bed"],
                            as: "project_bunk",
                            required: false,
                        },
                        {
                            model: Db.project,
                            attributes: ["id", "name"],
                            as: "project",
                            required: false,
                        },
                        {
                            model: Db.class,
                            attributes: ["id", "name"],
                            as: "class",
                            required: false,
                        }
                    ],
                    attributes: ["id", "name", "sid"],
                    as: "boarder",
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
            ],
            where: {
                id: id,
                deleted_at: null,
            },
        })
    }

    public async create(data: BoarderNoteModel): Promise<BoarderNoteModel> {
        return await Db.boarder_note.create(data)
    }

    public async update(data: BoarderNoteModel): Promise<Core.IExecuteResult> {
        data.updated_at = moment().toDate()
        return await this.executeResult(
            Db.boarder_note.update(data, {
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
            Db.boarder_note.update(
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
