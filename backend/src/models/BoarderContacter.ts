"use strict"
import { Model } from "sequelize"

interface BoarderContacterAttributes {
    id?: number
    sid: string
    name: string
    tel: string
    remark?: string
    created_at: Date
    created_by?: number
    updated_at?: Date
    updated_by?: number
    deleted_at?: Date
    deleted_by?: number
}

module.exports = (sequelize: any, DataTypes: any) => {
    class BoarderContacter extends Model<BoarderContacterAttributes> implements BoarderContacterAttributes {
        id!: number
        sid!: string
        name!: string
        tel!: string
        remark?: string
        created_at!: Date
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
    BoarderContacter.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            sid: {
                type: DataTypes.STRING(20),
                allowNull: false,
                comment: "住宿生學號",
            },
            name: {
                type: DataTypes.STRING(10),
                allowNull: false,
                comment: "緊急聯絡人姓名",
            },
            tel: {
                type: DataTypes.STRING(20),
                allowNull: false,
                comment: "聯絡人電話",
            },
            remark: {
                type: DataTypes.STRING(200),
                allowNull: true,
                comment: "備註",
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                comment: "建立時間",
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
            modelName: "boarder_contacter",
            timestamps: false,
            freezeTableName: true,
        }
    )
    return BoarderContacter
}

export default BoarderContacterAttributes
