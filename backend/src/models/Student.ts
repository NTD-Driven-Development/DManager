"use strict"
import { Model } from "sequelize"

interface StudentAttributes {
    sid: string
    name: string
    point: number
    phone: string
    user_id: number
    class_id: number
    is_live: boolean
    remark?: string
    created_at: Date
    created_by?: number
    updated_at?: Date
    updated_by?: number
}

module.exports = (sequelize: any, DataTypes: any) => {
    class Student
        extends Model<StudentAttributes>
        implements StudentAttributes
    {
        sid!: string
        name!: string
        point!: number
        phone!: string
        user_id!: number
        class_id!: number
        is_live!: boolean
        remark?: string
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
    Student.init(
        {
            sid: {
                type: DataTypes.STRING(25),
                primaryKey: true,
                allowNull: false,
                comment: "學號",
            },
            name: {
                type: DataTypes.STRING(20),
                allowNull: false,
                comment: "姓名",
            },
            point: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "點數",
            },
            phone: {
                type: DataTypes.STRING(20),
                allowNull: false,
                comment: "電話",
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "使用者ID",
            },
            class_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "班級ID",
            },
            is_live: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                comment: "是否為(住宿/非住宿)",
            },
            remark: {
                type: DataTypes.STRING(255),
                allowNull: true,
                comment: "備註",
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
            modelName: "student",
        }
    )
    return Student
}

export default StudentAttributes
