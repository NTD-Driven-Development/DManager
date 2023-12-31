"use strict"
import moment from "moment"
import { Model } from "sequelize"
import { UserModel } from "./User"
import { ProjectModel } from "./Project"
import { ProjectBunkModel } from "./ProjectBunk"
import { BoarderStatusModel } from "./BoarderStatus"
import { ClassModel } from "./Class"
import { BoarderRoleModel } from "./BoarderRole"
import { PointLogModel } from "./PointLog"
import { TelCardLogModel } from "./TelCardLog"

export interface BoarderModel {
    id: string
    sid?: string
    project_id: number
    boarder_status_id: number
    name: string
    phone?: string
    class_id?: number
    birthday?: Date
    avatar?: string
    remark?: string
    access_card?: string
    created_at?: Date
    created_by?: number
    updated_at?: Date
    updated_by?: number
    deleted_at?: Date
    deleted_by?: number
    creator?: UserModel
    updater?: UserModel
    deleter?: UserModel
    project?: ProjectModel
    project_bunk?: ProjectBunkModel
    boarder_status?: BoarderStatusModel
    class?: ClassModel
    boarder_roles?: BoarderRoleModel[]
    point_logs?: PointLogModel[]
    tel_card_logs?: TelCardLogModel[]
    dataValues?: BoarderModel
    _previousDataValues?: BoarderModel
}

export default (sequelize: any, DataTypes: any) => {
    class Boarder extends Model<BoarderModel> implements BoarderModel {
        id!: string
        sid?: string
        project_id!: number
        boarder_status_id!: number
        name!: string
        phone?: string
        class_id?: number
        birthday?: Date
        avatar?: string
        remark?: string
        access_card?: string
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
            Boarder.belongsTo(models.project, {
                foreignKey: "project_id",
                as: "project",
            })
            Boarder.belongsTo(models.boarder_status, {
                foreignKey: "boarder_status_id",
                as: "boarder_status",
            })
            Boarder.belongsTo(models.class, {
                foreignKey: "class_id",
                as: "class",
            })
            Boarder.belongsToMany(models.boarder_role, {
                through: "boarder_mapping_role",
                foreignKey: "boarder_id",
                as: "boarder_roles",
            })
            Boarder.hasOne(models.project_bunk, {
                foreignKey: "boarder_id",
                as: "project_bunk",
            })
            Boarder.hasMany(models.point_log, {
                foreignKey: "boarder_id",
                as: "point_logs",
            })
            Boarder.hasMany(models.tel_card_log, {
                foreignKey: "boarder_id",
                as: "tel_card_logs",
            })
            Boarder.belongsTo(models.user, {
                foreignKey: "created_by",
                as: "creator",
            })
            Boarder.belongsTo(models.user, {
                foreignKey: "updated_by",
                as: "updater",
            })
            Boarder.belongsTo(models.user, {
                foreignKey: "deleted_by",
                as: "deleter",
            })
        }
    }
    Boarder.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                defaultValue: DataTypes.UUIDV4,
            },
            sid: {
                type: DataTypes.STRING(20),
                allowNull: true,
                comment: "學號",
            },
            project_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "項目編號",
                references: {
                    model: "project",
                    key: "id",
                },
            },
            name: {
                type: DataTypes.STRING(20),
                allowNull: false,
                comment: "姓名",
            },
            phone: {
                type: DataTypes.STRING(20),
                allowNull: true,
                comment: "電話",
            },
            class_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: "班級ID",
                references: {
                    model: "class",
                    key: "id",
                },
            },
            birthday: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "生日",
            },
            avatar: {
                type: DataTypes.TEXT("long"),
                allowNull: true,
                comment: "頭像",
            },
            remark: {
                type: DataTypes.STRING(1024),
                allowNull: true,
                comment: "備註",
            },
            access_card: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: "門禁卡號",
            },
            boarder_status_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "住宿狀態編號",
                references: {
                    model: "boarder_status",
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
            modelName: "boarder",
            timestamps: false,
            freezeTableName: true,
        }
    )
    return Boarder
}
