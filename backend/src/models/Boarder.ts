"use strict"
import { Model } from "sequelize"

interface BoarderAttributes {
    id: number
    sid?: string
    project_id: number
    boarder_status_id: number
    name: string
    phone?: string
    class_id?: number
    birthday?: Date
    avatar?: string
    remark?: string
    access_card?: string
    created_at: Date
    created_by?: number
    updated_at?: Date
    updated_by?: number
    deleted_at?: Date
    deleted_by?: number
}

module.exports = (sequelize: any, DataTypes: any) => {
    class Boarder
        extends Model<BoarderAttributes>
        implements BoarderAttributes
    {
        id!: number
        sid?: string
        project_id!: number
        boarder_status_id!: number
        name!: string
        phone?: string
        class_id?: number
        birthday?: Date
        avatar?: string
        remark?: string
        access_card?: string
        created_at!: Date
        created_by?: number
        updated_at?: Date
        updated_by?: number
        

        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: any) {
            // define association here
        }
    }
    Boarder.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            sid: {
                type: DataTypes.STRING(20),
                allowNull: true,
                comment: "學號",
            },
            project_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "項目編號",
                references: {
                    model: "project",
                    key: "id",
                },
            },
            name: {
                type: DataTypes.STRING(20),
                allowNull: false,
                comment: "姓名",
            },
            phone: {
                type: DataTypes.STRING(20),
                allowNull: true,
                comment: "電話",
            },
            class_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: "班級ID",
                references: {
                    model: "class",
                    key: "id",
                },
            },
            birthday: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "生日",
            },
            avatar: {
                type: DataTypes.STRING(255),
                allowNull: true,
                comment: "頭像",
            },
            remark: {
                type: DataTypes.STRING(1024),
                allowNull: true,
                comment: "備註",
            },
            access_card: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: "門禁卡號",
            },
            boarder_status_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "住宿狀態編號",
                references: {
                    model: "boarder_status",
                    key: "id",
                },
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
            modelName: "boarder",
        }
    )
    return Boarder
}

export default BoarderAttributes
