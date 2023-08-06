'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('sys_login_log', {
            id: {
                autoIncrement: true,
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            type: {
                type: Sequelize.STRING(10),
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
                allowNull: false
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('sys_login_log');
    }
};