"use strict"
import { Model } from "sequelize"

interface RolePermissionAttributes {
    id?: number
    role_id: number
    permission_id: number
    is_active: boolean
    created_at: Date
    created_by?: number
    updated_at?: Date
    updated_by?: number
}

module.exports = (sequelize: any, DataTypes: any) => {
    class RolePermission
        extends Model<RolePermissionAttributes>
        implements RolePermissionAttributes
    {
        id?: number
        role_id!: number
        permission_id!: number
        is_active!: boolean
        created_at!: Date
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
        }
    }
    RolePermission.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            role_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "角色編號",
            },
            permission_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "權限編號",
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                comment: "是否啟用",
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
            modelName: "role_permission",
            timestamps: false,
            freezeTableName: true,
        }
    )
    return RolePermission
}

export default RolePermissionAttributes
