"use strict"
import moment from "moment"
import { Model } from "sequelize"

export interface PermissionModel {
    id?: number
    description: string
    method: string
    path: string
    is_actived: boolean
    created_at?: Date
    created_by?: number
    updated_at?: Date
    updated_by?: number
}

export default (sequelize: any, DataTypes: any) => {
    class Permission extends Model<PermissionModel> implements PermissionModel {
        id!: number
        description!: string
        method!: string
        path!: string
        is_actived!: boolean
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
            Permission.belongsToMany(models.role, {
                through: "role_permission",
                foreignKey: "permission_id",
                as: "roles",
            })
        }
    }
    Permission.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING(100),
                allowNull: false,
                comment: "描述",
            },
            method: {
                type: DataTypes.STRING(10),
                allowNull: false,
                comment: "HTTP Method",
            },
            path: {
                type: DataTypes.STRING(255),
                allowNull: false,
                comment: "Route Path",
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
        },
        {
            sequelize,
            modelName: "permission",
            timestamps: false,
            freezeTableName: true,
        }
    )
    return Permission
}
