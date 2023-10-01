"use strict"
import moment from "moment"
import { Model } from "sequelize"
import { UserModel } from "./User"

export interface RolePermissionModel {
    id?: number
    role_id: number
    permission_id: number
    is_actived: boolean
    created_at?: Date
    created_by?: number
    updated_at?: Date
    updated_by?: number
    creator?: UserModel
    updater?: UserModel
    dataValues?: RolePermissionModel
    _previousDataValues?: RolePermissionModel
}

export default (sequelize: any, DataTypes: any) => {
    class RolePermission
        extends Model<RolePermissionModel>
        implements RolePermissionModel
    {
        id!: number
        role_id!: number
        permission_id!: number
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
            RolePermission.belongsTo(models.user, {
                foreignKey: "created_by",
                as: "creator",
            })
            RolePermission.belongsTo(models.user, {
                foreignKey: "updated_by",
                as: "updater",
            })
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
                references: {
                    model: "role",
                    key: "id",
                },
            },
            permission_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "權限編號",
                references: {
                    model: "permission",
                    key: "id",
                },
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
