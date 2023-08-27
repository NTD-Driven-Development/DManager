'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('sys_auth_log', {
            id: {
                autoIncrement: true,
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            type: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            clientip: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            serverip: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            user_agent: {
                type: Sequelize.STRING(200),
                allowNull: false
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            refresh_token: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            refresh_expired_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            status: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
            detail: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                comment: "建立時間",
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('sys_auth_log');
    }
};