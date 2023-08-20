require('dotenv').config();

module.exports = {
    "development": {
        "username": process.env.DB_USER,
        "password": process.env.DB_PASS,
        "database": process.env.DB_NAME,
        "host": process.env.DB_HOST,
        "dialect": process.env.DB_TYPE,
        "timezone": process.env.DB_TIMEZONE,
        "logging": false,
        "define": {
            "underscored": true,
            "charset": "utf8mb4",
            "collate": "utf8mb4_unicode_ci",
        },
    },
    "test": {
        "username": process.env.DB_USER,
        "password": process.env.DB_PASS,
        "database": process.env.DB_NAME,
        "host": process.env.DB_HOST,
        "dialect": process.env.DB_TYPE,
        "timezone": process.env.DB_TIMEZONE,
        "logging": true,
        "define": {
            "underscored": true,
            "charset": "utf8mb4",
            "collate": "utf8mb4_unicode_ci",
        },
    },
    "production": {
        "username": process.env.DB_USER,
        "password": process.env.DB_PASS,
        "database": process.env.DB_NAME,
        "host": process.env.DB_HOST,
        "dialect": process.env.DB_TYPE,
        "timezone": process.env.DB_TIMEZONE,
        "logging": true,
        "define": {
            "underscored": true,
            "charset": "utf8mb4",
            "collate": "utf8mb4_unicode_ci",
        },
    }
}
