"use strict"
import moment from "moment"
import { Model } from "sequelize"

export interface SysPasswordLogModel {
    id?: number
    clientip: string
    serverip: string
    user_agent: string
    email: string
    detail?: string
    token?: string
    expired_at?: Date
    verified_token?: string
    verified_at?: Date
    created_at?: Date
}

export default (sequelize: any, DataTypes: any) => {
    class SysPasswordLog
        extends Model<SysPasswordLogModel>
        implements SysPasswordLogModel
    {
        id!: number
        clientip!: string
        serverip!: string
        user_agent!: string
        email!: string
        detail?: string
        token?: string
        expired_at?: Date
        verified_token?: string
        verified_at?: Date
        created_at?: Date

        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: any) {
            // define association here
        }
    }
    SysPasswordLog.init(
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
            user_agent: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            detail: {
                type: DataTypes.STRING(255),
                allowNull: true,
                comment: "詳細資料",
            },
            token: {
                type: DataTypes.STRING(255),
                allowNull: true,
                comment: "驗證碼",
            },
            expired_at: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "驗證碼過期時間",
            },
            verified_token: {
                type: DataTypes.STRING(255),
                allowNull: true,
                comment: "驗證成功後的 Token",
            },
            verified_at: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "驗證成功時間",
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "建立時間",
                defaultValue: moment().toDate(),
            },
        },
        {
            sequelize,
            modelName: "sys_password_log",
            timestamps: false,
            freezeTableName: true,
        }
    )
    return SysPasswordLog
}
