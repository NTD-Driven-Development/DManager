"use strict"
import moment from "moment"
import { Model } from "sequelize"

export interface TelCardContacterModel {
    id?: number
    name: string
    created_at?: Date
    created_by?: number
    updated_at?: Date
    updated_by?: number
    deleted_at?: Date
    deleted_by?: number
}

export default (sequelize: any, DataTypes: any) => {
    class TelCardContacter
        extends Model<TelCardContacterModel>
        implements TelCardContacterModel
    {
        id!: number
        name!: string
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
    TelCardContacter.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(10),
                allowNull: false,
                comment: "聯絡人名稱",
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
            modelName: "tel_card_contacter",
            timestamps: false,
            freezeTableName: true,
        }
    )
    return TelCardContacter
}
