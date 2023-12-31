"use strict"
import moment from "moment"
import { Model } from "sequelize"
import { UserModel } from "./User"
import { BoarderModel } from "./Boarder"

export interface TelCardLogModel {
    id?: number
    boarder_id: string
    project_id: number
    tel_card_contacter_id: number
    contacted_at: Date
    remark?: string
    created_at?: Date
    created_by?: number
    creator?: UserModel
    updater?: UserModel
    deleter?: UserModel
    boarder?: BoarderModel
    dataValues?: TelCardLogModel
    _previousDataValues?: TelCardLogModel
}

export default (sequelize: any, DataTypes: any) => {
    class TelCardLog extends Model<TelCardLogModel> implements TelCardLogModel {
        id!: number
        boarder_id!: string
        project_id!: number
        tel_card_contacter_id!: number
        contacted_at!: Date
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
            TelCardLog.belongsTo(models.boarder, {
                foreignKey: "boarder_id",
                as: "boarder",
            })
            TelCardLog.belongsTo(models.project, {
                foreignKey: "project_id",
                as: "project",
            })
            TelCardLog.belongsTo(models.tel_card_contacter, {
                foreignKey: "tel_card_contacter_id",
                as: "tel_card_contacter",
            })
            TelCardLog.belongsTo(models.user, {
                foreignKey: "created_by",
                as: "creator",
            })
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
            contacted_at: {
                type: DataTypes.DATE,
                allowNull: false,
                comment: "聯絡時間",
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
