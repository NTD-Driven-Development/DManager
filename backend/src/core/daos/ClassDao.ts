import Db from "../../models"
import BaseDao from "./BaseDao"
import Core from "../interfaces/IDao"
import moment from "moment"
import { ClassModel } from "../../models/Class"
import _ from "lodash"

export default new (class ClassDao extends BaseDao {
    public async findAll(): Promise<ClassModel[]> {
        return await Db.class.findAll({
            where: {
                deleted_at: null,
            },
            order: [["id", "DESC"]],
        })
    }

    public async findAllByName(name: string): Promise<ClassModel[]> {
        return await Db.class.findAll({
            where: {
                name: name,
                deleted_at: null,
            },
        })
    }

    public async create(data: ClassModel): Promise<ClassModel> {
        return await Db.class.create(data)
    }

    public async update(data: ClassModel): Promise<Core.IExecuteResult> {
        data.updated_at = moment().toDate()
        return await this.executeResult(
            Db.class.update(data, {
                where: {
                    id: data.id,
                    deleted_at: null,
                },
            })
        )
    }

    public async deleteById(id: number): Promise<Core.IExecuteResult> {
        return await this.executeResult(
            Db.class.update(
                {
                    deleted_at: moment().toDate(),
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

    public async bulkCreate(names: string[]): Promise<ClassModel[]> {
        const map = _.map(names, (name) => {
            return { name: name }
        })
        return await Db.class.bulkCreate(map)
    }
})()
