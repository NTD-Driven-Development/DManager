import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import { TelCardContacterModel } from "../../models/TelCardContacter"
import _ from "lodash"

export default new (class TelCardContacterDao extends BaseDao {
    public async findAll(): Promise<TelCardContacterModel[]> {
        return await Db.tel_card_contacter.findAll({
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

    public async findOneById(id: number): Promise<TelCardContacterModel> {
        return await Db.tel_card_contacter.findOne({
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

    public async findAllByName(name: string): Promise<TelCardContacterModel[]> {
        return await Db.tel_card_contacter.findAll({
            where: {
                name: name,
                deleted_at: null,
            },
        })
    }

    public async create(
        data: TelCardContacterModel
    ): Promise<TelCardContacterModel> {
        return await Db.tel_card_contacter.create(data)
    }

    public async update(
        data: TelCardContacterModel
    ): Promise<Core.IExecuteResult> {
        data.updated_at = moment().toDate()
        return await this.executeResult(
            Db.tel_card_contacter.update(data, {
                where: {
                    id: data.id,
                    deleted_at: null,
                },
            })
        )
    }

    public async delete(id: number, deleted_by: number): Promise<Core.IExecuteResult> {
        return await this.executeResult(
            Db.tel_card_contacter.update(
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
