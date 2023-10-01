"use strict"
import moment from "moment"
import { Model } from "sequelize"
import { UserModel } from "./User"
import { BoarderModel } from "./Boarder"

export interface BoarderNoteModel {
    id?: number
    boarder_id: string
    title: string
    description: string
    created_at?: Date
    created_by?: number
    updated_at?: Date
    updated_by?: number
    deleted_at?: Date
    deleted_by?: number
    creator?: UserModel
    updater?: UserModel
    deleter?: UserModel
    boarder?: BoarderModel
    dataValues?: BoarderNoteModel
    _previousDataValues?: BoarderNoteModel
}

export default (sequelize: any, DataTypes: any) => {
    class BoarderNote
        extends Model<BoarderNoteModel>
        implements BoarderNoteModel
    {
        id!: number
        boarder_id!: string
        title!: string
        description!: string
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
            BoarderNote.belongsTo(models.boarder, {
                foreignKey: "boarder_id",
                as: "boarder",
            })
            BoarderNote.belongsTo(models.user, {
                foreignKey: "created_by",
                as: "creator",
            })
            BoarderNote.belongsTo(models.user, {
                foreignKey: "updated_by",
                as: "updater",
            })
            BoarderNote.belongsTo(models.user, {
                foreignKey: "deleted_by",
                as: "deleter",
            })
        }
    }
    BoarderNote.init(
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
            title: {
                type: DataTypes.STRING(50),
                allowNull: false,
                comment: "標題",
            },
            description: {
                type: DataTypes.STRING(1024),
                allowNull: false,
                comment: "描述",
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
            modelName: "boarder_note",
            timestamps: false,
            freezeTableName: true,
        }
    )
    return BoarderNote
}
