"use strict"
import moment from "moment"
import { Model } from "sequelize"
import { UserModel } from "./User"
import { BoarderModel } from "./Boarder"

export interface PointLogModel {
    id?: number
    boarder_id: string
    project_id: number
    point_rule_id: number
    point: number
    remark?: string
    created_at?: Date
    created_by?: number
    creator?: UserModel
    boarder?: BoarderModel
}

export default (sequelize: any, DataTypes: any) => {
    class PointLog extends Model<PointLogModel> implements PointLogModel {
        id!: number
        boarder_id!: string
        project_id!: number
        point_rule_id!: number
        point!: number
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
            PointLog.belongsTo(models.boarder, {
                foreignKey: "boarder_id",
            })
            PointLog.belongsTo(models.project, {
                foreignKey: "project_id",
            })
            PointLog.belongsTo(models.point_rule, {
                foreignKey: "point_rule_id",
            })
            PointLog.belongsTo(models.user, {
                foreignKey: "created_by",
                as: "creator",
            })
        }
    }
    PointLog.init(
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
            point_rule_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "點數規則ID",
                references: {
                    model: "point_rule",
                    key: "id",
                },
            },
            point: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "點數",
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
            modelName: "point_log",
            timestamps: false,
            freezeTableName: true,
        }
    )
    return PointLog
}
