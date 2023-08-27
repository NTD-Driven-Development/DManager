"use strict"
import moment from "moment"
import { Model } from "sequelize"

export interface BunkModel {
    id: number
    floor: string
    room_type: string
    room_no: string
    bed: string
    created_at?: Date
    created_by?: number
    updated_at?: Date
    updated_by?: number
    deleted_at?: Date
    deleted_by?: number
}

export default (sequelize: any, DataTypes: any) => {
    class Bunk extends Model<BunkModel> implements BunkModel {
        id!: number
        floor!: string
        room_type!: string
        room_no!: string
        bed!: string
        created_at?: Date
        created_by?: number
        updated_at?: Date
        updated_by?: number
        deleted_at?: Date
        deleted_by?: number

        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: any) {
            // define association here
        }
    }
    Bunk.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            floor: {
                type: DataTypes.STRING(10),
                allowNull: false,
                comment: "樓層",
            },
            room_type: {
                type: DataTypes.STRING(10),
                allowNull: false,
                comment: "房型",
            },
            room_no: {
                type: DataTypes.STRING(10),
                allowNull: false,
                comment: "房號",
            },
            bed: {
                type: DataTypes.STRING(10),
                allowNull: false,
                comment: "床號",
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "建立時間",
                defaultValue: moment().toDate(),
            },
            created_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: "建立者",
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "更新時間",
            },
            updated_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: "更新者",
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "刪除時間",
            },
            deleted_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: "刪除者",
            },
        },
        {
            sequelize,
            modelName: "bunk",
            timestamps: false,
            freezeTableName: true,
        }
    )
    return Bunk
}
