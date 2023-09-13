"use strict"
import moment from "moment"
import { Model } from "sequelize"

export interface UserModel {
    id?: number
    sid?: string
    name: string
    email: string
    password: string
    is_admin?: boolean
    is_actived?: boolean
    remark?: string
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
    class User extends Model<UserModel> implements UserModel {
        id!: number
        sid?: string
        name!: string
        email!: string
        password!: string
        is_admin!: boolean
        is_actived!: boolean
        remark?: string
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
            User.belongsToMany(models.role, {
                through: "user_role",
                foreignKey: "user_id",
                as: "roles",
            })
            User.belongsTo(models.boarder, {
                foreignKey: "sid",
                as: "boarder",
            })
            User.belongsTo(models.user, {
                foreignKey: "created_by",
                as: "creator",
            })
            User.belongsTo(models.user, {
                foreignKey: "updated_by",
                as: "updater",
            })
            User.belongsTo(models.user, {
                foreignKey: "deleted_by",
                as: "deleter",
            })
        }
    }
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            sid: {
                type: DataTypes.STRING(20),
                allowNull: true,
                comment: "學號",
                references: {
                    model: "boarder",
                    key: "sid",
                },
            },
            name: {
                type: DataTypes.STRING(20),
                allowNull: false,
                comment: "姓名",
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
                comment: "帳號",
                unique: true,
            },
            password: {
                type: DataTypes.STRING(512),
                allowNull: false,
                comment: "密碼",
            },
            is_admin: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                comment: "是否為管理員",
                defaultValue: false,
            },
            is_actived: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                comment: "是否啟用",
                defaultValue: true,
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
            modelName: "user",
            timestamps: false,
            freezeTableName: true,
        }
    )
    return User
}
