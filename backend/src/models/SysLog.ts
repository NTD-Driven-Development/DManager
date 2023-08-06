"use strict"
import { Model } from "sequelize"

interface SysLogAttributes {
    id?: number
    clientip: string
    serverip: string
    url: string
    http_method: string
    http_status: string
    user_agent: string
    user_id?: number
    user_name?: string
    headers?: string
    query?: string
    params?: string
    body?: string
    detail?: string
    created_at: Date
}

module.exports = (sequelize: any, DataTypes: any) => {
    class SysLog extends Model<SysLogAttributes> implements SysLogAttributes {
        id?: number
        clientip!: string
        serverip!: string
        url!: string
        http_method!: string
        http_status!: string
        user_agent!: string
        user_id?: number
        user_name?: string
        headers?: string
        query?: string
        params?: string
        body?: string
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
    SysLog.init(
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            clientip: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            serverip: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            url: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            http_method: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            http_status: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            user_agent: {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
            user_id: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            user_name: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            headers: {
                type: DataTypes.TEXT("long"),
                allowNull: true,
            },
            query: {
                type: DataTypes.TEXT("long"),
                allowNull: true,
            },
            params: {
                type: DataTypes.TEXT("long"),
                allowNull: true,
            },
            body: {
                type: DataTypes.TEXT("long"),
                allowNull: true,
            },
            detail: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "sys_log",
            timestamps: false,
            freezeTableName: true,
        }
    )
    return SysLog
}

export default SysLogAttributes
