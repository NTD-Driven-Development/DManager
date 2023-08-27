"use strict"
import moment from "moment"
import { Model } from "sequelize"

export interface BoarderMappingRoleModel {
    id?: number
    boarder_id: string
    boarder_role_id: number
    created_at?: Date
    created_by?: number
    updated_at?: Date
    updated_by?: number
}

export default (sequelize: any, DataTypes: any) => {
    class BoarderMappingRole
        extends Model<BoarderMappingRoleModel>
        implements BoarderMappingRoleModel
    {
        id!: number
        boarder_id!: string
        boarder_role_id!: number
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
            BoarderMappingRole.belongsTo(models.boarder_role, {
                foreignKey: "boarder_role_id",
            })
            BoarderMappingRole.belongsTo(models.boarder, {
                foreignKey: "boarder_id",
            })
        }
    }
    BoarderMappingRole.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            boarder_id: {
                type: DataTypes.UUID,
                allowNull: false,
                comment: "住宿生外鍵",
                references: {
                    model: "boarder",
                    key: "id",
                },
            },
            boarder_role_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "住宿生身分編號",
                references: {
                    model: "boarder_role",
                    key: "id",
                },
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
            modelName: "boarder_mapping_role",
            timestamps: false,
            freezeTableName: true,
        }
    )
    return BoarderMappingRole
}
