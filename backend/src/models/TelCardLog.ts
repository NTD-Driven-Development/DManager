"use strict"
import moment from "moment"
import { Model } from "sequelize"

export interface TelCardLogModel {
    id?: number
    boarder_id: string
    project_id: number
    tel_card_contacter_id: number
    remark?: string
    created_at?: Date
    created_by?: number
}

export default (sequelize: any, DataTypes: any) => {
    class TelCardLog extends Model<TelCardLogModel> implements TelCardLogModel {
        id!: number
        boarder_id!: string
        project_id!: number
        tel_card_contacter_id!: number
        remark?: string
        created_at?: Date
        created_by?: number

        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: any) {
            // define association here
        }
    }
    TelCardLog.init(
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
            project_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "項目編號",
                references: {
                    model: "project",
                    key: "id",
                },
            },
            tel_card_contacter_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "電話卡聯絡人ID",
                references: {
                    model: "tel_card_contacter",
                    key: "id",
                },
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
                defaultValue: moment().toDate(),
            },
            created_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: "建立者",
            },
        },
        {
            sequelize,
            modelName: "tel_card_log",
            timestamps: false,
            freezeTableName: true,
        }
    )
    return TelCardLog
}
