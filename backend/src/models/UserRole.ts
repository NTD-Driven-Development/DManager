"use strict"
import moment from "moment"
import { Model } from "sequelize"
import { UserModel } from "./User"

export interface UserRoleModel {
    id?: number
    user_id: number
    role_id: number
    created_at?: Date
    created_by?: number
    updated_at?: Date
    updated_by?: number
    creator?: UserModel
    updater?: UserModel
    dataValues?: UserRoleModel
    _previousDataValues?: UserRoleModel
}

export default (sequelize: any, DataTypes: any) => {
    class UserRole extends Model<UserRoleModel> implements UserRoleModel {
        id!: number
        user_id!: number
        role_id!: number
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
            UserRole.belongsTo(models.user, {
                foreignKey: "user_id",
                as: "user",
            })
            UserRole.belongsTo(models.role, {
                foreignKey: "role_id",
                as: "role",
            })
            UserRole.belongsTo(models.user, {
                foreignKey: "created_by",
                as: "creator",
            })
            UserRole.belongsTo(models.user, {
                foreignKey: "updated_by",
                as: "updater",
            })
        }
    }
    UserRole.init(
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
            role_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "角色編號",
                references: {
                    model: "role",
                    key: "id",
                },
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
        },
        {
            sequelize,
            modelName: "user_role",
            timestamps: false,
            freezeTableName: true,
        }
    )
    return UserRole
}
