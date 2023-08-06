'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('sys_error_log', {
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
            url: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            http_method: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            http_status: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            user_agent: {
                type: Sequelize.STRING(500),
                allowNull: false,
            },
            user_id: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            user_name: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            headers: {
                type: Sequelize.TEXT("long"),
                allowNull: true,
            },
            query: {
                type: Sequelize.TEXT("long"),
                allowNull: true,
            },
            params: {
                type: Sequelize.TEXT("long"),
                allowNull: true,
            },
            body: {
                type: Sequelize.TEXT("long"),
                allowNull: true,
            },
            detail: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('sys_error_log');
    }
};