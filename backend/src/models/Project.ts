"use strict"
import moment from "moment"
import { Model } from "sequelize"
import { UserModel } from "./User"

export interface ProjectModel {
    id?: number
    name: string
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
    class Project extends Model<ProjectModel> implements ProjectModel {
        id!: number
        name!: string
        string?: string
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
            Project.hasMany(models.project_bunk, {
                foreignKey: "project_id",
                as: "project_bunks",
            })
            Project.belongsTo(models.user, {
                foreignKey: "created_by",
                as: "creator",
            })
            Project.belongsTo(models.user, {
                foreignKey: "updated_by",
                as: "updater",
            })
            Project.belongsTo(models.user, {
                foreignKey: "deleted_by",
                as: "deleter",
            })
        }
    }
    Project.init(
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
                comment: "項目名稱",
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
            modelName: "project",
            timestamps: false,
            freezeTableName: true,
        }
    )
    return Project
}
