"use strict"
import moment from "moment"
import { Model } from "sequelize"
import { UserModel } from "./User"

export interface PointRuleModel {
    id?: number
    code: string
    reason: string
    point: number
    is_actived: boolean
    created_at?: Date
    created_by?: number
    updated_at?: Date
    updated_by?: number
    deleted_at?: Date
    deleted_by?: number
    creator?: UserModel
    updater?: UserModel
    deleter?: UserModel
}

export default (sequelize: any, DataTypes: any) => {
    class PointRule extends Model<PointRuleModel> implements PointRuleModel {
        id!: number
        code!: string
        reason!: string
        point!: number
        is_actived!: boolean
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
            PointRule.belongsTo(models.user, {
                foreignKey: "created_by",
                as: "creator",
            })
            PointRule.belongsTo(models.user, {
                foreignKey: "updated_by",
                as: "updater",
            })
            PointRule.belongsTo(models.user, {
                foreignKey: "deleted_by",
                as: "deleter",
            })
        }
    }
    PointRule.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            code: {
                type: DataTypes.STRING(20),
                allowNull: false,
                comment: "代號",
            },
            reason: {
                type: DataTypes.STRING(50),
                allowNull: false,
                comment: "原因",
            },
            point: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "點數",
            },
            is_actived: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                comment: "是否啟用",
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
            modelName: "point_rule",
            timestamps: false,
            freezeTableName: true,
        }
    )
    return PointRule
}
