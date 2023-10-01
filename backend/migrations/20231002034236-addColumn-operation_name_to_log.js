'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('sys_log', 'operation_name', {
            type: Sequelize.STRING(100),
            allowNull: true,
        });
        await queryInterface.addColumn('sys_error_log', 'operation_name', {
            type: Sequelize.STRING(100),
            allowNull: true,
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('sys_log', 'operation_name');
        await queryInterface.removeColumn('sys_error_log', 'operation_name');
    }
};