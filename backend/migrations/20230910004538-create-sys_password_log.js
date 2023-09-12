'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('sys_password_log', {
            id: {
                autoIncrement: true,
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            clientip: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            serverip: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            user_agent: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            detail: {
                type: Sequelize.STRING(255),
                allowNull: true,
                comment: "詳細資料",
            },
            token: {
                type: Sequelize.STRING(255),
                allowNull: true,
                comment: "驗證碼",
            },
            expired_at: {
                type: Sequelize.DATE,
                allowNull: true,
                comment: "驗證碼過期時間",
            },
            verified_token: {
                type: Sequelize.STRING(255),
                allowNull: true,
                comment: "驗證成功後的 Token",
            },
            verified_at: {
                type: Sequelize.DATE,
                allowNull: true,
                comment: "驗證成功時間",
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                comment: "建立時間",
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('sys_password_log');
    }
};