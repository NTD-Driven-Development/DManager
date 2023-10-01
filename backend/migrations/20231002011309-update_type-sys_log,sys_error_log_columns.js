'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn('sys_log', 'detail', {
            type: Sequelize.TEXT('long'),
            allowNull: true,
        });
        await queryInterface.changeColumn('sys_error_log', 'detail', {
            type: Sequelize.TEXT('long'),
            allowNull: true,
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn('sys_log', 'detail', {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.changeColumn('sys_error_log', 'detail', {
            type: Sequelize.TEXT,
            allowNull: true,
        });
    }
};