"use strict"
import { Model } from "sequelize"

interface BoarderAttributes {
    sid: string
    project_id: number
    floor: string
    room_type: string
    room_no: string
    bed: string
    boarder_role_id: number
    boarder_status_id: number
    name: string
    phone: string
    class_id: number
    birthday: Date
    avatar?: string
    remark?: string
    access_card?: string
    created_at: Date
    created_by?: number
    updated_at?: Date
    updated_by?: number
}

module.exports = (sequelize: any, DataTypes: any) => {
    class Boarder
        extends Model<BoarderAttributes>
        implements BoarderAttributes
    {
        sid!: string
        project_id!: number
        floor!: string
        room_type!: string
        room_no!: string
        bed!: string
        boarder_role_id!: number
        boarder_status_id!: number
        name!: string
        phone!: string
        class_id!: number
        birthday!: Date
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
            sid: {
                type: DataTypes.STRING(20),
                primaryKey: true,
                allowNull: false,
                comment: "學號",
            },
            project_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "期別ID",
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
            boarder_role_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "住宿身份ID",
            },
            boarder_status_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "住宿狀態ID",
            },
            name: {
                type: DataTypes.STRING(20),
                allowNull: false,
                comment: "姓名",
            },
            phone: {
                type: DataTypes.STRING(20),
                allowNull: false,
                comment: "電話",
            },
            class_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "班級ID",
            },
            birthday: {
                type: DataTypes.DATE,
                allowNull: false,
                comment: "生日",
            },
            avatar: {
                type: DataTypes.STRING(255),
                allowNull: true,
                comment: "頭像",
            },
            remark: {
                type: DataTypes.STRING(255),
                allowNull: true,
                comment: "備註",
            },
            access_card: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: "門禁卡號",
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
        },
        {
            sequelize,
            modelName: "boarder",
        }
    )
    return Boarder
}

export default BoarderAttributes