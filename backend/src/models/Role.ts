"use strict"
import moment from "moment"
import { Model } from "sequelize"
import { UserModel } from "./User"

export interface RoleModel {
    id?: number
    name: string
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
    dataValues?: RoleModel
    _previousDataValues?: RoleModel
}

export default (sequelize: any, DataTypes: any) => {
    class Role extends Model<RoleModel> implements RoleModel {
        id!: number
        name!: string
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
            Role.belongsToMany(models.user, {
                through: "user_role",
                foreignKey: "role_id",
                as: "users",
            })
            Role.belongsToMany(models.permission, {
                through: "role_permission",
                foreignKey: "role_id",
                as: "permissions",
            })
            Role.belongsTo(models.user, {
                foreignKey: "created_by",
                as: "creator",
            })
            Role.belongsTo(models.user, {
                foreignKey: "updated_by",
                as: "updater",
            })
            Role.belongsTo(models.user, {
                foreignKey: "deleted_by",
                as: "deleter",
            })
        }
    }
    Role.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(50),
                allowNull: false,
                comment: "角色名稱",
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
            modelName: "role",
            timestamps: false,
            freezeTableName: true,
        }
    )
    return Role
}
