"use strict"
import moment from "moment"
import { Model } from "sequelize"
import { UserModel } from "./User"

export interface UserDutyModel {
    id: number
    user_id: number
    start_time: Date
    end_time: Date
    created_at?: Date
    created_by?: number
    updated_at?: Date
    updated_by?: number
    creator?: UserModel
}

export default (sequelize: any, DataTypes: any) => {
    class UserDuty extends Model<UserDutyModel> implements UserDutyModel {
        id!: number
        user_id!: number
        start_time!: Date
        end_time!: Date
        created_at?: Date
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
            UserDuty.belongsTo(models.user, {
                foreignKey: "user_id",
                as: "user",
            })
            UserDuty.belongsTo(models.user, {
                foreignKey: "created_by",
                as: "creator",
            })
            UserDuty.belongsTo(models.user, {
                foreignKey: "updated_by",
                as: "updater",
            })
        }
    }
    UserDuty.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "使用者編號",
                references: {
                    model: "user",
                    key: "id",
                },
            },
            start_time: {
                type: DataTypes.DATE,
                allowNull: false,
                comment: "起始時間",
            },
            end_time: {
                type: DataTypes.DATE,
                allowNull: false,
                comment: "結束時間",
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
        },
        {
            sequelize,
            modelName: "user_duty",
            timestamps: false,
            freezeTableName: true,
        }
    )
    return UserDuty
}
