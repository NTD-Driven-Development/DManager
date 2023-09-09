"use strict"

import fs from "fs"
import path from "path"
import { DataTypes, Sequelize, Transaction } from "sequelize"
import process from "process"
import cls from "cls-hooked"

const basename = path.basename(__filename)
const env = process.env.NODE_ENV || "development"
const config = require(__dirname + "/../../config/config.js")[env]
const db: any = {}
const namespace = cls.createNamespace('my-very-own-namespace');

Sequelize.useCLS(namespace);
let sequelize: Sequelize
if (config.use_env_variable) {
    sequelize = new Sequelize(
        process.env[config.use_env_variable] as any,
        config
    )
} else {
    sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        {
            ...config,
            isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
            pool: {
                max: 50,
                min: 0,
                idle: 10000
            },
        }
    )
}

fs.readdirSync(__dirname)
    .filter((file: any) => {
        return (
            file.indexOf(".") !== 0 &&
            file !== basename &&
            (file.slice(-3) === ".ts" || file.slice(-3) === ".js") &&
            file.indexOf(".test.js") === -1
        )
    })
    .forEach((file: any) => {
        // To ES6
        const model = require(path.join(__dirname, file)).default(
            sequelize,
            DataTypes
        )
        db[model.name] = model
    })

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

db.sequelize.options.logging = false

export default db
