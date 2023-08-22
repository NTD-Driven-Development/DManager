"use strict"
import { Model } from "sequelize"

interface PointLogAttributes {
    id?: number
    boarder_id: string
    project_id: number
    point_rule_id: number
    remark?: string
    created_at: Date
    created_by?: number
}

module.exports = (sequelize: any, DataTypes: any) => {
    class PointLog extends Model<PointLogAttributes> implements PointLogAttributes {
        id!: number
        boarder_id!: string
        project_id!: number
        point_rule_id!: number
        remark?: string
        created_at!: Date
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
            remark: {
                type: DataTypes.STRING(1024),
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

export default PointLogAttributes
