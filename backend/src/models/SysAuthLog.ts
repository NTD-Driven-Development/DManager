"use strict"
import { Model } from "sequelize"

interface SysAuthLogAttributes {
    id?: number
    type: string
    clientip: string
    serverip: string
    user_agent: string
    user_id?: number
    refresh_token: string
    refresh_expired_at: Date
    status: boolean
    detail?: string
    created_at: Date
}

module.exports = (sequelize: any, DataTypes: any) => {
    class SysAuthLog extends Model<SysAuthLogAttributes> implements SysAuthLogAttributes {
        id!: number
        type!: string
        clientip!: string
        serverip!: string
        user_agent!: string
        user_id?: number
        refresh_token!: string
        refresh_expired_at!: Date
        status!: boolean
        detail?: string
        created_at!: Date

        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: any) {
            // define association here
        }
    }
    SysAuthLog.init(
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            type: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            clientip: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            serverip: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            user_agent: {
                type: DataTypes.STRING(200),
                allowNull: false
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            refresh_token: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            refresh_expired_at: {
                type: DataTypes.DATE,
                allowNull: false
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
            detail: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: "sys_auth_log",
            timestamps: false,
            freezeTableName: true,
        }
    )
    return SysAuthLog
}

export default SysAuthLogAttributes
