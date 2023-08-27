"use strict"
import moment from "moment"
import { Model } from "sequelize"

export interface ProjectBunkModel {
    id: number
    boarder_id: string
    project_id: number
    floor: string
    room_type: string
    room_no: string
    bed: string
    remark?: string
    created_at?: Date
    created_by?: number
    updated_at?: Date
    updated_by?: number
}

export default (sequelize: any, DataTypes: any) => {
    class ProjectBunk
        extends Model<ProjectBunkModel>
        implements ProjectBunkModel
    {
        id!: number
        boarder_id!: string
        project_id!: number
        floor!: string
        room_type!: string
        room_no!: string
        bed!: string
        remark?: string
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
            ProjectBunk.belongsTo(models.project, {
                foreignKey: "project_id",
                as: "project",
            })
            ProjectBunk.belongsTo(models.boarder, {
                foreignKey: "boarder_id",
                as: "boarder",
            })
        }
    }
    ProjectBunk.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            boarder_id: {
                type: DataTypes.UUID,
                allowNull: true,
                comment: "住宿生外鍵",
                references: {
                    model: "boarder",
                    key: "id",
                },
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
            floor: {
                type: DataTypes.STRING(10),
                allowNull: false,
                comment: "樓層",
            },
            room_type: {
                type: DataTypes.STRING(10),
                allowNull: false,
                comment: "房型",
            },
            room_no: {
                type: DataTypes.STRING(10),
                allowNull: false,
                comment: "房號",
            },
            bed: {
                type: DataTypes.STRING(10),
                allowNull: false,
                comment: "床號",
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
        },
        {
            sequelize,
            modelName: "project_bunk",
            timestamps: false,
            freezeTableName: true,
            indexes: [
                {
                    unique: true,
                    fields: [
                        "project_id",
                        "floor",
                        "room_type",
                        "room_no",
                        "bed",
                    ],
                },
            ],
        }
    )
    return ProjectBunk
}
