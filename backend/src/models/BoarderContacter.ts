"use strict"
import moment from "moment"
import { Model } from "sequelize"
import { UserModel } from "./User"

export interface BoarderContacterModel {
    id?: number
    boarder_id: string
    name: string
    tel: string
    remark?: string
    created_at?: Date
    created_by?: number
    updated_at?: Date
    updated_by?: number
    deleted_at?: Date
    deleted_by?: number
    creator?: UserModel
    updater?: UserModel
    deleter?: UserModel
    dataValues?: BoarderContacterModel
    _previousDataValues?: BoarderContacterModel
}

export default (sequelize: any, DataTypes: any) => {
    class BoarderContacter
        extends Model<BoarderContacterModel>
        implements BoarderContacterModel
    {
        id!: number
        boarder_id!: string
        name!: string
        tel!: string
        remark?: string
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
            BoarderContacter.belongsTo(models.user, {
                foreignKey: "created_by",
                as: "creator",
            })
            BoarderContacter.belongsTo(models.user, {
                foreignKey: "updated_by",
                as: "updater",
            })
            BoarderContacter.belongsTo(models.user, {
                foreignKey: "deleted_by",
                as: "deleter",
            })
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
            boarder_id: {
                type: DataTypes.UUID,
                allowNull: false,
                comment: "住宿生外鍵",
                references: {
                    model: "boarder",
                    key: "id",
                },
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
                type: DataTypes.STRING(1024),
                allowNull: true,
                comment: "備註",
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "建立時間",
                defaultValue: () => {
                    return moment().toDate()
                },
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
