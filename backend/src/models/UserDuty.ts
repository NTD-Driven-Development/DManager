"use strict"
import { Model } from "sequelize"

interface UserDutyAttributes {
    id: number
    user_id: number
    start_date: Date
    end_date: Date
    created_at: Date
    created_by?: number
}

module.exports = (sequelize: any, DataTypes: any) => {
    class UserDuty extends Model<UserDutyAttributes> implements UserDutyAttributes {
        id!: number
        user_id!: number
        start_date!: Date
        end_date!: Date
        created_at!: Date
        created_by?: number

        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: any) {
            // define association here
            UserDuty.belongsTo(models.user, {
                foreignKey: "user_id",
                as: "user_duties",
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
            },
            start_date: {
                type: DataTypes.DATE,
                allowNull: false,
                comment: "起始時間",
            },
            end_date: {
                type: DataTypes.DATE,
                allowNull: false,
                comment: "結束時間",
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
            modelName: "user_duty",
            timestamps: false,
            freezeTableName: true,
        }
    )
    return UserDuty
}

export default UserDutyAttributes
