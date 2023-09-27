'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn('sys_log', 'user_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        await queryInterface.changeColumn('sys_error_log', 'user_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn('sys_log', 'user_id', {
            type: Sequelize.STRING(255),
            allowNull: true,
        });
        await queryInterface.changeColumn('sys_error_log', 'user_id', {
            type: Sequelize.STRING(255),
            allowNull: true,
        });
    }
};